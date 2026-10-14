import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navLinks } from "../content";
import { Container, Cta } from "./Primitives";
import "../public.css";

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span aria-hidden className="inline-block h-5 w-5 rounded-[5px]" style={{ background: "var(--uc-green)" }} />
      UniCampus OS
    </Link>
  );
}

function PublicNav() {
  const [open, setOpen] = useState(false);
  const link = "text-sm font-medium uc-muted hover:text-[color:var(--uc-ink)]";
  return (
    <header className="sticky top-0 z-40 border-b uc-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => <NavLink key={l.to} to={l.to} className={link}>{l.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/signin" className={link}>Sign in</Link>
          <Cta to="/contact">Request a Pilot</Cta>
        </div>
        <button className="md:hidden p-2" aria-expanded={open} aria-controls="uc-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>
      {open && (
        <nav id="uc-mobile-nav" aria-label="Mobile" className="border-t uc-border bg-white md:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {navLinks.map((l) => <Link key={l.to} to={l.to} className="font-medium" onClick={() => setOpen(false)}>{l.label}</Link>)}
            <Link to="/signin" className="font-medium" onClick={() => setOpen(false)}>Sign in</Link>
            <Cta to="/contact">Request a Pilot</Cta>
          </Container>
        </nav>
      )}
    </header>
  );
}

function PublicFooter() {
  const col = "uc-muted text-sm hover:text-[color:var(--uc-green)]";
  return (
    <footer className="border-t uc-border uc-warm">
      <Container className="grid gap-8 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="uc-muted mt-3 max-w-xs text-sm">Digital infrastructure for universities, starting in Kenya.</p>
        </div>
        <ul className="space-y-2">
          {navLinks.map((l) => <li key={l.to}><Link to={l.to} className={col}>{l.label}</Link></li>)}
        </ul>
        <ul className="space-y-2">
          <li><Link to="/contact" className={col}>Contact</Link></li>
          <li><Link to="/signin" className={col}>Platform sign in</Link></li>
        </ul>
      </Container>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="uc">
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
