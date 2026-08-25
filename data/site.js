/* =============================================================================
   EINZIGE DATENQUELLE der Website ("Single Source of Truth").

   Hier — und NUR hier — werden geteilte Inhalte gepflegt: Kontaktdaten,
   Oeffnungszeiten, Team, News, Navigation. Die Seiten rendern diese Daten
   ueber js/render.js an allen Stellen automatisch (Header, Footer, Praxen-
   Karten, Team-Raster, Aktuelles, SEO-Strukturdaten).

   AENDERN GENUEGT HIER: z.B. eine Telefonnummer einmal anpassen -> wirkt in
   Footer (alle Seiten), Praxen-Seite, Kontakt-Seite und in den Suchmaschinen-
   Strukturdaten gleichzeitig.

   Reines Daten-Objekt, kein Build-Tool noetig. Von jedem Rechner editierbar.
   ========================================================================== */
window.PRAXIS = {
  name: "Hausarztcenter Albstadt",
  rechtsform: "Überörtliche Berufsausübungsgemeinschaft",
  // Gesellschafter der GbR (zwei) — erscheint im Footer und in den Strukturdaten.
  gesellschafter: ["Dr. med. F. Diebold", "Dr. med. C. Fuchs"],
  jahr: 2026,

  // Basis-URL der Seite, ohne Schraegstrich am Ende. Das ist die EINZIGE Stelle,
  // an der die Domain steht: canonical, og:url, og:image, sitemap.xml und
  // robots.txt werden daraus erzeugt — von workway/scripts/basis-url.sh.
  // Domainwechsel = diese eine Zeile aendern, Skript mit --schreiben laufen lassen.
  //
  // NICHT "aufraeumen": diese Meta-Angaben stehen bewusst STATISCH im HTML jeder
  // Seite und werden NICHT von render.js gesetzt. Social-Scanner (WhatsApp,
  // Facebook, LinkedIn, Signal) fuehren kein JavaScript aus — per JS gesetzte
  // og:-Tags waeren fuer sie unsichtbar und die Link-Vorschau bliebe leer. Und ein
  // per JS gesetztes canonical ist fuer Suchmaschinen ausdruecklich schwaecher als
  // ein statisches. Die Wiederholung im HTML ist hier der richtige Preis;
  // zusammengehalten wird sie vom Skript, nicht vom Browser.
  basisUrl: "https://www.hausarztcenter-albstadt.de",

  // Online-Terminvergabe (samedi). Der Slug ist eine samedi-vergebene Konto-
  // Kennung — nicht aendern, sonst bricht der Buchungslink.
  samediUrl: "https://termin.samedi.de/b/berufsausubungsgemeinschaft-gbr-dr-med-diebold-dr-med-schmid-c-fuchs/1",

  // Externe Einbindungen. med321 = Online-Rezeption (321 MED GmbH); der Pfad
  // enthaelt den Praxis-Account-Key (aus der Altseite uebernommen). Beide
  // Scripts laedt js/consent.js — erst NACH Einwilligung (Entscheidung
  // Christian 2026-07-28; vorher ohne Gate, s. § 25 Abs. 1 TDDDG).
  integrationen: {
    med321: [
      "https://321med7.com/cdn/server/921f15363c0fd134cbcd3e3f91e173b1021d8c2d/321med.js",
      "https://321med-cdn.com/321med.js"
    ]
  },

  // Hauptnavigation (Reihenfolge = Anzeige-Reihenfolge).
  nav: [
    { href: "index.html",               text: "Home" },
    { href: "aktuell.html",             text: "Aktuell" },
    { href: "praxen.html",              text: "Praxen" },
    { href: "aerzte-team.html",         text: "Ärzte &amp; Team" },
    { href: "behandlungsspektrum.html", text: "Behandlungsspektrum" },
    { href: "stellenangebote.html",     text: "Stellenangebote" },
    { href: "service-kontakt.html",     text: "Service &amp; Kontakt" }
  ],

  // Rechtliches im Footer.
  rechtsLinks: [
    { href: "impressum.html",       text: "Impressum" },
    { href: "datenschutz.html",     text: "Datenschutz" },
    { href: "barrierefreiheit.html", text: "Barrierefreiheit" }
  ],

  // Standorte. zeiten: pro Tag vormittag/nachmittag; null = geschlossen.
  standorte: [
    {
      id: "ebingen",
      name: "Albstadt-Ebingen",
      // foto: null -> Bild-Platzhalter wird angezeigt (Praxen-Seite). Sobald ein
      // Foto vorliegt, hier den Pfad eintragen, z.B. "bilder/praxis-ebingen.jpg".
      foto: "bilder/praxis-ebingen.jpg",
      strasse: "Europaplatz 3",
      plz: "72458",
      ort: "Albstadt",
      tel: "07431 933420",
      telLink: "+497431933420",
      fax: "07431 9334220",
      badge: "aktuell Notfall- und Terminsprechstunde",
      barrierefrei: true,
      zeiten: [
        { tag: "Mo", vormittag: "08:00–11:00", nachmittag: "15:00–18:00" },
        { tag: "Di", vormittag: "08:00–11:00", nachmittag: "15:00–18:00" },
        { tag: "Mi", vormittag: "08:00–11:00", nachmittag: "15:00–18:00" },
        { tag: "Do", vormittag: "08:00–11:00", nachmittag: "15:00–18:00" },
        { tag: "Fr", vormittag: "08:00–11:00", nachmittag: null }
      ],
      schliessungen: ["04.05.–08.05.2026", "16.11.–20.11.2026"]
    },
    {
      id: "tailfingen",
      name: "Albstadt-Tailfingen",
      foto: "bilder/praxis-tailfingen.jpg",
      strasse: "Adlerstraße 24",
      plz: "72461",
      ort: "Albstadt",
      tel: "07432 2009150",
      telLink: "+4974322009150",
      fax: "07432 20091516",
      badge: "aktuell nur Terminsprechstunde",
      barrierefrei: false,
      zeiten: [
        { tag: "Mo", vormittag: "08:00–11:00", nachmittag: "15:00–18:00" },
        { tag: "Di", vormittag: "08:00–11:00", nachmittag: null },
        { tag: "Mi", vormittag: "08:00–11:00", nachmittag: null },
        { tag: "Do", vormittag: "08:00–11:00", nachmittag: null },
        { tag: "Fr", vormittag: "08:00–11:00", nachmittag: null }
      ],
      schliessungen: ["30.03.–24.04.2026", "04.05.–08.05.2026", "15.05.2026", "01.06.–05.06.2026", "03.08.–25.09.2026", "26.10.–06.11.2026", "16.11.–20.11.2026", "21.12.–31.12.2026"]
    }
  ],

  // Team. foto: null -> Platzhalter wird angezeigt; sobald ein Foto vorliegt,
  // hier den Pfad eintragen (z.B. "bilder/team/diebold.jpg") — der Platzhalter
  // und der "Fotos folgen"-Hinweis verschwinden dann automatisch.
  // fokus (optional): steuert den runden Bildausschnitt, wenn "mittig" den Kopf
  // abschneidet — z.B. "top" (Kopf oben halten) oder "50% 20%". Weglassen = mittig.
  team: [
    { name: "Dr. Diebold",       rolle: "Facharzt für Innere- und Allgemeinmedizin · Facharzt für Anästhesie · Notfallmedizin", foto: "bilder/team/diebold.jpg" },
    { name: "Dr. Fuchs",         rolle: "Facharzt für Allgemeinmedizin · Notfallmedizin", foto: "bilder/team/fuchs.jpg", fokus: "50% 35%" },
    { name: "R. Prager",         rolle: "Fachärztin für Innere Medizin", foto: "bilder/team/prager.jpg" },
    { name: "Dr. Muschelknautz", rolle: "Facharzt für Allgemeinmedizin", foto: "bilder/team/muschelknautz.jpg" },
    { name: "B. Butz",           rolle: "Facharzt für Allgemeinmedizin · Facharzt für Visceralchirurgie", foto: "bilder/team/butz.jpg" },
    { name: "R. Petrescu",       rolle: "Allgemeinmedizin (in Weiterbildung)", foto: "bilder/team/petrescu.jpg", fokus: "top" },
    { name: "Dr. Friz",          rolle: "Allgemeinmedizin (in Weiterbildung)", foto: "bilder/team/friz.jpg" },
    { name: "U. Schechtel",      rolle: "Primary Care Managerin (PCM)", foto: "bilder/team/schechtel.jpg" }
  ],

  // Praxisteam (MFAs, Verwaltung, Auszubildende). Gleiche Felder wie oben, wird
  // aber als Portraet-Kachel im Hochformat dargestellt — die Fotos sind als
  // Serie in 3:4 entstanden, ein runder Ausschnitt wuerde die Koepfe zu klein
  // machen. fokus (optional) verschiebt den Ausschnitt, z.B. "50% 30%".
  //
  // neueZeile: true -> die Kachel beginnt eine neue Rasterzeile. Damit steht die
  // Verwaltung nicht zwischen den MFAs, sondern klar abgesetzt darunter.
  //
  // >>> NOCH ZU ERGAENZEN (Christian): Die Nachnamen stammen aus den
  //     Dateinamen der Fotos, die Funktionen sind einheitliche Platzhalter.
  //     Hier die tatsaechliche Funktion je Person eintragen (z.B. "Ausbildung",
  //     "VERAH", "NaePA", "Labor", "Empfang", "Abrechnung").
  //     Namen: bewusst NUR Anrede + Nachname, keine Vornamen (Christian 2026-07-28).
  //     Reihenfolge = Anzeigereihenfolge; aktuell alphabetisch, Verwaltung zuletzt.
  praxisteam: [
    { name: "Fr. Altinok",      rolle: "Medizinische Fachangestellte", foto: "bilder/team/altinok.jpg" },
    { name: "Fr. Bartsch",      rolle: "Medizinische Fachangestellte", foto: "bilder/team/bartsch.jpg" },
    { name: "Fr. Brütsch",      rolle: "Medizinische Fachangestellte", foto: "bilder/team/bruetsch.jpg" },
    { name: "Fr. Corigliano",   rolle: "Medizinische Fachangestellte", foto: "bilder/team/corigliano.jpg" },
    { name: "Fr. Di Valentino", rolle: "Medizinische Fachangestellte", foto: "bilder/team/di-valentino.jpg" },
    { name: "Fr. Lebherz",      rolle: "Medizinische Fachangestellte", foto: "bilder/team/lebherz.jpg" },
    { name: "Fr. Papadopolou",  rolle: "Medizinische Fachangestellte", foto: "bilder/team/papadopolou.jpg" },
    { name: "Fr. Podstawska",   rolle: "Medizinische Fachangestellte", foto: "bilder/team/podstavska.jpg" },
    { name: "Fr. Schillmann",   rolle: "Medizinische Fachangestellte", foto: "bilder/team/schillmann.jpg" },
    { name: "Fr. Stelzig",      rolle: "Medizinische Fachangestellte", foto: "bilder/team/stelzig.jpg" },
    { name: "Fr. Stiefel",      rolle: "Medizinische Fachangestellte", foto: "bilder/team/stiefel.jpg" },
    { name: "Fr. Uka",          rolle: "Medizinische Fachangestellte", foto: "bilder/team/uka.jpg" },
    { name: "Fr. Yildiz",       rolle: "Medizinische Fachangestellte", foto: "bilder/team/yildiz.jpg" },
    { name: "Hr. Warth",        rolle: "Verwaltung",                   foto: "bilder/team/warth.jpg", neueZeile: true }
  ],

  // Social-Media-Profile der Praxis. NUR verlinkt, nichts eingebettet — es wird
  // also kein Inhalt von Meta nachgeladen und es braucht keinen Consent-Schalter.
  // Facebook hat der Seite nie einen Kurznamen zugewiesen, deshalb die numerische
  // Seiten-ID; sobald in den Facebook-Seiteneinstellungen ein Benutzername
  // vergeben ist, kann hier die schoenere Adresse rein.
  social: {
    facebook: "https://www.facebook.com/100091815146101/",
    instagram: "https://www.instagram.com/hausarztcenter_albstadt/"
  },

  // Aktuelles / News. Leeres Array -> "keine Mitteilungen" (Aktuell-Seite) und
  // kein Hinweis-Teaser auf der Startseite. Neuer Eintrag oben einfuegen:
  //   { datum: "2026-07-01", titel: "...", text: "...", link: null,
  //     bild: "bilder/news/DATEI.jpg", bildAlt: "Beschreibung fuers Vorlesen" }
  // datum im Format JJJJ-MM-TT (wird fuer die Anzeige aufbereitet).
  // Hinweis: "text" wird auch als Teaser auf der Startseite ausgegeben —
  // deshalb bewusst kurz halten (ein Absatz).
  // bild/bildAlt sind optional: ohne bild bleibt die Kachel einspaltig wie bisher.
  // Bilder nach bilder/news/ legen, benannt nach Datum + Thema, und vorher als
  // JPG speichern (nicht als PNG aus dem Grafikprogramm — das ist um ein
  // Vielfaches groesser und laedt auf dem Handy spuerbar langsamer).
  news: [
    {
      datum: "2026-07-28",
      titel: "Unsere neue Internetseite — und ab jetzt auch bei Facebook und Instagram",
      bild: "bilder/news/2026-07-28-neue-website-instagram.jpg",
      bildAlt: "Außenansicht des Hausarztcenter Albstadt am Europaplatz mit dem Hinweis " +
               "„Wir sind jetzt auch auf Instagram“",
      text: "Unsere Internetseite ist neu: übersichtlicher, schneller und gut lesbar auch auf dem Handy — " +
            "mit Sprechzeiten, Behandlungsspektrum und Online-Terminvergabe für beide Praxen. " +
            "Neu ist außerdem: Sie finden uns jetzt auch bei " +
            "<a href=\"https://www.facebook.com/100091815146101/\" target=\"_blank\" rel=\"noopener\">Facebook</a> und " +
            "<a href=\"https://www.instagram.com/hausarztcenter_albstadt/\" target=\"_blank\" rel=\"noopener\">Instagram</a>. " +
            "Dort informieren wir Sie künftig kurzfristig über geänderte Sprechzeiten, Vertretungen und " +
            "Neuigkeiten aus der Praxis.",
      link: null
    }
  ]
};
