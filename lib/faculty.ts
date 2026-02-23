import { supabase } from './supabase';

export type FacultyMember = {
  id: string;
  slug: string;
  name: string;
  designation: string;
  photo?: string;
  isHOD: boolean;
  order?: number;
};

/**
 * Fetch all faculty members from Supabase database
 */
export async function getFacultyMembers(): Promise<FacultyMember[]> {
  try {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('is_hod', { ascending: false })
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching faculty from Supabase:', error);
      return [];
    }

    return (data || []).map(member => ({
      id: member.id,
      slug: member.slug,
      name: member.name,
      designation: member.designation,
      photo: member.photo,
      isHOD: member.is_hod,
      order: member.order
    }));
  } catch (err) {
    console.error('Unexpected error fetching faculty:', err);
    return [];
  }
}
