#!/usr/bin/env node
// Wächter 2: Spuren. Findet interne Spuren in getrackten Dateien: Namen von Tabellen und Werkzeugen des
// Betriebs, Personennamen, Arbeitsnotizen, lokale Pfade und private Adressen.
//
// Zwei Arten von Regeln:
//   1. Sperrwörter stehen nur als SHA-256-Präfix in spuren-sperrliste.json. Der Wächter zerlegt den Text in
//      Wörter, rechnet für jedes Wort den Präfix und vergleicht. So kennt er interne Namen, ohne sie in einem
//      öffentlichen Repo auszuschreiben. Ein neues Sperrwort: node scripts/waechter/spuren.mjs --hash <wort>
//   2. Muster, die selbst nichts verraten, stehen unten im Klartext.
//
// Exit 0 sauber · 1 Fund · 2 nicht prüfbar.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getrackteTextdateien, nichtPruefbar, zeileVon } from "./gemeinsam.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));

export const hashWort = (wort) => createHash("sha256").update(wort.toLowerCase()).digest("hex").slice(0, 16);

/** Erlaubte Mailadressen. Jede andere Adresse ist ein Fund (private Postfächer, Testkonten). */
const ERLAUBTE_ADRESSEN = new Set(["albrecht@consiliumos.io", "security@consiliumos.io", "noreply@anthropic.com"]);

export const MUSTER = [
  { art: "Markierung eines internen Abschnitts", re: /INTERN-(ANFANG|ENDE)/g },
  { art: "Lokaler Pfad", re: /\/Users\/[A-Za-z]|~\/\.config\/|~\/Projekte\/|\.planning\//g },
  { art: "Notion-Kennung", re: /notion:[0-9a-f]{32}/g },
  { art: "Sitzungs- oder Laufkennung", re: /\b(AS|S)-20\d\d-\d\d-\d\d\b/g },
  { art: "Vermerk einer Entscheidung", re: /\b(Entscheidung|Freigabe|Vorgabe) (MA|MG)\b|\((MA|MG)[ ,]\s?\d/g },
  { art: "Trigger.dev-Projekt", re: /\bproj_[a-z0-9]{16,}\b/g },
];

const ADRESSE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** Wörter samt Bestandteilen: "a-b.c" ergibt "a-b.c", "a", "b", "c". */
function* woerter(inhalt) {
  for (const t of inhalt.matchAll(/[\p{L}\p{N}_]+(?:[.-][\p{L}\p{N}_]+)*/gu)) {
    yield { wort: t[0], index: t.index };
    if (/[.-]/.test(t[0])) for (const teil of t[0].split(/[.-]/)) yield { wort: teil, index: t.index };
  }
}

export function pruefeInhalt(inhalt, sperrliste) {
  const funde = [];
  for (const { wort, index } of woerter(inhalt)) {
    if (sperrliste.has(hashWort(wort))) funde.push({ art: "Sperrwort", zeile: zeileVon(inhalt, index), stelle: `${wort.slice(0, 2)}…` });
  }
  for (const { art, re } of MUSTER) {
    for (const t of inhalt.matchAll(re)) funde.push({ art, zeile: zeileVon(inhalt, t.index), stelle: t[0] });
  }
  for (const t of inhalt.matchAll(ADRESSE)) {
    if (!ERLAUBTE_ADRESSEN.has(t[0].toLowerCase())) funde.push({ art: "Mailadresse außerhalb der Erlaubnisliste", zeile: zeileVon(inhalt, t.index), stelle: `…@${t[0].split("@")[1]}` });
  }
  return funde;
}

export function ladeSperrliste() {
  try {
    const { hashes } = JSON.parse(readFileSync(join(HIER, "spuren-sperrliste.json"), "utf8"));
    if (!Array.isArray(hashes) || hashes.length === 0) nichtPruefbar("Sperrliste leer");
    return new Set(hashes);
  } catch (e) {
    nichtPruefbar(`Sperrliste unlesbar: ${e.message}`);
  }
}

function main() {
  const i = process.argv.indexOf("--hash");
  if (i > 0) {
    for (const w of process.argv.slice(i + 1)) console.log(hashWort(w));
    return;
  }
  const sperrliste = ladeSperrliste();
  // Die Wächter selbst enthalten die Muster; ihre Tests bauen Sperrwörter zur Laufzeit.
  const dateien = getrackteTextdateien({ ohne: [/^scripts\/waechter\//] });
  let n = 0;
  for (const { pfad, inhalt } of dateien) {
    for (const f of pruefeInhalt(inhalt, sperrliste)) {
      console.log(`FUND ${pfad}:${f.zeile}  ${f.art}  (${f.stelle})`);
      n++;
    }
  }
  if (n) {
    console.log(`\n${n} Spur(en). Stelle umformulieren; ist das Wort öffentlich unbedenklich, aus der Sperrliste nehmen.`);
    process.exit(1);
  }
  console.log(`Spuren: sauber (${dateien.length} Dateien, ${sperrliste.size} Sperrwörter).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
