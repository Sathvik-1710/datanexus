import fs from "fs";
import path from "path";
import matter from "gray-matter";

const teamDirectory = path.join(process.cwd(), "content/team");

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  photo?: string;
  order?: number;
};

export function getTeamMembers(): TeamMember[] {
  if (!fs.existsSync(teamDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(teamDirectory);

  const members = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(teamDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        name: data.name || "",
        role: data.role || "",
        photo: data.photo || "",
        order: typeof data.order === "number" ? data.order : undefined,
      };
    });

  // Sort by `order` field (ascending); members without order go last
  return members.sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    return ao - bo;
  });
}
