import { AccessLevel, NamedEntityTag } from "@jupiter/webapi-client";
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
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
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

const EntityFieldsSchema = {
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string().min(1),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    accessLevel: z.nativeEnum(AccessLevel),
    ...EntityFieldsSchema,
  }),
  z.object({
    intent: z.literal("revoke"),
    ...EntityFieldsSchema,
  }),
]);

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

    if (!result.can_revoke) {
      throw new Response("Not Found", { status: 404 });
    }

    return json({
      accessGrant: result.access_grant,
      entity: result.entity,
      grantee: result.grantee,
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
      case "update": {
        await apiClient.application.updateGrantForEntity({
          entity_type: form.entityType,
          entity_ref_id: form.entityRefId,
          access_grant_ref_id: id,
          access_level: form.accessLevel,
        });
        return redirect(
          `/app/workspace/core/collaboration/grants/from-me/${id}`,
        );
      }

      case "revoke": {
        await apiClient.application.removeGrantForEntity({
          entity_type: form.entityType,
          entity_ref_id: form.entityRefId,
          access_grant_ref_id: id,
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

export default function CollaborationGrantFromMe() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const { accessGrant, entity, grantee } = loaderData;
  const entityPath = workspacePathForEntityTag(
    entity.entity_tag,
    entity.ref_id,
  );

  return (
    <LeafPanel
      key={`core/collaboration/grants/from-me/${accessGrant.ref_id}`}
      fakeKey={`core/collaboration/grants/from-me/${accessGrant.ref_id}`}
      returnLocation="/app/workspace/core/collaboration"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Access Grant"
        actions={
          <SectionActions
            id={`collaboration-grant-from-me-${accessGrant.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "collaboration-grant-update",
                text: "Save",
                value: "update",
                highlight: true,
              }),
              ButtonSingle({
                text: "Revoke",
                onClick: () => setConfirmRevoke(true),
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
            <InputLabel id="grantee">User</InputLabel>
            <OutlinedInput
              label="User"
              id="grantee"
              readOnly
              disabled
              value={formatUserLightLabel(grantee)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="access-level">Access</FormLabel>
            <AccessLevelSelect
              name="accessLevel"
              defaultValue={accessGrant.access_level}
              inputsEnabled={inputsEnabled}
              forSharing
            />
            <FieldError actionResult={actionData} fieldName="/access_level" />
          </FormControl>
        </Stack>

        <Dialog
          open={confirmRevoke}
          onClose={() => setConfirmRevoke(false)}
          disablePortal
        >
          <DialogTitle>Careful!</DialogTitle>
          <DialogContent>
            Are you sure you want to revoke this grant? The user will lose
            access.
          </DialogContent>
          <DialogActions>
            <Button
              id="collaboration-grant-revoke-confirm"
              variant="contained"
              color="warning"
              type="submit"
              name="intent"
              value="revoke"
              disabled={!inputsEnabled}
            >
              Yes
            </Button>
            <Button
              onClick={() => setConfirmRevoke(false)}
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
