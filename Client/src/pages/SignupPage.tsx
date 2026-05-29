import { useMemo, forwardRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/lib/api";
import BrandLogo from "@/components/brand/BrandLogo";
import MagneticButton from "@/components/common/MagneticButton";
import { Seo } from "@/components/common/Seo";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function StrengthMeter({ password }: { password: string }) {
  const score = useMemo(() => {
    let value = 0;
    if (password.length >= 8) value += 1;
    if (/[A-Z]/.test(password)) value += 1;
    if (/[0-9]/.test(password)) value += 1;
    if (/[^A-Za-z0-9]/.test(password)) value += 1;
    return value;
  }, [password]);

  const widths = [25, 50, 75, 100];
  const labels = ["Weak", "Fair", "Strong", "Excellent"];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span>Password strength</span>
        <span>{labels[Math.max(0, score - 1)] || "Too short"}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[rgba(148,163,184,0.18)]">
        <div className="h-full rounded-full bg-[var(--accent-gradient)] transition-all duration-[var(--dur-base)]" style={{ width: widths[Math.max(0, score - 1)] ? `${widths[score - 1]}%` : "12%" }} />
      </div>
    </div>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-var(--nav-height))] lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative hidden overflow-hidden border-r border-[var(--border-soft)] bg-[var(--bg-glass)] p-8 lg:block">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <motion.div className="relative z-10 flex h-full flex-col justify-between" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
          <BrandLogo size={52} animated />
          <div className="max-w-xl space-y-6">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Start free</p>
            <h1 className="font-display text-6xl tracking-[-0.06em] text-[var(--text-primary)]">Create travel plans that feel handcrafted.</h1>
            <p className="text-lg leading-8 text-[var(--text-secondary)]">Trip AI turns a few inputs into a polished itinerary with visible quality from the first screen.</p>
          </div>
          <div className="glass-card rounded-[var(--radius-3xl)] p-5">
            <p className="text-sm text-[var(--text-secondary)]">Everything from logo to timeline is built with a single system of tokens.</p>
          </div>
        </motion.div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </div>
  );
}

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({ label, error, ...props }, ref) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <input
        ref={ref}
        {...props}
        className="w-full rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-3 text-[var(--text-primary)] outline-none transition-shadow duration-[var(--dur-fast)] placeholder:text-[var(--text-muted)] focus:shadow-[0_0_0_1px_rgba(139,92,246,0.34),0_0_0_6px_rgba(139,92,246,0.12)]"
      />
      {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}
    </label>
  );
});

FormField.displayName = "FormField";

export default function SignupPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const password = watch("password") || "";

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await api.post("/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      const loginResponse = await api.post("/login", {
        email: values.email,
        password: values.password,
      });

      setSession(loginResponse.data.token, loginResponse.data.user);
      toast.success(response.data.message || "Account created");
      navigate("/app/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to create account");
    }
  };

  return (
    <>
      <Seo title="Sign up" />
      <AuthShell>
        <div className="glass-card-strong rounded-[var(--radius-3xl)] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <BrandLogo size={40} showWordmark />
            <Link to="/login" className="text-sm text-[var(--accent-cyan)]">Sign in</Link>
          </div>
          <div className="mt-8 space-y-2">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Create account</p>
            <h2 className="font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">Get started with Trip AI</h2>
            <p className="text-sm text-[var(--text-secondary)]">Build your first itinerary in minutes with a premium UI that feels production ready.</p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Full name" placeholder="Dhruv Sharma" error={errors.name?.message} {...register("name")} />
            <FormField label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
            <FormField label="Password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register("password")} />
            <StrengthMeter password={password} />
            <FormField label="Confirm password" type="password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <MagneticButton type="submit" className="w-full" onClick={undefined}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </MagneticButton>
          </form>
        </div>
      </AuthShell>
    </>
  );
}