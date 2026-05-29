import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Seo } from "@/components/common/Seo";
import Skeleton from "@/components/common/Skeleton";
import MagneticButton from "@/components/common/MagneticButton";
import { fadeUp, staggerContainer, routeDraw } from "@/utils/animations";
import { useTypewriter } from "@/hooks/useTypewriter";
import { formatINR } from "@/lib/currency";
import { getWeather } from "@/lib/weatherService";
import MapCard from "@/components/trip/MapCard";

type Trip = {
  id: number;
  title: string;
  destination: string;
  budget: number;
  totalDays: number;
  travelType: string;
  interests: string;
};

type ItineraryDay = {
  dayNumber: number;
  title: string;
  description: string;
};

function normalizeTrip(payload: any): Trip | null {
  const value = payload?.trip ?? payload?.data?.trip ?? payload;
  return value?.id ? value : null;
}

function normalizeItinerary(payload: any): ItineraryDay[] {
  const value = payload?.itinerary ?? payload?.data?.itinerary ?? payload;
  return Array.isArray(value) ? value : [];
}

function getCachedItinerary(tripId: string) {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(`tripai_itinerary_${tripId}`);
  return raw ? (JSON.parse(raw) as ItineraryDay[]) : null;
}

function setCachedItinerary(tripId: string, itinerary: ItineraryDay[]) {
  window.localStorage.setItem(`tripai_itinerary_${tripId}`, JSON.stringify(itinerary));
}

function buildSegmentSummaries(day: ItineraryDay) {
  const sentences = day.description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const fallbackBase = day.description.trim() || day.title;
  const morning = sentences[0] || fallbackBase;
  const afternoon = sentences[1] || `A natural follow-up to the morning plan with a different pace around ${day.title.toLowerCase()}.`;
  const evening = sentences[2] || `Wrap the day with a slower, more premium finish that matches the ${day.title.toLowerCase()} vibe.`;

  return {
    Morning: morning,
    Afternoon: afternoon,
    Evening: evening,
  };
}

function roundToNearest(value: number, step: number) {
  return Math.max(step, Math.round(value / step) * step);
}

function getDayBudget(tripBudget: number, totalDays: number, dayNumber: number) {
  const safeDays = Math.max(1, totalDays);
  const baseDayBudget = Math.max(500, tripBudget / safeDays);

  // Keep day budgets realistic: arrival days are slightly lighter, middle days richer, last day slightly lighter.
  const midpoint = (safeDays + 1) / 2;
  const distanceFromMid = Math.abs(dayNumber - midpoint);
  const spread = safeDays <= 1 ? 0 : distanceFromMid / Math.max(1, midpoint);
  const weight = 1.08 - spread * 0.16;

  return roundToNearest(baseDayBudget * weight, 100);
}

function BrainLoader() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(10,38,75,0.04),rgba(255,255,255,0.03))] p-8 text-center shadow-[var(--shadow-card)]">
      <div className="mb-6 flex items-center gap-2 rounded-full border border-[rgba(6,182,212,0.16)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
        <span className="h-2 w-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_16px_rgba(6,182,212,0.6)]" />
        Generating live itinerary
      </div>
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[rgba(6,182,212,0.2)] bg-[rgba(139,92,246,0.08)]"
        animate={{ boxShadow: ["0 0 0px rgba(139,92,246,0)", "0 0 38px rgba(139,92,246,0.3)", "0 0 0px rgba(139,92,246,0)"] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <span className="text-4xl">🧠</span>
        <motion.span className="absolute inset-0 rounded-full border border-[rgba(6,182,212,0.2)]" animate={{ scale: [1, 1.16, 1], opacity: [0.7, 0.15, 0.7] }} transition={{ duration: 2.4, repeat: Infinity }} />
      </motion.div>
      <p className="mt-5 font-display text-2xl text-[var(--text-primary)]">Assembling your trip story…</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        Mapping the route, balancing the budget, and shaping each day into a smoother travel plan.
      </p>

      <div className="mt-6 w-full max-w-md space-y-3 text-left">
        {[
          "Checking destination vibes",
          "Balancing spend across each day",
          "Building morning, afternoon, and evening plans",
        ].map((item, index) => (
          <motion.div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.16, duration: 0.4 }}
          >
            <motion.span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(6,182,212,0.12)] text-sm text-[var(--accent-cyan)]"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8 + index * 0.2, repeat: Infinity }}
            >
              ✓
            </motion.span>
            <span className="text-sm text-[var(--text-secondary)]">{item}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 w-full max-w-md overflow-hidden rounded-full bg-[rgba(148,163,184,0.14)]">
        <motion.div
          className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(10,38,75,0.92),rgba(6,182,212,0.92),rgba(139,92,246,0.88))]"
          animate={{ x: ["-30%", "110%"] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "linear" }}
          style={{ width: "30%" }}
        />
      </div>

      <p className="mt-4 font-mono text-sm text-[var(--accent-cyan)]">
        Loading itinerary <span className="type-cursor">...</span>
      </p>
    </div>
  );
}

