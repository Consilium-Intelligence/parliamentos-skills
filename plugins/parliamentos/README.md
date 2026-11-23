# ParliamentOS

Belegte Antworten zu Bundestag, Landtagen, Nationalrat und EU-Parlament. Das Plugin verbindet Claude mit
ParliamentOS und bringt den Skill **belegen** mit: Jede Aussage über eine Rede, eine Abstimmung, eine Drucksache
oder einen Lobbykontakt trägt eine Beleg-Kennung, einen Link zur Beleg-Seite und einen zum Originaldokument.
Die fertige Antwort prüft das Werkzeug `pruefe_belege` gegen die amtlichen Zeilen und stellt einen signierten,
öffentlich lesbaren Prüfschein aus. Der Skill **rede-belegen** baut darauf auf: Er fragt für Reden, Bilanzen und
Dossiers alle Belegarten ab und schneidet eine Rede am gemessenen Sprechtempo des Redners zu. Der Skill
**eu-verfahren-belegen** führt durch ein EU-Gesetzgebungsverfahren und gibt jeder Station ihre Kennung, vom
Kommissionsdokument bis zur Zuleitung an den Bundestag.

Installieren (in Claude Code):

```
/plugin marketplace add Consilium-Intelligence/parliamentos-skills
/plugin install parliamentos@parliamentos-skills
```

Einrichten: Nach der Installation mit `/mcp` bei ParliamentOS anmelden. Ein kostenloses Konto mit 100 Aufrufen und 20 Prüfscheinen im Monat
gibt es unter https://consiliumos.io/mcp.

Version 1.8.1 · Lizenz MIT · Datenschutz: https://consiliumos.io/privacy
