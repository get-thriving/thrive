import type { ColumnMenuEntry } from "#/core/infra/component/layout/column-menu-entry";

interface EntityArchiveEntriesArgs {
  /** The entries' ids are `<prefix>-entity-archive` and `<prefix>-entity-remove`. */
  idPrefix: string;
  /** The panel lets the entity be archived. */
  canArchive: boolean;
  /** The panel lets an archived entity be removed for good. */
  canRemove: boolean;
  archived: boolean;
  notEditable: boolean;
  inputsEnabled: boolean;
  /** Opens the dialog that asks, which the panel draws. */
  onSelect: () => void;
}

/**
 * The two commands that end an entity, last in the `⋯` menu of a panel (ADR
 * 0021), set apart and in the danger colour: "Archive…" and "Delete
 * permanently…". Both are always there; each is disabled while it does not
 * apply: archiving once archived or when the entity can't be edited, removing
 * until it has been archived.
 */
export function entityArchiveEntries(
  args: EntityArchiveEntriesArgs,
): ColumnMenuEntry[] {
  return [
    {
      id: `${args.idPrefix}-entity-archive`,
      label: "Archive…",
      danger: true,
      divided: true,
      disabled:
        !args.canArchive ||
        args.archived ||
        args.notEditable ||
        !args.inputsEnabled,
      onSelect: args.onSelect,
    },
    {
      id: `${args.idPrefix}-entity-remove`,
      label: "Delete permanently…",
      danger: true,
      disabled: !args.canRemove || !args.archived || args.notEditable,
      onSelect: args.onSelect,
    },
  ];
}
