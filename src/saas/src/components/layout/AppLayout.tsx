



import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { SidebarContent } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-line">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen &&
        <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
            className="absolute inset-0 bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMobileOpen(false)} />
          
            <motion.aside
            className="relative w-72 max-w-[85%] border-r border-line"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
            
              <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-ink-muted hover:bg-slate-100">
              
                <XIcon className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        }
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}