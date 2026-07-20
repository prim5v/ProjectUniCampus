






import React, { useState } from "react";
import { CalendarPlusIcon, CalendarCheckIcon, SlidersHorizontalIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { DataTable, type Column } from "../components/ui/DataTable";
import { SessionStatusBadge } from "../lib/status";
import { useCollection } from "../hooks/useCollection";
import { getSessions } from "../services/data";
import type { AttendanceSession } from "../types";

const rules = [
{ label: "Grace period", value: "Not set", hint: "How long after start a check-in still counts as on time." },
{ label: "Verification method", value: "NFC or QR", hint: "How students confirm their presence." },
{ label: "Auto-close sessions", value: "Disabled", hint: "Automatically end sessions after they conclude." }];


export function Attendance() {
  const { data, loading } = useCollection(getSessions);
  const [tab, setTab] = useState<"sessions" | "rules" | "reports">("sessions");

  const columns: Column<AttendanceSession>[] = [
  {
    key: "title",
    header: "Session",
    render: (s) => <span className="font-medium text-ink">{s.title}</span>
  },
  { key: "course", header: "Course", render: (s) => s.course },
  { key: "location", header: "Location", render: (s) => s.location },
  { key: "startsAt", header: "Starts", render: (s) => s.startsAt },
  {
    key: "status",
    header: "Status",
    render: (s) => <SessionStatusBadge status={s.status} />
  }];


  const tabs = [
  { id: "sessions" as const, label: "Sessions" },
  { id: "rules" as const, label: "Rules" },
  { id: "reports" as const, label: "Reports" }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Schedule sessions, define attendance rules, and review reports."
        actions={
        tab === "sessions" ?
        <Button leftIcon={<CalendarPlusIcon className="h-4 w-4" />}>
              New session
            </Button> :
        undefined
        } />
      

      {/* Tabs */}
      <div className="border-b border-line">
        <nav className="-mb-px flex gap-6" aria-label="Attendance views">
          {tabs.map((t) =>
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
            "border-b-2 pb-3 text-sm font-medium transition-colors " + (
            tab === t.id ?
            "border-brand-500 text-brand-700" :
            "border-transparent text-ink-muted hover:text-ink")
            }>
            
              {t.label}
            </button>
          )}
        </nav>
      </div>

      {tab === "sessions" &&
      <Card>
          <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowKey={(s) => s.id}
          cardTitle={(s) => s.title}
          empty={
          <EmptyState
            icon={<CalendarCheckIcon className="h-6 w-6" />}
            title="No attendance sessions"
            description="Create your first session to start recording student attendance with NFC or QR check-ins."
            primaryAction={
            <Button leftIcon={<CalendarPlusIcon className="h-4 w-4" />}>
                    New session
                  </Button>
            } />

          } />
        
        </Card>
      }

      {tab === "rules" &&
      <Card>
          <CardHeader
          title="Attendance rules"
          description="Applied to every new session across your institution"
          action={
          <Button variant="secondary" size="sm" leftIcon={<SlidersHorizontalIcon className="h-4 w-4" />}>
                Edit rules
              </Button>
          } />
        
          <ul className="divide-y divide-line">
            {rules.map((r) =>
          <li key={r.label} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-ink">{r.label}</div>
                  <div className="text-sm text-ink-muted">{r.hint}</div>
                </div>
                <span className="text-sm font-medium text-ink-muted">{r.value}</span>
              </li>
          )}
          </ul>
        </Card>
      }

      {tab === "reports" &&
      <Card>
          <CardBody className="p-0">
            <EmptyState
            icon={<CalendarCheckIcon className="h-6 w-6" />}
            title="No reports available yet"
            description="Attendance reports are generated once sessions have been run and check-ins recorded. There is no data to summarize yet." />
          
          </CardBody>
        </Card>
      }
    </div>);

}