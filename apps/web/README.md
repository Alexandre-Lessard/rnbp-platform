# @rnbp/web — Frontend

React web application for the National Registry of Personal Property.

## Stack

React 19, Vite 6, Tailwind CSS 4, React Router 7.

## Local setup

```bash
# Optional: configure the API URL
# Default: http://localhost:3000/api
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Start in dev mode
pnpm dev
```

Available at `http://localhost:5173`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API URL |

## Routes

### Public

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Home page (hero, FAQ, CTA) |
| `/connexion` | `LoginPage` | Login |
| `/inscription` | `RegisterAccountPage` | Account creation |
| `/enregistrer` | `RegisterItemPage` | Item registration (multi-step form) |
| `/verifier` | `LookupPage` | Public lookup by RNBP number |
| `/faq` | `FaqPage` | Frequently asked questions |
| `/contact` | `ContactPage` | Contact form |
| `/boutique` | `BoutiquePage` | Store (stickers) |
| `/boutique/succes` | `BoutiqueSuccessPage` | Post-purchase confirmation |
| `/registry` | `PartnerPage` | Browse the registry (citizen, police, insurance tabs) |
| `/confidentialite` | `PrivacyPolicyPage` | Privacy policy |
| `/conditions` | `TermsOfServicePage` | Terms of service |
| `/verifier-courriel` | `VerifyEmailPage` | Email verification |
| `/verification-en-attente` | `EmailPendingPage` | Pending email verification |

### Protected (require authentication)

| Path | Component | Description |
|------|-----------|-------------|
| `/tableau-de-bord` | `DashboardPage` | User dashboard |
| `/modifier/:id` | `EditItemPage` | Edit an item |
| `/declarer-vol` | `ReportTheftPage` | Theft report |

### Admin (require `isAdmin`)

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/commandes` | `AdminOrdersPage` | Order list |
| `/admin/commandes/:id` | `AdminOrderDetailPage` | Order detail + RNBP assignment |

## Structure

```
src/
├── components/
│   ├── auth/           # ProtectedRoute, AdminRoute, ServiceUnavailable
│   ├── layout/         # Navbar, Footer
│   ├── sections/       # Landing page sections
│   ├── registration/   # Registration form steps
│   ├── ui/             # Button, Tabs, Modal, LanguageSwitcher
│   └── icons/          # SVG icons as components
├── i18n/
│   ├── context.tsx     # Language provider + detection
│   └── locales/        # FR and EN translations
├── lib/
│   ├── api-client.ts   # HTTP client for the API
│   ├── auth-context.tsx # Authentication context
│   ├── cart-context.tsx # Cart (localStorage, Stripe checkout)
│   └── button-styles.ts # Shared button styles
├── routes/             # Pages (one per route)
├── types/              # TypeScript types (SiteContent)
├── App.tsx             # Router configuration
├── main.tsx            # Entry point
└── index.css           # CSS variables + global styles
```

## i18n system

The application is bilingual (FR / EN). Translations cover all static content, including the privacy policy and terms of service.

### How to add translations

1. Add the key to the `SiteContent` type (`src/types/content.ts`)
2. Add the translation in `src/i18n/locales/fr.ts`
3. Add the translation in `src/i18n/locales/en.ts`
4. Use in a component: `const { t } = useLanguage();`

### Language detection

Priority order:
1. **localStorage** — Explicit user choice
2. **Hostname** — `rnbp.ca` → FR, `nrpp.ca` → EN
3. **Browser** — `navigator.language`
4. **Default** — FR

The language toggle is instant (no reload, no domain change).

## Dual-domain strategy

| Domain | Default language | Usage |
|--------|-----------------|-------|
| `rnbp.ca` | French | Quebec market |
| `nrpp.ca` | English | English-speaking Canadian market |

Both domains serve the same application. The logo follows the active language (not the domain). The `hreflang` tags in `index.html` allow Google to index each domain in the correct language.

## Design system

### CSS variables (`--rcb-*`)

```css
--rcb-primary: #D80621        /* Primary red */
--rcb-primary-dark: #8b0415   /* Dark red (hover) */
--rcb-navy: #232b37           /* Navy blue (strong text) */
--rcb-surface: #f5f5f5        /* Light gray background */
--rcb-text-body: #555555      /* Body text (WCAG AA) */
--rcb-text-muted: #666666     /* Secondary text (WCAG AA) */
```

### Button component

```tsx
import { Button } from "@/components/ui/Button";

<Button variant="primary" size="lg">Register</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

Variants: `primary` (red), `outline` (border).
Sizes: `sm`, `lg` (default).

### Tabs component

```tsx
import { Tabs, type TabItem } from "@/components/ui/Tabs";

const tabs: TabItem<"citizen" | "police" | "insurer">[] = [
  { key: "citizen", label: "Citizens" },
  { key: "police", label: "Police services" },
  { key: "insurer", label: "Insurance companies" },
];

<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} tabMinWidth={215}>
  {/* active tab content */}
</Tabs>
```

Generic (`<T extends string>`), full ARIA support (`role="tablist"`, `aria-selected`).
`tabMinWidth` prop for fixed bilingual width (see convention below).

### Modal component

```tsx
import { Modal } from "@/components/ui/Modal";

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Title">
  {/* content */}
</Modal>
```

Closes on Escape or overlay click. Body scroll is locked when open. Auto-focuses the first field on open.

### Fixed width FR/EN convention

Bilingual interactive elements (buttons, tabs, button-styled links) must have a fixed width based on the longest language (usually French). Apply via `style={{ minWidth: Xpx }}` or `tabMinWidth` on `<Tabs>`. This prevents the UI from "jumping" when switching languages.

### For `<a>` or `<Link>` styled as buttons

```tsx
import { getButtonClasses } from "@/lib/button-styles";

<Link to="/inscription" className={getButtonClasses("primary", "lg")}>
  Sign up
</Link>
```
