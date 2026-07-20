
import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon &&
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {leftIcon}
          </span>
        }
        <input
          ref={ref}
          className={cn(
            "h-10 w-full rounded-lg border border-line bg-white text-sm text-ink placeholder:text-ink-muted",
            "transition-colors focus:border-brand-500 focus:shadow-focus",
            leftIcon ? "pl-9 pr-3" : "px-3",
            className
          )}
          {...props} />
        
      </div>);

  }
);
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink",
          "transition-colors focus:border-brand-500 focus:shadow-focus",
          className
        )}
        {...props}>
        
      {children}
    </select>);

  });
Select.displayName = "Select";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted",
          "transition-colors focus:border-brand-500 focus:shadow-focus",
          className
        )}
        {...props} />);


  });
Textarea.displayName = "Textarea";