export type NavItem = {
  label: string;
  href: string;
  withChevron?: boolean;
};

export type CyclePoint = {
  number: string;
  title: string;
  description: string;
};

export type StepCard = {
  step: string;
  title: string;
  description: string;
  image: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TrustBadge = {
  label: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    items: NavItem[];
    partners: string;
    login: string;
    logout: string;
    myAccount: string;
  };
  hero: {
    subtitleLine1: string;
    titleLine1: string;
    tagline: string;
    description: string;
    freeLabel: string;
    insurancePromo: string;
    imageAlt: string;
    trustBadges: TrustBadge[];
  };
  cycle: {
    heading: string;
    imageAlt: string;
    actions: CyclePoint[];
  };
  rollingRegistry: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    tagline: string;
    imageAlt: string;
    viewCategoriesLink: string;
  };
  allCategories: {
    heading: string;
    description: string;
    toggleButton: string;
    items: string[];
  };
  protectionCta: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    imageAlt: string;
  };
  threeSteps: {
    heading: string;
    subtitle: string;
    learnMoreLink: string;
    steps: StepCard[];
  };
  faq: {
    heading: string;
    description: string;
    buttonText: string;
    items: FaqItem[];
  };
  footer: {
    subscribeHeading: string;
    emailPlaceholder: string;
    sendButton: string;
    disclaimer: string;
    privacyPolicy: string;
    termsOfUse: string;
    cookieSettings: string;
    copyright: string;
  };
  buttons: {
    registerItem: string;
    declareStolen: string;
    signUp: string;
    verifyItem: string;
  };
  a11y: {
    skipToContent: string;
    mainNav: string;
    mobileNav: string;
    logoAlt: string;
  };
  auth?: {
    loginHeading: string;
    loginDescription: string;
    registerHeading: string;
    registerDescription: string;
    emailLabel: string;
    passwordLabel: string;
    passwordHint: string;
    firstNameLabel: string;
    lastNameLabel: string;
    phoneLabel: string;
    optional: string;
    loginButton: string;
    loggingIn: string;
    registerButton: string;
    registering: string;
    noAccount: string;
    registerLink: string;
    hasAccount: string;
    loginLink: string;
  };
  dashboard?: {
    heading: string;
    welcome: string;
    noItems: string;
    addItem: string;
    reportTheft: string;
    statuses: Record<string, string>;
  };
  registration?: {
    heading: string;
    description: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    nameLabel: string;
    brandLabel: string;
    modelLabel: string;
    serialLabel: string;
    valueLabel: string;
    descriptionLabel: string;
    termsCheckbox: string;
    continueButton: string;
    backButton: string;
    photosHeading: string;
    photosDescription: string;
    dropzoneText: string;
    documentsHeading: string;
    documentsDescription: string;
    confirmButton: string;
    successHeading: string;
    successDescription: string;
    rnbpNumberLabel: string;
    goToDashboard: string;
  };
  report?: {
    heading: string;
    description: string;
  };
  lookup?: {
    heading: string;
    description: string;
    inputPlaceholder: string;
    searchButton: string;
    searching: string;
    foundMessage: string;
    stolenMessage: string;
    notFoundMessage: string;
  };
  partners?: {
    heading: string;
    description: string;
    whyPartner: string;
    benefits: string[];
    ctaDescription: string;
    formHeading: string;
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    typeLabel: string;
    messageLabel: string;
    typePlaceholder: string;
    typeOptions: { insurer: string; retailer: string; security: string; other: string };
    submitButton: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
  };
  legal?: {
    privacyHeading: string;
    privacyContent: { title: string; body: string }[];
    termsHeading: string;
    termsContent: { title: string; body: string }[];
  };
  insurance?: {
    heading: string;
    description: string;
    selectLabel: string;
    selectPlaceholder: string;
    messageLabel: string;
    messageTemplate: string;
    sendButton: string;
    copiedToast: string;
    emailSubject: string;
    emailButton: string;
  };
  errors?: {
    serviceUnavailable: string;
    serviceUnavailableDescription: string;
    notFound: string;
    notFoundDescription: string;
    backHome: string;
  };
};
