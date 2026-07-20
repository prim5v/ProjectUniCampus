



import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuIcon, SearchIcon, BellIcon, ChevronDownIcon } from "lucide-react";
import { navigation } from "./navigation";

function usePageTitle(): string {
  const { pathname } = useLocation();
  const all = navigation.flatMap((g) => g.items);
  const match =
  all.find((i) => i.href === pathname) ??
  all.find((i) => i.href !== "/" && pathname.startsWith(i.href));
  return match?.label ?? "Dashboard";
}

export function Header({ onOpenSidebar }: {onOpenSidebar: () => void;}) {
  const title = usePageTitle();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/95 backdrop-blur px-4 sm:px-6">
      <button
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="lg:hidden rounded-lg p-2 text-ink-muted hover:bg-slate-100 hover:text-ink transition-colors">
        
        <MenuIcon className="h-5 w-5" />
      </button>

      <h1 className="text-base font-semibold text-ink truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search"
            className="h-9 w-56 lg:w-72 rounded-lg border border-line bg-slate-50 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:bg-white focus:shadow-focus transition-colors" />
          
        </div>
        <button
          aria-label="Search"
          className="md:hidden rounded-lg p-2 text-ink-muted hover:bg-slate-100 hover:text-ink transition-colors">
          
          <SearchIcon className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-ink-muted hover:bg-slate-100 hover:text-ink transition-colors">
          
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500 ring-2 ring-surface" />
        </button>

        <div className="mx-1 hidden sm:block h-6 w-px bg-line" />

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg p-1 pr-1.5 sm:pr-2 hover:bg-slate-100 transition-colors">
            
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              A
            </span>
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-ink">Administrator</span>
              <span className="text-[11px] text-ink-muted">Institution owner</span>
            </span>
            <ChevronDownIcon className="hidden sm:block h-4 w-4 text-ink-muted" />
          </button>

          {menuOpen &&
          <div
            role="menu"
            className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-surface shadow-pop py-1.5">
            
              <div className="px-3 py-2 border-b border-line">
                <div className="text-sm font-medium text-ink">Administrator</div>
                <div className="text-xs text-ink-muted">admin@university.edu</div>
              </div>
              {["Account settings", "University profile", "Sign out"].map((item) =>
            <button
              key={item}
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-ink transition-colors">
              
                  {item}
                </button>
            )}
            </div>
          }
        </div>
      </div>
    </header>);

}