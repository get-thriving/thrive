import { ApiError, UserFeature } from "@jupiter/webapi-client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, redirectDocument } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { UserFeatureFlagsEditor } from "@jupiter/core/workspaces/component/feature-flags-editor";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TimezoneSelect } from "@jupiter/core/common/component/timezone-select";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { ApiKeyView } from "@jupiter/core/api_key/components/api-key-view";
import { getHosting } from "#/core/universe";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

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
    intent: z.literal("close-account"),
  }),
]);

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const result = await apiClient.users.userLoad({});
  const apiKeysResult = await apiClient.apiKey.aPiKeyFind({
    allow_archived: false,
  });
  const apiKeys = apiKeysResult.api_keys;

  return json({
    user: result.user,
    apiKeys,
  });
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

      case "close-account": {
        await apiClient.application.closeAccount({});

        return redirectDocument(`/app/init`);
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
          title="API Keys"
          actions={
            <SectionActions
              id="api-keys-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "Add",
                  link: "/app/workspace/account/api-key/new",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <EntityStack>
            {loaderData.apiKeys.map((apiKey) => (
              <EntityCard
                entityId={`api-key-${apiKey.ref_id}`}
                key={`api-key-${apiKey.ref_id}`}
              >
                <EntityLink to={`/app/workspace/account/api-key/${apiKey.ref_id}`}>
                  <ApiKeyView apiKey={apiKey} />
                </EntityLink>
              </EntityCard>
            ))}
          </EntityStack>
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

          <Button
            id="close-account-initialize"
            variant="contained"
            disabled={!inputsEnabled}
            onClick={() => setShowCloseAccountDialog(true)}
            color="error"
          >
            Close Account
          </Button>
        </SectionCard>
        </ToolPanel>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error updating the account! Please try again!`,
});
