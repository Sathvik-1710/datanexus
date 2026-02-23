import { supabase } from './supabase';

export type ProjectType = {
    id: string;
    slug: string;
    title: string;
    description: string;
    github_url?: string;
    linkedin_url?: string;
    live_url?: string;
    images: string[];
    created_at: string;
};

export async function getAllProjects(): Promise<ProjectType[]> {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error fetching projects:', err);
        return [];
    }
}

export async function getProjectBySlug(slug: string): Promise<ProjectType | undefined> {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return undefined;
        return data;
    } catch (err) {
        return undefined;
    }
}
