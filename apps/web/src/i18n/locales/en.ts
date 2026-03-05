import type { SiteContent } from "@/types/content";

const en: SiteContent = {
  meta: {
    title: "National Registry of Personal Property",
    description:
      "National Registry of Personal Property \u2014 protect and recover your valuable belongings.",
  },
  pages: {
    home: {
      title: "Protect and recover your valuable belongings | NRPP",
      description: "Register your valuable belongings in a secure registry. Protect and recover your items in case of loss or theft.",
    },
    faq: {
      title: "Frequently Asked Questions | NRPP",
      description: "Find answers to common questions about registering your belongings in the National Registry of Personal Property.",
    },
    partners: {
      title: "Become a Partner | NRPP",
      description: "Partner with the NRPP: insurers, retailers and public safety organizations across Canada.",
    },
    privacy: {
      title: "Privacy Policy | NRPP",
      description: "Learn how the NRPP protects your personal information and complies with federal privacy laws.",
    },
    terms: {
      title: "Terms of Service | NRPP",
      description: "Review the terms of service for the National Registry of Personal Property.",
    },
    lookup: {
      title: "Verify an Item | NRPP",
      description: "Enter a NRPP number to check the status of a registered item.",
    },
    login: {
      title: "Login | NRPP",
      description: "Sign in to your NRPP account to manage your registered items.",
    },
    register: {
      title: "Create an Account | NRPP",
      description: "Sign up for free to register and protect your valuable belongings.",
    },
  },
  nav: {
    items: [
      { label: "Home", href: "#accueil" },
      { label: "About", href: "#cycle" },
      { label: "Register", href: "#inscription" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "#contact" },
    ],
    partners: "Partners",
    login: "Login",
    logout: "Logout",
    myAccount: "My Account",
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
  },
  rollingRegistry: {
    headingLine1: "The Canadian",
    headingLine2: "Personal Property Registry",
    description:
      "The NRPP covers over 48 categories of items, including rolling stock, electronics, specialized tools and other valuable articles.",
    tagline: "Clear proof of ownership, all in one place.",
    imageAlt: "Riding lawn mower",
    viewCategoriesLink: "View item categories",
  },
  allCategories: {
    heading: "48 eligible item categories",
    description:
      "The NRPP lets you register any personal property valued over $1,000.",
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
    buttonText: "View all questions",
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
          "Yes. The NRPP complies with federal data protection laws. Your personal information is never sold or shared without consent.",
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
          "Every year, thousands of items are lost or stolen in Canada, and the majority are never recovered. Without centralized proof of ownership, it is difficult for police to identify an owner and for insurers to process a claim efficiently. The NRPP creates an official, secure and dated record of your belongings \u2014 serial number, photos, proof of purchase \u2014 in a single file. It turns an anonymous object into an identifiable asset, makes reselling stolen goods much harder, and speeds up your recovery process.",
      },
      {
        question: "What types of items can I register?",
        answer:
          "You can register all types of valuable personal property: bikes, tools, electronics, musical instruments, sports equipment, jewellery, etc.",
      },
      {
        question: "Why register my items before a theft occurs?",
        answer:
          "Pre-registration allows you to prove ownership and makes it easier to identify an item if it is recovered. Additionally, some insurers may offer a discount on home insurance when items are registered before a theft is reported.",
      },
      {
        question: "Who can access the registry information?",
        answer:
          "Only authorized police services and insurers can access certain registry information, solely for the purpose of verifying an item or conducting an investigation.",
      },
      {
        question: "Can I register an item without a serial number?",
        answer:
          "Yes. You can register an item by adding photos, a detailed description and other identifying characteristics. However, adding a serial number is recommended. Using registration stickers available in the NRPP online store can also improve item identification.",
      },
      {
        question: "How can I recover my item?",
        answer:
          "When an item registered with the NRPP is found, it is handled by the registry to verify identification and ownership. Once ownership is confirmed through registered information (photos, description, serial number, etc.), the NRPP contacts the owner and arranges the return of the item.",
      },
      {
        question: "Are there fees to recover my item?",
        answer:
          "Yes. Administrative fees may apply to cover costs related to file management, item identification, recovery and arranging its return to the owner. Exact fees may vary depending on the situation and the nature of the recovered item.",
      },
      {
        question: "How many items can I register?",
        answer: "You can register as many items as you wish.",
      },
      {
        question: "Can I register my family\u2019s items?",
        answer:
          "Yes. A single account can register items belonging to multiple members of the same household.",
      },
      {
        question: "Can I transfer a registered item?",
        answer:
          "Yes. If you sell or give away an item, you can update its status or transfer it at no cost.",
      },
      {
        question: "Does the registry work across the country?",
        answer:
          "Yes. The registry is designed to operate nationwide. Items stolen in one province are often resold in another, making a national registry essential for facilitating their identification and recovery.",
      },
      {
        question: "Can I register a used item?",
        answer:
          "Yes. It is recommended to register an item as soon as you become its owner.",
      },
      {
        question: "What if I find my stolen item?",
        answer:
          "You can simply update its status in your account.",
      },
      {
        question: "Do I need to add photos of my items?",
        answer:
          "Photos are not mandatory but strongly recommended to facilitate identification.",
      },
      {
        question: "Can the registry help deter theft?",
        answer:
          "Yes. A registered and NRPP-identifiable item is harder to resell and can be more easily traced.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes. You can delete your account and associated information at any time.",
      },
      {
        question: "Is my personal information publicly visible?",
        answer:
          "No. Personal information is not made public.",
      },
      {
        question: "How does the registry help recover items?",
        answer:
          "All police services have 24/7 access to the registry to help identify owners when an item is found. Thanks to registered information, it becomes simpler and faster to trace and return the item to its rightful owner.",
      },
      {
        question: "Does the registry replace insurance?",
        answer:
          "No. The registry does not replace insurance, but it can facilitate certain processes in case of theft.",
      },
      {
        question: "If my item is already covered by my home insurance, should I still register it on the NRPP?",
        answer:
          "Yes. Registering your item on the NRPP can reduce the consequences of a theft if the item is recovered. It could then be identified and returned to its owner or the insurer, which can reduce losses related to the claim.",
      },
      {
        question: "What is the advantage for my home insurer to give me a discount?",
        answer:
          "Some items are covered by home insurance. If an insurer compensates a policyholder following a theft and the item is later recovered through the registry, it can be retrieved and returned to the insurer. This reduces the financial loss related to the compensation, which is why some insurers offer a discount to policyholders who register their items on the NRPP.",
      },
      {
        question: "Which items do not need to be registered on the NRPP?",
        answer:
          "Real estate, registered vehicles and firearms generally do not need to be registered on the NRPP, as these items already have their own official registries. The NRPP primarily targets personal property not covered by an existing registry.",
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
      "\u00a9 {{year}} National Registry of Personal Property. All rights reserved.",
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
    logoAlt: "NRPP",
  },
  auth: {
    loginHeading: "Login",
    loginDescription: "Sign in to your NRPP account",
    registerHeading: "Create an account",
    registerDescription: "Sign up to register your belongings",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordHint: "At least 8 characters, 1 uppercase, 1 number",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    phoneLabel: "Phone",
    optional: "optional",
    loginButton: "Sign in",
    loggingIn: "Signing in...",
    registerButton: "Create my account",
    registering: "Creating account...",
    noAccount: "Don't have an account?",
    registerLink: "Create an account",
    hasAccount: "Already have an account?",
    loginLink: "Sign in",
  },
  dashboard: {
    heading: "Dashboard",
    welcome: "Welcome, {{name}}",
    noItems: "No items registered yet.",
    addItem: "Register an item",
    reportTheft: "Report a theft",
    statuses: {
      active: "Active",
      stolen: "Stolen",
      recovered: "Recovered",
      transferred: "Transferred",
    },
  },
  registration: {
    heading: "Register an item",
    description: "Fill out the form to register your item in the NRPP.",
    step1Title: "Item information",
    step2Title: "Photos and documents",
    step3Title: "Create your account",
    categoryLabel: "Category",
    categoryPlaceholder: "Select a category",
    nameLabel: "Item name",
    brandLabel: "Brand",
    modelLabel: "Model",
    serialLabel: "Serial number",
    valueLabel: "Estimated value ($)",
    descriptionLabel: "Description",
    termsCheckbox: "I accept the terms of service",
    continueButton: "Continue",
    backButton: "Back",
    photosHeading: "Item photos",
    photosDescription: "Add up to 5 photos of your item (max 10 MB each).",
    dropzoneText: "Drag your photos here or click to select",
    documentsHeading: "Supporting documents",
    documentsDescription: "Proof of purchase, certificate of authenticity (optional).",
    confirmButton: "Confirm registration",
    successHeading: "Item registered successfully!",
    successDescription: "Your item has been registered in the NRPP. Keep your NRPP number.",
    rnbpNumberLabel: "Your NRPP number",
    goToDashboard: "Go to dashboard",
  },
  report: {
    heading: "Report a theft",
    description: "The theft report form will be available soon.",
  },
  lookup: {
    heading: "Verify an item",
    description: "Enter a NRPP number to check an item's status.",
    inputPlaceholder: "RNBP-XXXXXXXX",
    searchButton: "Verify",
    searching: "Searching...",
    foundMessage: "Item found in the registry",
    stolenMessage: "This item has been reported stolen",
    notFoundMessage: "No item found with this number.",
  },
  partners: {
    heading: "Become a NRPP Partner",
    description: "The National Registry of Personal Property collaborates with insurers, retailers and public safety organizations across Canada. Together, we protect Canadians' valuable belongings and facilitate their recovery.",
    whyPartner: "Why become a partner?",
    benefits: [
      "Access the NRPP verification network to authenticate your clients' belongings",
      "Visibility among thousands of registered property owners",
      "Reduce fraud through valuable property traceability",
      "API integration to connect your systems to the NRPP registry",
      "Co-branded discount program to retain your insureds",
    ],
    ctaDescription: "Contact our partnerships team to discuss collaboration opportunities tailored to your business.",
    formHeading: "Send us a message",
    nameLabel: "Full name",
    emailLabel: "Email address",
    companyLabel: "Company (optional)",
    typeLabel: "Partnership type",
    messageLabel: "Message",
    typePlaceholder: "Select a type",
    typeOptions: {
      insurer: "Insurer",
      retailer: "Retailer",
      security: "Public safety",
      other: "Other",
    },
    submitButton: "Send",
    submitting: "Sending…",
    successMessage: "Thank you! Your message has been sent. We will get back to you shortly.",
    errorMessage: "An error occurred. Please try again later.",
  },
  insurance: {
    heading: "Get a discount on your insurance",
    description: "Most insurers offer a discount to NRPP members. Select your insurer and contact them to check if you're eligible.",
    selectLabel: "Your insurer",
    selectPlaceholder: "Select your insurer",
    messageLabel: "Pre-filled message",
    messageTemplate: "Hello {{insurer}}, I have just registered my valuable belongings on the NRPP (National Registry of Personal Property). I would like to check with you if I am eligible for a discount on my home insurance.",
    sendButton: "Copy message",
    copiedToast: "Message copied! Send it to your insurer.",
    emailSubject: "NRPP Discount Request",
    emailButton: "Send by email",
  },
  legal: {
    privacyHeading: "Privacy Policy",
    privacyContent: [
      {
        title: "1. Collection of Personal Information",
        body: "The NRPP collects only the information necessary to create your account and register your belongings: name, email address, phone number (optional), and descriptive information about your property (category, brand, model, serial number, photos). This information is provided voluntarily during registration.",
      },
      {
        title: "2. Use of Information",
        body: "Your information is used to: manage your account and verify your identity; register and identify your belongings in the registry; facilitate recovery of lost or stolen property; send you account-related communications (email verification, password reset); improve our services. We do not sell or rent your personal information to third parties.",
      },
      {
        title: "3. Data Protection",
        body: "Your data is protected by industry-standard security measures: password encryption (Argon2id), encrypted communications (TLS/HTTPS), signed authentication tokens (EdDSA), daily encrypted backups. Data access is limited to authorized personnel following the principle of least privilege.",
      },
      {
        title: "4. Retention and Deletion",
        body: "Your data is retained as long as your account is active. You may request deletion of your account and data at any time by contacting us. Theft reports are retained for traceability purposes even after account deletion, in accordance with applicable legal obligations.",
      },
      {
        title: "5. Public Verification",
        body: "The public verification feature (search by NRPP number) does not disclose any personal information about the owner. Only the property status (registered, reported stolen) is displayed.",
      },
      {
        title: "6. Cookies and Similar Technologies",
        body: "The NRPP uses only strictly necessary cookies for site functionality (authentication, language preferences). No advertising tracking or third-party analytics cookies are used.",
      },
      {
        title: "7. Changes",
        body: "We reserve the right to modify this policy. Any significant changes will be communicated to you by email or by a notice on the site. The last update date is indicated at the bottom of this page.",
      },
      {
        title: "8. Contact",
        body: "For any questions regarding the protection of your personal information, contact us at privacy@rnbp.ca.",
      },
    ],
    termsHeading: "Terms of Service",
    termsContent: [
      {
        title: "1. Acceptance of Terms",
        body: "By using the National Registry of Personal Property (NRPP) website and services, you agree to be bound by these terms of service. If you do not accept these terms, please do not use our services.",
      },
      {
        title: "2. Description of Service",
        body: "The NRPP offers a free registration service for valuable personal property. The registry allows users to document their belongings, report thefts and verify the status of property using its unique NRPP number. The service is provided \"as is\" and the NRPP does not guarantee recovery of lost or stolen property.",
      },
      {
        title: "3. Registration and Account",
        body: "You must provide accurate and up-to-date information during registration. You are responsible for the confidentiality of your password and all activities carried out under your account. You must notify us immediately of any unauthorized use of your account.",
      },
      {
        title: "4. Property Registration",
        body: "You may only register property that you legitimately own. Registration of property does not constitute proof of ownership in a legal sense. It is prohibited to register stolen, counterfeit or illegal property. The NRPP reserves the right to remove any fraudulent registration.",
      },
      {
        title: "5. Theft Reporting",
        body: "By reporting property as stolen on the NRPP, you attest that this declaration is truthful. False theft reports are prohibited and may result in account suspension as well as legal prosecution. We encourage you to also file a report with your local police service.",
      },
      {
        title: "6. User Content",
        body: "You retain ownership of the photos and documents you upload. By submitting them, you grant the NRPP a non-exclusive license to use them for the operation of the service. You warrant that uploaded content does not violate any intellectual property rights or applicable laws.",
      },
      {
        title: "7. Limitation of Liability",
        body: "The NRPP shall not be held liable for any direct, indirect or consequential damages resulting from the use or inability to use the service. The NRPP does not guarantee uninterrupted availability of the service and cannot be held liable for data loss due to circumstances beyond its control.",
      },
      {
        title: "8. Termination",
        body: "You may close your account at any time. The NRPP reserves the right to suspend or close an account for violation of these terms, without prior notice.",
      },
      {
        title: "9. Governing Law",
        body: "These terms are governed by the laws of the Province of Quebec and applicable federal laws of Canada. Any dispute shall be submitted to the competent courts of the judicial district of Montreal.",
      },
      {
        title: "10. Changes",
        body: "The NRPP reserves the right to modify these terms at any time. Changes will take effect upon publication on the site. Continued use of the service after a change constitutes your acceptance of the new terms.",
      },
    ],
  },
  errors: {
    serviceUnavailable: "Service temporarily unavailable",
    serviceUnavailableDescription: "Our servers are temporarily unreachable. Please try again shortly.",
    notFound: "Page not found",
    notFoundDescription: "The page you're looking for doesn't exist or has been moved.",
    backHome: "Back to home",
  },
};

export default en;
