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

  // Datum "2026-07-01" -> "1. Juli 2026" (fuer News-Anzeige).
  var MONATE = ["Januar","Februar","März","April","Mai","Juni","Juli",
                "August","September","Oktober","November","Dezember"];
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
    var rechts = P.rechtsLinks.map(function (l) {
      return '<a href="' + l.href + '">' + l.text + '</a>';
    }).join("\n          ");
    return '' +
      '<footer class="site-footer">\n' +
      '    <div class="container">\n' +
      '      <div class="footer-grid">\n' +
      '        <div>\n' +
      '          <h3>' + P.name + '</h3>\n' +
      '          <p>' + P.rechtsform + '<br>' + P.gesellschafter.join(" · ") + '</p>\n' +
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
      var foto = m.foto
        ? '<div class="person-foto"><img src="' + m.foto + '" alt="' + m.name + '"></div>'
        : '<div class="person-foto person-foto--platzhalter" aria-hidden="true"></div>';
      return '<article class="karte karte--person">' + foto +
        '<h3>' + m.name + '</h3><p>' + m.rolle + '</p></article>';
    }).join("\n          ");
    return hinweis + '<div class="karten">\n          ' + karten + '\n        </div>';
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
      return '<article class="news-item">\n' +
        '        <p class="news-datum">' + datumLang(n.datum) + '</p>\n' +
        '        <h2>' + n.titel + '</h2>\n' +
        '        <p>' + n.text + link + '</p>\n' +
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
  document.querySelectorAll('[data-component="news"]').forEach(function (el) {
    el.outerHTML = news(el.getAttribute("data-variant") || "liste");
  });

  // SAMEDI-Links zentral setzen: <a data-href="samedi">.
  document.querySelectorAll('[data-href="samedi"]').forEach(function (a) {
    a.setAttribute("href", P.samediUrl);
  });

  strukturdaten();

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
