import type { EntityId, JournalQuestion } from "@jupiter/webapi-client";
import { RecurringTaskPeriod, DocsHelpSubject } from "@jupiter/webapi-client";
import { z } from "zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { parseForm } from "zodix";
import {
  Form,
  Outlet,
  ShouldRevalidateFunction,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { IconButton, Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  JOURNAL_QUESTION_PERIOD_DISPLAY_ORDER,
  shiftQuestionDownInList,
  shiftQuestionUpInList,
  sortQuestionsByOrder,
} from "@jupiter/core/apps/journals/sub/question/root";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";
import { getIntent, makeIntent } from "~/logic/intent";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.object({
  intent: z.string(),
});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const questionsResponse = await apiClient.journals.journalQuestionFind({
    allow_archived: false,
  });

  return json({
    questions: questionsResponse.questions,
    orderOfQuestions: questionsResponse.order_of_questions,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  const { intent, args } = getIntent<{
    period: RecurringTaskPeriod;
    newOrderOfQuestions: EntityId[];
  }>(form.intent);

  try {
    switch (intent) {
      case "reorder": {
        if (!args?.period || !args?.newOrderOfQuestions) {
          throw new Error("Missing required arguments!");
        }

        await apiClient.journals.journalQuestionReorder({
          period: args.period,
          order_of_questions: args.newOrderOfQuestions,
        });

        return redirect("/app/workspace/apps/journals/questions");
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

export default function JournalQuestions() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const shouldShowALeaf = useBranchNeedsToShowLeaf();

  const periods = JOURNAL_QUESTION_PERIOD_DISPLAY_ORDER.filter((period) =>
    loaderData.questions.some((question) => question.period === period),
  );

  return (
    <BranchPanel
      key={"journals/questions"}
      createLocation="/app/workspace/apps/journals/questions/new"
      returnLocation="/app/workspace/apps/journals"
      inputsEnabled={inputsEnabled}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <GlobalError actionResult={actionData} />
        <Form method="post">
          <Stack spacing={2} useFlexGap>
            {loaderData.questions.length === 0 && (
              <EntityNoNothingCard
                title="You Have To Start Somewhere"
                message="There are no standard journal questions yet. Add one and it'll show up here, grouped by period."
                newEntityLocations="/app/workspace/apps/journals/questions/new"
                helpSubject={DocsHelpSubject.JOURNALS}
              />
            )}

            {periods.map((period) => (
              <QuestionList
                key={period}
                period={period}
                questions={loaderData.questions.filter(
                  (question) => question.period === period,
                )}
                orderOfQuestions={loaderData.orderOfQuestions[period] ?? []}
                inputsEnabled={inputsEnabled}
              />
            ))}
          </Stack>
        </Form>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/apps/journals",
  ParamsSchema,
  {
    notFound: () => `Could not find the journal questions!`,
    error: () =>
      `There was an error loading the journal questions! Please try again!`,
  },
);

interface QuestionListProps {
  period: RecurringTaskPeriod;
  questions: JournalQuestion[];
  orderOfQuestions: EntityId[];
  inputsEnabled: boolean;
}

function QuestionList(props: QuestionListProps) {
  const orderedQuestions = sortQuestionsByOrder(
    props.questions,
    props.orderOfQuestions,
  );
  const orderOfQuestions = orderedQuestions.map((question) => question.ref_id);

  return (
    <Stack spacing={1} useFlexGap>
      <StandardDivider
        title={`${periodName(props.period)} Questions`}
        size="small"
      />
      {orderedQuestions.map((question) => (
        <EntityCard
          entityId={`journal-question-${question.ref_id}`}
          key={`journal-question-${question.ref_id}`}
          indent={0}
          extraControls={
            <>
              <IconButton
                id={`journal-question-${question.ref_id}-up`}
                size="medium"
                type="submit"
                name="intent"
                disabled={!props.inputsEnabled}
                value={makeIntent("reorder", {
                  period: props.period,
                  newOrderOfQuestions: shiftQuestionUpInList(
                    question,
                    orderOfQuestions,
                  ),
                })}
              >
                <ArrowUpwardIcon fontSize="medium" />
              </IconButton>

              <IconButton
                id={`journal-question-${question.ref_id}-down`}
                size="medium"
                type="submit"
                name="intent"
                disabled={!props.inputsEnabled}
                value={makeIntent("reorder", {
                  period: props.period,
                  newOrderOfQuestions: shiftQuestionDownInList(
                    question,
                    orderOfQuestions,
                  ),
                })}
              >
                <ArrowDownwardIcon fontSize="medium" />
              </IconButton>
            </>
          }
        >
          <EntityLink
            to={`/app/workspace/apps/journals/questions/${question.ref_id}`}
          >
            <EntityNameComponent name={question.name} />
          </EntityLink>
        </EntityCard>
      ))}
    </Stack>
  );
}
