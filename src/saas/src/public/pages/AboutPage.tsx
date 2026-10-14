import { useMeta } from "../hooks/useMeta";
import { PublicShell } from "../components/PublicShell";
import { PageHero } from "../components/PageHero";
import { Container, Cta, SectionHead } from "../components/Primitives";
import { EcosystemSection, ClosingCta } from "../components/Sections";

const principles = [
  ["The phone is the credential", "Students already carry a phone. We build around it instead of around a card."],
  ["Honest about compatibility", "HCE is Android-only and support varies. NFC and QR are different methods with different trade-offs. We say so."],
  ["The institution stays in control", "Universities decide who holds a credential and what it allows."],
  ["Grow module by module", "Start with a limited pilot and extend as it proves useful."],
];

export function AboutPage() {
  useMeta({ title: "About", description: "UniCampus is building digital infrastructure for universities, starting in Kenya: mobile credentials, readers and an institutional platform.", path: "/about" });
  return (
    <PublicShell>
      <PageHero eyebrow="About UniCampus" title="Digital infrastructure for universities, starting in Kenya"
        intro="Our aim is a connected campus identity, access and services layer, so a student's phone can do what a card, a queue and several separate systems do today.">
        <Cta to="/contact" arrow>Discuss a University Pilot</Cta>
      </PageHero>
      <section className="py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="The problem" title="Fragmented campus systems"
              intro="Identity cards, access control, attendance and payments usually run separately. We are building one credential path that connects them." />
          </div>
          <div>
            <h3 className="font-semibold">How we approach it</h3>
            <ul className="mt-4 space-y-4">
              {principles.map(([t, d]) => <li key={t}><p className="font-medium">{t}</p><p className="uc-muted text-sm leading-relaxed">{d}</p></li>)}
            </ul>
          </div>
        </Container>
      </section>
      <EcosystemSection layout="rows" />
      <ClosingCta />
    </PublicShell>
  );
}
