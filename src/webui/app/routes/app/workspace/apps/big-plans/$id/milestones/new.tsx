import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { getSuggestedDatesForBigPlanMilestoneDate } from "@jupiter/core/common/suggested-date";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { DateInputWithSuggestions } from "@jupiter/core/infra/component/date-input-with-suggestions";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { remountOnCreateAnother } from "~/rendering/remount-on-create-another";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  date: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: bigPlanId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.bigPlans.bigPlanMilestoneCreate({
      big_plan_ref_id: bigPlanId,
      date: form.date,
      name: form.name,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/big-plans/${bigPlanId}/milestones/${result.new_big_plan_milestone.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function BigPlanMilestoneNew() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: bigPlanId } = useParams();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="big-plan-milestones/new"
      isLeaflet
      fakeKey="big-plan-milestones/new"
      returnLocation={`/app/workspace/apps/big-plans/${bigPlanId}`}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="big-plan-milestone-properties"
        title="Properties"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="big-plan-milestone-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput label="Name" name="name" readOnly={!inputsEnabled} />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="date" shrink margin="dense">
            Date
          </InputLabel>
          <DateInputWithSuggestions
            name="date"
            label="date"
            inputsEnabled={inputsEnabled}
            defaultValue={topLevelInfo.today}
            suggestedDates={getSuggestedDatesForBigPlanMilestoneDate(
              topLevelInfo.today,
            )}
          />
          <FieldError actionResult={actionData} fieldName="/date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export default remountOnCreateAnother(BigPlanMilestoneNew);

export const ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  error: () => `There was an error creating the milestone! Please try again!`,
});
