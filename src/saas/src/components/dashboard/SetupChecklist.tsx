



import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, ArrowRightIcon } from "lucide-react";
import type { SetupStep } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export function SetupChecklist({ steps }: {steps: SetupStep[];}) {
  const navigate = useNavigate();
  const completed = steps.filter((s) => s.completed).length;
  const total = steps.length;
  const pct = Math.round(completed / total * 100);
  const nextStep = steps.find((s) => !s.completed);

  return (
    <Card className="overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-line">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Welcome to UniCampus</h2>
            <p className="mt-1 text-sm text-ink-muted max-w-lg">
              Your university setup is incomplete. Finish these steps to bring your
              institution online.
            </p>
          </div>
          {nextStep &&
          <Button
            onClick={() => navigate(nextStep.href)}
            rightIcon={<ArrowRightIcon className="h-4 w-4" />}
            className="shrink-0">
            
              Continue setup
            </Button>
          }
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-ink-muted">Setup progress</span>
            <span className="text-ink">
              {completed} of {total} complete
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${pct}%` }} />
            
          </div>
        </div>
      </div>

      <ol className="divide-y divide-line">
        {steps.map((step) =>
        <li key={step.id}>
            <button
            onClick={() => navigate(step.href)}
            className="group flex w-full items-center gap-4 px-5 sm:px-6 py-4 text-left hover:bg-slate-50 transition-colors">
            
              <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                step.completed ?
                "border-brand-500 bg-brand-500 text-white" :
                "border-slate-300 bg-white text-transparent"
              )}>
              
                <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1">
                <span
                className={cn(
                  "block text-sm font-medium",
                  step.completed ? "text-ink-muted line-through" : "text-ink"
                )}>
                
                  {step.label}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">
                  {step.description}
                </span>
              </span>
              {!step.completed &&
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500 transition-colors" />
            }
            </button>
          </li>
        )}
      </ol>
    </Card>);

}