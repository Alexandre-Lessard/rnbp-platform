# @rnbp/web — Frontend

Application web React pour le Registre national des biens personnels.

## Stack

React 19, Vite 6, Tailwind CSS 4, React Router 7.

## Setup local

```bash
# Optionnel : configurer l'URL de l'API
# Par défaut : http://localhost:3000/api
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Lancer en dev
pnpm dev
```

Accessible sur `http://localhost:5173`.

## Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | URL de l'API backend |

## Routes

### Publiques

| Path | Composant | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Page d'accueil (hero, FAQ, CTA) |
| `/connexion` | `LoginPage` | Connexion |
| `/inscription` | `RegisterAccountPage` | Création de compte |
| `/enregistrer` | `RegisterItemPage` | Enregistrement d'un bien (formulaire multi-étapes) |
| `/verifier` | `LookupPage` | Vérification publique par numéro RNBP |
| `/faq` | `FaqPage` | Foire aux questions |
| `/contact` | `ContactPage` | Formulaire de contact |
| `/boutique` | `BoutiquePage` | Boutique (autocollants) |
| `/boutique/succes` | `BoutiqueSuccessPage` | Confirmation post-achat |
| `/registry` | `PartnerPage` | Consulter le registre (onglets citoyen, police, assurance) |
| `/confidentialite` | `PrivacyPolicyPage` | Politique de confidentialité |
| `/conditions` | `TermsOfServicePage` | Conditions d'utilisation |
| `/verifier-courriel` | `VerifyEmailPage` | Vérification du courriel |
| `/verification-en-attente` | `EmailPendingPage` | Vérification du courriel en attente |

### Protégées (requièrent authentification)

| Path | Composant | Description |
|------|-----------|-------------|
| `/tableau-de-bord` | `DashboardPage` | Tableau de bord utilisateur |
| `/modifier/:id` | `EditItemPage` | Modification d'un bien |
| `/declarer-vol` | `ReportTheftPage` | Déclaration de vol |

### Admin (requièrent `isAdmin`)

| Path | Composant | Description |
|------|-----------|-------------|
| `/admin/commandes` | `AdminOrdersPage` | Liste des commandes |
| `/admin/commandes/:id` | `AdminOrderDetailPage` | Détail commande + assignation RNBP |

## Structure

```
src/
├── components/
│   ├── auth/           # ProtectedRoute, AdminRoute, ServiceUnavailable
│   ├── layout/         # Navbar, Footer
│   ├── sections/       # Sections de la landing page
│   ├── registration/   # Étapes du formulaire d'enregistrement
│   ├── ui/             # Button, Tabs, Modal, LanguageSwitcher
│   └── icons/          # Icônes SVG en composants
├── i18n/
│   ├── context.tsx     # Provider de langue + détection
│   └── locales/        # Traductions FR et EN
├── lib/
│   ├── api-client.ts   # Client HTTP pour l'API
│   ├── auth-context.tsx # Contexte d'authentification
│   ├── cart-context.tsx # Panier (localStorage, Stripe checkout)
│   └── button-styles.ts # Styles partagés des boutons
├── routes/             # Pages (une par route)
├── types/              # Types TypeScript (SiteContent)
├── App.tsx             # Configuration du routeur
├── main.tsx            # Point d'entrée
└── index.css           # Variables CSS + styles globaux
```

## Système i18n

L'application est bilingue (FR / EN). Les traductions couvrent tout le contenu statique, y compris la politique de confidentialité et les conditions d'utilisation.

### Comment ajouter des traductions

1. Ajouter la clé dans le type `SiteContent` (`src/types/content.ts`)
2. Ajouter la traduction dans `src/i18n/locales/fr.ts`
3. Ajouter la traduction dans `src/i18n/locales/en.ts`
4. Utiliser dans un composant : `const { t } = useLanguage();`

### Détection de la langue

Ordre de priorité :
1. **localStorage** — Choix explicite de l'utilisateur
2. **Hostname** — `rnbp.ca` → FR, `nrpp.ca` → EN
3. **Navigateur** — `navigator.language`
4. **Défaut** — FR

Le toggle de langue est instantané (pas de reload, pas de changement de domaine).

## Stratégie bi-domaine

| Domaine | Langue par défaut | Usage |
|---------|-------------------|-------|
| `rnbp.ca` | Français | Marché québécois |
| `nrpp.ca` | Anglais | Marché canadien anglophone |

Les deux domaines servent la même application. Le logo suit la langue active (pas le domaine). Les balises `hreflang` dans `index.html` permettent à Google d'indexer chaque domaine dans la bonne langue.

## Design system

### Variables CSS (`--rcb-*`)

```css
--rcb-primary: #D80621        /* Rouge principal */
--rcb-primary-dark: #8b0415   /* Rouge foncé (hover) */
--rcb-navy: #232b37           /* Bleu marine (texte fort) */
--rcb-surface: #f5f5f5        /* Fond gris clair */
--rcb-text-body: #555555      /* Texte courant (WCAG AA) */
--rcb-text-muted: #666666     /* Texte secondaire (WCAG AA) */
```

### Composant Button

```tsx
import { Button } from "@/components/ui/Button";

<Button variant="primary" size="lg">Enregistrer</Button>
<Button variant="outline" size="sm">Annuler</Button>
```

Variantes : `primary` (rouge), `outline` (bordure).
Tailles : `sm`, `lg` (défaut).

### Pour les `<a>` ou `<Link>` stylés en bouton

```tsx
import { getButtonClasses } from "@/lib/button-styles";

<Link to="/inscription" className={getButtonClasses("primary", "lg")}>
  S'inscrire
</Link>
```
