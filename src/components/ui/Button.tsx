import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "outline";
  size?: "sm" | "lg";
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "lg",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "rounded-xl font-medium transition-colors";

  const sizes = {
    sm: "px-6 py-2 text-sm",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary:
      "bg-[var(--rcb-primary)] text-white hover:bg-[var(--rcb-primary-dark)]",
    outline:
      "border border-[var(--rcb-primary)] bg-[var(--rcb-bg)] text-[var(--rcb-text-strong)] hover:bg-[var(--rcb-red-light)] hover:text-black",
  };

  return (
    <button
      type="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
