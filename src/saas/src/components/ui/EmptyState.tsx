

import React from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  compact
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-10 px-6" : "py-16 px-6",
        className
      )}>
      
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {(primaryAction || secondaryAction) &&
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      }
    </div>);

}