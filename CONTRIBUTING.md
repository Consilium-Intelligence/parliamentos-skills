# Mitmachen

Danke für jede Rückmeldung. So ist das Repo aufgebaut:

| Bereich | Quelle | Wie ändern |
|---|---|---|
| `plugins/parliamentos/` (Skill, Manifeste, Connector), `.claude-plugin/marketplace.json`, `LICENSE` | Spiegel aus dem Hauptrepo von ConsiliumOS | Issue öffnen; wir übernehmen die Änderung dort und spiegeln sie hierher |
| `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.github/`, `scripts/waechter/` | dieses Repo | Pull Request |

Ein Pull Request auf gespiegelte Dateien wird beim nächsten Spiegeln überschrieben. Darum führt der Weg dort über
ein Issue.

## Issues

- **Fehler im Plugin oder Skill:** Vorlage „Fehler“.
- **Eine amtliche Zeile weicht vom Original ab:** Vorlage „Datenbefund“. Kennung und Link zum Original genügen.
- **Frage zur Nutzung:** Vorlage „Frage“.
- **Sicherheitslücke:** bitte vertraulich, siehe SECURITY.md.

Bitte fügt keine vollständigen Antworten mit personenbezogenen Daten ein. Kennungen wie `[[beleg:ds:279704]]` und
Prüfschein-Links reichen uns zum Nachstellen.

## Pull Requests

- Die Wächter (Plugin und Marktplatz, Geheimnisse, Spuren, Links) laufen bei jedem Pull Request und müssen grün sein.
- Lokal vorab: `node --test scripts/waechter/waechter.test.mjs && node scripts/waechter/geheimnisse.mjs && node scripts/waechter/spuren.mjs && node scripts/waechter/links.mjs`
- Sprache: Deutsch oder Englisch. Texte beschreiben, was das Plugin tut.

## Verhalten

Wir antworten sachlich und erwarten das auch. Beiträge, die Personen herabsetzen, schließen wir.

---

**English:** Plugin files are mirrored from ConsiliumOS' main repository: please open an issue for changes there.
Pull requests are welcome for README, documentation and the guard scripts. All checks must pass. Citation IDs and
certificate links are all we need; please leave out full answers containing personal data.
