import {
  JupiterAuthProvider,
  UserAuthMethod,
  UserFeature,
} from "@jupiter/webapi-client";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  Link,
  redirect,
  redirectDocument,
  useActionData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { UserFeatureFlagsEditor } from "@jupiter/core/workspaces/component/feature-flags-editor";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
  DisplayType,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TimezoneSelect } from "@jupiter/core/common/component/timezone-select";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { UserAuthMethodTag } from "@jupiter/core/auth/component/user-auth-method-tag";
import { getHosting } from "#/core/universe";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

import { useOAuthProviderButtonProps } from "~/logic/native-sign-in";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    timezone: z.string(),
  }),
  z.object({
    intent: z.literal("change-feature-flags"),
    featureFlags: z
      .nativeEnum(UserFeature)
      .optional()
      .or(z.array(z.nativeEnum(UserFeature)))
      .transform((v) => (v ? (Array.isArray(v) ? v : [v]) : [])),
  }),
  z.object({
    intent: z.literal("update-appearance"),
    useNightMode: z
      .string()
      .optional()
      .transform((v) => v === "on"),
  }),
  z.object({ intent: z.literal("unlink-local") }),
  z.object({ intent: z.literal("unlink-google") }),
  z.object({ intent: z.literal("unlink-apple") }),
  z.object({
    intent: z.literal("close-account"),
  }),
]);

