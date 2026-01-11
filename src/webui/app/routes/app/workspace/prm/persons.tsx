import TuneIcon from "@mui/icons-material/Tune";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import { DifficultyTag } from "@jupiter/core/common/component/difficulty-tag";
import { EisenTag } from "@jupiter/core/common/component/eisen-tag";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { CircleTag } from "@jupiter/core/prm/sub/circle/components/tag";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  NavMultipleSpread,
  NavSingle,
  FilterManyOptions,
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
  const body = await apiClient.prm.personFind({
    allow_archived: false,
    include_occasions: false,
    include_circle_ref_ids: true,
    include_catch_up_inbox_tasks: false,
    include_occasion_inbox_tasks: false,
    include_occasion_time_event_blocks: false,
    include_notes: false,
  });

  const circlesResult = await apiClient.prm.circleFind({
    allow_archived: false,
    filter_ref_ids: null,
  });

  return json({
    entries: body.entries,
    allCircles: circlesResult.circles,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Persons() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const [selectedCirclesRefId, setSelectedCirclesRefId] = useState<string[]>(
    [],
  );

  const circlesByRefId = new Map(
    loaderData.allCircles.map((c) => [c.ref_id, c]),
  );

  const filteredEntries = loaderData.entries.filter((entry) => {
    if (selectedCirclesRefId.length === 0) {
      return true;
    }
    return entry.circle_ref_ids.some((cid) =>
      selectedCirclesRefId.includes(cid),
    );
  });

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  return (
    <TrunkPanel
      key={"persons"}
      createLocation="/app/workspace/prm/persons/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="persons-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavMultipleSpread({
              navs: [
                NavSingle({
                  text: "Circles",
                  link: `/app/workspace/prm/circles`,
                  icon: <GroupWorkIcon />,
                }),
              ],
            }),
            NavSingle({
              text: "Settings",
              link: `/app/workspace/prm/settings`,
              icon: <TuneIcon />,
            }),
            FilterManyOptions(
              "Circles",
              loaderData.allCircles.map((c) => ({
                value: c.ref_id,
                text: String(c.name),
              })),
              setSelectedCirclesRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeaf}
      >
        {filteredEntries.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no persons to show with the current filters. You can create a new person."
            newEntityLocations="/app/workspace/prm/persons/new"
            helpSubject={DocsHelpSubject.PRM}
          />
        )}

        <EntityStack>
          {filteredEntries.map((entry) => (
            <EntityCard
              entityId={`person-${entry.person.ref_id}`}
              key={`person-${entry.person.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/prm/persons/${entry.person.ref_id}`}
              >
                <EntityNameComponent name={entry.person.name} />
                {entry.circle_ref_ids.length > 0 && (
                  <>
                    {entry.circle_ref_ids
                      .map((circleRefId) => circlesByRefId.get(circleRefId))
                      .filter((c): c is NonNullable<typeof c> => Boolean(c))
                      .map((circle) => (
                        <CircleTag
                          key={`circle-${circle.ref_id}`}
                          circle={circle}
                        />
                      ))}
                  </>
                )}

                {entry.person.catch_up_params && (
                  <>
                    <PeriodTag period={entry.person.catch_up_params.period} />
                    {entry.person.catch_up_params.eisen && (
                      <EisenTag eisen={entry.person.catch_up_params.eisen} />
                    )}
                    {entry.person.catch_up_params.difficulty && (
                      <DifficultyTag
                        difficulty={entry.person.catch_up_params.difficulty}
                      />
                    )}
                  </>
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
  error: () => `There was an error loading the PRM! Please try again!`,
});
