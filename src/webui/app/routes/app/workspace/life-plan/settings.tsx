import { ApiError, LifePlan, WorkspaceFeature } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { BirthdaySelect } from "@jupiter/core/common/component/birthday-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { FormControl, Stack } from "@mui/material";
import { BirthYearSelect } from "#/core/common/component/birth-year-select";

import { getLoggedInApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    birthday: z.string(),
    birthYear: z.string().transform((value) => parseInt(value, 10)),
  }),
]);

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
  });

  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.lifePlan.lifePlanUpdate({
          birthday: {
            should_change: true,
            value: form.birthday,
          },
          birth_year: {
            should_change: true,
            value: form.birthYear,
          },
        });

        return redirect(`/app/workspace/life-plan/settings`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
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

export default function LifePlanSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <BranchPanel
      key={"life-plan/settings"}
      returnLocation="/app/workspace/life-plan"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <SectionCard
          id="life-plan-settings"
          title="Settings"
          actions={
            <SectionActions
              id="life-plan-settings-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "life-plan-settings-save",
                  text: "Save",
                  value: "update",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <Stack spacing={2} useFlexGap direction="row">
            <BirthdaySelect
              name="birthday"
              allowNoneBirthday={false}
              inputsEnabled={inputsEnabled}
              initialValue={loaderData.lifePlan.birthday}
            />
            <FormControl fullWidth>
              <BirthYearSelect
                label="Your Birth Year"
                name="birthYear"
                inputsEnabled={inputsEnabled}
                defaultValue={loaderData.lifePlan.birth_year}
                allowNoneBirthYear={false}
              />
            </FormControl>
            <FieldError actionResult={actionData} fieldName="/birthday" />
            <FieldError actionResult={actionData} fieldName="/birth_year" />
          </Stack>
        </SectionCard>
      )}
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/life-plan",
  ParamsSchema,
  {
    notFound: () => `Could not find the life plan settings!`,
    error: () =>
      `There was an error loading the life plan settings! Please try again!`,
  },
);
