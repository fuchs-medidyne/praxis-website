/* =============================================================================
   Cookie-Consent (Eigenbau, kein Drittanbieter).

   Verwaltet die Einwilligung fuer externe Inhalte — derzeit einziger Dienst:
   Google Maps. Die Einwilligung wird NUR lokal gespeichert (localStorage,
   Schluessel "praxis-consent"); es werden keine Daten an Dritte uebertragen.

   Bausteine:
   - Dialog (beim Erstbesuch automatisch, sonst per Cookie-Button links unten
     oder Footer-Link) mit Kategorien "Notwendig" und "Funktional".
   - Zwei-Klick-Embeds: <div data-consent-embed="google-maps"
     data-embed-src="..." data-embed-titel="..."> wird erst NACH Einwilligung
     durch das iframe ersetzt; vorher grauer Platzhalter mit "Karte laden".
   - Widerruf im Dialog entfernt bereits geladene iframes wieder.

   Laedt per <script defer> NACH render.js (die Embeds stammen aus render.js).
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "praxis-consent";

  /* ---- Speicher ------------------------------------------------------- */

  function lesen() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; }
    catch (e) { return null; }
  }
  function schreiben(googleMaps) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        googleMaps: !!googleMaps,
        ts: new Date().toISOString()
      }));
    } catch (e) { /* privater Modus o.ae. — Consent gilt dann nur fuer diese Ansicht */ }
  }

  /* ---- Zwei-Klick-Embeds (Google Maps) -------------------------------- */

  function embedsAnwenden(erlaubt) {
    document.querySelectorAll('[data-consent-embed="google-maps"]').forEach(function (el) {
      var vorhanden = el.querySelector("iframe");
      if (erlaubt && !vorhanden) {
        el.innerHTML = '<iframe src="' + el.getAttribute("data-embed-src") + '"' +
          ' title="' + (el.getAttribute("data-embed-titel") || "Google Maps") + '"' +
          ' loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>';
        el.classList.add("geladen");
      } else if (!erlaubt) {
        el.classList.remove("geladen");
        el.innerHTML =
          '<p>Google&nbsp;Maps ist deaktiviert. Mit Klick auf „Karte laden" willigen Sie ein,' +
          ' dass Daten an Google übertragen werden (Details in der' +
          ' <a href="datenschutz.html">Datenschutzerklärung</a>).</p>' +
          '<button type="button" class="btn" data-consent-laden>Karte laden</button>';
      }
    });
  }

  /* ---- Dialog ---------------------------------------------------------- */

  var dialog = null;

  function dialogBauen() {
    var wrap = document.createElement("div");
    wrap.className = "consent-overlay";
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="consent-dialog" role="dialog" aria-modal="true" aria-labelledby="consent-titel">\n' +
      '  <div class="consent-kopf">\n' +
      '    <h2 id="consent-titel">Cookie-Einstellungen</h2>\n' +
      '    <button type="button" class="consent-schliessen" aria-label="Schließen">✕</button>\n' +
      '  </div>\n' +
      '  <p>Unsere Website speichert Einstellungen nur lokal in Ihrem Browser. Externe Inhalte\n' +
      '     (Google&nbsp;Maps) werden erst nach Ihrer Einwilligung geladen.\n' +
      '     <a href="datenschutz.html">Mehr Infos in der Datenschutzerklärung</a>.</p>\n' +
      '  <h3>Notwendig</h3>\n' +
      '  <p class="consent-text">Technisch notwendige Speicherung (z.&nbsp;B. diese Einwilligung selbst,\n' +
      '     Eingabehilfen-Einstellungen). Bleibt auf Ihrem Gerät, keine Übertragung an Dritte.</p>\n' +
      '  <h3>Funktional</h3>\n' +
      '  <label class="consent-schalter">\n' +
      '    <input type="checkbox" id="consent-maps">\n' +
      '    <span>Google&nbsp;Maps (Anfahrtskarten) — beim Laden werden Daten an Google übertragen</span>\n' +
      '  </label>\n' +
      '  <div class="consent-aktionen">\n' +
      '    <button type="button" class="btn" data-consent-alle>Alle akzeptieren</button>\n' +
      '    <button type="button" class="btn btn-leise" data-consent-keine>Optionale ablehnen</button>\n' +
      '    <button type="button" class="btn btn-leise" data-consent-auswahl>Auswahl übernehmen</button>\n' +
      '  </div>\n' +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  var zuletztFokussiert = null;

  function dialogOeffnen() {
    if (!dialog) { dialog = dialogBauen(); verdrahten(); }
    var c = lesen();
    dialog.querySelector("#consent-maps").checked = !!(c && c.googleMaps);
    zuletztFokussiert = document.activeElement;
    dialog.hidden = false;
    dialog.querySelector(".consent-schliessen").focus();
  }

  function dialogSchliessen() {
    if (dialog) { dialog.hidden = true; }
    if (zuletztFokussiert && zuletztFokussiert.focus) { zuletztFokussiert.focus(); }
  }

  function entscheiden(googleMaps) {
    schreiben(googleMaps);
    embedsAnwenden(googleMaps);
    dialogSchliessen();
  }

  function verdrahten() {
    dialog.querySelector(".consent-schliessen").addEventListener("click", dialogSchliessen);
    dialog.querySelector("[data-consent-alle]").addEventListener("click", function () { entscheiden(true); });
    dialog.querySelector("[data-consent-keine]").addEventListener("click", function () { entscheiden(false); });
    dialog.querySelector("[data-consent-auswahl]").addEventListener("click", function () {
      entscheiden(dialog.querySelector("#consent-maps").checked);
    });
    // ESC schliesst, Tab bleibt im Dialog (Fokus-Falle).
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dialogSchliessen(); return; }
      if (e.key !== "Tab") { return; }
      var f = dialog.querySelectorAll("button, input, a[href]");
      var erster = f[0], letzter = f[f.length - 1];
      if (e.shiftKey && document.activeElement === erster) { e.preventDefault(); letzter.focus(); }
      else if (!e.shiftKey && document.activeElement === letzter) { e.preventDefault(); erster.focus(); }
    });
  }

  /* ---- Cookie-Button (links unten) ------------------------------------- */

  function buttonBauen() {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "cookie-button";
    b.setAttribute("aria-label", "Cookie-Einstellungen");
    b.title = "Cookie-Einstellungen";
    // Cookie-Symbol als Inline-SVG (kein zusaetzlicher Request).
    b.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26">' +
      '<path fill="currentColor" d="M12 2a10 10 0 1 0 10 10 3 3 0 0 1-4-2.83A3 3 0 0 1 14.83 6 3 3 0 0 1 12 2z"/>' +
      '<circle fill="currentColor" cx="8.5" cy="10" r="1.3"/>' +
      '<circle fill="currentColor" cx="11" cy="15" r="1.3"/>' +
      '<circle fill="currentColor" cx="15" cy="12.5" r="1.3"/></svg>';
    b.addEventListener("click", dialogOeffnen);
    document.body.appendChild(b);
  }

  /* ---- Start ------------------------------------------------------------ */

  buttonBauen();

  // Footer-Link "Cookie-Einstellungen" + "Karte laden"-Buttons (Delegation —
  // die Elemente werden von render.js bzw. embedsAnwenden() erzeugt).
  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) { return; }
    var oeffner = e.target.closest("[data-consent-oeffnen]");
    if (oeffner) { e.preventDefault(); dialogOeffnen(); return; }
    if (e.target.closest("[data-consent-laden]")) {
      schreiben(true);
      embedsAnwenden(true);
    }
  });

  var consent = lesen();
  embedsAnwenden(!!(consent && consent.googleMaps));
  if (!consent) { dialogOeffnen(); }   // Erstbesuch: Dialog automatisch zeigen
})();
