import type { InboxTask } from "@jupiter/webapi-client";
import { Eisen, InboxTaskStatus } from "@jupiter/webapi-client";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

import { eisenIcon, eisenName } from "#/core/common/eisen";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { TabPanel } from "#/core/infra/component/tab-panel";
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
interface SmallScreenKanbanBaseProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  allowEisen?: Eisen;
  actionableTime: ActionableTime;
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
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
          showEisen,
          showDifficulty: true,
          showActionableDate: true,
          showDueDate: true,
          showParent: true,
        }}
        inboxTasks={inboxTasks}
        optimisticUpdates={props.optimisticUpdates}
        moreInfoByRefId={props.moreInfoByRefId}
        cardLinkResolver={props.cardLinkResolver}
        onCardMarkDone={props.onCardMarkDone}
        onCardMarkNotDone={props.onCardMarkNotDone}
      />
    </TabPanel>
  );
}
