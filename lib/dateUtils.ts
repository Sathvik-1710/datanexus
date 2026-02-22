const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Formats a YYYY-MM-DD string as "D Month YYYY" (e.g. "15 March 2026")
 * without relying on new Date() to avoid timezone shifts.
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "Date TBA";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return "Date TBA";
  return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
}
