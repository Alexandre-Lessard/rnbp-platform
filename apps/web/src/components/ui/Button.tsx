import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getButtonClasses } from "@/lib/button-styles";

/**
 * Reusable Button component.
 *
 * CONVENTION — Fixed width FR/EN:
 * Buttons visible in both languages must have a fixed width
 * (via `style={{ minWidth }}` or className `min-w-[Xpx]`) based on the
 * longest language (usually French) so the UI doesn't jump
 * on language switch. Also apply on <Link> via getButtonClasses.
 */

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
