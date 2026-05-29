import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import api from "@/lib/api";
import { Seo } from "@/components/common/Seo";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/brand/BrandLogo";
import MagneticButton from "@/components/common/MagneticButton";
import Skeleton from "@/components/common/Skeleton";
import { fadeUp, staggerContainer } from "@/utils/animations";
import { formatINR } from "@/lib/currency";

type Trip = {
  id: number;
  title: string;
  destination: string;
  budget: number;
  totalDays: number;
  travelType: string;
  interests: string;
};

function normalizeTrips(payload: any): Trip[] {
  const rawTrips = payload?.trips ?? payload?.data?.trips ?? payload ?? [];
  return Array.isArray(rawTrips) ? rawTrips : [];
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="glass-card rounded-[var(--radius-2xl)] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-3 font-display text-4xl text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{hint}</p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const userQueryKey = user?.id ?? "guest";

  const { data, isLoading } = useQuery({
    queryKey: ["trips", userQueryKey],
    queryFn: async () => {
      const response = await api.get("/trips");
      return response.data;
    },
    enabled: Boolean(user?.id),
  });

  const trips = useMemo(() => normalizeTrips(data), [data]);

  const chartData = trips.slice(0, 6).map((trip, index) => ({
    name: trip.destination,
    value: trip.budget / Math.max(1, trip.totalDays) + index * 50,
  }));

  const budgetSplit = trips.length
    ? [
        { name: "Stay", value: 42, color: "#8B5CF6" },
        { name: "Food", value: 20, color: "#06B6D4" },
        { name: "Transport", value: 18, color: "#A78BFA" },
        { name: "Activities", value: 20, color: "#22D3EE" },
      ]
    : [
        { name: "Stay", value: 0, color: "#8B5CF6" },
        { name: "Food", value: 0, color: "#06B6D4" },
        { name: "Transport", value: 0, color: "#A78BFA" },
        { name: "Activities", value: 0, color: "#22D3EE" },
      ];

  const hasQuickStats = budgetSplit.some((item) => item.value > 0);

  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);

  return (
    <>
      <Seo title="Dashboard" />
      <div className="flex min-h-screen bg-[transparent] text-[var(--text-primary)]">
        <aside className={`sticky top-0 hidden h-screen border-r border-[var(--border-soft)] bg-[var(--bg-glass)] backdrop-blur-2xl lg:flex ${sidebarCollapsed ? "w-24" : "w-72"} flex-col transition-all duration-[var(--dur-base)]`}>
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] p-5">
            <BrandLogo size={38} animated showWordmark={!sidebarCollapsed} />
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="rounded-full border border-[var(--border-soft)] px-3 py-2 text-xs text-[var(--text-primary)]"
            >
              {sidebarCollapsed ? ">" : "<"}
            </button>
          </div>
          <div className="flex-1 space-y-4 p-5">
            <div className="glass-card rounded-[var(--radius-2xl)] p-4">
              <p className="text-xs text-[var(--text-tertiary)]">Welcome back</p>
              <p className="mt-2 font-display text-2xl">{user?.name || "Traveler"}</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Your trips are ready when you are.</p>
            </div>
            <nav className="space-y-2 text-sm">
              {[
                ["Dashboard", "/app/dashboard"],
                ["AI chat", "/app/chat"],
                ["Create trip", "/app/create"],
                ["Landing", "/"],
              ].map(([label, href]) => (
                <Link key={label} to={href} className="flex items-center gap-3 rounded-[var(--radius-xl)] px-4 py-3 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                  {!sidebarCollapsed ? label : ""}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="mx-auto max-w-7xl space-y-8">
            <motion.section variants={fadeUp} className="glass-card-strong rounded-[var(--radius-3xl)] p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl space-y-4">
                  <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Dashboard</p>
                  <h1 className="font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)] md:text-6xl">Your AI travel command center</h1>
                  <p className="text-[var(--text-secondary)]">Create better trips, review generated itineraries, and keep every journey organized in one polished workspace.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <MagneticButton onClick={() => navigate("/app/create")}>Create trip</MagneticButton>
                  <MagneticButton variant="secondary" onClick={() => navigate("/app/create")}>AI suggest</MagneticButton>
                  <MagneticButton variant="secondary" onClick={() => navigate("/app/chat")}>Open AI chat</MagneticButton>
                </div>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Trips" value={String(trips.length || 0)} hint="Active and archived journeys" />
              <StatCard label="Total budget" value={formatINR(totalBudget)} hint="Planned across all trips" />
              <StatCard label="Avg. days" value={trips.length ? String(Math.round(trips.reduce((sum, trip) => sum + trip.totalDays, 0) / trips.length)) : "0"} hint="Per itinerary" />
              <StatCard label="Profile" value={user ? user.name.split(" ")[0] : "Guest"} hint="Signed in and ready" />
            </motion.section>

            <motion.section variants={fadeUp} className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="glass-card rounded-[var(--radius-3xl)] p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Budget trend</p>
                    <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)]">Trip spend across your portfolio</h2>
                  </div>
                </div>
                <div className="mt-6 h-80 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="tripBudget" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.55} />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="rgba(148,163,184,0.55)" tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-soft)",
                            borderRadius: "20px",
                            color: "var(--text-primary)",
                          }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#tripBudget)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-[var(--radius-3xl)] p-6 md:p-7">
                <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Quick stats</p>
                <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)]">AI signal snapshot</h2>
                <div className="mt-6 h-64 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] p-4">
                  {hasQuickStats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={budgetSplit} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={4}>
                          {budgetSplit.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-soft)",
                            borderRadius: "20px",
                            color: "var(--text-primary)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-soft)] bg-[rgba(255,255,255,0.02)] text-center">
                      <p className="text-4xl font-semibold text-[var(--text-primary)]">0%</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">No trips yet</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  {budgetSplit.map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[rgba(148,163,184,0.18)]">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="glass-card rounded-[var(--radius-3xl)] p-6 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Trips</p>
                  <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)]">Your active journeys</h2>
                </div>
                <Link to="/app/create" className="text-sm text-[var(--accent-cyan)]">New itinerary</Link>
              </div>

              {isLoading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-52" />
                  ))}
                </div>
              ) : trips.length ? (
                <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {trips.map((trip) => (
                    <motion.article key={trip.id} variants={fadeUp} className="group rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-5 transition-all duration-[var(--dur-base)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-2xl text-[var(--text-primary)]">{trip.title}</h3>
                          <p className="mt-1 text-sm text-[var(--text-tertiary)]">{trip.destination}</p>
                        </div>
                        <div className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs text-[var(--text-secondary)]">{trip.travelType}</div>
                      </div>
                      <p className="mt-4 line-clamp-2 text-sm leading-7 text-[var(--text-secondary)]">{trip.interests}</p>
                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] p-3">
                          <p className="text-[var(--text-tertiary)]">Budget</p>
                          <p className="mt-1 font-medium text-[var(--text-primary)]">{formatINR(trip.budget)}</p>
                        </div>
                        <div className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] p-3">
                          <p className="text-[var(--text-tertiary)]">Days</p>
                          <p className="mt-1 font-medium text-[var(--text-primary)]">{trip.totalDays}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex gap-3">
                        <MagneticButton variant="secondary" className="flex-1" onClick={() => navigate(`/app/itinerary/${trip.id}`)}>Open</MagneticButton>
                        <MagneticButton className="flex-1" onClick={() => navigate(`/app/itinerary/${trip.id}`)}>AI suggest</MagneticButton>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <div className="mt-6 rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-soft)] p-10 text-center">
                  <p className="font-display text-3xl text-[var(--text-primary)]">No trips yet</p>
                  <p className="mt-3 text-[var(--text-secondary)]">Create your first itinerary and let the AI shape it into a polished plan.</p>
                  <MagneticButton className="mt-6" onClick={() => navigate("/app/create")}>Create your first trip</MagneticButton>
                </div>
              )}
            </motion.section>
          </motion.div>
        </main>
      </div>
    </>
  );
}