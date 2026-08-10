import { AccessRequestStatus } from "@jupiter/webapi-client";
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
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { AccessLevelSelect } from "@jupiter/core/common/sub/access/components/access-level-select";
import { accessRequestStatusName } from "@jupiter/core/common/sub/access/sub/request/status";
import { workspacePathForEntityTag } from "@jupiter/core/common/workspace-entity-path";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ButtonSingle,
  NavSingle,
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

const CancelFormSchema = z.object({
  intent: z.literal("cancel"),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.application.accessRequestLoad({
      ref_id: id,
      allow_archived: false,
    });

    if (!result.can_cancel) {
      throw new Response("Not Found", { status: 404 });
    }

    return json({
      accessRequest: result.access_request,
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
  const form = await parseForm(request, CancelFormSchema);

  try {
    switch (form.intent) {
      case "cancel": {
        await apiClient.application.cancelAccessToEntity({
          access_request_ref_id: id,
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

export default function CollaborationRequestFromMe() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { accessRequest, entity, owner, canCancel } = loaderData;
  const entityPath = workspacePathForEntityTag(
    entity.entity_tag,
    entity.ref_id,
  );

  return (
    <LeafPanel
      key={`core/collaboration/requests/from-me/${accessRequest.ref_id}`}
      fakeKey={`core/collaboration/requests/from-me/${accessRequest.ref_id}`}
      returnLocation="/app/workspace/core/collaboration"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Access Request"
        actions={
          <SectionActions
            id={`collaboration-request-from-me-${accessRequest.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={
              canCancel
                ? [
                    ButtonSingle({
                      text: "Cancel",
                      onClick: () => setConfirmCancel(true),
                    }),
                  ]
                : []
            }
            extraActions={
              entityPath !== null
                ? [
                    NavSingle({
                      text: "Open",
                      link: entityPath,
                    }),
                  ]
                : undefined
            }
          />
        }
      >
        <Stack spacing={2} useFlexGap>
          <Stack direction="row" useFlexGap spacing={1}>
            <FormControl sx={{ flexGrow: 1, minWidth: "8rem" }}>
              <InputLabel id="entity-type">Entity Type</InputLabel>
              <OutlinedInput
                label="Entity Type"
                id="entity-type"
                readOnly
                disabled
                value={entityTagName(entity.entity_tag)}
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
              defaultValue={accessRequest.access_level}
              inputsEnabled={false}
              forSharing
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="status">Status</InputLabel>
            <OutlinedInput
              label="Status"
              id="status"
              readOnly
              disabled
              value={accessRequestStatusName(
                accessRequest.status as AccessRequestStatus,
              )}
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
            Are you sure you want to cancel this access request?
          </DialogContent>
          <DialogActions>
            <Button
              id="collaboration-request-cancel-confirm"
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
    notFound: (params) => `Could not find access request ${params.id}!`,
    error: () =>
      `There was an error loading the access request! Please try again!`,
  },
);
