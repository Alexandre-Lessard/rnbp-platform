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
| Google | **Done at Google.** Consent screen published, branding verified and visible, clients wired. The button ships on the next deploy to `main` | — |
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

Verified against the console on 2026-08-25. Nothing is pending at Google: the consent screen is
published, branding is verified and visible to users, and the two OAuth clients hold live secrets.
What stands between that and a working button in production is on our side only:

The production Worker secrets `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` hold the
`Badge Web (production)` values, and `apps/worker/.dev.vars` holds the dev pair. The frontend only
renders the button once a deploy carries `VITE_GOOGLE_CLIENT_ID`, which is set in `cd.yml` and
ships on the next push to `main`. That deploy is the last remaining step.

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
| User support email | `badgeid-support@googlegroups.com` — see the constraint below |
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

**Staging has no Google sign-in, and that is a decision, not an oversight** (Alexandre,
2026-08-25). `cd-staging.yml` passes only `VITE_FACEBOOK_CLIENT_ID`, and the staging Worker has no
`GOOGLE_CLIENT_*` secrets, so the button does not render there.

The obstacle is that `staging.badge-platform.pages.dev` sits under the `pages.dev` public suffix.
Google would want `badge-platform.pages.dev` as an authorized domain, which requires Search Console
ownership, which requires DNS control over `pages.dev` — impossible.

The way in, if staging ever needs it: give the Pages project a **`staging.badgeid.ca`** custom
domain. `badgeid.ca` is a Search Console *Domain* property, which covers every subdomain, and a
Google authorized domain likewise covers its subdomains — so a redirect URI at
`https://staging.badgeid.ca/auth/google/callback` needs **no new authorized domain**. That matters:
adding one would drop the app back to unverified and force the whole branding cycle again.

Until then, Google sign-in is validated in local dev (the dev client is live) and in production.

Client secrets are shown **once**, in the dialog that appears right after a client is created. If
one is lost, do not recreate the client: open it and use **Add secret**, which also allows a
zero-downtime rotation — add the new secret, put it in place, then disable and delete the old one.

Both clients were rotated on 2026-08-25: each now has exactly one **active** secret, and the
original secret of each is **disabled** (kept, not deleted, so it can be re-enabled if a rotation
turns out to have missed a consumer). Delete the disabled ones once Google sign-in is confirmed
working in production.

**A caution for whoever rotates these next.** Do not let an agent read the secret off the page. The
Google Cloud console puts the full secret in the copy button's `aria-label`, so it lands in any
accessibility-tree read, and it is plain text in any screenshot of the creation dialog. The safe
path is to click the copy button and pipe the clipboard straight into the consumer, never printing
it:

```bash
xclip -o -selection clipboard | \
  CLOUDFLARE_API_TOKEN=$(secret-tool lookup service cloudflare key badge-cicd-prod) \
  pnpm --filter @badge/worker exec wrangler secret put GOOGLE_CLIENT_SECRET --env production
```

### Two verifications, only one of which matters for signing in

The Verification Center splits this in two, and the halves have very different consequences.

**Data access — not required, and never will be.** Google reviews scopes only when an app requests
sensitive or restricted ones. Badge requests `openid`, `email` and `profile`, all non-sensitive, so
the console states outright that no review applies. **This is the half that gates sign-in, and it
is clear** — nothing at Google stands in the way of a Google account signing in.

**Branding — required, and now done.** Until branding is verified *and published*, the consent
screen does not show the Badge name, the home page link, the privacy link or the terms link. Users
can still sign in; they just see a barer screen. As of 2026-08-25 the Verification Center reads
"Votre branding a été validé et est visible par les utilisateurs."

Getting there took two attempts, and the first failure is the useful part of this record. Google
returned exactly one problem:

> Le site Web correspondant à l'URL de votre page d'accueil "https://badgeid.ca/" n'est pas
> enregistré à votre nom.

`badgeid.ca` had never been verified in Google Search Console — only the two dead names `rnbp.ca`
and `nrpp.ca` were. **Note the trap: the Branding page accepts an authorized domain without
checking Search Console ownership.** `badgeid.ca` saved with no complaint, which makes it look
verified. It is not; the check only happens at branding verification time.

