import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

type Variant = "primary" | "secondary" | "inverse" | "text";

export function Cta({ to, children, variant = "primary", arrow = false }:
  { to: string; children: ReactNode; variant?: Variant; arrow?: boolean }) {
  return (
    <Link to={to} className={`uc-btn uc-btn-${variant}`}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </Link>
  );
}

export function Reveal({ children, delay = 0, className = "" }:
  { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, intro, className = "" }:
  { eyebrow: string; title: string; intro?: string; className?: string }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="uc-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {intro && <p className="uc-muted mt-3 leading-relaxed">{intro}</p>}
    </div>
  );
}
