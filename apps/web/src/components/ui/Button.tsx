import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getButtonClasses } from "@/lib/button-styles";

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
  return (
    <button
      type="button"
      className={getButtonClasses(variant, size, `cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`)}
      {...props}
    >
      {children}
    </button>
  );
}
