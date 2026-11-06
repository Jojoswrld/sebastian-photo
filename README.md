# Sebastián Hidalgo Arce, photography site

Hospitality photography portfolio for Sebastián Hidalgo Arce, La Fortuna, Costa Rica. English and Spanish.

Live: https://sebastian-hidalgo-photo.arenalweb.workers.dev

- `site/` is the website (what gets uploaded).
- `site/_src/projects.mjs` holds every project. Add a job there, put its photos in `site/img/g/` as `<name>-1200.jpg` and `<name>-2400.jpg`, then run `node _src/build.mjs` from `site/`.
- `site/_deploy/` has the Cloudflare settings and the steps to publish an update.
