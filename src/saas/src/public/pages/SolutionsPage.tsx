import { useMeta } from "../hooks/useMeta";
import { PublicShell } from "../components/PublicShell";
import { PageHero } from "../components/PageHero";
import { Container, Cta, Reveal, SectionHead } from "../components/Primitives";
import { CredentialScene } from "../components/Mockups";
import { PilotForm } from "../components/PilotForm";
import { ProblemSection, SolutionsSection, ClosingCta } from "../components/Sections";

const useCases = [
  ["Campus entrances", "Verify a credential at a gate or door reader."],
  ["Library access", "Check who is entering a library or study space."],
  ["Attendance points", "Record attendance when a student presents a credential."],
  ["Cafeteria payments", "Tie a payment workflow to a student credential."],
  ["Student service counters", "Identify a student quickly at a service desk."],
];
const considerations = [
  "Compatible readers must be installed at the points you want to cover.",
  "Students need credentials provisioned into IDEase.",
  "Authorization rules, meaning who can go where, are set by the institution.",
  "Phone compatibility matters: HCE is an Android technology and support varies by device.",
  "Connection requirements at each reader point are assessed per site, not assumed.",
  "Integration with existing student records or finance systems is scoped with you. We do not assume it.",
];
const process = ["Initial conversation", "Identify a suitable campus use case", "Assess infrastructure and compatibility", "Agree a limited pilot scope", "Evaluate results and next steps"];

export function SolutionsPage() {
  useMeta({ title: "University Solutions", description: "How UniCampus OS helps universities manage digital identity, access, attendance and campus payments, and how a limited pilot works.", path: "/solutions" });
  return (
    <PublicShell>
      <PageHero eyebrow="University solutions" title="Modernize university identity and campus operations"
        intro="UniCampus OS brings student credentials, campus access, attendance and payments into one institutional platform, connected to readers and the IDEase student app."
        aside={<CredentialScene />}>
        <Cta to="/contact" arrow>Discuss a University Pilot</Cta>
        <Cta to="/infrastructure" variant="secondary">See how credentials work</Cta>
      </PageHero>
      <ProblemSection />
      <SolutionsSection />

      <section className="py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="Mobile credentialing" title="How it fits institutional workflows"
              intro="The institution manages who holds a credential and what it allows. IDEase holds the credential on the student's phone. A reader checks it at the campus point, and the platform records and applies the result." />
            <div className="mt-4"><Cta to="/infrastructure" variant="text" arrow>Read the technical overview</Cta></div>
          </div>
          <div>
            <h3 className="font-semibold">Where it could be used</h3>
            <p className="uc-muted mt-1 text-sm">Illustrative applications. Not every one is deployed.</p>
            <ul className="mt-4 divide-y uc-border border-y">
              {useCases.map(([t, d]) => (
                <li key={t} className="py-3"><p className="font-medium">{t}</p><p className="uc-muted text-sm">{d}</p></li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="uc-warm py-20">
        <Container>
          <SectionHead eyebrow="Deployment" title="Integration considerations"
            intro="What an institution should expect to prepare before a pilot." />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {considerations.map((c) => <li key={c} className="rounded-lg border bg-white p-4 text-sm leading-relaxed uc-border">{c}</li>)}
          </ul>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHead eyebrow="Pilot process" title="Start small, evaluate honestly"
            intro="We do not promise fixed deployment timelines or outcomes. Each pilot is scoped with the institution." />
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {process.map((p, i) => (
              <Reveal key={p} delay={i * 0.05}>
                <li className="rounded-lg border p-4 uc-border">
                  <span className="uc-green-text text-xs font-semibold">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium">{p}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="uc-warm py-20" id="inquiry">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <SectionHead eyebrow="Get in touch" title="Discuss a university pilot"
            intro="For university leadership, ICT, security and innovation teams. Tell us your area of interest and we will take it from there." />
          <PilotForm />
        </Container>
      </section>
      <ClosingCta />
    </PublicShell>
  );
}
