
import React from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
  "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 border border-transparent",
  secondary:
  "bg-white text-ink hover:bg-slate-50 active:bg-slate-100 border border-line",
  ghost:
  "bg-transparent text-ink-muted hover:bg-slate-100 hover:text-ink border border-transparent",
  danger:
  "bg-danger text-white hover:bg-red-700 active:bg-red-800 border border-transparent"
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", leftIcon, rightIcon, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors",
          "focus-visible:shadow-focus focus-visible:border-brand-500 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}>
        
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>);

  }
);
Button.displayName = "Button";