const QuerySchema = z.object({
  linkError: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const result = await apiClient.users.userLoad({});
  const webUiSettingsResult = await apiClient.users.webUiSettingsLoad({});

  return {
    user: result.user,
    webUiSettings: webUiSettingsResult.web_ui_settings,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  // We do a hard redirect for all actions here, because changing these
  // vary basic properties of the properties, most assuredly will
  // modify topLevelInfo which will need to invalidate all the
  // routes. Since there's some caching over there, we take this
  // simple approach.

  try {
    switch (form.intent) {
      case "unlink-local": {
        await apiClient.application.unlinkAuthMethod({
          auth_method: UserAuthMethod.LOCAL,
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "unlink-google": {
        await apiClient.application.unlinkAuthMethod({
          auth_method: UserAuthMethod.GOOGLE,
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "unlink-apple": {
        await apiClient.application.unlinkAuthMethod({
          auth_method: UserAuthMethod.APPLE,
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "update": {
        await apiClient.users.userUpdate({
          name: {
            should_change: true,
            value: form.name,
          },
          timezone: {
            should_change: true,
            value: form.timezone,
          },
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "change-feature-flags": {
        await apiClient.users.userChangeFeatureFlags({
          feature_flags: form.featureFlags,
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "update-appearance": {
        await apiClient.users.webUiSettingsUpdate({
          use_night_mode: {
            should_change: true,
            value: form.useNightMode,
          },
        });

        return redirectDocument(`/app/workspace/account`);
      }

      case "close-account": {
        await apiClient.application.closeAccount({});

        return redirectDocument(`/app/lifecycle/init/local/create-user`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

const METHOD_LABELS: Record<UserAuthMethod, string> = {
  [UserAuthMethod.LOCAL]: "Email and password",
  [UserAuthMethod.GOOGLE]: "Google",
  [UserAuthMethod.APPLE]: "Apple",
};

const LINK_PATHS: Partial<Record<UserAuthMethod, string>> = {
  [UserAuthMethod.GOOGLE]: "/app/lifecycle/link/google/prepare",
  [UserAuthMethod.APPLE]: "/app/lifecycle/link/apple/prepare",
};

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Account() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const globalProperties = useContext(GlobalPropertiesContext);
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const [showCloseAccountDialog, setShowCloseAccountDialog] = useState(false);

  const [queryRaw] = useSearchParams();
  const query = parseQuery(queryRaw, QuerySchema);
  const submit = useSubmit();
  const oauthButtonProps = useOAuthProviderButtonProps();
  const [nativeError, setNativeError] = useState<string | null>(null);

  const linked = topLevelInfo.userLinkedAuthMethods;
  const providersEnabled =
    globalProperties.authProvider === JupiterAuthProvider.LOCAL_GOOGLE_APPLE;
  // The redirect flow leaves the app for the system browser, so the mobile
  // shell links through its SDKs instead.
  const nativeSignIn = oauthButtonProps.nativeSignIn;
  const canLinkProviders = providersEnabled && !oauthButtonProps.disabled;
  const methods = providersEnabled
    ? [UserAuthMethod.LOCAL, UserAuthMethod.GOOGLE, UserAuthMethod.APPLE]
    : [UserAuthMethod.LOCAL];

  async function linkNatively(method: UserAuthMethod) {
    if (nativeSignIn === undefined) {
      return;
    }

    setNativeError(null);

    try {
      const signedIn =
        method === UserAuthMethod.GOOGLE
          ? await nativeSignIn.signInWithGoogle()
          : nativeSignIn.signInWithApple === null
            ? null
            : await nativeSignIn.signInWithApple();
      if (signedIn !== null) {
        submit(
          signedIn.userJson === null
            ? { code: signedIn.code }
            : { code: signedIn.code, user: signedIn.userJson },
          { method: "post", action: `/app/lifecycle/link/${method}/native` },
        );
      }
    } catch (err) {
      console.error(`Native ${method} link failed`, err);
      setNativeError("Could not link. Please try again.");
    }
  }

  return (
    <TrunkPanel
      key={`account/${loaderData.user.version}`}
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <ToolPanel>
          <GlobalError actionResult={actionData} />

          <SectionCard
            title="Account"
            actions={
              <SectionActions
                id="account-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  ActionSingle({
                    text: "Save",
                    value: "update",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <FormControl fullWidth>
              <InputLabel id="emailAddress">Your Email Address</InputLabel>
              <OutlinedInput
                type="email"
                autoComplete="email"
                label="Your Email Address"
                name="emailAddress"
                disabled={true}
                defaultValue={loaderData.user.email_address ?? ""}
                endAdornment={
                  <InputAdornment position="end">
                    <UserAuthMethodTag
                      authMethod={loaderData.user.auth_sign_up_method}
                    />
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                name="name"
                label="Your Name"
                defaultValue={loaderData.user.name ?? ""}
                disabled={!inputsEnabled}
              />
              <FieldError actionResult={actionData} fieldName="/name" />
            </FormControl>
            <FormControl fullWidth>
              <TimezoneSelect
                id="timezone"
                name="timezone"
                inputsEnabled={inputsEnabled}
                initialValue={loaderData.user.timezone ?? ""}
              />

              <FieldError actionResult={actionData} fieldName="/timezone" />
            </FormControl>
          </SectionCard>

          <SectionCard title="Sign-in Methods">
            {query.linkError && (
              <Alert severity="warning">{query.linkError}</Alert>
            )}
            {nativeError && <Alert severity="error">{nativeError}</Alert>}
            <Typography variant="body2">
              You can sign in with any of the methods linked here. Your account
              was created with{" "}
              <UserAuthMethodTag
                authMethod={loaderData.user.auth_sign_up_method}
              />
              .
            </Typography>
            {methods.map((method) => {
              const isLinked = linked.includes(method);
              const linkPath = LINK_PATHS[method];
              return (
                <Stack
                  key={method}
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Typography>
                    {METHOD_LABELS[method]} {isLinked ? "(linked)" : ""}
                  </Typography>
                  {isLinked ? (
                    <Stack direction="row" spacing={1}>
                      {method === UserAuthMethod.LOCAL && (
                        <Button
                          component={Link}
                          to="/app/workspace/account/password"
                          disabled={!inputsEnabled}
                        >
                          Change Password
                        </Button>
                      )}
                      <Button
                        type="submit"
                        name="intent"
                        value={`unlink-${method}`}
                        color="warning"
                        disabled={!inputsEnabled || linked.length <= 1}
                      >
                        Unlink
                      </Button>
                    </Stack>
                  ) : method === UserAuthMethod.LOCAL ? (
                    <Button
                      component={Link}
                      to="/app/workspace/account/password"
                      disabled={!inputsEnabled}
                    >
                      Link
                    </Button>
                  ) : linkPath !== undefined &&
                    canLinkProviders &&
                    nativeSignIn !== undefined ? (
                    (method === UserAuthMethod.GOOGLE ||
                      nativeSignIn.signInWithApple !== null) && (
                      <Button
                        type="button"
                        disabled={!inputsEnabled}
                        onClick={() => linkNatively(method)}
                      >
                        Link
                      </Button>
                    )
                  ) : linkPath !== undefined && canLinkProviders ? (
                    <Button
                      component={Link}
                      to={linkPath}
                      reloadDocument
                      disabled={!inputsEnabled}
                    >
                      Link
                    </Button>
                  ) : null}
                </Stack>
              );
            })}
          </SectionCard>

          <SectionCard
            title="Feature Flags"
            actions={
              <SectionActions
                id="feature-flags-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  ActionSingle({
                    text: "Change Feature Flags",
                    value: "change-feature-flags",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <GlobalError
              intent="change-feature-flags"
              actionResult={actionData}
            />
            <UserFeatureFlagsEditor
              name="featureFlags"
              inputsEnabled={inputsEnabled}
              featureFlagsControls={topLevelInfo.userFeatureFlagControls}
              defaultFeatureFlags={loaderData.user.feature_flags}
              hosting={getHosting(globalProperties.universe)}
            />
          </SectionCard>

          <SectionCard
            title="Appearance"
            actions={
              <SectionActions
                id="appearance-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  ActionSingle({
                    text: "Save",
                    value: "update-appearance",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <GlobalError intent="update-appearance" actionResult={actionData} />
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Switch
                    name="useNightMode"
                    disabled={!inputsEnabled}
                    defaultChecked={loaderData.webUiSettings.use_night_mode}
                  />
                }
                label="Night Mode"
              />
            </FormControl>
          </SectionCard>

          <SectionCard title="Dangerous">
            <GlobalError intent="close-account" actionResult={actionData} />
            <Dialog
              onClose={() => setShowCloseAccountDialog(false)}
              open={showCloseAccountDialog}
              disablePortal
            >
              <DialogTitle>Are You Sure?</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Are you sure you want to close your account? This action is
                  irreversible.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  id="close-account"
                  variant="contained"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="close-account"
                  color="error"
                >
                  Close Account
                </Button>
              </DialogActions>
            </Dialog>

            <Box>
              <Button
                id="close-account-initialize"
                variant="contained"
                disabled={!inputsEnabled}
                onClick={() => setShowCloseAccountDialog(true)}
                color="error"
              >
                Close Account
              </Button>
            </Box>
          </SectionCard>
        </ToolPanel>
      </NestingAwareBlock>

      <NestedOutlet />
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error updating the account! Please try again!`,
});
