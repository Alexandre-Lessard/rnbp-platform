import type { NavItem } from "../../types/content";

type NavbarProps = {
  items: NavItem[];
};

function ChevronDown() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Navbar({ items }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d4dde7] bg-[var(--rcb-header)]/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-6 py-3">
        <a href="#accueil" className="shrink-0">
          <img src="/assets/logo-rcdb.png" alt="RCDB" className="h-10" />
        </a>

        <nav className="hidden items-center gap-9 text-[1.1rem] font-medium text-slate-900 lg:flex">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 transition-colors hover:text-[var(--rcb-primary)]"
            >
              {item.label}
              {item.withChevron ? <ChevronDown /> : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-xl border border-[var(--rcb-primary)] bg-white px-6 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-[var(--rcb-primary-light)]"
          >
            Partenaires
          </button>
          <button
            type="button"
            className="rounded-xl bg-[var(--rcb-primary)] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
          >
            Connexion
          </button>
        </div>
      </div>
      <nav className="section-shell flex items-center gap-4 overflow-x-auto py-3 text-sm font-medium lg:hidden">
        {items.map((item) => (
          <a key={item.label} href={item.href} className="shrink-0 text-slate-700">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
