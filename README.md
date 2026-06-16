# Hausarztcenter Albstadt — Website

Statische Website der Praxis (Diebold & Fuchs), gehostet über **GitHub Pages**.
Schlichtes HTML/CSS/JS, kein Build-Schritt.

## Struktur

```
website/
├── index.html              Startseite
├── aktuell.html            Aktuelles / Mitteilungen
├── praxen.html             Standorte (Ebingen, Tailfingen)
├── aerzte-team.html        Ärzte & Team
├── behandlungsspektrum.html
├── stellenangebote.html
├── service-kontakt.html
├── impressum.html          (rechtlich – Inhalte mit Praxis abstimmen)
├── datenschutz.html        (rechtlich – Inhalte mit Praxis abstimmen)
├── css/style.css           Basis-Stylesheet
├── js/main.js              Mobile-Navigation
├── bilder/                 Bilder/Logo
└── .nojekyll               GitHub Pages: keine Jekyll-Verarbeitung
```

## Lokal ansehen

Einfach `index.html` im Browser öffnen, oder ein kleiner lokaler Server:

```bash
python -m http.server 8080   # dann http://localhost:8080
```

## Hosting

GitHub Pages baut aus dem `main`-Branch dieses Repos. Live-URL: siehe Repo-Einstellungen
(Settings → Pages). Der Umzug auf die echte Domain `hausarztcenter-albstadt.de` erfolgt
erst nach Abnahme (siehe Plan DOMAIN im privaten workway-Repo).

## Hinweis

Die Pflege, Pläne und der Multi-Rechner-Workflow liegen im **privaten** Repo
`praxis-website-workway`. Dieses Repo hier enthält nur die öffentliche Website.
