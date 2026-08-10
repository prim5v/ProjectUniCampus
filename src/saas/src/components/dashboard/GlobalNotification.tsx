import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";

const DISPLAY_TIME = 4000;

export function GlobalNotification() {
  const {
    successStatus,
    setSuccessStatus,
    error,
    message,
    setError,
    setMessage,
  } = useAuthContext();

  const [visible, setVisible] = useState(false);

  const isSuccess =
    successStatus === "success" && !!message;

  const isError =
    successStatus === "error" && !!error;

  const shouldShow = isSuccess || isError;

  useEffect(() => {
    if (!shouldShow) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);

      // Clear global notification state
      setError("");
      setMessage("");
      setSuccessStatus("");
    }, DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, [
    shouldShow,
    successStatus,
    message,
    error,
    setError,
    setMessage,
    setSuccessStatus,
  ]);

  if (!visible || !shouldShow) {
    return null;
  }

  const success = isSuccess;

  const handleClose = () => {
    setVisible(false);

    setError("");
    setMessage("");
    setSuccessStatus("");
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] w-[calc(100vw-2rem)] max-w-sm">
      <div
        className={[
          "relative overflow-hidden rounded-xl border",
          "bg-white shadow-xl",
          "animate-in slide-in-from-right-5 fade-in duration-300",
          success
            ? "border-green-200"
            : "border-red-200",
        ].join(" ")}
      >
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div
            className={[
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              success
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600",
            ].join(" ")}
          >
            {success ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 pr-5">
            <p
              className={[
                "text-sm font-semibold",
                success
                  ? "text-green-800"
                  : "text-red-800",
              ].join(" ")}
            >
              {success
                ? "Success"
                : "Something went wrong"}
            </p>

            <p className="mt-1 text-sm text-gray-600 break-words">
              {success ? message : error}
            </p>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div
          className={[
            "h-1 w-full origin-left",
            success
              ? "bg-green-500"
              : "bg-red-500",
          ].join(" ")}
          style={{
            animation: `notification-progress ${DISPLAY_TIME}ms linear forwards`,
          }}
        />
      </div>

      <style>
        {`
          @keyframes notification-progress {
            from {
              transform: scaleX(1);
            }

            to {
              transform: scaleX(0);
            }
          }
        `}
      </style>
    </div>
  );
}