/* =============================================================================
   Renderer: setzt die Daten aus data/site.js in die Seiten ein.

   Funktionsweise: Jede Seite enthaelt Platzhalter wie
       <div data-component="site-footer"></div>
   Dieses Skript ersetzt sie beim Laden durch das fertige Markup aus PRAXIS.
   So liegt jeder geteilte Inhalt nur EINMAL vor (in data/site.js).

   Laedt per <script defer> im <head>; laeuft, sobald das HTML geparst ist.
   ========================================================================== */
(function () {
  "use strict";

  var P = window.PRAXIS;
  if (!P) { return; }

  // Aktuelle Seite (Dateiname) — fuer aria-current in der Navigation.
  var seite = (location.pathname.split("/").pop() || "index.html");
  if (seite === "") { seite = "index.html"; }

  // Maps-Such-URL aus Adresse bauen.
  function mapsUrl(s) {
    var q = encodeURIComponent(s.strasse + ", " + s.plz + " " + s.ort);
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }

  // Maps-Embed-URL (iframe) aus Adresse bauen — kein API-Key noetig. Wird als
  // Zwei-Klick-Platzhalter eingesetzt; js/consent.js laedt das iframe erst
  // nach Einwilligung.
  function mapsEmbedUrl(s) {
    var q = encodeURIComponent(s.strasse + ", " + s.plz + " " + s.ort);
    return "https://www.google.com/maps?q=" + q + "&output=embed";
  }

  // Datum "2026-07-01" -> "1. Juli 2026" (fuer News-Anzeige).
  var MONATE = ["Januar","Februar","März","April","Mai","Juni","Juli",
                "August","September","Oktober","November","Dezember"];
  // Entschaerft Text, der in einem HTML-Attribut landet (z. B. alt="...").
  function attr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function datumLang(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) { return iso || ""; }
    return parseInt(m[3], 10) + ". " + MONATE[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  /* ---- Komponenten (geben HTML-Strings zurueck) ----------------------- */

  function header() {
    var punkte = P.nav.map(function (n) {
      var aktiv = (n.href === seite) ? ' aria-current="page"' : '';
      return '<li><a href="' + n.href + '"' + aktiv + '>' + n.text + '</a></li>';
    }).join("\n          ");
    return '' +
      '<header class="site-header">\n' +
      '    <div class="container">\n' +
      '      <a class="logo" href="index.html"><img src="bilder/logo-hausarztcenter-albstadt.png" alt="' + P.name + ' — Startseite"></a>\n' +
      '      <button class="nav-toggle" aria-expanded="false" aria-controls="hauptnavigation" aria-label="Menü öffnen">☰</button>\n' +
      '      <nav class="main-nav" id="hauptnavigation" aria-label="Hauptnavigation">\n' +
      '        <ul>\n          ' + punkte + '\n        </ul>\n' +
      '      </nav>\n' +
      '    </div>\n' +
      '  </header>';
  }

  function footer() {
    var standortSpalten = P.standorte.map(function (s) {
      return '<div>\n' +
        '          <h3>' + s.name + '</h3>\n' +
        '          <p>' + s.strasse + ', ' + s.plz + ' ' + s.ort + '<br>Tel. <a href="tel:' + s.telLink + '">' + s.tel + '</a></p>\n' +
        '        </div>';
    }).join("\n        ");
    // Social-Media-Icons (nur Links, kein eingebetteter Meta-Inhalt -> kein
    // Consent noetig). Erscheinen nur, wenn in site.js eine URL hinterlegt ist.
    var SOCIAL_ICONS = {
      facebook: { titel: "Facebook", pfad: "M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H16.7V4.6c-.3-.04-1.3-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.34H7.46V14h2.71v8z" },
      instagram: { titel: "Instagram", pfad: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2m0 5.13A4.67 4.67 0 1 0 16.67 12 4.67 4.67 0 0 0 12 7.33m0 7.7A3.03 3.03 0 1 1 15.03 12 3.03 3.03 0 0 1 12 15.03m5.95-7.88a1.09 1.09 0 1 1-1.09-1.09 1.09 1.09 0 0 1 1.09 1.09" }
    };
    var social = "";
    if (P.social) {
      var icons = Object.keys(SOCIAL_ICONS).filter(function (k) { return P.social[k]; })
        .map(function (k) {
          var i = SOCIAL_ICONS[k];
          return '<a href="' + P.social[k] + '" target="_blank" rel="noopener"' +
            ' aria-label="' + i.titel + '" title="' + i.titel + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">' +
            '<path fill="currentColor" d="' + i.pfad + '"/></svg></a>';
        });
      if (icons.length) {
        social = '\n          <p class="footer-social">' + icons.join("\n            ") + '</p>';
      }
    }

    var rechts = P.rechtsLinks.map(function (l) {
      return '<a href="' + l.href + '">' + l.text + '</a>';
    }).join("\n          ") +
      '\n          <a href="#" data-consent-oeffnen>Cookie-Einstellungen</a>';
    return '' +
      '<footer class="site-footer">\n' +
      '    <div class="container">\n' +
      '      <div class="footer-grid">\n' +
      '        <div>\n' +
      '          <h3>' + P.name + '</h3>\n' +
      '          <p>' + P.rechtsform + '<br>' + P.gesellschafter.join(" · ") + '</p>' + social + '\n' +
      '        </div>\n' +
      '        ' + standortSpalten + '\n' +
      '      </div>\n' +
      '      <div class="footer-bottom">\n' +
      '        <span>© ' + P.jahr + ' ' + P.name + '</span>\n' +
      '        <nav aria-label="Rechtliches">\n          ' + rechts + '\n        </nav>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </footer>';
  }

  // Eine Standort-Karte. variant "voll" (Praxen-Seite) zeigt Oeffnungszeiten,
  // Status-Badge und Schliesszeiten; "kontakt" (Service-Seite) nur Kontaktdaten.
  function standortKarte(s, variant) {
    var h = '<article class="karte">\n';
    // Foto der Niederlassung (nur Praxen-Seite). Platzhalter, bis ein Bild in
    // site.js (standorte[].foto) hinterlegt ist.
    if (variant === "voll") {
      h += s.foto
        ? '            <img class="karte-foto" src="' + s.foto + '" alt="Praxis ' + s.name + '">\n'
        : '            <div class="karte-foto bild-platzhalter bild-platzhalter--breit" role="img" aria-label="Foto der Niederlassung folgt"><span>Bild folgt: Praxis ' + s.name + '</span></div>\n';
    }
    h += '            <h3>Praxis ' + s.name + '</h3>\n';
    h += '            <ul class="kontakt-liste">\n';
    h += '              <li>' + s.strasse + ', ' + s.plz + ' ' + s.ort + '</li>\n';
    h += '              <li><span class="label">Tel.</span> <a href="tel:' + s.telLink + '">' + s.tel + '</a></li>\n';
    h += '              <li><span class="label">Fax</span> ' + s.fax + '</li>\n';
    if (variant === "voll" && s.barrierefrei) {
      h += '              <li>Barrierefreier, behindertengerechter Zugang</li>\n';
    }
    h += '            </ul>\n';
    if (variant === "voll") {
      h += '            <p><span class="badge">' + s.badge + '</span></p>\n';
      h += '            <table class="zeiten">\n              <tbody>\n';
      s.zeiten.forEach(function (z) {
        var nm = z.nachmittag ? z.nachmittag : '<span class="zu">nachmittags geschlossen</span>';
        h += '                <tr><th scope="row">' + z.tag + '</th><td>' + z.vormittag + ' &nbsp;·&nbsp; ' + nm + '</td></tr>\n';
      });
      h += '              </tbody>\n            </table>\n';
      h += '            <p style="margin-top:1rem">Geplante Schließungen ' + P.jahr + ': ' + s.schliessungen.join(" · ") + '<br>\n';
      h += '              <a href="' + mapsUrl(s) + '" target="_blank" rel="noopener">Route planen (Google Maps)</a></p>\n';
    } else {
      h += '            <p><a href="' + mapsUrl(s) + '" target="_blank" rel="noopener">Route planen (Google Maps)</a></p>\n';
      // Anfahrtskarte (consent-gated, s. js/consent.js) — nur Kontakt-Variante,
      // wie auf der Altseite (Karten auf Service & Kontakt).
      h += '            <div class="maps-embed" data-consent-embed="google-maps"' +
           ' data-embed-src="' + mapsEmbedUrl(s) + '"' +
           ' data-embed-titel="Karte Praxis ' + s.name + '"></div>\n';
    }
    h += '          </article>';
    return h;
  }

  function standorte(variant) {
    return '<div class="karten">\n          ' +
      P.standorte.map(function (s) { return standortKarte(s, variant); }).join("\n          ") +
      '\n        </div>';
  }

  function team() {
    var fehltFoto = P.team.some(function (m) { return !m.foto; });
    var hinweis = fehltFoto
      ? '<p class="hinweis">Die Team-Fotos werden derzeit erstellt und folgen in Kürze.</p>\n      '
      : '';
    var karten = P.team.map(function (m) {
      var fokus = m.fokus ? ' style="object-position:' + m.fokus + '"' : '';
      var foto = m.foto
        ? '<div class="person-foto"><img src="' + m.foto + '"' + fokus + ' alt="' + m.name + '"></div>'
        : '<div class="person-foto person-foto--platzhalter" aria-hidden="true"></div>';
      return '<article class="karte karte--person">' + foto +
        '<h3>' + m.name + '</h3><p>' + m.rolle + '</p></article>';
    }).join("\n          ");
    return hinweis + '<div class="karten">\n          ' + karten + '\n        </div>';
  }

  // Praxisteam (MFAs, Verwaltung). Anders als bei den Aerzten liegen hier
  // Hochformat-Aufnahmen (3:4) vor, deshalb Portraet-Kacheln statt runder
  // Ausschnitte — das Foto fuellt die Kachelbreite, Name und Funktion stehen
  // darunter. Fotos werden lazy geladen (14 Bilder auf einer Seite).
  function praxisteam() {
    if (!P.praxisteam || P.praxisteam.length === 0) { return ""; }
    var karten = P.praxisteam.map(function (m) {
      var fokus = m.fokus ? ' style="object-position:' + m.fokus + '"' : '';
      var bild = m.foto
        ? '<img src="' + m.foto + '"' + fokus + ' alt="' + attr(m.name) + '" loading="lazy">'
        : '<div class="portraet-platzhalter" aria-hidden="true"></div>';
      var umbruch = m.neueZeile ? " karte--neue-zeile" : "";
      return '<article class="karte karte--portraet' + umbruch + '">' + bild +
        '<div class="karte-text"><h3>' + m.name + '</h3><p>' + m.rolle + '</p></div></article>';
    }).join("\n          ");
    return '<div class="karten karten--portraet">\n          ' + karten + '\n        </div>';
  }

  // News. variant "liste" (Aktuell-Seite) zeigt alle Eintraege bzw. einen
  // neutralen Hinweis; "teaser" (Startseite) zeigt nur den neuesten Eintrag.
  function news(variant) {
    if (!P.news || P.news.length === 0) {
      if (variant === "teaser") { return ""; }
      return '<p>Zurzeit liegen keine besonderen Mitteilungen vor. Aktuelle Hinweise zu Sprechzeiten,\n' +
             '         Vertretungen und geplanten Schließungen finden Sie an dieser Stelle, sobald sie anstehen.</p>';
    }
    if (variant === "teaser") {
      var n = P.news[0];
      return '<div class="hinweis"><strong>' + n.titel + '</strong> ' + n.text +
             ' <a href="aktuell.html">Mehr unter „Aktuell"</a></div>';
    }
    return P.news.map(function (n) {
      var link = n.link ? ' <a href="' + n.link + '">Mehr erfahren</a>' : '';
      var inhalt =
        '<p class="news-datum">' + datumLang(n.datum) + '</p>\n' +
        '          <h2>' + n.titel + '</h2>\n' +
        '          <p>' + n.text + link + '</p>';
      // Ohne Bild bleibt die Kachel wie bisher (einspaltig).
      if (!n.bild) {
        return '<article class="news-item">\n' +
          '          ' + inhalt + '\n' +
          '      </article>';
      }
      // Mit Bild: Bild links, Text rechts (auf dem Handy untereinander).
      // bildAlt beschreibt das Bild fuer Screenreader — fehlt es, gilt das Bild
      // als rein dekorativ (leeres alt) und wird uebersprungen.
      return '<article class="news-item news-item--bild">\n' +
        '        <img src="' + n.bild + '" alt="' + attr(n.bildAlt || "") + '" loading="lazy">\n' +
        '        <div>\n          ' + inhalt + '\n        </div>\n' +
        '      </article>';
    }).join("\n      ");
  }

  /* ---- SEO: Strukturdaten (JSON-LD) aus denselben Daten --------------- */

  var TAG_LD = { Mo: "Monday", Di: "Tuesday", Mi: "Wednesday", Do: "Thursday", Fr: "Friday" };
  function oeffnungsZeiten(s) {
    var specs = [];
    s.zeiten.forEach(function (z) {
      ["vormittag", "nachmittag"].forEach(function (teil) {
        if (!z[teil]) { return; }
        var t = z[teil].split("–");
        if (t.length !== 2) { return; }
        specs.push({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/" + TAG_LD[z.tag],
          "opens": t[0].trim(),
          "closes": t[1].trim()
        });
      });
    });
    return specs;
  }
  function strukturdaten() {
    var graph = P.standorte.map(function (s) {
      return {
        "@type": "MedicalClinic",
        "name": P.name + " – " + s.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": s.strasse,
          "postalCode": s.plz,
          "addressLocality": s.ort,
          "addressCountry": "DE"
        },
        "telephone": s.telLink,
        "faxNumber": s.fax,
        "openingHoursSpecification": oeffnungsZeiten(s)
      };
    });
    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(el);
  }

  /* ---- Platzhalter ersetzen ------------------------------------------- */

  function setze(selector, html) {
    var el = document.querySelector(selector);
    if (el) { el.outerHTML = html; }
  }

  setze('[data-component="site-header"]', header());
  setze('[data-component="site-footer"]', footer());

  document.querySelectorAll('[data-component="standorte"]').forEach(function (el) {
    el.outerHTML = standorte(el.getAttribute("data-variant") || "voll");
  });
  var teamEl = document.querySelector('[data-component="team"]');
  if (teamEl) { teamEl.outerHTML = team(); }
  var praxisteamEl = document.querySelector('[data-component="praxisteam"]');
  if (praxisteamEl) { praxisteamEl.outerHTML = praxisteam(); }
  document.querySelectorAll('[data-component="news"]').forEach(function (el) {
    el.outerHTML = news(el.getAttribute("data-variant") || "liste");
  });

  // SAMEDI-Links zentral setzen: <a data-href="samedi">.
  document.querySelectorAll('[data-href="samedi"]').forEach(function (a) {
    a.setAttribute("href", P.samediUrl);
  });

  strukturdaten();

  /* ---- 321 MED Online-Rezeption ----
     Wird NICHT mehr hier geladen: seit 2026-07-28 haengt das Widget hinter der
     Einwilligung (Entscheidung Christian — § 25 Abs. 1 TDDDG). Das Laden macht
     js/consent.js, sobald die Einwilligung vorliegt. URLs bleiben zentral in
     data/site.js (integrationen.med321). */

  /* ---- To-Top-Button (erscheint nach ~1 Bildschirmhoehe Scrolltiefe) ---
     Rechts unten OBERHALB des 321-MED-Widgets positioniert (s. style.css). */
  var toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Nach oben");
  toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">' +
    '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
    'stroke-linejoin="round" d="M5 14l7-7 7 7"/></svg>';
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  document.body.appendChild(toTop);
  var toTopTick = false;
  window.addEventListener("scroll", function () {
    if (toTopTick) { return; }
    toTopTick = true;
    requestAnimationFrame(function () {
      toTop.classList.toggle("sichtbar", window.scrollY > window.innerHeight);
      toTopTick = false;
    });
  }, { passive: true });

  /* ---- Mobile-Navigation (Header ist jetzt im DOM) -------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("hauptnavigation");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var offen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", offen ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
