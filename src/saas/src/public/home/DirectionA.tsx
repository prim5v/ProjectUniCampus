import { PublicShell } from "../components/PublicShell";
import { Container, Cta, Reveal } from "../components/Primitives";
import { CredentialScene } from "../components/Mockups";
import { EcosystemSection, ProblemSection, CredentialFlow, SolutionsSection, StudentSection, ClosingCta } from "../components/Sections";

/** Direction A: Institutional Enterprise. Structured, white canvas, credibility first. */
export function DirectionA() {
  return (
    <PublicShell>
      <section className="py-16 md:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="uc-eyebrow">Digital infrastructure for universities</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Your university. Connected by digital identity.
            </h1>
            <p className="uc-muted mt-5 max-w-xl text-lg leading-relaxed">
              UniCampus OS connects mobile credentials, campus access, student services and institutional operations through one evolving university infrastructure platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta to="/solutions" arrow>Explore University Solutions</Cta>
              <Cta to="/students" variant="secondary">Discover IDEase</Cta>
            </div>
          </Reveal>
          <Reveal delay={0.1}><CredentialScene /></Reveal>
        </Container>
      </section>
      <EcosystemSection layout="columns" />
      <ProblemSection />
      <CredentialFlow />
      <SolutionsSection />
      <StudentSection />
      <ClosingCta />
    </PublicShell>
  );
}
