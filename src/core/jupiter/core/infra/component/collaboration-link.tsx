import { Handshake as HandshakeIcon } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import { Link } from "@remix-run/react";

interface CollaborationLinkProps {
  count: number;
}

export function CollaborationLink(props: CollaborationLinkProps) {
  return (
    <IconButton
      id="collaboration-link"
      component={Link}
      to="/app/workspace/core/collaboration"
      size="medium"
      color="inherit"
      aria-label="Collaboration"
    >
      <Badge badgeContent={props.count} color="error" max={99}>
        <HandshakeIcon />
      </Badge>
    </IconButton>
  );
}
