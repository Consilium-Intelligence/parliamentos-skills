#!/usr/bin/env node
// Wächter 3: Links. Prüft jede Adresse von consiliumos.io und den Connector in getrackten Dateien.
//
// consiliumos.io ist eine Single-Page-App und antwortet auf jeden Pfad mit HTTP 200, auch auf erfundene.
// Ein Statuscode-Check wäre deshalb wertlos. Geprüft wird je Art, woran eine echte Seite erkennbar ist:
//   Seite        steht in https://consiliumos.io/sitemap.xml
//   Beleg-Seite  Titel lautet nicht „Beleg nicht gefunden“ (serverseitig gerendert)
//   Prüfschein   JSON-Endpunkt des Scheins antwortet mit 200
//   Datei        /.well-known/*.json antwortet mit 200 und gültigem JSON
//   Connector    meldet sich als ParliamentOS MCP Server
// Platzhalter (…, /ID, <…>) werden übersprungen.
//
// Exit 0 sauber · 1 toter Link · 2 nicht prüfbar (Netz, Sitemap unlesbar).

import { getrackteTextdateien, nichtPruefbar, zeileVon } from "./gemeinsam.mjs";

const BASIS = "https://consiliumos.io";
const MCP = "https://slbysjtdcfwilupwqerr.supabase.co/functions/v1/parliamentos-mcp";
const SCHEIN_API = "https://slbysjtdcfwilupwqerr.supabase.co/functions/v1/pruefschein?id=";

/** Adressen samt Fundstelle; Satzzeichen am Ende gehören zum Text, Platzhalter fallen weg. */
export function adressen(inhalt) {
  const out = [];
  for (const t of inhalt.matchAll(/https:\/\/(?:consiliumos\.io|slbysjtdcfwilupwqerr\.supabase\.co)[^\s)"'<>`\]]*/g)) {
    const url = t[0].replace(/[.,;:!?“”„»«]+$/u, "");
    if (/…|\/ID$|\/ID\b|%3C|\{/.test(url)) continue;
    out.push({ url, zeile: zeileVon(inhalt, t.index) });
  }
  return out;
}

export function art(url) {
  const p = new URL(url).pathname;
  if (url.startsWith(MCP)) return "connector";
  if (url.includes(".supabase.co/")) return "unbekannt";
  if (/^\/beleg\/[^/]+\/.+/.test(p)) return "beleg";
  if (/^\/pruefschein\/[0-9a-f-]{36}$/.test(p)) return "pruefschein";
  if (/^\/\.well-known\/.+\.json$/.test(p)) return "datei";
  return "seite";
}

async function holen(url, opt = {}) {
  const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000), ...opt });
  return { status: r.status, text: await r.text() };
}

async function pruefe(url, sitemap) {
  switch (art(url)) {
    case "seite": {
      const pfad = new URL(url).pathname.replace(/\/$/, "") || "/";
      return sitemap.has(pfad) ? null : "nicht in der Sitemap (consiliumos.io zeigt für unbekannte Pfade die App)";
    }
    case "beleg": {
      const { status, text } = await holen(url);
      if (status !== 200) return `HTTP ${status}`;
      return /<title>\s*Beleg nicht gefunden/.test(text) ? "Beleg nicht gefunden" : null;
    }
    case "pruefschein": {
      const { status } = await holen(SCHEIN_API + url.split("/").pop());
      return status === 200 ? null : `Prüfschein nicht abrufbar (HTTP ${status})`;
    }
    case "datei": {
      const { status, text } = await holen(url);
      if (status !== 200) return `HTTP ${status}`;
      try { JSON.parse(text); return null; } catch { return "kein gültiges JSON"; }
    }
    case "connector": {
      const { status, text } = await holen(url);
      return status === 200 && text.includes("ParliamentOS MCP Server") ? null : `Connector meldet sich nicht (HTTP ${status})`;
    }
    default:
      return "unbekannte Adresse auf der Supabase-Domain";
  }
}

async function main() {
  let sitemap;
  try {
    const { status, text } = await holen(`${BASIS}/sitemap.xml`);
    if (status !== 200) throw new Error(`HTTP ${status}`);
    sitemap = new Set([...text.matchAll(/<loc>https:\/\/consiliumos\.io([^<]*)<\/loc>/g)].map((t) => t[1].replace(/\/$/, "") || "/"));
    if (sitemap.size === 0) throw new Error("leer");
  } catch (e) {
    nichtPruefbar(`Sitemap: ${e.message}`);
  }

  const fundorte = new Map();
  for (const { pfad, inhalt } of getrackteTextdateien({ ohne: [/^scripts\/waechter\//] })) {
    for (const { url, zeile } of adressen(inhalt)) {
      if (!fundorte.has(url)) fundorte.set(url, []);
      fundorte.get(url).push(`${pfad}:${zeile}`);
    }
  }

  let tot = 0;
  for (const [url, orte] of fundorte) {
    let fehler;
    try {
      fehler = await pruefe(url, sitemap);
    } catch (e) {
      nichtPruefbar(`${url}: ${e.message}`);
    }
    console.log(`${fehler ? "TOT " : "ok  "} ${url}${fehler ? `  ← ${fehler}  (${orte.join(", ")})` : ""}`);
    if (fehler) tot++;
  }
  if (tot) {
    console.log(`\n${tot} tote(r) Link(s).`);
    process.exit(1);
  }
  console.log(`Links: alle ${fundorte.size} Adressen erreichbar.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
