import { supabase } from './supabase';

export type EventType = {
  id: string;
  slug: string;
  title: string;
  date: string;
  image?: string;
  images: string[];
  description?: string;
};

export { formatDateDisplay } from './dateUtils';

export type CategorizedEvents = {
  today: EventType[];
  upcoming: EventType[];
  past: EventType[];
};

export function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function categorizeEvents(events: EventType[]): CategorizedEvents {
  const todayIST = getTodayIST();
  return {
    today: events.filter((e) => e.date === todayIST),
    upcoming: events
      .filter((e) => e.date > todayIST)
      .sort((a, b) => a.date.localeCompare(b.date)),
    past: events
      .filter((e) => e.date < todayIST)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/**
 * Fetch all events from Supabase database
 */
export async function getAllEvents(): Promise<EventType[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching events from Supabase:', error);
      return [];
    }

    return (data || []).map(event => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      date: event.date,
      image: event.images?.[0] || undefined,
      images: event.images || [],
      description: event.description
    }));
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventType | undefined> {
  const events = await getAllEvents();
  return events.find((event) => event.slug === slug);
}