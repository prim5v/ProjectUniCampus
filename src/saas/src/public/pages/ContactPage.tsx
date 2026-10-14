import { useMeta } from "../hooks/useMeta";
import { PublicShell } from "../components/PublicShell";
import { PageHero } from "../components/PageHero";
import { Container, SectionHead } from "../components/Primitives";
import { PilotForm } from "../components/PilotForm";

export function ContactPage() {
  useMeta({ title: "Contact and Pilot Inquiry", description: "Universities interested in a UniCampus pilot can send an inquiry about digital identity, access, attendance, payments or hardware.", path: "/contact" });
  return (
    <PublicShell>
      <PageHero eyebrow="Contact" title="Discuss a university pilot"
        intro="This form is for university leadership, ICT departments, security teams and innovation teams. Students looking for the app should visit the IDEase page." />
      <section className="py-16">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHead eyebrow="What happens next" title="After you send an inquiry" />
            <ol className="uc-muted mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
              <li>We read your message and reply to the email you provide.</li>
              <li>We discuss a suitable campus use case.</li>
              <li>If it fits, we scope a limited pilot together.</li>
            </ol>
            <p className="uc-muted mt-4 text-xs">We do not promise fixed timelines or outcomes.</p>
          </div>
          <PilotForm />
        </Container>
      </section>
    </PublicShell>
  );
}
