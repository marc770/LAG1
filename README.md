# Demo version
Please browse to [https://marc770.github.io/](https://marc770.github.io/)

# High-level concept
* The app contains crisis plans (**scenarios**).
* The app uses public information/heartbeats about current power outages and internet loss + user input to figure out what scenario to activate
* From a single installation, the app can be quickly be shared offline (LAN or bluetooth[^bluetooth]) without the need of app store, play store or remote servers.
* The app distributes **missions** among the users.
* All mission actions are logged by the app.
* Users **synchronize** their logs by sharing JSON data through QR codes[^QR].
* Based on the logs, the app generates new missions until the scenario is completed.


[^bluetooth]:
    Bluetooth can be used for native apps but not PWAs.
[^QR]:
    As the minimal, robust strategy that users are familiar enough with to use in a stressful situation. Less minimal stragies are used if they are available during the crisis.

# Scenario examples

## 1. ÄLVSBYN, JANUARI 2024: NÄR BÅDE EL OCH TELEFONI DÖR

**Vad hände:**

* 4 januari 2024,
* -40°C
* Transformatorbrand → 4 000+ hushåll utan el
* Efter 4 timmar: Telias reservkraft slut → ingen mobiltäckning
* Krisledningen i kommunen: inget sätt att nå varandra
* Hemtjänstens trygghetslarm: döda
* Befolkningen: isolerad
* Bensinpumpar: fungerade inte (elavbrott)

**Varför det spelar roll:**

Post- och telestyrelsens regler: operatörer måste ha reservkraft i 4 timmar. Det räckte inte. När både el och telefoni dog samtidigt kollapsade kommunikationen helt.

**Citat från krisledningen:**

“Det tog tid att mobilisera sig när telefoni och annan kommunikation låg nere.”

**Källor:**

* Riksdagen, Interpellation 2023/24:360
* SVT Norrbotten, 4-5 januari 2024
* Älvsbyns kommun

## 2. STORMEN JOHANNES, DECEMBER 2025: TUSENTALS I DYGNSAVBROTT

**Vad hände:**

* 27 december 2025 (för en månad sedan)
* 40 000+ hushåll utan ström i Sverige
* 3 döda (träffade av fallande träd)
* VMA utlyst i flera län
* Vindbyar upp till 47 m/s
* Träd över vägar och elledningar
* 10 miljoner kubikmeter skog fälld

**Varför det spelar roll:**

Återkommande problem. Vinterstormar är inte undantag - de är regeln. Lagen säger 24 timmar max, men det händer ändå varje år.

**Konsekvens:**

Enligt ellagen får avbrott inte överstiga 24 timmar. Men 2024: 6 450 kunder drabbades. Ingen tydlig påföljd för företag som bryter mot regeln.

**Källor:**

* SMHI, december 2025
* SVT, december 2025
* Energimarknadsinspektionen (Ei)

# Developer info

To get started, first build the app with Docker.
```
docker build -t my-pwa .
```

Then run it.
```
docker run --rm -p 4173:4173 my-pwa
```

Finally, simply browse to [localhost:4173](http://localhost:4173/)

## Deploy the app
First run
```
npm run build
```

Then replace the docs in the github pages repo.
```
rm -rf ../marc770.github.io/docs/
cp docs/ /marc770.github.io/docs/
```

Finally, commit and push in that repo.
