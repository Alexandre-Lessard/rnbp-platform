import type { SiteContent } from "@/types/content";
import en from "./en";
import fr from "./fr";

export type SupportedLocale = "fr" | "en";

export const locales: Record<SupportedLocale, SiteContent> = { fr, en };

export const defaultLocale: SupportedLocale = "fr";
