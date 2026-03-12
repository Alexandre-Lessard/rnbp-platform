import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getButtonClasses } from "@/lib/button-styles";

/**
 * Reusable Button component.
 *
 * CONVENTION — Largeur fixe FR/EN :
 * Les boutons visibles dans les deux langues doivent avoir une largeur fixe
 * (via `style={{ minWidth }}` ou className `min-w-[Xpx]`) basée sur la langue
 * la plus longue (généralement le français) pour que l'UI ne bouge pas
 * au changement de langue. Appliquer aussi sur les <Link> via getButtonClasses.
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
