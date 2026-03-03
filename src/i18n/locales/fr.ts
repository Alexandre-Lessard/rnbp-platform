import type { SiteContent } from "@/types/content";

const fr: SiteContent = {
  meta: {
    title: "Registre canadien des biens personnels",
    description:
      "Registre canadien des biens personnels \u2014 prot\u00e9gez et retrouvez vos biens de valeur.",
  },
  nav: {
    items: [
      { label: "Accueil", href: "#accueil" },
      { label: "Enregistrer", href: "#inscription" },
      { label: "\u00c0 propos", href: "#cycle" },
      { label: "Plus", href: "#faq", withChevron: true },
      { label: "Contact", href: "#contact" },
    ],
    partners: "Partenaires",
    login: "Connexion",
  },
  hero: {
    subtitleLine1: "Prot\u00e8ge et retrouve",
    titleLine1: "Tes biens",
    tagline: "C\u2019est simple et pratique",
    description:
      "Enregistrez vos biens de valeur dans un registre s\u00e9curis\u00e9 afin de simplifier leur identification et d\u2019augmenter vos chances de restitution en cas de perte ou de vol.",
    freeLabel: "Enregistrement 100% gratuit",
    insurancePromo: "Enregistre tes biens et obtiens un rabais sur tes assurances maison",
    imageAlt:
      "V\u00e9lo, laptop, cellulaire, montre, voiturette de golf et autres biens",
    trustBadges: [
      { label: "Donn\u00e9es h\u00e9berg\u00e9es au Canada" },
      { label: "Chiffrement avanc\u00e9" },
      { label: "Services policiers partenaires" },
      { label: "Compatible avec les assureurs" },
    ],
  },
  socialProof: {
    badge: "En phase de d\u00e9ploiement national",
    stats: [
      { value: "15\u00a0000+", label: "biens enregistr\u00e9s" },
      { value: "12+", label: "villes partenaires" },
      { value: "5+", label: "assureurs collaborateurs" },
    ],
  },
  cycle: {
    heading: "Cycle du Registre des biens",
    imageAlt: "Agent prenant note d\u2019un v\u00e9lo vol\u00e9",
    actions: [
      {
        number: "01",
        title: "Enregistrez votre bien",
        description:
          "Ajoutez la marque, le mod\u00e8le, le num\u00e9ro de s\u00e9rie et vos preuves d\u2019achat.",
      },
      {
        number: "02",
        title: "Signalez en quelques clics",
        description:
          "En cas de vol, mettez imm\u00e9diatement le bien en statut vol\u00e9 dans le registre.",
      },
      {
        number: "03",
        title: "Acc\u00e9l\u00e9rez la restitution",
        description:
          "Partagez un dossier clair qui facilite la v\u00e9rification de propri\u00e9t\u00e9.",
      },
    ],
    benefits: [
      {
        number: "01",
        title: "B\u00e9n\u00e9fice",
        description:
          "Un bien tra\u00e7able est plus difficile \u00e0 revendre et plus facile \u00e0 identifier.",
      },
      {
        number: "02",
        title: "B\u00e9n\u00e9fice",
        description:
          "Vos informations sont centralis\u00e9es pour r\u00e9agir vite au bon moment.",
      },
      {
        number: "03",
        title: "B\u00e9n\u00e9fice",
        description:
          "Vous conservez une preuve de propri\u00e9t\u00e9 structur\u00e9e pour vos d\u00e9marches.",
      },
    ],
  },
  rollingRegistry: {
    headingLine1: "Le Registre canadien",
    headingLine2: "des biens personnels",
    description:
      "Le RCBP couvre plus de 48 cat\u00e9gories de biens, incluant le mat\u00e9riel roulant, l\u2019\u00e9lectronique, les outils sp\u00e9cialis\u00e9s et d\u2019autres articles de valeur.",
    tagline:
      "Une preuve claire de propri\u00e9t\u00e9, au m\u00eame endroit.",
    imageAlt: "Tracteur \u00e0 gazon",
    viewCategoriesLink: "Voir cat\u00e9gories des biens",
  },
  allCategories: {
    heading: "48 cat\u00e9gories de biens admissibles",
    description:
      "Le RCBP vous permet d\u2019enregistrer tout bien personnel d\u2019une valeur de plus de 1\u00a0000\u00a0$.",
    toggleButton: "Afficher les cat\u00e9gories",
    items: [
      "V\u00e9lo \u00e9lectrique",
      "Trottinette \u00e9lectrique",
      "Scooter \u00e9lectrique",
      "Voiturette de golf",
      "VTT / Quad",
      "Motoneige",
      "Motomarine",
      "Tracteur \u00e0 gazon",
      "Moto",
      "Remorque utilitaire",
      "Ordinateur portable",
      "Ordinateur de bureau",
      "Tablette",
      "T\u00e9l\u00e9phone intelligent",
      "Appareil photo",
      "Cam\u00e9ra vid\u00e9o",
      "Drone",
      "Montre de luxe",
      "Bijoux",
      "Instrument de musique",
      "\u00c9quipement de son",
      "T\u00e9l\u00e9vision",
      "Console de jeux vid\u00e9o",
      "\u00c9quipement de r\u00e9alit\u00e9 virtuelle",
      "Imprimante 3D",
      "Outil sp\u00e9cialis\u00e9",
      "\u00c9quipement de soudure",
      "G\u00e9n\u00e9ratrice",
      "Compresseur",
      "Scie \u00e0 cha\u00eene professionnelle",
      "\u00c9quipement de plong\u00e9e",
      "Kayak / Canot",
      "Planche \u00e0 pagaie (SUP)",
      "\u00c9quipement de ski",
      "V\u00e9lo de montagne",
      "V\u00e9lo de route",
      "\u00c9quipement de camping haut de gamme",
      "Arme \u00e0 feu enregistr\u00e9e",
      "T\u00e9lescope / Jumelles",
      "\u00c9quipement m\u00e9dical portable",
      "Mobilier d\u2019antiquit\u00e9",
      "\u0152uvre d\u2019art",
      "Collection de pi\u00e8ces de monnaie",
      "Collection de timbres",
      "\u00c9quipement de gym",
      "Machine \u00e0 coudre industrielle",
      "Panneau solaire portable",
      "Instrument d\u2019optique",
    ],
  },
  protectionCta: {
    headingLine1: "Commencez \u00e0 prot\u00e9ger",
    headingLine2: "vos biens maintenant",
    description:
      "Cr\u00e9ez un compte et documentez vos possessions de valeur pour faciliter leur identification et leur restitution.",
    imageAlt: "Personnes discutant autour d\u2019une table",
  },
  threeSteps: {
    heading: "Trois \u00e9tapes claires",
    subtitle: "Commencez maintenant",
    learnMoreLink: "En savoir plus",
    steps: [
      {
        step: "\u00c9tape 01",
        title: "Entrez les d\u00e9tails du bien",
        description: "Marque, mod\u00e8le, num\u00e9ro de s\u00e9rie",
        image: "/assets/step-details.png",
      },
      {
        step: "\u00c9tape 02",
        title: "Joignez documents et photos",
        description:
          "Preuve d\u2019achat, certificat d\u2019authenticit\u00e9",
        image: "/assets/step-docs.png",
      },
      {
        step: "\u00c9tape 03",
        title: "Validez votre enregistrement",
        description: "Confirmez et recevez votre num\u00e9ro",
        image: "/assets/step-confirmation.png",
      },
    ],
  },
  faq: {
    heading: "FAQ",
    description:
      "Trouvez les r\u00e9ponses aux questions courantes sur l\u2019enregistrement de vos biens.",
    buttonText: "Voir FAQ",
    items: [
      {
        question: "Combien \u00e7a co\u00fbte\u00a0?",
        answer:
          "L\u2019enregistrement de vos biens est enti\u00e8rement gratuit. Aucun frais cach\u00e9, aucun abonnement. Vous pouvez enregistrer autant de biens que vous le souhaitez sans rien payer.",
      },
      {
        question: "Quel est le seuil minimum\u00a0?",
        answer:
          "Les biens doivent avoir une valeur d\u2019au moins 1\u00a0000\u00a0$. Cette limite garantit que le registre se concentre sur les articles de r\u00e9elle importance.",
      },
      {
        question: "Mes donn\u00e9es sont-elles prot\u00e9g\u00e9es\u00a0?",
        answer:
          "Oui. Le RCBP respecte les lois f\u00e9d\u00e9rales sur la protection des donn\u00e9es. Vos informations personnelles ne sont jamais vendues ni partag\u00e9es sans consentement.",
      },
      {
        question:
          "Combien de temps prend l\u2019enregistrement\u00a0?",
        answer:
          "Moins de trois minutes. Le formulaire est con\u00e7u pour \u00eatre rapide et direct. Vous recevrez un num\u00e9ro de confirmation imm\u00e9diatement apr\u00e8s validation.",
      },
      {
        question:
          "Puis-je modifier mon enregistrement\u00a0?",
        answer:
          "Oui. Connectez-vous \u00e0 votre compte pour mettre \u00e0 jour les informations. Les modifications sont enregistr\u00e9es en temps r\u00e9el dans le syst\u00e8me.",
      },
      {
        question:
          "Que se passe-t-il si mon bien est vol\u00e9\u00a0?",
        answer:
          "Signalez-le imm\u00e9diatement via la section \u00ab\u00a0D\u00e9clarer un bien vol\u00e9\u00a0\u00bb. Le statut de votre bien sera mis \u00e0 jour dans le registre.",
      },
      {
        question:
          "Pourquoi le registre est-il n\u00e9cessaire\u00a0?",
        answer:
          "Chaque ann\u00e9e, des milliers de biens sont perdus ou vol\u00e9s au Canada, et la majorit\u00e9 ne sont jamais retrouv\u00e9s. Sans preuve centralis\u00e9e de propri\u00e9t\u00e9, il est difficile pour la police d\u2019identifier un propri\u00e9taire et pour les assureurs de traiter efficacement une r\u00e9clamation. Le RCBP cr\u00e9e une preuve officielle, s\u00e9curis\u00e9e et dat\u00e9e de vos biens \u2014 num\u00e9ro de s\u00e9rie, photos, preuves d\u2019achat \u2014 dans un dossier unique. Il transforme un objet anonyme en bien identifiable, rend la revente de biens vol\u00e9s beaucoup plus difficile et acc\u00e9l\u00e8re vos d\u00e9marches de restitution.",
      },
    ],
  },
  footer: {
    subscribeHeading: "S\u2019abonner",
    emailPlaceholder: "Votre adresse courriel",
    sendButton: "Envoyer",
    disclaimer:
      "En vous abonnant, vous acceptez notre politique de confidentialit\u00e9.",
    privacyPolicy: "Politique de confidentialit\u00e9",
    termsOfUse: "Conditions d\u2019utilisation",
    cookieSettings: "Param\u00e8tres de cookies",
    copyright:
      "\u00a9 {{year}} Registre canadien des biens personnels. Tous droits r\u00e9serv\u00e9s.",
  },
  buttons: {
    registerItem: "Enregistrer un bien",
    declareStolen: "D\u00e9clarer un bien vol\u00e9",
    signUp: "S\u2019inscrire",
    verifyItem: "V\u00e9rifier un bien",
  },
  a11y: {
    skipToContent: "Aller au contenu principal",
    mainNav: "Navigation principale",
    mobileNav: "Navigation mobile",
    logoAlt: "RCBP",
  },
};

export default fr;
