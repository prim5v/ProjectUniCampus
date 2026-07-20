




import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadIcon,
  Building2Icon,
  CpuIcon,
  MegaphoneIcon,
  ActivityIcon,
  ServerIcon } from
"lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { SetupChecklist } from "../components/dashboard/SetupChecklist";
import { ServiceStatusBadge } from "../lib/status";
import { useCollection } from "../hooks/useCollection";
import { getSetupSteps, getRecentActivity, getSystemServices } from "../services/data";
import { cn } from "../lib/utils";

const quickActions = [
{ label: "Import students", description: "Upload your database", icon: UploadIcon, href: "/students" },
{ label: "Add building", description: "Register a campus site", icon: Building2Icon, href: "/buildings" },
{ label: "Register reader", description: "Connect a device", icon: CpuIcon, href: "/readers" },
{ label: "New announcement", description: "Message your campus", icon: MegaphoneIcon, href: "/announcements" }];


export function Dashboard() {
  const navigate = useNavigate();
  const steps = useCollection(getSetupSteps);
  const activity = useCollection(getRecentActivity);
  const services = useCollection(getSystemServices);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of your institution's setup, activity and system health." />
      

      {/* Setup progress */}
      {steps.loading ?
      <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-2 w-full" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) =>
          <Skeleton key={i} className="h-10 w-full" />
          )}
          </div>
        </Card> :

      <SetupChecklist steps={steps.data} />
      }

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader
            title="Recent activity"
            description="Actions taken across your institution" />
          
          {activity.loading ?
          <div className="p-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) =>
            <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 flex-1 max-w-sm" />
                </div>
            )}
            </div> :

          <EmptyState
            icon={<ActivityIcon className="h-6 w-6" />}
            title="No activity yet"
            description="Once you start managing students, devices and attendance, a timeline of changes will appear here."
            compact />

          }
        </Card>

        {/* System health */}
        <Card className="flex flex-col">
          <CardHeader title="System health" />
          <div className="p-2">
            {services.loading ?
            Array.from({ length: 4 }).map((_, i) =>
            <div key={i} className="flex items-center justify-between px-3 py-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
            ) :
            services.data.map((svc) =>
            <div
              key={svc.id}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-slate-50 transition-colors">
              
                    <div className="flex items-center gap-3 min-w-0">
                      <ServerIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-ink truncate">
                          {svc.name}
                        </div>
                        <div className="text-xs text-ink-muted truncate">
                          {svc.detail}
                        </div>
                      </div>
                    </div>
                    <ServiceStatusBadge status={svc.status} />
                  </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-ink mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) =>
          <button
            key={action.label}
            onClick={() => navigate(action.href)}
            className={cn(
              "group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left shadow-card",
              "hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
            )}>
            
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 group-hover:bg-brand-100 transition-colors">
                <action.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">
                  {action.label}
                </span>
                <span className="block text-xs text-ink-muted">
                  {action.description}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>);

}