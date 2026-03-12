export const INSURERS = [
  {
    id: "intact",
    fr: "Intact Assurance",
    en: "Intact Insurance",
  },
  {
    id: "aviva",
    fr: "Aviva Canada",
    en: "Aviva Canada",
  },
  {
    id: "desjardins",
    fr: "Desjardins Assurances",
    en: "Desjardins Insurance",
  },
  {
    id: "wawanesa",
    fr: "Wawanesa Mutual Insurance",
    en: "Wawanesa Mutual Insurance",
  },
  {
    id: "cooperators",
    fr: "Co-operators Assurance générale",
    en: "Co-operators General Insurance",
  },
  {
    id: "td",
    fr: "TD Assurance",
    en: "TD Insurance",
  },
  {
    id: "aig",
    fr: "AIG Canada",
    en: "AIG Canada",
  },
  {
    id: "rbc",
    fr: "RBC Assurances",
    en: "RBC Insurance",
  },
  {
    id: "sonnet",
    fr: "Sonnet Assurance",
    en: "Sonnet Insurance",
  },
  {
    id: "promutuel",
    fr: "Promutuel Assurance",
    en: "Promutuel Insurance",
  },
  {
    id: "ssq",
    fr: "SSQ Assurance",
    en: "SSQ Insurance",
  },
  {
    id: "belairdirect",
    fr: "Bélairdirect",
    en: "Belairdirect",
  },
  {
    id: "ia",
    fr: "Industrielle Alliance (iA Groupe financier)",
    en: "Industrial Alliance (iA Financial Group)",
  },
  {
    id: "optimum",
    fr: "Optimum Assurance",
    en: "Optimum Insurance",
  },
  {
    id: "the-personal",
    fr: "La Personnelle",
    en: "The Personal Insurance Company",
  },
  {
    id: "chubb",
    fr: "Chubb Assurance du Canada",
    en: "Chubb Insurance Company of Canada",
  },
  {
    id: "peace-hills",
    fr: "Peace Hills General Insurance Company",
    en: "Peace Hills General Insurance Company",
  },
  {
    id: "red-river",
    fr: "Red River Mutual Insurance",
    en: "Red River Mutual Insurance",
  },
  {
    id: "sandbox",
    fr: "Sandbox Mutual Insurance",
    en: "Sandbox Mutual Insurance",
  },
  {
    id: "pafco",
    fr: "Pafco Assurance",
    en: "Pafco Insurance",
  },
  {
    id: "caa-quebec",
    fr: "CAA-Québec Assurance",
    en: "CAA-Quebec Insurance",
  },
  {
    id: "economical",
    fr: "Économical Assurance",
    en: "Economical Insurance",
  },
] as const;

export type InsurerId = (typeof INSURERS)[number]["id"];

export const INSURER_EMAILS: Record<string, string | null> = {
  intact: "customer.experience@intact.net",
  aviva: "info@avivacanada.com",
  desjardins: null,
  wawanesa: "TalkToUs@wawanesa.com",
  cooperators: null,
  td: "tdinscc@TD.com",
  aig: null,
  rbc: "feedback@rbcinsurance.com",
  sonnet: "help@sonnet.ca",
  promutuel: null,
  ssq: "info@ssq.ca",
  belairdirect: "customer.experience@belairdirect.com",
  ia: null,
  optimum: null,
  "the-personal": null,
  chubb: "CustomerCare.Canada@chubb.com",
  "peace-hills": "phi@phgic.com",
  "red-river": "info@redrivermutual.com",
  sandbox: "hello@sandbox.ca",
  pafco: "contactus@pafco.ca",
  "caa-quebec": "info@caaquebec.com",
  economical: null,
};
