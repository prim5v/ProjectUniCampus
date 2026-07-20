


import React from "react";
import { Card } from "./Card";

/**
 * StatCard — shown ONLY when real operational data exists. Never seeded with
 * placeholder numbers. Pages render empty states until data flows in.
 */
export function StatCard({
  label,
  value,
  icon,
  hint





}: {label: string;value: React.ReactNode;icon: React.ReactNode;hint?: string;}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <span className="text-ink-muted">{icon}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </Card>);

}