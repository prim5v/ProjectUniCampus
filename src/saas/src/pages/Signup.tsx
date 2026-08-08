import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
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
            Create your account
          </p>
        </div>

        <SignUp
          routing="path"
          path="/get-started"
          signInUrl="/signin"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0 bg-transparent",
            },
          }}
        />
      </motion.div>
    </div>
  );
}