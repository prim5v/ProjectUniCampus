

import React from "react";
import { cn } from "../../lib/utils";

export function Skeleton({ className }: {className?: string;}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/70", className)}
      aria-hidden="true" />);


}

export function TableSkeleton({ columns, rows = 5 }: {columns: number;rows?: number;}) {
  return (
    <div className="divide-y divide-line" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) =>
      <div key={r} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: columns }).map((_, c) =>
        <Skeleton
          key={c}
          className={cn("h-4", c === 0 ? "w-40" : "flex-1 max-w-[8rem]")} />

        )}
        </div>
      )}
      <span className="sr-only">Loading data…</span>
    </div>);

}