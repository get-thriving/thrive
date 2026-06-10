import type { MetaFunction } from "@remix-run/node";
import type { Note } from "@jupiter/webapi-client";
import { publishOwnerEntityTagName } from "#/core/common/sub/publish/publish-owner-type-name";
import { noteContentPreviewPlainText } from "#/core/common/sub/notes/note-content-plain-text";

export const PUBLISHED_SITE_NAME = "Thrive";
export const PUBLISHED_DESCRIPTION_MAX_CHARS = 160;

export type PublishedPageMeta = {
  name: string;
  entityType: string;
  summary: string;
  dateModified?: string | null;
  canonicalUrl: string;
  ogType: "article" | "website";
  /** Unlisted share links should stay noindex (default). */
  indexable: boolean;
};

export function publishedCanonicalUrl(request: Request): string {
  const url = new URL(request.url);
  url.search = "";
  url.hash = "";
  return url.href;
}

export function publishedSummaryFromNote(
  note: Note | null | undefined,
): string | undefined {
  return (
    noteContentPreviewPlainText(note, PUBLISHED_DESCRIPTION_MAX_CHARS) ??
    undefined
  );
}

function truncatePublishedDescription(text: string): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= PUBLISHED_DESCRIPTION_MAX_CHARS) {
    return normalized;
  }
  return `${normalized.slice(0, PUBLISHED_DESCRIPTION_MAX_CHARS - 1).trimEnd()}…`;
}

export function publishedDirListingSummary(dirLoad: {
  entries: unknown[];
  subdirs: unknown[];
}): string {
  const parts: string[] = [];
  if (dirLoad.subdirs.length > 0) {
    parts.push(`${dirLoad.subdirs.length} folder(s)`);
  }
  if (dirLoad.entries.length > 0) {
    parts.push(`${dirLoad.entries.length} doc(s)`);
  }
  if (parts.length === 0) {
    return `Shared folder on ${PUBLISHED_SITE_NAME}`;
  }
  return parts.join(", ");
}

export function buildPublishedPageMeta(args: {
  request: Request;
  entityType: string;
  name: string;
  summary?: string | null;
  note?: Note | null;
  dateModified?: string | null;
  ogType?: "article" | "website";
  indexable?: boolean;
}): PublishedPageMeta {
  const entityTypeLabel = publishOwnerEntityTagName(args.entityType);
  const summary =
    args.summary ??
    (args.note !== undefined
      ? publishedSummaryFromNote(args.note)
      : undefined) ??
    `Shared ${entityTypeLabel} on ${PUBLISHED_SITE_NAME}`;

  return {
    name: args.name,
    entityType: args.entityType,
    summary: truncatePublishedDescription(summary),
    dateModified: args.dateModified ?? null,
    canonicalUrl: publishedCanonicalUrl(args.request),
    ogType: args.ogType ?? "article",
    indexable: args.indexable ?? false,
  };
}

export function publishedMetaTitle(meta: PublishedPageMeta): string {
  const entityTypeLabel = publishOwnerEntityTagName(meta.entityType);
  return `${meta.name} · ${entityTypeLabel} · ${PUBLISHED_SITE_NAME}`;
}

export function publishedMetaRobots(meta: PublishedPageMeta): string {
  return meta.indexable ? "index,follow" : "noindex,nofollow";
}

export function metaDescriptorsForPublishedPage(
  pageMeta: PublishedPageMeta | null | undefined,
) {
  if (!pageMeta) {
    return [{ title: `Not found · ${PUBLISHED_SITE_NAME}` }];
  }

  const title = publishedMetaTitle(pageMeta);
  const description = pageMeta.summary;
  const robots = publishedMetaRobots(pageMeta);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: pageMeta.name,
    description,
    url: pageMeta.canonicalUrl,
  };
  if (pageMeta.dateModified) {
    jsonLd.dateModified = pageMeta.dateModified;
  }

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: pageMeta.canonicalUrl },
    { name: "robots", content: robots },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: pageMeta.ogType },
    { property: "og:url", content: pageMeta.canonicalUrl },
    { property: "og:site_name", content: PUBLISHED_SITE_NAME },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { "script:ld+json": jsonLd },
  ];
}

export function createPublishedMetaFunction<
  Loader extends (...args: never[]) => Promise<unknown>,
>(): MetaFunction<Loader> {
  return ({ data }) =>
    metaDescriptorsForPublishedPage(
      (data as { pageMeta?: PublishedPageMeta } | undefined)?.pageMeta,
    );
}
