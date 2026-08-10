import { NamedEntityTag } from "@jupiter/webapi-client";

export interface ShareableEntityFromPath {
  entityType: NamedEntityTag;
  entityRefId: string;
}

/**
 * Infer a shareable crown entity from a workspace leaf URL.
 * Used by the access-denied UI to offer "ask for access" actions.
 */
export function resolveShareableEntityFromPath(
  pathname: string,
  params: Record<string, string | undefined>,
): ShareableEntityFromPath | null {
  const patterns: Array<{
    re: RegExp;
    entityType: NamedEntityTag;
    refId: (
      match: RegExpMatchArray,
      params: Record<string, string | undefined>,
    ) => string | undefined;
  }> = [
    {
      re: /^\/app\/workspace\/todos\/([^/]+)$/,
      entityType: NamedEntityTag.TODO_TASK,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/time-plans\/([^/]+)$/,
      entityType: NamedEntityTag.TIME_PLAN,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/calendar\/schedule\/stream\/([^/]+)$/,
      entityType: NamedEntityTag.SCHEDULE_STREAM,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/calendar\/schedule\/event-in-day\/([^/]+)$/,
      entityType: NamedEntityTag.SCHEDULE_EVENT_IN_DAY,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/calendar\/schedule\/event-full-days\/([^/]+)$/,
      entityType: NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/habits\/([^/]+)$/,
      entityType: NamedEntityTag.HABIT,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/chores\/([^/]+)$/,
      entityType: NamedEntityTag.CHORE,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/big-plans\/([^/]+)$/,
      entityType: NamedEntityTag.BIG_PLAN,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/docs\/([^/]+)\/doc\/([^/]+)$/,
      entityType: NamedEntityTag.DOC,
      refId: (_m, p) => p.docId,
    },
    {
      re: /^\/app\/workspace\/docs\/([^/]+)$/,
      entityType: NamedEntityTag.DIR,
      refId: (_m, p) => p.dirId,
    },
    {
      re: /^\/app\/workspace\/journals\/([^/]+)$/,
      entityType: NamedEntityTag.JOURNAL,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/vacations\/([^/]+)$/,
      entityType: NamedEntityTag.VACATION,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/smart-lists\/([^/]+)$/,
      entityType: NamedEntityTag.SMART_LIST,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/metrics\/([^/]+)$/,
      entityType: NamedEntityTag.METRIC,
      refId: (_m, p) => p.id,
    },
    {
      re: /^\/app\/workspace\/prm\/persons\/([^/]+)$/,
      entityType: NamedEntityTag.PERSON,
      refId: (_m, p) => p.id,
    },
  ];

  for (const pattern of patterns) {
    const match = pathname.match(pattern.re);
    if (match === null) {
      continue;
    }
    const entityRefId = pattern.refId(match, params) ?? match[1];
    if (entityRefId === undefined || entityRefId.length === 0) {
      return null;
    }
    // Skip non-entity doc routes such as settings / root-redirect.
    if (
      pattern.entityType === NamedEntityTag.DIR &&
      (entityRefId === "settings" ||
        entityRefId === "root-redirect" ||
        entityRefId === "new")
    ) {
      return null;
    }
    if (
      entityRefId === "new" ||
      entityRefId === "settings" ||
      entityRefId === "no-parent"
    ) {
      return null;
    }
    return {
      entityType: pattern.entityType,
      entityRefId,
    };
  }

  return null;
}
