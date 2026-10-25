// Where a login may send the user back to, once it is done.
//
// An app asking for access sends the user to sign in first, and the sign in
// brings them back to the consent page. The way back travels as a returnTo in
// the url, through any of the sign in methods. Only paths of this app are
// accepted, so a crafted link can't turn a login into a redirect elsewhere.

const OAUTH_AUTHORIZE_PATH_PREFIX = "/app/oauth/authorize?";

/** The safe returnTo carried by a url, if it carries one. */
export function oauthReturnToFromUrl(url: string): string | undefined {
  const returnTo = new URL(url).searchParams.get("returnTo");
  if (returnTo !== null && returnTo.startsWith(OAUTH_AUTHORIZE_PATH_PREFIX)) {
    return returnTo;
  }
  return undefined;
}
