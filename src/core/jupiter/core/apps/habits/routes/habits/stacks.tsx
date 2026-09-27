import type {
  Contact,
  HabitStackFindResultEntry,
  Tag,
} from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useContext } from "react";

import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "#/core/infra/component/error-boundary";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "#/core/infra/component/layout/nested-outlet";
import { TrunkPanel } from "#/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import {
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { PeriodTag } from "#/core/common/component/period-tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";
import { LocationTag } from "#/core/common/sub/locations/component/location-tag";
import { UserLightChip } from "#/core/users/components/user-light-chip";
import { sortHabitStacksNaturally } from "#/core/apps/habits/root";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { basicShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.habits.habitStackFind({
    allow_archived: false,
    include_tags: true,
    include_notes: false,
    include_life_plan: false,
    include_habits: false,
  });

  return {
    entries: response.entries as Array<HabitStackFindResultEntry>,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function HabitStacks() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const sortedStacks = sortHabitStacksNaturally(
    loaderData.entries.map((entry) => entry.habit_stack),
  );
  const entriesByRefId = new Map(
    loaderData.entries.map((entry) => [entry.habit_stack.ref_id, entry]),
  );

  return (
    <TrunkPanel
      key="habits-stacks"
      createLocation="/app/workspace/apps/habits/stacks/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="habit-stacks-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavSingle({
              id: "habits-all",
              text: "All habits",
              link: "/app/workspace/apps/habits/habits",
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {sortedStacks.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no habit stacks to show. You can create a new stack."
            newEntityLocations="/app/workspace/apps/habits/stacks/new"
            helpSubject={DocsHelpSubject.HABITS}
          />
        )}
        <EntityStack>
          {sortedStacks.map((stack) => {
            const entry = entriesByRefId.get(stack.ref_id);
            if (!entry) {
              return null;
            }
            return (
              <EntityCard
                key={`habit-stack-${stack.ref_id}`}
                entityId={`habit-stack-${stack.ref_id}`}
              >
                <UserLightChip
                  user={entry.owner}
                  currentUserRefId={topLevelInfo.user.ref_id}
                />
                <EntityLink
                  to={`/app/workspace/apps/habits/stacks/${stack.ref_id}`}
                >
                  <EntityNameComponent name={stack.name} />
                  <PeriodTag period={stack.period} />
                  {entry.tags?.map((tag: Tag) => (
                    <TagTag key={tag.ref_id} tag={tag} />
                  ))}
                  {entry.contacts?.map((contact: Contact) => (
                    <ContactTag key={contact.ref_id} contact={contact} />
                  ))}
                  {entry.location && <LocationTag location={entry.location} />}
                </EntityLink>
              </EntityCard>
            );
          })}
        </EntityStack>
      </NestingAwareBlock>

      <NestedOutlet />
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading habit stacks! Please try again!`,
});
