interface PageMeta {
  title: string;
  description: string;
  robots?: string;
}

type LocaleMeta = Record<string, PageMeta>;

const META: Record<"fr" | "en", { defaults: PageMeta; pages: LocaleMeta }> = {
  fr: {
    defaults: {
      title: "Protégez et retrouvez vos biens de valeur | RNBP Canada",
      description:
        "Enregistrez vos biens de valeur dans un registre sécurisé. Protégez et retrouvez vos biens en cas de perte ou de vol.",
    },
    pages: {
      "/": {
        title: "Protégez et retrouvez vos biens de valeur | RNBP Canada",
        description:
          "Enregistrez vos biens de valeur dans un registre sécurisé. Protégez et retrouvez vos biens en cas de perte ou de vol.",
      },
      "/faq": {
        title: "Questions fréquentes | RNBP",
        description:
          "Trouvez les réponses aux questions courantes sur l'enregistrement de vos biens au Registre national des biens personnels.",
      },
      "/registry": {
        title: "Consulter le registre | RNBP",
        description:
          "Consultez le registre pour vérifier un bien. Citoyens, services policiers et compagnies d'assurance.",
      },
      "/confidentialite": {
        title: "Politique de confidentialité | RNBP",
        description:
          "Découvrez comment le RNBP protège vos renseignements personnels et respecte les lois fédérales sur la vie privée.",
      },
      "/conditions": {
        title: "Conditions d'utilisation | RNBP",
        description:
          "Consultez les conditions d'utilisation du Registre national des biens personnels.",
      },
      "/verifier": {
        title: "Vérifier un bien | RNBP",
        description:
          "Entrez un numéro RNBP pour vérifier le statut d'un bien enregistré dans le registre.",
      },
      "/connexion": {
        title: "Connexion | RNBP",
        description:
          "Connectez-vous à votre compte RNBP pour gérer vos biens enregistrés.",
      },
      "/inscription": {
        title: "Créer un compte | RNBP",
        description:
          "Inscrivez-vous gratuitement au RNBP pour enregistrer et protéger vos biens de valeur.",
      },
      "/tableau-de-bord": {
        title: "Tableau de bord | RNBP",
        description: "Gérez vos biens enregistrés.",
        robots: "noindex, nofollow",
      },
      "/declarer-vol": {
        title: "Déclarer un vol | RNBP",
        description: "Déclarez un bien volé.",
        robots: "noindex, nofollow",
      },
      "/enregistrer": {
        title: "Enregistrer un bien | RNBP",
        description: "Enregistrez un bien dans le registre.",
        robots: "noindex, nofollow",
      },
      "/boutique": {
        title: "Boutique | RNBP",
        description:
          "Achetez des étiquettes d'identification RNBP pour protéger vos biens de valeur.",
      },
      "/boutique/succes": {
        title: "Commande confirmée | RNBP",
        description: "Votre commande a été confirmée avec succès.",
        robots: "noindex, nofollow",
      },
      "/contact": {
        title: "Contactez-nous | RNBP",
        description:
          "Contactez l'équipe du Registre national des biens personnels pour toute question ou demande.",
      },
      "/verifier-courriel": {
        title: "Vérification du courriel | RNBP",
        description: "Vérifiez votre adresse courriel.",
        robots: "noindex, nofollow",
      },
      "/verification-en-attente": {
        title: "Vérification en attente | RNBP",
        description: "Vérification de votre courriel en cours.",
        robots: "noindex, nofollow",
      },
      "/admin/commandes": {
        title: "Admin — Commandes | RNBP",
        description: "Gestion des commandes.",
        robots: "noindex, nofollow",
      },
    },
  },
  en: {
    defaults: {
      title: "Protect and recover your valuable belongings | NRPP",
      description:
        "Register your valuable belongings in a secure registry. Protect and recover your items in case of loss or theft.",
    },
    pages: {
      "/": {
        title: "Protect and recover your valuable belongings | NRPP",
        description:
          "Register your valuable belongings in a secure registry. Protect and recover your items in case of loss or theft.",
      },
      "/faq": {
        title: "Frequently Asked Questions | NRPP",
        description:
          "Find answers to common questions about registering your belongings in the National Registry of Personal Property.",
      },
      "/registry": {
        title: "Consult the Registry | NRPP",
        description:
          "Consult the registry to verify an item. Citizens, law enforcement and insurance companies.",
      },
      "/confidentialite": {
        title: "Privacy Policy | NRPP",
        description:
          "Learn how the NRPP protects your personal information and complies with federal privacy laws.",
      },
      "/conditions": {
        title: "Terms of Service | NRPP",
        description:
          "Review the terms of service for the National Registry of Personal Property.",
      },
      "/verifier": {
        title: "Verify an Item | NRPP",
        description:
          "Enter a NRPP number to check the status of a registered item.",
      },
      "/connexion": {
        title: "Login | NRPP",
        description:
          "Sign in to your NRPP account to manage your registered items.",
      },
      "/inscription": {
        title: "Create an Account | NRPP",
        description:
          "Sign up for free to register and protect your valuable belongings.",
      },
      "/tableau-de-bord": {
        title: "Dashboard | NRPP",
        description: "Manage your registered items.",
        robots: "noindex, nofollow",
      },
      "/declarer-vol": {
        title: "Report a Theft | NRPP",
        description: "Report a stolen item.",
        robots: "noindex, nofollow",
      },
      "/enregistrer": {
        title: "Register an Item | NRPP",
        description: "Register an item in the registry.",
        robots: "noindex, nofollow",
      },
      "/boutique": {
        title: "Shop | NRPP",
        description:
          "Buy NRPP identification stickers to protect your valuable belongings.",
      },
      "/boutique/succes": {
        title: "Order Confirmed | NRPP",
        description: "Your order has been successfully confirmed.",
        robots: "noindex, nofollow",
      },
      "/contact": {
        title: "Contact Us | NRPP",
        description:
          "Contact the National Registry of Personal Property team for any questions or inquiries.",
      },
      "/verifier-courriel": {
        title: "Email Verification | NRPP",
        description: "Verify your email address.",
        robots: "noindex, nofollow",
      },
      "/verification-en-attente": {
        title: "Verification Pending | NRPP",
        description: "Email verification in progress.",
        robots: "noindex, nofollow",
      },
      "/admin/commandes": {
        title: "Admin — Orders | NRPP",
        description: "Order management.",
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
    a: "Les biens doivent avoir une valeur d'au moins 1\u00a0000\u00a0$.",
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
    a: "Items must have a value of at least $1,000.",
  },
  {
    q: "Is my data protected?",
    a: "Yes. The NRPP complies with federal data protection laws. Your personal information is never sold or shared without consent.",
  },
  {
    q: "How long does registration take?",
    a: "Less than three minutes. You'll receive a confirmation number immediately after validation.",
  },
  {
    q: "Why is the registry necessary?",
    a: "Every year, thousands of items are lost or stolen in Canada. The NRPP creates an official, secure and dated record of your belongings in a single file.",
  },
  {
    q: "Does the registry work across the country?",
    a: "Yes. The registry is designed to operate nationwide.",
  },
];

// Dérivé de META — une seule source de vérité
const PUBLIC_PATHS = Object.entries(META.fr.pages)
  .filter(([, meta]) => !meta.robots?.includes("noindex"))
  .map(([path]) => path);

const NOINDEX_PATHS = Object.entries(META.fr.pages)
  .filter(([, meta]) => meta.robots?.includes("noindex"))
  .map(([path]) => path);

const ALL_KNOWN_PATHS = Object.keys(META.fr.pages);
const PREFIX_PATHS = ["/admin/commandes"];

function detectLocale(hostname: string): "fr" | "en" {
  if (hostname.includes("nrpp")) return "en";
  return "fr";
}

function getDomain(locale: "fr" | "en"): string {
  return locale === "fr" ? "https://rnbp.ca" : "https://nrpp.ca";
}

function getOtherDomain(locale: "fr" | "en"): string {
  return locale === "fr" ? "https://nrpp.ca" : "https://rnbp.ca";
}

function generateRobotsTxt(hostname: string): Response {
  const domain = hostname.includes("nrpp")
    ? "https://nrpp.ca"
    : "https://rnbp.ca";
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

function generateSitemapXml(hostname: string): Response {
  const locale = detectLocale(hostname);
  const domain = getDomain(locale);
  const otherDomain = getOtherDomain(locale);

  const urls = PUBLIC_PATHS.map((path) => {
    const loc = `${domain}${path === "/" ? "" : path}/`;
    const frHref =
      locale === "fr"
        ? loc
        : `${otherDomain}${path === "/" ? "" : path}/`;
    const enHref =
      locale === "en"
        ? loc
        : `${otherDomain}${path === "/" ? "" : path}/`;
    return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frHref}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enHref}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locale === "fr" ? loc : frHref}" />
    <lastmod>2026-03-11</lastmod>
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

function buildJsonLd(locale: "fr" | "en", path: string, domain: string): string {
  const orgName =
    locale === "fr"
      ? "Registre national des biens personnels"
      : "National Registry of Personal Property";
  const altName = locale === "fr" ? "RNBP" : "NRPP";
  const logoFile = locale === "fr" ? "logo-texte-fr.png" : "logo-texte-en.png";
  const description =
    locale === "fr"
      ? "Registre national des biens personnels — protégez et retrouvez vos biens de valeur."
      : "National Registry of Personal Property — protect and recover your valuable belongings.";

  let jsonLd = `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "${orgName}",
        "alternateName": "${altName}",
        "url": "${domain}",
        "logo": "${domain}/assets/${logoFile}",
        "description": "${description}"
      }
    </script>`;

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

function injectMeta(
  html: string,
  locale: "fr" | "en",
  path: string,
): string {
  const domain = getDomain(locale);
  // Lookup exact path, then parent path (e.g. /admin/commandes for /admin/commandes/123)
  const meta = META[locale].pages[path]
    ?? META[locale].pages[path.replace(/\/[^/]+$/, "")]
    ?? META[locale].defaults;

  const ogLocale = locale === "fr" ? "fr_CA" : "en_CA";
  const ogLocaleAlt = locale === "fr" ? "en_CA" : "fr_CA";
  const siteName = locale === "fr" ? "RNBP" : "NRPP";
  const ogImageFile = locale === "fr" ? "og-image-fr.png" : "og-image-en.png";
  const canonicalUrl = `${domain}${path === "/" ? "" : path}/`;
  const ogUrl = canonicalUrl;
  const ogImage = `${domain}/assets/${ogImageFile}`;
  const hreflangFr = `https://rnbp.ca${path === "/" ? "/" : path + "/"}`;
  const hreflangEn = `https://nrpp.ca${path === "/" ? "/" : path + "/"}`;
  const robots = meta.robots ?? "index, follow";
  const lang = locale === "fr" ? "fr-CA" : "en-CA";
  const jsonLd = buildJsonLd(locale, path, domain);

  return html
    .replace("{{LANG}}", lang)
    .replace(/\{\{TITLE\}\}/g, meta.title)
    .replace(/\{\{DESCRIPTION\}\}/g, meta.description)
    .replace("{{ROBOTS}}", robots)
    .replace("{{OG_LOCALE}}", ogLocale)
    .replace("{{OG_LOCALE_ALT}}", ogLocaleAlt)
    .replace("{{SITE_NAME}}", siteName)
    .replace("{{OG_URL}}", ogUrl)
    .replace(/\{\{OG_IMAGE\}\}/g, ogImage)
    .replace("{{CANONICAL}}", canonicalUrl)
    .replace(/\{\{HREFLANG_FR\}\}/g, hreflangFr)
    .replace("{{HREFLANG_EN}}", hreflangEn)
    .replace("{{JSON_LD}}", jsonLd);
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const { pathname, hostname } = url;

  // Serve robots.txt dynamically per domain
  if (pathname === "/robots.txt") {
    return generateRobotsTxt(hostname);
  }

  // Serve sitemap.xml dynamically per domain
  if (pathname === "/sitemap.xml") {
    return generateSitemapXml(hostname);
  }

  // For non-HTML requests, pass through to static assets
  const response = await context.next();
  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // For HTML responses, inject meta tags
  const locale = detectLocale(hostname);
  // Normalize path: remove trailing slash except for root
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
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
