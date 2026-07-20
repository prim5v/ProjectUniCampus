


import React from "react";
import { GraduationCapIcon } from "lucide-react";
import { navigation } from "./navigation";
import { SidebarItem } from "./SidebarItem";

export function SidebarContent({ onNavigate }: {onNavigate?: () => void;}) {
  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-line shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
          <GraduationCapIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="text-sm font-semibold text-ink truncate">UniCampus</div>
          <div className="text-[11px] text-ink-muted truncate">
            University Operating System
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Primary">
        {navigation.map((group, i) =>
        <div key={i} className="space-y-1">
            {group.label &&
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </div>
          }
            {group.items.map((item) =>
          <SidebarItem key={item.href} {...item} onNavigate={onNavigate} />
          )}
          </div>
        )}
      </nav>

      {/* Plan footer */}
      <div className="border-t border-line p-3 shrink-0">
        <div className="rounded-lg bg-slate-50 border border-line px-3 py-2.5">
          <div className="text-xs font-medium text-ink">Institution plan</div>
          <div className="mt-0.5 text-[11px] text-ink-muted">
            Trial · Set up billing to activate
          </div>
        </div>
      </div>
    </div>);

}