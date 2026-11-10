# Sebastián Hidalgo Arce — photography

Hospitality photography portfolio for Sebastián Hidalgo Arce, La Fortuna, Costa Rica. English and Spanish.

**Live:** https://sebastian-hidalgo-photo.arenalweb.workers.dev

- `site/` is the website that gets deployed.
- Projects are listed in `site/_src/projects.mjs`. Add a job there, put its photos in `site/img/g/` as `<name>-1200.jpg` and `<name>-2400.jpg`, then rebuild with `node _src/build.mjs` from `site/`.
- Deploy settings are in `site/_deploy/` (Cloudflare Worker / Wrangler), including the steps to publish an update.
