import { DocsHelpSubject } from "@jupiter/webapi-client";
import { Stack, Typography } from "@mui/material";

import {
  CollaborationInviteCard,
  CollaborationRequestCard,
} from "#/core/common/sub/access/components/collaboration-cards";
import { WidgetProps } from "#/core/home/component/common";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";

export function CollaborationWidget(props: WidgetProps) {
  const collaboration = props.collaboration;
  if (!collaboration) {
    return (
      <EntityNoNothingCard
        title="No Collaboration Activity"
        message="Invites and access requests will show up here."
        helpSubject={DocsHelpSubject.ROOT}
      />
    );
  }

  const {
    invites,
    incomingRequests,
    outgoingRequests,
    inputsEnabled,
    onAcknowledgeInvite,
    onCancelInvite,
    onAcceptRequest,
    onRejectRequest,
  } = collaboration;

  const today = props.topLevelInfo.today;
  const hasAnything =
    invites.length > 0 ||
    incomingRequests.length > 0 ||
    outgoingRequests.length > 0;

  if (!hasAnything) {
    return (
      <EntityNoNothingCard
        title="No Collaboration Activity"
        message="Invites and access requests will show up here."
        helpSubject={DocsHelpSubject.ROOT}
      />
    );
  }

  return (
    <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
      {invites.length > 0 && (
        <Stack direction="column" spacing={0.5}>
          <Typography
            variant="h6"
            sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
          >
            Invites
          </Typography>
          {invites.map((entry) => (
            <CollaborationInviteCard
              key={`invite-${entry.access_invite.ref_id}`}
              entry={entry}
              today={today}
              invitePath={`/app/workspace/core/collaboration/invites/${entry.access_invite.ref_id}`}
              inputsEnabled={inputsEnabled}
              onAcknowledge={() =>
                onAcknowledgeInvite(entry.access_invite.ref_id)
              }
              onCancel={() => onCancelInvite(entry.access_invite.ref_id)}
            />
          ))}
        </Stack>
      )}

      {incomingRequests.length > 0 && (
        <Stack direction="column" spacing={0.5}>
          <Typography
            variant="h6"
            sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
          >
            Asked of You
          </Typography>
          {incomingRequests.map((entry) => (
            <CollaborationRequestCard
              key={`incoming-${entry.access_request.ref_id}`}
              entry={entry}
              today={today}
              subjectMode="from"
              requestPath={`/app/workspace/core/collaboration/requests/to-me/${entry.access_request.ref_id}`}
              inputsEnabled={inputsEnabled}
              onAccept={() => onAcceptRequest(entry.access_request.ref_id)}
              onReject={() => onRejectRequest(entry.access_request.ref_id)}
            />
          ))}
        </Stack>
      )}

      {outgoingRequests.length > 0 && (
        <Stack direction="column" spacing={0.5}>
          <Typography
            variant="h6"
            sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
          >
            Asking
          </Typography>
          {outgoingRequests.map((entry) => (
            <CollaborationRequestCard
              key={`outgoing-${entry.access_request.ref_id}`}
              entry={entry}
              today={today}
              subjectMode="to"
              requestPath={`/app/workspace/core/collaboration/requests/from-me/${entry.access_request.ref_id}`}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
