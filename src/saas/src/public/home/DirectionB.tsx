import { ArrowRight } from "lucide-react";
import { PublicShell } from "../components/PublicShell";
import { Container, Cta, Reveal } from "../components/Primitives";
import { CredentialScene } from "../components/Mockups";
import { flowSteps } from "../content";
import { EcosystemSection, CredentialFlow, ProblemSection, SolutionsSection, StudentSection, ClosingCta } from "../components/Sections";

/** Direction B: Infrastructure and Technology. System diagram leads; software and hardware together. */
export function DirectionB() {
  return (
    <PublicShell>
      <section className="py-16 md:py-20">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="uc-eyebrow font-mono">Phone → Reader → Verification → Workflow</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              A student's phone, verified at the campus point.
            </h1>
            <p className="uc-muted mt-5 text-lg leading-relaxed">
              UniCampus OS connects mobile credentials, readers and institutional software, so identity, access, attendance and payments follow one credential path.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta to="/infrastructure" arrow>See how it works</Cta>
              <Cta to="/students" variant="secondary">Discover IDEase</Cta>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <CredentialScene className="!p-10" />
            <ol className="mt-4 grid gap-3 md:grid-cols-5" aria-label="Credential path">
              {flowSteps.map((s, i) => (
                <li key={s} className="flex items-start gap-2 rounded-lg border p-3 text-xs uc-border">
                  <span className="uc-green-text font-mono font-semibold">{i + 1}</span>
                  <span className="uc-muted leading-snug">{s}</span>
                  {i < flowSteps.length - 1 && <ArrowRight className="ml-auto hidden h-3 w-3 shrink-0 md:block" aria-hidden />}
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>
      <CredentialFlow mono />
      <EcosystemSection layout="rows" />
      <ProblemSection />
      <SolutionsSection />
      <StudentSection />
      <ClosingCta />
    </PublicShell>
  );
}
