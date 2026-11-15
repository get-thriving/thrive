/** The last part of a url's path: the id, for the route of an entity. */
export function strataLastSegment(pathname: string): string {
  const parts = pathname.split("/").filter((part) => part !== "");
  return parts[parts.length - 1] ?? "";
}
