# Landing

The Thrive landing page, the home of get-thriving.com. It is a static site:
React Router in framework mode, prerendered at build time and hosted as a
Render static site. See [ADR 0022](../../docs/adrs/0022.landing-page-as-static-site.md).

## Run it

```bash
mise run run:landing
```

It needs no Jupiter instance. The links point at the local WebUI and docs.

## Build it

```bash
mise run build:landing
```

The site is written to `src/landing/build/client`. Where its links point comes
from `WEBUI_URL` and `DOCS_URL` if they are set, and from `src/Config.global`
otherwise.

## Adding a page

Add the route in `app/routes.ts` **and** its path to `prerender` in
`react-router.config.ts`. A page missing from `prerender` is not built.

## Notes

- Colors are the Strata variables. Do not put hex values in `app/landing.css`.
- The sample screens in the product tabs are sample data
  (`app/components/sample-screens.ts`), not a live workspace.
- The legal text in `app/routes/` is linked from the apps (`TERMS_OF_SERVICE_URL`
  and `PRIVACY_POLICY_URL` in `src/Config.global`), so keep those paths.
