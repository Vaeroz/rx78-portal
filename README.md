# RX-78 Portal

A responsive, static RX-78-2 model-kit collection archive built with React, TypeScript and Vite. Original SVG schematics, an Earth Federation terminal visual language, and reusable data-driven listings and detail views.

## Development

Use Node.js 22+ and npm:

```sh
npm ci
npm run dev
```

Open the printed local URL under `/rx78-portal/`. Routes use hashes, e.g. `/rx78-portal/#/kit/rg-2-standard`, so refreshing a kit link works on GitHub Pages without server rewrites.

```sh
npm test        # Search, filter intersections, sorting and hierarchy checks
npm run build   # Strict TypeScript checking and optimized static output
npm run preview # Serve the production build locally
npm run test:browser # Production browser interaction and responsive checks
```

`dist/` is the deployable artifact. Vite's base is explicitly `/rx78-portal/`; asset URLs use `import.meta.env.BASE_URL`. No backend, secrets, accounts, paid APIs or runtime external requests are required.

## Data editing

Edit `src/data.ts`. Three typed collections define the hierarchy:

- `grades`: stable ID, display name, scale and description.
- `releases`: stable ID, parent `gradeId`, engineering version name, provisional year, original/revision classification and notes.
- `variants`: stable ID, parent `releaseId`, name, variant type, manufacturer, optional release date/year, verified product ID plus source, notes, image path, descriptive alt text and optional sources.

A new grade, engineering generation or variant requires only a data entry, not a new page component. Filters derive options from the data. Keep identifiers stable: detail URLs use variant IDs. Put local assets in `public/` and use a relative filename in the data. Validate after editing with `npm test` and `npm run build`.

A new engineering generation belongs in `releases`. A color, event finish or exclusive belongs in `variants` under its actual parent generation. Do not infer a new mold from packaging or colors. Unknown dates should be omitted; unknown product identifiers must remain omitted. Only add identifiers with a verified primary-source URL. Unknown dates sort last in either direction.

### Data provenance

All current records are explicitly **demo/unverified**. Eight standard records are representative examples across HG, RG, MG and PG; release years and manufacturer attribution are provisional and lack primary sources. Eight nonstandard variants are fictional concept studies, not claims of commercial products. Product identifiers are intentionally omitted. The current `demo: true` schema keeps that status explicit; extending this to a verified catalog should add per-field provenance and verification status before removing the demo labels.

`public/schematic.svg` is original geometric placeholder artwork. It is not a product photo, exact technical drawing or kit-specific illustration. This is an independent, unaffiliated fan project.

## Structure and interaction

- `src/main.tsx`: shared shell, landing page, URL-backed archive filters, reusable kit cards/detail views, notes and unknown-route fallback.
- `src/data.ts`: typed data and pure query function.
- `src/style.css`: responsive layouts, terminal palette, visible focus states, reduced-motion support.
- `src/archive.test.ts`: meaningful behavior and referential integrity tests.

Search matches all words across kit name, grade code/name, release name and variant type. Grade/version/type filters intersect. Changing grade clears the dependent version filter. Reset restores every record. Count updates are announced with a polite status region. Native inputs, selects, buttons and links support keyboards; navigation moves focus to main content and a skip link is provided.

## Eventual GitHub Pages deployment — manual only

No deployment workflow is included, and nothing publishes on push. Pages has not been enabled by this implementation.

After the repository owner explicitly approves deployment:

1. Review and merge the implementation through the normal repository process.
2. Configure GitHub Pages to use GitHub Actions.
3. Add a workflow with **only `workflow_dispatch`**, never a `push`, `pull_request` or scheduled trigger. Use `actions/checkout`, `actions/setup-node` (Node 22, npm cache), `npm ci`, `npm test`, `npm run build`, `actions/upload-pages-artifact` (`path: dist`), then `actions/deploy-pages` in a job using the `github-pages` environment. Scope required `pages: write` and `id-token: write` permissions to that approved deployment workflow.
4. Manually run it from the reviewed branch. The expected URL is `https://Vaeroz.github.io/rx78-portal/`.
5. Verify the landing page, asset loading and direct hash URLs on the deployed site.

Changing the repository name requires updating Vite's base. Deployment, visibility and repository permissions must be handled separately with explicit owner approval.

## Validation scope

Automated tests cover search fields, intersecting filters, empty results, reset-equivalent defaults, date order, missing-date handling, unique IDs, parent references and sibling variants. The production build performs strict TypeScript checking. CSS defines mobile (≤560px), tablet (≤800px/1100px) and desktop layouts. Chromium browser tests pass at 375px, 768px and 1440px: landing and listing layouts have no horizontal overflow; search/filter/count, detail hierarchy, direct-link refresh, empty/reset states, unknown routes, skip-link keyboard activation and dependent version reset are verified. No JavaScript page errors were observed. Full screen-reader and cross-browser conformance have not been audited.

Browser tests use system Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to a local Chromium executable if needed. `npm run test:browser` starts a production preview server automatically (run `npm run build` first).
