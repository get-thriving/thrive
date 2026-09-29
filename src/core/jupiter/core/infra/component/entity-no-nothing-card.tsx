import { DocsHelpSubject } from "@jupiter/webapi-client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Form, Link } from "react-router";

import { DocsHelp } from "#/core/infra/component/docs-help";
import { useSectionFiltersPreservedTo } from "#/core/infra/component/use-section-filter";

interface EntityNoNothingCardProps {
  title: string;
  message: string;
  newEntityLocations?: string;
  newEntityAction?: string;
  helpSubject: DocsHelpSubject;
}

export function EntityNoNothingCard(props: EntityNoNothingCardProps) {
  const newEntityLocation = useSectionFiltersPreservedTo(
    props.newEntityLocations,
  );

  return (
    <Card>
      <CardHeader title={props.title} />
      <CardContent>
        <Typography variant="body1">{props.message}</Typography>

        <Typography variant="body1">
          Or you can learn more in our docs
          <DocsHelp subject={props.helpSubject} size="small" />
        </Typography>
      </CardContent>
      <CardActions>
        {newEntityLocation && (
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={newEntityLocation}
          >
            Add New
          </Button>
        )}
        {props.newEntityAction && (
          <Form method="post">
            <Button
              variant="contained"
              size="small"
              type="submit"
              name="intent"
              value={props.newEntityAction}
            >
              Add New
            </Button>
          </Form>
        )}
      </CardActions>
    </Card>
  );
}
