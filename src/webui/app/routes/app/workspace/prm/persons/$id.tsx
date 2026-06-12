import {
  InboxTask,
  ApiError,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  NamedEntityTag,
  RecurringTaskPeriod,
  WorkspaceFeature,
  Tag,
} from "@jupiter/webapi-client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Outlet,
  useActionData,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams, parseQuery } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortBirthdayTimeEventsNaturally as sortOccasionTimeEventsNaturally } from "@jupiter/core/common/sub/time_events/time-event";
import { sortInboxTasksNaturally } from "#/core/common/sub/inbox_tasks/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { TimeEventFullDaysBlockStack } from "@jupiter/core/common/sub/time_events/sub/full_days_block/component/stack";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionActions,
  ActionSingle,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { PersonEditor } from "@jupiter/core/prm/sub/person/component/editor";
import { OccasionStack } from "@jupiter/core/prm/sub/person/sub/occasion/components/stack";
import { AnimatePresence } from "framer-motion";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";
import {
  fixSelectOutputEntityId,
  selectZod,
} from "@jupiter/core/common/select-form";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const QuerySchema = z.object({
  catchUpTasksRetrieveOffset: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
  occasionTasksRetrieveOffset: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    circleRefIds: selectZod(z.string()),
    catchUpPeriod: z
      .union([z.nativeEnum(RecurringTaskPeriod), z.literal("none")])
      .optional(),
    catchUpEisen: z.nativeEnum(Eisen).optional(),
    catchUpDifficulty: z.nativeEnum(Difficulty).optional(),
    catchUpActionableFromDay: z.string().optional(),
    catchUpActionableFromMonth: z.string().optional(),
    catchUpDueAtDay: z.string().optional(),
    catchUpDueAtMonth: z.string().optional(),
  }),
  z.object({
    intent: z.literal("regen"),
  }),
  z.object({
    intent: z.literal("create-note"),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
  z.object({
    intent: z.literal("create-publish"),
    publishOwner: z.string(),
  }),
  z.object({
    intent: z.literal("activate-publish"),
    publishEntityRefId: z.string(),
  }),
  z.object({
    intent: z.literal("to-draft-publish"),
    publishEntityRefId: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const query = parseQuery(request, QuerySchema);

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    const result = await apiClient.prm.personLoad({
      ref_id: id,
      allow_archived: true,
      catch_up_task_retrieve_offset: query.catchUpTasksRetrieveOffset,
      occasion_task_retrieve_offset: query.occasionTasksRetrieveOffset,
    });

    const circlesResult = await apiClient.prm.circleFind({
      allow_archived: false,
    });
    const settings = await apiClient.prm.personLoadSettings({});

    return json({
      allCircles: circlesResult.circles,
      person: result.person,
      contact: result.contact,
      occasions: result.occasions,
      occasionTagsByRefId: result.occasion_tags_by_ref_id,
      circleRefIds: result.circle_ref_ids,
      maxCirclesPerPerson: settings.max_circles_per_person,
      catchUpTasks: result.catch_up_tasks,
      catchUpTasksTotalCnt: result.catch_up_tasks_total_cnt,
      catchUpTasksPageSize: result.catch_up_tasks_page_size,
      occasionTasks: result.occasion_tasks,
      occasionTasksTotalCnt: result.occasion_tasks_total_cnt,
      occasionTasksPageSize: result.occasion_tasks_page_size,
      tags: result.tags,
      note: result.note,
      publishEntity: result.publish_entity,
      occasionTimeEventBlocks: result.occasion_time_event_blocks,
      allTags: allTags.tags as Array<Tag>,
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
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.prm.personUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          circle_ref_ids: {
            should_change: true,
            value: fixSelectOutputEntityId(form.circleRefIds) || [],
          },
          catch_up_period: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : (form.catchUpPeriod as RecurringTaskPeriod),
          },
          catch_up_eisen: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : (form.catchUpEisen as Eisen),
          },
          catch_up_difficulty: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : (form.catchUpDifficulty as Difficulty),
          },
          catch_up_actionable_from_day: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : form.catchUpActionableFromDay === undefined ||
                    form.catchUpActionableFromDay === ""
                  ? undefined
                  : parseInt(form.catchUpActionableFromDay),
          },
          catch_up_actionable_from_month: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : form.catchUpActionableFromMonth === undefined ||
                    form.catchUpActionableFromMonth === ""
                  ? undefined
                  : parseInt(form.catchUpActionableFromMonth),
          },
          catch_up_due_at_day: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : form.catchUpDueAtDay === undefined ||
                    form.catchUpDueAtDay === ""
                  ? undefined
                  : parseInt(form.catchUpDueAtDay),
          },
          catch_up_due_at_month: {
            should_change: true,
            value:
              form.catchUpPeriod === undefined || form.catchUpPeriod === "none"
                ? undefined
                : form.catchUpDueAtMonth === undefined ||
                    form.catchUpDueAtMonth === ""
                  ? undefined
                  : parseInt(form.catchUpDueAtMonth),
          },
        });

        return redirect(`/app/workspace/prm/persons`);
      }

      case "regen": {
        await apiClient.prm.personRegen({
          ref_id: id,
        });

        return redirect(`/app/workspace/prm/persons/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.PERSON, id),
          content: [],
        });

        return redirect(`/app/workspace/prm/persons/${id}`);
      }

      case "archive": {
        await apiClient.prm.personArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/prm/persons`);
      }

      case "remove": {
        await apiClient.prm.personRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/prm/persons`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/prm/persons/${id}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/prm/persons/${id}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/prm/persons/${id}`);
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

