import { BRAND_ORIGIN, canonicalUrl, normalizePath } from "../src/lib/canonical";

interface PageMeta {
  title: string;
  description: string;
  robots?: string;
}

type LocaleMeta = Record<string, PageMeta>;

const META: Record<"fr" | "en", { defaults: PageMeta; pages: LocaleMeta }> = {
  fr: {
    defaults: {
      title: "Protégez vos biens et retrouvez-les après un vol | RNBP",
      description:
        "Enregistrez gratuitement vos objets de valeur — numéros de série, photos, factures — dans un registre canadien sécurisé. Une preuve de propriété prête pour la police et votre assureur.",
    },
    pages: {
      "/": {
        title: "Protégez vos biens et retrouvez-les après un vol | RNBP",
        description:
          "Enregistrez gratuitement vos objets de valeur — numéros de série, photos, factures — dans un registre canadien sécurisé. Une preuve de propriété prête pour la police et votre assureur.",
      },
      "/faq": {
        title: "Questions fréquentes sur le registre | RNBP",
        description:
          "Comment enregistrer un bien, quoi faire dans les heures suivant un vol, comment la police et les assureurs utilisent le registre RNBP.",
      },
      "/registry": {
        title: "Consulter le registre des biens volés | RNBP",
        description:
          "Services policiers, assureurs et citoyens : consultez le registre canadien pour identifier un bien, vérifier une propriété ou retrouver un propriétaire.",
      },
      "/privacy": {
        title: "Politique de confidentialité | RNBP",
        description:
          "Découvrez comment le RNBP protège vos renseignements personnels et respecte les lois fédérales sur la vie privée.",
      },
      "/terms": {
        title: "Conditions d'utilisation | RNBP",
        description:
          "Consultez les conditions d'utilisation du RNBP.",
      },
      "/data-deletion": {
        title: "Suppression de votre compte | RNBP",
        description:
          "Comment demander la suppression complète de votre compte et de vos données du RNBP.",
      },
      "/lookup": {
        title: "Vérifier si un objet est volé | RNBP",
        description:
          "Avant d'acheter d'occasion, vérifiez un numéro de série ou un code Badge dans le registre canadien des biens déclarés volés. Gratuit et instantané.",
      },
      "/login": {
        title: "Connexion | RNBP",
        description:
          "Connectez-vous à votre compte RNBP pour gérer vos biens enregistrés.",
      },
      "/forgot-password": {
        title: "Mot de passe oublié | RNBP",
        description:
          "Recevez un lien pour choisir un nouveau mot de passe et retrouver l'accès à votre compte RNBP.",
        robots: "noindex, nofollow",
      },
      "/unsubscribe": {
        title: "Se désabonner | RNBP",
        description: "Retirez votre adresse de nos communications promotionnelles.",
        robots: "noindex, nofollow",
      },
      "/reset-password": {
        title: "Nouveau mot de passe | RNBP",
        description: "Choisissez un nouveau mot de passe pour votre compte RNBP.",
        robots: "noindex, nofollow",
      },
      "/register": {
        title: "Créer un compte | RNBP",
        description:
          "Inscrivez-vous gratuitement au RNBP pour enregistrer et protéger vos biens de valeur.",
      },
      "/dashboard": {
        title: "Tableau de bord | RNBP",
        description: "Gérez vos biens enregistrés.",
        robots: "noindex, nofollow",
      },
      "/report-theft": {
        title: "Déclarer un vol | RNBP",
        description: "Déclarez un bien volé.",
        robots: "noindex, nofollow",
      },
      "/register-item": {
        title: "Enregistrer un bien | RNBP",
        description: "Enregistrez un bien dans le registre.",
        robots: "noindex, nofollow",
      },
      "/shop": {
        title: "Étiquettes d'identification pour vos biens | RNBP",
        description:
          "Autocollants Badge à code unique : identifiez vélos, outils et appareils pour les rendre traçables en cas de perte ou de vol. Livraison partout au Canada.",
      },
      "/shop/success": {
        title: "Commande confirmée | RNBP",
        description: "Votre commande a été confirmée avec succès.",
        robots: "noindex, nofollow",
      },
      "/contact": {
        title: "Contactez-nous | RNBP",
        description:
          "Contactez l'équipe du RNBP pour toute question ou demande.",
      },
      "/verify-email": {
        title: "Vérification du courriel | RNBP",
        description: "Vérifiez votre adresse courriel.",
        robots: "noindex, nofollow",
      },
      "/email-pending": {
        title: "Vérification en attente | RNBP",
        description: "Vérification de votre courriel en cours.",
        robots: "noindex, nofollow",
      },
      "/admin/orders": {
        title: "Admin — Commandes | RNBP",
        description: "Gestion des commandes.",
        robots: "noindex, nofollow",
      },
      "/admin/acquisition": {
        title: "Admin — Acquisition | RNBP",
        description: "Performance des campagnes publicitaires.",
        robots: "noindex, nofollow",
      },
      "/c": {
        title: "Bien enregistré | RNBP",
        description: "Vérifiez l'état d'un bien enregistré au RNBP via son code Badge.",
        robots: "noindex, nofollow",
      },
    },
  },
  en: {
    defaults: {
      title: "Protect your belongings and get them back after a theft | RNBP",
      description:
        "Register your valuables for free — serial numbers, photos, receipts — in a secure Canadian registry. Proof of ownership ready for police and your insurer.",
    },
    pages: {
      "/": {
        title: "Protect your belongings and get them back after a theft | RNBP",
        description:
          "Register your valuables for free — serial numbers, photos, receipts — in a secure Canadian registry. Proof of ownership ready for police and your insurer.",
      },
      "/faq": {
        title: "Frequently asked questions about the registry | RNBP",
        description:
          "How to register an item, what to do in the hours after a theft, and how police and insurers use the RNBP registry.",
      },
      "/registry": {
        title: "Search the stolen property registry | RNBP",
        description:
          "Police services, insurers and citizens: search the Canadian registry to identify an item, verify ownership or find an owner.",
      },
      "/privacy": {
        title: "Privacy Policy | RNBP",
        description:
          "Learn how the RNBP protects your personal information and complies with federal privacy laws.",
      },
      "/terms": {
        title: "Terms of Service | RNBP",
        description:
          "Review the terms of service for the RNBP.",
      },
      "/data-deletion": {
        title: "Account Deletion | RNBP",
        description:
          "How to request the complete deletion of your account and data from the RNBP.",
      },
      "/lookup": {
        title: "Check whether an item is stolen | RNBP",
        description:
          "Before buying second-hand, check a serial number or Badge code against the Canadian registry of items reported stolen. Free and instant.",
      },
      "/login": {
        title: "Login | RNBP",
        description:
          "Sign in to your RNBP account to manage your registered items.",
      },
      "/forgot-password": {
        title: "Forgot Password | RNBP",
        description:
          "Get a link to choose a new password and regain access to your RNBP account.",
        robots: "noindex, nofollow",
      },
      "/unsubscribe": {
        title: "Unsubscribe | RNBP",
        description: "Remove your address from our promotional messages.",
        robots: "noindex, nofollow",
      },
      "/reset-password": {
        title: "New Password | RNBP",
        description: "Choose a new password for your RNBP account.",
        robots: "noindex, nofollow",
      },
      "/register": {
        title: "Create an Account | RNBP",
        description:
          "Sign up for free to register and protect your valuable belongings.",
      },
      "/dashboard": {
        title: "Dashboard | RNBP",
        description: "Manage your registered items.",
        robots: "noindex, nofollow",
      },
      "/report-theft": {
        title: "Report a Theft | RNBP",
        description: "Report a stolen item.",
        robots: "noindex, nofollow",
      },
      "/register-item": {
        title: "Register an Item | RNBP",
        description: "Register an item in the registry.",
        robots: "noindex, nofollow",
      },
      "/shop": {
        title: "Identification labels for your belongings | RNBP",
        description:
          "Badge stickers with a unique code: tag bikes, tools and devices so they stay traceable if lost or stolen. Shipping across Canada.",
      },
      "/shop/success": {
        title: "Order Confirmed | RNBP",
        description: "Your order has been successfully confirmed.",
        robots: "noindex, nofollow",
      },
      "/contact": {
        title: "Contact Us | RNBP",
        description:
          "Contact the RNBP team for any questions or inquiries.",
      },
      "/verify-email": {
        title: "Email Verification | RNBP",
        description: "Verify your email address.",
        robots: "noindex, nofollow",
      },
      "/email-pending": {
        title: "Verification Pending | RNBP",
        description: "Email verification in progress.",
        robots: "noindex, nofollow",
      },
      "/admin/orders": {
        title: "Admin — Orders | RNBP",
        description: "Order management.",
        robots: "noindex, nofollow",
      },
      "/admin/acquisition": {
        title: "Admin — Acquisition | RNBP",
        description: "Ad campaign performance.",
        robots: "noindex, nofollow",
      },
      "/c": {
        title: "Registered item | RNBP",
        description: "Check the status of an item registered with RNBP via its Badge code.",
        robots: "noindex, nofollow",
      },
    },
  },
};

