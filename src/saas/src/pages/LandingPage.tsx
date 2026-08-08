import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, GraduationCapIcon } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-line bg-surface px-6 py-4 lg:px-10">
        <Link
          to="/"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-card">
            <GraduationCapIcon className="h-5 w-5" />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            UniCampus
          </span>
        </Link>

        <Link
          to="/signin"
          className="rounded-lg px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-slate-50 hover:text-ink"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            Campus management, simplified
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Run your campus
            <br />
            <span className="text-brand-600">from one place.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            UniCampus gives institutions one platform to manage students,
            digital IDs, attendance, campus devices, announcements, and
            operations.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/get-started"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700"
            >
              Get started
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/signin"
              className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink shadow-card transition-colors hover:bg-slate-50"
            >
              Sign in
            </Link>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                title: "Student management",
                description: "Keep student records organized.",
              },
              {
                title: "Digital identities",
                description: "Manage secure campus credentials.",
              },
              {
                title: "Campus operations",
                description: "Monitor devices, attendance, and activity.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line bg-surface p-5 text-left shadow-card transition-colors hover:border-brand-200 hover:bg-brand-50/40"
              >
                <h2 className="text-sm font-semibold text-ink">
                  {item.title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-ink-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}