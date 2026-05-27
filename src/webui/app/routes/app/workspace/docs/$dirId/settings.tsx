import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
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
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { DirSelect } from "@jupiter/core/docs/sub/dir/component/select";
import { isDirRoot } from "@jupiter/core/docs/sub/dir/root";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

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
    const findResult = await apiClient.docs.dirFind({
      allow_archived: false,
      include_tags: true,
    });
    const entry = findResult.entries.find((e) => e.dir.ref_id === dirId);
    if (!entry) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    return json({
      dir: entry.dir,
      tags: entry.tags,
      allDirs: findResult.entries.map((e) => e.dir),
      allTags: allTags.tags,
      dirId,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }
    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        const findResult = await apiClient.docs.dirFind({
          allow_archived: false,
          include_tags: true,
        });
        const entry = findResult.entries.find((e) => e.dir.ref_id === dirId);
        if (!entry) {
          throw new Response(ReasonPhrases.NOT_FOUND, {
            status: StatusCodes.NOT_FOUND,
            statusText: ReasonPhrases.NOT_FOUND,
          });
        }

        if (isDirRoot(entry.dir)) {
          return redirect(`/app/workspace/docs/${dirId}/settings`);
        }

        await apiClient.docs.dirUpdate({
          ref_id: dirId,
          name: {
            should_change: true,
            value: form.name,
          },
          parent_dir_ref_id: {
            should_change: true,
            value: form.parent_dir_ref_id,
          },
        });

        return redirect(`/app/workspace/docs/${dirId}`);
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

export default function DirFolderSettings() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const isRoot = isDirRoot(loaderData.dir);

  return (
    <LeafPanel
      key={`docs-dir-settings-${loaderData.dir.ref_id}`}
      fakeKey={`docs-dir-settings-${loaderData.dir.ref_id}`}
      returnLocation={`/app/workspace/docs/${loaderData.dirId}`}
      inputsEnabled={inputsEnabled}
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
              inputsEnabled={inputsEnabled}
              disabled={false}
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
  (params) => `/app/workspace/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: () => `Could not find this folder!`,
    error: () =>
      `There was an error loading folder settings! Please try again!`,
  },
);
