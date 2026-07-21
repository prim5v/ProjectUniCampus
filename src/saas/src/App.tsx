import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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

import { RoleGuard } from "./RoleGuard";
import { useAuthContext } from "./contexts/AuthContext";



function Router(): JSX.Element {

  const {
    status,
  } = useAuthContext();



  return (
    <BrowserRouter>

      <Routes>

        {status === "authenticated" ? (

          <Route element={<AppLayout />}>

            <Route
              path="/"
              element={
                <RoleGuard
                  allowedRoles={[
                    "admin",
                  ]}
                >
                  <Dashboard />
                </RoleGuard>
              }
            />


            {/* Protected application routes */}

            <Route
              path="/students"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Students />
                </RoleGuard>
              }
            />


            <Route
              path="/digital-ids"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <DigitalIds />
                </RoleGuard>
              }
            />


            <Route
              path="/attendance"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Attendance />
                </RoleGuard>
              }
            />


            <Route
              path="/reports"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Reports />
                </RoleGuard>
              }
            />


            <Route
              path="/readers"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Readers />
                </RoleGuard>
              }
            />


            <Route
              path="/buildings"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Buildings />
                </RoleGuard>
              }
            />


            <Route
              path="/announcements"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Announcements />
                </RoleGuard>
              }
            />


            <Route
              path="/analytics"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Analytics />
                </RoleGuard>
              }
            />


            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Settings />
                </RoleGuard>
              }
            />


            <Route
              path="/billing"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Billing />
                </RoleGuard>
              }
            />


            <Route
              path="*"
              element={<NotFound />}
            />


          </Route>


        ) : (

          <Route
            path="*"
            element={<NotFound />}
          />

        )}


      </Routes>

    </BrowserRouter>
  );
}



export function App(): JSX.Element {

  return <Router />;

}