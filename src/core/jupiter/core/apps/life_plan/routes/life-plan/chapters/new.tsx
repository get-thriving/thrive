import {
  LifePlan,
  MilestoneSummary,
  AspectSummary,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import {
  SectionCard,
  ActionsPosition,
} from "#/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { PartialDateSelect } from "#/core/apps/life_plan/component/partial-date-select";
import { AspectSelect } from "#/core/apps/life_plan/sub/aspects/component/select";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "#/core/infra/create-and-another";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  aspect: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_aspects: true,
    include_milestones: true,
  });
  return {
    lifePlan: summaryResponse.life_plan as LifePlan,
    allMilestones: summaryResponse.milestones as MilestoneSummary[],
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
    rootAspect: summaryResponse.root_aspect as AspectSummary,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.lifePlan.chapterCreate({
      name: form.name,
      aspect_ref_id: form.aspect,
      start_date: form.startDate,
      end_date: form.endDate,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/life-plan/chapters/${response.new_chapter.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewChapter() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="chapters/new"
      fakeKey={"chapters/new"}
      isLeaflet
      returnLocation="/app/workspace/apps/life-plan/chapters"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Chapter"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="chapter-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "chapter-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "chapter-create-and-another",
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
            placeholder="Chapter name"
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
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="startDate">Start Date</FormLabel>
          <PartialDateSelect
            maxAge={loaderData.lifePlan.max_age}
            name="startDate"
            initialDate={null}
            inputsEnabled={inputsEnabled}
            allMilestones={loaderData.allMilestones}
          />
          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="endDate">End Date</FormLabel>
          <PartialDateSelect
            maxAge={loaderData.lifePlan.max_age}
            name="endDate"
            initialDate={null}
            inputsEnabled={inputsEnabled}
            allMilestones={loaderData.allMilestones}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/life-plan/chapters",
  ParamsSchema,
  {
    notFound: () => `Could not find the chapter!`,
    error: () => `There was an error creating the chapter! Please try again!`,
  },
);