function BudgetSidebar({ trip, itinerary }: { trip: Trip; itinerary: ItineraryDay[] }) {
  const split = [
    { name: "Stay", value: 40 },
    { name: "Transport", value: 20 },
    { name: "Food", value: 18 },
    { name: "Activities", value: 22 },
  ];

  const breakdown = split.map((item) => ({
    ...item,
    amount: Math.round((trip.budget * item.value) / 100),
  }));

  return (
    <aside className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
      <div className="glass-card rounded-[var(--radius-3xl)] p-6">
        <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Budget</p>
        <h3 className="mt-2 font-display text-3xl text-[var(--text-primary)]">{formatINR(trip.budget)} planned</h3>
        <div className="mt-6 h-72 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={split} margin={{ top: 8, right: 10, left: 10, bottom: 8 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
              <YAxis hide domain={[0, 50]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Share"]}
                contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)", borderRadius: "18px" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="rgba(10,38,75,0.78)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 space-y-4">
          {breakdown.map((item) => (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>{item.name}</span>
                <span>{formatINR(item.amount)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(148,163,184,0.18)]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(10,38,75,0.9),rgba(6,182,212,0.72))]" style={{ width: `${item.value}%`, minWidth: "32px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[var(--radius-3xl)] p-6">
        <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">AI summary</p>
        <h4 className="mt-2 font-display text-2xl text-[var(--text-primary)]">Trip profile</h4>
        <div className="mt-5 space-y-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center justify-between"><span>Days</span><span>{trip.totalDays}</span></div>
          <div className="flex items-center justify-between"><span>Theme</span><span>{trip.travelType}</span></div>
          <div className="flex items-center justify-between"><span>Interests</span><span>{trip.interests}</span></div>
          <div className="flex items-center justify-between"><span>Day cards</span><span>{itinerary.length}</span></div>
        </div>
      </div>
    </aside>
  );
}

function TimelineCard({ day, tripBudget, totalDays }: { day: ItineraryDay; tripBudget: number; totalDays: number }) {
  const focusText = `${day.title}. ${day.description}`;
  const { text, showCursor } = useTypewriter(focusText, 18, 700);
  const segmentSummaries = buildSegmentSummaries(day);
  const dayBudget = getDayBudget(tripBudget, totalDays, day.dayNumber);

  const morningAmount = roundToNearest(dayBudget * 0.28, 50);
  const afternoonAmount = roundToNearest(dayBudget * 0.34, 50);
  const eveningAmount = Math.max(50, dayBudget - morningAmount - afternoonAmount);

  const segments = [
    { slot: "Morning", time: "08:00", amount: morningAmount, icon: "☀️", tone: "fresh start" },
    { slot: "Afternoon", time: "13:00", amount: afternoonAmount, icon: "🧭", tone: "midday momentum" },
    { slot: "Evening", time: "19:00", amount: eveningAmount, icon: "🌙", tone: "premium close" },
  ];

  return (
    <motion.article variants={fadeUp} className="relative rounded-[var(--radius-3xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-6 shadow-[var(--shadow-card)] transition-all duration-[var(--dur-base)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <div className="absolute left-[-1.45rem] top-8 hidden h-4 w-4 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_0_6px_rgba(6,182,212,0.08)] md:block" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Day {day.dayNumber}</p>
          <h3 className="mt-2 font-display text-3xl text-[var(--text-primary)]">{day.title}</h3>
        </div>
        <div className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-xs text-[var(--text-secondary)]">Premium route</div>
      </div>
      <p className="mt-5 max-w-3xl text-[var(--text-secondary)]">
        {text}
        <span className={`${showCursor ? "opacity-100" : "opacity-0"} type-cursor ml-1 text-[var(--accent-cyan)]`}>|</span>
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {segments.map((segment, index) => (
          <div key={segment.slot} className="rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span>{segment.icon} {segment.slot}</span>
              <span className="rounded-full border border-[var(--border-soft)] px-2 py-1 text-[0.7rem]">{segment.time}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">{segment.tone}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-tertiary)]">{segmentSummaries[segment.slot as keyof typeof segmentSummaries]}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Cost estimate</span>
              <span>{formatINR(segment.amount)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {[
          ["Activity card", "Glassmorphism, hover lift, category icon"],
          ["Time badge", "Structured moments that feel premium and scannable"],
        ].map(([title, body]) => (
          <div key={title} className="rounded-[var(--radius-2xl)] border border-[var(--border-soft)] p-4">
            <p className="font-medium text-[var(--text-primary)]">{title}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{body}</p>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

export default function ItineraryPage() {
  const { tripId = "" } = useParams();
  const [heroOffset, setHeroOffset] = useState(0);
  const [heroImageSrc, setHeroImageSrc] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [mapCoordinates, setMapCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    const onScroll = () => setHeroOffset(window.scrollY * 0.18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cachedItinerary = useMemo(() => getCachedItinerary(tripId), [tripId]);

  const tripQuery = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await api.get(`/trip/${tripId}`);
      return response.data;
    },
    enabled: Boolean(tripId),
  });

  const itineraryQuery = useQuery({
    queryKey: ["itinerary", tripId],
    queryFn: async () => {
      const response = await api.post(`/ai/itinerary/${tripId}`);
      const itinerary = normalizeItinerary(response.data);
      setCachedItinerary(tripId, itinerary);
      return itinerary;
    },
    enabled: Boolean(tripId) && !cachedItinerary,
    initialData: cachedItinerary ?? undefined,
  });

  const currentTrip = normalizeTrip(tripQuery.data);

  const regenerate = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/ai/itinerary/${tripId}`);
      const itinerary = normalizeItinerary(response.data);
      setCachedItinerary(tripId, itinerary);
      return itinerary;
    },
    onSuccess: (data) => {
      toast.success("Itinerary regenerated");
      itineraryQuery.refetch();
      setCachedItinerary(tripId, data);
    },
  });

  const saveToClipboard = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  };

  const exportPdf = async () => {
    try {
      const element = document.getElementById("itinerary-root") ?? document.body;
      const html2pdf = (await import("html2pdf.js"))?.default;
      if (!html2pdf) throw new Error("html2pdf not available");

      const filename = `${(trip?.title || "itinerary").replace(/\s+/g, "_")}.pdf`;
      const opt = {
        margin: 0.6,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      } as any;

      // Fire and forget — html2pdf opens a save dialog when done.
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF. Use browser Print → Save as PDF as a fallback.");
    }
  };

  const trip = currentTrip ?? ({
    id: Number(tripId),
    title: "Your trip",
    destination: "Destination",
    budget: 50000,
    totalDays: 5,
    travelType: "FRIENDS",
    interests: "Beaches, nightlife",
  } as Trip);

  const itinerary = itineraryQuery.data ?? [];
  const itineraryDayCount = Math.max(1, itinerary.length || trip.totalDays || 1);

  useEffect(() => {
    setHeroImageSrc(`https://source.unsplash.com/featured/1600x900/?${encodeURIComponent(trip.destination)},travel`);
  }, [trip.destination]);

  useEffect(() => {
    if (!currentTrip?.destination || currentTrip.destination === "Destination") return;

    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError("");

    const fetchWeather = async () => {
      try {
        const data = await getWeather(currentTrip.destination);
        if (!cancelled) setWeather(data);
      } catch (error) {
        console.log(error);
        if (!cancelled) setWeatherError("Weather unavailable right now");
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    };

    void fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [currentTrip?.destination]);

  useEffect(() => {
    if (!trip.destination || trip.destination === "Destination") return;

    let cancelled = false;
    setMapCoordinates(null);
    setMapError("");

    const loadCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(trip.destination)}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to geocode destination");
        }

        const results = (await response.json()) as Array<{ lat: string; lon: string }>;
        const place = results[0];

        if (!place) {
          throw new Error("No coordinates found");
        }

        if (!cancelled) {
          setMapCoordinates({ latitude: Number(place.lat), longitude: Number(place.lon) });
        }
      } catch (error) {
        console.log(error);
        if (!cancelled) {
          setMapError("Map location unavailable right now");
        }
      }
    };

    void loadCoordinates();

    return () => {
      cancelled = true;
    };
  }, [trip.destination]);

  return (
    <>
      <Seo title={`Itinerary · ${trip.destination}`} />
      <div id="itinerary-root" className="min-h-screen pb-28">
        <section className="relative h-[60vh] overflow-hidden border-b border-[var(--border-soft)]">
          <motion.div className="absolute inset-0" style={{ y: heroOffset }}>
            {heroImageSrc ? (
              <img
                src={heroImageSrc}
                alt={trip.destination}
                className="h-full w-full object-cover"
                onError={() => {
                  if (heroImageSrc.includes("pexels.com")) {
                    setHeroImageSrc("");
                    return;
                  }
                  setHeroImageSrc("https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600");
                }}
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.28),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.24),transparent_30%),linear-gradient(180deg,rgba(255,236,204,0.9),rgba(255,226,173,0.9))]" />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,216,0.08),rgba(245,209,140,0.52))]" />
          <div className="container-shell relative z-10 flex h-full flex-col justify-end px-4 py-10 md:px-8 lg:px-10">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-4xl">
              <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">AI itinerary</p>
              <h1 className="mt-3 font-display text-5xl tracking-[-0.06em] text-[rgba(10,38,75,0.82)] md:text-7xl">{trip.destination} escape</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[rgba(10,38,75,0.82)]">Day-by-day vertical timeline with budget planning, activity cards, and premium travel storytelling.</p>
            </motion.div>
          </div>
        </section>

        {(weatherLoading || weather || weatherError) && (
          <div className="container-shell px-4 pt-6 md:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-[var(--radius-3xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-6 shadow-[var(--shadow-card)] backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Live weather</p>
                  <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)]">{trip.destination}</h2>
                  {weatherLoading ? (
                    <p className="mt-2 text-[var(--text-secondary)]">Loading current conditions...</p>
                  ) : weatherError ? (
                    <p className="mt-2 text-[var(--text-secondary)]">{weatherError}</p>
                  ) : (
                    <p className="mt-2 capitalize text-[var(--text-secondary)]">{weather?.weather?.[0]?.description || "Clear"}</p>
                  )}
                </div>
                {!weatherLoading && weather?.weather?.[0]?.icon ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="weather"
                    className="h-24 w-24"
                  />
                ) : null}
              </div>

              {!weatherLoading && weather && (
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="text-sm text-[var(--text-tertiary)]">Temperature</p>
                    <h3 className="mt-2 text-4xl font-bold text-[var(--text-primary)]">{Math.round(weather.main?.temp)}°C</h3>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="text-sm text-[var(--text-tertiary)]">Humidity</p>
                    <h3 className="mt-2 text-4xl font-bold text-[var(--text-primary)]">{weather.main?.humidity}%</h3>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="text-sm text-[var(--text-tertiary)]">Wind Speed</p>
                    <h3 className="mt-2 text-4xl font-bold text-[var(--text-primary)]">{weather.wind?.speed} m/s</h3>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        <div className="container-shell px-4 pt-6 md:px-8 lg:px-10">
          {mapCoordinates ? (
            <MapCard latitude={mapCoordinates.latitude} longitude={mapCoordinates.longitude} destination={trip.destination} />
          ) : (
            <div className="rounded-[var(--radius-3xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-6 text-[var(--text-secondary)] shadow-[var(--shadow-card)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-tertiary)]">Destination map</p>
              <p className="mt-2 text-base text-[var(--text-primary)]">{mapError || `Finding ${trip.destination} on the map...`}</p>
            </div>
          )}
        </div>

        <main className="container-shell grid gap-8 px-4 py-8 xl:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            {itineraryQuery.isLoading ? (
              <BrainLoader />
            ) : itinerary.length ? (
              <motion.div initial="hidden" animate="show" variants={staggerContainer} className="relative space-y-6 border-l border-[rgba(6,182,212,0.22)] pl-6 md:pl-8">
                <motion.svg aria-hidden="true" className="absolute left-0 top-0 h-full w-6 overflow-visible">
                  <motion.path d="M12 0 V1000" stroke="rgba(139,92,246,0.4)" strokeWidth="2" fill="none" variants={routeDraw} initial="hidden" animate="show" />
                </motion.svg>
                {itinerary.map((day) => (
                  <TimelineCard key={day.dayNumber} day={day} tripBudget={trip.budget} totalDays={itineraryDayCount} />
                ))}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-72" />
                ))}
              </div>
            )}
          </section>
          <BudgetSidebar trip={trip} itinerary={itinerary} />
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-soft)] bg-[var(--bg-glass-strong)] px-4 py-4 backdrop-blur-2xl">
          <div className="container-shell flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">Action bar</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Regenerate, export, share, and save your itinerary.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <MagneticButton variant="secondary" onClick={() => regenerate.mutate()}>Regenerate</MagneticButton>
              <MagneticButton variant="secondary" onClick={exportPdf}>Export PDF</MagneticButton>
              <MagneticButton variant="secondary" onClick={saveToClipboard}>Share link</MagneticButton>
              <MagneticButton onClick={() => toast.success("Saved to your local session")}>
                Save
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="container-shell px-4 pb-10 pt-4">
          <Link to="/app/dashboard" className="text-sm text-[var(--accent-cyan)]">Back to dashboard</Link>
        </div>
      </div>
    </>
  );
}