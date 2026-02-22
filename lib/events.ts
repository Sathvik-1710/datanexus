import fs from "fs";
import path from "path";
import matter from "gray-matter";

const eventsDirectory = path.join(process.cwd(), "content/events");

export function getAllEvents() {
  if (!fs.existsSync(eventsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(eventsDirectory);

  return fileNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const fullPath = path.join(eventsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      image: data.image || "",
    };
  });
}