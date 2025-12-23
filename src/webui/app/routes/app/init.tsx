import {
  ApiError,
  AppShell,
  UserFeature,
  WorkspaceFeature,
  DocsHelpSubject,
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
import { BirthYearSelect } from "#/core/common/component/birth-year-select";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseFormSafe } from "zodix";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import {
  UserFeatureFlagsEditor,
  WorkspaceFeatureFlagsEditor,
} from "@jupiter/core/workspaces/component/feature-flags-editor";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Password } from "@jupiter/core/auth/component/password";
import { TimezoneSelect } from "@jupiter/core/common/component/timezone-select";
import { Title } from "@jupiter/core/infra/component/title";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";
import {
  ActionsExpansion,
  ActionSingle,
  NavMultipleCompact,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";
import { BirthdaySelect } from "#/core/common/component/birthday-select";

import { commitSession, getSession } from "~/sessions";
import { getGuestApiClient } from "~/api-clients.server";

const WorkspaceInitFormSchema = z.object({
  userEmailAddress: z.string(),
  userName: z.string(),
  userTimezone: z.string(),
  userFeatureFlags: z
    .array(z.nativeEnum(UserFeature))
    .or(z.nativeEnum(UserFeature).transform((v) => [v])),
  authPassword: z.string(),
  authPasswordRepeat: z.string(),
  userBirthday: z.string(),
  userBirthYear: z.string().transform((v) => parseInt(v, 10)),
  workspaceName: z.string(),
  workspaceRootProjectName: z.string(),
  workspaceFirstScheduleStreamName: z.string(),
  workspaceFeatureFlags: z.array(z.nativeEnum(WorkspaceFeature)),
  // forAppReview: CheckboxAsString,
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.application.loadTopLevelInfo({});
  if (result.user || result.workspace) {
    return redirect("/app/workspace");
  }

  return json({
    userFeatureFlagControls: result.user_feature_flag_controls,
    defaultUserFeatureFlags: result.default_user_feature_flags,
    defaultWorkspaceName: result.deafult_workspace_name,
    defaultRootProjectName: result.default_root_project_name,
    defaultFirstScheduleStreamName: result.default_first_schedule_stream_name,
    workspaceFeatureFlagControls: result.workspace_feature_flag_controls,
    defaultWorkspaceFeatureFlags: result.default_workspace_feature_flags,
  });
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const apiClient = await getGuestApiClient(request);
  const form = await parseForm(request, WorkspaceInitFormSchema);
  try {
    const result = await apiClient.application.init({
      user_email_address: form.userEmailAddress,
      user_name: form.userName,
      user_timezone: form.userTimezone,
      user_feature_flags: form.userFeatureFlags,
      auth_password: form.authPassword,
      auth_password_repeat: form.authPasswordRepeat,
      user_birthday: form.userBirthday,
      user_birth_year: form.userBirthYear,
      workspace_name: form.workspaceName,
      workspace_root_project_name: form.workspaceRootProjectName,
      workspace_first_schedule_stream_name:
        form.workspaceFirstScheduleStreamName,
      workspace_feature_flags: form.workspaceFeatureFlags,
      // for_app_review: form.forAppReview,
    });

    session.set(AUTH_TOKEN_NAME, result.auth_token_ext);

    return redirect(
      `/app/show-recovery-token?recoveryToken=${result.recovery_token}`,
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  } catch (error) {
    console.log("Here 3");
    console.log(error);
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export default function WorkspaceInit() {
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
          title="New Account & Workspace"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="init"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Create",
                  value: "create",
                  highlight: true,
                }),
                NavMultipleCompact({
                  navs: [
                    NavSingle({
                      text: "Login",
                      link: "/app/login",
                    }),
                    NavSingle({
                      text: "Reset Password",
                      link: "/app/reset-password",
                    }),
                    NavSingle({
                      text: "Pick Server",
                      link: "/app/pick-server/desktop",
                      disabled:
                        globalProperties.frontDoorInfo.appShell !==
                        AppShell.DESKTOP_ELECTRON,
                    }),
                  ],
                }),
              ]}
            />
          }
        >
          <FormControl fullWidth>
            <InputLabel id="userEmailAddress">Your Email Address</InputLabel>
            <OutlinedInput
              type="email"
              autoComplete="email"
              label="Your Email Address"
              name="userEmailAddress"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/user_email_address"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="userName">Your Name</InputLabel>
            <OutlinedInput
              label="Your Name"
              name="userName"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionData} fieldName="/user_name" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="authPassword">Password</InputLabel>
            <Password
              label="Password"
              name="authPassword"
              autoComplete="new-password"
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/auth_password" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="authPasswordRepeat">Password Repeat</InputLabel>
            <Password
              label="Password Repeat"
              name="authPasswordRepeat"
              inputsEnabled={inputsEnabled}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/auth_password_repeat"
            />
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
          </Stack>
          <FieldError actionResult={actionData} fieldName="/user_birthday" />
          <FieldError actionResult={actionData} fieldName="/user_birth_year" />

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2} useFlexGap>
                <FormControl fullWidth>
                  <TimezoneSelect
                    id="userTimezone"
                    name="userTimezone"
                    inputsEnabled={inputsEnabled}
                  />

                  <FieldError
                    actionResult={actionData}
                    fieldName="/user_timezone"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="workspaceName">Workspace Name</InputLabel>
                  <OutlinedInput
                    label="Workspace Name"
                    name="workspaceName"
                    readOnly={!inputsEnabled}
                    defaultValue={loaderData.defaultWorkspaceName}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/app/workspace_name"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="name">Root Project Name</InputLabel>
                  <OutlinedInput
                    label="Root Project Name"
                    name="workspaceRootProjectName"
                    readOnly={!inputsEnabled}
                    defaultValue={loaderData.defaultRootProjectName}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/app/workspace_root_project_name"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="name">First Schedule Stream Name</InputLabel>
                  <OutlinedInput
                    label="First Schdule Stream Name"
                    name="workspaceFirstScheduleStreamName"
                    readOnly={!inputsEnabled}
                    defaultValue={loaderData.defaultFirstScheduleStreamName}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/app/workspace_first_schedule_stream_name"
                  />
                </FormControl>

                {/* <FormControl fullWidth>
                        <FormControlLabel
                          control={<Switch name="forAppReview" />}
                          label="For App Review"
                        />
                      </FormControl> */}
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Feature Flags</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <UserFeatureFlagsEditor
                name="userFeatureFlags"
                inputsEnabled={inputsEnabled}
                featureFlagsControls={loaderData.userFeatureFlagControls}
                defaultFeatureFlags={loaderData.defaultUserFeatureFlags}
                hosting={globalProperties.hosting}
              />
              <WorkspaceFeatureFlagsEditor
                name="workspaceFeatureFlags"
                inputsEnabled={inputsEnabled}
                featureFlagsControls={loaderData.workspaceFeatureFlagControls}
                defaultFeatureFlags={loaderData.defaultWorkspaceFeatureFlags}
                hosting={globalProperties.hosting}
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
