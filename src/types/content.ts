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
