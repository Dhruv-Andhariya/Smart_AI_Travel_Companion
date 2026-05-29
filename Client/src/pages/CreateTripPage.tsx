import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Seo } from "@/components/common/Seo";
import MagneticButton from "@/components/common/MagneticButton";
import Skeleton from "@/components/common/Skeleton";
import { sampleCities, tripThemes, interestOptions } from "@/lib/constants";
import { useTripStore } from "@/store/tripStore";
import BrandLogo from "@/components/brand/BrandLogo";
import { formatINR } from "@/lib/currency";

const schema = z.object({
  title: z.string().min(3, "Add a clear trip title"),
  destination: z.string().min(2, "Choose a destination"),
  budget: z.coerce.number().min(50, "Budget is required"),
  totalDays: z.coerce.number().min(1).max(30),
  travelType: z.string().min(2, "Select a travel type"),
  interests: z.string().min(2, "Choose at least one interest"),
});

type FormValues = z.infer<typeof schema>;

function StepPill({ step, active }: { step: number; active: boolean }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all ${active ? "border-[var(--accent-cyan)] bg-[rgba(6,182,212,0.12)] text-[var(--text-primary)]" : "border-[var(--border-soft)] text-[var(--text-tertiary)]"}`}>
      {step}
    </div>
  );
}

export default function CreateTripPage() {
  const navigate = useNavigate();
  const setSelectedTrip = useTripStore((state) => state.setSelectedTrip);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [destinationSearch, setDestinationSearch] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      destination: "",
      budget: undefined as unknown as number,
      totalDays: undefined as unknown as number,
      travelType: "",
      interests: "",
    },
  });

  const destination = watch("destination");
  const interests = watch("interests");
  const budget = watch("budget");
  const totalDays = watch("totalDays");

  const filteredCities = useMemo(() => {
    const query = destinationSearch.trim().toLowerCase();
    if (!query) return sampleCities;
    return sampleCities.filter((city) => city.toLowerCase().includes(query));
  }, [destinationSearch]);

  const createTrip = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await api.post("/trip/create", values);
      return response.data;
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createTrip.mutateAsync(values);
      const trip = created.trip ?? created.data?.trip ?? created;
      setSelectedTrip(trip);
      setIsGenerating(true);
      toast.success("Trip created. AI generation started");

      // Start AI generation immediately after trip creation.
      const itineraryPromise = api
        .post(`/ai/itinerary/${trip.id}`)
        .then((response) => {
          const itinerary = response.data?.itinerary ?? response.data;
          window.localStorage.setItem(`tripai_itinerary_${trip.id}`, JSON.stringify(itinerary));
        })
        .catch(() => {
          // Itinerary page can still generate on load; keep this non-blocking.
        });

      // Navigate immediately so UX remains fast while AI continues in background.
      navigate(`/app/itinerary/${trip.id}`);
      void itineraryPromise;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to create trip");
    } finally {
      setIsGenerating(false);
    }
  });

  const stepsComplete = [step >= 1, step >= 2, step >= 3];

  return (
    <>
      <Seo title="Create trip" />
      <div className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between rounded-[var(--radius-3xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-6 py-4 backdrop-blur-2xl">
            <BrandLogo size={36} showWordmark />
            <div className="hidden items-center gap-3 md:flex">
              {stepsComplete.map((active, index) => (
                <div key={index} className="flex items-center gap-3">
                  <StepPill step={index + 1} active={active} />
                  {index < 2 ? <div className={`h-px w-16 ${active ? "bg-[var(--accent-cyan)]" : "bg-[var(--border-soft)]"}`} /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="glass-card-strong rounded-[var(--radius-3xl)] p-6 md:p-8">
              <div className="space-y-3">
                <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Create trip</p>
                <h1 className="font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)] md:text-5xl">Three steps to a premium itinerary</h1>
                <p className="text-[var(--text-secondary)]">Destination autocomplete, budget planning, and interest selection all feed the AI itinerary generator.</p>
              </div>

              <form className="mt-8 space-y-8" onSubmit={onSubmit}>
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="block space-y-2 md:col-span-2">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">Trip title</span>
                        <input {...register("title")} placeholder="Luxury Goa Trip" className="w-full rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-3 text-[var(--text-primary)] outline-none focus:shadow-[0_0_0_1px_rgba(139,92,246,0.34),0_0_0_6px_rgba(139,92,246,0.12)]" />
                        {errors.title ? <p className="text-sm text-[#fca5a5]">{errors.title.message}</p> : null}
                      </label>
                      <label className="block space-y-2 md:col-span-2">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">Destination</span>
                        <input
                          value={destinationSearch}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setDestinationSearch(nextValue);
                            setValue("destination", nextValue, { shouldValidate: true, shouldDirty: true });
                          }}
                          placeholder="Search like Google Maps..."
                          className="w-full rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-3 text-[var(--text-primary)] outline-none focus:shadow-[0_0_0_1px_rgba(139,92,246,0.34),0_0_0_6px_rgba(139,92,246,0.12)]"
                        />
                        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                          {filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setValue("destination", city, { shouldValidate: true });
                                setDestinationSearch(city);
                              }}
                              className={`rounded-[var(--radius-xl)] border px-4 py-3 text-left text-sm transition-colors ${destination === city ? "border-[rgba(6,182,212,0.4)] bg-[rgba(6,182,212,0.12)] text-[var(--text-primary)]" : "border-[var(--border-soft)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                        {errors.destination ? <p className="text-sm text-[#fca5a5]">{errors.destination.message}</p> : null}
                      </label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Budget</span>
                      <input {...register("budget")} type="number" className="w-full rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-3 text-[var(--text-primary)] outline-none focus:shadow-[0_0_0_1px_rgba(139,92,246,0.34),0_0_0_6px_rgba(139,92,246,0.12)]" />
                      {errors.budget ? <p className="text-sm text-[#fca5a5]">{errors.budget.message}</p> : null}
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Total days</span>
                      <input {...register("totalDays")} type="number" className="w-full rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-3 text-[var(--text-primary)] outline-none focus:shadow-[0_0_0_1px_rgba(139,92,246,0.34),0_0_0_6px_rgba(139,92,246,0.12)]" />
                      {errors.totalDays ? <p className="text-sm text-[#fca5a5]">{errors.totalDays.message}</p> : null}
                    </label>
                    <label className="block space-y-2 md:col-span-2">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Travel type</span>
                      <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-5">
                        {tripThemes.map((theme) => (
                          <button key={theme.value} type="button" onClick={() => setValue("travelType", theme.value, { shouldValidate: true })} className={`rounded-[var(--radius-xl)] border px-4 py-3 text-sm transition-colors ${watch("travelType") === theme.value ? "border-[rgba(139,92,246,0.45)] bg-[rgba(139,92,246,0.14)] text-[var(--text-primary)]" : "border-[var(--border-soft)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                            {theme.label}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" {...register("travelType")} />
                      {errors.travelType ? <p className="text-sm text-[#fca5a5]">{errors.travelType.message}</p> : null}
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Interests</span>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {interestOptions.map((interest) => {
                          const selected = interests.toLowerCase().includes(interest.toLowerCase());
                          return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => {
                                const parts = interests.split(",").map((item) => item.trim()).filter(Boolean);
                                const next = selected ? parts.filter((item) => item.toLowerCase() !== interest.toLowerCase()) : [...parts, interest];
                                setValue("interests", next.join(", "), { shouldValidate: true });
                              }}
                              className={`rounded-[var(--radius-xl)] border px-4 py-3 text-left text-sm transition-colors ${selected ? "border-[rgba(6,182,212,0.44)] bg-[rgba(6,182,212,0.12)] text-[var(--text-primary)]" : "border-[var(--border-soft)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                      <input {...register("interests")} className="sr-only" />
                      {errors.interests ? <p className="text-sm text-[#fca5a5]">{errors.interests.message}</p> : null}
                    </label>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-6">
                  <button type="button" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))} className="rounded-full border border-[var(--border-soft)] px-5 py-3 text-sm text-[var(--text-primary)] disabled:opacity-50">
                    Back
                  </button>
                  <div className="flex gap-3">
                    {step < 3 ? (
                      <MagneticButton type="button" variant="secondary" onClick={() => setStep((value) => Math.min(3, value + 1))}>Continue</MagneticButton>
                    ) : (
                      <MagneticButton type="submit" onClick={undefined}>
                        {isSubmitting || isGenerating ? "Generating itinerary..." : "Create trip"}
                      </MagneticButton>
                    )}
                  </div>
                </div>
              </form>
            </section>

            <aside className="space-y-6">
              <div className="glass-card rounded-[var(--radius-3xl)] p-6">
                <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Preview</p>
                <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)]">Live trip summary</h2>
                <div className="mt-5 space-y-4 rounded-[var(--radius-2xl)] border border-[var(--border-soft)] p-5">
                  <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]"><span>Destination</span><span>{destination || "Choose a city"}</span></div>
                  <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]"><span>Budget</span><span>{formatINR(Number(budget || 0))}</span></div>
                  <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]"><span>Days</span><span>{totalDays || 0}</span></div>
                  <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]"><span>Interests</span><span>{interests || "Add interests"}</span></div>
                </div>
              </div>
              <div className="glass-card rounded-[var(--radius-3xl)] p-6">
                <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">AI loader</p>
                <h3 className="mt-2 font-display text-3xl text-[var(--text-primary)]">Crafting your perfect journey…</h3>
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}