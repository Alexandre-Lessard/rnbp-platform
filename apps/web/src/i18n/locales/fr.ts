import type { SiteContent } from "@/types/content";

const fr: SiteContent = {
  meta: {
    title: "Registre national des biens personnels",
    description:
      "Registre national des biens personnels \u2014 prot\u00e9gez et retrouvez vos biens de valeur.",
  },
  pages: {
    home: {
      title: "Protégez et retrouvez vos biens de valeur | RNBP Canada",
      description: "Enregistrez vos biens de valeur dans un registre sécurisé. Protégez et retrouvez vos biens en cas de perte ou de vol.",
    },
    faq: {
      title: "Questions fréquentes | RNBP",
      description: "Trouvez les réponses aux questions courantes sur l'enregistrement de vos biens au Registre national des biens personnels.",
    },
    partners: {
      title: "Devenez partenaire | RNBP",
      description: "Collaborez avec le RNBP : assureurs, détaillants et organismes de sécurité publique à travers le Canada.",
    },
    privacy: {
      title: "Politique de confidentialité | RNBP",
      description: "Découvrez comment le RNBP protège vos renseignements personnels et respecte les lois fédérales sur la vie privée.",
    },
    terms: {
      title: "Conditions d'utilisation | RNBP",
      description: "Consultez les conditions d'utilisation du Registre national des biens personnels.",
    },
    lookup: {
      title: "Vérifier un bien | RNBP",
      description: "Entrez un numéro RNBP pour vérifier le statut d'un bien enregistré dans le registre.",
    },
    login: {
      title: "Connexion | RNBP",
      description: "Connectez-vous à votre compte RNBP pour gérer vos biens enregistrés.",
    },
    register: {
      title: "Créer un compte | RNBP",
      description: "Inscrivez-vous gratuitement au RNBP pour enregistrer et protéger vos biens de valeur.",
    },
    contact: {
      title: "Contactez-nous | RNBP",
      description: "Une question ou un commentaire\u00a0? Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.",
    },
    shop: {
      title: "Boutique | RNBP",
      description: "Achetez des étiquettes d'identification RNBP pour protéger vos biens de valeur.",
    },
    shopSuccess: {
      title: "Commande confirmée | RNBP",
      description: "Votre commande a été confirmée avec succès.",
    },
  },
  nav: {
    items: [
      { label: "Accueil", href: "#accueil" },
      { label: "\u00c0 propos", href: "#cycle" },
      { label: "Enregistrer", href: "#inscription" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Partenaires", href: "/partenaires" },
    ],
    partners: "Partenaires",
    login: "Connexion",
    logout: "Déconnexion",
    myAccount: "Mon compte",
  },
  hero: {
    subtitleLine1: "Protéger et retrouver",
    titleLine1: "Vos biens",
    tagline: "C\u2019est simple et rapide",
    description:
      "Enregistrez vos biens de valeur dans un registre s\u00e9curis\u00e9 afin de simplifier leur identification et d\u2019augmenter vos chances de restitution en cas de perte ou de vol.",
    freeLabel: "Enregistrement 100% gratuit",
    insurancePromo: "Enregistrez vos biens et obtenez un rabais sur votre assurance habitation",
    imageAlt:
      "V\u00e9lo, laptop, cellulaire, montre, voiturette de golf et autres biens",
    trustBadges: [
      { label: "Donn\u00e9es h\u00e9berg\u00e9es au Canada" },
      { label: "Chiffrement avanc\u00e9" },
      { label: "Services policiers partenaires" },
      { label: "Compatible avec les assureurs" },
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
  },
  rollingRegistry: {
    headingLine1: "Le Registre national",
    headingLine2: "des biens personnels",
    description:
      "Le RNBP couvre une grande variété de biens, incluant le matériel roulant, l\u2019électronique, les outils spécialisés et d\u2019autres articles de valeur.",
    tagline:
      "Une preuve claire de propri\u00e9t\u00e9, au m\u00eame endroit.",
    imageAlt: "Tracteur \u00e0 gazon",
    viewCategoriesLink: "Voir cat\u00e9gories des biens",
  },
  allCategories: {
    heading: "Types de biens admissibles",
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
      "\u00c9quipement de gym",
      "Machine \u00e0 coudre industrielle",
      "Instrument d\u2019optique",
      "Véhicules",
      "Équipements agricoles",
      "Équipements jardiniers",
      "Souffleuses à neige",
      "Bateaux",
      "Équipements nautiques",
      "Autres",
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
    buttonText: "Voir toutes les questions",
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
      {
        question: "Quels types de biens puis-je enregistrer\u00a0?",
        answer:
          "Vous pouvez enregistrer tous types de biens personnels de valeur\u00a0: v\u00e9los, outils, appareils \u00e9lectroniques, instruments de musique, \u00e9quipements sportifs, bijoux, etc.",
      },
      {
        question: "Pourquoi enregistrer mes biens avant qu\u2019un vol survienne\u00a0?",
        answer:
          "L\u2019enregistrement pr\u00e9alable permet de prouver la propri\u00e9t\u00e9 et de faciliter l\u2019identification d\u2019un bien s\u2019il est retrouv\u00e9. De plus, certains assureurs pourraient offrir un rabais sur l\u2019assurance habitation lorsque les biens sont enregistr\u00e9s avant qu\u2019un vol ne soit d\u00e9clar\u00e9.",
      },
      {
        question: "Qui peut consulter les informations du registre\u00a0?",
        answer: {
          intro: "L\u2019accès aux informations du registre est encadré afin de protéger la confidentialité des propriétaires.",
          bullets: [
            { label: "Les services policiers", text: "ont un accès complet au registre afin de pouvoir identifier rapidement le propriétaire d\u2019un bien retrouvé ou suspecté d\u2019être volé." },
            { label: "Les compagnies d\u2019assurance", text: "peuvent également consulter certaines informations dans le cadre d\u2019une réclamation ou pour faciliter la récupération d\u2019un bien assuré." },
            { label: "Le public", text: ", quant à lui, peut effectuer des **recherches de vérification** (par exemple avant l\u2019achat d\u2019un bien d\u2019occasion), mais **n\u2019a pas accès aux informations personnelles du propriétaire**." },
          ],
        },
      },
      {
        question: "Puis-je enregistrer un bien sans num\u00e9ro de s\u00e9rie\u00a0?",
        answer:
          "Oui. Il est possible d\u2019enregistrer un bien en ajoutant des photos, une description d\u00e9taill\u00e9e et d\u2019autres caract\u00e9ristiques permettant de l\u2019identifier. Toutefois, l\u2019ajout d\u2019un num\u00e9ro de s\u00e9rie est recommand\u00e9. L\u2019utilisation d\u2019autocollants d\u2019enregistrement disponibles dans la boutique en ligne du RNBP permet \u00e9galement d\u2019am\u00e9liorer l\u2019identification du bien.",
      },
      {
        question: "Comment puis-je r\u00e9cup\u00e9rer mon bien\u00a0?",
        answer:
          "Lorsqu\u2019un bien enregistr\u00e9 au RNBP est retrouv\u00e9, celui-ci est pris en charge par le registre afin d\u2019en v\u00e9rifier l\u2019identification et la propri\u00e9t\u00e9. Une fois la propri\u00e9t\u00e9 confirm\u00e9e gr\u00e2ce aux informations enregistr\u00e9es (photos, description, num\u00e9ro de s\u00e9rie, etc.), le RNBP communique avec le propri\u00e9taire et organise la restitution du bien.",
      },
      {
        question: "Y a-t-il des frais pour r\u00e9cup\u00e9rer mon bien\u00a0?",
        answer:
          "Oui. Des frais administratifs peuvent s\u2019appliquer pour couvrir les co\u00fbts li\u00e9s \u00e0 la gestion du dossier, \u00e0 l\u2019identification du bien, \u00e0 la r\u00e9cup\u00e9ration et \u00e0 l\u2019organisation de sa restitution au propri\u00e9taire. Les frais exacts peuvent varier selon la situation et la nature du bien r\u00e9cup\u00e9r\u00e9.",
      },
      {
        question: "Combien de biens puis-je enregistrer\u00a0?",
        answer: "Vous pouvez enregistrer autant de biens que vous le souhaitez.",
      },
      {
        question: "Puis-je enregistrer les biens de ma famille\u00a0?",
        answer:
          "Oui. Un seul compte peut enregistrer les biens de plusieurs membres d\u2019un m\u00eame foyer.",
      },
      {
        question: "Puis-je transf\u00e9rer un bien enregistr\u00e9\u00a0?",
        answer:
          "Oui. Si vous vendez ou donnez un bien, vous pouvez mettre \u00e0 jour son statut ou le transf\u00e9rer sans frais.",
      },
      {
        question: "Le registre fonctionne-t-il partout au pays\u00a0?",
        answer:
          "Oui. Le registre est con\u00e7u pour fonctionner \u00e0 l\u2019\u00e9chelle nationale. Les biens vol\u00e9s dans une province sont souvent revendus dans une autre province, ce qui rend essentiel l\u2019existence d\u2019un registre national pour faciliter leur identification et leur r\u00e9cup\u00e9ration.",
      },
      {
        question: "Puis-je enregistrer un bien achet\u00e9 usag\u00e9\u00a0?",
        answer:
          "Oui. Il est recommand\u00e9 d\u2019enregistrer un bien d\u00e8s que vous en devenez le propri\u00e9taire.",
      },
      {
        question: "Que faire si je retrouve mon bien vol\u00e9\u00a0?",
        answer:
          "Vous pouvez simplement mettre \u00e0 jour son statut dans votre compte.",
      },
      {
        question: "Dois-je ajouter des photos de mes biens\u00a0?",
        answer:
          "Les photos ne sont pas obligatoires mais fortement recommand\u00e9es pour faciliter l\u2019identification.",
      },
      {
        question: "Le registre peut-il aider \u00e0 dissuader le vol\u00a0?",
        answer:
          "Oui. Un objet enregistr\u00e9 et identifiable RNBP est plus difficile \u00e0 revendre et peut \u00eatre plus facilement retrac\u00e9.",
      },
      {
        question: "Puis-je supprimer mon compte\u00a0?",
        answer:
          "Oui. Vous pouvez supprimer votre compte et les informations associ\u00e9es \u00e0 tout moment.",
      },
      {
        question: "Est-ce que mes informations personnelles sont visibles publiquement\u00a0?",
        answer:
          "Non. Les informations personnelles ne sont pas rendues publiques.",
      },
      {
        question: "Comment le registre aide-t-il \u00e0 retrouver un bien\u00a0?",
        answer:
          "Tous les corps policiers ont acc\u00e8s au registre 24\u00a0h/24 afin de faciliter l\u2019identification du propri\u00e9taire lorsqu\u2019un bien est retrouv\u00e9. Gr\u00e2ce aux informations enregistr\u00e9es, il devient plus simple et rapide de retracer et de restituer le bien \u00e0 son propri\u00e9taire l\u00e9gitime.",
      },
      {
        question: "Le registre remplace-t-il une assurance\u00a0?",
        answer:
          "Non. Le registre ne remplace pas une assurance, mais il peut faciliter certaines d\u00e9marches en cas de vol.",
      },
      {
        question: "Si mon bien est d\u00e9j\u00e0 assur\u00e9 par mon assurance habitation, dois-je quand m\u00eame l\u2019enregistrer sur le RNBP\u00a0?",
        answer:
          "Oui. L\u2019enregistrement de votre bien au RNBP peut r\u00e9duire les cons\u00e9quences d\u2019un vol dans le cas o\u00f9 le bien serait retrouv\u00e9. Celui-ci pourrait alors \u00eatre identifi\u00e9 et restitu\u00e9 \u00e0 son propri\u00e9taire ou \u00e0 l\u2019assureur, ce qui peut diminuer les pertes li\u00e9es au sinistre.",
      },
      {
        question: "Quel est l\u2019avantage pour mon assureur habitation de me donner un rabais\u00a0?",
        answer:
          "Certains biens sont couverts par l\u2019assurance habitation. Si un assureur indemnise un assur\u00e9 \u00e0 la suite d\u2019un vol et que le bien est retrouv\u00e9 par la suite gr\u00e2ce au registre, celui-ci peut \u00eatre r\u00e9cup\u00e9r\u00e9 et remis \u00e0 l\u2019assureur. Cela permet de r\u00e9duire la perte financi\u00e8re li\u00e9e \u00e0 l\u2019indemnisation, ce qui explique pourquoi certains assureurs offrent un rabais aux assur\u00e9s qui enregistrent leurs biens au RNBP.",
      },
      {
        question: "Quels biens n\u2019est-il pas n\u00e9cessaire d\u2019enregistrer au RNBP\u00a0?",
        answer:
          "Les immeubles, les v\u00e9hicules immatricul\u00e9s et les armes \u00e0 feu n\u2019ont g\u00e9n\u00e9ralement pas besoin d\u2019\u00eatre enregistr\u00e9s au RNBP, car ces biens disposent d\u00e9j\u00e0 de leurs propres registres officiels. Le RNBP vise principalement les biens personnels qui ne sont pas couverts par un registre existant.",
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
    alreadyInCartTitle: "Déjà dans le panier",
    alreadyInCartDescription: "Cet article est déjà dans votre panier. Voulez-vous en ajouter un autre ?",
    alreadyInCartConfirm: "Oui, ajouter",
    alreadyInCartCancel: "Non merci",
    alreadyInCartViewCart: "Voir le panier",
    awaitingNumber: "En attente d'attribution",
    clientNumber: "No. client",
  },
  registration: {
    heading: "Enregistrer un bien",
    description: "Remplissez le formulaire pour enregistrer votre bien dans le RNBP.",
    step1Title: "Informations du bien",
    step2Title: "Photos et documents",
    step3Title: "Protection",
    step4Title: "Créer votre compte",
    categoryLabel: "Catégorie",
    categoryPlaceholder: "Sélectionnez une catégorie",
    nameLabel: "Nom du bien",
    brandLabel: "Marque",
    modelLabel: "Modèle",
    yearLabel: "Année",
    serialLabel: "Numéro de série (original)",
    serialExplanation: "Si votre bien possède un numéro de série du fabricant, entrez-le ici.",
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
    successDescription: "Votre bien a été enregistré dans le RNBP.",
    successNoNumber: "Commandez des autocollants dans la boutique pour recevoir votre numéro RNBP unique.",
    rnbpNumberLabel: "Votre numéro RNBP",
    goToDashboard: "Voir mon tableau de bord",
    stickerHeading: "Protégez votre bien avec nos étiquettes d'identification",
    stickerPitch: "Nos étiquettes inaltérables affichent votre numéro RNBP unique. Apposez-les sur vos biens pour faciliter leur identification et leur récupération en cas de vol. Effet dissuasif garanti.",
    stickerCta: "Commander mes étiquettes",
    addToCart: "Ajouter au panier",
    addedToCart: "Ajouté au panier !",
    viewShop: "Voir la boutique",
  },
  shop: {
    heading: "Boutique",
    productName: "Feuille de 20 autocollants d'identification RNBP",
    productDescription: "Étiquettes inaltérables avec votre numéro RNBP unique. Apposez-les sur vos biens de valeur pour les identifier et les protéger contre le vol.",
    productFeatures: [
      "Matériau inaltérable et résistant aux intempéries",
      "Numéro RNBP unique pour chaque bien",
      "Identification rapide en cas de perte ou vol",
      "Effet dissuasif contre le vol",
    ],
    productImageAlt: "Feuille de 20 autocollants d'identification RNBP",
    priceLabel: "Prix",
    quantityLabel: "Quantité",
    buyButton: "Acheter",
    cartTitle: "Votre panier",
    cartEmpty: "Votre panier est vide.",
    cartEmptyAction: "Ajouter une feuille d'autocollants",
    checkout: "Passer à la caisse",
    checkingOut: "Redirection...",
    removeItem: "Retirer",
    subtotal: "Sous-total",
    perSheet: "/ feuille",
    successHeading: "Merci pour votre achat !",
    successDescription: "Vous recevrez un courriel de confirmation de Stripe avec les détails de votre commande.",
    backToShop: "Retour à la boutique",
    backToHome: "Retour à l'accueil",
    orderStickers: "Commander des étiquettes",
    selectItemLabel: "Pour quel bien ?",
    noItemsMessage: "Vous devez d'abord enregistrer un bien pour commander des autocollants.",
    noItemsLink: "Enregistrer un bien",
    loginRequired: "Connectez-vous pour commander des autocollants.",
    loginLink: "Se connecter",
    addButton: "Ajouter au panier",
    comingSoonBanner: "Boutique bientôt disponible — explorez nos produits en attendant\u00a0!",
    comingSoonCheckout: "La boutique ouvrira bientôt",
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
    policeAccordion: {
      title: "Découvrez les avantages pour la police",
      intro: "Le Registre national des biens personnels (RNBP) est une infrastructure numérique visant à améliorer l\u2019identification, la traçabilité et la restitution des biens volés ou retrouvés au Canada.\nEn collaborant avec les services policiers, le RNBP permet d\u2019optimiser la gestion des biens retrouvés, de réduire les tâches administratives et d\u2019augmenter le taux de restitution aux propriétaires légitimes.",
      subheading: "Les avantages pour les services policiers",
      advantages: [
        { title: "Identification rapide des biens retrouvés", text: "Grâce au registre national, les policiers peuvent vérifier rapidement si un objet (vélo, outil, appareil électronique, etc.) est enregistré et identifier son propriétaire en quelques secondes." },
        { title: "Gain d\u2019efficacité opérationnelle", text: "Le RNBP réduit le temps consacré à la recherche de propriétaires et à la gestion administrative des objets retrouvés." },
        { title: "Réduction de l\u2019entreposage dans les postes de police", text: "Les salles d\u2019entreposage des services policiers sont souvent remplies de biens non identifiés. Le registre permet de retrouver plus rapidement les propriétaires et de libérer de l\u2019espace." },
        { title: "Amélioration du travail d\u2019enquête", text: "Les biens enregistrés incluent souvent des photos, numéros de série et descriptions détaillées, facilitant la preuve de propriété et certaines enquêtes." },
        { title: "Lutte contre le recel", text: "La traçabilité des biens rend la revente d\u2019objets volés plus difficile et contribue à décourager certains réseaux de revente illégale." },
        { title: "Augmentation du taux de restitution", text: "Les biens retrouvés peuvent être retournés beaucoup plus rapidement à leurs propriétaires, améliorant la satisfaction des citoyens." },
        { title: "Réduction des procédures liées aux biens non réclamés", text: "Moins d\u2019objets non identifiés signifie moins de ventes aux enchères, moins de destruction de matériel et moins de gestion administrative." },
        { title: "Service de récupération et de restitution offert par le RNBP", text: "Le registre peut également prendre en charge la coordination de la récupération et de la restitution des biens au propriétaire, ce qui réduit encore davantage les tâches logistiques pour les services policiers." },
        { title: "Collaboration facilitée avec les assureurs", text: "Le registre permet de coordonner efficacement les dossiers impliquant des assureurs lorsque les biens volés ont déjà fait l\u2019objet d\u2019une indemnisation." },
        { title: "Intégration technologique", text: "Le RNBP offre aux services policiers un accès gratuit à une application dotée d\u2019intelligence artificielle permettant d\u2019effectuer des vérifications automatisées et instantanées dans le registre national, afin d\u2019identifier rapidement le propriétaire d\u2019un bien retrouvé et faciliter sa restitution." },
        { title: "Amélioration de la relation avec les citoyens", text: "La restitution rapide des biens volés renforce la confiance du public envers les services policiers." },
      ],
    },
    insurerAccordion: {
      title: "Découvrez les avantages pour les assurances",
      intro: "Le Registre national des biens personnels (RNBP) collabore avec les assureurs afin d\u2019améliorer la traçabilité des biens de valeur et d\u2019augmenter les chances de récupération en cas de vol.\nEn facilitant l\u2019identification et la restitution des biens retrouvés, le RNBP contribue à réduire les pertes financières liées aux réclamations d\u2019assurance et à améliorer l\u2019efficacité du traitement des dossiers.",
      subheading: "Les avantages pour les assureurs",
      advantages: [
        { title: "Réduction des pertes liées aux vols", text: "La possibilité d\u2019identifier et de récupérer un bien volé peut permettre à l\u2019assureur de réduire ou d\u2019éviter une indemnisation complète." },
        { title: "Récupération de biens déjà indemnisés", text: "Lorsqu\u2019un bien est retrouvé après indemnisation, le registre facilite l\u2019identification de l\u2019assureur afin de permettre la récupération de l\u2019actif ou la réduction de la perte financière." },
        { title: "Réduction de certaines fraudes", text: "La traçabilité des biens enregistrés permet de limiter les déclarations frauduleuses et de mieux vérifier la propriété des objets réclamés." },
        { title: "Preuve de propriété facilitée", text: "Les biens enregistrés incluent souvent photos, numéros de série et descriptions, ce qui peut simplifier la validation des réclamations." },
        { title: "Accélération du traitement des dossiers", text: "Les informations déjà présentes dans le registre permettent d\u2019accélérer l\u2019analyse et le traitement des réclamations." },
        { title: "Amélioration de la prévention du vol", text: "Les biens enregistrés et identifiés deviennent moins attrayants pour les voleurs, ce qui peut contribuer à réduire certains types de sinistres." },
        { title: "Réduction du coût moyen des réclamations", text: "Une meilleure traçabilité et un taux de récupération plus élevé peuvent contribuer à réduire le coût global des sinistres liés au vol." },
        { title: "Outil de prévention pour les assurés", text: "Les assureurs peuvent recommander l\u2019utilisation du registre à leurs clients comme mesure proactive de protection des biens." },
        { title: "Amélioration de la relation client", text: "La possibilité d\u2019augmenter les chances de récupération d\u2019un bien volé peut renforcer la satisfaction et la fidélité des assurés." },
        { title: "Intégration technologique", text: "Le RNBP peut offrir une intégration API avec les systèmes d\u2019assurance, facilitant les vérifications automatisées lors du traitement des réclamations." },
        { title: "Gestion de la récupération et de la revente des biens retrouvés", text: "Le RNBP peut également prendre en charge la récupération des biens retrouvés, leur revente sur le marché secondaire et la remise des fonds à l\u2019assureur, permettant ainsi de réduire davantage les pertes financières tout en simplifiant la gestion logistique pour l\u2019assureur." },
      ],
      quote: "Le RNBP transforme un sinistre potentiel en actif récupérable.",
    },
    ctaDescription: "Contactez notre équipe de partenariats pour discuter des possibilités de collaboration adaptées à votre entreprise.",
    formHeading: "Envoyez-nous un message",
    nameLabel: "Nom complet",
    emailLabel: "Adresse courriel",
    companyLabel: "Entreprise (optionnel)",
    typeLabel: "Type de partenariat",
    messageLabel: "Message",
    typePlaceholder: "Sélectionnez un type",
    typeOptions: {
      insurer: "Assureur",
      retailer: "Détaillant",
      security: "Sécurité publique",
      other: "Autre",
    },
    submitButton: "Envoyer",
    submitting: "Envoi en cours…",
    successMessage: "Merci ! Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.",
    errorMessage: "Une erreur est survenue. Veuillez réessayer plus tard.",
  },
  contact: {
    heading: "Contactez-nous",
    description: "Une question, un commentaire ou une suggestion\u00a0? Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.",
    nameLabel: "Nom complet",
    emailLabel: "Adresse courriel",
    messageLabel: "Message",
    submitButton: "Envoyer",
    submitting: "Envoi en cours\u2026",
    successMessage: "Merci\u00a0! Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.",
    emailError: "Veuillez entrer une adresse courriel valide.",
    errorMessage: "Une erreur est survenue. Veuillez réessayer plus tard.",
  },
  insurance: {
    heading: "Obtenez un rabais sur votre assurance",
    description: "La plupart des assureurs offrent un rabais aux membres du RNBP. Sélectionnez votre assureur et contactez-le pour vérifier si vous êtes éligible.",
    selectLabel: "Votre assureur",
    selectPlaceholder: "Sélectionnez votre assureur",
    messageLabel: "Message pré-rempli",
    messageTemplate: "Bonjour {{insurer}}, ma résidence est assurée avec vous et je viens d'inscrire mes biens de valeur sur le RNBP (Registre national des biens personnels). J'aimerais vérifier avec vous si je suis éligible à un rabais sur mon assurance habitation.\n\nMerci",
    sendButton: "Copier le message",
    copiedToast: "Message copié ! Envoyez-le à votre assureur.",
    emailSubject: "Demande de rabais RNBP",
    emailButton: "Envoyer par courriel",
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
  verifyBeforeBuy: {
    headingAccent: "Vérifiez",
    heading: "avant d'acheter",
    description:
      "Consultez le registre pour savoir si un bien a été déclaré volé avant de l'acheter. Protégez-vous contre les achats frauduleux en quelques secondes.",
    buttonText: "Vérifier un bien",
    imageAlt: "Vérification d'un bien avant achat",
  },
  emailPending: {
    heading: "Vérification de courriel requise",
    description: "Un courriel de vérification a été envoyé à votre adresse. Cliquez sur le lien dans le courriel pour activer votre compte.",
    resendButton: "Renvoyer le courriel",
    resendSuccess: "Courriel envoyé!",
    logoutButton: "Se déconnecter",
    checkAgain: "J'ai vérifié mon courriel",
    notVerifiedYet: "Votre courriel n'est pas encore vérifié. Vérifiez votre boîte de réception.",
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
