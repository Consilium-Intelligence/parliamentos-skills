# Änderungen

Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [SemVer](https://semver.org/lang/de/).
Die Version des Plugins folgt der Version des Skills `belegen`.

## [1.6.6] – 2026-11-15

### Geändert
- Skill `belegen` 1.6.5 → 1.6.6: Beleg-Vertrag v10. Inhaltsdatum-Regel: Ein Termin im Fließtext („auf den
  1. Oktober 2027“), der wörtlich in der belegten Zeile steht, gilt als Inhalt der Quelle und wird nicht mit dem Datum
  der Rede oder Drucksache verglichen. Hinter „am“ und „vom“, an harten Angaben und in Tabellen wird weiter verglichen.
- Skill `rede-belegen` 1.1.0: Die Rede bekommt einen eigenen Prüfschein. Eine Prüffassung mit Kennung hinter jedem
  Zitat und jeder harten Angabe läuft durch `pruefe_belege`; Aussagen ohne Kennung werden umformuliert oder gestrichen.
  Die Sprechfassung ist die freigegebene Prüffassung ohne Kennungen. Ohne Prüfschein steht die Rede als
  „Entwurf, ungeprüft“ da.

## [1.6.5] – 2026-11-15

### Hinzugefügt
- Skill `rede-belegen`: Reden, Bilanzen und Dossiers mit Belegen. Klärt Redner und Redezeit, fragt alle Belegarten ab
  (Reden, Drucksachen und Vorgänge, namentliche Abstimmungen, Profil, Interessenverbindungen, Meldungen), prüft mit
  `pruefe_belege` und schneidet die Rede am gemessenen Sprechtempo zu.
- Wächter bei jedem Push und Pull Request: Plugin und Marktplatz (`claude plugin validate --strict`), Geheimnisse
  (eigene Muster und gitleaks über die ganze Historie), interne Spuren, Links auf consiliumos.io.
- SECURITY.md, CONTRIBUTING.md, Issue-Vorlagen (Fehler, Frage, Datenbefund), CODEOWNERS.
- README mit geprüftem Beispiel und Prüfschein, Abschnitt zu Datenschutz, englische Fassung.

### Geändert
- Skill `belegen` 1.6.0 → 1.6.5: Beleg-Vertrag v9 mit dreiundzwanzig Belegarten, darunter Latenz Brüssel–Berlin
  (`eu-kom`, `bt-vpos`, `kennzahl`) und EU-Rechtsakte (`eu-rechtsakt`); neue Regel 8 „Befund melden“ mit `melde_befund`.

### Behoben
- Datenschutz-Link im Plugin zeigt auf https://consiliumos.io/privacy.
- Installationsbefehl in der Plugin-README: `/plugin marketplace add …`, dann `/plugin install parliamentos@parliamentos-skills`.
- Kontingent des kostenlosen Kontos vollständig genannt: 100 Aufrufe und 20 Prüfscheine im Monat.

## [1.6.0] – 2026-11-11

### Hinzugefügt
- Erste Fassung: Plugin `parliamentos` mit Skill `belegen` (Beleg-Vertrag v4) und Connector zu ParliamentOS.
