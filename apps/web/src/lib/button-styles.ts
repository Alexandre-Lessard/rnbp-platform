export const buttonStyles = {
  base: "rounded-xl font-medium transition-colors inline-block text-center",
  sizes: {
    sm: "px-6 py-2 text-sm",
    lg: "px-8 py-4 text-lg",
  },
  variants: {
    primary:
      "bg-[var(--rcb-primary)] text-white hover:bg-[var(--rcb-primary-dark)]",
    outline:
      "border border-[var(--rcb-primary)] bg-[var(--rcb-bg)] text-[var(--rcb-text-strong)] hover:bg-[var(--rcb-red-light)] hover:text-black",
  },
} as const;

export function getButtonClasses(
  variant: "primary" | "outline" = "primary",
  size: "sm" | "lg" = "lg",
  className = "",
) {
  return `${buttonStyles.base} ${buttonStyles.sizes[size]} ${buttonStyles.variants[variant]} ${className}`.trim();
}
