/**
 * The intents of a creation form opened from the time plan view.
 *
 * "Create" makes the entity and its activity, merges them into the store and
 * goes on to the activity; "Create & Another" makes it and puts up a fresh
 * form. Neither reloads the plan.
 */
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";

import { useTimePlanMutation } from "#/core/apps/time_plans/store/mutation";
import type { TimePlanMutation } from "#/core/apps/time_plans/store/mutation";
import type {
  CreateInTimePlanArgs,
  CreatedInTimePlan,
} from "#/core/apps/time_plans/store/mutations/create-entities";
import { formFieldsFromFormData } from "#/core/apps/time_plans/store/mutations/create-entities";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import type { IntentHandlers } from "#/core/infra/component/intent-interceptor";
import { CREATE_AND_ANOTHER_INTENT } from "#/core/infra/create-and-another";

export interface TimePlanCreateIntentsOptions {
  timePlanRefId: string;
  timePlanView: URLSearchParams;
  // Fields the form doesn't have, like the big plan an inbox task is for.
  extraFields?: Record<string, string>;
  // Where "Create" goes once done: this activity, rather than the new one.
  activityRefIdAfterCreate?: string;
}

export interface TimePlanCreateIntents {
  intentHandlers: IntentHandlers;
  inFlight: boolean;
  error: SomeErrorNoData | null;
  // Changes with every "Create & Another", for the form to be built anew.
  formKey: number;
}

export function useTimePlanCreateIntents<Result extends CreatedInTimePlan>(
  mutation: TimePlanMutation<CreateInTimePlanArgs, Result>,
  options: TimePlanCreateIntentsOptions,
): TimePlanCreateIntents {
  const navigate = useNavigate();
  const { runForResult, inFlight, error } = useTimePlanMutation(mutation);
  const [formKey, setFormKey] = useState(0);

  const { timePlanRefId, timePlanView, activityRefIdAfterCreate } = options;
  const extraFieldsKey = JSON.stringify(options.extraFields ?? {});

  const intentHandlers = useMemo(() => {
    const extraFields = JSON.parse(extraFieldsKey) as Record<string, string>;
    const create = (another: boolean) => (formData: FormData) => {
      void runForResult({
        timePlanRefId,
        fields: { ...formFieldsFromFormData(formData), ...extraFields },
      }).then((result) => {
        if (result === null) {
          return;
        }
        if (another) {
          setFormKey((key) => key + 1);
          return;
        }
        const activityRefId =
          activityRefIdAfterCreate ?? result.new_time_plan_activity?.ref_id;
        navigate(
          withTimePlanView(
            activityRefId === undefined
              ? `/app/workspace/apps/time-plans/${timePlanRefId}`
              : `/app/workspace/apps/time-plans/${timePlanRefId}/${activityRefId}`,
            timePlanView,
          ),
        );
      });
    };
    return {
      create: create(false),
      [CREATE_AND_ANOTHER_INTENT]: create(true),
    };
  }, [
    runForResult,
    timePlanRefId,
    timePlanView,
    activityRefIdAfterCreate,
    extraFieldsKey,
    navigate,
  ]);

  return { intentHandlers, inFlight, error, formKey };
}
