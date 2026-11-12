#!/usr/bin/env node
// Wächter 1: Geheimnisse. Findet Zugangsdaten in getrackten Dateien, bevor sie öffentlich werden.
//
// Ein Geheimnis, das einmal committet ist, ist für immer committet: Forks, Klone und Caches behalten es.
// Der einzige verlässliche Fix ist Rotation, also muss der Fund vorher passieren.
//
// Werte werden nie ausgegeben, nur Datei, Zeile, Art und ein 8-stelliger SHA-256-Präfix.
// Ein Supabase-JWT mit role "anon" ist öffentlich gedacht und kein Fund; gemeldet wird "service_role".
// Ergänzend läuft im Workflow gitleaks über die ganze Historie.

import { createHash } from "node:crypto";
import { getrackteTextdateien, zeileVon } from "./gemeinsam.mjs";

const L = "(?<![A-Za-z0-9_-])";
const R = "(?![A-Za-z0-9_-])";
const m = (koerper) => new RegExp(L + koerper + R, "g");

export const MUSTER = [
  { art: "Trigger.dev Personal Access Token", re: m("tr_pat_[A-Za-z0-9]{16,}") },
  { art: "Trigger.dev Secret Key (prod)", re: m("tr_prod_[A-Za-z0-9]{16,}") },
  { art: "Trigger.dev Secret Key (dev)", re: m("tr_dev_[A-Za-z0-9]{16,}") },
  { art: "Anthropic-Schlüssel", re: m("sk-ant-[A-Za-z0-9_-]{32,}") },
  { art: "OpenAI-Schlüssel", re: m("sk-(?!ant-)[A-Za-z0-9_-]{32,}") },
  { art: "GitHub-Token", re: m("(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})") },
  { art: "Stripe Secret Key (live)", re: m("[sr]k_live_[A-Za-z0-9]{20,}") },
  { art: "AWS Access Key ID", re: m("AKIA[0-9A-Z]{16}") },
  { art: "Resend-Schlüssel", re: m("re_[A-Za-z0-9]{24,}") },
  { art: "ElevenLabs-Schlüssel", re: m("sk_[a-f0-9]{48}") },
  { art: "ParliamentOS-MCP-Schlüssel", re: m("nmk_[A-Za-z0-9]{16,}") },
  { art: "Privater Schlüssel (PEM)", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { art: "Supabase-Geheimschlüssel", re: m("sb_secret_[A-Za-z0-9_-]{20,}") },
  { art: "JWT", re: m("eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}"), jwt: true },
];

/** true, wenn das JWT kein öffentlicher anon-Schlüssel ist. Unlesbare JWTs gelten als geheim. */
export function jwtIstGeheim(token) {
  try {
    const nutzlast = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return nutzlast.role !== "anon";
  } catch {
    return true;
  }
}

export function pruefeInhalt(inhalt) {
  const funde = [];
  for (const { art, re, jwt } of MUSTER) {
    for (const t of inhalt.matchAll(re)) {
      if (jwt && !jwtIstGeheim(t[0])) continue;
      funde.push({ art, zeile: zeileVon(inhalt, t.index), hash: createHash("sha256").update(t[0]).digest("hex").slice(0, 8) });
    }
  }
  return funde;
}

function main() {
  // Die Musterdatei selbst und ihre Tests enthalten Muster, keine Werte.
  const dateien = getrackteTextdateien({ ohne: [/^scripts\/waechter\/geheimnisse(\.test)?\.mjs$/] });
  let n = 0;
  for (const { pfad, inhalt } of dateien) {
    for (const f of pruefeInhalt(inhalt)) {
      console.log(`FUND ${pfad}:${f.zeile}  ${f.art}  sha256:${f.hash}`);
      n++;
    }
  }
  if (n) {
    console.log(`\n${n} Fund(e). Schlüssel rotieren, dann aus dem Commit entfernen.`);
    process.exit(1);
  }
  console.log(`Geheimnisse: sauber (${dateien.length} Dateien).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
