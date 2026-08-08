import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold">
          YourSaaS
        </div>

        <Link
          to="/signin"
          className="text-sm font-medium text-gray-700 hover:text-black"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <p className="text-sm font-semibold text-blue-600 mb-4">
            SIMPLE. FAST. POWERFUL.
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
            Everything you need,
            <br />
            in one place.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
            A simple platform designed to help you manage your work,
            stay organized, and get things done faster.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
            >
              Get Started
            </Link>

            <Link
              to="/signin"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}