#### How `badgeid.ca` was verified (2026-08-25)

Search Console offers an automated Cloudflare flow, but it asks Google for OAuth access to the
whole Cloudflare account — declined on purpose. The manual route: in the verification dialog,
switch **Instructions pour** from `Cloudflare.com` to **Tous fournisseurs DNS**, which reveals a
plain TXT record instead.

The record now on the zone (do **not** delete it — removing it revokes the verification, which in
turn invalidates the branding):

```
badgeid.ca.  TXT  "google-site-verification=3je3JG0SVwRWk85pY0eTvDF4n7g8k0_wjiyt4SgU7KQ"
```

Verification was instant once the record resolved. Search Console then reports the property as
validated via "Fournisseur de nom de domaine".

**Neither `badge-ops` nor `badge-cicd-prod` can write DNS records** — both return `Authentication
error` on `POST /zones/:id/dns_records`, though `badge-ops` reads the zone fine. The record was
added through the Cloudflare dashboard. If DNS work becomes routine, that gap is worth closing with
a token that carries `DNS:Edit` on the three zones.

#### Re-verifying after a change

Editing branding fields drops the app back to unverified. The loop is: fix, open **Afficher les
problèmes**, pick *J'ai corrigé les problèmes*, wait (~2 min), then — and this step is easy to
miss — press **Publier les informations sur la marque**. A verified-but-unpublished result
**expires after 7 days** and the work is lost.

If an attempt fails on a page that is genuinely conformant, do not simply retry: repeated failures
cost standing with the classifier. Use the panel's second option ("Je pense que les problèmes
détectés sont incorrects") to request a manual Trust & Safety review instead.

**Do not upload an app logo before branding is verified.** A logo is one of the three triggers
(alongside >10 authorized domains and sensitive scopes) that would drag the *data access* half into
review too — turning a working sign-in into one waiting on Trust & Safety. The logo is deferred
until after launch on purpose.

### The user support email is a Google Group

The consent screen shows a support address to every user, and Google only accepts **the signed-in
account's own email** or **a Google Group that account manages**. `info@badgeid.ca` is a Cloudflare
Email Routing alias, not a Google identity, so it can never be selected here.

A group was created on 2026-08-25 to avoid showing a personal Gmail to users:

| Item | Value |
|---|---|
| Address | `badgeid-support@googlegroups.com` |
| Group name | Badge — support |
| Manager | `alexandre.lessard92@gmail.com` (sole member) |
| Who can post | **anyone on the web** — a user who reads the address on the consent screen has to be able to write to it |
| Who can view conversations / member list / find the group | group members only |
| Who can join | invited users only |

The address ends in `@googlegroups.com` rather than `@badgeid.ca`. Showing a `badgeid.ca` address
would require putting the domain on Google Workspace and creating a real mailbox there — paid, and
not worth it before launch.

The developer contact field has no such restriction and is `info@badgeid.ca`.

### Troubleshooting

Google holds **no company information** for this project — there is no billing account, and
neither branding verification nor non-sensitive scopes ever ask for a legal entity. Unlike Meta,
nothing here needs correcting for the `11898248 Canada Inc.` → `9567-1525 Québec Inc.` change.

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
| Google consent screen shows no app name or legal links | Branding verified but never **published**, or the published result expired | Branding page → **Publier les informations sur la marque**; a verified result expires after 7 days |
| Branding verification fails on "n'est pas enregistré à votre nom" | The authorized domain is not verified in Search Console — the Branding page does not check this when saving | Add the domain as a Search Console **Domain** property and keep its `google-site-verification` TXT record in place |
| Facebook sign-in returns "App not active" | App Mode = In development | Verify business verification + app review status, switch to Live |
| OAuth callback returns "redirect_uri mismatch" | Redirect URI not whitelisted in the provider console | Add the exact URI (including protocol and trailing path) to the OAuth client |
| Local dev OAuth button does nothing | `VITE_*_CLIENT_ID` env var missing in `apps/web/.env` | Set the dev client IDs and restart `pnpm dev` |
