"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDateDisplay } from "@/lib/dateUtils";

type EventType = {
  title: string;
  date: string;
  slug: string;
  image?: string;
};

interface Props {
  events: EventType[];
}

export default function EventCalendar({ events }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const eventsWithDate = useMemo(() => {
    return events.map((event) => {
      const [y, m, d] = event.date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setHours(0, 0, 0, 0);
      return { ...event, dateObj };
    });
  }, [events]);

  // Today's events only — exact date match
  const todayEvents = eventsWithDate.filter(
    (event) => event.dateObj.getTime() === today.getTime()
  );

  // Strictly future events — NOT including today
  const upcomingEvents = eventsWithDate.filter(
    (event) => event.dateObj > today
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  }, [currentMonth, firstDay, daysInMonth]);

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const eventsOnSelected =
    selectedDate === null
      ? []
      : eventsWithDate.filter(
        (event) => event.dateObj.getTime() === selectedDate.getTime()
      );

  return (
    <div className="grid md:grid-cols-2 gap-28">

      {/* ── CALENDAR ── */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10">

        {/* Month Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              )
            }
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            ‹
          </button>

          <h2 className="text-2xl font-semibold tracking-tight">{monthLabel}</h2>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              )
            }
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            ›
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>

        {/* Day Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={monthLabel}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-7 gap-y-6"
          >
            {calendarDays.map((date, index) => {
              if (!date) return <div key={index} />;

              const hasEvent = eventsWithDate.some(
                (event) => event.dateObj.getTime() === date.getTime()
              );
              const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
              const isPast = date < today;
              const isToday = date.getTime() === today.getTime();

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={[
                      "w-11 h-11 flex items-center justify-center transition text-sm relative rounded-full",
                      isSelected
                        ? "bg-white text-black shadow-lg font-semibold"
                        : isToday
                          ? "ring-1 ring-white/60 font-semibold"
                          : hasEvent
                            ? "bg-white/10 text-white font-medium hover:bg-white/20"
                            : "group-hover:bg-white/5",
                      isPast && !isSelected ? "text-gray-500 font-normal" : "",
                      !isPast && !isSelected ? "font-medium" : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                    {hasEvent && !isSelected && (
                      <div className="absolute -bottom-1 w-1 h-1 bg-white/40 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="space-y-10">

        {/* TODAY'S EVENTS — shown at top with distinct style */}
        {todayEvents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse" />
              Happening Today
            </h3>
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="border border-white/30 backdrop-blur-xl bg-white/10 rounded-2xl p-5 cursor-pointer"
                  >
                    <h4 className="text-base font-semibold">{event.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{formatDateDisplay(event.date)}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* UPCOMING — strictly after today */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events.</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="border border-white/10 backdrop-blur-xl bg-white/5 rounded-2xl p-6 cursor-pointer"
                  >
                    <h4 className="text-lg font-semibold">{event.title}</h4>
                    <p className="text-gray-400 text-sm mt-2">{formatDateDisplay(event.date)}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SELECTED DATE EVENTS */}
        {selectedDate && (
          <div className="pt-8 border-t border-white/10">
            <h4 className="mb-4 text-sm text-gray-400">
              Events on{" "}
              <span className="text-white font-medium">
                {formatDateDisplay(
                  `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
                )}
              </span>
            </h4>

            {eventsOnSelected.length === 0 ? (
              <p className="text-gray-500 text-sm">No events on this date.</p>
            ) : (
              eventsOnSelected.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`}>
                  <div className="mb-3 p-4 border border-white/10 rounded-xl hover:border-white/30 transition">
                    <p className="font-medium">{event.title}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}