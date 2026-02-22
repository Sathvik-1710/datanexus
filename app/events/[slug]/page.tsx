import { getEventBySlug, formatDateDisplay } from "@/lib/events";
import { notFound } from "next/navigation";
import Link from "next/link";

// Force dynamic so CMS-created events work immediately without rebuilding
export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) return notFound();

  const formattedDate = formatDateDisplay(event.date);

  return (
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

        {/* Hero Image */}
        {event.image && (
          <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="w-full max-h-[500px] object-cover"
              onError={(e) => {
                // If the image URL is broken, hide it gracefully
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Description */}
        {event.description ? (
          <section className="border border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/5">
            <h2 className="text-xl font-semibold mb-4 text-white">About this Event</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </section>
        ) : (
          <section className="border border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/5">
            <p className="text-gray-500 italic">No description available yet.</p>
          </section>
        )}

      </div>
    </main>
  );
}