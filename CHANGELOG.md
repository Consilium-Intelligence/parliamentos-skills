# Änderungen

Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [SemVer](https://semver.org/lang/de/).
Die Version des Plugins folgt der Version des Skills `belegen`.

## [Unveröffentlicht]

### Hinzugefügt
- Wächter bei jedem Push und Pull Request: Plugin und Marktplatz (`claude plugin validate --strict`), Geheimnisse
  (eigene Muster und gitleaks über die ganze Historie), interne Spuren, Links auf consiliumos.io.
- SECURITY.md, CONTRIBUTING.md, Issue-Vorlagen (Fehler, Frage, Datenbefund), CODEOWNERS.
- README mit geprüftem Beispiel und Prüfschein, Abschnitt zu Datenschutz, englische Fassung.

### Behoben
- Datenschutz-Link im Plugin zeigt auf https://consiliumos.io/privacy.
- Installationsbefehl in der Plugin-README: `/plugin marketplace add …`, dann `/plugin install parliamentos@parliamentos-skills`.
- Kontingent des kostenlosen Kontos vollständig genannt: 100 Aufrufe und 20 Prüfscheine im Monat.

## [1.6.0] – 2026-11-11

### Hinzugefügt
- Erste Fassung: Plugin `parliamentos` mit Skill `belegen` (Beleg-Vertrag v4) und Connector zu ParliamentOS.
