import { type ReactNode, useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // Focus first focusable element inside the modal
    requestAnimationFrame(() => {
      const el = contentRef.current?.querySelector<HTMLElement>(
        "input:not([type=hidden]):not([tabindex='-1']), textarea, select, button:not([aria-label='Close'])",
      );
      el?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div ref={contentRef} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[var(--rcb-bg)] p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          {title && (
            <h2 className="text-xl font-semibold text-[var(--rcb-text-strong)]">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--rcb-text-muted)] transition-colors hover:bg-[var(--rcb-surface)] hover:text-[var(--rcb-text-strong)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
