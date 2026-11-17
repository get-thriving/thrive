import type { WorkspaceFeature } from "@jupiter/webapi-client";

import type { ActionDesc } from "#/core/infra/component/section-actions";
import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";
import { strataMakeCommand } from "#/core/infra/component/layout/strata-make-command";

/** What running the actions of a section needs of the page they are on. */
export interface StrataActionsHost {
  /** Whether a feature of the workspace is on, which some actions depend on. */
  isAvailable: (feature: WorkspaceFeature) => boolean;
  /** The section's inputs are not locked, as while it saves. */
  inputsEnabled: boolean;
  /** Goes to a page, keeping the filters of the sections that stay. */
  go: (link: string) => void;
  /**
   * Submits the form the actions are in, with this intent; or the form with
   * the id the action names, when it is drawn apart from it.
   */
  submit: (intent: string, form?: string) => void;
}

/** How many chosen options a filter names before it says how many more. */
const DETAIL_NAMES = 2;

function command(
  id: string,
  label: string,
  kind: StrataCommandKind,
  run: () => void,
  extra?: Partial<Pick<StrataCommand, "disabled" | "current">>,
): StrataCommand {
  return strataMakeCommand({ id, label, kind, run, ...extra });
}

/** `By Aspect`, or `Copii, Colinde +2`: what a filter has chosen, short. */
function detailOf(chosen: readonly string[]): string | null {
  if (chosen.length === 0) {
    return null;
  }
  const named = chosen.slice(0, DETAIL_NAMES).join(", ");
  const more = chosen.length - DETAIL_NAMES;
  return more > 0 ? `${named} +${more}` : named;
}

/**
 * The commands that the actions of a section stand for, in the order the
 * section draws them, whatever way it draws them: spread out, or behind a
 * drop-down, or in the dialog of a phone. What it leaves out is what the
 * screen leaves out: an action that depends on a feature the workspace has
 * not got, one with no text, a filter with one choice (it has nothing to
 * choose), and the dividers. A locked section, or a dimmed button, makes a
 * command that is listed and cannot be run. A filter is one command, named for
 * the filter and saying what it has chosen, that opens its choices instead of
 * running (`choices`): a choice of a few options sets that one (and the one
 * that is on is listed as such, with nothing to run), a choice of many turns
 * that one on or off and leaves the menu open for the next.
 */
export function strataCommandsOfActions(
  actions: readonly ActionDesc[],
  host: StrataActionsHost,
): StrataCommand[] {
  const commands: StrataCommand[] = [];
  const gated = (feature: WorkspaceFeature | undefined) =>
    feature !== undefined && !host.isAvailable(feature);

  actions.forEach((action, at) => {
    const id = `${at}`;
    switch (action.kind) {
      case "nav-single": {
        if (gated(action.gatedOn) || action.text === undefined) {
          return;
        }
        const link = action.link;
        commands.push(
          command(
            id,
            action.text,
            StrataCommandKind.NAVIGATE,
            () => host.go(link),
            { disabled: !host.inputsEnabled || action.disabled === true },
          ),
        );
        return;
      }
      case "nav-multiple": {
        action.navs.forEach((nav, index) => {
          if (
            nav.kind === "nav-separator" ||
            gated(nav.gatedOn) ||
            nav.text === undefined
          ) {
            return;
          }
          const link = nav.link;
          commands.push(
            command(
              `${id}.${index}`,
              nav.text,
              StrataCommandKind.NAVIGATE,
              () => host.go(link),
              { disabled: !host.inputsEnabled || nav.disabled === true },
            ),
          );
        });
        return;
      }
      case "action-single": {
        if (gated(action.gatedOn) || action.text === undefined) {
          return;
        }
        const value = action.value;
        const form = action.form;
        commands.push(
          command(
            id,
            action.text,
            StrataCommandKind.ACTION,
            () => host.submit(value, form),
            { disabled: !host.inputsEnabled || action.disabled === true },
          ),
        );
        return;
      }
      case "action-multiple": {
        action.actions.forEach((single, index) => {
          if (gated(single.gatedOn) || single.text === undefined) {
            return;
          }
          const value = single.value;
          const form = single.form;
          commands.push(
            command(
              `${id}.${index}`,
              single.text,
              StrataCommandKind.ACTION,
              () => host.submit(value, form),
              { disabled: !host.inputsEnabled || single.disabled === true },
            ),
          );
        });
        return;
      }
      case "button-single": {
        if (gated(action.gatedOn)) {
          return;
        }
        commands.push(
          command(id, action.text, StrataCommandKind.ACTION, action.onClick, {
            disabled: !host.inputsEnabled || action.disabled === true,
          }),
        );
        return;
      }
      case "filter-few-options": {
        const options = action.options.filter(
          (option) => !gated(option.gatedOn),
        );
        if (action.hideIfOneOption === true && options.length <= 1) {
          return;
        }
        const choices = options.map((option, index) => {
          const current = option.value === action.defaultOption;
          return command(
            `${id}.${index}`,
            option.text,
            StrataCommandKind.FILTER,
            () => action.onSelect(option.value),
            {
              // What is on already has nothing to run.
              disabled:
                current || !host.inputsEnabled || option.disabled === true,
              current,
            },
          );
        });
        commands.push(
          strataMakeCommand({
            id,
            label: action.title,
            kind: StrataCommandKind.FILTER,
            run: () => undefined,
            disabled: choices.every((choice) => choice.disabled),
            choices,
            detail: detailOf(
              choices.filter((choice) => choice.current).map((c) => c.label),
            ),
          }),
        );
        return;
      }
      case "filter-many-options": {
        const options = action.options.flatMap((option) =>
          "separator" in option || gated(option.gatedOn) ? [] : [option],
        );
        if (action.hideIfOneOption === true && options.length <= 1) {
          return;
        }
        const choices = options.map((option, index) => {
          const current = action.selected.includes(option.value);
          return strataMakeCommand({
            id: `${id}.${index}`,
            label: option.text,
            kind: StrataCommandKind.FILTER,
            run: () =>
              action.onSelect(
                current
                  ? action.selected.filter((value) => value !== option.value)
                  : [...action.selected, option.value],
              ),
            disabled: !host.inputsEnabled || option.disabled === true,
            current,
            stays: true,
          });
        });
        commands.push(
          strataMakeCommand({
            id,
            label: action.title,
            kind: StrataCommandKind.FILTER,
            run: () => undefined,
            disabled: choices.every((choice) => choice.disabled),
            choices,
            searchable: true,
            detail: detailOf(
              choices.filter((choice) => choice.current).map((c) => c.label),
            ),
          }),
        );
        return;
      }
    }
  });
  return commands;
}
