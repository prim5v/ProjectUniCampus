import { useMeta } from "../hooks/useMeta";
import { PublicShell } from "../components/PublicShell";
import { PageHero } from "../components/PageHero";
import { Container, Cta, SectionHead } from "../components/Primitives";
import { CredentialScene } from "../components/Mockups";
import { CredentialFlow, ClosingCta } from "../components/Sections";

const concepts = [
  ["A digital university credential", "A record that identifies a student, held on their phone instead of only on a plastic card, and checked against the institution's rules."],
  ["Why phones can replace cards", "Students already carry them. A phone credential can be issued, updated and revoked without printing or replacing a card. Physical cards may still be useful as a fallback or for people whose phones are not supported."],
  ["NFC, at a high level", "Near Field Communication is a short-range radio link between two devices a few centimetres apart. It is the communication layer."],
  ["Android HCE", "Host Card Emulation lets an Android phone behave like a contactless card when tapped on a reader. It is one way to present a credential over NFC. It is Android-specific, and support depends on the phone and the reader."],
  ["QR fallback", "A code shown on the phone screen and scanned by the reader. It is a complementary path where NFC is not available. It does not have the same security properties as NFC."],
  ["What a reader does", "It receives or scans the credential at a physical point such as a door or counter and passes it on for verification."],
  ["Verification and authorization", "Verification asks whether the credential is genuine. Authorization asks whether this student is allowed to do this here. They are separate steps, and the institution controls the rules for the second."],
  ["Apps and platform together", "IDEase holds the credential. UniCampus OS lets the institution manage credentials and rules, and readers connect the two at the campus point."],
];

const rows: [string, string, string, string][] = [
  ["How it is presented", "Card tapped or swiped at a reader", "Phone tapped on a reader (NFC/HCE)", "Code on the phone screen, scanned"],
  ["Needs", "Issued physical card", "Compatible Android phone and reader", "Phone screen and a reader that can scan"],
  ["Device dependence", "None, but the card can be lost or damaged", "High: HCE support varies by device", "Low: any phone that can show the code"],
  ["Trade-offs", "Replacement and reissue work", "Not every phone or reader supports it", "Different security properties from NFC"],
];

export function InfrastructurePage() {
  useMeta({ title: "Infrastructure and Mobile Credentialing", description: "How phone-based campus credentials work: NFC, Android HCE, QR fallback, readers, and how verification relates to authorization.", path: "/infrastructure" });
  return (
    <PublicShell>
      <PageHero eyebrow="Infrastructure" title="Mobile credentialing, explained"
        intro="How a student's phone becomes a campus credential, what readers do, and what an institution still needs to put in place."
        aside={<CredentialScene />}>
        <Cta to="/contact" arrow>Discuss a University Pilot</Cta>
        <Cta to="/students" variant="secondary">Discover IDEase</Cta>
      </PageHero>

      <section className="py-20">
        <Container>
          <SectionHead eyebrow="The building blocks" title="What each piece does" />
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {concepts.map(([t, d]) => (
              <div key={t}><dt className="font-semibold">{t}</dt><dd className="uc-muted mt-1 leading-relaxed">{d}</dd></div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="uc-warm py-20">
        <Container>
          <SectionHead eyebrow="Comparison" title="Card, phone and QR"
            intro="Each method has trade-offs. Institutions can offer more than one." />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of physical card, phone NFC/HCE and QR credential presentation</caption>
              <thead>
                <tr className="border-b uc-border">
                  <th scope="col" className="py-3 pr-4 font-semibold"><span className="sr-only">Aspect</span></th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Physical card</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Phone: NFC / HCE</th>
                  <th scope="col" className="py-3 font-semibold">Phone: QR</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([a, b, c, d]) => (
                  <tr key={a} className="border-b align-top uc-border">
                    <th scope="row" className="py-3 pr-4 font-medium">{a}</th>
                    <td className="uc-muted py-3 pr-4">{b}</td>
                    <td className="uc-muted py-3 pr-4">{c}</td>
                    <td className="uc-muted py-3">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <CredentialFlow />

      <section className="uc-warm py-16">
        <Container className="max-w-3xl">
          <h2 className="text-xl font-semibold">What the institution still needs</h2>
          <p className="uc-muted mt-3 leading-relaxed">
            Compatible readers, credential provisioning for students, authorization rules, and integration with existing workflows. A phone credential does not replace these. It depends on them.
          </p>
        </Container>
      </section>
      <ClosingCta />
    </PublicShell>
  );
}
