import type { ReactNode } from "react";
import { Container, Reveal } from "./Primitives";

export function PageHero({ eyebrow, title, intro, children, aside }:
  { eyebrow: string; title: string; intro: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="uc-warm py-16 md:py-20">
      <Container className={aside ? "grid items-center gap-12 lg:grid-cols-2" : ""}>
        <Reveal className="max-w-2xl">
          <p className="uc-eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h1>
          <p className="uc-muted mt-4 text-lg leading-relaxed">{intro}</p>
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
        {aside}
      </Container>
    </section>
  );
}
