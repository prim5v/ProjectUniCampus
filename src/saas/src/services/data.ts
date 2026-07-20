
import type {
  Student,
  DigitalId,
  Reader,
  Building,
  AttendanceSession,
  Announcement,
  ActivityItem,
  SetupStep,
  SystemService } from
"../types";

/**
 * Data access layer for UniCampus.
 *
 * This is intentionally the single seam where real backend APIs will connect.
 * A fresh institution has NO operational data yet — every collection resolves
 * empty so the UI renders true empty states instead of fabricated numbers.
 * Swap these stubs for real `fetch`/API calls without touching the UI.
 */

const EMPTY = <T,>(): Promise<T[]> => Promise.resolve([]);

export const getStudents = (): Promise<Student[]> => EMPTY<Student>();
export const getDigitalIds = (): Promise<DigitalId[]> => EMPTY<DigitalId>();
export const getReaders = (): Promise<Reader[]> => EMPTY<Reader>();
export const getBuildings = (): Promise<Building[]> => EMPTY<Building>();
export const getSessions = (): Promise<AttendanceSession[]> => EMPTY<AttendanceSession>();
export const getAnnouncements = (): Promise<Announcement[]> => EMPTY<Announcement>();
export const getRecentActivity = (): Promise<ActivityItem[]> => EMPTY<ActivityItem>();

/**
 * Onboarding checklist. The university profile is created during signup,
 * so it starts complete; everything else is pending until configured.
 */
export const getSetupSteps = (): Promise<SetupStep[]> =>
Promise.resolve([
{
  id: "profile",
  label: "Create university profile",
  description: "Institution name, domain and primary administrator.",
  completed: true,
  href: "/settings"
},
{
  id: "buildings",
  label: "Add campus locations",
  description: "Register the buildings and sites you operate.",
  completed: false,
  href: "/buildings"
},
{
  id: "students",
  label: "Import students",
  description: "Bring in your student database to issue digital identities.",
  completed: false,
  href: "/students"
},
{
  id: "readers",
  label: "Register reader devices",
  description: "Connect NFC/QR readers across your campus.",
  completed: false,
  href: "/readers"
},
{
  id: "attendance",
  label: "Configure attendance",
  description: "Set the rules that govern how attendance is recorded.",
  completed: false,
  href: "/attendance"
}]
);

export const getSystemServices = (): Promise<SystemService[]> =>
Promise.resolve([
{
  id: "identity",
  name: "Identity service",
  status: "operational",
  detail: "Ready to issue credentials"
},
{
  id: "readers",
  name: "Reader network",
  status: "not_configured",
  detail: "No readers registered"
},
{
  id: "attendance",
  name: "Attendance engine",
  status: "not_configured",
  detail: "Awaiting configuration"
},
{
  id: "api",
  name: "API & webhooks",
  status: "operational",
  detail: "Endpoints available"
}]
);