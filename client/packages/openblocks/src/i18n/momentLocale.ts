import { language } from "i18n";

export function getMomentLocale() {
  switch (language) {
    case "pt":
      return "pt-br";
    case "zh":
      return "zh-cn";
    default:
      return "en-gb";
  }
}
