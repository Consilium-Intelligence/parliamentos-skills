// Gemeinsame Helfer der Wächter. Ohne Abhängigkeiten, nur Node-Bordmittel.
//
// Exit-Codes aller Wächter, gleiche Ordnung: 2 hat Vorrang vor 1, 1 vor 0.
//   0  sauber
//   1  Fund
//   2  nicht prüfbar (kein Git, Netz weg, Quelle unlesbar). Zwei ist nie null.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/** Binärdateien, die kein Wächter als Text liest. */
const BINAER = /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|woff2?|ttf|mp4)$/i;

/** Getrackte Textdateien. Was nicht im Index liegt, wird auch nicht veröffentlicht. */
export function getrackteTextdateien({ ohne = [] } = {}) {
  let liste;
  try {
    liste = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
  } catch (e) {
    nichtPruefbar(`git ls-files: ${e.message}`);
  }
  return liste
    .filter((p) => !BINAER.test(p))
    .filter((p) => !ohne.some((re) => re.test(p)))
    .map((pfad) => ({ pfad, inhalt: readFileSync(pfad, "utf8") }));
}

export function nichtPruefbar(grund) {
  console.error(`NICHT PRÜFBAR: ${grund}`);
  process.exit(2);
}

/** Zeilennummer (1-basiert) eines Zeichenindex. */
export function zeileVon(inhalt, index) {
  let n = 1;
  for (let i = 0; i < index; i++) if (inhalt.charCodeAt(i) === 10) n++;
  return n;
}
