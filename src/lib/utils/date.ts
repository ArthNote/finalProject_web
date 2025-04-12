import { formatDistance, format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export function formatDate(
  date: Date | string | number,
  type: "relative" | "absolute" = "absolute",
  locale: "en" | "fr" = "en"
) {
  const dateObj = new Date(date);
  const localeObj = locale === "fr" ? fr : enUS;

  if (type === "relative") {
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: localeObj,
    });
  }

  return format(dateObj, "PPp", { locale: localeObj });
}
