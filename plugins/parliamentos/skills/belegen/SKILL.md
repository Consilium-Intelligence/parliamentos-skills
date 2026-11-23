---
name: belegen
version: 1.8.1
description: Belegt Aussagen zu Bundestag, Landtagen, Nationalrat und EU-Parlament mit amtlichen Zeilen aus ParliamentOS (Beleg-Kennung, Beleg-Seite, Original) und prüft die fertige Antwort mit pruefe_belege. Use when a user asks what a parliament, faction, MP or MEP said, voted, tabled or lobbied, asks for quotes or sources on German, Austrian or EU politics, or wants a text with verifiable citations.
---

# Belegen mit ParliamentOS

Der Connector liefert die Zeile, dieser Skill die Disziplin, der Validator den Beweis. Dieselben Regeln kommen als
MCP-Prompt `belegte_antwort` mit jeder Verbindung zu ParliamentOS.

<!-- KERN-ANFANG -->
Regeln für belegte Antworten mit ParliamentOS (Beleg-Vertrag v23)

1. Das Gate: Jede Aussage über eine Rede, eine Abstimmung, eine Drucksache, einen Lobbykontakt oder ein Treffen trägt eine Beleg-Kennung aus einer Antwort von ParliamentOS. Fehlt der Connector, steht am Anfang der Antwort: „ParliamentOS ist nicht verbunden. Verbinden: https://consiliumos.io/mcp“. Dann trägt jede Aussage aus dem Gedächtnis den Vermerk „(ungeprüft)“.

2. Ablauf: Erst suchen (search oder das passende Fachwerkzeug), dann schreiben. Für ein wörtliches Zitat den Wortlaut mit get_beleg nachlesen. Danach die fertige Antwort mit pruefe_belege prüfen und erst dann ausgeben.

