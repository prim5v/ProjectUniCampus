import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { NetworkWatcher } from "../components/NetworkWatcher";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <NetworkWatcher />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <GraduationCap size={28} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            UniCampus
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back
          </p>
        </div>

        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-2xl border bg-white shadow-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "rounded-xl border hover:bg-slate-50 transition",
              formFieldInput:
                "rounded-xl border focus:ring-2 focus:ring-emerald-500",
              formButtonPrimary:
                "rounded-xl bg-emerald-600 hover:bg-emerald-700 transition",
              footerActionLink:
                "text-emerald-600 hover:text-emerald-700",
            },
          }}
        />
      </motion.div>
    </div>
  );
}