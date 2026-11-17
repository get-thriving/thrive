import type { RefObject } from "react";
import { useNavigate } from "react-router";

import type { ActionDesc } from "#/core/infra/component/section-actions";
import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { strataCommandsOfActions } from "#/core/infra/component/layout/strata-commands-of-actions";
import { strataSubmitIntent } from "#/core/infra/component/layout/strata-submit-intent";
import { useStrataCommands } from "#/core/infra/component/layout/use-strata-commands";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

/**
 * Offers the actions of a section to the menu of commands, from the same
 * descriptions it draws its buttons from, so every section's actions are in
 * it without the section saying so. Gives the commands back for the one that
 * draws them (the footer wants to know whether there are any).
 */
export function useStrataActionCommands(
  element: RefObject<HTMLElement | null>,
  actions: readonly ActionDesc[],
  inputsEnabled: boolean,
  topLevelInfo: TopLevelInfo,
): StrataCommand[] {
  const navigate = useNavigate();
  const preserveFilters = useSectionFiltersPreserver();
  const commands = strataCommandsOfActions(actions, {
    isAvailable: (feature) =>
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, feature),
    inputsEnabled,
    go: (link) => navigate(preserveFilters(link)),
    submit: (intent, form) => strataSubmitIntent(element.current, intent, form),
  });
  useStrataCommands(
    () => element.current,
    () => commands,
  );
  return commands;
}
