# Registre canadien des biens - Landing V1

Landing page marketing en React + Vite + Tailwind (TypeScript), conçue pour un déploiement Cloudflare Pages.

## Stack

- React 19
- Vite 6
- Tailwind CSS 4
- TypeScript 5
- ESLint 9
- Wrangler 4

## Démarrage local

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm run lint
npm run build
```

## Déployer sur Cloudflare Pages

1. Créer un projet Cloudflare Pages (ex: `rcdb-landing`).
2. Auth Wrangler:

```bash
npx wrangler login
```

3. Déployer:

```bash
CF_PAGES_PROJECT=rcdb-landing npm run deploy
```

Optionnel:

```bash
CF_PAGES_PROJECT=rcdb-landing CF_PAGES_BRANCH=main npm run deploy
```

## Notes

- Cette V1 est entièrement hardcodée (sans backend).
- Les assets proviennent du dossier source fourni par l'équipe.
