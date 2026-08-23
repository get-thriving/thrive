import { RecurringTaskPeriod } from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
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
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { remountOnCreateAnother } from "~/rendering/remount-on-create-another";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  period: z.nativeEnum(RecurringTaskPeriod),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.journals.journalQuestionCreate({
      name: form.name,
      period: form.period,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/journals/questions/${result.new_journal_question.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function NewJournalQuestion() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="journals/questions/new"
      fakeKey="journals/questions/new"
      returnLocation="/app/workspace/apps/journals/questions"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Question"
        actions={
          <SectionActions
            id="journal-question-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "journal-question-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "journal-question-create-and-another",
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
            defaultValue={""}
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="period">Period</FormLabel>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={inputsEnabled}
            defaultValue={RecurringTaskPeriod.WEEKLY}
          />
          <FieldError actionResult={actionData} fieldName="/period" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export default remountOnCreateAnother(NewJournalQuestion);

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/journals/questions",
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the journal question! Please try again!`,
  },
);
