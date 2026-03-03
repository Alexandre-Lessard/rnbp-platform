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
    trustBadges: [
      { label: "Data hosted in Canada" },
      { label: "Advanced encryption" },
      { label: "Partner police services" },
      { label: "Compatible with insurers" },
    ],
  },
  socialProof: {
    badge: "In national deployment phase",
    stats: [
      { value: "15,000+", label: "items registered" },
      { value: "12+", label: "partner cities" },
      { value: "5+", label: "collaborating insurers" },
    ],
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
  rollingRegistry: {
    headingLine1: "The Canadian",
    headingLine2: "Personal Property Registry",
    description:
      "The CPPR covers over 48 categories of items, including rolling stock, electronics, specialized tools and other valuable articles.",
    tagline: "Clear proof of ownership, all in one place.",
    imageAlt: "Riding lawn mower",
    viewCategoriesLink: "View item categories",
  },
  allCategories: {
    heading: "48 eligible item categories",
    description:
      "The CPPR lets you register any personal property valued over $1,000.",
    toggleButton: "Show categories",
    items: [
      "Electric Bicycle",
      "Electric Kick Scooter",
      "Electric Scooter",
      "Golf Cart",
      "ATV / Quad",
      "Snowmobile",
      "Personal Watercraft",
      "Riding Lawn Mower",
      "Motorcycle",
      "Utility Trailer",
      "Laptop",
      "Desktop Computer",
      "Tablet",
      "Smartphone",
      "Camera",
      "Video Camera",
      "Drone",
      "Luxury Watch",
      "Jewellery",
      "Musical Instrument",
      "Sound Equipment",
      "Television",
      "Video Game Console",
      "Virtual Reality Equipment",
      "3D Printer",
      "Specialized Tool",
      "Welding Equipment",
      "Generator",
      "Compressor",
      "Professional Chainsaw",
      "Diving Equipment",
      "Kayak / Canoe",
      "Stand-Up Paddleboard (SUP)",
      "Ski Equipment",
      "Mountain Bike",
      "Road Bike",
      "High-End Camping Equipment",
      "Registered Firearm",
      "Telescope / Binoculars",
      "Portable Medical Equipment",
      "Antique Furniture",
      "Artwork",
      "Coin Collection",
      "Stamp Collection",
      "Gym Equipment",
      "Industrial Sewing Machine",
      "Portable Solar Panel",
      "Optical Instrument",
    ],
  },
  protectionCta: {
    headingLine1: "Start protecting",
    headingLine2: "your belongings now",
    description:
      "Create an account and document your valuable possessions to facilitate their identification and recovery.",
    imageAlt: "People discussing around a table",
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
      {
        question: "Why is the registry necessary?",
        answer:
          "Every year, thousands of items are lost or stolen in Canada, and the majority are never recovered. Without centralized proof of ownership, it is difficult for police to identify an owner and for insurers to process a claim efficiently. The CPPR creates an official, secure and dated record of your belongings \u2014 serial number, photos, proof of purchase \u2014 in a single file. It turns an anonymous object into an identifiable asset, makes reselling stolen goods much harder, and speeds up your recovery process.",
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
