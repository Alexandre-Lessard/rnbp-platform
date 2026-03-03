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

export type StatItem = {
  value: string;
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
  socialProof: {
    badge: string;
    stats: StatItem[];
  };
  cycle: {
    heading: string;
    imageAlt: string;
    actions: CyclePoint[];
    benefits: CyclePoint[];
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
};
