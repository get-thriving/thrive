const NAME_FIELDS = ["name", "title"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nameOf(entity: Record<string, unknown>, refId: string): string | null {
  if (String(entity.ref_id) !== refId) {
    return null;
  }
  for (const field of NAME_FIELDS) {
    const value = entity[field];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return null;
}

/**
 * The name of the entity with this ref id in what a route loaded: the first
 * object, among the loader's values and the values of those, that is that
 * entity (it has the ref id) and has a name or a title. A loader returns the
 * entity it is for under a key of its own (`habit`, `smartListItem`), with the
 * lists of the others it needs beside it, so this finds it without the route
 * saying where it is. Null when there is none.
 */
export function strataEntityName(data: unknown, refId: string): string | null {
  if (!isRecord(data) || refId === "") {
    return null;
  }
  const values = Object.values(data);
  for (const value of values) {
    if (isRecord(value)) {
      const name = nameOf(value, refId);
      if (name !== null) {
        return name;
      }
    }
  }
  for (const value of values) {
    if (isRecord(value)) {
      for (const inner of Object.values(value)) {
        if (isRecord(inner)) {
          const name = nameOf(inner, refId);
          if (name !== null) {
            return name;
          }
        }
      }
    }
  }
  return null;
}
