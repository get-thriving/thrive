import { type SlackTask } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { slackTaskNiceName } from "@jupiter/core/push_integrations/sub/slack/task";
import { ADateTag } from "@jupiter/core/common/component/adate-tag";
import { DifficultyTag } from "@jupiter/core/common/component/difficulty-tag";
import { EisenTag } from "@jupiter/core/common/component/eisen-tag";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.pushIntegrations.slackTaskFind({
    allow_archived: false,
    include_inbox_tasks: false,
  });
  return json(response.entries);
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function SlackTasks() {
  const entries = useLoaderDataSafeForAnimation<typeof loader>();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const sortedEntries = [...entries];

  return (
    <TrunkPanel key={"slack-tasks"} returnLocation="/app/workspace">
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <EntityStack>
          {sortedEntries.map((entry) => (
            <EntityCard
              key={`slack-task-${entry.slack_task.ref_id}`}
              entityId={`slack-task-${entry.slack_task.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/push-integrations/slack-tasks/${entry.slack_task.ref_id}`}
              >
                <EntityNameComponent
                  name={slackTaskNiceName(entry.slack_task as SlackTask)}
                />
                {entry.slack_task.generation_extra_info.actionable_date && (
                  <ADateTag
                    label="Actionabel From"
                    date={
                      entry.slack_task.generation_extra_info.actionable_date
                    }
                  />
                )}
                {entry.slack_task.generation_extra_info.due_date && (
                  <ADateTag
                    label="Due At"
                    date={entry.slack_task.generation_extra_info.due_date}
                  />
                )}
                {entry.slack_task.generation_extra_info.eisen && (
                  <EisenTag
                    eisen={entry.slack_task.generation_extra_info.eisen}
                  />
                )}
                {entry.slack_task.generation_extra_info.difficulty && (
                  <DifficultyTag
                    difficulty={
                      entry.slack_task.generation_extra_info.difficulty
                    }
                  />
                )}
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the Slack tasks! Please try again!`,
});
