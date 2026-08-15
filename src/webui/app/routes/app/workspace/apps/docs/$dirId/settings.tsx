import { NamedEntityTag } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { DirSelect } from "@jupiter/core/apps/docs/sub/dir/component/select";
import { isDirRoot } from "@jupiter/core/apps/docs/sub/dir/root";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    parent_dir_ref_id: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId } = parseParams(params, ParamsSchema);

  try {
    const [dirLoad, findResult, allTags] = await Promise.all([
      apiClient.docs.dirLoad({
        ref_id: dirId,
        allow_archived: false,
        filter_ref_ids: null,
      }),
      apiClient.docs.dirFind({
        allow_archived: false,
        include_tags: true,
      }),
      apiClient.tags.tagFind({
        allow_archived: false,
      }),
    ]);

    const entry = findResult.entries.find((e) => e.dir.ref_id === dirId);
    const allDirsByRefId = new Map(
      findResult.entries.map((e) => [e.dir.ref_id, e.dir]),
    );
    allDirsByRefId.set(dirLoad.dir.ref_id, dirLoad.dir);

    const parentDirAccessible =
      dirLoad.dir.parent_dir_ref_id == null ||
      dirLoad.parent_dir_access_status != null;
    if (
      dirLoad.parent_dir != null &&
      !allDirsByRefId.has(dirLoad.parent_dir.ref_id)
    ) {
      allDirsByRefId.set(dirLoad.parent_dir.ref_id, {
        ...dirLoad.parent_dir,
        name: parentDirAccessible
          ? dirLoad.parent_dir.name
          : "Folder (no access)",
        parent_dir_ref_id: null,
      });
    }

    return json({
      dir: dirLoad.dir,
      tags: entry?.tags ?? [],
      owner: dirLoad.owner,
      accessStatus: dirLoad.access_status ?? null,
      allDirs: [...allDirsByRefId.values()],
      parentDirAccessible,
      allTags: allTags.tags,
      dirId,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        const dirLoad = await apiClient.docs.dirLoad({
          ref_id: dirId,
          allow_archived: false,
          filter_ref_ids: null,
        });

        if (isDirRoot(dirLoad.dir)) {
          return redirect(`/app/workspace/apps/docs/${dirId}/settings`);
        }

        const parentChanged =
          form.parent_dir_ref_id !== dirLoad.dir.parent_dir_ref_id;

        await apiClient.docs.dirUpdate({
          ref_id: dirId,
          name: {
            should_change: true,
            value: form.name,
          },
          parent_dir_ref_id: parentChanged
            ? {
                should_change: true,
                value: form.parent_dir_ref_id,
              }
            : { should_change: false },
        });

        return redirect(`/app/workspace/apps/docs/${dirId}`);
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

export default function DirFolderSettings() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled =
    navigation.state === "idle" &&
    accessStatusAllowsWriterOrAbove(loaderData.accessStatus);
  const isRoot = isDirRoot(loaderData.dir);

  return (
    <LeafPanel
      key={`docs-dir-settings-${loaderData.dir.ref_id}`}
      entityType={NamedEntityTag.DIR}
      entityRefId={loaderData.dir.ref_id}
      fakeKey={`docs-dir-settings-${loaderData.dir.ref_id}`}
      returnLocation={`/app/workspace/apps/docs/${loaderData.dirId}`}
      forgetReturnLocation="/app/workspace/apps/docs/root-redirect"
      inputsEnabled={inputsEnabled}
      accessable
      accessOwner={loaderData.owner}
      accessStatus={loaderData.accessStatus}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Folder"
        actions={
          !isRoot ? (
            <SectionActions
              id="docs-dir-settings-save"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "docs-dir-settings-save",
                  text: "Save",
                  value: "update",
                  highlight: true,
                }),
              ]}
            />
          ) : undefined
        }
      >
        <Stack spacing={2}>
          {isRoot && (
            <Typography variant="body2" color="text.secondary">
              The collection root folder cannot be renamed or moved. You can
              still edit tags below.
            </Typography>
          )}
          <FormControl fullWidth>
            <InputLabel id="docs-dir-settings-name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              defaultValue={loaderData.dir.name}
              readOnly={!inputsEnabled || isRoot}
              inputProps={{
                "aria-labelledby": "docs-dir-settings-name",
              }}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          {!isRoot && (
            <DirSelect
              name="parent_dir_ref_id"
              label="Parent folder"
              inputsEnabled={inputsEnabled && loaderData.parentDirAccessible}
              disabled={!loaderData.parentDirAccessible}
              allDirs={loaderData.allDirs}
              excludeSubtreeRootRefId={loaderData.dirId}
              defaultValue={loaderData.dir.parent_dir_ref_id ?? undefined}
            />
          )}

          <TagsEditor
            name="tags"
            allTags={loaderData.allTags}
            defaultValue={loaderData.tags.map((t) => t.ref_id)}
            inputsEnabled={inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.DIR, loaderData.dir.ref_id)}
            label="Tags"
            aloneOnLine
          />
        </Stack>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/apps/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: () => `Could not find this folder!`,
    error: () =>
      `There was an error loading folder settings! Please try again!`,
  },
);
