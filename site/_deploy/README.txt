Live: https://sebastian-hidalgo-photo.lavalogic.workers.dev (Cloudflare Worker, Joseph's personal account)

Pushing to main on GitHub runs these steps automatically (Cloudflare Workers Builds, path site/_deploy).

To update by hand after a change:
1. node _src/build.mjs                (from the site folder)
2. copy the site folder, minus _src, _deploy and .hallmark, into a "public" folder next to this wrangler.jsonc
3. wrangler deploy                    (from the folder holding wrangler.jsonc)
