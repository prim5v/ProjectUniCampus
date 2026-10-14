import { ecosystem, problems, flowSteps, solutions } from "../content";
import { IDEASE_RELEASE_URL } from "../config";
import { Container, Cta, Reveal, SectionHead } from "./Primitives";
import { PhoneMockup } from "./Mockups";

export function EcosystemSection({ layout = "columns" }: { layout?: "columns" | "rows" }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHead eyebrow="The ecosystem" title="Three connected parts, one credential path"
          intro="Software for the institution, an app for the student, and readers at the campus point." />
        <div className={layout === "columns" ? "mt-12 grid gap-10 md:grid-cols-3" : "mt-10"}>
          {ecosystem.map(({ key, title, role, body, to, Icon }, i) => (
            <Reveal key={key} delay={i * 0.06}
              className={layout === "columns" ? "border-t pt-6 uc-border" : "grid gap-4 border-t py-8 uc-border md:grid-cols-[1fr_2fr]"}>
              <div>
                <Icon className="uc-green-text h-6 w-6" aria-hidden />
                <p className="uc-eyebrow mt-4">{role}</p>
                <h3 className="mt-1 text-xl font-semibold">{title}</h3>
              </div>
              <div>
                <p className="uc-muted leading-relaxed">{body}</p>
                <div className="mt-3"><Cta to={to} variant="text" arrow>Learn more</Cta></div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="uc-warm py-20">
      <Container>
        <SectionHead eyebrow="The opportunity" title="Problems UniCampus is designed to address"
          intro="Not every institution faces all of these. They are the areas where a connected, mobile-first credential layer can help." />
        <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {problems.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <dt className="font-semibold">{p.t}</dt>
              <dd className="uc-muted mt-1 leading-relaxed">{p.d}</dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function CredentialFlow({ mono = false }: { mono?: boolean }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHead eyebrow="Mobile credentialing" title="From phone to verified workflow"
          intro="The credential path is the same whichever presentation method is used. Compatible devices and readers matter." />
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {flowSteps.map((s, i) => (
            <li key={s} className="rounded-lg border p-4 uc-border">
              <span className={`uc-green-text text-xs font-semibold ${mono ? "font-mono" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="uc-tint rounded-lg p-6">
            <h3 className="font-semibold">Contactless NFC / HCE</h3>
            <p className="uc-muted mt-2 text-sm leading-relaxed">
              NFC is the short-range radio link. Host Card Emulation (HCE) is the Android mechanism that lets a phone present a contactless credential.
              It needs a compatible Android phone and a compatible reader.
            </p>
          </div>
          <div className="rounded-lg border p-6 uc-border">
            <h3 className="font-semibold">QR fallback</h3>
            <p className="uc-muted mt-2 text-sm leading-relaxed">
              A complementary path where a reader scans a code on screen. It does not have the same security properties as NFC, and suits places where NFC is not available.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SolutionsSection() {
  return (
    <section className="uc-warm py-20">
      <Container>
        <SectionHead eyebrow="For universities" title="What an institution can evaluate"
          intro="Organized around institutional outcomes. Labels show what has a module in the platform today and what is scoped per pilot." />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {solutions.map((s) => (
            <li key={s.t} className="border-t pt-4 uc-border">
              <span className="uc-eyebrow">{s.status}</span>
              <h3 className="mt-2 font-semibold">{s.t}</h3>
              <p className="uc-muted mt-1 text-sm leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Cta to="/contact" arrow>Discuss a University Pilot</Cta>
          <Cta to="/solutions" variant="secondary">Explore University Solutions</Cta>
        </div>
      </Container>
    </section>
  );
}

export function StudentSection() {
  return (
    <section className="py-20">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <PhoneMockup />
        <div>
          <SectionHead eyebrow="For students" title="Your university ID, on your phone"
            intro="IDEase holds your digital university identity and can present it by contactless NFC on compatible Android phones, or as a QR code where applicable." />
          <p className="uc-muted mt-4 text-sm leading-relaxed">
            Access and payment features depend on your institution's configured infrastructure and supported integrations.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Cta to="/students">Discover IDEase</Cta>
            <a href={IDEASE_RELEASE_URL} target="_blank" rel="noopener noreferrer" className="uc-btn uc-btn-secondary">
              Android release (GitHub)
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="uc-dark py-20">
      <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Start with a limited pilot.</h2>
          <p className="mt-3 opacity-80">Talk to us about one campus use case, assess compatibility, and agree a scope together.</p>
        </div>
        <Cta to="/contact" variant="inverse" arrow>Request a Pilot</Cta>
      </Container>
    </section>
  );
}
