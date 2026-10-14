import { Building2, Smartphone, Radio, type LucideIcon } from "lucide-react";

export const navLinks = [
  { label: "Solutions", to: "/solutions" },
  { label: "Infrastructure", to: "/infrastructure" },
  { label: "For Students", to: "/students" },
  { label: "About", to: "/about" },
] as const;

export const ecosystem: {
  key: string; title: string; role: string; body: string; to: string; Icon: LucideIcon;
}[] = [
  { key: "os", title: "UniCampus OS", role: "Institutional platform", to: "/solutions", Icon: Building2,
    body: "The university-facing platform for managing student digital IDs, access, attendance, payments and campus readers in one place." },
  { key: "idease", title: "IDEase", role: "Student mobile app", to: "/students", Icon: Smartphone,
    body: "The Android app that turns a student's phone into a digital university credential." },
  { key: "infra", title: "UniCampus Infrastructure", role: "Readers and verification", to: "/infrastructure", Icon: Radio,
    body: "Reader hardware and credential verification that connect digital credentials to physical campus points." },
];

export const problems = [
  { t: "Dependence on physical cards", d: "Cards get lost, damaged and reissued, and each reissue is administrative work." },
  { t: "Fragmented student experience", d: "Identity, access and services often sit in separate systems with separate records." },
  { t: "Separate access, attendance and payments", d: "Each workflow can need its own hardware, vendor and reporting." },
  { t: "Linking digital services to physical places", d: "Connecting a student's digital record to a door, library desk or till takes dedicated infrastructure." },
];

export const flowSteps = [
  "The student holds a digital credential in IDEase.",
  "They present it by a supported method.",
  "A compatible UniCampus reader receives or scans it.",
  "The system verifies it under the configured workflow.",
  "If authorized, the access or payment workflow proceeds.",
];

export const solutions: { t: string; d: string; status: "In the platform" | "Scoped per pilot" }[] = [
  // "In the platform" = a matching admin module exists in the app routes. Confirm depth before launch.
  { t: "Digital identity and credentials", d: "Create and manage student digital IDs.", status: "In the platform" },
  { t: "Access verification", d: "Manage access rules and verification events.", status: "In the platform" },
  { t: "Attendance workflows", d: "Record attendance and review reports.", status: "In the platform" },
  { t: "Campus payments", d: "Payment workflows tied to student credentials.", status: "In the platform" },
  { t: "Operational visibility", d: "Manage readers and buildings, with analytics and reports.", status: "In the platform" },
  { t: "Integrations with existing systems", d: "Foundation for future integrations; scope agreed with each institution.", status: "Scoped per pilot" },
];
