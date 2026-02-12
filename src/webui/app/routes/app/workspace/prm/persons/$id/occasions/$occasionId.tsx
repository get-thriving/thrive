import {
  ApiError,
  OccasionKind,
  Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { BirthdaySelect } from "@jupiter/core/common/component/birthday-select";
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
import { OccasionKindSelect } from "#/core/prm/sub/person/sub/occasion/components/kind-select";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  occasionId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    kind: z.nativeEnum(OccasionKind),
    date: z.string(),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { occasionId } = parseParams(params, ParamsSchema);

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.OCCASION],
    });

    const result = await apiClient.prm.occasionLoad({
      ref_id: occasionId,
      allow_archived: true,
    });

    return json({
      occasion: result.occasion,
      tags: result.tags,
      allTags: allTags.tags,
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
  const { id: personId, occasionId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.prm.occasionUpdate({
          ref_id: occasionId,
          name: {
            should_change: true,
            value: form.name,
          },
          kind: {
            should_change: true,
            value: form.kind,
          },
          date: {
            should_change: true,
            value: form.date,
          },
        });

        return redirect(`/app/workspace/prm/persons/${personId}`);
      }

      case "archive": {
        await apiClient.prm.occasionArchive({
          ref_id: occasionId,
        });
        return redirect(`/app/workspace/prm/persons/${personId}`);
      }

      case "remove": {
        await apiClient.prm.occasionRemove({
          ref_id: occasionId,
        });
        return redirect(`/app/workspace/prm/persons/${personId}`);
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

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function OccasionView() {
  const { occasion, tags, allTags } =
    useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle" && !occasion.archived;

  return (
    <LeafPanel
      key={`occasion-${occasion.ref_id}`}
      fakeKey={`occasion-${occasion.ref_id}`}
      isLeaflet
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={occasion.archived}
      returnLocation={`/app/workspace/prm/persons/${occasion.person_ref_id}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="occasion-properties"
        title="Properties"
        actions={
          <SectionActions
            id="occasion-properties"
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
        <Stack direction="row" spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={occasion.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              label={null}
              allTags={allTags}
              defaultValue={tags.map((tag: Tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.OCCASION}
              sourceEntityRefId={occasion.ref_id}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <FormLabel id="kind">Kind</FormLabel>
          <OccasionKindSelect
            name="kind"
            defaultValue={occasion.kind}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/kind" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="date">Date</FormLabel>
          <BirthdaySelect
            name="date"
            initialValue={occasion.date}
            inputsEnabled={inputsEnabled}
            allowNoneBirthday={false}
          />
          <FieldError actionResult={actionData} fieldName="/birthday" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../../..", ParamsSchema, {
  notFound: (params) => `Could not find occasion #${params.occasionId}!`,
  error: (params) =>
    `There was an error loading occasion #${params.occasionId}! Please try again!`,
});
