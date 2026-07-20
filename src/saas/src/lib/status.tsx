



import React from "react";
import { Badge } from "../components/ui/Badge";
import type {
  StudentStatus,
  DigitalIdStatus,
  ReaderStatus,
  SessionStatus,
  SystemService } from
"../types";

export function StudentStatusBadge({ status }: {status: StudentStatus;}) {
  const map = {
    active: { tone: "success" as const, label: "Active" },
    inactive: { tone: "neutral" as const, label: "Inactive" },
    pending: { tone: "warning" as const, label: "Pending" }
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function DigitalIdStatusBadge({ status }: {status: DigitalIdStatus;}) {
  const map = {
    activated: { tone: "success" as const, label: "Activated" },
    pending: { tone: "warning" as const, label: "Pending" },
    revoked: { tone: "danger" as const, label: "Revoked" }
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function ReaderStatusBadge({ status }: {status: ReaderStatus;}) {
  const map = {
    online: { tone: "success" as const, label: "Online" },
    offline: { tone: "danger" as const, label: "Offline" },
    maintenance: { tone: "warning" as const, label: "Maintenance" }
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function SessionStatusBadge({ status }: {status: SessionStatus;}) {
  const map = {
    scheduled: { tone: "info" as const, label: "Scheduled" },
    live: { tone: "success" as const, label: "Live" },
    completed: { tone: "neutral" as const, label: "Completed" }
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function ServiceStatusBadge({ status }: {status: SystemService["status"];}) {
  const map = {
    operational: { tone: "success" as const, label: "Operational" },
    degraded: { tone: "warning" as const, label: "Degraded" },
    down: { tone: "danger" as const, label: "Down" },
    not_configured: { tone: "neutral" as const, label: "Not configured" }
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}