
import React from "react";
import { cn } from "../../lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  success: "bg-green-50 text-success ring-green-200",
  warning: "bg-amber-50 text-warning ring-amber-200",
  danger: "bg-red-50 text-danger ring-red-200",
  info: "bg-blue-50 text-info ring-blue-200",
  brand: "bg-brand-50 text-brand-600 ring-brand-200"
};

export function Badge({
  tone = "neutral",
  dot,
  className,
  children





}: {tone?: Tone;dot?: boolean;className?: string;children: React.ReactNode;}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className
      )}>
      
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>);

}