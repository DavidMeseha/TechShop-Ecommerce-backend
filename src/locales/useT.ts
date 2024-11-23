import en from "./en.json";
import ar from "./ar.json";

export type Languages = "en" | "ar";
type Dictionary = keyof typeof en;

const dictionaries = {
  en: en,
  ar: ar,
};

export default function useT(lang: Languages) {
  const translation = { ...dictionaries[lang] };
  return (key: Dictionary) => translation[key as keyof typeof translation];
}
