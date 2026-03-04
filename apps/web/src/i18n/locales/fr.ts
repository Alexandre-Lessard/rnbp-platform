import type { SiteContent } from "@/types/content";

const fr: SiteContent = {
  meta: {
    title: "Registre national des biens personnels",
    description:
      "Registre national des biens personnels \u2014 prot\u00e9gez et retrouvez vos biens de valeur.",
  },
  nav: {
    items: [
      { label: "Accueil", href: "#accueil" },
      { label: "\u00c0 propos", href: "#cycle" },
      { label: "Enregistrer", href: "#inscription" },
      { label: "Plus", href: "#faq", withChevron: true },
      { label: "Contact", href: "#contact" },
    ],
    partners: "Partenaires",
    login: "Connexion",
    logout: "Déconnexion",
    myAccount: "Mon compte",
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
    headingLine1: "Le Registre national",
    headingLine2: "des biens personnels",
    description:
      "Le RNBP couvre plus de 48 cat\u00e9gories de biens, incluant le mat\u00e9riel roulant, l\u2019\u00e9lectronique, les outils sp\u00e9cialis\u00e9s et d\u2019autres articles de valeur.",
    tagline:
      "Une preuve claire de propri\u00e9t\u00e9, au m\u00eame endroit.",
    imageAlt: "Tracteur \u00e0 gazon",
    viewCategoriesLink: "Voir cat\u00e9gories des biens",
  },
  allCategories: {
    heading: "48 cat\u00e9gories de biens admissibles",
    description:
      "Le RNBP vous permet d\u2019enregistrer tout bien personnel d\u2019une valeur de plus de 1\u00a0000\u00a0$.",
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
          "Oui. Le RNBP respecte les lois f\u00e9d\u00e9rales sur la protection des donn\u00e9es. Vos informations personnelles ne sont jamais vendues ni partag\u00e9es sans consentement.",
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
          "Chaque ann\u00e9e, des milliers de biens sont perdus ou vol\u00e9s au Canada, et la majorit\u00e9 ne sont jamais retrouv\u00e9s. Sans preuve centralis\u00e9e de propri\u00e9t\u00e9, il est difficile pour la police d\u2019identifier un propri\u00e9taire et pour les assureurs de traiter efficacement une r\u00e9clamation. Le RNBP cr\u00e9e une preuve officielle, s\u00e9curis\u00e9e et dat\u00e9e de vos biens \u2014 num\u00e9ro de s\u00e9rie, photos, preuves d\u2019achat \u2014 dans un dossier unique. Il transforme un objet anonyme en bien identifiable, rend la revente de biens vol\u00e9s beaucoup plus difficile et acc\u00e9l\u00e8re vos d\u00e9marches de restitution.",
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
      "\u00a9 {{year}} Registre national des biens personnels. Tous droits r\u00e9serv\u00e9s.",
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
    logoAlt: "RNBP",
  },
  auth: {
    loginHeading: "Connexion",
    loginDescription: "Connectez-vous à votre compte RNBP",
    registerHeading: "Créer un compte",
    registerDescription: "Inscrivez-vous pour enregistrer vos biens",
    emailLabel: "Courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "8 caractères minimum, 1 majuscule, 1 chiffre",
    firstNameLabel: "Prénom",
    lastNameLabel: "Nom",
    phoneLabel: "Téléphone",
    optional: "optionnel",
    loginButton: "Se connecter",
    loggingIn: "Connexion...",
    registerButton: "Créer mon compte",
    registering: "Inscription...",
    noAccount: "Pas encore de compte?",
    registerLink: "Créer un compte",
    hasAccount: "Déjà un compte?",
    loginLink: "Se connecter",
  },
  dashboard: {
    heading: "Tableau de bord",
    welcome: "Bienvenue, {{name}}",
    noItems: "Aucun bien enregistré pour le moment.",
    addItem: "Enregistrer un bien",
    reportTheft: "Déclarer un vol",
    statuses: {
      active: "Actif",
      stolen: "Volé",
      recovered: "Récupéré",
      transferred: "Transféré",
    },
  },
  registration: {
    heading: "Enregistrer un bien",
    description: "Remplissez le formulaire pour enregistrer votre bien dans le RNBP.",
    step1Title: "Informations du bien",
    step2Title: "Photos et documents",
    step3Title: "Créer votre compte",
    categoryLabel: "Catégorie",
    categoryPlaceholder: "Sélectionnez une catégorie",
    nameLabel: "Nom du bien",
    brandLabel: "Marque",
    modelLabel: "Modèle",
    serialLabel: "Numéro de série",
    valueLabel: "Valeur estimée ($)",
    descriptionLabel: "Description",
    termsCheckbox: "J'accepte les conditions d'utilisation",
    continueButton: "Continuer",
    backButton: "Retour",
    photosHeading: "Photos du bien",
    photosDescription: "Ajoutez jusqu'à 5 photos de votre bien (max 10 Mo chacune).",
    dropzoneText: "Glissez vos photos ici ou cliquez pour sélectionner",
    documentsHeading: "Documents justificatifs",
    documentsDescription: "Preuve d'achat, certificat d'authenticité (optionnel).",
    confirmButton: "Confirmer l'enregistrement",
    successHeading: "Bien enregistré avec succès !",
    successDescription: "Votre bien a été enregistré dans le RNBP. Conservez votre numéro RNBP.",
    rnbpNumberLabel: "Votre numéro RNBP",
    goToDashboard: "Voir mon tableau de bord",
  },
  report: {
    heading: "Déclarer un vol",
    description: "Le formulaire de déclaration de vol sera disponible prochainement.",
  },
  lookup: {
    heading: "Vérifier un bien",
    description: "Entrez un numéro RNBP pour vérifier le statut d'un bien.",
    inputPlaceholder: "RNBP-XXXXXXXX",
    searchButton: "Vérifier",
    searching: "Recherche...",
    foundMessage: "Bien trouvé dans le registre",
    stolenMessage: "Ce bien a été déclaré volé",
    notFoundMessage: "Aucun bien trouvé avec ce numéro.",
  },
  partners: {
    heading: "Devenez partenaire du RNBP",
    description: "Le Registre national des biens personnels collabore avec des assureurs, des détaillants et des organismes de sécurité publique à travers le Canada. Ensemble, nous protégeons les biens de valeur des Canadiens et facilitons leur restitution.",
    whyPartner: "Pourquoi devenir partenaire ?",
    benefits: [
      "Accès au réseau de vérification RNBP pour authentifier les biens de vos clients",
      "Visibilité auprès de milliers de propriétaires de biens enregistrés",
      "Réduction des fraudes grâce à la traçabilité des biens de valeur",
      "Intégration API pour connecter vos systèmes au registre RNBP",
      "Programme de rabais co-marqué pour fidéliser vos assurés",
    ],
    ctaHeading: "Intéressé à rejoindre le réseau ?",
    ctaDescription: "Contactez notre équipe de partenariats pour discuter des possibilités de collaboration adaptées à votre entreprise.",
    ctaButton: "Nous contacter",
    contactEmail: "partenaires@rnbp.ca",
  },
  insurance: {
    heading: "Obtenez un rabais sur votre assurance",
    description: "La plupart des assureurs offrent un rabais aux membres du RNBP. Sélectionnez votre assureur et contactez-le pour vérifier si vous êtes éligible.",
    selectLabel: "Votre assureur",
    selectPlaceholder: "Sélectionnez votre assureur",
    messageLabel: "Message pré-rempli",
    messageTemplate: "Bonjour {{insurer}}, je viens d'inscrire mes biens de valeur sur le RNBP (Registre national des biens personnels). J'aimerais vérifier avec vous si je suis éligible à un rabais sur mon assurance maison.",
    sendButton: "Copier le message",
    copiedToast: "Message copié ! Envoyez-le à votre assureur.",
  },
  legal: {
    privacyHeading: "Politique de confidentialité",
    privacyContent: [
      {
        title: "1. Collecte de renseignements personnels",
        body: "Le RNBP recueille uniquement les renseignements nécessaires à la création de votre compte et à l'enregistrement de vos biens : nom, adresse courriel, numéro de téléphone (facultatif), ainsi que les informations descriptives de vos biens (catégorie, marque, modèle, numéro de série, photos). Ces renseignements sont fournis volontairement lors de votre inscription.",
      },
      {
        title: "2. Utilisation des renseignements",
        body: "Vos renseignements sont utilisés pour : gérer votre compte et authentifier votre identité; enregistrer et identifier vos biens dans le registre; faciliter la restitution de biens perdus ou volés; vous envoyer des communications relatives à votre compte (vérification courriel, réinitialisation de mot de passe); améliorer nos services. Nous ne vendons ni ne louons vos renseignements personnels à des tiers.",
      },
      {
        title: "3. Protection des données",
        body: "Vos données sont protégées par des mesures de sécurité conformes aux normes de l'industrie : chiffrement des mots de passe (Argon2id), communications chiffrées (TLS/HTTPS), jetons d'authentification signés (EdDSA), sauvegardes chiffrées quotidiennes. L'accès aux données est limité au personnel autorisé selon le principe du moindre privilège.",
      },
      {
        title: "4. Conservation et suppression",
        body: "Vos données sont conservées aussi longtemps que votre compte est actif. Vous pouvez demander la suppression de votre compte et de vos données à tout moment en nous contactant. Les déclarations de vol sont conservées à des fins de traçabilité même après la suppression du compte, conformément aux obligations légales applicables.",
      },
      {
        title: "5. Vérification publique",
        body: "La fonction de vérification publique (recherche par numéro RNBP) ne divulgue aucune information personnelle sur le propriétaire. Seul le statut du bien (enregistré, déclaré volé) est affiché.",
      },
      {
        title: "6. Cookies et technologies similaires",
        body: "Le RNBP utilise des cookies strictement nécessaires au fonctionnement du site (authentification, préférences linguistiques). Aucun cookie de suivi publicitaire ou d'analyse tiers n'est utilisé.",
      },
      {
        title: "7. Modifications",
        body: "Nous nous réservons le droit de modifier cette politique. Toute modification importante vous sera communiquée par courriel ou par un avis sur le site. La date de dernière mise à jour est indiquée en bas de cette page.",
      },
      {
        title: "8. Contact",
        body: "Pour toute question relative à la protection de vos renseignements personnels, contactez-nous à confidentialite@rnbp.ca.",
      },
    ],
    termsHeading: "Conditions d'utilisation",
    termsContent: [
      {
        title: "1. Acceptation des conditions",
        body: "En utilisant le site et les services du Registre national des biens personnels (RNBP), vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.",
      },
      {
        title: "2. Description du service",
        body: "Le RNBP offre un service gratuit d'enregistrement de biens personnels de valeur. Le registre permet aux utilisateurs de documenter leurs biens, de déclarer des vols et de vérifier le statut d'un bien à l'aide de son numéro RNBP unique. Le service est offert « tel quel » et le RNBP ne garantit pas la récupération d'un bien perdu ou volé.",
      },
      {
        title: "3. Inscription et compte",
        body: "Vous devez fournir des informations exactes et à jour lors de votre inscription. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte. Vous devez nous aviser immédiatement de toute utilisation non autorisée de votre compte.",
      },
      {
        title: "4. Enregistrement de biens",
        body: "Vous ne pouvez enregistrer que des biens dont vous êtes le propriétaire légitime. L'enregistrement d'un bien ne constitue pas une preuve de propriété au sens juridique. Il est interdit d'enregistrer des biens volés, contrefaits ou illégaux. Le RNBP se réserve le droit de supprimer tout enregistrement frauduleux.",
      },
      {
        title: "5. Déclaration de vol",
        body: "En déclarant un bien comme volé sur le RNBP, vous attestez que cette déclaration est véridique. Les fausses déclarations de vol sont interdites et peuvent entraîner la suspension de votre compte ainsi que des poursuites légales. Nous vous encourageons à déposer également un rapport auprès de votre service de police local.",
      },
      {
        title: "6. Contenu utilisateur",
        body: "Vous conservez la propriété des photos et documents que vous téléversez. En les soumettant, vous accordez au RNBP une licence non exclusive d'utilisation pour le fonctionnement du service. Vous garantissez que le contenu téléversé ne viole aucun droit de propriété intellectuelle ni aucune loi applicable.",
      },
      {
        title: "7. Limitation de responsabilité",
        body: "Le RNBP ne peut être tenu responsable de tout dommage direct, indirect ou consécutif résultant de l'utilisation ou de l'impossibilité d'utiliser le service. Le RNBP ne garantit pas la disponibilité ininterrompue du service et ne peut être tenu responsable des pertes de données dues à des circonstances hors de son contrôle.",
      },
      {
        title: "8. Résiliation",
        body: "Vous pouvez fermer votre compte à tout moment. Le RNBP se réserve le droit de suspendre ou de fermer un compte en cas de violation des présentes conditions, sans préavis.",
      },
      {
        title: "9. Loi applicable",
        body: "Les présentes conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables. Tout litige sera soumis aux tribunaux compétents du district judiciaire de Montréal.",
      },
      {
        title: "10. Modifications",
        body: "Le RNBP se réserve le droit de modifier les présentes conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. L'utilisation continue du service après une modification constitue votre acceptation des nouvelles conditions.",
      },
    ],
  },
  errors: {
    serviceUnavailable: "Service temporairement indisponible",
    serviceUnavailableDescription: "Nos serveurs sont temporairement inaccessibles. Veuillez réessayer dans quelques instants.",
    notFound: "Page introuvable",
    notFoundDescription: "La page que vous cherchez n'existe pas ou a été déplacée.",
    backHome: "Retour à l'accueil",
  },
};

export default fr;
