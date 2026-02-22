import fs from "fs";
import path from "path";
import matter from "gray-matter";

export { formatDateDisplay } from "./dateUtils";

const eventsDirectory = path.join(process.cwd(), "content/events");

export type EventType = {
  slug: string;
  title: string;
  /** Date in YYYY-MM-DD format */
  date: string;
  image?: string;
  description?: string;
};

export type CategorizedEvents = {
  today: EventType[];
  upcoming: EventType[];
  past: EventType[];
};

/**
 * Normalise whatever gray-matter gives us (Date object or string) to
 * a YYYY-MM-DD string without timezone shifts.
 */
function toDateOnly(raw: unknown): string {
  if (!raw) return "";
  // gray-matter may parse a YAML date as a JS Date (UTC midnight).
  if (raw instanceof Date) {
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  // Otherwise take only the date portion of whatever string was stored.
  return String(raw).slice(0, 10);
}

/**
 * Returns today's date as YYYY-MM-DD in Asia/Kolkata (IST) timezone.
 */
export function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/**
 * Splits an array of events into today / upcoming / past buckets
 * using IST date boundaries.
 */
export function categorizeEvents(events: EventType[]): CategorizedEvents {
  const todayIST = getTodayIST();
  return {
    today: events.filter((e) => e.date === todayIST),
    upcoming: events.filter((e) => e.date > todayIST),
    past: events.filter((e) => e.date < todayIST),
  };
}

export function getAllEvents(): EventType[] {
  if (!fs.existsSync(eventsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(eventsDirectory);

  const events = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(eventsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled Event",
        date: toDateOnly(data.date),
        // CMS saves image as a frontmatter field — use it directly
        image: data.image || undefined,
        // CMS saves description as a frontmatter field (widget: "text").
        // Fall back to markdown body content for manually written files.
        description: (data.description as string | undefined)?.trim()
          || content.trim()
          || undefined,
      };
    });

  // Sort newest first (lexicographic comparison works for YYYY-MM-DD)
  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export function getEventBySlug(slug: string): EventType | undefined {
  const events = getAllEvents();
  return events.find((event) => event.slug === slug);
}