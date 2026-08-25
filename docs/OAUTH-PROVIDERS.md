# OAuth Providers — Configuration & Production Checklist

> **State as of 2026-08-25.** Both provider sections below have now been re-verified against
> their consoles. Facebook was corrected on 2026-08-24, Google on 2026-08-25.
>
> The Google section as written before 2026-08-25 was wrong in almost every line: it described a
> published, verified app awaiting a Trust & Safety review, with two OAuth clients and a
> `tech@rnbp.ca` support address. The console held none of that. The app was still in **Test**
> mode with zero test users — meaning nobody at all could sign in with Google — the consent
> screen carried no home page, no privacy link, no terms link and no authorized domain, and the
> project owned **no OAuth client**. The client ID sitting in `apps/web/.env.development` pointed
> at a project number (`849229135087`) that belongs to no project on this account. No manual
> review had ever been submitted. Everything below was rebuilt from scratch on 2026-08-25.

This document captures everything needed to configure and ship the OAuth sign-in providers (Google, Facebook, Microsoft) to public production. It is written so a future maintainer can pick it up cold without re-discovering every console URL and form field.

## Provider status

| Provider | Status | Action owner |
|---|---|---|
| Google | **Live.** Consent screen published, no verification required (non-sensitive scopes, no logo) | — |
| Facebook | Unpublished. Business verification done; blocked on the annual data access renewal (due 2026-10-23) | Alexandre |
| Microsoft | Code wired but disabled in production (no `VITE_MICROSOFT_CLIENT_ID` set) | Post-launch |

## Code touchpoints

