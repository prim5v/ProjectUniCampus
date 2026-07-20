


import {
  LayoutDashboardIcon,
  UsersIcon,
  IdCardIcon,
  CalendarCheckIcon,
  FileBarChartIcon,
  CpuIcon,
  Building2Icon,
  MegaphoneIcon,
  BarChart3Icon,
  SettingsIcon,
  CreditCardIcon,
  type LucideIcon } from
"lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
{
  label: null,
  items: [{ label: "Dashboard", href: "/", icon: LayoutDashboardIcon }]
},
{
  label: "Identity",
  items: [
  { label: "Students", href: "/students", icon: UsersIcon },
  { label: "Digital IDs", href: "/digital-ids", icon: IdCardIcon }]

},
{
  label: "Attendance",
  items: [
  { label: "Sessions", href: "/attendance", icon: CalendarCheckIcon },
  { label: "Reports", href: "/reports", icon: FileBarChartIcon }]

},
{
  label: "Infrastructure",
  items: [
  { label: "Readers", href: "/readers", icon: CpuIcon },
  { label: "Buildings", href: "/buildings", icon: Building2Icon }]

},
{
  label: "Communication",
  items: [{ label: "Announcements", href: "/announcements", icon: MegaphoneIcon }]
},
{
  label: null,
  items: [
  { label: "Analytics", href: "/analytics", icon: BarChart3Icon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
  { label: "Billing", href: "/billing", icon: CreditCardIcon }]

}];