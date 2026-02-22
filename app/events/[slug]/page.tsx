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

        {/* Hero Image — only render if image path looks like a real image file */}
        {event.image && isImageUrl(event.image) && (
          <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full max-h-[500px] object-cover"
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

/**
 * Simple server-side check: only pass URLs that look like direct image files
 * or paths starting with / (local uploads). Avoids trying to render webpage
 * URLs as images.
 */
function isImageUrl(url: string): boolean {
  if (!url) return false;
  // Local uploads from CMS (e.g., /images/uploads/photo.jpg)
  if (url.startsWith("/")) return true;
  // External direct image URLs
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url);
}