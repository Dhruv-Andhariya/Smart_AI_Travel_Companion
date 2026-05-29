import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrandLogo from "@/components/brand/BrandLogo";
import ParticleCanvas from "@/components/common/ParticleCanvas";
import TypewriterHeadline from "@/components/common/TypewriterHeadline";
import MagneticButton from "@/components/common/MagneticButton";
import Skeleton from "@/components/common/Skeleton";
import { Seo } from "@/components/common/Seo";
import { fadeUp, staggerContainer } from "@/utils/animations";
import { formatINR } from "@/lib/currency";

const featureCards = [
  {
    title: "AI Itinerary Composer",
    body: "Create day-by-day plans with budget-aware routing, activity suggestions, and premium presentation.",
  },
  {
    title: "Trip Intelligence",
    body: "Keep every trip synced to your account with secure auth, optimistic saves, and granular status updates.",
  },
  {
    title: "Design System First",
    body: "Every interaction is token-driven, responsive, and motion-aware with glass layers and glow shadows.",
  },
  {
    title: "Export Ready",
    body: "Share links, PDF exports, and dashboard previews help your team move from inspiration to action faster.",
  },
  {
    title: "Mobile Native Feel",
    body: "Optimized spacing, accessible touch targets, and smooth gestures keep the experience crisp on phones.",
  },
  {
    title: "Offline-Ready Patterns",
    body: "Local persistence, skeleton loading, and structured states keep the app resilient during real usage.",
  },
];

const pricing = [
  { name: "Starter", price: 0, items: ["1 active trip", "Basic AI generation", "Email support"] },
  { name: "Pro", price: 29, items: ["Unlimited trips", "Premium itinerary layouts", "Export and share tools"] },
  { name: "Studio", price: 79, items: ["Team workspaces", "Advanced analytics", "Priority support"] },
];

function PreviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(255,247,216,0.7)] px-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card-strong w-full max-w-4xl overflow-hidden rounded-[var(--radius-3xl)] p-4"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 pb-4 pt-2">
          <div>
            <p className="mono-badge text-[0.68rem] text-[var(--accent-cyan)]">AI Preview</p>
            <h3 className="mt-1 font-display text-2xl text-[var(--text-primary)]">Generated dashboard snapshot</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-sm text-[var(--text-primary)]">
            Close
          </button>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-4 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[var(--bg-card)] p-5">
            <Skeleton className="h-5 w-32" />
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-40" />
          </div>
          <div className="space-y-4 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[var(--bg-card)] p-5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-56" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Seo title="Trip AI" />
      <Navbar />
      <main>
        <section className="relative isolate min-h-[calc(100vh-var(--nav-height))] overflow-hidden">
          <ParticleCanvas />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-8rem] top-14 h-80 w-80 rounded-full bg-[rgba(139,92,246,0.28)] blur-3xl"
            animate={{ x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-6rem] top-28 h-96 w-96 rounded-full bg-[rgba(6,182,212,0.24)] blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/3 top-[42%] h-72 w-72 rounded-full bg-[#FFEBCC]/60 blur-3xl"
            animate={{ x: [0, 16, 0], y: [0, 10, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_24%),linear-gradient(180deg,rgba(255,247,216,0.02),rgba(255,244,214,0.76))]" />
          <div className="container-shell relative z-10 flex min-h-[calc(100vh-var(--nav-height))] flex-col items-center justify-center px-4 py-16 text-center">
            <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-5xl space-y-8">
              <motion.div variants={fadeUp} className="flex justify-center">
                <div className="glass-card inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm text-[var(--text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_18px_rgba(6,182,212,0.65)]" />
                  Trip AI is now live with cinematic planning workflows
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex justify-center">
                <BrandLogo size={54} animated showWordmark />
              </motion.div>

              <motion.div variants={fadeUp}>
                <TypewriterHeadline words={["Plan smarter trips", "Powered by AI", "Explore the world"]} />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mx-auto max-w-3xl text-lg leading-8 text-[rgba(10,38,75,0.82)] md:text-xl"
              >
                Build premium travel plans with AI-generated itineraries, elegant dashboards, and a workflow that feels
                like a serious product launch, not a prototype.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <MagneticButton onClick={() => setPreviewOpen(true)}>Preview AI output</MagneticButton>
                <MagneticButton onClick={() => navigate("/signup")}>Start free</MagneticButton>
              </motion.div>

              <motion.div variants={fadeUp} className="mx-auto max-w-6xl">
                <motion.div
                  className="glass-card-strong relative overflow-hidden rounded-[var(--radius-3xl)] p-4 md:p-6"
                  whileHover={{ rotateX: 4, rotateY: -4, scale: 1.01 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d", perspective: 1200 }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_28%)]" />
                  <div className="relative grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[var(--bg-card)] p-5 text-left shadow-[var(--shadow-card)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mono-badge text-[0.68rem] text-[var(--accent-cyan)]">Dashboard preview</p>
                          <h3 className="mt-2 font-display text-2xl text-[var(--text-primary)]">Your trips in one command center</h3>
                        </div>
                        <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs text-[var(--text-secondary)]">Live</span>
                      </div>
                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {[
                          ["Trips", "24"],
                          ["Itinerary score", "98"],
                          ["Saved time", "14h"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">{label}</p>
                            <p className="mt-2 font-display text-3xl text-[var(--text-primary)]">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--text-secondary)]">AI suggestions</p>
                            <span className="text-xs text-[var(--accent-cyan)]">optimizing</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[var(--text-tertiary)]">
                            Regenerate Goa itinerary with more beach time and a premium dinner block.
                          </p>
                        </div>
                        <div className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-4">
                          <p className="font-medium text-[var(--text-secondary)]">Budget usage</p>
                          <div className="mt-3 h-32 rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,rgba(139,92,246,0.28),rgba(6,182,212,0.12))]" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] bg-[var(--bg-card)] p-5 text-left shadow-[var(--shadow-card)]">
                      <div className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-4">
                        <p className="text-sm text-[var(--text-secondary)]">Your next trip</p>
                        <p className="mt-1 font-display text-2xl text-[var(--text-primary)]">Goa 5-day escape</p>
                        <div className="mt-4 space-y-3 text-sm text-[var(--text-tertiary)]">
                          <p>• Beach mornings</p>
                          <p>• Nightlife evenings</p>
                          <p>• Luxury stay routing</p>
                        </div>
                      </div>
                      <div className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-4">
                        <p className="text-sm text-[var(--text-secondary)]">Upcoming activity</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(6,182,212,0.14)] text-xl">✈</div>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">Airport pickup</p>
                            <p className="text-sm text-[var(--text-tertiary)]">7:30 AM tomorrow</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="container-shell px-4 py-24">
          <div className="mb-10 max-w-2xl">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Features</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[rgba(10,38,75,0.82)] md:text-5xl">Built like a premium AI product.</h2>
            <p className="mt-4 text-[rgba(10,38,75,0.82)]">Everything is designed as a cohesive system: motion, typography, glass, and conversion-focused content.</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <motion.article key={feature.title} variants={fadeUp} className="glass-card rounded-[var(--radius-2xl)] p-6 transition-transform duration-[var(--dur-base)] hover:-translate-y-1">
                <h3 className="font-display text-2xl text-[var(--text-primary)]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{feature.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section id="reviews" className="container-shell px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card rounded-[var(--radius-3xl)] p-8">
              <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Social proof</p>
              <h2 className="mt-3 font-display text-4xl text-[var(--text-primary)]">Loved by teams who care about craft.</h2>
              <p className="mt-4 text-[var(--text-secondary)]">A focused, high-clarity interface that helps users move from inspiration to an itinerary they can trust.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "The itinerary page feels like a luxury SaaS output.",
                "The motion system makes the product feel expensive.",
                "The auth flow and dashboard are clean and believable.",
                "The brand system is cohesive from favicon to footer.",
              ].map((quote) => (
                <div key={quote} className="glass-card rounded-[var(--radius-2xl)] p-6 text-sm leading-7 text-[var(--text-secondary)]">“{quote}”</div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="container-shell px-4 py-24">
          <div className="mb-10 max-w-2xl">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Pricing</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[rgba(10,38,75,0.82)] md:text-5xl">Simple plans for travel teams and power users.</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map((tier, index) => (
              <div
                key={tier.name}
                className={`rounded-[var(--radius-3xl)] border p-7 ${index === 1 ? "glass-card-strong border-[rgba(139,92,246,0.36)]" : "glass-card border-[var(--border-soft)]"}`}
              >
                <p className="text-sm font-medium text-[var(--accent-cyan)]">{tier.name}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl text-[var(--text-primary)]">{formatINR(tier.price)}</span>
                  <span className="pb-1 text-sm text-[var(--text-tertiary)]">/month</span>
                </div>
                <div className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                  {tier.items.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>
                <MagneticButton className="mt-8 w-full" onClick={() => navigate(index === 0 ? "/signup" : "/app/create")}>Choose plan</MagneticButton>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
}