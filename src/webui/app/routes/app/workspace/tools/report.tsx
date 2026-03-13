import type {
  GoalSummary,
  ProjectSummary,
  ReportResult,
} from "@jupiter/webapi-client";
import { ApiError, RecurringTaskPeriod } from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { DateTime } from "luxon";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseQuery } from "zodix";
import { oneLessThanPeriod } from "@jupiter/core/common/recurring-task-period";
import { makeToolErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { ShowReport } from "@jupiter/core/report/component/show-report";
import type { ActionResult } from "@jupiter/core/infra/action-result";
import {
  isNoErrorSomeData,
  noErrorSomeData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const QuerySchema = z.object({
  today: z
    .string()
    .regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/)
    .optional(),
  period: z.nativeEnum(RecurringTaskPeriod).optional(),
  breakdownPeriod: z
    .union([z.nativeEnum(RecurringTaskPeriod), z.literal("none")])
    .optional(),
});

export const handle = {
  displayType: DisplayType.TOOL,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { today, period, breakdownPeriod } = parseQuery(request, QuerySchema);

  if (
    today === undefined ||
    period === undefined ||
    breakdownPeriod === undefined
  ) {
    return json(noErrorSomeData({ report: undefined }));
  }

  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
    include_goals: true,
  });

  try {
    const reportResponse = await apiClient.report.report({
      today: today,
      period: period,
      breakdown_period:
        breakdownPeriod !== "none" ? breakdownPeriod : undefined,
    });

    return json(
      noErrorSomeData({
        allProjects: summaryResponse.projects,
        allGoals: summaryResponse.goals,
        report: reportResponse,
      }),
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Report() {
  const loaderData = useLoaderDataSafeForAnimation<
    typeof loader
  >() as ActionResult<{
    allProjects: Array<ProjectSummary> | undefined;
    allGoals: Array<GoalSummary> | undefined;
    report: ReportResult | undefined;
  }>;
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const [period, setPeriod] = useState(RecurringTaskPeriod.MONTHLY);
  const [breakdownPeriod, setBreakdownPeriod] = useState<
    RecurringTaskPeriod | "none"
  >(RecurringTaskPeriod.WEEKLY);

  const inputsEnabled = navigation.state === "idle";

  function handleChangePeriod(
    newPeriod: RecurringTaskPeriod | RecurringTaskPeriod[] | "none",
  ) {
    if (newPeriod === "none") {
      return;
    }
    if (Array.isArray(newPeriod)) {
      newPeriod = newPeriod[0];
    }
    setPeriod(newPeriod);
    if (newPeriod === RecurringTaskPeriod.DAILY) {
      setBreakdownPeriod("none");
    } else {
      setBreakdownPeriod(oneLessThanPeriod(newPeriod));
    }
  }

  function handleChangeBreakdownPeriod(
    newPeriod: RecurringTaskPeriod | RecurringTaskPeriod[] | "none",
  ) {
    if (Array.isArray(newPeriod)) {
      newPeriod = newPeriod[0];
    }
    setBreakdownPeriod(newPeriod);
  }

  return (
    <ToolPanel>
      <GlobalError actionResult={loaderData} />

      <SectionCard
        title="Report"
        method="get"
        actions={
          <SectionActions
            id="report-actions"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Run Report",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="today" shrink>
            Today
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="Today"
            name="today"
            defaultValue={
              isNoErrorSomeData(loaderData)
                ? (loaderData.data.report?.period_result.today ??
                  DateTime.local({
                    zone: topLevelInfo.user.timezone,
                  }).toISODate())
                : DateTime.local({
                    zone: topLevelInfo.user.timezone,
                  }).toISODate()
            }
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />

          <FieldError actionResult={loaderData} fieldName="/today" />
        </FormControl>

        <Stack
          spacing={2}
          useFlexGap
          direction={isBigScreen ? "row" : "column"}
        >
          <FormControl fullWidth>
            <FormLabel id="period">Period</FormLabel>
            <PeriodSelect
              labelId="period"
              label="Period"
              name="period"
              inputsEnabled={inputsEnabled}
              value={period}
              onChange={handleChangePeriod}
            />
            <FieldError actionResult={loaderData} fieldName="/status" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="breakdownPeriod">Breakdown Period</FormLabel>
            <PeriodSelect
              labelId="breakdownPeriod"
              label="Breakdown Period"
              name="breakdownPeriod"
              inputsEnabled={inputsEnabled}
              allowNonePeriod
              value={breakdownPeriod}
              onChange={handleChangeBreakdownPeriod}
            />
            <FieldError
              actionResult={loaderData}
              fieldName="/breakdown_period"
            />
          </FormControl>
        </Stack>
      </SectionCard>

      {isNoErrorSomeData(loaderData) &&
        loaderData.data.allProjects !== undefined &&
        loaderData.data.report !== undefined && (
          <ShowReport
            topLevelInfo={topLevelInfo}
            allProjects={loaderData.data.allProjects ?? []}
            allGoals={loaderData.data.allGoals ?? []}
            report={loaderData.data.report.period_result}
          />
        )}
    </ToolPanel>
  );
}

export const ErrorBoundary = makeToolErrorBoundary(
  () => `There was an error running the report! Please try again!`,
);
