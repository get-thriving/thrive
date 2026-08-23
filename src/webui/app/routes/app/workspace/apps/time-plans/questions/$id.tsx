import type { TimePlanQuestion } from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.timePlans.timePlanQuestionLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      timePlanQuestion: result.time_plan_question as TimePlanQuestion,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.timePlans.timePlanQuestionUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
        });

        return redirect(`/app/workspace/apps/time-plans/questions/${id}`);
      }

      case "archive": {
        await apiClient.timePlans.timePlanQuestionArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/apps/time-plans/questions/${id}`);
      }

      case "remove": {
        await apiClient.timePlans.timePlanQuestionRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/apps/time-plans/questions`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function TimePlanQuestionDetail() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id } = useParams();
  const inputsEnabled = navigation.state === "idle";

  const timePlanQuestion = loaderData.timePlanQuestion;

  return (
    <LeafPanel
      key={`time-plans/questions/${timePlanQuestion.ref_id}`}
      fakeKey={`time-plans/questions/${timePlanQuestion.ref_id}`}
      returnLocation="/app/workspace/apps/time-plans/questions"
      inputsEnabled={inputsEnabled}
      showArchiveAndRemoveButton
      entityArchived={timePlanQuestion.archived}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title={`Question #${timePlanQuestion.name}`}
        actions={
          <SectionActions
            id={`time-plan-question-${timePlanQuestion.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "time-plan-question-update",
                text: "Update",
                value: "update",
                highlight: true,
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
            defaultValue={timePlanQuestion.name}
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/name/value" />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="period">Period</FormLabel>
          {periodName(timePlanQuestion.period)}
        </FormControl>

        <input name="id" type="hidden" value={id ?? timePlanQuestion.ref_id} />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/apps/time-plans/questions`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan question #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan question #${params.id}! Please try again!`,
  },
);
