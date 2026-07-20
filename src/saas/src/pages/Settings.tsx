










import React, { useState } from "react";
import { UsersIcon, KeyRoundIcon, PlusIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

type Tab = "profile" | "users" | "security" | "api" | "billing";

const tabs: {id: Tab;label: string;}[] = [
{ id: "profile", label: "University profile" },
{ id: "users", label: "Users & permissions" },
{ id: "security", label: "Security" },
{ id: "api", label: "API keys" },
{ id: "billing", label: "Billing" }];


export function Settings() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your institution, team, security and integrations." />
      

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Vertical tabs */}
        <nav
          className="flex gap-1 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col"
          aria-label="Settings sections">
          
          {tabs.map((t) =>
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
            "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors " + (
            tab === t.id ?
            "bg-brand-50 text-brand-700" :
            "text-slate-600 hover:bg-slate-100 hover:text-ink")
            }>
            
              {t.label}
            </button>
          )}
        </nav>

        <div className="min-w-0 flex-1">
          {tab === "profile" && <ProfileSection />}
          {tab === "users" && <UsersSection />}
          {tab === "security" && <SecuritySection />}
          {tab === "api" && <ApiKeysSection />}
          {tab === "billing" && <BillingTeaser />}
        </div>
      </div>
    </div>);

}

function ProfileSection() {
  return (
    <Card>
      <CardHeader
        title="University profile"
        description="Basic information about your institution" />
      
      <CardBody className="space-y-5 max-w-xl">
        <FormField label="University name" required>
          {(p) => <Input defaultValue="" placeholder="e.g. Northgate University" {...p} />}
        </FormField>
        <FormField label="Primary domain" required hint="Used to validate university email addresses.">
          {(p) => <Input placeholder="university.edu" {...p} />}
        </FormField>
        <FormField label="Administrator email" required>
          {(p) => <Input type="email" placeholder="admin@university.edu" {...p} />}
        </FormField>
        <div className="flex justify-end pt-2">
          <Button>Save changes</Button>
        </div>
      </CardBody>
    </Card>);

}

function UsersSection() {
  return (
    <Card>
      <CardHeader
        title="Users & permissions"
        description="Administrators with access to this workspace"
        action={
        <Button size="sm" leftIcon={<PlusIcon className="h-4 w-4" />}>
            Invite user
          </Button>
        } />
      
      <ul className="divide-y divide-line">
        <li className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              A
            </span>
            <div>
              <div className="text-sm font-medium text-ink">Administrator (you)</div>
              <div className="text-xs text-ink-muted">admin@university.edu</div>
            </div>
          </div>
          <Badge tone="brand">Owner</Badge>
        </li>
      </ul>
      <CardBody className="border-t border-line">
        <p className="text-sm text-ink-muted">
          Invite colleagues and assign roles to delegate management of students,
          attendance and devices.
        </p>
      </CardBody>
    </Card>);

}

function SecuritySection() {
  const rows = [
  { label: "Two-factor authentication", value: "Not enabled", cta: "Enable" },
  { label: "Single sign-on (SSO)", value: "Not configured", cta: "Configure" },
  { label: "Session timeout", value: "8 hours", cta: "Change" }];

  return (
    <Card>
      <CardHeader title="Security" description="Protect access to your workspace" />
      <ul className="divide-y divide-line">
        {rows.map((r) =>
        <li key={r.label} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="text-sm font-medium text-ink">{r.label}</div>
              <div className="text-sm text-ink-muted">{r.value}</div>
            </div>
            <Button variant="secondary" size="sm">
              {r.cta}
            </Button>
          </li>
        )}
      </ul>
    </Card>);

}

function ApiKeysSection() {
  return (
    <Card>
      <CardHeader
        title="API keys"
        description="Keys let backend systems and readers authenticate with UniCampus"
        action={
        <Button size="sm" leftIcon={<PlusIcon className="h-4 w-4" />}>
            Create key
          </Button>
        } />
      
      <CardBody className="p-0">
        <EmptyState
          icon={<KeyRoundIcon className="h-6 w-6" />}
          title="No API keys created"
          description="Create a secret key to connect your student information system, readers or custom integrations to UniCampus."
          primaryAction={
          <Button leftIcon={<PlusIcon className="h-4 w-4" />}>Create key</Button>
          }
          compact />
        
      </CardBody>
    </Card>);

}

function BillingTeaser() {
  return (
    <Card>
      <CardHeader title="Billing" description="Manage your plan and payment method" />
      <CardBody>
        <p className="text-sm text-ink-muted">
          Your full billing history and invoices are available on the{" "}
          <a href="/billing" className="font-medium text-brand-600 hover:underline">
            Billing
          </a>{" "}
          page.
        </p>
      </CardBody>
    </Card>);

}