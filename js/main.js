// Mobile-Navigation: Menue auf-/zuklappen.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("hauptnavigation");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var offen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", offen ? "true" : "false");
  });

  // Beim Klick auf einen Link das Menue wieder schliessen (Mobil).
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
