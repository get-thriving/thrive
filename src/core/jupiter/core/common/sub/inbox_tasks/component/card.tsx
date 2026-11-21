import type {
  ADate,
  BigPlan,
  Chore,
  Contact,
  EmailTask,
  Habit,
  InboxTask,
  Metric,
  SlackTask,
} from "@jupiter/webapi-client";
import { InboxTaskStatus, WorkspaceFeature } from "@jupiter/webapi-client";
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import type { PanInfo } from "framer-motion";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useContext, useState } from "react";

import { aDateToDate } from "#/core/common/adate";
import {
  accessStatusAllowsWriterOrAbove,
  entityOwnedByCurrentUser,
} from "#/core/common/sub/access/access-level";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { isCompleted } from "#/core/common/sub/inbox_tasks/status";
import type {
  InboxTaskOptimisticState,
  InboxTaskParent,
} from "#/core/common/sub/inbox_tasks/root";
import { ClientOnly } from "#/core/infra/component/client-only";
import {
  CardCornerChipStack,
  CornerChip,
  SlimChip,
} from "#/core/infra/component/chips";
import { OverdueThresholdsContext } from "#/core/infra/overdue-thresholds-context";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { strataColors, strataType } from "#/core/infra/component/strata-tokens";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { BigPlanTag } from "#/core/apps/big_plans/component/tag";
import { ChoreTag } from "#/core/apps/chores/component/tag";
import { DifficultyTag } from "#/core/common/component/difficulty-tag";
import { EisenTag } from "#/core/common/component/eisen-tag";
import { EmailTaskTag } from "#/core/push_integrations/sub/email/component/tag";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { HabitTag } from "#/core/apps/habits/component/habit-tag";
import { HabitStackTag } from "#/core/apps/habits/component/habit-stack-tag";
import { ChoreStackTag } from "#/core/apps/chores/component/chore-stack-tag";
import { InboxTaskNamespaceTag } from "#/core/common/sub/inbox_tasks/component/namespace-tag";
import { parentLinkNamespaceFromEntityLinkWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import { EntityFakeLink, EntityLink } from "#/core/infra/component/entity-card";
import { MetricTag } from "#/core/apps/metrics/component/tag";
import { ContactTag as ParentContactTag } from "#/core/common/sub/contacts/sub/contact/component/tag";
import { SlackTaskTag } from "#/core/push_integrations/sub/slack/component/tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import { TodoTaskTag } from "#/core/apps/todo/components/tag";
import { LocationTag } from "#/core/common/sub/locations/component/location-tag";
import {
  UserLightChip,
  formatUserLightLabel,
} from "#/core/users/components/user-light-chip";

export interface InboxTaskShowOptions {
  showStatus?: boolean;
  showSource?: boolean;
  showEisen?: boolean;
  showDifficulty?: boolean;
  showActionableDate?: boolean;
  showDueDate?: boolean;
  showParent?: boolean;
  showHandleMarkDone?: boolean;
  showHandleMarkNotDone?: boolean;
}

export interface InboxTaskCardProps {
  topLevelInfo: TopLevelInfo;
  compact?: boolean;
  /**
   * A row of a list rather than a card: the name, and under it the tags, in
   * full and outlined, with no box, padding or buttons beyond what that takes.
   * For boards where many must fit on screen. Implies `compact`.
   */
  dense?: boolean;
  allowSwipe?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  indent?: number;
  showOptions: InboxTaskShowOptions;
  inboxTask: InboxTask;
  optimisticState?: InboxTaskOptimisticState;
  parent?: InboxTaskParent;
  linkResolver?: (it: InboxTask, parent?: InboxTaskParent) => string;
  linksEnabled?: boolean;
  inputsEnabled?: boolean;
  onClick?: (it: InboxTask) => void;
  onMarkDone?: (it: InboxTask) => void;
  onMarkNotDone?: (it: InboxTask) => void;
}

const SWIPE_THRESHOLD = 200;
const SWIPE_COMPLETE_THRESHOLD = 150;

export function InboxTaskCard(props: InboxTaskCardProps) {
  const isBigScreen = useBigScreen();
  const theme = useTheme();

  const [handlerInProgress, setHandlerInProgress] = useState(false);

  function markDoneHandler() {
    setHandlerInProgress(true);
    setTimeout(() => {
      if (props.onMarkDone) {
        props.onMarkDone(props.inboxTask);
      }
      setHandlerInProgress(false);
    }, 0);
  }

  function markNotDoneHandler() {
    setHandlerInProgress(true);
    setTimeout(() => {
      if (props.onMarkNotDone) {
        props.onMarkNotDone(props.inboxTask);
      }
      setHandlerInProgress(false);
    }, 0);
  }

  function onDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (info.offset.x < -SWIPE_COMPLETE_THRESHOLD) {
      setTimeout(() => {
        if (props.onMarkDone) {
          props.onMarkDone(props.inboxTask);
        }
      }, 0);
    } else if (info.offset.x < SWIPE_COMPLETE_THRESHOLD) {
      // do nothing
    } else {
      setTimeout(() => {
        if (props.onMarkNotDone) {
          props.onMarkNotDone(props.inboxTask);
        }
      }, 0);
    }
  }

  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-SWIPE_COMPLETE_THRESHOLD, 0, SWIPE_COMPLETE_THRESHOLD],
    [
      theme.palette.success.light,
      theme.palette.background.paper,
      theme.palette.warning.light,
    ],
  );

  const ownedByCurrentUser = entityOwnedByCurrentUser(
    props.parent?.owner?.ref_id,
    props.topLevelInfo.user.ref_id,
  );
  const writeAllowedByAccess =
    props.parent?.accessStatus === undefined ||
    accessStatusAllowsWriterOrAbove(props.parent.accessStatus);
  const writeAllowed =
    writeAllowedByAccess &&
    (!(props.parent?.writeRequiresOwner === true) || ownedByCurrentUser);
  const inputsEnabled =
    (props.inputsEnabled ?? true) &&
    props.inboxTask.archived === false &&
    !handlerInProgress &&
    writeAllowed;
  const linksEnabled = props.linksEnabled ?? true;
  const dense = props.dense === true;
  const compact = props.compact === true || dense;
  const status = props.optimisticState?.status ?? props.inboxTask.status;
  const finished = isCompleted(status);
  const dueDate = props.inboxTask.due_date
    ? aDateToDate(props.inboxTask.due_date)
    : null;
  const today = aDateToDate(props.topLevelInfo.today);
  const dueColor =
    dueDate === null || finished
      ? undefined
      : dueDate < today
        ? "error"
        : dueDate.hasSame(today, "day")
          ? "warning"
          : undefined;
  const targetLink = props.linkResolver
    ? props.linkResolver(props.inboxTask, props.parent)
    : `/app/workspace/core/inbox-tasks/${props.inboxTask.ref_id}`;
  return (
    <motion.div
      drag={inputsEnabled && props.allowSwipe ? "x" : false}
      whileDrag={{ scale: 1.1 }}
      dragSnapToOrigin={true}
      dragElastic={0.1}
      dragConstraints={{ left: -SWIPE_THRESHOLD, right: SWIPE_THRESHOLD }}
      onDragEnd={onDragEnd}
      style={{
        x,
        // A dense row paints nothing of its own, so what is behind a list of
        // them (a column being dropped on, say) shows through.
        background: dense && !props.allowSwipe ? undefined : background,
        marginLeft: props.indent ? `${props.indent}rem` : "0",
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: "0px", marginTop: "0px" }}
      transition={{ duration: 1 }}
    >
      <StyledCard
        id={`inbox-task-${props.inboxTask.ref_id}`}
        // An item of a list, for `e`, `j`, `k` and `↵` (ADR 0021).
        data-strata-item=""
        tabIndex={-1}
        isselected={((props.allowSelect && props.selected) || false).toString()}
        enabled={inputsEnabled.toString()}
        sx={dense ? denseRowSx(props.inboxTask.archived) : undefined}
        onClick={() => props.onClick && props.onClick(props.inboxTask)}
      >
        {!dense && props.parent?.owner && (
          <UserLightChip
            user={props.parent.owner}
            currentUserRefId={props.topLevelInfo.user.ref_id}
          />
        )}
        {!dense && (
          <CardCornerChipStack>
            <OverdueWarning
              today={props.topLevelInfo.today}
              status={props.inboxTask.status}
              dueDate={props.inboxTask.due_date}
            />
          </CardCornerChipStack>
        )}
        <CardContent
          sx={
            dense
              ? {
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.2rem",
                  minWidth: 0,
                  flex: 1,
                  padding: "0.3rem 0.5rem",
                  // MUI pads the last CardContent more than the others.
                  "&:last-child": { paddingBottom: "0.3rem" },
                }
              : {
                  paddingTop: isBigScreen ? "0.5rem" : "1rem",
                  paddingLeft: "0.5rem",
                  paddingBottom: "0.5rem",
                }
          }
        >
          <Box sx={dense ? { minWidth: 0 } : undefined}>
            {linksEnabled ? (
              <EntityLink
                to={targetLink}
                block={props.onClick !== undefined}
                inline
              >
                {!dense && <IsKeyTag isKey={props.inboxTask.is_key} />}
                <EntityNameComponent
                  compact={compact}
                  name={props.inboxTask.name}
                  color={dense && finished ? "text.secondary" : undefined}
                  sx={dense ? denseNameSx(status) : undefined}
                />
              </EntityLink>
            ) : (
              <EntityFakeLink inline>
                {!dense && <IsKeyTag isKey={props.inboxTask.is_key} />}
                <EntityNameComponent
                  compact={compact}
                  name={props.inboxTask.name}
                  color={dense && finished ? "text.secondary" : undefined}
                  sx={dense ? denseNameSx(status) : undefined}
                />
              </EntityFakeLink>
            )}
          </Box>
          <TagsContained
            sx={
              dense
                ? {
                    paddingTop: 0,
                    gap: "0.25rem",
                    // Labels are shown in full: no 130px cap with an ellipsis.
                    "& .MuiChip-root": { minWidth: 0, maxWidth: "none" },
                    // Outlined chips take their text from the colour they are
                    // given; the neutral ones are muted, so what is not
                    // special does not shout.
                    "& .MuiChip-colorDefault": {
                      color: strataColors.textMuted,
                    },
                  }
                : undefined
            }
          >
            {dense && <IsKeyTag isKey={props.inboxTask.is_key} outlined />}
            {props.showOptions.showStatus && (
              <InboxTaskStatusTag status={status} outlined={dense} />
            )}
            {props.showOptions.showSource && (
              <InboxTaskNamespaceTag
                namespace={parentLinkNamespaceFromEntityLinkWire(
                  props.inboxTask.owner,
                )}
              />
            )}
            {props.showOptions.showEisen && (
              <EisenTag
                eisen={props.optimisticState?.eisen ?? props.inboxTask.eisen}
                outlined={dense}
              />
            )}
            {props.showOptions.showDifficulty && (
              <DifficultyTag
                difficulty={props.inboxTask.difficulty}
                outlined={dense}
              />
            )}
            {props.showOptions.showActionableDate &&
              props.inboxTask.actionable_date && (
                <ADateTag
                  label="Actionable from"
                  date={props.inboxTask.actionable_date}
                  outlined={dense}
                />
              )}
            {props.showOptions.showDueDate && props.inboxTask.due_date && (
              <ADateTag
                label="Due at"
                date={props.inboxTask.due_date}
                color={dueColor}
                outlined={dense}
              />
            )}
            {dense &&
              props.parent?.owner &&
              props.parent.owner.ref_id !== props.topLevelInfo.user.ref_id && (
                <SlimChip
                  label={`@${props.parent.owner.name}`}
                  title={formatUserLightLabel(props.parent.owner)}
                  variant="outlined"
                  color="default"
                />
              )}
            {props.parent?.location && (
              <LocationTag location={props.parent.location} />
            )}
            {props.showOptions.showParent && (
              <>
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.BIG_PLANS,
                ) &&
                  props.parent &&
                  props.parent.bigPlan && (
                    <BigPlanTag bigPlan={props.parent.bigPlan as BigPlan} />
                  )}
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.TODO_TASK,
                ) &&
                  props.parent &&
                  props.parent.todoTask && (
                    <TodoTaskTag todoTask={props.parent.todoTask} />
                  )}
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.HABITS,
                ) &&
                  props.parent &&
                  props.parent.habit && (
                    <HabitTag habit={props.parent.habit as Habit} />
                  )}
              </>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.HABITS,
            ) &&
              props.parent?.habitStack && (
                <HabitStackTag habitStack={props.parent.habitStack} />
              )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.CHORES,
            ) &&
              props.parent?.choreStack && (
                <ChoreStackTag choreStack={props.parent.choreStack} />
              )}
            {props.showOptions.showParent && (
              <>
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.CHORES,
                ) &&
                  props.parent &&
                  props.parent.chore && (
                    <ChoreTag chore={props.parent.chore as Chore} />
                  )}
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.METRICS,
                ) &&
                  props.parent &&
                  props.parent.metric && (
                    <MetricTag metric={props.parent.metric as Metric} />
                  )}
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.PRM,
                ) &&
                  props.parent &&
                  props.parent.contact && (
                    <ParentContactTag
                      contact={props.parent.contact as Contact}
                    />
                  )}
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.SLACK_TASKS,
                ) &&
                  props.parent &&
                  props.parent.slackTask && (
                    <SlackTaskTag
                      slackTask={props.parent.slackTask as SlackTask}
                    />
                  )}
                {isWorkspaceFeatureAvailable(
                  props.topLevelInfo.workspace,
                  WorkspaceFeature.EMAIL_TASKS,
                ) &&
                  props.parent &&
                  props.parent.emailTask && (
                    <EmailTaskTag
                      emailTask={props.parent.emailTask as EmailTask}
                    />
                  )}
              </>
            )}
          </TagsContained>
        </CardContent>
        {isBigScreen &&
          (props.showOptions.showHandleMarkDone ||
            props.showOptions.showHandleMarkNotDone) && (
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              {props.showOptions.showHandleMarkDone && (
                <IconButton
                  disabled={!inputsEnabled}
                  size="medium"
                  color="success"
                  onClick={markDoneHandler}
                >
                  <CheckCircleIcon fontSize="medium" />
                </IconButton>
              )}
              {props.showOptions.showHandleMarkNotDone && (
                <IconButton
                  disabled={!inputsEnabled}
                  size="medium"
                  color="warning"
                  onClick={markNotDoneHandler}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              )}
            </CardActions>
          )}
      </StyledCard>
    </motion.div>
  );
}

