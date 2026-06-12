export const PUBLISHED_ROUTE_PREFIX = "/publish";

export function publishedShareUrl(
  publishedUrl: string,
  externalId: string,
): string {
  const base = publishedUrl.endsWith("/")
    ? publishedUrl.slice(0, -1)
    : publishedUrl;
  return `${base}${PUBLISHED_ROUTE_PREFIX}/${externalId}`;
}
