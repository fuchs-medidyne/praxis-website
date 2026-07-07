/* =============================================================================
   Eingabehilfen (Barrierefreiheits-Widget, Eigenbau).

   Nachbau der Altseiten-Funktion (dort Joomla-Plugin "DJ-Accessibility"):
   Button rechts oben oeffnet ein Panel mit 10 Schaltern und 4 Reglern.

   Technik:
   - Schalter setzen Klassen auf <html> (eh-dunkel, eh-links, ...) bzw.
     CSS-Filter (Farben umkehren, Monochrom, Saettigung) — die Filter werden
     zu EINER filter-Deklaration kombiniert und direkt auf <html> gesetzt.
     (Filter auf dem Wurzelelement ist sicher: es erzeugt dort laut Spec KEINEN
     neuen Containing Block fuer position:fixed — Widgets bleiben fixiert.)
   - Regler setzen CSS-Variablen (--eh-schrift, --eh-zeile, --eh-abstand)
     bzw. zoom auf <html>; die zugehoerigen Regeln stehen in css/style.css.
   - "Bildschirmleser" liest per Web Speech API (de-DE) den angeklickten
     Absatz vor; nur sichtbar, wenn der Browser speechSynthesis anbietet.
   - Zustand liegt in localStorage ("praxis-eingabehilfen") und wird beim
     Laden sofort wieder angewandt (technisch notwendig, kein Consent noetig).

   Laedt per <script defer> nach render.js/consent.js.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "praxis-eingabehilfen";
  var kannVorlesen = ("speechSynthesis" in window);

  /* ---- Zustand ---------------------------------------------------------- */

  var STANDARD = {
    umkehren: false, monochrom: false, dunkel: false, hell: false,
    sattArm: false, sattStark: false, links: false, titel: false,
    vorlesen: false, lesen: false,
    skala: 100, schrift: 100, zeile: 100, abstand: 100
  };

  function lesen() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY)) || {};
      var out = {};
      Object.keys(STANDARD).forEach(function (k) {
        out[k] = (k in s) ? s[k] : STANDARD[k];
      });
      return out;
    } catch (e) { return Object.assign({}, STANDARD); }
  }
  function speichern() {
    try { localStorage.setItem(KEY, JSON.stringify(zustand)); } catch (e) { /* ok */ }
  }

  var zustand = lesen();

  /* ---- Anwenden --------------------------------------------------------- */

  function anwenden() {
    var html = document.documentElement;

    // Filter kombinieren (mehrere aktive Schalter = eine filter-Deklaration).
    var filter = [];
    if (zustand.umkehren)  { filter.push("invert(1)", "hue-rotate(180deg)"); }
    if (zustand.monochrom) { filter.push("grayscale(1)"); }
    if (zustand.sattArm)   { filter.push("saturate(.5)"); }
    if (zustand.sattStark) { filter.push("saturate(2)"); }
    html.style.filter = filter.length ? filter.join(" ") : "";

    html.classList.toggle("eh-dunkel", zustand.dunkel);
    html.classList.toggle("eh-hell", zustand.hell);
    html.classList.toggle("eh-links", zustand.links);
    html.classList.toggle("eh-titel", zustand.titel);
    html.classList.toggle("eh-lesen", zustand.lesen);
    html.classList.toggle("eh-vorlesen", zustand.vorlesen);

    // Regler. Inhaltsskalierung via zoom (skaliert das gesamte Layout);
    // die uebrigen via CSS-Variablen (Regeln in style.css).
    html.style.zoom = (zustand.skala === 100) ? "" : (zustand.skala / 100);
    setzeVar("--eh-schrift", zustand.schrift === 100 ? "" : String(zustand.schrift / 100));
    setzeVar("--eh-zeile",   zustand.zeile   === 100 ? "" : String(zustand.zeile / 100));
    setzeVar("--eh-abstand", zustand.abstand === 100 ? "" : ((zustand.abstand - 100) * 0.0025) + "em");

    vorlesenSchalten(zustand.vorlesen);
  }
  function setzeVar(name, wert) {
    if (wert) { document.documentElement.style.setProperty(name, wert); }
    else { document.documentElement.style.removeProperty(name); }
  }

  /* ---- Vorlesen (Web Speech API) ---------------------------------------- */

  var liestGerade = null;

  function vorlesenStopp() {
    if (!kannVorlesen) { return; }
    window.speechSynthesis.cancel();
    if (liestGerade) { liestGerade.classList.remove("eh-liest"); liestGerade = null; }
  }

  function vorlesenKlick(e) {
    var ziel = e.target.closest("p, h1, h2, h3, h4, h5, h6, li, td, th, figcaption, blockquote");
    if (!ziel || ziel.closest(".eh-panel")) { return; }
    e.preventDefault();
    e.stopPropagation();
    vorlesenStopp();
    var text = (ziel.textContent || "").trim();
    if (!text) { return; }
    liestGerade = ziel;
    ziel.classList.add("eh-liest");
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.onend = vorlesenStopp;
    u.onerror = vorlesenStopp;
    window.speechSynthesis.speak(u);
  }

  function vorlesenSchalten(an) {
    if (!kannVorlesen) { return; }
    document.removeEventListener("click", vorlesenKlick, true);
    if (an) { document.addEventListener("click", vorlesenKlick, true); }
    else { vorlesenStopp(); }
  }

  /* ---- Panel ------------------------------------------------------------ */

  var SCHALTER = [
    { id: "umkehren",  text: "Farben umkehren" },
    { id: "monochrom", text: "Monochrom" },
    { id: "dunkel",    text: "Dunkler Kontrast", nicht: "hell" },
    { id: "hell",      text: "Heller Kontrast",  nicht: "dunkel" },
    { id: "sattArm",   text: "Niedrige Sättigung", nicht: "sattStark" },
    { id: "sattStark", text: "Hohe Sättigung",     nicht: "sattArm" },
    { id: "links",     text: "Links hervorheben" },
    { id: "titel",     text: "Überschriften hervorheben" },
    { id: "vorlesen",  text: "Vorlesen (anklicken)" },
    { id: "lesen",     text: "Lesemodus" }
  ];
  var REGLER = [
    { id: "skala",   text: "Inhaltsskalierung", min: 70, max: 150 },
    { id: "schrift", text: "Schriftgröße",      min: 70, max: 200 },
    { id: "zeile",   text: "Zeilenhöhe",        min: 70, max: 200 },
    { id: "abstand", text: "Buchstabenabstand", min: 70, max: 200 }
  ];

  var panel = null, knopf = null;

  function panelBauen() {
    var el = document.createElement("div");
    el.className = "eh-panel";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Eingabehilfen");

    var h = '<div class="eh-kopf">\n' +
      '  <h2>Eingabehilfen</h2>\n' +
      '  <button type="button" class="eh-reset" title="Alles zurücksetzen" aria-label="Alle Eingabehilfen zurücksetzen">↺</button>\n' +
      '  <button type="button" class="eh-zu" aria-label="Eingabehilfen schließen">✕</button>\n' +
      '</div>\n<div class="eh-raster">\n';
    SCHALTER.forEach(function (s) {
      if (s.id === "vorlesen" && !kannVorlesen) { return; }
      h += '  <button type="button" class="eh-schalter" data-eh="' + s.id + '" aria-pressed="false">' + s.text + '</button>\n';
    });
    h += '</div>\n';
    REGLER.forEach(function (r) {
      h += '<div class="eh-regler" data-eh-regler="' + r.id + '">\n' +
        '  <span class="eh-regler-name" id="eh-name-' + r.id + '">' + r.text + '</span>\n' +
        '  <button type="button" data-schritt="-10" aria-label="' + r.text + ' verringern">−</button>\n' +
        '  <input type="range" min="' + r.min + '" max="' + r.max + '" step="10" value="100" aria-labelledby="eh-name-' + r.id + '">\n' +
        '  <button type="button" data-schritt="10" aria-label="' + r.text + ' erhöhen">+</button>\n' +
        '  <output>100%</output>\n' +
        '</div>\n';
    });
    el.innerHTML = h;
    document.body.appendChild(el);

    /* Verdrahtung */
    el.querySelector(".eh-zu").addEventListener("click", panelZu);
    el.querySelector(".eh-reset").addEventListener("click", function () {
      zustand = Object.assign({}, STANDARD);
      speichern(); anwenden(); panelAktualisieren();
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { panelZu(); }
    });
    el.querySelectorAll(".eh-schalter").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-eh");
        zustand[id] = !zustand[id];
        // Gegensaetzliche Schalter (dunkel/hell, Saettigung arm/stark) ausschliessen.
        var def = SCHALTER.filter(function (s) { return s.id === id; })[0];
        if (zustand[id] && def.nicht) { zustand[def.nicht] = false; }
        speichern(); anwenden(); panelAktualisieren();
      });
    });
    el.querySelectorAll(".eh-regler").forEach(function (reihe) {
      var id = reihe.getAttribute("data-eh-regler");
      var def = REGLER.filter(function (r) { return r.id === id; })[0];
      var range = reihe.querySelector("input");
      function setzen(wert) {
        zustand[id] = Math.min(def.max, Math.max(def.min, wert));
        speichern(); anwenden(); panelAktualisieren();
      }
      range.addEventListener("input", function () { setzen(parseInt(range.value, 10)); });
      reihe.querySelectorAll("[data-schritt]").forEach(function (b) {
        b.addEventListener("click", function () {
          setzen(zustand[id] + parseInt(b.getAttribute("data-schritt"), 10));
        });
      });
    });
    return el;
  }

  function panelAktualisieren() {
    panel.querySelectorAll(".eh-schalter").forEach(function (b) {
      var an = !!zustand[b.getAttribute("data-eh")];
      b.setAttribute("aria-pressed", an ? "true" : "false");
      b.classList.toggle("aktiv", an);
    });
    panel.querySelectorAll(".eh-regler").forEach(function (reihe) {
      var id = reihe.getAttribute("data-eh-regler");
      reihe.querySelector("input").value = zustand[id];
      reihe.querySelector("output").textContent = zustand[id] + "%";
    });
  }

  function panelAuf() {
    if (!panel) { panel = panelBauen(); }
    panelAktualisieren();
    panel.hidden = false;
    knopf.setAttribute("aria-expanded", "true");
    panel.querySelector(".eh-zu").focus();
  }
  function panelZu() {
    if (panel) { panel.hidden = true; }
    knopf.setAttribute("aria-expanded", "false");
    knopf.focus();
  }

  /* ---- Button rechts oben ------------------------------------------------ */

  knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "eh-knopf";
  knopf.setAttribute("aria-label", "Eingabehilfen öffnen");
  knopf.setAttribute("aria-expanded", "false");
  knopf.title = "Eingabehilfen";
  // Barrierefreiheits-Symbol (Person im Kreis) als Inline-SVG.
  knopf.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26">' +
    '<circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<circle cx="12" cy="6.8" r="1.9" fill="currentColor"/>' +
    '<path fill="currentColor" d="M12 9.2c-2.6 0-4.6-.6-5.5-.9l-.4 1.5c1 .4 2.6.8 4.4 1v2.4l-1.8 5.2 1.5.6 1.6-4.7h.4l1.6 4.7 1.5-.6-1.8-5.2v-2.4c1.8-.2 3.4-.6 4.4-1l-.4-1.5c-.9.3-2.9.9-5.5.9z"/></svg>';
  knopf.addEventListener("click", function () {
    (panel && !panel.hidden) ? panelZu() : panelAuf();
  });
  document.body.appendChild(knopf);

  /* ---- Start ------------------------------------------------------------- */

  anwenden();   // gespeicherten Zustand sofort wieder anwenden
})();