| Concern | File |
|---|---|
| Frontend OAuth flow (PKCE, state, redirect) | [apps/web/src/lib/oauth.ts](../apps/web/src/lib/oauth.ts) |
| Frontend buttons (provider availability) | [apps/web/src/components/auth/OAuthButtons.tsx](../apps/web/src/components/auth/OAuthButtons.tsx) |
| OAuth callback page | [apps/web/src/pages/OAuthCallbackPage.tsx](../apps/web/src/pages/OAuthCallbackPage.tsx) |
| Backend token exchange | [apps/worker/src/utils/oauth.ts](../apps/worker/src/utils/oauth.ts) |
| Backend routes | [apps/worker/src/routes/oauth.ts](../apps/worker/src/routes/oauth.ts) |
| User schema (provider IDs) | [apps/worker/src/db/schema.ts](../apps/worker/src/db/schema.ts) (`googleId`, `facebookId`, `microsoftId`) |
| Privacy policy disclosure | [apps/web/src/i18n/locales/fr.ts](../apps/web/src/i18n/locales/fr.ts) + [en.ts](../apps/web/src/i18n/locales/en.ts) (`legal.privacyContent` section #4) |
| Account deletion procedure | [apps/web/src/pages/DataDeletionPage.tsx](../apps/web/src/pages/DataDeletionPage.tsx) |
| Privacy declaration (W3C) | [apps/web/src/root.tsx](../apps/web/src/root.tsx) — `<link rel="privacy-policy">` |

## Data we receive and store

OAuth providers return more than we keep. We deliberately store the **strict minimum** required for authentication and account identification.

| Field | Google | Facebook | Microsoft | Stored in DB |
|---|---|---|---|---|
| Provider unique ID (`sub` / `id`) | ✅ | ✅ | ✅ | `users.googleId` / `facebookId` / `microsoftId` |
| Email | ✅ | ✅ | ✅ | `users.email` |
| Email verified | ✅ | ✅ | ✅ | `users.emailVerified` |
| First name | ✅ | ✅ | ✅ | `users.firstName` |
| Last name | ✅ | ✅ | ✅ | `users.lastName` |
| Profile photo, contacts, calendar, friends, posts, etc. | ❌ Not requested | ❌ Not requested | ❌ Not requested | — |

This list is reflected in [the privacy policy section #4](../apps/web/src/i18n/locales/fr.ts) (`legal.privacyContent` — "Connexion via fournisseurs tiers (OAuth)").

---

## Google

Verified against the console on 2026-08-25. Google sign-in works in production and in local dev;
nothing is pending on Google's side.

### Console links

- Cloud Console (project): https://console.cloud.google.com/ — project **Badge**, ID `rnbp-ca`
- Branding (consent screen): https://console.cloud.google.com/auth/branding?project=rnbp-ca
- Audience (publishing status): https://console.cloud.google.com/auth/audience?project=rnbp-ca
- Clients (OAuth client IDs): https://console.cloud.google.com/auth/clients?project=rnbp-ca
- Data access (scopes): https://console.cloud.google.com/auth/scopes?project=rnbp-ca

The project **display name** is `Badge`; the project **ID** stays `rnbp-ca` because a Google Cloud
project ID is immutable. That ID is an admin-only string — it never reaches a user — so it is not
worth a new project and a fresh verification cycle. Project number: `812153749723`.

### Configuration checklist

| Item | Value (verified 2026-08-25) |
|---|---|
| Project display name / ID / number | `Badge` / `rnbp-ca` / `812153749723` |
| App name shown on the consent screen | **Badge** |
| Publishing status | **In production** |
| User type | External |
| Scopes | `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile` — all non-sensitive |
| User support email | `alexandre.lessard92@gmail.com` — see the constraint below |
| Developer contact | `info@badgeid.ca` |
| App logo | **none, deliberately** — see below |
| Application home page | `https://badgeid.ca/` |
| Application privacy policy link | `https://badgeid.ca/privacy` |
| Application terms of service link | `https://badgeid.ca/terms` |
| Authorized domains | `badgeid.ca` |

`rnbp.ca` and `nrpp.ca` are **not** registered here. They only redirect to `badgeid.ca`, so the SPA
never runs on them and no OAuth flow can start there. Registering a dead name would be the one
thing that brings it back.

### OAuth clients

Two clients, both `Application Web`, both created 2026-08-25:

**Badge Web (production)**
- Client ID: `812153749723-vu6vdv0b53spgjuni1ihu84a07dpna9f.apps.googleusercontent.com`
- Authorized JavaScript origins: `https://badgeid.ca`
- Authorized redirect URIs: `https://badgeid.ca/auth/google/callback`
- Client ID set in: `apps/web/.env.production`, `.github/workflows/cd.yml` (web build) and
  `apps/worker/wrangler.jsonc` (production `vars`)
- Client secret: Worker secret `GOOGLE_CLIENT_SECRET`, listed in `secrets.manifest.json` under
  production — **CD refuses to deploy production without it**

**Badge Web (developpement local)**
- Client ID: `812153749723-8mbnab54s7jj32sg1pm918tdbd1junpm.apps.googleusercontent.com`
- Authorized JavaScript origins: `http://localhost:5173`
- Authorized redirect URIs: `http://localhost:5173/auth/google/callback`
- Client ID set in `apps/web/.env.development`; secret goes in `apps/worker/.dev.vars`

Staging has no Google client. `staging.badge-platform.pages.dev` sits under the `pages.dev` public
suffix, which Google will not accept as an authorized domain, and staging is not on the launch
critical path. The Google button simply does not render there.

Client secrets are shown **once**, in the dialog that appears right after a client is created. If
one is lost, do not recreate the client: open it and use **Add secret**, which also allows a
zero-downtime rotation (add the new secret, deploy, delete the old one).

### Why there is no verification to wait for

Google requires a review only when the app declares **more than 10 authorized domains**, uploads an
**app logo**, or requests **sensitive or restricted scopes**. Badge does none of the three, so
publishing to production was instant and users see a normal consent screen — no "unverified app"
interstitial.

Uploading a logo is therefore not free: it converts a live, review-free app into one that needs
Trust & Safety approval (1–14 days). The logo is deliberately deferred until after launch, and
should be uploaded only when someone is willing to sit through that review.

### Known constraint — the user support email

The consent screen shows a support address to every user, and Google only lets you pick from **the
signed-in account's own email** or **a Google Group that account manages**. `info@badgeid.ca` is a
Cloudflare Email Routing alias, not a Google identity, so it cannot be selected; the field is stuck
on `alexandre.lessard92@gmail.com`, which is what users currently see.

Two ways out, neither on the critical path:

1. Create a Google Group with `alexandre.lessard92@gmail.com` as manager and select it. Free, but
   the address ends in `@googlegroups.com`.
2. Put `badgeid.ca` on Google Workspace, create `info@badgeid.ca` as a real mailbox, and select it.
   Paid, and the only option that shows a `@badgeid.ca` address on the consent screen.

The developer contact field has no such restriction and is already `info@badgeid.ca`.

### Troubleshooting

Google holds **no company information** for this project — there is no billing account and no
verification submission, and non-sensitive scopes never ask for a legal entity. Nothing here needs
correcting for the `11898248 Canada Inc.` → `9567-1525 Québec Inc.` change.

---

## Facebook

### Console links

- Apps list: https://developers.facebook.com/apps/
- App dashboard (RNBP): https://developers.facebook.com/apps/1667886064239370/
- Basic settings: https://developers.facebook.com/apps/1667886064239370/settings/basic/
- Use cases: https://developers.facebook.com/apps/1667886064239370/use_cases/
- App Review → Permissions and Features: https://developers.facebook.com/apps/1667886064239370/app-review/permissions/
- Business Manager / Security Center: https://business.facebook.com/settings/security

### Configuration checklist

| Item | Value (verified 2026-08-24) |
|---|---|
| App ID | `1667886064239370` |
| Display name | **Badge** |
| App secret | Worker secret `FACEBOOK_CLIENT_SECRET` — **production only**, staging has none |
| App icon | still the RNBP shield — to replace |
| Category | Utility & productivity |
| App domains | `badgeid.ca`, plus `rnbp.ca` and `nrpp.ca` while those still serve the site |
| Contact email | `info@badgeid.ca` |
| Privacy Policy URL | `https://badgeid.ca/privacy` |
| Terms of Service URL | `https://badgeid.ca/terms` |
| User data deletion | Instructions URL → `https://badgeid.ca/data-deletion` |
| Business linked | `BADGE ID` (`1656065239155631`) |
| Valid OAuth redirect URIs | `https://badgeid.ca/auth/facebook/callback`, `https://staging.badge-platform.pages.dev/auth/facebook/callback`, plus the two legacy ones |
| Permissions | `email` and `public_profile` — **Ready to publish** (advanced access granted without review) |
| App Mode | **Unpublished** — blocked on the data access renewal, below |

**Strict mode is on**, so a redirect URI must match exactly. The code builds it as
`${window.location.origin}/auth/facebook/callback` (`apps/web/src/lib/oauth.ts:56`) — adding a new
environment means adding its URI here first. `http://localhost:5173/...` is **rejected**: "Enforce
HTTPS" is enabled, and trying to add it makes Meta reject the whole batch silently.

### Path to Live mode

| Gate | State (2026-08-24) |
|---|---|
| Business verification | ✅ done 2026-04-13, under **11898248 Canada Inc.** |
| App Review for `email` / `public_profile` | ✅ not required — advanced access granted straight from *Actions → Increase access*, because the business is verified |
| **Annual data access renewal** | ❌ **the remaining blocker.** Assessment generated 2026-08-24, action ID `1793026865058622`, **due 2026-10-23**. Four sections: business connection, allowed usage, data handling, reviewer instructions. Meta warns that vague answers can cost platform access — it is a declaration by the company about its data practices, so **Alex answers it**, not an agent. |
| Switch to Live | blocked until the renewal is submitted |

After Live, validate end-to-end with a Facebook account that is **not** an admin or test user of the app.

---

## Microsoft (deferred to post-launch)

The code path is wired (`apps/api/src/utils/oauth.ts` `exchangeMicrosoftCode`, frontend button in `OAuthButtons.tsx`, `microsoftId` column in DB) but the production env does **not** set `VITE_MICROSOFT_CLIENT_ID`, so the button is hidden in the UI and the `/auth/microsoft/callback` route is unreachable in practice.

To activate after launch:

1. Register an app at https://entra.microsoft.com/ → App registrations → New registration
2. Set redirect URIs: `https://rnbp.ca/auth/microsoft/callback`, `https://nrpp.ca/auth/microsoft/callback`, `http://localhost:5173/auth/microsoft/callback`
3. Note the Application (client) ID and Directory (tenant) ID
4. Generate a client secret in Certificates & secrets
5. Add to env vars:
   - Frontend: `VITE_MICROSOFT_CLIENT_ID=...`
   - Backend: `MICROSOFT_CLIENT_ID=...`, `MICROSOFT_CLIENT_SECRET=...`
6. Update the privacy policy section #4 to mention Microsoft alongside Google and Facebook
7. Re-deploy

No additional verification is needed — Microsoft's app registration does not gate basic sign-in scopes (`openid profile email`) behind a review process.

---

## Quick troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Google sign-in shows "unverified app" warning to users | Branding verification not yet approved | Wait for T&S manual review; users can click "Advanced → Continue" in the meantime |
| Google auto-verifier rejects with "no privacy policy link" | Classifier ML noise — page is conformant | Submit manual T&S review, do not retry auto-verifier |
| Facebook sign-in returns "App not active" | App Mode = In development | Verify business verification + app review status, switch to Live |
| OAuth callback returns "redirect_uri mismatch" | Redirect URI not whitelisted in the provider console | Add the exact URI (including protocol and trailing path) to the OAuth client |
| Local dev OAuth button does nothing | `VITE_*_CLIENT_ID` env var missing in `apps/web/.env` | Set the dev client IDs and restart `pnpm dev` |
