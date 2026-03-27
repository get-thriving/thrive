import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Link } from "@remix-run/react";

interface NoTasksCardProps {
  parent: string;
  parentLabel?: string;
  parentNewLocations?: string;
}

export function InboxTasksNoTasksCard(props: NoTasksCardProps) {
  return (
    <Card>
      <CardHeader title="You have to start somewhere" />
      <CardContent>
        <Typography variant="body1">
          There are no inbox tasks to show. You can generate some new tasks
          {props.parentNewLocations ? `, or create a new ${props.parent}` : ""}.
        </Typography>
      </CardContent>
      {props.parentNewLocations && props.parentLabel && (
        <CardActions>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={props.parentNewLocations}
          >
            {props.parentLabel}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
