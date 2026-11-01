import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Link } from "react-router";

interface WidgetNotConfiguredCardProps {
  title: string;
  message: string;
  /** Where the widget gets configured, if it can be from here. */
  settingsLocation?: string;
}

/** What a widget shows when it has nothing chosen to show yet. */
export function WidgetNotConfiguredCard(props: WidgetNotConfiguredCardProps) {
  return (
    <Card>
      <CardHeader title={props.title} />
      <CardContent>
        <Typography variant="body1">{props.message}</Typography>
      </CardContent>
      {props.settingsLocation && (
        <CardActions>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={props.settingsLocation}
          >
            Configure Widget
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