3. Format: Kennungen unverändert aus der Werkzeugantwort übernehmen. Jede Kennung steht direkt am Ende der Aussage, die sie stützt, und jeder Absatz mit Zahlen, Daten, Namen oder Zitaten trägt seine eigenen Kennungen. Das gilt auch für Einleitung und Zusammenfassung: Die Antwort beginnt mit einem belegten Satz, und jeder Überblickssatz trägt die Kennung des Treffers, auf dem er beruht. Einen Satz ohne passenden Treffer streicht die Antwort. Eine Zwischenüberschrift steht ohne Leerzeile direkt über ihrem Absatz, weil der Prüfer durch Leerzeilen getrennte Teile als eigene Absätze liest. Hinweise auf Grenzen der Antwort kommen ohne Namen, Zahlen und Daten aus, weil jeder Absatz mit solchen Angaben eine Kennung braucht. Wörtliche Zitate stehen in Anführungszeichen direkt vor ihrer Kennung, mit Attribution in Klammern:
„Wörtlicher Satz aus der Rede“ (Nachname, 10.06.2026) [[beleg:bt-rede:ID]]
Eine Sachaussage trägt die Kennung am Satzende:
Die Koalition legte den Gesetzentwurf am 03.06.2025 vor [[beleg:ds:ID]].
Eine Angabe gehört zur ersten Kennung, die nach ihr steht, und wird nur gegen deren Zeile geprüft. Stützen zwei Kennungen einen Satz, steht jede direkt hinter ihrem Teil:
Die Grünen legten 21/222 am 20.05.2025 vor [[beleg:ds:ID]], der Bundestag lehnte ihn am 26.06.2025 ab [[beleg:bt-vorgang:ID]].
Nach ]] folgt ein Leerzeichen oder ein Satzzeichen, nie direkt eine öffnende Klammer, weil Markdown „]](“ als Link liest. Die Links stehen gesammelt am Ende der Antwort, je Kennung eine Zeile, die mit der Kennung beginnt:
[[beleg:bt-rede:ID]] Beleg: https://consiliumos.io/beleg/bt-rede/ID, Original: Link aus der Werkzeugantwort

4. Zwei Kennungsarten: [[beleg:quelle:schlüssel]] gehört zum Prüfregister mit dreißig Belegarten und wird von pruefe_belege gegen ihre Zeile geprüft. Den Beschluss des Bundestags über eine Vorlage und ihre Verkündung belegt die Kennung [[beleg:bt-vorgang:…]], die search_drucksachen und get_beleg je Drucksache nennen. Die Kennung ds trägt Nummer und Vorlagedatum der Drucksache, bt-vorgang trägt Beschlussdatum, Ergebnis, Verkündungsdatum und die Drucksachennummern des Beschlusses. Wie die Fraktionen in einer namentlichen Abstimmung gestimmt haben, belegt die Kennung [[beleg:bt-abst:…]] aus search_bundestag_abstimmungen: Der Prüfer vergleicht jedes Fraktionsvotum mit der Zählung je Fraktion dieser Zeile; ein Fraktionsvotum vor einer anderen Kennung und ein Votum der Koalition oder Opposition sperren den Prüfschein. Die Fundstelle im Bundesgesetzblatt gleicht der Prüfer nicht ab. Die Latenz Brüssel–Berlin belegt get_bruessel_berlin_latenz je Fall mit zwei Kennungen: eu-kom trägt das Datum der Annahme durch die Kommission, bt-vpos das Datum der Zuleitung an den Bundestag; jedes Datum steht direkt vor seiner Kennung. Dass beide Kennungen zur selben Vorlage gehören, prüft der Prüfer nicht. Anzahl, Median, Quartile und Spanne der Latenz tragen die Kennung kennzahl: Sie steht für die festgeschriebene Liste der Vorlagen, aus der der Prüfer die Zahlen nachrechnet; die Zahlen stehen direkt vor ihrer Kennung. Die Zahl der Vorgänge im Landtag Brandenburg zu einem Ort, je Typ und zusammen, trägt in search_bb_landtag_vorgaenge ebenfalls die Kennung kennzahl: Die Antwort nennt jede Zahl mit ihrem Nomen direkt vor ihrer Kennung (8 Anfragen [[beleg:kennzahl:…]]), addiert keine Typen und nennt den Zeitraum erst hinter der letzten Kennung des Absatzes; ein Datum davor sperrt. Einen EU-Rechtsakt belegt die Kennung [[beleg:eu-rechtsakt:CELEX]] aus get_richtlinien_historie: Sie trägt Datum, CELEX und Rechtsaktnummer (Verordnung (EU) 2025/40 gehört zu 32025R0040) und, wo der Volltext vorliegt, den Wortlaut. IFG-Dokumente des Landes Salzburg belegt die Kennung [[beleg:sbg-ifg:…]] aus search_sbg_ifg_dokumente; aus Dokumenten mit dem Vermerk Texterkennung zitiert die Antwort nicht wörtlich, und ein Muster benennt sie als Muster. Das Landesbudget Salzburg belegen die Kennungen [[beleg:sbg-budget:…]] (Position) und [[beleg:sbg-budget-summe:…]] (aus den Positionen nachgerechnete Summe) aus get_sbg_landesbudget. Ein Betrag nennt die Währung (10.000 €, 4,18 Mrd. €), sonst ist er unlesbar und sperrt. Der Prüfer rundet den Wert der Zeile kaufmännisch auf die letzte angegebene Stelle in der angegebenen Einheit (€, Tsd. €, Mio. €, Mrd. €); Wörter wie „rund“ oder „etwa“ ändern daran nichts. Das Jahr steht vor der Kennung und entspricht ihrem Jahr. Ein Betrag aus dem Voranschlag ist geplant oder veranschlagt, ausgegeben und eingenommen sind Beträge aus dem Rechnungsabschluss; eine Verwechslung sperrt. An sbg-budget prüft der Prüfer kein Datum: Ein Beschlussdatum steht vor seiner eigenen Kennung. Prozentangaben und Veränderungen gegenüber dem Vorjahr sind nicht prüfbar. Vorsichtig sperren im Satz einer Budget-Kennung auch eine Zahl mit Einheit ohne Währung (0,56 Mio. Einwohner) und eine Aktenzahl mit Schrägstrich-Jahr (Zl. 2024/12). Ressortnamen gibt die Antwort als Ressortbezeichnung laut Datei wieder. Kennungen org-dok sind eigene Quellen der Organisation; sie zählen nicht als amtlich. Kennungen der Form quelle:schlüssel ohne Klammern führen zur Zeile und zum Original; die Prüfung umfasst sie heute noch nicht. Das sagt die Antwort dem Leser in einem Satz, wenn sie solche Kennungen enthält.

5. Prüfen mit pruefe_belege: Vorher jeden Absatz durchgehen. Nennt er einen Namen, eine Partei, eine Zahl, ein Datum oder ein Zitat, trägt er eine Kennung; sonst Kennung ergänzen oder Absatz streichen. Harte Angaben sind Drucksachennummern (21/322), Stimmenzahlen (578 : 39 : 15), Beträge in Euro, EU-Kennungen (CELEX, TA-Nummer, A-Referenz, Verfahrensnummer, im Absatz einer Kennung eu-rechtsakt auch die Rechtsaktnummer wie 2019/904), Attributionen in Klammern (Nachname, 05.06.2025) und wörtliche Zitate in Anführungszeichen. Jede harte Angabe braucht im selben Absatz eine Kennung, deren Zeile sie trägt; sonst sperrt der Prüfschein. Nummern von Plenarprotokollen zählen nicht als Angabe. Dann die ganze fertige Antwort übergeben, genau so, wie der Leser sie sieht.
- Ergebnis gesperrt: der Handlungszeile aus der Antwort folgen; die Wörter „geprüft“ und „verifiziert“ stehen dann nirgends im Text.
- Urteil abweichend: die Stelle mit get_beleg nachlesen, korrigieren und einmal erneut prüfen. Höchstens zwei Prüfläufe je Antwort.
- Urteil nicht_pruefbar mit Grund ohne_beleg_id: der genannten Angabe die Kennung ihres Treffers anhängen oder den Satz streichen, dann erneut prüfen.
- Urteil nicht_gefunden oder anderes nicht_pruefbar: die Stelle streichen oder mit „(ungeprüft)“ kennzeichnen.
- Die Fußzeile aus der Antwort von pruefe_belege steht unverändert als letzte Zeile unter dem Text.
- Den Satz zur maschinellen Prüfung schreibt die Antwort ausschließlich über die Fußzeile eines Prüfscheins mit Ergebnis freigegeben. Das Wort „geprüft“ steht nur dort, wo ein Prüfschein es trägt.
- Jeder Aufruf von pruefe_belege stellt einen Prüfschein aus. Kostenlose Konten haben 20 Prüfscheine im Kalendermonat, die Antwort nennt den Stand.
- Ist pruefe_belege nicht verfügbar oder das Kontingent aufgebraucht, lautet die letzte Zeile: „n Belegstellen aus ParliamentOS. Prüfung: ungeprüft.“

6. Grenzen: Der Bestand steht unter https://consiliumos.io/quellen. Reden des EU-Parlaments liegen ab 09/2021 vor, Abstimmungen ab 07/2019, Landtagsreden je nach Land bis 2022 oder 2023. Findet kein Werkzeug einen Treffer, schreibt die Antwort „kein Bestand in ParliamentOS“ und lässt die Aussage ohne Kennung weg. Ein Stand-Datum nennt die Antwort nur, wo get_beleg es geliefert hat.

7. Datenschutz: ParliamentOS protokolliert Werkzeugaufrufe mit ihren Parametern (Datenschutzerklärung, Abschnitt 5b). Suchbegriffe enthalten nur, was die Frage braucht, und keine personenbezogenen Daten Dritter darüber hinaus.

8. Befund melden: Ist das Werkzeug melde_befund verfügbar, meldet die KI damit, was an Daten oder Werkzeugen auffällt: Die Zeile aus get_beleg weicht vom Original ab, ein Treffer kommt ohne Kennung, im Bestand fehlt, was das Original innerhalb der Bestandsgrenze führt, oder eine Werkzeugbeschreibung verspricht etwas anderes als das Ergebnis. Die Meldung besteht aus festen Feldern: Art, Kennung oder Werkzeug, bei einer Abweichung das Merkmal mit dem Wert der Zeile und dem Wert des Originals, sonst eine Auswahl aus der Liste der Art. Die Frage des Nutzers und Angaben über Personen außerhalb der amtlichen Zeile gehören nie hinein. Je Befund eine Meldung; sie zählt nicht im Monatskontingent.
<!-- KERN-ENDE -->

Beim Aufruf von pruefe_belege das Feld regeln auf skill-belegen@1.8.1 setzen.

## Beispielantwort (verkürzt)

> Bundesjustizministerin Hubig brachte den Gesetzentwurf zur Verlängerung der Mietpreisbremse am 05.06.2025 in
> erster Lesung ein: „Ich möchte mich ganz herzlich bei den Regierungsfraktionen bedanken, dass das so schnell
> gegangen ist“ (Hubig, 05.06.2025) [[beleg:bt-rede:dip_bt_21_10_ID211000200]]
>
> Belege:
> [[beleg:bt-rede:dip_bt_21_10_ID211000200]] Beleg: https://consiliumos.io/beleg/bt-rede/dip_bt_21_10_ID211000200,
> Original: https://dserver.bundestag.de/btp/21/21010.pdf
>
> 1 Belegstelle aus ParliamentOS, jede Belegstelle maschinell gegen amtliche Zeilen geprüft, deterministisch, ohne
> Sprachmodell im Prüfpfad. Prüfschein: https://consiliumos.io/pruefschein/…

Die letzte Zeile stammt wörtlich aus der Antwort von `pruefe_belege` und steht nur bei Ergebnis `freigegeben`.
Bei `gesperrt` lautet sie „Prüfung: n von m Belegstellen verifiziert. Prüfschein: …“; wird eine Kennung mehrfach geprüft (Fließtext und Quellenliste), nennt die Fußzeile zusätzlich die Zahl der Kennungen.

## Beispiel Landesbudget Salzburg (verkürzt)

> Für Dolmetschergebühren des Landtags sind 2025 10.000 € veranschlagt [[beleg:sbg-budget:VA-2025-EH-00001-6410001]]
>
> Das Land plant 2025 rund 4,2 Mrd. € Aufwendungen [[beleg:sbg-budget-summe:VA-2025-EH-gesamt-aufw]]

Beide Beträge stammen aus dem Voranschlag und heißen darum geplant oder veranschlagt. Das Jahr steht vor der
Kennung, der Betrag nennt die Währung. „rund 4,2 Mrd. €“ besteht, weil die nachgerechnete Summe (4.183.537.400,00 €)
auf eine Nachkommastelle in Milliarden gerundet 4,2 ergibt. 11.000 € oder „gab 2025 10.000 € aus“ sperren den
Prüfschein. Zahlen aus dem Rechnungsabschluss heißen ausgegeben oder eingenommen. Anteile in Prozent und Vergleiche
mit dem Vorjahr rechnet der Prüfer nicht nach; im Absatz einer Budget-Kennung sperren sie den Prüfschein.

## Was der Prüfschein bedeutet

Der Prüfschein bestätigt, dass jedes Zitat und jede Angabe so in der amtlichen Zeile steht. Er ist signiert
(Ed25519), in der Hash-Kette `normos-zitat-validator` verankert und öffentlich unter seinem Link lesbar. Gespeichert
werden nur der Hash der Antwort, die Kennungen und die Urteile. Die inhaltliche Richtigkeit einer Rede bewertet er
ausdrücklich nicht.
