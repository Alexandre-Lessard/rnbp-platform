import { useState } from "react";

type ItemImageProps = {
  src: string | null | undefined;
  alt: string;
  className: string;
  fallbackClassName?: string;
  iconClassName?: string;
};

export function ItemImage({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName = "h-12 w-12 text-[var(--rcb-border)]",
}: ItemImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = !!src && failedSrc === src;

  if (!src || hasError) {
    return (
      <div className={fallbackClassName ?? className}>
        <svg
          className={iconClassName}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
