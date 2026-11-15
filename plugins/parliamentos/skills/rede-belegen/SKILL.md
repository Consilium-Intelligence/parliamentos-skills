---
name: rede-belegen
version: 1.0.0
description: Schreibt Reden, Bilanzen und Dossiers zu Abgeordneten, Ministerinnen und Ministern mit Belegen aus ParliamentOS. Fragt alle Belegarten ab, schneidet die Rede am gemessenen Sprechtempo zu und prüft die Belege mit pruefe_belege. Use when a user wants a speech, a record, a dossier or a compilation of what a German, Austrian or EU politician said, voted or tabled on a topic.
---

# Rede mit Belegen

Fünf Schritte, in dieser Reihenfolge. Format und Prüfregeln für jede Kennung stehen im Skill `belegen`.

## 1. Auftrag klären, vor der ersten Suche

Offene Punkte als Auswahl zum Anklicken fragen, mit Empfehlung an erster Stelle:

- **Redner:** Wer hält die Rede? Davon hängen Tempo und Länge ab.
- **Redezeit:** Wie viele Minuten?
- **Quellenrahmen:** Standard ist ausschließlich ParliamentOS. Weitere Quellen nur nach ausdrücklicher Freigabe, dann
  getrennt gekennzeichnet.
- **Maßstab:** Woran wird gemessen, etwa ein Gesetz, eine Vorlage oder ein Versprechen?

## 2. Alle Belegarten abfragen

Jede Zeile bekommt ein Ergebnis: Treffer mit Kennung oder „kein Bestand in ParliamentOS“.

| Belegart | Werkzeug | Worauf achten |
|---|---|---|
| Reden der Zielperson | `search_speeches` mit `speaker` und je Aufruf einem Suchwort, danach `get_beleg` für den Volltext | Mehrere Wörter in einem Aufruf müssen alle vorkommen; Oberbegriff und Fachbegriffe einzeln suchen |
| Drucksachen und Vorgänge | `search_drucksachen`, danach `get_beleg` für `ds` und `bt-vorgang` | Gesetzentwurf, Beschlussempfehlung, Änderungen im Ausschuss, abgelehnte Anträge |
| Debatte | `search_speeches` mit `query` und `wahlperiode` | Kritik und Gegenrede aus der Schlussberatung |
| Namentliche Abstimmungen | `search_bundestag_abstimmungen` mit `thema`, `get_mdb_vote` mit `topic` | Ohne namentliche Abstimmung ist das persönliche Votum nicht belegbar; das so sagen |
| Profil | `get_mdb_profile` für Zielperson und Redner | Sprechtempo und Redelänge-Kalibrierung des Redners |
| Interessenverbindungen | `get_lobby_network` mit `mdb_name` | Leer heißt: keine veröffentlichungspflichtige Angabe erfasst |
| Meldungen | `get_news` mit `topic` und `days` | Termine, Kurzmeldungen, Drucksacheneingänge |
| EU-Bezug | `search_eu_speeches`, `get_mep_vote`, `get_eu_vorgang` | Wenn das Thema EU-Recht berührt |

Fairness gehört zur Belegpflicht: Die Begründung der Zielperson aus demselben Volltext mitnehmen. Aussagen anderer
Redner tragen deren Namen.

## 3. Belege prüfen

Die Belegliste nach Skill `belegen` schreiben und mit `pruefe_belege` prüfen. Stichtage aus dem Inhalt einer Drucksache
mit Monat und Jahr nennen, wenn im selben Absatz die Kennung `ds` steht: Der Prüfer vergleicht jedes Tagesdatum im
Absatz mit dem Vorlagedatum.

## 4. Rede schreiben und zuschneiden

- Zielwortzahl = Sprechtempo des Redners × Minuten × 0,95. Der Rest ist Puffer für Beifall und Zwischenrufe.
- Ohne Profil des Redners: ein Tempo als Annahme wählen und in der Antwort nennen.
- Wörter zählen lassen, etwa mit `wc -w`. Die Antwort nennt Wortzahl und Dauer.
- Jedes Zitat der Rede steht wörtlich in einem Beleg aus Schritt 3.
- Vorwürfe genau fassen: Belege zeigen Haltung, Verschiebung oder Unterlassung. Einen Rechtsverstoß belegt nur eine
  Entscheidung eines Gerichts oder einer Behörde.

## 5. Ausgabe

1. Belegliste mit der Fußzeile des Prüfscheins
2. Links je Kennung: Beleg-Seite und Original
3. Grenzen: abgefragte Belegarten ohne Treffer, Annahmen
4. Rede mit Wortzahl und Dauer
