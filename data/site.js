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

  // Online-Terminvergabe (samedi). Der Slug ist eine samedi-vergebene Konto-
  // Kennung — nicht aendern, sonst bricht der Buchungslink.
  samediUrl: "https://termin.samedi.de/b/berufsausubungsgemeinschaft-gbr-dr-med-diebold-dr-med-schmid-c-fuchs/1",

  // Externe Einbindungen. med321 = Online-Rezeption (321 MED GmbH); der Pfad
  // enthaelt den Praxis-Account-Key (aus der Altseite uebernommen). Beide
  // Scripts werden von js/render.js auf jeder Seite geladen (ohne Consent-
  // Gate — Entscheidung Christian 2026-07-07, Paritaet zur Altseite).
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
      foto: null,
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
      foto: null,   // Pfad eintragen, sobald ein Foto vorliegt (z.B. "bilder/praxis-tailfingen.jpg")
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
      schliessungen: ["30.03.–24.04.2026", "04.05.–08.05.2026", "15.05.2026", "01.06.–05.06.2026"]
    }
  ],

  // Team. foto: null -> Platzhalter wird angezeigt; sobald ein Foto vorliegt,
  // hier den Pfad eintragen (z.B. "bilder/team/diebold.jpg") — der Platzhalter
  // und der "Fotos folgen"-Hinweis verschwinden dann automatisch.
  team: [
    { name: "Dr. Diebold",       rolle: "Facharzt für Innere- und Allgemeinmedizin · Facharzt für Anästhesie · Notfallmedizin", foto: null },
    { name: "Dr. Fuchs",         rolle: "Facharzt für Allgemeinmedizin · Notfallmedizin", foto: null },
    { name: "R. Prager",         rolle: "Fachärztin für Innere Medizin", foto: null },
    { name: "Dr. Muschelknautz", rolle: "Facharzt für Allgemeinmedizin", foto: null },
    { name: "B. Butz",           rolle: "Facharzt für Visceralchirurgie / Allgemeinmedizin (in Weiterbildung)", foto: null },
    { name: "R. Petrescu",       rolle: "Allgemeinmedizin (in Weiterbildung)", foto: null },
    { name: "Dr. Friz",          rolle: "Allgemeinmedizin (in Weiterbildung)", foto: null },
    { name: "U. Schechtel",      rolle: "Primary Care Managerin (PCM)", foto: null }
  ],

  // Aktuelles / News. Leeres Array -> "keine Mitteilungen" (Aktuell-Seite) und
  // kein Hinweis-Teaser auf der Startseite. Neuer Eintrag oben einfuegen:
  //   { datum: "2026-07-01", titel: "...", text: "...", link: null }
  // datum im Format JJJJ-MM-TT (wird fuer die Anzeige aufbereitet).
  news: []
};
