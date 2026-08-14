/** Read a `true`/`false` cookie from a Cookie header. */
export function readBooleanCookie(
  cookieHeader: string | null,
  name: string,
): boolean | null {
  if (cookieHeader === null) {
    return null;
  }

  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${name}=(true|false)`),
  );
  if (match === null) {
    return null;
  }

  return match[1] === "true";
}
