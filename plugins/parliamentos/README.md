# ParliamentOS

Belegte Antworten zu Bundestag, Landtagen, Nationalrat und EU-Parlament. Das Plugin verbindet Claude mit
ParliamentOS und bringt den Skill **belegen** mit: Jede Aussage über eine Rede, eine Abstimmung, eine Drucksache
oder einen Lobbykontakt trägt eine Beleg-Kennung, einen Link zur Beleg-Seite und einen zum Originaldokument.
Die fertige Antwort prüft das Werkzeug `pruefe_belege` gegen die amtlichen Zeilen und stellt einen signierten,
öffentlich lesbaren Prüfschein aus.

Installieren (in Claude Code):

```
/plugin marketplace add Consilium-Intelligence/parliamentos-skills
/plugin install parliamentos@parliamentos-skills
```

Einrichten: Nach der Installation mit `/mcp` bei ParliamentOS anmelden. Ein kostenloses Konto mit 100 Aufrufen und 20 Prüfscheinen im Monat
gibt es unter https://consiliumos.io/mcp.

Version 1.6.0 · Lizenz MIT · Datenschutz: https://consiliumos.io/privacy
