const { appUrl, docsUrl, communityUrl, sourceUrl, supportEmail } =
  __LANDING_LINKS__;

function download(distribution: string): string {
  return `${appUrl}/apps-latest-versions?distribution=${distribution}`;
}

/** Every place the page sends people to, so the pages hold no URLs of their own. */
export const landingLinks = {
  app: appUrl,
  signIn: `${appUrl}/app/workspace`,
  docs: docsUrl,
  community: communityUrl,
  source: sourceUrl,
  supportMailto: `mailto:${supportEmail}`,
  supportEmail,
  selfHostGuide: `${docsUrl}/how-tos/self-hosting/`,
  cli: `${docsUrl}/concepts/clients/`,
  downloadMac: download("mac-web"),
  downloadIos: download("app-store"),
  downloadAndroid: download("google-play-store"),
} as const;
