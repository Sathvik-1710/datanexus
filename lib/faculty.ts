import fs from "fs";
import path from "path";
import matter from "gray-matter";

const facultyDirectory = path.join(process.cwd(), "content/faculty");

export type FacultyMember = {
  slug: string;
  name: string;
  designation: string;
  photo?: string;
  isHOD: boolean;
  order?: number;
};

export function getFacultyMembers(): FacultyMember[] {
  if (!fs.existsSync(facultyDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(facultyDirectory);

  const members = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(facultyDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        name: data.name || "",
        designation: data.designation || "",
        photo: data.photo || "",
        isHOD: data.isHOD === true,
        order: typeof data.order === "number" ? data.order : undefined,
      };
    });

  // HOD first, then sorted by `order` (ascending), unordered members go last
  return members.sort((a, b) => {
    if (a.isHOD !== b.isHOD) return a.isHOD ? -1 : 1;
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    return ao - bo;
  });
}
