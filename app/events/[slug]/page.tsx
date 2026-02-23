import { getEventBySlug, formatDateDisplay } from "@/lib/events";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import EventCarousel from "@/components/EventCarousel";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const formattedDate = formatDateDisplay(event.date);

  return (
    <>
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Back link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            ← Back to Events
          </Link>

          {/* Title + Date */}
          <section className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {event.title}
            </h1>
            <p className="text-gray-400 text-lg">{formattedDate}</p>
          </section>

          {/* Image carousel (1–5 images) */}
          {event.images.length > 0 && (
            <EventCarousel images={event.images} title={event.title} />
          )}

          {/* Description */}
          {event.description ? (
            <section className="border border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/5 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-xl font-semibold text-white">About this Event</h2>

                {event.link_url && (
                  <a
                    href={event.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
                  >
                    Explore Now →
                  </a>
                )}
              </div>

              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>
          ) : (
            <section className="border border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-gray-500 italic">No description available yet.</p>

              {event.link_url && (
                <a
                  href={event.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                >
                  Explore Now →
                </a>
              )}
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
