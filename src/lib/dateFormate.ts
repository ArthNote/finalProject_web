/**
 * Date formatting options with examples
 * @example
 * 'short' -> 'Jan 1, 2025'
 * 'medium' -> 'January 1, 2025'
 * 'long' -> 'January 1, 2025, 12:00 PM'
 * 'relative' -> '2 days ago', 'in 3 months'
 * 'monthDay' -> 'January 1'
 * 'monthYear' -> 'January 2025'
 */
export type DateFormatStyle =
  | "short"
  | "medium"
  | "long"
  | "relative"
  | "monthDay"
  | "monthYear";

/**
 * Supported locales for date formatting
 */
export type DateFormatLocale = "en" | "fr";

/**
 * Formats a date according to the specified style and locale
 * @param date - Date to format (string, number, or Date object)
 * @param style - Formatting style to apply
 * @param locale - Locale for formatting ('en' or 'fr')
 * @returns Formatted date string
 *
 * @example
 * // Returns "Jan 1, 2025" in English
 * formatDate("2025-01-01", "short", "en")
 *
 * @example
 * // Returns "1 janv. 2025" in French
 * formatDate("2025-01-01", "short", "fr")
 *
 * @example
 * // Returns "January 1, 2025" in English
 * formatDate("2025-01-01", "medium")
 *
 * @example
 * // Returns "1 janvier 2025, 12:00" in French
 * formatDate("2025-01-01T12:00:00", "long", "fr")
 */
export function formatDate(
  date: string | number | Date,
  style: DateFormatStyle = "medium",
  locale: DateFormatLocale = "en"
): string {
  // Convert input to Date object
  const dateObj = date instanceof Date ? date : new Date(date);

  // Return empty string if date is invalid
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  // Map locale to Intl locale format
  const localeMap: Record<DateFormatLocale, string> = {
    en: "en-US",
    fr: "fr-FR",
  };

  const localeString = localeMap[locale] || "en-US";

  switch (style) {
    case "short":
      return new Intl.DateTimeFormat(localeString, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(dateObj);

    case "medium":
      return new Intl.DateTimeFormat(localeString, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(dateObj);

    case "long":
      return new Intl.DateTimeFormat(localeString, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(dateObj);

    case "relative":
      return formatRelative(dateObj, locale);

    case "monthDay":
      return new Intl.DateTimeFormat(localeString, {
        month: "long",
        day: "numeric",
      }).format(dateObj);

    case "monthYear":
      return new Intl.DateTimeFormat(localeString, {
        month: "long",
        year: "numeric",
      }).format(dateObj);

    default:
      return new Intl.DateTimeFormat(localeString).format(dateObj);
  }
}

/**
 * Formats a date relative to current time (e.g. "2 days ago")
 * @private
 */
function formatRelative(date: Date, locale: DateFormatLocale = "en"): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  // Translations for relative time
  const translations = {
    en: {
      seconds: "seconds",
      minutes: "minutes",
      hours: "hours",
      days: "days",
      months: "months",
      years: "years",
      ago: "ago",
      in: "in",
    },
    fr: {
      seconds: "secondes",
      minutes: "minutes",
      hours: "heures",
      days: "jours",
      months: "mois",
      years: "ans",
      ago: "il y a",
      in: "dans",
    },
  };

  const t = translations[locale];

  // Future date
  if (diffMs > 0) {
    if (diffSecs < 60) {
      return locale === "fr"
        ? `${t.in} ${diffSecs} ${t.seconds}`
        : `${t.in} ${diffSecs} ${t.seconds}`;
    }
    if (diffMins < 60) {
      return locale === "fr"
        ? `${t.in} ${diffMins} ${t.minutes}`
        : `${t.in} ${diffMins} ${t.minutes}`;
    }
    if (diffHours < 24) {
      return locale === "fr"
        ? `${t.in} ${diffHours} ${t.hours}`
        : `${t.in} ${diffHours} ${t.hours}`;
    }
    if (diffDays < 30) {
      return locale === "fr"
        ? `${t.in} ${diffDays} ${t.days}`
        : `${t.in} ${diffDays} ${t.days}`;
    }
    if (diffMonths < 12) {
      return locale === "fr"
        ? `${t.in} ${diffMonths} ${t.months}`
        : `${t.in} ${diffMonths} ${t.months}`;
    }
    return locale === "fr"
      ? `${t.in} ${diffYears} ${t.years}`
      : `${t.in} ${diffYears} ${t.years}`;
  }
  // Past date
  else {
    const absDiffSecs = Math.abs(diffSecs);
    const absDiffMins = Math.abs(diffMins);
    const absDiffHours = Math.abs(diffHours);
    const absDiffDays = Math.abs(diffDays);
    const absDiffMonths = Math.abs(diffMonths);
    const absDiffYears = Math.abs(diffYears);

    if (absDiffSecs < 60) {
      return locale === "fr"
        ? `${t.ago} ${absDiffSecs} ${t.seconds}`
        : `${absDiffSecs} ${t.seconds} ${t.ago}`;
    }
    if (absDiffMins < 60) {
      return locale === "fr"
        ? `${t.ago} ${absDiffMins} ${t.minutes}`
        : `${absDiffMins} ${t.minutes} ${t.ago}`;
    }
    if (absDiffHours < 24) {
      return locale === "fr"
        ? `${t.ago} ${absDiffHours} ${t.hours}`
        : `${absDiffHours} ${t.hours} ${t.ago}`;
    }
    if (absDiffDays < 30) {
      return locale === "fr"
        ? `${t.ago} ${absDiffDays} ${t.days}`
        : `${absDiffDays} ${t.days} ${t.ago}`;
    }
    if (absDiffMonths < 12) {
      return locale === "fr"
        ? `${t.ago} ${absDiffMonths} ${t.months}`
        : `${absDiffMonths} ${t.months} ${t.ago}`;
    }
    return locale === "fr"
      ? `${t.ago} ${absDiffYears} ${t.years}`
      : `${absDiffYears} ${t.years} ${t.ago}`;
  }
}

/**
 * Helper function to get the correct singular/plural form of time units in French
 * @private
 */
function getFrenchUnit(value: number, unit: string): string {
  // In French, most plural forms just add 's', but there are exceptions
  if (unit === "mois") return "mois"; // 'mois' stays the same in plural

  // For other units, add 's' for plural except when value is 1
  return value === 1 ? unit : `${unit}s`;
}
