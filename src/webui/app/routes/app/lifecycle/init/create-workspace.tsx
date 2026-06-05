import {
  ApiError,
  DocsHelpSubject,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { BirthYearSelect } from "#/core/common/component/birth-year-select";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { WorkspaceFeatureFlagsEditor } from "@jupiter/core/workspaces/component/feature-flags-editor";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import {
  ActionsExpansion,
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";
import { BirthdaySelect } from "#/core/common/component/birthday-select";
import { TimezoneSelect } from "#/core/common/component/timezone-select";
import { getHosting } from "#/core/universe";

import { getGuestApiClient } from "~/api-clients.server";
import { redirectForLifecycleState } from "~/routes/app/lifecycle/lifecycle-redirects.server";

const QuerySchema = z.object({
  userId: z.string(),
});

const InitCreateWorkspaceFormSchema = z.object({
  userId: z.string(),
  userTimezone: z.string(),
  userBirthday: z.string(),
  userBirthYear: z.string().transform((v) => parseInt(v, 10)),
  workspaceName: z.string(),
  workspaceRootAspectName: z.string(),
  workspaceFirstScheduleStreamName: z.string(),
  workspaceFeatureFlags: z.array(z.nativeEnum(WorkspaceFeature)),
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.application.loadTopLevelInfo({});
  if (!result.user || !result.user.verified || result.workspace) {
    return redirectForLifecycleState(result);
  }
  if (result.user.ref_id !== query.userId) {
    return redirectForLifecycleState(result);
  }

  return json({
    userId: query.userId,
    defaultWorkspaceName: result.deafult_workspace_name,
    defaultRootAspectName: result.default_root_aspect_name,
    defaultFirstScheduleStreamName: result.default_first_schedule_stream_name,
    workspaceFeatureFlagControls: result.workspace_feature_flag_controls,
    defaultWorkspaceFeatureFlags: result.default_workspace_feature_flags,
  });
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const form = await parseForm(request, InitCreateWorkspaceFormSchema);

  try {
    const result = await apiClient.application.initCreateWorkspace({
      user_id: form.userId,
      timezone: form.userTimezone,
      birthday: form.userBirthday,
      birth_year: form.userBirthYear,
      name: form.workspaceName,
      root_aspect_name: form.workspaceRootAspectName,
      first_schedule_stream_name: form.workspaceFirstScheduleStreamName,
      feature_flags: form.workspaceFeatureFlags,
    });

    if (!result.recovery_token) {
      return redirect("/app/workspace");
    }

    return redirect(
      `/app/lifecycle/util/local/show-recovery-token?recoveryToken=${result.recovery_token}`,
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

export default function InitCreateWorkspace() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const globalProperties = useContext(GlobalPropertiesContext);

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />

        <Title />

        <CommunityLink />

        <DocsHelp size="medium" subject={DocsHelpSubject.ROOT} />
      </SmartAppBar>

      <LifecyclePanel>
        <GlobalError actionResult={actionData} />
        <SectionCard
          title="New Workspace"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="init-create-workspace"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Create",
                  value: "create",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <input type="hidden" name="userId" value={loaderData.userId} />

          <FormControl fullWidth>
            <TimezoneSelect
              id="userTimezone"
              name="userTimezone"
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/timezone" />
          </FormControl>

          <Stack spacing={2} useFlexGap direction="row">
            <BirthdaySelect
              name="userBirthday"
              allowNoneBirthday={false}
              inputsEnabled={inputsEnabled}
              initialValue={null}
            />
            <FormControl fullWidth>
              <BirthYearSelect
                label="Your Birth Year"
                name="userBirthYear"
                inputsEnabled={inputsEnabled}
                allowNoneBirthYear={false}
              />
            </FormControl>
            <FieldError actionResult={actionData} fieldName="/birthday" />
            <FieldError actionResult={actionData} fieldName="/birth_year" />
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="workspaceName">Workspace Name</InputLabel>
            <OutlinedInput
              label="Workspace Name"
              name="workspaceName"
              readOnly={!inputsEnabled}
              defaultValue={loaderData.defaultWorkspaceName}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2} useFlexGap>
                <FormControl fullWidth>
                  <InputLabel id="workspaceRootAspectName">
                    Root Aspect Name
                  </InputLabel>
                  <OutlinedInput
                    label="Root Aspect Name"
                    name="workspaceRootAspectName"
                    readOnly={!inputsEnabled}
                    defaultValue={loaderData.defaultRootAspectName}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/root_aspect_name"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="workspaceFirstScheduleStreamName">
                    First Schedule Stream Name
                  </InputLabel>
                  <OutlinedInput
                    label="First Schedule Stream Name"
                    name="workspaceFirstScheduleStreamName"
                    readOnly={!inputsEnabled}
                    defaultValue={loaderData.defaultFirstScheduleStreamName}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/first_schedule_stream_name"
                  />
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Feature Flags</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <WorkspaceFeatureFlagsEditor
                name="workspaceFeatureFlags"
                inputsEnabled={inputsEnabled}
                featureFlagsControls={loaderData.workspaceFeatureFlagControls}
                defaultFeatureFlags={loaderData.defaultWorkspaceFeatureFlags}
                hosting={getHosting(globalProperties.universe)}
              />
            </AccordionDetails>
          </Accordion>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error creating the workspace! Please try again!`,
});