export default function Person() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const person = loaderData.person;
  const allOccasionsByRefId = new Map(
    loaderData.occasions.map((o) => [o.ref_id, o]),
  );

  const sortedOccasionTasks = sortInboxTasksNaturally(
    loaderData.occasionTasks,
    {
      dueDateAscending: false,
    },
  );
  const sortedCatchUpTasks = sortInboxTasksNaturally(loaderData.catchUpTasks, {
    dueDateAscending: false,
  });

  const occasionTimeEventEntries = loaderData.occasionTimeEventBlocks
    .filter((f) => !f.archived)
    .map((block) => ({
      time_event: block,
      entry: {
        person: person,
        contact: loaderData.contact,
        occasion: allOccasionsByRefId.get(
          parseEntityLinkStd(block.owner).refId,
        )!,
        occasion_time_event: block,
      },
    }));
  const sortedOccasionTimeEventEntries = sortOccasionTimeEventsNaturally(
    occasionTimeEventEntries,
  );

  const inputsEnabled = navigation.state === "idle" && !person.archived;

  const cardActionFetcher = useFetcher();

  function handleCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.DONE,
      },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.NOT_DONE,
      },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  return (
    <LeafPanel
      key={`person-${person.ref_id}`}
      entityType={NamedEntityTag.PERSON}
      entityRefId={person.ref_id}
      fakeKey={`person-${person.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={person.archived}
      returnLocation="/app/workspace/prm/persons"
      shouldShowALeaflet={shouldShowALeaflet}
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <GlobalError actionResult={actionData} />
        <SectionCard
          title="Properties"
          actions={
            <SectionActions
              id="person-properties"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Save",
                  value: "update",
                  highlight: true,
                }),
                ActionSingle({
                  text: "Regen",
                  value: "regen",
                  highlight: false,
                }),
              ]}
            />
          }
        >
          <PersonEditor
            person={person}
            contact={loaderData.contact}
            tags={loaderData.tags}
            allTags={loaderData.allTags}
            allCircles={loaderData.allCircles}
            circleRefIds={loaderData.circleRefIds}
            maxCirclesPerPerson={loaderData.maxCirclesPerPerson}
            inputsEnabled={inputsEnabled}
            topLevelInfo={topLevelInfo}
            actionResult={actionData}
          />
        </SectionCard>

        <SectionCard
          title="Occasions"
          actions={
            <SectionActions
              id="person-occasions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New",
                  link: `/app/workspace/prm/persons/${person.ref_id}/occasions/new`,
                }),
              ]}
            />
          }
        >
          <OccasionStack
            occasions={loaderData.occasions}
            occasionTagsByRefId={loaderData.occasionTagsByRefId}
          />
        </SectionCard>

        <SectionCard
          title="Note"
          actions={
            <SectionActions
              id="person-note"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Create Note",
                  value: "create-note",
                  highlight: false,
                  disabled: loaderData.note !== null,
                }),
              ]}
            />
          }
        >
          {loaderData.note && (
            <>
              <EntityNoteEditor
                initialNote={loaderData.note}
                inputsEnabled={inputsEnabled}
              />
            </>
          )}
        </SectionCard>

        <SectionCard title="Birthday Tasks">
          {sortedOccasionTasks.length > 0 && (
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showDueDate: true,
                showHandleMarkDone: true,
                showHandleMarkNotDone: true,
              }}
              inboxTasks={sortedOccasionTasks}
              withPages={{
                retrieveOffsetParamName: "birthdayTasksRetrieveOffset",
                totalCnt: loaderData.occasionTasksTotalCnt,
                pageSize: loaderData.occasionTasksPageSize,
              }}
            />
          )}
        </SectionCard>

        <SectionCard title="Catch Up Tasks">
          {sortedCatchUpTasks.length > 0 && (
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showDueDate: true,
                showHandleMarkDone: true,
                showHandleMarkNotDone: true,
              }}
              inboxTasks={sortedCatchUpTasks}
              withPages={{
                retrieveOffsetParamName: "catchUpTasksRetrieveOffset",
                totalCnt: loaderData.catchUpTasksTotalCnt,
                pageSize: loaderData.catchUpTasksPageSize,
              }}
              onCardMarkDone={handleCardMarkDone}
              onCardMarkNotDone={handleCardMarkNotDone}
            />
          )}
        </SectionCard>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.SCHEDULE,
        ) &&
          sortedOccasionTimeEventEntries.length > 0 && (
            <TimeEventFullDaysBlockStack
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              title="Occasion Time Events"
              entries={sortedOccasionTimeEventEntries}
            />
          )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/prm/persons",
  ParamsSchema,
  {
    notFound: (params) => `Could not find person with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading person with ID ${params.id}! Please try again!`,
  },
);
