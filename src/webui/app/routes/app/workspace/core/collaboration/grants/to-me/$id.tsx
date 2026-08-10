import { NamedEntityTag } from "@jupiter/webapi-client";
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

const ForgetFormSchema = z.object({
  intent: z.literal("forget"),
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string().min(1),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.application.loadAccessGrant({
      ref_id: id,
      allow_archived: false,
    });

    if (!result.can_forget) {
      throw new Response("Not Found", { status: 404 });
    }

    return json({
      accessGrant: result.access_grant,
      entity: result.entity,
      owner: result.owner,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, ForgetFormSchema);

  try {
    await apiClient.application.removeGrantForEntity({
      entity_type: form.entityType,
      entity_ref_id: form.entityRefId,
      access_grant_ref_id: id,
    });
    return redirect("/app/workspace/core/collaboration");
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function CollaborationGrantToMe() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [confirmForget, setConfirmForget] = useState(false);

  const { accessGrant, entity, owner } = loaderData;
  const entityPath = workspacePathForEntityTag(
    entity.entity_tag,
    entity.ref_id,
  );

  return (
    <LeafPanel
      key={`core/collaboration/grants/to-me/${accessGrant.ref_id}`}
      fakeKey={`core/collaboration/grants/to-me/${accessGrant.ref_id}`}
      returnLocation="/app/workspace/core/collaboration"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Access Grant"
        actions={
          <SectionActions
            id={`collaboration-grant-to-me-${accessGrant.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ButtonSingle({
                text: "Forget",
                onClick: () => setConfirmForget(true),
              }),
            ]}
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
        <input type="hidden" name="entityType" value={entity.entity_tag} />
        <input type="hidden" name="entityRefId" value={entity.ref_id} />

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
              defaultValue={accessGrant.access_level}
              inputsEnabled={false}
              forSharing
            />
          </FormControl>
        </Stack>

        <Dialog
          open={confirmForget}
          onClose={() => setConfirmForget(false)}
          disablePortal
        >
          <DialogTitle>Careful!</DialogTitle>
          <DialogContent>
            Are you sure you want to forget this grant? You will lose access to
            the entity.
          </DialogContent>
          <DialogActions>
            <Button
              id="collaboration-grant-forget-confirm"
              variant="contained"
              color="warning"
              type="submit"
              name="intent"
              value="forget"
              disabled={!inputsEnabled}
            >
              Yes
            </Button>
            <Button
              onClick={() => setConfirmForget(false)}
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
    notFound: (params) => `Could not find access grant ${params.id}!`,
    error: () =>
      `There was an error loading the access grant! Please try again!`,
  },
);
