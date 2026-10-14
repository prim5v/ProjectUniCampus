/**
 * Isolated submission handler for pilot inquiries.
 *
 * Nothing is sent until VITE_PILOT_INQUIRY_ENDPOINT is set to a URL that accepts a JSON POST
 * (your own backend route, or a hosted form service). Do NOT put secrets in this file or in
 * VITE_ variables: anything prefixed VITE_ is visible in the browser. If the endpoint needs a
 * secret, put it behind your own server-side route.
 */
export type Inquiry = {
  name: string; email: string; institution: string; role: string; interest: string; message: string;
};
export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "network" | "rejected" };

const ENDPOINT = import.meta.env.VITE_PILOT_INQUIRY_ENDPOINT as string | undefined;

export async function submitPilotInquiry(data: Inquiry): Promise<SubmitResult> {
  if (!ENDPOINT) return { ok: false, reason: "not-configured" };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
