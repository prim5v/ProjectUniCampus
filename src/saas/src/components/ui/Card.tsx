
import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-xl shadow-card",
        className
      )}
      {...props} />);


}

export function CardHeader({
  className,
  title,
  description,
  action





}: {className?: string;title: React.ReactNode;description?: React.ReactNode;action?: React.ReactNode;}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-5 py-4 border-b border-line",
        className
      )}>
      
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {description &&
        <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
        }
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}