import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ────────────────────────────────────────────────────────────

export type CartItem = {
  rnbpNumber: string; // identifiant RNBP du bien
  itemName: string;   // nom du bien (ex: "Tracteur à gazon")
  productName?: string; // nom du produit (ex: "Feuille de 20 autocollants...")
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (rnbpNumber: string) => void;
  updateQuantity: (rnbpNumber: string, quantity: number) => void;
  updateRnbpNumber: (oldRnbpNumber: string, newRnbpNumber: string) => void;
  clearCart: () => void;
  cartCount: number;
};

// ── Storage ──────────────────────────────────────────────────────────

const STORAGE_KEY = "rnbp_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items: CartItem[] = JSON.parse(raw);
    // Nettoyage : retirer les items "generic" ou "pending:" orphelins (ancienne logique)
    const cleaned = items.filter((i) => i.rnbpNumber !== "generic" && !i.rnbpNumber.startsWith("pending:"));
    if (cleaned.length !== items.length) saveCart(cleaned);
    return cleaned;
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// ── Context ──────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.rnbpNumber === item.rnbpNumber);
        const next = existing
          ? prev.map((i) =>
              i.rnbpNumber === item.rnbpNumber
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i,
            )
          : [...prev, { ...item, quantity: item.quantity ?? 1 }];
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback(
    (rnbpNumber: string) => {
      setCart((prev) => {
        const next = prev.filter((i) => i.rnbpNumber !== rnbpNumber);
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (rnbpNumber: string, quantity: number) => {
      if (quantity < 1) return removeItem(rnbpNumber);
      setCart((prev) => {
        const next = prev.map((i) =>
          i.rnbpNumber === rnbpNumber ? { ...i, quantity } : i,
        );
        saveCart(next);
        return next;
      });
    },
    [removeItem],
  );

  const updateRnbpNumber = useCallback(
    (oldRnbpNumber: string, newRnbpNumber: string) => {
      setCart((prev) => {
        const next = prev.map((i) =>
          i.rnbpNumber === oldRnbpNumber ? { ...i, rnbpNumber: newRnbpNumber } : i,
        );
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, updateRnbpNumber, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
