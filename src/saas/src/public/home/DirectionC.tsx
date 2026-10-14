import { PublicShell } from "../components/PublicShell";
import { Container, Cta, Reveal } from "../components/Primitives";
import { PhoneMockup, ReaderMockup } from "../components/Mockups";
import { EcosystemSection, StudentSection, ProblemSection, CredentialFlow, SolutionsSection, ClosingCta } from "../components/Sections";

/** Direction C: Editorial Product Experience. Serif display, student-first storytelling. */
export function DirectionC() {
  return (
    <PublicShell>
      <section className="uc-warm py-20 md:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="uc-eyebrow">UniCampus OS · IDEase · Infrastructure</p>
            <h1 className="uc-display mt-5 text-5xl font-medium leading-[1.05] sm:text-6xl">
              Campus infrastructure, built around the <em>student.</em>
            </h1>
            <p className="uc-muted mt-6 max-w-lg text-lg leading-relaxed">
              A phone that works as a university credential, readers that recognise it, and an institutional platform that ties them together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta to="/students" arrow>Discover IDEase</Cta>
              <Cta to="/solutions" variant="secondary">Explore University Solutions</Cta>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative flex justify-center">
            <PhoneMockup />
            <ReaderMockup className="absolute -bottom-6 -right-2 hidden sm:block" />
          </Reveal>
        </Container>
      </section>
      <StudentSection />
      <EcosystemSection layout="rows" />
      <CredentialFlow />
      <ProblemSection />
      <SolutionsSection />
      <ClosingCta />
    </PublicShell>
  );
}
