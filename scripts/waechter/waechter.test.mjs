// Tests der Wächter: Jeder muss anschlagen, wenn er soll, und schweigen, wenn alles sauber ist.
// Testwerte werden zur Laufzeit zusammengesetzt, damit kein Scanner sie als echte Schlüssel liest.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as geheim from "./geheimnisse.mjs";
import * as spuren from "./spuren.mjs";
import { adressen, art } from "./links.mjs";

const wdh = (z, n) => z.repeat(n);
const jwt = (nutzlast) => ["eyJhbGciOiJIUzI1NiJ9", Buffer.from(JSON.stringify(nutzlast)).toString("base64url"), wdh("x", 20)].join(".");

test("Geheimnisse: echte Schlüsselformen schlagen an, Werte erscheinen nie in der Meldung", () => {
  const faelle = [
    ["sk-" + "ant-" + wdh("a", 40), "Anthropic-Schlüssel"],
    ["gh" + "p_" + wdh("A", 36), "GitHub-Token"],
    ["re" + "_" + wdh("b", 30), "Resend-Schlüssel"],
    ["nm" + "k_" + wdh("c", 20), "ParliamentOS-MCP-Schlüssel"],
    [jwt({ role: "service_role" }), "JWT"],
  ];
  for (const [wert, artName] of faelle) {
    const funde = geheim.pruefeInhalt(`x = "${wert}"`);
    assert.equal(funde.length, 1, artName);
    assert.equal(funde[0].art, artName);
    assert.equal(JSON.stringify(funde).includes(wert), false, "Wert darf nicht in der Meldung stehen");
  }
});

test("Geheimnisse: anon-JWT, gekürzte Erwähnungen und Wortteile sind kein Fund", () => {
  assert.deepEqual(geheim.pruefeInhalt(jwt({ role: "anon" })), []);
  assert.deepEqual(geheim.pruefeInhalt("Schlüssel beginnen mit sk-" + "ant-… und re" + "_…"), []);
  assert.deepEqual(geheim.pruefeInhalt("procedu" + "re_" + wdh("c", 30)), []);
});

test("Spuren: Sperrwort über Hash erkannt, auch als Teil eines Bindestrich-Worts, ohne Klartext in der Meldung", () => {
  const wort = ["ge", "heim", "projekt"].join("");
  const liste = new Set([spuren.hashWort(wort)]);
  for (const text of [`Siehe ${wort}.`, `Pfad x-${wort}-y`, `${wort.toUpperCase()}`]) {
    const f = spuren.pruefeInhalt(text, liste);
    assert.equal(f.length >= 1, true, text);
    assert.equal(JSON.stringify(f).includes(wort), false);
  }
  assert.deepEqual(spuren.pruefeInhalt("Belegte Antworten zu Bundestag und Nationalrat.", liste), []);
});

test("Spuren: Klartext-Muster und fremde Mailadressen", () => {
  const leer = new Set();
  const art = (t) => spuren.pruefeInhalt(t, leer).map((f) => f.art);
  assert.deepEqual(art("<!-- INTERN-" + "ANFANG -->"), ["Markierung eines internen Abschnitts"]);
  assert.deepEqual(art("/Us" + "ers/jemand/x"), ["Lokaler Pfad"]);
  assert.deepEqual(art("notion:" + wdh("a", 32)), ["Notion-Kennung"]);
  assert.deepEqual(art("Lauf AS-" + "2026-11-11"), ["Sitzungs- oder Laufkennung"]);
  assert.deepEqual(art("Entscheidung " + "MA"), ["Vermerk einer Entscheidung"]);
  assert.deepEqual(art("jemand@" + "example.org"), ["Mailadresse außerhalb der Erlaubnisliste"]);
  assert.deepEqual(art("Rückmeldungen an albrecht@consiliumos.io"), []);
});

test("Spuren: Sperrliste ist geladen und enthält nur Hash-Präfixe", () => {
  const liste = spuren.ladeSperrliste();
  assert.ok(liste.size > 100);
  for (const h of liste) assert.match(h, /^[0-9a-f]{16}$/);
});

test("Links: Platzhalter fallen weg, Satzzeichen am Ende gehören nicht zur Adresse, Arten richtig erkannt", () => {
  const text = "Siehe https://consiliumos.io/mcp. und „https://consiliumos.io/quellen“ sowie https://consiliumos.io/beleg/bt-rede/ID und https://consiliumos.io/pruefschein/…";
  assert.deepEqual(adressen(text).map((a) => a.url), ["https://consiliumos.io/mcp", "https://consiliumos.io/quellen"]);
  assert.equal(art("https://consiliumos.io/beleg/ds/279704"), "beleg");
  assert.equal(art("https://consiliumos.io/pruefschein/f3a8112c-8498-4075-a64a-8f613298bd7b"), "pruefschein");
  assert.equal(art("https://consiliumos.io/.well-known/normos-keys.json"), "datei");
  assert.equal(art("https://consiliumos.io/privacy"), "seite");
  assert.equal(art("https://slbysjtdcfwilupwqerr.supabase.co/functions/v1/parliamentos-mcp"), "connector");
});
