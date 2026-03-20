import type {
  AspectSummary,
  Contact,
  GoalSummary,
  InboxTask,
  Tag,
} from "@jupiter/webapi-client";
import { Eisen, InboxTaskStatus } from "@jupiter/webapi-client";
import { Tab, Tabs } from "@mui/material";
import { Fragment, useMemo, useState } from "react";

import { eisenIcon, eisenName } from "#/core/common/eisen";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { TabPanel } from "#/core/infra/component/tab-panel";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { InboxTasksNoTasksCard } from "#/core/inbox_tasks/component/no-tasks-card";
import { InboxTaskStack } from "#/core/inbox_tasks/component/stack";
import {
  filterInboxTasksForDisplay,
  type InboxTaskOptimisticState,
  type InboxTaskParent,
} from "#/core/inbox_tasks/root";
import {
  inboxTaskStatusIcon,
  inboxTaskStatusName,
} from "#/core/inbox_tasks/status";
import { sortAspectsByTreeOrder } from "#/core/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";

interface SmallScreenKanbanBaseProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  allowEisen?: Eisen;
  actionableTime: ActionableTime;
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
  emptyParent: string;
  emptyParentLabel: string;
  emptyParentNewLocations: string;
  cardLinkResolver?: (it: InboxTask, parent?: InboxTaskParent) => string;
  includeGeneratedNotStarted?: boolean;
}

export function SmallScreenKanban(props: SmallScreenKanbanBaseProps) {
  const includeGeneratedNotStarted = props.includeGeneratedNotStarted ?? true;
  const actionableDate = actionableTimeToDateTime(
    props.actionableTime,
    props.topLevelInfo.user.timezone,
  );
  const notStartedTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.NOT_STARTED],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
      allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
    },
  );
  const recurringTasks = includeGeneratedNotStarted
    ? filterInboxTasksForDisplay(
        props.inboxTasks,
        props.moreInfoByRefId,
        props.optimisticUpdates,
        {
          allowArchived: false,
          allowStatuses: [InboxTaskStatus.NOT_STARTED_GEN],
          includeIfNoActionableDate: true,
          includeIfNoDueDate: true,
          actionableDateEnd: actionableDate,
          allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
        },
      )
    : [];
  const inProgressTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.IN_PROGRESS],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
      allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
    },
  );
  const blockedTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.BLOCKED],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
      allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
    },
  );
  const notDoneTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.NOT_DONE],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
      allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
    },
  );
  const doneTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.DONE],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
      allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
    },
  );

  let initialSmallScreenSelectedTab = 0;
  if (notStartedTasks.length > 0) {
    initialSmallScreenSelectedTab = 0;
  } else if (includeGeneratedNotStarted && recurringTasks.length > 0) {
    initialSmallScreenSelectedTab = 1;
  } else if (inProgressTasks.length > 0) {
    initialSmallScreenSelectedTab = includeGeneratedNotStarted ? 2 : 1;
  } else if (blockedTasks.length > 0) {
    initialSmallScreenSelectedTab = includeGeneratedNotStarted ? 3 : 2;
  } else if (notDoneTasks.length > 0) {
    initialSmallScreenSelectedTab = includeGeneratedNotStarted ? 4 : 3;
  } else if (doneTasks.length > 0) {
    initialSmallScreenSelectedTab = includeGeneratedNotStarted ? 5 : 4;
  }

  const [smallScreenSelectedTab, setSmallScreenSelectedTab] = useState(
    initialSmallScreenSelectedTab,
  );

  return (
    <>
      <Tabs
        value={smallScreenSelectedTab}
        variant="scrollable"
        onChange={(_, newValue) => setSmallScreenSelectedTab(newValue)}
      >
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.NOT_STARTED)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.NOT_STARTED)}
        />
        {includeGeneratedNotStarted && (
          <Tab
            icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.NOT_STARTED_GEN)}</p>}
            iconPosition="top"
            label={inboxTaskStatusName(InboxTaskStatus.NOT_STARTED_GEN)}
          />
        )}
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.IN_PROGRESS)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.IN_PROGRESS)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.BLOCKED)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.BLOCKED)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.NOT_DONE)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.NOT_DONE)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.DONE)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.DONE)}
        />
      </Tabs>

      {renderTabContent(
        0,
        notStartedTasks,
        smallScreenSelectedTab,
        props,
        props.allowEisen === undefined,
      )}
      {includeGeneratedNotStarted &&
        renderTabContent(
          1,
          recurringTasks,
          smallScreenSelectedTab,
          props,
          props.allowEisen === undefined,
        )}
      {renderTabContent(
        includeGeneratedNotStarted ? 2 : 1,
        inProgressTasks,
        smallScreenSelectedTab,
        props,
        props.allowEisen === undefined,
      )}
      {renderTabContent(
        includeGeneratedNotStarted ? 3 : 2,
        blockedTasks,
        smallScreenSelectedTab,
        props,
        props.allowEisen === undefined,
      )}
      {renderTabContent(
        includeGeneratedNotStarted ? 4 : 3,
        notDoneTasks,
        smallScreenSelectedTab,
        props,
        props.allowEisen === undefined,
      )}
      {renderTabContent(
        includeGeneratedNotStarted ? 5 : 4,
        doneTasks,
        smallScreenSelectedTab,
        props,
        props.allowEisen === undefined,
      )}
    </>
  );
}