const FAQ_FR = [
  {
    q: "Combien ça coûte\u00a0?",
    a: "L'enregistrement de vos biens est entièrement gratuit. Aucun frais caché, aucun abonnement.",
  },
  {
    q: "Quel est le seuil minimum\u00a0?",
    a: "Les biens doivent avoir une valeur d'au moins 250\u00a0$.",
  },
  {
    q: "Mes données sont-elles protégées\u00a0?",
    a: "Oui. Le RNBP respecte les lois fédérales sur la protection des données. Vos informations personnelles ne sont jamais vendues ni partagées sans consentement.",
  },
  {
    q: "Combien de temps prend l'enregistrement\u00a0?",
    a: "Moins de trois minutes. Vous recevrez un numéro de confirmation immédiatement après validation.",
  },
  {
    q: "Pourquoi le registre est-il nécessaire\u00a0?",
    a: "Chaque année, des milliers de biens sont perdus ou volés au Canada. Le RNBP crée une preuve officielle, sécurisée et datée de vos biens dans un dossier unique.",
  },
  {
    q: "Le registre fonctionne-t-il partout au pays\u00a0?",
    a: "Oui. Le registre est conçu pour fonctionner à l'échelle nationale.",
  },
];

const FAQ_EN = [
  {
    q: "How much does it cost?",
    a: "Registering your belongings is completely free. No hidden fees, no subscription.",
  },
  {
    q: "What is the minimum threshold?",
    a: "Items must have a value of at least $250.",
  },
  {
    q: "Is my data protected?",
    a: "Yes. The RNBP complies with federal data protection laws. Your personal information is never sold or shared without consent.",
  },
  {
    q: "How long does registration take?",
    a: "Less than three minutes. You'll receive a confirmation number immediately after validation.",
  },
  {
    q: "Why is the registry necessary?",
    a: "Every year, thousands of items are lost or stolen in Canada. The RNBP creates an official, secure and dated record of your belongings in a single file.",
  },
  {
    q: "Does the registry work across the country?",
    a: "Yes. The registry is designed to operate nationwide.",
  },
];

