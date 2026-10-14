import { useMeta } from "../hooks/useMeta";
import { PublicShell } from "../components/PublicShell";
import { PageHero } from "../components/PageHero";
import { Container, SectionHead } from "../components/Primitives";
import { PhoneMockup } from "../components/Mockups";
import { IDEASE_RELEASE_URL } from "../config";

const steps = [
  "On your Android phone, open the release page below.",
  "Download the APK file listed under the release's assets.",
  "When Android asks, allow installs from the app you used to download it (usually your browser or Files app). You can turn this off again afterwards.",
  "Open the downloaded file, choose Install, then open IDEase and follow the on-screen setup.",
];
const faqs = [
  ["Does IDEase work on every Android phone?", "No. Contactless presentation uses NFC and Android Host Card Emulation (HCE), and support varies by phone model. Check that NFC is switched on in your phone settings. QR presentation only needs a screen."],
  ["Is there an iPhone or Play Store version?", "This page covers the Android app distributed as an APK from the project's GitHub release. We do not list any other distribution here."],
  ["Install was blocked. What now?", "Android blocks APKs from unknown sources by default. Allow installs for the app you downloaded with, then open the file again."],
  ["Nothing happens when I tap a reader.", "Check that NFC is on and your phone is unlocked. Access and payments also depend on whether your institution has configured compatible readers at that point, so it may not be available yet."],
  ["Is my access or payment guaranteed to work?", "No. Those features depend on your institution's configured infrastructure and supported integrations."],
];

export function StudentsPage() {
  useMeta({ title: "IDEase for Students", description: "IDEase is the UniCampus student app: a digital university ID for Android with contactless NFC/HCE and QR presentation. Compatibility, install steps and FAQ.", path: "/students" });
  return (
    <PublicShell>
      <PageHero eyebrow="IDEase for students" title="Your university ID, on your phone"
        intro="IDEase holds your digital university identity and can present it to compatible campus readers by contactless NFC on supported Android phones, or as a QR code."
        aside={<PhoneMockup />}>
        <a href={IDEASE_RELEASE_URL} target="_blank" rel="noopener noreferrer" className="uc-btn uc-btn-primary">Download for Android</a>
      </PageHero>

      <section className="py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="Digital university ID" title="What you can do with it"
              intro="Carry your university identity on your phone and present it where your institution has set up compatible readers." />
            <p className="uc-muted mt-4 text-sm leading-relaxed">
              Access and payment functionality depend on your institution's configured infrastructure and supported integrations. The phone shown here is a conceptual illustration, not a screenshot.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="uc-tint rounded-lg p-5"><h3 className="font-semibold">Contactless (NFC / HCE)</h3><p className="uc-muted mt-1 text-sm">Tap your phone on a compatible reader. Needs an Android phone with NFC and HCE support.</p></div>
            <div className="rounded-lg border p-5 uc-border"><h3 className="font-semibold">QR code</h3><p className="uc-muted mt-1 text-sm">Show a code on your screen for a reader to scan, where your institution supports it.</p></div>
          </div>
        </Container>
      </section>

      <section className="uc-warm py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="Compatibility" title="Before you install" />
            <ul className="uc-muted mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>An Android phone. For tap-to-present, NFC and HCE support are required.</li>
              <li>Your institution must be using UniCampus and have set up your credential.</li>
              <li>Readers must be installed where you want to use it.</li>
            </ul>
          </div>
          <div>
            <SectionHead eyebrow="Install" title="Install the Android app" />
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
              {steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <p className="uc-muted mt-3 text-xs">Only install the APK from the official release link on this page.</p>
            <a href={IDEASE_RELEASE_URL} target="_blank" rel="noopener noreferrer" className="uc-btn uc-btn-primary mt-4">Open release page</a>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-3xl">
          <SectionHead eyebrow="Help" title="Troubleshooting and FAQ" />
          <div className="mt-8 divide-y uc-border border-y">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer font-medium">{q}</summary>
                <p className="uc-muted mt-2 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
