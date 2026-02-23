import { supabase } from './supabase';

export type SiteSettings = {
    tagline: string;
    years_active: number;
    founded_year: number;
    instagram?: string;
    linkedin?: string;
    github?: string;
};

const defaults: SiteSettings = {
    tagline: "A student-led initiative driving innovation in Data Science, AI, and modern technology.",
    years_active: 1,
    founded_year: 2024,
    github: "https://github.com/Sathvik-1710/datanexus",
};

/**
 * Fetch site settings from Supabase database
 */
export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'general')
            .single();

        if (error) {
            if (error.code !== 'PGRST116') { // Ignore "no rows found" during initial setup
                console.error('Error fetching settings from Supabase:', error);
            }
            return defaults;
        }

        return {
            tagline: data.tagline || defaults.tagline,
            years_active: data.years_active ?? defaults.years_active,
            founded_year: data.founded_year ?? defaults.founded_year,
            instagram: data.instagram,
            linkedin: data.linkedin,
            github: data.github || defaults.github,
        };
    } catch (err) {
        console.error('Unexpected error fetching settings:', err);
        return defaults;
    }
}
