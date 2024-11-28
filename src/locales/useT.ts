import en from "./en.json";
import ar from "./ar.json";
import fr from "./fr.json";

export type Language = "en" | "ar" | "fr";
export const languages: Language[] = ["en", "ar", "fr"];
type Dictionary = keyof typeof en;

const dictionaries = {
  en: en,
  ar: ar,
  fr: fr,
};

export default function useT(lang: Language) {
  const translation = { ...dictionaries[lang] };
  return (key: Dictionary) => translation[key as keyof typeof translation];
}
