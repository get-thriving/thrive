/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

/** Where the page's links point. Set by `vite.config.mts` when the page is built. */
declare const __LANDING_LINKS__: {
  appUrl: string;
  docsUrl: string;
  communityUrl: string;
  sourceUrl: string;
  supportEmail: string;
};
