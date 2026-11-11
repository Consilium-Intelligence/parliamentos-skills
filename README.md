# ParliamentOS-Skills

Der Skill **belegen** bringt einem Sprachmodell bei, Aussagen über Bundestag, Landtage, Nationalrat und
EU-Parlament mit amtlichen Zeilen zu belegen: Jede Aussage trägt eine Beleg-Kennung aus ParliamentOS, einen Link
zur Beleg-Seite und einen zum Originaldokument. Die fertige Antwort geht durch `pruefe_belege`. Der Prüfschein ist
signiert und öffentlich lesbar; er bestätigt, dass jedes Zitat und jede Angabe so in der amtlichen Zeile steht.

Version 1.6.0 · Lizenz MIT

## Installieren (Claude Code)

```
claude plugin marketplace add Consilium-Intelligence/parliamentos-skills
claude plugin install parliamentos@parliamentos-skills
```

Das Plugin enthält den Skill und den Connector zu ParliamentOS. Beim ersten Aufruf meldest du dich mit
`/mcp` an. Ein kostenloses Konto mit 100 Aufrufen im Monat gibt es unter https://consiliumos.io/mcp.

Ohne Claude Code: Der Connector bringt dieselben Regeln als Prompt `belegte_antwort` mit.

## Was im Plugin steckt

| Datei | Inhalt |
|---|---|
| `plugins/parliamentos/skills/belegen/SKILL.md` | Die Regeln: Gate, Ablauf, Zitierformat, Prüfschritt |
| `plugins/parliamentos/.mcp.json` | Connector zu ParliamentOS (https://slbysjtdcfwilupwqerr.supabase.co/functions/v1/parliamentos-mcp) |

## Datenschutz

Der Skill selbst verarbeitet keine Daten. ParliamentOS protokolliert Werkzeugaufrufe mit ihren Parametern
(Datenschutzerklärung, Abschnitt 5b: https://consiliumos.io/datenschutz). Ein Prüfschein speichert den Hash der
Antwort, die Kennungen und die Urteile; der Text der Antwort bleibt beim Nutzer.

## Mehr

- Beleg-Vertrag: https://consiliumos.io/beleg-vertrag
- Rückmeldungen: albrecht@consiliumos.io
