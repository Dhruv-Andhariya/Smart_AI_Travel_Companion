import { useEffect, forwardRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/api";
import BrandLogo from "@/components/brand/BrandLogo";
import MagneticButton from "@/components/common/MagneticButton";
import { Seo } from "@/components/common/Seo";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-var(--nav-height))] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden border-r border-[var(--border-soft)] bg-[var(--bg-glass)] p-8 lg:block">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <motion.div
          className="relative z-10 flex h-full flex-col justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <BrandLogo size={52} animated />
          <div className="max-w-xl space-y-6">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Secure travel planning</p>
            <h1 className="font-display text-6xl tracking-[-0.06em] text-[var(--text-primary)]">Plan elegant trips with AI-driven precision.</h1>
            <p className="text-lg leading-8 text-[var(--text-secondary)]">
              The auth journey mirrors the rest of the product: cinematic gradients, glass surfaces, and a frictionless path into the dashboard.
            </p>
          </div>
          <div className="glass-card rounded-[var(--radius-3xl)] p-5">
            <p className="text-sm text-[var(--text-secondary)]">Trusted by modern teams shipping AI travel products.</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[["99.98%", "Uptime"], ["3x", "Faster planning"], ["24/7", "AI guidance"]].map(([value, label]) => (
                <div key={label} className="rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] p-3">
                  <p className="font-display text-2xl text-[var(--text-primary)]">{value}</p>
                  <p className="mt-1 text-xs text-[var(--text-tertiary)]">{label}</p>
                </div>
              ))}
            </div>
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

function OAuthButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        { label: "Google", icon: "G" },
        { label: "GitHub", icon: "⌘" },
      ].map((item) => (
        <button
          key={item.label}
          type="button"
          className="flex items-center justify-center gap-3 rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-glass)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(139,92,246,0.16)] text-sm">{item.icon}</span>
          Continue with {item.label}
        </button>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const from = (location.state as { from?: Location })?.from?.pathname || "/app/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    document.title = "Sign in · Trip AI";
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await api.post("/login", values);
      const payload = response.data;
      setSession(payload.token, payload.user);
      toast.success(payload.message || "Welcome back");
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to sign in");
    }
  };

  return (
    <>
      <Seo title="Sign in" />
      <AuthShell>
        <div className="glass-card-strong rounded-[var(--radius-3xl)] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <BrandLogo size={40} showWordmark />
            <Link to="/signup" className="text-sm text-[var(--accent-cyan)]">Create account</Link>
          </div>
          <div className="mt-8 space-y-2">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Welcome back</p>
            <h2 className="font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">Sign in to your dashboard</h2>
            <p className="text-sm text-[var(--text-secondary)]">Access your trips, regenerate AI plans, and keep everything synced.</p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
            <FormField label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <MagneticButton type="submit" className="w-full" onClick={undefined}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </MagneticButton>
          </form>
          <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            <span className="h-px flex-1 bg-[var(--border-soft)]" />
            <span>Or continue with</span>
            <span className="h-px flex-1 bg-[var(--border-soft)]" />
          </div>
          <OAuthButtons />
        </div>
      </AuthShell>
    </>
  );
}