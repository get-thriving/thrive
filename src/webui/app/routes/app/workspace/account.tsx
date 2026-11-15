import {
  ColorScheme,
  JupiterAuthProvider,
  KeyboardAction,
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
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { EntityPanel } from "@jupiter/core/infra/component/layout/entity-panel";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TimezoneSelect } from "@jupiter/core/common/component/timezone-select";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { StrataSection } from "@jupiter/core/infra/component/strata-section";
import { UserAuthMethodTag } from "@jupiter/core/auth/component/user-auth-method-tag";
import { AvatarPicker } from "@jupiter/core/users/components/avatar-picker";
import { KeyBindingsEditor } from "@jupiter/core/users/components/key-bindings-editor";
import { DEFAULT_KEY_BINDINGS } from "@jupiter/core/infra/strata/strata-key-defaults";
import { strataKeyBindingsFrom } from "@jupiter/core/infra/strata/strata-key-bindings";
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
    colorScheme: z.nativeEnum(ColorScheme),
    useExpandedRail: z
      .string()
      .optional()
      .transform((v) => v === "on"),
  }),
  // The rail's own toggle, sent from any page by a fetcher.
  z.object({
    intent: z.literal("set-expanded-rail"),
    useExpandedRail: z.enum(["true", "false"]),
  }),
  // The keys come as one JSON object, with a key for every action: the WebAPI
  // checks that, and that no two actions share a key.
  z.object({
    intent: z.literal("set-key-bindings"),
    keyBindings: z
      .string()
      .transform((v) => z.record(z.string()).parse(JSON.parse(v))),
  }),
  z.object({ intent: z.literal("reset-key-bindings") }),
  z.object({
    intent: z.literal("reset-key-binding"),
    action: z.nativeEnum(KeyboardAction),
  }),
  // The picture itself is not in here: `parseForm` turns anything that is not a
  // string into JSON, which a file does not survive. The action reads it.
  z.object({ intent: z.literal("upload-avatar") }),
  z.object({ intent: z.literal("clear-avatar") }),
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
  label: "Account",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const result = await apiClient.users.userLoad({});
  const webUiSettingsResult = await apiClient.users.webUiSettingsLoad({});

  return {
    user: result.user,
    avatarUrl: result.user_avatar_url,
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

      case "upload-avatar": {
        const picture = (await request.clone().formData()).get("picture");
        if (!(picture instanceof File)) {
          throw new Response("Bad Request", { status: 400 });
        }

        // The WebAPI speaks JSON, which has no bytes.
        const content = Buffer.from(await picture.arrayBuffer());
        await apiClient.users.userAvatarUpload({
          image_base64: content.toString("base64"),
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "clear-avatar": {
        await apiClient.users.userAvatarClear({});

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
          color_scheme: { should_change: true, value: form.colorScheme },
          use_expanded_rail: {
            should_change: true,
            value: form.useExpandedRail,
          },
          key_bindings: { should_change: false },
        });

        return redirectDocument(`/app/workspace/account`);
      }

      case "set-expanded-rail": {
        await apiClient.users.webUiSettingsUpdate({
          color_scheme: { should_change: false },
          use_expanded_rail: {
            should_change: true,
            value: form.useExpandedRail === "true",
          },
          key_bindings: { should_change: false },
        });

        // No redirect: the rail already shows the new state.
        return new Response(null, { status: 204 });
      }

      case "set-key-bindings": {
        await apiClient.users.webUiSettingsUpdate({
          color_scheme: { should_change: false },
          use_expanded_rail: { should_change: false },
          key_bindings: { should_change: true, value: form.keyBindings },
        });

        // The root loader holds the keys, and every page listens to them.
        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "reset-key-bindings": {
        await apiClient.users.webUiSettingsResetKeyBindings({});

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
      }

      case "reset-key-binding": {
        const settings = await apiClient.users.webUiSettingsLoad({});
        await apiClient.users.webUiSettingsUpdate({
          color_scheme: { should_change: false },
          use_expanded_rail: { should_change: false },
          key_bindings: {
            should_change: true,
            value: {
              ...strataKeyBindingsFrom(settings.web_ui_settings.key_bindings),
              [form.action]: DEFAULT_KEY_BINDINGS[form.action],
            },
          },
        });

        return redirect(`/app/workspace/account?invalidateTopLevel=true`);
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
    <EntityPanel
      kind="trunk"
      sectionsPanelId="account"
      key={`account/${loaderData.user.version}`}
      returnLocation="/app/workspace"
    >
      <GlobalError actionResult={actionData} />

      <StrataSection
        id="picture-section"
        title="Picture"
        actions={
          loaderData.user.avatar_image_ref_id ? (
            <SectionActions
              id="picture-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "remove-avatar",
                  text: "Remove picture",
                  value: "clear-avatar",
                }),
              ]}
            />
          ) : undefined
        }
      >
        <AvatarPicker
          name={loaderData.user.name}
          avatarUrl={loaderData.avatarUrl}
          inputsEnabled={inputsEnabled}
        />
      </StrataSection>

      <StrataSection
        id="account-section"
        fixed
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
      </StrataSection>

      <StrataSection id="sign-in-methods-section" title="Sign-in Methods">
        {query.linkError && <Alert severity="warning">{query.linkError}</Alert>}
        {nativeError && <Alert severity="error">{nativeError}</Alert>}
        {/* A div, since the tag is a chip and a paragraph cannot hold one: the
                browser reshuffles the markup and hydration then fails. */}
        <Typography variant="body2" component="div">
          You can sign in with any of the methods linked here. Your account was
          created with{" "}
          <UserAuthMethodTag authMethod={loaderData.user.auth_sign_up_method} />
          .
        </Typography>
        {methods.map((method) => {
          const isLinked = linked.includes(method);
          const linkPath = LINK_PATHS[method];
          return (
            <Stack
              key={method}
              direction="row"
              spacing={1.25}
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
      </StrataSection>

      <StrataSection
        id="feature-flags-section"
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
        <GlobalError intent="change-feature-flags" actionResult={actionData} />
        <UserFeatureFlagsEditor
          name="featureFlags"
          inputsEnabled={inputsEnabled}
          featureFlagsControls={topLevelInfo.userFeatureFlagControls}
          defaultFeatureFlags={loaderData.user.feature_flags}
          hosting={getHosting(globalProperties.universe)}
        />
      </StrataSection>

      <StrataSection
        id="appearance-section"
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
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ flexWrap: "wrap", alignItems: "flex-start" }}
        >
          <FormControl sx={{ flex: "1 1 12rem" }} disabled={!inputsEnabled}>
            <InputLabel id="color-scheme-label">Color scheme</InputLabel>
            <Select
              labelId="color-scheme-label"
              id="color-scheme"
              name="colorScheme"
              label="Color scheme"
              defaultValue={loaderData.webUiSettings.color_scheme}
            >
              <MenuItem value={ColorScheme.SYSTEM}>Same as the device</MenuItem>
              <MenuItem value={ColorScheme.LIGHT}>Light</MenuItem>
              <MenuItem value={ColorScheme.DARK}>Dark</MenuItem>
            </Select>
            <FormHelperText>
              Light or dark, or whichever the device is set to.
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ flex: "1 1 12rem" }}>
            <FormControlLabel
              control={
                <Switch
                  name="useExpandedRail"
                  disabled={!inputsEnabled}
                  defaultChecked={loaderData.webUiSettings.use_expanded_rail}
                />
              }
              label="Expanded sidebar"
            />
            <FormHelperText>
              Shows labels beside the icons on the sidebar, on wide windows.
            </FormHelperText>
          </FormControl>
        </Stack>
      </StrataSection>

      <StrataSection
        id="keys-section"
        title="Keys"
        items={1}
        split={{ size: 2, grow: true }}
      >
        <KeyBindingsEditor
          bindings={strataKeyBindingsFrom(
            loaderData.webUiSettings.key_bindings,
          )}
          inputsEnabled={inputsEnabled}
        />
      </StrataSection>

      <StrataSection id="dangerous-section" title="Dangerous">
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
      </StrataSection>

      <NestedOutlet />
    </EntityPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error updating the account! Please try again!`,
});
