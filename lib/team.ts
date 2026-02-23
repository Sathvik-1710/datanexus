import { supabase } from './supabase';

export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  linkedin?: string;
  order?: number;
};

/**
 * Fetch all team members from Supabase database
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching team from Supabase:', error);
      return [];
    }

    return (data || []).map(member => ({
      id: member.id,
      slug: member.slug,
      name: member.name,
      role: member.role,
      photo: member.photo,
      bio: member.bio,
      linkedin: member.linkedin,
      order: member.order
    }));
  } catch (err) {
    console.error('Unexpected error fetching team members:', err);
    return [];
  }
}
