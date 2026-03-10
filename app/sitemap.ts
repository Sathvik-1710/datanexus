import type { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/events";

const BASE_URL = "https://datanexus.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/events`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/team`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/join`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    // Dynamic event routes
    const events = await getAllEvents();
    const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${BASE_URL}/events/${event.slug}`,
        lastModified: new Date(event.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...eventRoutes];
}
