import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { BoxIcon } from "lucide-react";
export function SidebarItem({
  label,
  href,
  icon: Icon,
  onNavigate





}: {label: string;href: string;icon: BoxIcon;onNavigate?: () => void;}) {
  return <NavLink to={href} end={href === "/"} onClick={onNavigate} className={({
    isActive
  }) => cn("group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-ink")}>
      {({
      isActive
    }) => <>
          <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-500")} />
          <span className="truncate">{label}</span>
        </>}
    </NavLink>;
}