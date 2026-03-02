import type {
  CategoryItem,
  CyclePoint,
  FaqItem,
  NavItem,
  StepCard,
} from "../types/content";

export const siteMeta = {
  brandName: "Registre canadien des biens",
  minValueLabel: "Vous pouvez enregistrer un bien d'une valeur de plus de 1 000$",
};

export const navItems: NavItem[] = [
  { label: "Accueil", href: "#accueil" },
  { label: "Enregistrer", href: "#inscription" },
  { label: "À propos", href: "#cycle" },
  { label: "Plus", href: "#faq", withChevron: true },
  { label: "Contact", href: "#contact" },
];

export const categories: CategoryItem[] = [
  { label: "Vélo Électrique", image: "/assets/icon-bike.png" },
  { label: "Scooter", image: "/assets/icon-scooter.png" },
  { label: "Laptop", image: "/assets/icon-laptop.png" },
  { label: "Trottinette Électrique", image: "/assets/icon-escooter.png" },
  { label: "Voiturette de golf", image: "/assets/icon-golf-cart.png" },
  { label: "Montre", image: "/assets/icon-watch.png" },
];

export const cycleActions: CyclePoint[] = [
  {
    number: "01",
    title: "Enregistrez votre bien",
    description: "Ajoutez la marque, le modèle, le numéro de série et vos preuves d'achat.",
  },
  {
    number: "02",
    title: "Signalez en quelques clics",
    description: "En cas de vol, mettez immédiatement le bien en statut volé dans le registre.",
  },
  {
    number: "03",
    title: "Accélérez la restitution",
    description: "Partagez un dossier clair qui facilite la vérification de propriété.",
  },
];

export const cycleBenefits: CyclePoint[] = [
  {
    number: "01",
    title: "Bénéfice",
    description: "Un bien traçable est plus difficile à revendre et plus facile à identifier.",
  },
  {
    number: "02",
    title: "Bénéfice",
    description: "Vos informations sont centralisées pour réagir vite au bon moment.",
  },
  {
    number: "03",
    title: "Bénéfice",
    description: "Vous conservez une preuve de propriété structurée pour vos démarches.",
  },
];

export const registrationSteps: StepCard[] = [
  {
    step: "Étape 01",
    title: "Entrez les détails du bien",
    description: "Marque, modèle, numéro de série",
    image: "/assets/step-details.png",
  },
  {
    step: "Étape 02",
    title: "Joignez documents et photos",
    description: "Preuve d'achat, certificat d'authenticité",
    image: "/assets/step-docs.png",
  },
  {
    step: "Étape 03",
    title: "Validez votre enregistrement",
    description: "Confirmez et recevez votre numéro",
    image: "/assets/step-confirmation.png",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Quel est le seuil minimum?",
    answer:
      "Les biens doivent avoir une valeur d'au moins 1 000 $. Cette limite garantit que le registre se concentre sur les articles de réelle importance.",
  },
  {
    question: "Mes données sont-elles protégées?",
    answer:
      "Oui. Le RCB respecte les lois fédérales sur la protection des données. Vos informations personnelles ne sont jamais vendues ni partagées sans consentement.",
  },
  {
    question: "Combien de temps prend l'enregistrement?",
    answer:
      "Moins de trois minutes. Le formulaire est conçu pour être rapide et direct. Vous recevrez un numéro de confirmation immédiatement après validation.",
  },
  {
    question: "Puis-je modifier mon enregistrement?",
    answer:
      "Oui. Connectez-vous à votre compte pour mettre à jour les informations. Les modifications sont enregistrées en temps réel dans le système.",
  },
  {
    question: "Que se passe-t-il si mon bien est volé?",
    answer:
      "Signalez-le immédiatement via la section « Déclarer un bien volé ». Le statut de votre bien sera mis à jour dans le registre.",
  },
];
