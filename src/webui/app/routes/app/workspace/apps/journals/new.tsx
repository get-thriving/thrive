import type { JournalQuestion } from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";
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
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { sortQuestionsByOrder } from "@jupiter/core/apps/journals/sub/question/root";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  initialToday: z.string().optional(),
  initialPeriod: z.nativeEnum(RecurringTaskPeriod).optional(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  rightNow: z.string(),
  period: z.nativeEnum(RecurringTaskPeriod),
  questionRefIds: z.string().transform((s) => (s === "" ? [] : s.split(","))),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  try {
    const questionsResponse = await apiClient.journals.journalQuestionFind({
      allow_archived: false,
    });

    return json({
      questions: questionsResponse.questions as Array<JournalQuestion>,
      orderOfQuestions: questionsResponse.order_of_questions,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.journals.journalCreate({
      right_now: form.rightNow,
      period: form.period,
      question_ref_ids: form.questionRefIds,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

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
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const [queryRaw] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";

  const query = parseQuery(queryRaw, QuerySchema);
  const initialToday = query.initialToday || topLevelInfo.today;
  const initialPeriod = query.initialPeriod || RecurringTaskPeriod.WEEKLY;
  const [period, setPeriod] = useState<RecurringTaskPeriod>(initialPeriod);

  const questionsForPeriod = useMemo(
    () =>
      sortQuestionsByOrder(
        loaderData.questions.filter((question) => question.period === period),
        loaderData.orderOfQuestions[period] ?? [],
      ),
    [loaderData.orderOfQuestions, loaderData.questions, period],
  );
  const [selectedQuestionRefIds, setSelectedQuestionRefIds] = useState<
    Set<string>
  >(() => new Set(questionsForPeriod.map((question) => question.ref_id)));

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
              ActionSingle({
                id: "journal-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
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
            value={period}
            onChange={(newPeriod) => {
              if (newPeriod !== "none" && !Array.isArray(newPeriod)) {
                setPeriod(newPeriod);
                setSelectedQuestionRefIds(
                  new Set(
                    sortQuestionsByOrder(
                      loaderData.questions.filter(
                        (question) => question.period === newPeriod,
                      ),
                      loaderData.orderOfQuestions[newPeriod] ?? [],
                    ).map((question) => question.ref_id),
                  ),
                );
              }
            }}
          />
          <FieldError actionResult={actionData} fieldName="/period" />
        </FormControl>

        <input
          type="hidden"
          name="questionRefIds"
          value={[...selectedQuestionRefIds].join(",")}
        />
        {questionsForPeriod.length > 0 && (
          <FormControl fullWidth>
            <FormLabel id="questions">Questions</FormLabel>
            <EntityStack>
              {questionsForPeriod.map((question) => (
                <EntityCard
                  key={`journal-new-question-${question.ref_id}`}
                  entityId={`journal-new-question-${question.ref_id}`}
                  allowSelect
                  selected={selectedQuestionRefIds.has(question.ref_id)}
                  onClick={() => {
                    setSelectedQuestionRefIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(question.ref_id)) {
                        next.delete(question.ref_id);
                      } else {
                        next.add(question.ref_id);
                      }
                      return next;
                    });
                  }}
                >
                  <EntityLink
                    to={`/app/workspace/apps/journals/questions/${question.ref_id}`}
                    block
                  >
                    <EntityNameComponent name={question.name} />
                  </EntityLink>
                </EntityCard>
              ))}
            </EntityStack>
            <FieldError
              actionResult={actionData}
              fieldName="/question_ref_ids"
            />
          </FormControl>
        )}
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
