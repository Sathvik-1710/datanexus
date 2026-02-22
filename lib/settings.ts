import fs from "fs";
import path from "path";
import matter from "gray-matter";

const settingsFile = path.join(process.cwd(), "content/settings/general.md");

export type SiteSettings = {
    tagline: string;
    years_active: number;
    founded_year: number;
    instagram?: string;
    linkedin?: string;
    github?: string;
};

const defaults: SiteSettings = {
    tagline:
        "A student-led initiative driving innovation in Data Science, AI, and modern technology.",
    years_active: 1,
    founded_year: 2024,
    github: "https://github.com/Sathvik-1710/datanexus",
};

export function getSiteSettings(): SiteSettings {
    if (!fs.existsSync(settingsFile)) return defaults;

    const raw = fs.readFileSync(settingsFile, "utf8");
    const { data } = matter(raw);

    return {
        tagline: (data.tagline as string) || defaults.tagline,
        years_active:
            typeof data.years_active === "number"
                ? data.years_active
                : defaults.years_active,
        founded_year:
            typeof data.founded_year === "number"
                ? data.founded_year
                : defaults.founded_year,
        instagram: (data.instagram as string | undefined) || undefined,
        linkedin: (data.linkedin as string | undefined) || undefined,
        github: (data.github as string | undefined) || defaults.github,
    };
}
