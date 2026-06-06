import { Launch as LaunchIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "@remix-run/react";

interface ProjectMilestoneSourceLinkProps {
  bigPlanId: string;
}

export function ProjectMilestoneSourceLink(
  props: ProjectMilestoneSourceLinkProps,
) {
  return (
    <Button
      startIcon={<LaunchIcon />}
      variant="outlined"
      size="small"
      component={Link}
      to={`/app/workspace/projects/${props.bigPlanId}`}
      sx={{ flexGrow: 1 }}
    >
      Project
    </Button>
  );
}
