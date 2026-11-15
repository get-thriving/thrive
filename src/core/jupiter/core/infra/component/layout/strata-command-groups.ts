import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import type { StrataCommandGroup } from "#/core/infra/component/layout/strata-command-group";
import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";

/** What the entries of the `⋯` menu of the column are listed under. */
export const STRATA_MENU_GROUP_TITLE = "Menu";

/** What one source gave, with the title it goes under. */
export interface StrataCommandsUnder {
  title: string;
  commands: StrataCommand[];
}

/** The kinds of command that are in the column's menu, not under a title. */
const IN_THE_MENU = new Set([
  StrataCommandKind.MENU,
  StrataCommandKind.POSITION,
]);

/** The commands with a rule above the one at `index`, which is not first. */
function withRuleBefore(
  commands: StrataCommand[],
  index: number,
): StrataCommand[] {
  if (index <= 0 || index >= commands.length || commands[index].ruleBefore) {
    return commands;
  }
  return commands.map((command, at) =>
    at === index ? { ...command, ruleBefore: true } : command,
  );
}

/**
 * Puts commands under their titles, in the order they came: the sources of a
 * title that follow one another are one group, and a source with nothing to
 * run leaves no group. The same title coming back later, after another's, is
 * a group of its own, as on screen where it is another place.
 *
 * The commands of the column's menu are taken out of whatever group their
 * source is in and put together in one last group, even when the column has no
 * sections: they are rarely used, so they are kept apart from the actions of
 * the column and the sections, and at the end. In it the way along the
 * collection (previous and next item) comes first, then a rule, then the
 * entries of the `⋯` menu, which set apart with a rule of their own what
 * destroys (archive, remove).
 *
 * Under each title the commands that lay the section out (collapse, split out)
 * come last, after its actions and a rule.
 */
export function strataCommandGroups(
  sources: readonly StrataCommandsUnder[],
): StrataCommandGroup[] {
  const groups: StrataCommandGroup[] = [];
  const position: StrataCommand[] = [];
  const entries: StrataCommand[] = [];
  for (const source of sources) {
    const own = source.commands.filter(
      (command) => !IN_THE_MENU.has(command.kind),
    );
    position.push(
      ...source.commands.filter(
        (command) => command.kind === StrataCommandKind.POSITION,
      ),
    );
    entries.push(
      ...source.commands.filter(
        (command) => command.kind === StrataCommandKind.MENU,
      ),
    );
    if (own.length === 0) {
      continue;
    }
    const last = groups[groups.length - 1];
    if (last !== undefined && last.title === source.title) {
      last.commands.push(...own);
    } else {
      groups.push({ title: source.title, commands: [...own], menu: false });
    }
  }
  for (const group of groups) {
    const others = group.commands.filter(
      (command) => command.kind !== StrataCommandKind.LAYOUT,
    );
    const layout = group.commands.filter(
      (command) => command.kind === StrataCommandKind.LAYOUT,
    );
    group.commands = withRuleBefore([...others, ...layout], others.length);
  }
  if (position.length > 0 || entries.length > 0) {
    groups.push({
      title: STRATA_MENU_GROUP_TITLE,
      commands: withRuleBefore([...position, ...entries], position.length),
      menu: true,
    });
  }
  return groups;
}