export function SmallScreenKanbanByEisen(props: SmallScreenKanbanBaseProps) {
  const [smallScreenSelectedTab, setSmallScreenSelectedTab] = useState(0);

  return (
    <>
      <Tabs
        value={smallScreenSelectedTab}
        variant="scrollable"
        onChange={(_, newValue) => setSmallScreenSelectedTab(newValue)}
      >
        <Tab
          icon={<p>{eisenIcon(Eisen.IMPORTANT_AND_URGENT)}</p>}
          iconPosition="top"
          label={eisenName(Eisen.IMPORTANT_AND_URGENT)}
        />
        <Tab
          icon={<p>{eisenIcon(Eisen.URGENT)}</p>}
          iconPosition="top"
          label={eisenName(Eisen.URGENT)}
        />
        <Tab
          icon={<p>{eisenIcon(Eisen.IMPORTANT)}</p>}
          iconPosition="top"
          label={eisenName(Eisen.IMPORTANT)}
        />
        <Tab
          icon={<p>{eisenIcon(Eisen.REGULAR)}</p>}
          iconPosition="top"
          label={eisenName(Eisen.REGULAR)}
        />
      </Tabs>

      <TabPanel value={smallScreenSelectedTab} index={0}>
        <SmallScreenKanban {...props} allowEisen={Eisen.IMPORTANT_AND_URGENT} />
      </TabPanel>
      <TabPanel value={smallScreenSelectedTab} index={1}>
        <SmallScreenKanban {...props} allowEisen={Eisen.URGENT} />
      </TabPanel>
      <TabPanel value={smallScreenSelectedTab} index={2}>
        <SmallScreenKanban {...props} allowEisen={Eisen.IMPORTANT} />
      </TabPanel>
      <TabPanel value={smallScreenSelectedTab} index={3}>
        <SmallScreenKanban {...props} allowEisen={Eisen.REGULAR} />
      </TabPanel>
    </>
  );
}

export function SmallScreenKanbanByAspect(props: SmallScreenKanbanBaseProps) {
  const aspects = useMemo(
    () => getUniqueAspectsSorted(props.moreInfoByRefId),
    [props.moreInfoByRefId],
  );
  const [selectedTab, setSelectedTab] = useState(0);

  if (props.inboxTasks.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent={props.emptyParent}
        parentLabel={props.emptyParentLabel}
        parentNewLocations={props.emptyParentNewLocations}
      />
    );
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, newValue) => setSelectedTab(newValue)}
      >
        {aspects.map((aspect) => (
          <Tab key={aspect.ref_id} label={aspect.name} />
        ))}
      </Tabs>

      {aspects.map((aspect, index) => {
        const aspectTasks = props.inboxTasks.filter(
          (it) => it.aspect_ref_id === aspect.ref_id,
        );
        return (
          <TabPanel key={aspect.ref_id} value={selectedTab} index={index}>
            <SmallScreenKanban {...props} inboxTasks={aspectTasks} />
          </TabPanel>
        );
      })}
    </>
  );
}

