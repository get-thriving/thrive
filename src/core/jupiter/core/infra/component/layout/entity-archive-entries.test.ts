import { describe, expect, it } from "vitest";

import { entityArchiveEntries } from "#/core/infra/component/layout/entity-archive-entries";

const BASE = {
  idPrefix: "leaf",
  canArchive: true,
  canRemove: true,
  archived: false,
  notEditable: false,
  inputsEnabled: true,
  onSelect: () => {},
};

function disabled(overrides: Partial<typeof BASE>) {
  const [archive, remove] = entityArchiveEntries({ ...BASE, ...overrides });
  return { archive: archive.disabled, remove: remove.disabled };
}

describe("entityArchiveEntries", () => {
  it("offers archive and delete as two entries, delete last", () => {
    const entries = entityArchiveEntries(BASE);
    expect(entries.map((entry) => entry.id)).toEqual([
      "leaf-entity-archive",
      "leaf-entity-remove",
    ]);
    expect(entries.every((entry) => entry.danger)).toBe(true);
    expect(entries[0].divided).toBe(true);
  });

  it("archives a live entity, and can't delete it yet", () => {
    expect(disabled({})).toEqual({ archive: false, remove: true });
  });

  it("deletes an archived entity, and can't archive it again", () => {
    expect(disabled({ archived: true })).toEqual({
      archive: true,
      remove: false,
    });
  });

  it("needs inputs to archive but not to delete", () => {
    expect(disabled({ inputsEnabled: false })).toEqual({
      archive: true,
      remove: true,
    });
    expect(disabled({ inputsEnabled: false, archived: true }).remove).toBe(
      false,
    );
  });

  it("disables both for an entity that can't be edited", () => {
    expect(disabled({ notEditable: true })).toEqual({
      archive: true,
      remove: true,
    });
    expect(disabled({ notEditable: true, archived: true }).remove).toBe(true);
  });

  it("disables what the panel does not offer", () => {
    expect(disabled({ canArchive: false })).toEqual({
      archive: true,
      remove: true,
    });
    expect(disabled({ canRemove: false, archived: true })).toEqual({
      archive: true,
      remove: true,
    });
  });
});
