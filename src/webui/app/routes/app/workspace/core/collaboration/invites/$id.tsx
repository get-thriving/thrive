import { Launch as LaunchIcon } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { AccessLevelSelect } from "@jupiter/core/common/sub/access/components/access-level-select";
import { workspacePathForEntityTag } from "@jupiter/core/common/workspace-entity-path";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  ButtonSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { entityTagName } from "@jupiter/core/named-entity-tag";
import { formatUserLightLabel } from "@jupiter/core/users/components/user-light-chip";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("acknowledge"),
  }),
  z.object({
    intent: z.literal("cancel"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.application.accessInviteLoad({
      ref_id: id,
      allow_archived: false,
    });

    return json({
      accessInvite: result.access_invite,
      accessGrant: result.access_grant,
      entity: result.entity,
      owner: result.owner,
      canCancel: result.can_cancel,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "acknowledge": {
        await apiClient.application.acknowledgeAccessInvite({
          access_invite_ref_id: id,
        });
        return redirect("/app/workspace/core/collaboration");
      }

      case "cancel": {
        await apiClient.application.cancelAccessInvite({
          access_invite_ref_id: id,
        });
        return redirect("/app/workspace/core/collaboration");
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

export default function CollaborationInvite() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { accessInvite, accessGrant, entity, owner, canCancel } = loaderData;
  const entityPath = workspacePathForEntityTag(
    entity.entity_tag,
    entity.ref_id,
  );
  const entityTypeLabel = entityTagName(entity.entity_tag);

  return (
    <LeafPanel
      key={`core/collaboration/invites/${accessInvite.ref_id}`}
      fakeKey={`core/collaboration/invites/${accessInvite.ref_id}`}
      returnLocation="/app/workspace/core/collaboration"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Access Invite"
        actions={
          <SectionActions
            id={`collaboration-invite-${accessInvite.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "collaboration-invite-acknowledge",
                text: "OK",
                value: "acknowledge",
                highlight: true,
              }),
              ...(canCancel
                ? [
                    ButtonSingle({
                      text: "Cancel",
                      onClick: () => setConfirmCancel(true),
                    }),
                  ]
                : []),
            ]}
          />
        }
      >
        <Stack spacing={2} useFlexGap>
          <Stack direction="row" useFlexGap spacing={1} alignItems="center">
            <FormControl sx={{ flexGrow: 1, minWidth: "8rem" }}>
              <InputLabel id="entity-type">Entity Type</InputLabel>
              <OutlinedInput
                label="Entity Type"
                id="entity-type"
                readOnly
                disabled
                value={entityTypeLabel}
              />
            </FormControl>

            <FormControl fullWidth sx={{ flexGrow: 3 }}>
              <InputLabel id="entity-name">Entity</InputLabel>
              <OutlinedInput
                label="Entity"
                id="entity-name"
                readOnly
                disabled
                value={entity.name}
              />
            </FormControl>

            {entityPath !== null && (
              <Button
                startIcon={<LaunchIcon />}
                variant="outlined"
                size="small"
                component={Link}
                to={entityPath}
                sx={{ flexShrink: 0, alignSelf: "center" }}
              >
                {entityTypeLabel}
              </Button>
            )}
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="owner">Owner</InputLabel>
            <OutlinedInput
              label="Owner"
              id="owner"
              readOnly
              disabled
              value={formatUserLightLabel(owner)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="access-level">Access</FormLabel>
            <AccessLevelSelect
              name="accessLevel"
              defaultValue={accessGrant.access_level}
              inputsEnabled={false}
              forSharing
            />
          </FormControl>
        </Stack>

        <Dialog
          open={confirmCancel}
          onClose={() => setConfirmCancel(false)}
          disablePortal
        >
          <DialogTitle>Careful!</DialogTitle>
          <DialogContent>
            Are you sure you want to cancel this invite? You will lose access to
            the entity.
          </DialogContent>
          <DialogActions>
            <Button
              id="collaboration-invite-cancel-confirm"
              variant="contained"
              color="warning"
              type="submit"
              name="intent"
              value="cancel"
              disabled={!inputsEnabled}
            >
              Yes
            </Button>
            <Button
              onClick={() => setConfirmCancel(false)}
              disabled={!inputsEnabled}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/core/collaboration",
  ParamsSchema,
  {
    notFound: (params) => `Could not find access invite ${params.id}!`,
    error: () =>
      `There was an error loading the access invite! Please try again!`,
  },
);
