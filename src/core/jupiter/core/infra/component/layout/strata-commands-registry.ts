import type { StrataCommandGroup } from "#/core/infra/component/layout/strata-command-group";
import { strataCommandGroups } from "#/core/infra/component/layout/strata-command-groups";
import type { StrataCommandSource } from "#/core/infra/component/layout/strata-command-source";

/** The title of what a column has outside any section, when it has no name. */
const COLUMN_TITLE = "Column";

/**
 * Which sources are on screen now, and so the commands of a column. The
 * sources register as they are drawn and take themselves out as they go, and
 * the menu asks for the commands of a column only when it opens: nothing is
 * kept up to date in between, so a page of 200 sections costs nothing until `x`.
 */
export class StrataCommandsRegistry {
  private readonly sources = new Set<StrataCommandSource>();
  private readonly listeners = new Set<() => void>();

  /**
   * Calls `listener` whenever a source may have different commands, which is
   * every time one is drawn: a filter's choice that was made shows up as chosen
   * in a menu that is open. Returns the way to stop.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** A source was drawn again, so what it offers may have changed. */
  changed(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /** Adds a source; returns the way to take it out again. */
  register(source: StrataCommandSource): () => void {
    this.sources.add(source);
    return () => {
      this.sources.delete(source);
    };
  }

  /**
   * The commands of a column, under the titles of the sections they are in, or
   * the column's own title for the ones in its header and its toolbar, in the
   * order they are on screen. Only sources that belong to the column itself
   * count, not those of a column nested in it, and only visible ones: those in
   * a collapsed section are not.
   */
  commandsOf(column: Element): StrataCommandGroup[] {
    const own: Array<{ element: Element; source: StrataCommandSource }> = [];
    for (const source of this.sources) {
      const element = source.element();
      if (
        element !== null &&
        element.closest("[data-strata-column]") === column &&
        element.getClientRects().length > 0
      ) {
        own.push({ element, source });
      }
    }
    own.sort((a, b) =>
      a.element === b.element
        ? 0
        : a.element.compareDocumentPosition(b.element) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
    );
    const columnTitle =
      column.querySelector("[data-strata-title]")?.textContent?.trim() ||
      COLUMN_TITLE;
    return strataCommandGroups(
      own.map(({ element, source }) => ({
        title:
          element
            .closest<HTMLElement>("[data-strata-section]")
            ?.getAttribute("data-strata-section-title") ?? columnTitle,
        commands: source.commands(),
      })),
    );
  }
}
