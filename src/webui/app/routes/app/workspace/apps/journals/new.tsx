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
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  initialToday: z.string().optional(),
  initialPeriod: z.nativeEnum(RecurringTaskPeriod).optional(),
});

const CreateFormSchema = z.object({
  rightNow: z.string(),
  period: z.nativeEnum(RecurringTaskPeriod),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.journals.journalCreate({
      right_now: form.rightNow,
      period: form.period,
    });

    return redirect(
      `/app/workspace/apps/journals/${result.new_journal.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewJournal() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const [queryRaw] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";

  const query = parseQuery(queryRaw, QuerySchema);
  const initialToday = query.initialToday || topLevelInfo.today;
  const initialPeriod = query.initialPeriod || RecurringTaskPeriod.WEEKLY;

  return (
    <LeafPanel
      key="journals/new"
      fakeKey={`journals-${initialToday}-${initialPeriod}/new`}
      returnLocation="/app/workspace/apps/journals"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Journal"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="journal-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "journal-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="rightNow" shrink margin="dense">
            The Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="rightNow"
            name="rightNow"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
            defaultValue={initialToday}
          />

          <FieldError actionResult={actionData} fieldName="/right_now" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="period">Period</FormLabel>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={inputsEnabled}
            defaultValue={initialPeriod}
          />
          <FieldError actionResult={actionData} fieldName="/period" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/journals",
  ParamsSchema,
  {
    error: () => `There was an error creating the journal! Please try again!`,
  },
);
