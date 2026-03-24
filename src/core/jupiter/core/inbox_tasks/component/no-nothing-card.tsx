import { WorkspaceFeature } from "@jupiter/webapi-client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Link } from "@remix-run/react";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface InboxTasksNoNothingCardProps {
  topLevelInfo: TopLevelInfo;
}

export function InboxTasksNoNothingCard(props: InboxTasksNoNothingCardProps) {
  let initialText = "There are no inbox tasks to show. ";
  const { workspace } = props.topLevelInfo;

  const habitsAvailable = isWorkspaceFeatureAvailable(
    workspace,
    WorkspaceFeature.HABITS,
  );
  const choresAvailable = isWorkspaceFeatureAvailable(
    workspace,
    WorkspaceFeature.CHORES,
  );

  if (habitsAvailable && choresAvailable) {
    initialText += "You can create a new habit, chore, or inbox task.";
  } else if (habitsAvailable) {
    initialText += "You can create a new habit or inbox task.";
  } else if (choresAvailable) {
    initialText += "You can create a new chore or inbox task.";
  } else {
    initialText += "You can create a new inbox task.";
  }

  return (
    <Card>
      <CardHeader title="You have to start somewhere" />
      <CardContent>
        <Typography variant="body1">{initialText}</Typography>
      </CardContent>
      <CardActions>
        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.HABITS,
        ) && (
          <Button
            variant="contained"
            size="small"
            component={Link}
            to="/app/workspace/habits/new"
          >
            New Habit
          </Button>
        )}
        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.CHORES,
        ) && (
          <Button
            variant="contained"
            size="small"
            component={Link}
            to="/app/workspace/chores/new"
          >
            New Chore
          </Button>
        )}
        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.TODO_TASK,
        ) && (
          <Button
            variant="contained"
            size="small"
            component={Link}
            to="/app/workspace/todos/new"
          >
            New Todo
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