// Derived from META — single source of truth
const PUBLIC_PATHS = Object.entries(META.fr.pages)
  .filter(([, meta]) => !meta.robots?.includes("noindex"))
  .map(([path]) => path);

const NOINDEX_PATHS = Object.entries(META.fr.pages)
  .filter(([, meta]) => meta.robots?.includes("noindex"))
  .map(([path]) => path);

const ALL_KNOWN_PATHS = Object.keys(META.fr.pages);
const PREFIX_PATHS = ["/admin/orders", "/c"];

// Single-domain (rnbp.ca): locale detection moved client-side
// (localStorage > navigator.language). Server-side prerender defaults to FR;
// EN variant is generated via BUILD_LOCALE=en at build time.
// BRAND_ORIGIN and the canonical rule live in src/lib/canonical.ts, shared with
// root.tsx so the browser renders the same canonical the server injected.

function detectLocale(): "fr" | "en" {
  return "fr";
}

function getDomain(): string {
  return BRAND_ORIGIN;
}

function generateRobotsTxt(): Response {
  const domain = BRAND_ORIGIN;
  const disallows = NOINDEX_PATHS.map((p) => `Disallow: ${p}`).join("\n");
  const body = `User-agent: *
Allow: /
${disallows}

Sitemap: ${domain}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function generateSitemapXml(): Response {
  // Computed per request, not at module scope: Workers freeze the clock until
  // the first I/O, so a Date read during module initialisation returns the
  // epoch — which shipped a sitemap full of <lastmod>1970-01-01</lastmod>.
  const LASTMOD = new Date().toISOString().slice(0, 10);
  const locale = detectLocale();

  // Same form as the canonical tag — no trailing slash — so the sitemap and
  // the pages agree on which URL is the real one.
  const urls = PUBLIC_PATHS.map((path) => {
    const loc = canonicalUrl(path);
    const frHref = loc;
    const enHref = loc;
    return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frHref}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enHref}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locale === "fr" ? loc : frHref}" />
    <lastmod>${LASTMOD}</lastmod>
  </url>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

// Profiles Google can use to tie the site to a known entity. Add the Facebook
// page here once its URL is settled — an Organization with no sameAs gives the
// knowledge graph nothing to match against.
const SAME_AS: string[] = [];

function buildJsonLd(locale: "fr" | "en", path: string, domain: string): string {
  const orgName = "RNBP";
  const altName = locale === "fr" ? "Registre national des biens personnels" : "National Registry of Personal Property";
  const logoFile = "logo-rnbp.png";
  const description =
    locale === "fr"
      ? "Registre canadien de biens personnels : enregistrez vos objets de valeur, prouvez que vous en êtes propriétaire et augmentez vos chances de les retrouver après un vol."
      : "Canadian registry of personal property: register your valuables, prove ownership, and improve your odds of recovering them after a theft.";
  const sameAs =
    SAME_AS.length > 0
      ? `,\n        "sameAs": ${JSON.stringify(SAME_AS)}`
      : "";

  let jsonLd = `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "${orgName}",
        "alternateName": "${altName}",
        "url": "${domain}",
        "logo": "${domain}/assets/${logoFile}",
        "areaServed": "CA",
        "description": "${description}"${sameAs}
      }
    </script>`;

  // Declared on the home page only: repeating it on every route just adds
  // noise for the crawler without adding meaning.
  if (path === "/") {
    jsonLd += `
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "${orgName}",
        "url": "${domain}",
        "inLanguage": ${JSON.stringify(locale === "fr" ? "fr-CA" : "en-CA")},
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "${domain}/lookup?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    </script>`;
  }

  if (path === "/faq") {
    const faqItems = locale === "fr" ? FAQ_FR : FAQ_EN;
    const faqEntries = faqItems
      .map(
        (item) => `{
          "@type": "Question",
          "name": ${JSON.stringify(item.q)},
          "acceptedAnswer": {
            "@type": "Answer",
            "text": ${JSON.stringify(item.a)}
          }
        }`
      )
      .join(",\n        ");

    jsonLd += `
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
        ${faqEntries}
        ]
      }
    </script>`;
  }

  return jsonLd;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectMeta(
  html: string,
  locale: "fr" | "en",
  path: string,
): string {
  const domain = getDomain();
  // Lookup exact path, then parent path (e.g. /admin/commandes for /admin/commandes/123)
  const meta = META[locale].pages[path]
    ?? META[locale].pages[path.replace(/\/[^/]+$/, "")]
    ?? META[locale].defaults;

  const ogLocale = locale === "fr" ? "fr_CA" : "en_CA";
  const ogLocaleAlt = locale === "fr" ? "en_CA" : "fr_CA";
  const siteName = "RNBP";
  const ogImageFile = locale === "fr" ? "og-image-rnbp-fr.png" : "og-image-rnbp-en.png";
  const canonical = canonicalUrl(path);
  const ogUrl = canonical;
  const ogImage = `${domain}/assets/${ogImageFile}`;
  const hreflangFr = canonical;
  const hreflangEn = canonical;
  const robots = meta.robots ?? "index, follow";
  const lang = locale === "fr" ? "fr-CA" : "en-CA";
  const jsonLd = buildJsonLd(locale, path, domain);

  // The home-page <title> and <meta name="description"> hoisted by React 19
  // into the prerendered HTML are replaced with {{TITLE}} / {{DESCRIPTION}}
  // placeholders at build time (scripts/build-multilocale.mjs) so the
  // substitutions below work for every route, including SPA-fallback ones.
  // escapeHtml guards against future titles containing &, <, >, " — current
  // translations are safe but the placeholder interpolation would otherwise
  // inject raw chars into attribute/element contexts.
  return html
    .replace("{{LANG}}", lang)
    .replace(/\{\{TITLE\}\}/g, escapeHtml(meta.title))
    .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(meta.description))
    .replace("{{ROBOTS}}", robots)
    .replace("{{OG_LOCALE}}", ogLocale)
    .replace("{{OG_LOCALE_ALT}}", ogLocaleAlt)
    .replace("{{SITE_NAME}}", siteName)
    .replace("{{OG_URL}}", ogUrl)
    .replace(/\{\{OG_IMAGE\}\}/g, ogImage)
    .replace("{{CANONICAL}}", canonical)
    .replace(/\{\{HREFLANG_FR\}\}/g, hreflangFr)
    .replace("{{HREFLANG_EN}}", hreflangEn)
    .replace("<!-- JSON-LD {{JSON_LD}} -->", jsonLd);
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const { pathname } = url;

  if (pathname === "/robots.txt") {
    return generateRobotsTxt();
  }

  if (pathname === "/sitemap.xml") {
    return generateSitemapXml();
  }

  // For non-HTML requests, pass through to static assets
  let response = await context.next();
  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // For HTML responses, inject meta tags
  const locale = detectLocale();

  // On the EN domain, swap the prerendered body for the EN-prerendered HTML
  // (build produces index.html in FR and index.en.html in EN). We re-fetch
  // via the ASSETS binding, which serves static assets and honours the
  // pretty-path mapping: requesting /index.en returns the contents of
  // /index.en.html (fetching /index.en.html directly 308-redirects to the
  // pretty path). If the EN file is missing (e.g. old build still deployed),
  // fall back silently to the FR body rather than 500.
  if (locale === "en") {
    const enUrl = new URL(context.request.url);
    enUrl.pathname = "/index.en";
    const enResp = await context.env.ASSETS.fetch(
      new Request(enUrl, context.request),
    );
    if (enResp.ok) {
      response = new Response(enResp.body, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  // Normalize path: remove trailing slash except for root
  const path = normalizePath(pathname);
  const html = await response.text();
  const modifiedHtml = injectMeta(html, locale, path);

  // Return 404 for unknown paths (avoid soft 404 for Google)
  const knownPath = ALL_KNOWN_PATHS.includes(path) ||
    PREFIX_PATHS.some((p) => path.startsWith(p + "/"));
  const status = knownPath ? response.status : 404;

  return new Response(modifiedHtml, {
    status,
    headers: response.headers,
  });
};
