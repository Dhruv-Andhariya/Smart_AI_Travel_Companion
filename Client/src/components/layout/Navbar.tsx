import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BrandLogo from "@/components/brand/BrandLogo";
import { navigationLinks } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[var(--bg-glass)] backdrop-blur-2xl">
      <div className="container-shell flex h-[var(--nav-height)] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo size={36} animated />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navigationLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                [
                  "text-sm font-medium text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--text-primary)]",
                  isActive ? "text-[var(--text-primary)]" : "",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/app/dashboard")}
                className="rounded-full bg-[linear-gradient(135deg,rgba(10,38,75,0.96),rgba(18,61,114,0.92))] px-4 py-2 text-sm font-semibold text-[rgba(255,255,255,0.98)] shadow-[0_12px_30px_rgba(10,38,75,0.26)] ring-1 ring-[rgba(255,255,255,0.28)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  navigate("/");
                }}
                className="rounded-full bg-[linear-gradient(135deg,rgba(10,38,75,0.96),rgba(18,61,114,0.92))] px-4 py-2 text-sm font-semibold text-[rgba(255,255,255,0.98)] shadow-[0_12px_30px_rgba(10,38,75,0.26)] ring-1 ring-[rgba(255,255,255,0.28)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full bg-[linear-gradient(135deg,rgba(10,38,75,0.96),rgba(18,61,114,0.92))] px-4 py-2 text-sm font-semibold text-[rgba(255,255,255,0.98)] shadow-[0_12px_30px_rgba(10,38,75,0.26)] ring-1 ring-[rgba(255,255,255,0.28)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[linear-gradient(135deg,rgba(10,38,75,0.96),rgba(18,61,114,0.92))] px-4 py-2 text-sm font-semibold text-[rgba(255,255,255,0.98)] shadow-[0_12px_30px_rgba(10,38,75,0.26)] ring-1 ring-[rgba(255,255,255,0.28)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}