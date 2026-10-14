import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { submitPilotInquiry, type Inquiry } from "../submitInquiry";

const interests = ["Digital identity", "Access control", "Attendance", "Campus payments", "Institutional platform", "Hardware pilot", "Other"];
type Errors = Partial<Record<keyof Inquiry, string>>;
type Status = "idle" | "submitting" | "success" | "error" | "not-configured";
const empty: Inquiry = { name: "", email: "", institution: "", role: "", interest: "", message: "" };

function validate(d: Inquiry): Errors {
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Enter your name.";
  if (!d.email.trim()) e.email = "Enter your institutional email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Enter a valid email address.";
  if (!d.institution.trim()) e.institution = "Enter your university or institution.";
  if (!d.role.trim()) e.role = "Enter your department or role.";
  if (!d.interest) e.interest = "Choose an area of interest.";
  if (d.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
  return e;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

const input = "w-full rounded-lg border bg-white px-3 py-2 text-sm uc-border";

export function PilotForm() {
  const [v, setV] = useState<Inquiry>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: keyof Inquiry) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });
  const a11y = (k: keyof Inquiry) => ({ id: `f-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `f-${k}-err` : undefined });

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const found = validate(v);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }
    setStatus("submitting");
    const res = await submitPilotInquiry({ ...v, name: v.name.trim(), email: v.email.trim(), institution: v.institution.trim(), role: v.role.trim(), message: v.message.trim() });
    if (res.ok) { setStatus("success"); setV(empty); }
    else setStatus(res.reason === "not-configured" ? "not-configured" : "error");
  }

  if (status === "success") {
    return (
      <div role="status" className="uc-tint rounded-lg p-6">
        <h3 className="font-semibold">Inquiry sent</h3>
        <p className="uc-muted mt-2 text-sm">Thank you. We will reply to the email address you provided.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4" aria-label="Pilot inquiry">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="f-name" label="Name" error={errors.name}><input {...a11y("name")} className={input} autoComplete="name" value={v.name} onChange={set("name")} /></Field>
        <Field id="f-email" label="Institutional email" error={errors.email}><input {...a11y("email")} type="email" className={input} autoComplete="email" value={v.email} onChange={set("email")} /></Field>
        <Field id="f-institution" label="University or institution" error={errors.institution}><input {...a11y("institution")} className={input} autoComplete="organization" value={v.institution} onChange={set("institution")} /></Field>
        <Field id="f-role" label="Department or role" error={errors.role}><input {...a11y("role")} className={input} autoComplete="organization-title" value={v.role} onChange={set("role")} /></Field>
      </div>
      <Field id="f-interest" label="Area of interest" error={errors.interest}>
        <select {...a11y("interest")} className={input} value={v.interest} onChange={set("interest")}>
          <option value="">Select…</option>
          {interests.map((i) => <option key={i}>{i}</option>)}
        </select>
      </Field>
      <Field id="f-message" label="Message" error={errors.message}>
        <textarea {...a11y("message")} rows={5} className={input} value={v.message} onChange={set("message")} />
      </Field>
      <div>
        <button type="submit" disabled={status === "submitting"} className="uc-btn uc-btn-primary disabled:opacity-60">
          {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {status === "submitting" ? "Sending…" : "Send inquiry"}
        </button>
      </div>
      <div aria-live="polite">
        {status === "error" && <p role="alert" className="text-sm text-red-700">Your message could not be sent. Please check your connection and try again.</p>}
        {status === "not-configured" && <p role="alert" className="text-sm text-red-700">Inquiry submission is not connected yet, so your message was not sent. Please try again later.</p>}
      </div>
    </form>
  );
}
