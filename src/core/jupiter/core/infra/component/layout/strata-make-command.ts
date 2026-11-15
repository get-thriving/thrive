import type { StrataCommand } from "#/core/infra/component/layout/strata-command";

/** A command, with what it does not say left at what is usual. */
export function strataMakeCommand(
  command: Pick<StrataCommand, "id" | "label" | "kind" | "run"> &
    Partial<StrataCommand>,
): StrataCommand {
  return {
    disabled: false,
    current: false,
    danger: false,
    choices: [],
    detail: null,
    searchable: false,
    stays: false,
    ruleBefore: false,
    ...command,
  };
}
