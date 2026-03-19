import type { ReactNode } from "react";

/**
 * Reusable Tabs component.
 *
 * CONVENTION — Fixed width FR/EN:
 * Tabs must have a fixed width (`minWidth`) so the UI doesn't shift
 * when switching between French and English. Pass `minWidth` (in px)
 * based on the longest language (usually French).
 */

export type TabItem<T extends string = string> = {
  key: T;
  label: string;
};

type TabsProps<T extends string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  children: ReactNode;
  /** Fixed min-width for each tab in px (use widest language). */
  tabMinWidth?: number;
  className?: string;
};

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  children,
  tabMinWidth,
  className = "",
}: TabsProps<T>) {
  return (
    <div className={className}>
      <div role="tablist" className="inline-flex gap-0 border-b border-[var(--rcb-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            id={`tab-${tab.key}`}
            aria-selected={activeTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            onClick={() => onChange(tab.key)}
            style={tabMinWidth ? { minWidth: `${tabMinWidth}px` } : undefined}
            className={`cursor-pointer border-b-2 px-5 py-3 text-sm font-medium transition-colors sm:text-base ${
              activeTab === tab.key
                ? "border-[var(--rcb-primary)] text-[var(--rcb-primary)]"
                : "border-transparent text-[var(--rcb-gray-dark)] hover:border-[var(--rcb-gray-dark)] hover:text-[var(--rcb-text-strong)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-8"
      >
        {children}
      </div>
    </div>
  );
}
