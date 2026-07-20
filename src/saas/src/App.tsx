
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { DigitalIds } from "./pages/DigitalIds";
import { Attendance } from "./pages/Attendance";
import { Reports } from "./pages/Reports";
import { Readers } from "./pages/Readers";
import { Buildings } from "./pages/Buildings";
import { Announcements } from "./pages/Announcements";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Billing } from "./pages/Billing";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/digital-ids" element={<DigitalIds />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/readers" element={<Readers />} />
          <Route path="/buildings" element={<Buildings />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>);

}