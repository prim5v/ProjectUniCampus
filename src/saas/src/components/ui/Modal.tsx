

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md"
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open &&
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={title}>
        
          <motion.div
          className="absolute inset-0 bg-slate-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose} />
        
          <motion.div
          className={cn(
            "relative w-full bg-surface shadow-pop border border-line",
            "rounded-t-2xl sm:rounded-xl",
            size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg"
          )}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
          
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
              <div>
                <h2 className="text-base font-semibold text-ink">{title}</h2>
                {description &&
              <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
              }
              </div>
              <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1 text-ink-muted hover:bg-slate-100 hover:text-ink transition-colors">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
            {footer &&
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-line bg-slate-50/60 rounded-b-xl">
                {footer}
              </div>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}