import type {
  AspectSummary,
  ChapterSummary,
  Contact,
  GoalSummary,
  Chore,
  LifePlan,
  MilestoneSummary,
} from "@jupiter/webapi-client";
import { NamedEntityTag, WorkspaceFeature } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { ChoreStackPropertiesEditor } from "@jupiter/core/apps/chores/component/stack-properties-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionActions,
  ActionSingle,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimePlanActivityList } from "@jupiter/core/apps/time_plans/sub/activity/component/list";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { sortChoresNaturally } from "@jupiter/core/apps/chores/root";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    choreRefIds: z.string().optional(),
    aspect: z.string().optional(),
    chapter: z.string().optional(),
    goal: z.string().optional(),
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

  try {
    const summaryPromise = apiClient.application.getSummaries({
      include_workspace: true,
      include_life_plan: true,
      include_aspects: true,
      include_chapters: true,
      include_goals: true,
      include_milestones: true,
    });
    // Only this call depends on another one (the workspace's features), so it
    // chains off the summaries while everything else runs concurrently.
    const timePlanActivitiesPromise = summaryPromise.then(
      async (summaryResponse) => {
        if (
          !isWorkspaceFeatureAvailable(
            summaryResponse.workspace!,
            WorkspaceFeature.TIME_PLANS,
          )
        ) {
          return undefined;
        }
        const timePlanActivitiesResult =
          await apiClient.timePlans.timePlanActivityFindForTarget({
            allow_archived: true,
            target: `ChoreStack:std:${id}`,
          });
        return timePlanActivitiesResult.entries;
      },
    );

    const [
      summaryResponse,
      allTags,
      allContacts,
      choresResponse,
      result,
      timePlanActivities,
    ] = await Promise.all([
      summaryPromise,
      apiClient.tags.tagFind({
        allow_archived: false,
      }),
      apiClient.contacts.contactFind({
        allow_archived: false,
      }),
      apiClient.chores.choreFind({
        allow_archived: false,
        include_tags: false,
        include_notes: false,
        include_life_plan: false,
        include_inbox_tasks: false,
      }),
      apiClient.chores.choreStackLoad({
        ref_id: id,
        allow_archived: true,
      }),
      timePlanActivitiesPromise,
    ]);

    return json({
      choreStack: result.chore_stack,
      chores: result.chores as Array<Chore>,
      tags: result.tags,
      note: result.note,
      aspect: result.aspect,
      chapter: result.chapter,
      goal: result.goal,
      lifePlan: summaryResponse.life_plan as LifePlan | null,
      allAspects: summaryResponse.aspects as Array<AspectSummary> | null,
      allChapters: summaryResponse.chapters as Array<ChapterSummary> | null,
      allGoals: summaryResponse.goals as Array<GoalSummary> | null,
      allMilestones:
        summaryResponse.milestones as Array<MilestoneSummary> | null,
      allTags: allTags.tags,
      contacts: result.contacts ?? [],
      location: result.location ?? null,
      allContacts: allContacts.contacts as Array<Contact>,
      allChores: choresResponse.entries.map(
        (entry) => entry.chore,
      ) as Array<Chore>,
      timePlanActivities,
      publishEntity: result.publish_entity ?? null,
      owner: result.owner,
      accessStatus: result.access_status ?? null,
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
        const choreRefIds = (form.choreRefIds ?? "")
          .split(",")
          .map((refId) => refId.trim())
          .filter((refId) => refId.length > 0);

        await apiClient.chores.choreStackUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          chore_ref_ids: {
            should_change: true,
            value: choreRefIds,
          },
          aspect_ref_id:
            form.aspect !== undefined
              ? { should_change: true, value: form.aspect }
              : { should_change: false },
          chapter_ref_id:
            form.aspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.chapter !== undefined && form.chapter !== ""
                      ? form.chapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.aspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.goal !== undefined && form.goal !== ""
                      ? form.goal
                      : undefined,
                }
              : { should_change: false },
        });

        return redirect(`/app/workspace/apps/chores/stacks`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.CHORE_STACK, id),
          content: [],
        });

        return redirect(`/app/workspace/apps/chores/stacks/${id}`);
      }

      case "archive": {
        await apiClient.chores.choreStackArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/apps/chores/stacks`);
      }

      case "remove": {
        await apiClient.chores.choreStackRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/apps/chores/stacks`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/apps/chores/stacks/${id}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/apps/chores/stacks/${id}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/apps/chores/stacks/${id}`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function ChoreStackView() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" &&
    !loaderData.choreStack.archived &&
    accessStatusAllowsWriterOrAbove(loaderData.accessStatus);

  const sortedChores = sortChoresNaturally(loaderData.chores);

  return (
    <LeafPanel
      key={`chore-stack-${loaderData.choreStack.ref_id}`}
      entityType={NamedEntityTag.CHORE_STACK}
      entityRefId={loaderData.choreStack.ref_id}
      fakeKey={`chore-stack-${loaderData.choreStack.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.choreStack.archived}
      returnLocation="/app/workspace/apps/chores/stacks"
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
      accessable
      accessOwner={loaderData.owner}
      accessStatus={loaderData.accessStatus}
    >
      <GlobalError actionResult={actionData} />
      <ChoreStackPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={loaderData.lifePlan}
        allAspects={loaderData.allAspects ?? []}
        allChapters={loaderData.allChapters ?? []}
        allGoals={loaderData.allGoals ?? []}
        allMilestones={loaderData.allMilestones ?? []}
        allChores={loaderData.allChores}
        chores={loaderData.chores}
        allTags={loaderData.allTags}
        tags={loaderData.tags}
        allContacts={loaderData.allContacts}
        contacts={loaderData.contacts}
        location={loaderData.location}
        inputsEnabled={inputsEnabled}
        entityOwner={loaderData.owner}
        choreStack={loaderData.choreStack}
        aspect={loaderData.aspect}
        chapter={loaderData.chapter}
        goal={loaderData.goal}
        actionData={actionData}
      />

      <SectionCard title="Chores">
        <EntityStack>
          {sortedChores.map((chore) => (
            <EntityCard
              key={`chore-${chore.ref_id}`}
              entityId={`chore-${chore.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/apps/chores/chores/${chore.ref_id}`}
              >
                <EntityNameComponent name={chore.name} />
                <PeriodTag period={chore.gen_params.period} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="chore-stack-note"
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
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        )}
      </SectionCard>

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.SCHEDULE,
      ) && (
        <TimeEventInDayBlockStack
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          title="Time Events"
          createLocation={`/app/workspace/calendar/time-event/in-day-block/new-for-chore-stack?choreStackRefId=${loaderData.choreStack.ref_id}`}
          entries={[]}
        />
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.TIME_PLANS,
      ) &&
        loaderData.timePlanActivities && (
          <SectionCard
            id="chore-stack-time-plans"
            title="Time Plans"
            actions={
              <SectionActions
                id="chore-stack-time-plans-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  NavSingle({
                    text: "Add",
                    highlight: false,
                    link: `/app/workspace/apps/time-plans/add-chore-stack-to-plans?choreStackRefId=${loaderData.choreStack.ref_id}`,
                  }),
                ]}
              />
            }
          >
            <TimePlanActivityList
              topLevelInfo={topLevelInfo}
              activities={loaderData.timePlanActivities.map(
                (entry) => entry.time_plan_activity,
              )}
              timePlansByRefId={
                new Map(
                  loaderData.timePlanActivities.map((entry) => [
                    entry.time_plan.ref_id,
                    entry.time_plan,
                  ]),
                )
              }
              inboxTasksByRefId={new Map()}
              bigPlansByRefId={new Map()}
              todoTasksByRefId={new Map()}
              habitsByRefId={new Map()}
              choreStacksByRefId={
                new Map([[loaderData.choreStack.ref_id, loaderData.choreStack]])
              }
              choresByRefId={new Map()}
              activityDoneness={{}}
              timeEventsByRefId={new Map()}
              fullInfo={false}
              showTimePlanName={true}
            />
          </SectionCard>
        )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/chores/stacks",
  ParamsSchema,
  {
    notFound: (params) => `Could not find chore stack with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading chore stack with ID ${params.id}! Please try again!`,
  },
);