interface StyledCardProps {
  enabled: string;
  isselected: string;
}

const StyledCard = styled(Card)<StyledCardProps>(
  ({ theme, enabled, isselected }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    touchAction: "pan-y",
    position: "relative",
    boxShadow:
      isselected === "true"
        ? `inset 0 0 4px ${theme.palette.primary.main};`
        : undefined,
    // The one with the keyboard focus is marked by a line on its left.
    "&:focus": {
      outline: "none",
      boxShadow: `inset 2px 0 0 ${strataColors.amber}`,
    },
    backgroundColor:
      enabled === "true" ? "transparent" : theme.palette.action.hover,
  }),
);

/**
 * A dense card is a row of a list, not a card: no box of its own, just a
 * hairline under it, and the card's focus line and hover tint. Strata's rows
 * are as high as the body text and a little air (`strataSize.row`).
 */
function denseRowSx(archived: boolean) {
  return {
    border: 0,
    borderBottom: `1px solid ${strataColors.rowDivider}`,
    borderRadius: 0,
    backgroundColor: "transparent",
    opacity: archived ? 0.65 : 1,
    "&:hover": {
      backgroundColor: `color-mix(in srgb, ${strataColors.text} 5%, transparent)`,
    },
  } as const;
}

/** The name in a dense card: at most two lines, struck through if it was not done. */
function denseNameSx(status: InboxTaskStatus) {
  return {
    fontSize: `${strataType.body.size}px`,
    lineHeight: `${strataType.body.lineHeight}px`,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
    textDecoration:
      status === InboxTaskStatus.NOT_DONE ? "line-through" : undefined,
  } as const;
}

const TagsContained = styled(Box)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "0.25rem",
  paddingTop: "0.25rem",
});

interface OverdueWarningProps {
  today: ADate;
  status: InboxTaskStatus;
  dueDate?: ADate | null;
}

function OverdueWarning({ today, status, dueDate }: OverdueWarningProps) {
  const overdueThresholds = useContext(OverdueThresholdsContext);

  if (isCompleted(status)) {
    return null;
  }

  if (!dueDate) {
    return null;
  }

  const theToday = aDateToDate(today);
  const theDueDate = aDateToDate(dueDate);

  return (
    <ClientOnly fallback={<></>}>
      {() => {
        if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueDangerDays })
        ) {
          return <CornerChip label="Overdue" color="error" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueWarningDays })
        ) {
          return <CornerChip label="Overdue" color="warning" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueInfoDays })
        ) {
          return <CornerChip label="Overdue" color="info" />;
        }
        return null;
      }}
    </ClientOnly>
  );
}
