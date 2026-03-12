/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ────────────────────────────────────────────────────────────

export type CartItem = {
  itemId: string;       // UUID de l'item (ou "pending:<nom>" temporaire)
  itemName: string;     // nom du bien (ex: "Tracteur à gazon")
  productName?: string; // nom du produit (ex: "Feuille de 20 autocollants...")
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemId: (oldItemId: string, newItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
};

// ── Storage ──────────────────────────────────────────────────────────

const STORAGE_KEY = "rnbp_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Migration : convertir les anciens items (rnbpNumber → itemId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned = (parsed as any[])
      .map((i) => ({
        itemId: i.itemId || "",
        itemName: i.itemName || "",
        productName: i.productName,
        quantity: i.quantity || 1,
      }))
      .filter((i) => i.itemId);
    if (cleaned.length !== parsed.length) saveCart(cleaned);
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
        const existing = prev.find((i) => i.itemId === item.itemId);
        const next = existing
          ? prev.map((i) =>
              i.itemId === item.itemId
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
    (itemId: string) => {
      setCart((prev) => {
        const next = prev.filter((i) => i.itemId !== itemId);
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 1) return removeItem(itemId);
      setCart((prev) => {
        const next = prev.map((i) =>
          i.itemId === itemId ? { ...i, quantity } : i,
        );
        saveCart(next);
        return next;
      });
    },
    [removeItem],
  );

  const updateItemId = useCallback(
    (oldItemId: string, newItemId: string) => {
      setCart((prev) => {
        const next = prev.map((i) =>
          i.itemId === oldItemId ? { ...i, itemId: newItemId } : i,
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
      value={{ cart, addItem, removeItem, updateQuantity, updateItemId, clearCart, cartCount }}
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