export function SmallScreenKanbanByAspectAndGoal(
  props: SmallScreenKanbanBaseProps,
) {
  const aspects = useMemo(
    () => getUniqueAspectsSorted(props.moreInfoByRefId),
    [props.moreInfoByRefId],
  );
  const [selectedTab, setSelectedTab] = useState(0);

  if (props.inboxTasks.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent={props.emptyParent}
        parentLabel={props.emptyParentLabel}
        parentNewLocations={props.emptyParentNewLocations}
      />
    );
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, newValue) => setSelectedTab(newValue)}
      >
        {aspects.map((aspect) => (
          <Tab key={aspect.ref_id} label={aspect.name} />
        ))}
      </Tabs>

      {aspects.map((aspect, index) => {
        const aspectTasks = props.inboxTasks.filter(
          (it) => it.aspect_ref_id === aspect.ref_id,
        );
        const goals = getUniqueGoalsForAspect(
          props.moreInfoByRefId,
          aspect.ref_id,
        );
        const tasksWithoutGoal = aspectTasks.filter(
          (it) => !props.moreInfoByRefId[it.ref_id]?.goal,
        );

        return (
          <TabPanel key={aspect.ref_id} value={selectedTab} index={index}>
            {goals.map((goal) => {
              const goalTasks = aspectTasks.filter(
                (it) =>
                  props.moreInfoByRefId[it.ref_id]?.goal?.ref_id ===
                  goal.ref_id,
              );
              if (goalTasks.length === 0) return null;
              return (
                <Fragment key={goal.ref_id}>
                  <StandardDivider title={goal.name} size="medium" />
                  <SmallScreenKanban {...props} inboxTasks={goalTasks} />
                </Fragment>
              );
            })}

            {tasksWithoutGoal.length > 0 && (
              <>
                {goals.length > 0 && (
                  <StandardDivider title="No Goal" size="medium" />
                )}
                <SmallScreenKanban {...props} inboxTasks={tasksWithoutGoal} />
              </>
            )}
          </TabPanel>
        );
      })}
    </>
  );
}

function renderTabContent(
  index: number,
  inboxTasks: Array<InboxTask>,
  selectedTab: number,
  props: SmallScreenKanbanBaseProps,
  showEisen: boolean,
) {
  return (
    <TabPanel value={selectedTab} index={index}>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent={props.emptyParent}
          parentLabel={props.emptyParentLabel}
          parentNewLocations={props.emptyParentNewLocations}
        />
      )}
      <InboxTaskStack
        topLevelInfo={props.topLevelInfo}
        showOptions={{
          showSource: true,
          showLifePlan: true,
          showEisen,
          showDifficulty: true,
          showActionableDate: true,
          showDueDate: true,
          showParent: true,
        }}
        inboxTasks={inboxTasks}
        optimisticUpdates={props.optimisticUpdates}
        moreInfoByRefId={props.moreInfoByRefId}
        inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
        inboxTaskContactsByInboxTaskRefId={
          props.inboxTaskContactsByInboxTaskRefId
        }
        cardLinkResolver={props.cardLinkResolver}
        onCardMarkDone={props.onCardMarkDone}
        onCardMarkNotDone={props.onCardMarkNotDone}
      />
    </TabPanel>
  );
}

function getUniqueAspectsSorted(moreInfoByRefId: {
  [key: string]: InboxTaskParent;
}): AspectSummary[] {
  const aspectMap = new Map<string, AspectSummary>();
  for (const parent of Object.values(moreInfoByRefId)) {
    if (parent.aspect) {
      aspectMap.set(parent.aspect.ref_id, parent.aspect);
    }
  }
  return sortAspectsByTreeOrder([...aspectMap.values()]);
}

function getUniqueGoalsForAspect(
  moreInfoByRefId: { [key: string]: InboxTaskParent },
  aspectRefId: string,
): GoalSummary[] {
  const goalMap = new Map<string, GoalSummary>();
  for (const parent of Object.values(moreInfoByRefId)) {
    if (parent.aspect?.ref_id === aspectRefId && parent.goal) {
      goalMap.set(parent.goal.ref_id, parent.goal);
    }
  }
  return sortGoalsNaturally([...goalMap.values()]);
}
