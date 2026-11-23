---
name: eu-verfahren-belegen
version: 1.0.0
description: Belegt den Lebenslauf eines EU-Gesetzgebungsverfahrens mit amtlichen Zeilen aus ParliamentOS, Station für Station vom Kommissionsdokument über EWSA und AdR, Ausschuss, Abstimmung und angenommenen Text bis zur Zuleitung an den Bundestag, und prüft die fertige Antwort mit pruefe_belege. Use when a user asks how an EU regulation or directive came about, where an EU procedure stands, who voted how in the European Parliament, when the Bundestag received an EU proposal, or wants a verifiable timeline or dossier of an EU procedure.
---

# EU-Verfahren belegen mit ParliamentOS

Dieser Skill führt durch ein EU-Verfahren und gibt jeder Station ihre Beleg-Kennung. Er baut auf dem Skill `belegen`
auf: Dessen Regeln zu Format, Links und Prüfschein gelten hier unverändert.

Für Dokumente, die den Zitat-Validator durchlaufen, gilt:
jede Belegstelle maschinell gegen amtliche Zeilen geprüft, deterministisch, ohne Sprachmodell im Prüfpfad.
Der Prüfschein deckt die Belegstellen ab (Kennung und amtliche Zeile). Vollständigkeit und Wertung der Antwort
liegen bei der Autorin oder dem Autor.

## Ablauf

1. **Verfahren klären.** `get_eu_vorgang` mit dem Aktenzeichen aufrufen (`reference: "2022/0396(COD)"`), ohne
   Aktenzeichen mit `topic`. Liefert die Suche mehrere Verfahren, nennt die Antwort die Treffer und fragt, welches
   gemeint ist. Der Einzeltreffer trägt den Block „Stationen mit Beleg“.

2. **Stationen übernehmen.** Je Station mit Bestand ein Satz. Kennungen stehen unverändert am Ende der Aussage, die sie
   stützen:

   | Station | Kennung | Was die Zeile trägt |
   |---|---|---|
   | Kommissionsdokument | `eu-kom` | Datum der Annahme durch die Kommission |
   | EWSA und AdR | `eu-stn` | Datum, Berichterstatter, Wortlaut der Stellungnahme |
   | Ablauf im Parlament | `eu-verfahren` | Tage der Ereignisse, Verfahrensnummer |
   | Angenommene Texte | `eu-ta` | Datum, TA-Nummer, Wortlaut |
   | Hauptabstimmungen | `ep-abst` | Datum, Stimmenzahlen, Ergebnis |
   | Votum einzelner Abgeordneter | `ep-stimme` | Datum, Name, Fraktion, Votum |
   | Zuleitung an den Bundestag | `bt-vpos` | Datum der Zuleitung |
   | Erste Unterrichtung des Bundesrats | `bt-vpos` | Datum der Unterrichtung |
   | Weitere Schritte von Bundestag und Bundesrat | ohne Kennung | Datum und Art laut DIP, in der Antwort als ungeprüft kennzeichnen |
   | Treffen mit Interessenvertretern | `ep-treffen` | Datum, Abgeordnete, Organisationen |
   | Rechtsakt | `eu-rechtsakt` | Datum, CELEX, Rechtsaktnummer, Wortlaut |

3. **Vertiefen, wo die Frage es verlangt.**
   - Wortlaut einer Stellungnahme: `search_eu_ausschuss_stellungnahmen`
   - Wortlaut eines angenommenen Textes: `search_eu_angenommene_texte`
   - Positionen der Fraktionen: `get_eu_positionsmatrix`
   - Votum einzelner Abgeordneter: `get_mep_vote`
   - Treffen der Berichterstatter: `get_legislative_footprint`
   - Abstand zwischen Kommission und Bundestag: `get_bruessel_berlin_latenz`
   - Rechtsakt, Änderungen und Berichtigungen: `get_richtlinien_historie` mit CELEX oder Titel
   - Wortlaut für ein Zitat: `get_beleg` mit der Kennung

4. **Lücken benennen.** Eine Station ohne Zeile heißt in der Antwort „kein Bestand in ParliamentOS“; die Aussage zu
   dieser Station entfällt. Die Grenzen des Bestands gehören in die Antwort, wenn sie das Verfahren berühren:
   Abstimmungen des Parlaments liegen ab 07/2019 vor, Reden ab 09/2021. Der Rat der EU hat keinen Bestand in
   ParliamentOS. Der Rechtsakt eines Verfahrens erscheint in den Stationen, sobald die Verknüpfung Verfahren →
   Rechtsakt geladen ist; bis dahin führt `get_richtlinien_historie` über CELEX oder Titel zum Rechtsakt.

5. **Prüfen.** Die fertige Antwort mit `pruefe_belege` prüfen, bei „gesperrt“ die genannten Stellen korrigieren und
   einmal erneut prüfen. Die Fußzeile des Prüfscheins steht unverändert als letzte Zeile unter dem Text.

## Schreibregeln für die Stationen

- **Ein Datum vor seine Kennung.** Der Prüfer vergleicht ein Datum mit der Zeile der ersten Kennung, die danach steht.
  Nennt ein Satz zwei Stationen, steht jede Kennung direkt hinter ihrem Teil.
- **`eu-verfahren` trägt nur Ereignistage.** Jedes Datum vor dieser Kennung muss ein Ereignistag des Verfahrens sein;
  ein Tag aus einer anderen Quelle gehört hinter die Kennung dieser Quelle. Geprüft wird der Tag: Welches Ereignis an
  diesem Tag lag, übernimmt die Antwort wörtlich aus der Zeile von `get_eu_vorgang`.
- **Die Verfahrensnummer** (`2022/0396(COD)`) ist eine harte Angabe. Sie braucht im selben Absatz eine Kennung
  `eu-verfahren`, `ep-abst` oder `ep-stimme`, deren Zeile sie trägt.
- **Stimmenzahlen** stehen vor `ep-abst`, das Votum einer Person vor `ep-stimme`.
- **Links.** Der Block „Stationen mit Beleg“ nennt die Kennungen. Den Original-Link jeder Kennung liefert `get_beleg`;
  die Belegliste am Ende übernimmt ihn von dort, und eine Kennung ohne abgerufenen Link trägt nur die Beleg-Seite.
- **Wertungen** („früh“, „umstritten“, „knapp“) tragen keine Kennung und bleiben als Einordnung der Antwort erkennbar.

## Beispiel (Verpackungsverordnung, gemessen 17.11.2026)

> Die Kommission nahm den Vorschlag am 30.11.2022 an [[beleg:eu-kom:COM_2022_0677]]. Das Parlament überwies ihn am
> 13.03.2023 an den Ausschuss [[beleg:eu-verfahren:2022-0396]], der Ausschuss nahm seinen Bericht am 24.10.2023 an
> [[beleg:eu-verfahren:2022-0396]]. Das Verfahren 2022/0396(COD) wurde am 22.01.2025 im Amtsblatt veröffentlicht
> [[beleg:eu-verfahren:2022-0396]].
>
> Zuleitung an den Bundestag: kein Bestand in ParliamentOS.
>
> Belege:
> [[beleg:eu-kom:COM_2022_0677]] Beleg: https://consiliumos.io/beleg/eu-kom/COM_2022_0677, Original: Link aus get_beleg
> [[beleg:eu-verfahren:2022-0396]] Beleg: https://consiliumos.io/beleg/eu-verfahren/2022-0396, Original: Link aus get_beleg

Beim Aufruf von pruefe_belege das Feld regeln auf skill-eu-verfahren-belegen@1.0.0 setzen.
