import { useEffect } from "react";
import { SITE_URL } from "../config";

function meta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

/** Sets title, description, canonical and social tags. Runs client-side, so it only helps crawlers that execute JavaScript. */
export function useMeta({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const full = title === "UniCampus OS" ? title : `${title} | UniCampus OS`;
    const url = `${SITE_URL}${path}`;
    document.title = full;
    meta("name", "description", description);
    meta("property", "og:title", full);
    meta("property", "og:description", description);
    meta("property", "og:type", "website");
    meta("property", "og:url", url);
    meta("name", "twitter:card", "summary");
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = url;
  }, [title, description, path]);
}
