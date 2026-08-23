import { AspectSummary } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
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
import { AspectSelect } from "#/core/apps/life_plan/sub/aspects/component/select";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { remountOnCreateAnother } from "~/rendering/remount-on-create-another";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  aspect: z.string(),
  date: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
  });
  return json({
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
    rootAspect: summaryResponse.root_aspect as AspectSummary,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.lifePlan.milestoneCreate({
      name: form.name,
      aspect_ref_id: form.aspect,
      date: form.date,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/life-plan/milestones/${response.new_milestone.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function NewMilestone() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="milestones/new"
      isLeaflet
      fakeKey={"milestones/new"}
      returnLocation="/app/workspace/apps/life-plan/milestones"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Milestone"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="milestone-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "milestone-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "milestone-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!inputsEnabled}
            type="text"
            placeholder="Milestone name"
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <AspectSelect
            name="aspect"
            label="Aspect"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allAspects={loaderData.allAspects}
            defaultValue={loaderData.rootAspect.ref_id}
          />
          <FieldError actionResult={actionData} fieldName="/aspect_ref_id" />
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

export default remountOnCreateAnother(NewMilestone);

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/life-plan/milestones",
  ParamsSchema,
  {
    notFound: () => `Could not create the milestone!`,
    error: () => `There was an error creating the milestone! Please try again!`,
  },
);
