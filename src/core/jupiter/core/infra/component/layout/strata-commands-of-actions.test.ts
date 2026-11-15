import { describe, expect, it, vi } from "vitest";
import type { WorkspaceFeature } from "@jupiter/webapi-client";

import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";
import {
  strataCommandsOfActions,
  type StrataActionsHost,
} from "#/core/infra/component/layout/strata-commands-of-actions";
import type { ActionDesc } from "#/core/infra/component/section-actions";

const FEATURE = "habits" as WorkspaceFeature;

function host(over: Partial<StrataActionsHost> = {}): StrataActionsHost {
  return {
    isAvailable: () => true,
    inputsEnabled: true,
    go: vi.fn(),
    submit: vi.fn(),
    ...over,
  };
}

describe("strataCommandsOfActions", () => {
  it("makes a navigation that goes to its link", () => {
    const h = host();
    const [command] = strataCommandsOfActions(
      [{ kind: "nav-single", text: "Settings", link: "settings" }],
      h,
    );
    expect(command.label).toBe("Settings");
    expect(command.kind).toBe(StrataCommandKind.NAVIGATE);
    expect(command.disabled).toBe(false);
    command.run();
    expect(h.go).toHaveBeenCalledWith("settings");
  });

  it("makes an action that submits its intent", () => {
    const h = host();
    const [command] = strataCommandsOfActions(
      [{ kind: "action-single", text: "Create", value: "create" }],
      h,
    );
    expect(command.kind).toBe(StrataCommandKind.ACTION);
    command.run();
    expect(h.submit).toHaveBeenCalledWith("create", undefined);
  });

  it("makes an action drawn apart from its form submit that form", () => {
    const h = host();
    const [command] = strataCommandsOfActions(
      [
        {
          kind: "action-single",
          text: "Save",
          value: "update",
          form: "settings-form",
        },
      ],
      h,
    );
    command.run();
    expect(h.submit).toHaveBeenCalledWith("update", "settings-form");
  });

  it("makes a button that calls its handler", () => {
    const onClick = vi.fn();
    const [command] = strataCommandsOfActions(
      [{ kind: "button-single", text: "Add", onClick }],
      host(),
    );
    command.run();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("lists every item of a group of actions or navigations, dividers apart", () => {
    const commands = strataCommandsOfActions(
      [
        {
          kind: "nav-multiple",
          approach: "compact",
          navs: [
            { kind: "nav-single", text: "One", link: "1" },
            { kind: "nav-separator" },
            { kind: "nav-single", text: "Two", link: "2" },
          ],
        },
        {
          kind: "action-multiple",
          approach: "compact",
          actions: [
            { kind: "action-single", text: "Save", value: "save" },
            { kind: "action-single", text: "Discard", value: "discard" },
          ],
        },
      ],
      host(),
    );
    expect(commands.map((c) => c.label)).toEqual([
      "One",
      "Two",
      "Save",
      "Discard",
    ]);
    expect(new Set(commands.map((c) => c.id)).size).toBe(4);
  });

  it("leaves out what the screen leaves out", () => {
    const commands = strataCommandsOfActions(
      [
        {
          kind: "action-single",
          text: "Gated",
          value: "gated",
          gatedOn: FEATURE,
        },
        { kind: "action-single", value: "icon-only" },
        { kind: "nav-single", text: "Kept", link: "kept" },
      ],
      host({ isAvailable: () => false }),
    );
    expect(commands.map((c) => c.label)).toEqual(["Kept"]);
  });

  it("lists a dimmed button, or all of them in a locked section, as disabled", () => {
    const actions: ActionDesc[] = [
      { kind: "action-single", text: "Dim", value: "dim", disabled: true },
      { kind: "action-single", text: "Live", value: "live" },
    ];
    expect(
      strataCommandsOfActions(actions, host()).map((c) => c.disabled),
    ).toEqual([true, false]);
    expect(
      strataCommandsOfActions(actions, host({ inputsEnabled: false })).map(
        (c) => c.disabled,
      ),
    ).toEqual([true, true]);
  });

  it("makes one command of a filter of few options, with its choices inside, the one on having nothing to run", () => {
    const onSelect = vi.fn();
    const commands = strataCommandsOfActions(
      [
        {
          kind: "filter-few-options",
          title: "Show",
          approach: "spread",
          defaultOption: "all",
          options: [
            { value: "all", text: "All" },
            { value: "done", text: "Done" },
          ],
          onSelect,
        },
      ],
      host(),
    );
    expect(commands).toHaveLength(1);
    const [filter] = commands;
    expect(filter.label).toBe("Show");
    expect(filter.kind).toBe(StrataCommandKind.FILTER);
    expect(filter.disabled).toBe(false);
    expect(filter.detail).toBe("All");
    expect(
      filter.choices.map((c) => [c.label, c.current, c.disabled, c.stays]),
    ).toEqual([
      ["All", true, true, false],
      ["Done", false, false, false],
    ]);
    filter.choices[1].run();
    expect(onSelect).toHaveBeenCalledWith("done");
  });

  it("makes one command of a filter of many, whose choices turn on or off and stay open", () => {
    const onSelect = vi.fn();
    const commands = strataCommandsOfActions(
      [
        {
          kind: "filter-many-options",
          title: "Tags",
          options: [
            { value: "a", text: "Alpha" },
            { separator: true },
            { value: "b", text: "Beta" },
            { value: "c", text: "Gamma" },
          ],
          selected: ["a", "b", "c"],
          onSelect,
        },
      ],
      host(),
    );
    expect(commands).toHaveLength(1);
    const [filter] = commands;
    expect(filter.label).toBe("Tags");
    expect(filter.detail).toBe("Alpha, Beta +1");
    expect(filter.choices.map((c) => [c.label, c.current, c.stays])).toEqual([
      ["Alpha", true, true],
      ["Beta", true, true],
      ["Gamma", true, true],
    ]);
    filter.choices[0].run();
    expect(onSelect).toHaveBeenLastCalledWith(["b", "c"]);
  });

  it("adds a choice that was off, and says nothing of a filter with none on", () => {
    const onSelect = vi.fn();
    const [filter] = strataCommandsOfActions(
      [
        {
          kind: "filter-many-options",
          title: "Tags",
          options: [
            { value: "a", text: "Alpha" },
            { value: "b", text: "Beta" },
          ],
          selected: ["a"],
          onSelect,
        },
      ],
      host(),
    );
    filter.choices[1].run();
    expect(onSelect).toHaveBeenLastCalledWith(["a", "b"]);
    const [none] = strataCommandsOfActions(
      [
        {
          kind: "filter-many-options",
          title: "Tags",
          options: [
            { value: "a", text: "Alpha" },
            { value: "b", text: "Beta" },
          ],
          selected: [],
          onSelect,
        },
      ],
      host(),
    );
    expect(none.detail).toBeNull();
  });

  it("lists a filter as disabled when nothing in it can be chosen", () => {
    const [filter] = strataCommandsOfActions(
      [
        {
          kind: "filter-few-options",
          title: "Show",
          approach: "spread",
          defaultOption: "all",
          options: [
            { value: "all", text: "All" },
            { value: "done", text: "Done" },
          ],
          onSelect: () => undefined,
        },
      ],
      host({ inputsEnabled: false }),
    );
    expect(filter.disabled).toBe(true);
  });

  it("leaves out a filter that has one choice and hides itself", () => {
    expect(
      strataCommandsOfActions(
        [
          {
            kind: "filter-few-options",
            title: "Show",
            approach: "spread",
            defaultOption: "all",
            options: [{ value: "all", text: "All" }],
            onSelect: () => undefined,
            hideIfOneOption: true,
          },
          {
            kind: "filter-many-options",
            title: "Tags",
            options: [{ value: "a", text: "Alpha" }],
            selected: [],
            onSelect: () => undefined,
            hideIfOneOption: true,
          },
        ],
        host(),
      ),
    ).toEqual([]);
  });
});
