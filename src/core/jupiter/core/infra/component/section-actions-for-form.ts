import type { ActionDesc } from "#/core/infra/component/section-actions";

/**
 * The actions as they are for a form: each action that submits one, and does
 * not say which, submits this one. Used for a section's actions drawn in the
 * header of a column, where the form around them is not the section's.
 */
export function sectionActionsForForm(
  actions: readonly ActionDesc[],
  formId: string,
): ActionDesc[] {
  return actions.map((action) => {
    if (action.kind === "action-single") {
      return { ...action, form: action.form ?? formId };
    }
    if (action.kind === "action-multiple") {
      return {
        ...action,
        actions: action.actions.map((single) => ({
          ...single,
          form: single.form ?? formId,
        })),
      };
    }
    return action;
  });
}
