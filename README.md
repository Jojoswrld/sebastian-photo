# Sebastián Hidalgo Arce — photography

Hospitality photography portfolio for Sebastián Hidalgo Arce, La Fortuna, Costa Rica. English and Spanish.

**Live:** https://sebastian-hidalgo-photo.lavalogic.workers.dev

- `site/` is the website that gets deployed.
- Projects are listed in `site/_src/projects.mjs`. Add a job there, put its photos in `site/img/g/` as `<name>-1200.jpg` and `<name>-2400.jpg`, then rebuild with `node _src/build.mjs` from `site/`.
- Pushing to `main` on GitHub publishes the site automatically (Cloudflare Workers Builds, personal account). Deploy settings and the manual steps are in `site/_deploy/`.
