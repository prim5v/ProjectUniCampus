import React from "react";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Hash,
  Radio,
  UserRound,
  XCircle,
} from "lucide-react";

import { Modal } from "../ui/Modal";

/* -------------------------------- */
/* Types */
/* -------------------------------- */

type DigitalIdRecord = {
  id: string;
  campus_id: string;
  student_id: string;
  username: string;
  isActive: boolean;
  image_url: string | null;
  nfc_status: string | null;
  account_status: string | null;
  onBoardedWhen: string | null;
};

type DigitalIdModalProps = {
  open: boolean;
  digitalId: DigitalIdRecord | null;
  onClose: () => void;
};

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

const formatDate = (date: string | null) => {
  if (!date) {
    return "Not available";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

const formatDateTime = (
  date: string | null
) => {
  if (!date) {
    return "Not available";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

const formatStatus = (
  value: string | null
) => {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

/* -------------------------------- */
/* Component */
/* -------------------------------- */

export function DigitalIdModal({
  open,
  digitalId,
  onClose,
}: DigitalIdModalProps) {
  if (!digitalId) {
    return null;
  }

  const initials = digitalId.username
    ? digitalId.username
        .slice(0, 2)
        .toUpperCase()
    : "ID";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Digital ID"
      description="Preview the digital identity assigned to this student."
      size="lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Close
        </button>
      }
    >
      <div className="space-y-6">
        {/* -------------------------------- */}
        {/* Digital ID Card */}
        {/* -------------------------------- */}

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          {/* Card header */}

          <div className="relative overflow-hidden bg-primary px-6 py-5 text-white">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="absolute -bottom-16 -right-2 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  UniCampus
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Digital Student ID
                </h2>
              </div>

              <CreditCard className="h-8 w-8 text-white/80" />
            </div>
          </div>

          {/* Card body */}

          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar */}
{/* 
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary ring-4 ring-primary/5">
                {initials}
              </div> */}
              <div className="flex h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-primary/10 text-2xl font-bold text-primary ring-4 ring-primary/5">
                {digitalId.image_url ? (
                  <img
                    src={digitalId.image_url}
                    alt={digitalId.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {initials}
                  </div>
                )}
              </div>

              {/* Student identity */}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Student
                </p>

                <h3 className="mt-1 truncate text-2xl font-bold text-foreground">
                  {digitalId.username ||
                    "Unknown student"}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <Hash className="h-4 w-4" />

                  <span>
                    {digitalId.student_id}
                  </span>
                </div>
              </div>

              {/* Status */}

              <div
                className={[
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                  digitalId.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {digitalId.isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}

                {digitalId.isActive
                  ? "Active"
                  : "Inactive"}
              </div>
            </div>

            {/* Divider */}

            <div className="my-6 border-t border-line" />

            {/* Identity information */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Student ID */}

              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center gap-2 text-muted">
                  <Hash className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Student ID
                  </span>
                </div>

                <p className="mt-2 break-all text-sm font-semibold text-foreground">
                  {digitalId.student_id}
                </p>
              </div>

              {/* Username */}

              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center gap-2 text-muted">
                  <UserRound className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Username
                  </span>
                </div>

                <p className="mt-2 break-all text-sm font-semibold text-foreground">
                  {digitalId.username ||
                    "Not available"}
                </p>
              </div>

              {/* NFC */}

              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center gap-2 text-muted">
                  <Radio className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    NFC status
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-foreground">
                  {formatStatus(
                    digitalId.nfc_status
                  )}
                </p>
              </div>

              {/* Account */}

              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center gap-2 text-muted">
                  <UserRound className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Account status
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-foreground">
                  {formatStatus(
                    digitalId.account_status
                  )}
                </p>
              </div>

              {/* Onboarded */}

              <div className="rounded-xl border border-line p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-muted">
                  <CalendarDays className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Onboarded
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-foreground">
                  {formatDate(
                    digitalId.onBoardedWhen
                  )}
                </p>

                {digitalId.onBoardedWhen && (
                  <p className="mt-1 text-xs text-muted">
                    {formatDateTime(
                      digitalId.onBoardedWhen
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Footer metadata */}

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <div className="flex flex-col gap-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Credential ID:{" "}
                  <span className="font-medium text-foreground">
                    {digitalId.id}
                  </span>
                </span>

                <span>
                  Campus:{" "}
                  <span className="font-medium text-foreground">
                    {digitalId.campus_id}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Future photo note */}
        {/* -------------------------------- */}

        <div className="flex items-start gap-3 rounded-xl border border-dashed border-line p-4">
          <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-muted" />

          <div>
            <p className="text-sm font-medium text-foreground">
              Student photo
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              This currently uses a generated avatar
              placeholder. You can replace the avatar
              with the student's real profile photo once
              the backend exposes a photo URL.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}