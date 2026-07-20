
export type StudentStatus = "active" | "inactive" | "pending";

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  course: string;
  status: StudentStatus;
}

export type DigitalIdStatus = "activated" | "pending" | "revoked";

export interface DigitalId {
  id: string;
  studentId: string;
  studentName: string;
  credentialType: "NFC" | "QR" | "NFC + QR";
  status: DigitalIdStatus;
  lastVerifiedAt: string | null;
}

export type ReaderStatus = "online" | "offline" | "maintenance";

export interface Reader {
  id: string;
  name: string;
  location: string;
  type: "NFC" | "QR" | "NFC + QR";
  status: ReaderStatus;
  firmwareVersion: string;
  lastConnectionAt: string | null;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  address: string;
  readerCount: number;
  accessGroups: number;
}

export type SessionStatus = "scheduled" | "live" | "completed";

export interface AttendanceSession {
  id: string;
  title: string;
  course: string;
  location: string;
  startsAt: string;
  status: SessionStatus;
}

export interface Announcement {
  id: string;
  title: string;
  audience: string;
  publishedAt: string | null;
  status: "draft" | "published";
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SetupStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  href: string;
}

export interface SystemService {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down" | "not_configured";
  detail: string;
}