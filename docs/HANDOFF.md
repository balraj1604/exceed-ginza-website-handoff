# Developer handoff

## Runtime

Buildless static website. Serve `website/` as the document root. No backend, database or secret configuration is included. Consultation actions retain the existing external EXCEED destinations; this package does not provision a form backend.

## Main files

- `website/index.html`: latest Version B homepage.
- `website/variant-b.html`: alias of Version B.
- `website/en.html`: English overview.
- `website/story.html`: extended Japanese story.
- `website/app.js`, `website/phase1.js`: interactions, tabs, count-up and existing behaviour.
- CSS files are loaded in deliberate cascade order. `variant-b.css` and `opening-refinement.css` contain the latest visual layer; preserve the earlier styles until deliberately consolidating.
- `website/assets/`: locally bundled images, developer logos, fonts, videos and map library.

## Snapshot and hosting

Version B includes the 30 October opening refinement. Source was copied from the deployed static directory. The previous Version A remains separate in the working project and is not overwritten by this handoff.

The public preview is https://exceed-ginza-preview-b.netlify.app/. The repository is not connected to automatic deployment. For a future deployment, choose `website` as the publish directory, with no build command.

## Review focus

Keep content intact while refining layout. Verify desktop and mobile, developer tabs, mobile navigation, FAQ toggles, video controls, anchors, reduced-motion behaviour and outgoing consultation links. The handoff’s package verification checks local asset paths and JavaScript syntax; it does not submit forms or validate business claims.
