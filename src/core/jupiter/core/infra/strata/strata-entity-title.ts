/**
 * The title of the column of an entity: what it is and its number, such as
 * `Habit #344` or `Time Plan #4356`. The header sets it in capitals. The kind
 * comes from the name of the entity's tag, which is one word run into the next
 * (`TimePlan`), so it is split where the case changes.
 */
export function strataEntityTitle(entityType: string, refId: string): string {
  const kind = entityType.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return `${kind} #${refId}`;
}
