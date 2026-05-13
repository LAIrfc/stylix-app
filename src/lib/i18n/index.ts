export { en } from "./locales/en";
export { zh } from "./locales/zh";
export { fr } from "./locales/fr";
export { es } from "./locales/es";
export { de } from "./locales/de";
export { ja } from "./locales/ja";
export { ko } from "./locales/ko";
export { ar } from "./locales/ar";

export type { Translations, Locale } from "./types";
export { LOCALES, LOCALE_LABELS, RTL_LOCALES } from "./types";

import type { Translations, Locale } from "./types";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import { fr } from "./locales/fr";
import { es } from "./locales/es";
import { de } from "./locales/de";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { ar } from "./locales/ar";

const localeMap: Record<Locale, Translations> = { en, zh, fr, es, de, ja, ko, ar };

export function getTranslations(locale: Locale): Translations {
  return localeMap[locale] ?? en;
}
