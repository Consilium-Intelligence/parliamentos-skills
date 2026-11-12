# Sicherheit

## Schwachstelle melden

Bitte vertraulich melden, mit einer kurzen Beschreibung und, wenn möglich, Schritten zum Nachstellen:

- über GitHub: Reiter **Security** → **Report a vulnerability** (vertraulich, nur ConsiliumOS liest mit)
- per Mail: albrecht@consiliumos.io, Betreff „Sicherheit parliamentos-skills“

Wir bestätigen den Eingang innerhalb von 3 Werktagen und melden uns innerhalb von 10 Werktagen mit einer
Einschätzung und dem weiteren Vorgehen. Wer meldet, wird auf Wunsch im CHANGELOG genannt.

## Geltungsbereich

Dieses Repo: der Skill `belegen`, die Manifeste (`plugin.json`, `marketplace.json`), die Connector-Konfiguration
(`.mcp.json`) und die Wächter unter `scripts/waechter/` und `.github/`.

Schwachstellen im Dienst selbst (consiliumos.io, der Connector-Server, Prüfscheine) nehmen wir über dieselben Wege
entgegen.

## Beim Testen

- Bitte nur mit dem eigenen Konto testen und nur auf Daten zugreifen, die zu diesem Konto gehören.
- Lasttests und automatisierte Massenabfragen bitte vorher absprechen.
- Bitte schickt uns keine Antworttexte mit personenbezogenen Daten Dritter; Kennungen wie `[[beleg:ds:279704]]`
  und Prüfschein-Links genügen.

## Unterstützte Versionen

Sicherheitskorrekturen erscheinen für die jeweils neueste Version des Plugins (siehe CHANGELOG.md).

---

**English:** Please report vulnerabilities privately via GitHub (Security → Report a vulnerability) or to
albrecht@consiliumos.io. We acknowledge within 3 business days and follow up within 10. Scope: this repository and
the ParliamentOS service behind it. Test only with your own account. Citation IDs and certificate links are all we
need; please leave out answer texts containing personal data.
