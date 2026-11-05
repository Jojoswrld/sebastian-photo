Live: https://sebastian-hidalgo-photo.karabi-bots.workers.dev (Cloudflare Worker, Joseph's account)

To update after a change:
1. node _src/build.mjs                (from the site folder)
2. copy the site folder, minus _src, _deploy and .hallmark, into a "public" folder next to this wrangler.jsonc
3. wrangler deploy                    (from the folder holding wrangler.jsonc)
