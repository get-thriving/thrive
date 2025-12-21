import { type EmailTask } from "@jupiter/webapi-client";
import TuneIcon from "@mui/icons-material/Tune";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { emailTaskNiceName } from "@jupiter/core/push_integrations/sub/email/task";
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
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.pushIntegrations.emailTaskFind({
    allow_archived: false,
    include_inbox_task: false,
  });
  return json(response.entries);
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function EmailTasks() {
  const entries = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const sortedEntries = [...entries];

  return (
    <TrunkPanel
      key={"email-tasks"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="email-tasks-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavSingle({
              text: "Settings",
              icon: <TuneIcon />,
              link: "/app/workspace/push-integrations/email-tasks/settings",
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <EntityStack>
          {sortedEntries.map((entry) => (
            <EntityCard
              key={`email-task-${entry.email_task.ref_id}`}
              entityId={`email-task-${entry.email_task.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/push-integrations/email-tasks/${entry.email_task.ref_id}`}
              >
                <EntityNameComponent
                  name={emailTaskNiceName(entry.email_task as EmailTask)}
                />
                {entry.email_task.generation_extra_info.actionable_date && (
                  <ADateTag
                    label="Actionabel From"
                    date={
                      entry.email_task.generation_extra_info.actionable_date
                    }
                  />
                )}
                {entry.email_task.generation_extra_info.due_date && (
                  <ADateTag
                    label="Due At"
                    date={entry.email_task.generation_extra_info.due_date}
                  />
                )}
                {entry.email_task.generation_extra_info.eisen && (
                  <EisenTag
                    eisen={entry.email_task.generation_extra_info.eisen}
                  />
                )}
                {entry.email_task.generation_extra_info.difficulty && (
                  <DifficultyTag
                    difficulty={
                      entry.email_task.generation_extra_info.difficulty
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
  error: () => `There was an error loading the email tasks! Please try again!`,
});
