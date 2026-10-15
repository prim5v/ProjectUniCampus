import React, { useEffect, useState } from "react";
import { LoaderCircle, Pencil } from "lucide-react";
import { Modal } from "../ui/Modal";

type DigitalIdRecord = {
  id: number;
  username: string;
  isActive: boolean;
  account_status: string | null;
  security_clearance_level: string | null;
};

type UpdatePayload = {
  isActive: boolean;
  account_status: string | null;
  security_clearance_level: string | null;
  student_id: string | null;
};

type Props = {
  open: boolean;
  digitalId: DigitalIdRecord | null;
  onClose: () => void;
  onSubmit: ( data: UpdatePayload) => Promise<void>;
};

export function EditDigitalIdModal({
  open,
  digitalId,
  onClose,
  onSubmit,
}: Props) {
  const [isActive, setIsActive] = useState(false);
  const [accountStatus, setAccountStatus] = useState("");
  const [clearanceLevel, setClearanceLevel] = useState("");
  const [student_id, setStudent_id] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !digitalId) return;

    setIsActive(digitalId.isActive);
    setAccountStatus(digitalId.account_status ?? "");
    setStudent_id(digitalId.student_id ?? "");
    setClearanceLevel(
      digitalId.security_clearance_level ?? ""
    );
    setError("");
  }, [open, digitalId]);

  if (!digitalId) return null;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await onSubmit({
        // Boolean values must not use `||` as a fallback.
        student_id: student_id.trim() || null,
        isActive,
        account_status:
          accountStatus.trim() ||
          digitalId.account_status ||
          null,
        security_clearance_level:
          clearanceLevel||
          digitalId.security_clearance_level ||
          null,
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update digital ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
      title="Edit Digital ID"
      description={`Update account settings for ${digitalId.username}.`}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="edit-digital-id-form"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-dark hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      }
    >
      <form
        id="edit-digital-id-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="rounded-xl border border-line p-4">
          <label
            htmlFor="isActive"
            className="flex cursor-pointer items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                Digital ID activation
              </p>
              <p className="mt-1 text-xs text-muted">
                Control whether this digital ID is active.
              </p>
            </div>

            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(event.target.checked)
              }
              className="h-5 w-5 accent-green-600"
            />
          </label>

          <p className="mt-2 text-sm font-medium">
            {isActive ? "Active" : "Inactive"}
          </p>
        </div>

            <div className="rounded-xl border border-line p-4">
            <label
                htmlFor="accountStatus"
                className="flex cursor-pointer items-center justify-between gap-4"
            >
                <div>
                <p className="text-sm font-semibold text-foreground">
                    Account status
                </p>
                <p className="mt-1 text-xs text-muted">
                    Enable or disable this account.
                </p>
                </div>

                <input
                id="accountStatus"
                type="checkbox"
                checked={accountStatus === "Active"}
                onChange={(event) =>
                    setAccountStatus(
                    event.target.checked ? "Active" : "Inactive"
                    )
                }
                className="h-5 w-5 accent-green-600"
                />
            </label>

            <p className="mt-2 text-sm font-medium">
                {accountStatus}
            </p>
            </div>



            <div className="space-y-3">
            <label
                htmlFor="clearanceLevel"
                className="block text-sm font-medium text-foreground"
            >
                Security clearance level
            </label>

            <div className="rounded-xl border border-line p-4 space-y-4">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                    Clearance level
                    </p>
                    <p className="text-xs text-muted mt-1">
                    Select a level from 1 to 10.
                    </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-700">
                    {clearanceLevel || "—"}
                </div>
                </div>

                <input
                id="clearanceLevel"
                type="range"
                min={1}
                max={10}
                step={1}
                value={clearanceLevel || 1}
                onChange={(event) =>
                    setClearanceLevel(event.target.value)
                }
                className="w-full cursor-pointer accent-green-600"
                />

                <div className="flex justify-between text-xs text-muted">
                <span>1 · Lowest</span>
                <span>10 · Highest</span>
                </div>

                <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, index) => {
                    const level = index + 1;
                    const selected = Number(clearanceLevel || 1) === level;

                    return (
                    <button
                        key={level}
                        type="button"
                        onClick={() => setClearanceLevel(String(level))}
                        aria-label={`Set clearance level to ${level}`}
                        aria-pressed={selected}
                        className={`h-9 rounded-md text-xs font-semibold transition-colors ${
                        selected
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-green-100"
                        }`}
                    >
                        {level}
                    </button>
                    );
                })}
                </div>

    <p className="text-xs text-muted">
      Current saved value:{" "}
      {digitalId.security_clearance_level ?? "Not set"}
    </p>
  </div>
</div>

        <p>Please be advised: Caching is active. Your updates have been saved but may take a short time to propagate.</p>
      </form>
    </Modal>
  );
}
