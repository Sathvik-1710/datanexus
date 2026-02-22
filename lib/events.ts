import fs from "fs";
import path from "path";
import matter from "gray-matter";

const eventsDirectory = path.join(process.cwd(), "content/events");

export type EventType = {
  slug: string;
  title: string;
  date: string;
  image?: string;
  description?: string;
};

export function getAllEvents(): EventType[] {
  if (!fs.existsSync(eventsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(eventsDirectory);

  const events = fileNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const fullPath = path.join(eventsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled Event",
      date: data.date ? new Date(data.date).toISOString() : "",
      image: data.image || "",
      description: content || "",
    };
  });

  // Sort by newest first
  return events.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEventBySlug(slug: string): EventType | undefined {
  const events = getAllEvents();
  return events.find((event) => event.slug === slug);
}