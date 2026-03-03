export type NavItem = {
  label: string;
  href: string;
  withChevron?: boolean;
};

export type CategoryItem = {
  label: string;
  image: string;
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

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    items: NavItem[];
    partners: string;
    login: string;
  };
  hero: {
    subtitleLine1: string;
    titleLine1: string;
    tagline: string;
    description: string;
    freeLabel: string;
    insurancePromo: string;
    imageAlt: string;
  };
  categories: {
    heading: string;
    description: string;
    minValueLabel: string;
    items: CategoryItem[];
    viewCategoriesLink: string;
  };
  cycle: {
    heading: string;
    imageAlt: string;
    actions: CyclePoint[];
    benefits: CyclePoint[];
  };
  registrationPromo: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    linkText: string;
    imageAlt: string;
  };
  rollingRegistry: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    tagline: string;
    imageAlt: string;
  };
  protectionCta: {
    headingLine1: string;
    headingLine2: string;
    description: string;
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
};
