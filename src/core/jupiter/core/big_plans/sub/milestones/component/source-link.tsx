import { Launch as LaunchIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "@remix-run/react";

interface BigPlanMilestoneSourceLinkProps {
  bigPlanId: string;
}

export function BigPlanMilestoneSourceLink(
  props: BigPlanMilestoneSourceLinkProps,
) {
  return (
    <Button
      startIcon={<LaunchIcon />}
      variant="outlined"
      size="small"
      component={Link}
      to={`/app/workspace/big-plans/${props.bigPlanId}`}
      sx={{ flexGrow: 1 }}
    >
      Big Plan
    </Button>
  );
}
