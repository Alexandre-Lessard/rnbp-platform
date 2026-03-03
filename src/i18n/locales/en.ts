import type { SiteContent } from "@/types/content";

const en: SiteContent = {
  meta: {
    title: "Canadian Personal Property Registry",
    description:
      "Canadian Personal Property Registry \u2014 protect and recover your valuable belongings.",
  },
  nav: {
    items: [
      { label: "Home", href: "#accueil" },
      { label: "Register", href: "#inscription" },
      { label: "About", href: "#cycle" },
      { label: "More", href: "#faq", withChevron: true },
      { label: "Contact", href: "#contact" },
    ],
    partners: "Partners",
    login: "Login",
  },
  hero: {
    subtitleLine1: "Protect and recover",
    titleLine1: "Your belongings",
    tagline: "Simple and practical",
    description:
      "Register your valuable belongings in a secure registry to simplify their identification and increase your chances of recovery in case of loss or theft.",
    freeLabel: "Registration is 100% free",
    insurancePromo: "Register your belongings and get a discount on your home insurance",
    imageAlt:
      "Bike, laptop, phone, watch, golf cart and other belongings",
  },
  categories: {
    heading: "Protect your valuables starting today",
    description:
      "The Canadian Personal Property Registry lets you register your precious possessions to facilitate their identification and recovery in case of theft.",
    minValueLabel: "You can register items valued over $1,000",
    items: [
      { label: "Electric Bike", image: "/assets/icon-bike.png" },
      { label: "Scooter", image: "/assets/icon-scooter.png" },
      { label: "Laptop", image: "/assets/icon-laptop.png" },
      { label: "Electric Scooter", image: "/assets/icon-escooter.png" },
      { label: "Golf Cart", image: "/assets/icon-golf-cart.png" },
      { label: "Watch", image: "/assets/icon-watch.png" },
    ],
    viewCategoriesLink: "View item categories",
  },
  cycle: {
    heading: "Property Registry Cycle",
    imageAlt: "Officer taking note of a stolen bike",
    actions: [
      {
        number: "01",
        title: "Register your item",
        description:
          "Add the brand, model, serial number and your proof of purchase.",
      },
      {
        number: "02",
        title: "Report in a few clicks",
        description:
          "In case of theft, immediately flag the item as stolen in the registry.",
      },
      {
        number: "03",
        title: "Speed up recovery",
        description:
          "Share a clear file that facilitates ownership verification.",
      },
    ],
    benefits: [
      {
        number: "01",
        title: "Benefit",
        description:
          "A traceable item is harder to resell and easier to identify.",
      },
      {
        number: "02",
        title: "Benefit",
        description:
          "Your information is centralized to react quickly at the right time.",
      },
      {
        number: "03",
        title: "Benefit",
        description:
          "You keep a structured proof of ownership for your procedures.",
      },
    ],
  },
  registrationPromo: {
    headingLine1: "Register and",
    headingLine2: "protect your belongings",
    description:
      "Create an account and document your valuable possessions to facilitate their identification and recovery.",
    linkText: "Access",
    imageAlt: "People discussing around a table",
  },
  rollingRegistry: {
    headingLine1: "The Canadian",
    headingLine2: "Personal Property Registry",
    description:
      "The CPPR covers over 47 categories of items, including rolling stock, electronics, specialized tools and other valuable articles.",
    tagline: "Clear proof of ownership, all in one place.",
    imageAlt: "Riding lawn mower",
  },
  protectionCta: {
    headingLine1: "Start protecting",
    headingLine2: "your belongings now",
    description:
      "Whether it\u2019s an electric bike, a golf cart, a riding lawn mower or any similar vehicle, register it for greater security and peace of mind.",
  },
  threeSteps: {
    heading: "Three clear steps",
    subtitle: "Get started now",
    learnMoreLink: "Learn more",
    steps: [
      {
        step: "Step 01",
        title: "Enter item details",
        description: "Brand, model, serial number",
        image: "/assets/step-details.png",
      },
      {
        step: "Step 02",
        title: "Attach documents and photos",
        description: "Proof of purchase, certificate of authenticity",
        image: "/assets/step-docs.png",
      },
      {
        step: "Step 03",
        title: "Confirm your registration",
        description: "Confirm and receive your number",
        image: "/assets/step-confirmation.png",
      },
    ],
  },
  faq: {
    heading: "FAQ",
    description:
      "Find answers to common questions about registering your belongings.",
    buttonText: "View FAQ",
    items: [
      {
        question: "How much does it cost?",
        answer:
          "Registering your belongings is completely free. No hidden fees, no subscription. You can register as many items as you want at no cost.",
      },
      {
        question: "What is the minimum threshold?",
        answer:
          "Items must have a value of at least $1,000. This limit ensures the registry focuses on articles of real importance.",
      },
      {
        question: "Is my data protected?",
        answer:
          "Yes. The CPPR complies with federal data protection laws. Your personal information is never sold or shared without consent.",
      },
      {
        question: "How long does registration take?",
        answer:
          "Less than three minutes. The form is designed to be fast and straightforward. You\u2019ll receive a confirmation number immediately after validation.",
      },
      {
        question: "Can I modify my registration?",
        answer:
          "Yes. Log in to your account to update the information. Changes are recorded in real time in the system.",
      },
      {
        question: "What happens if my item is stolen?",
        answer:
          "Report it immediately via the \u201cReport a stolen item\u201d section. Your item\u2019s status will be updated in the registry.",
      },
    ],
  },
  footer: {
    subscribeHeading: "Subscribe",
    emailPlaceholder: "Your email address",
    sendButton: "Send",
    disclaimer:
      "By subscribing, you agree to our privacy policy.",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    cookieSettings: "Cookie Settings",
    copyright:
      "\u00a9 {{year}} Canadian Personal Property Registry. All rights reserved.",
  },
  buttons: {
    registerItem: "Register an item",
    declareStolen: "Report a stolen item",
    signUp: "Sign up",
    verifyItem: "Verify an item",
  },
  a11y: {
    skipToContent: "Skip to main content",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    logoAlt: "CPPR",
  },
};

export default en;
