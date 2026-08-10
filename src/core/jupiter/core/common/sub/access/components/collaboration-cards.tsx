import type {
  ADate,
  CollaborationInviteEntry,
  CollaborationRequestEntry,
} from "@jupiter/webapi-client";

import { accessLevelName } from "#/core/common/sub/access/access-level";
import { TimeDiffTag } from "#/core/common/component/time-diff-tag";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { entityTagName } from "#/core/named-entity-tag";
import { formatUserLightLabel } from "#/core/users/components/user-light-chip";

interface CollaborationInviteCardProps {
  entry: CollaborationInviteEntry;
  today: ADate;
  invitePath: string;
  inputsEnabled?: boolean;
  onAcknowledge?: () => void;
  onCancel?: () => void;
}

export function CollaborationInviteCard(props: CollaborationInviteCardProps) {
  const { entry } = props;
  const canDecide =
    props.onAcknowledge !== undefined && props.onCancel !== undefined;
  const inputsEnabled = props.inputsEnabled ?? true;
  const accessLevel = accessLevelName(
    entry.access_grant.access_level,
  ).toLowerCase();
  const entityType = entityTagName(entry.entity.entity_tag);
  const userLabel = formatUserLightLabel(entry.subject);
  const summaryText = `User ${userLabel} invited you with ${accessLevel} access to ${entityType} ${entry.entity.name}`;

  return (
    <EntityCard
      entityId={`collaboration-invite-${entry.access_invite.ref_id}`}
      allowMarkDone={canDecide && inputsEnabled}
      allowMarkNotDone={canDecide && inputsEnabled}
      onMarkDone={props.onAcknowledge}
      onMarkNotDone={props.onCancel}
    >
      <EntityLink to={props.invitePath}>
        {summaryText}
        <TimeDiffTag
          today={props.today}
          labelPrefix="Invited"
          collectionTime={entry.access_invite.last_modified_time}
          compact
        />
      </EntityLink>
    </EntityCard>
  );
}

interface CollaborationRequestCardProps {
  entry: CollaborationRequestEntry;
  today: ADate;
  subjectMode: "from" | "to";
  requestPath: string;
  inputsEnabled?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

export function CollaborationRequestCard(props: CollaborationRequestCardProps) {
  const { entry } = props;
  const canDecide =
    props.subjectMode === "from" &&
    props.onAccept !== undefined &&
    props.onReject !== undefined;
  const inputsEnabled = props.inputsEnabled ?? true;
  const accessLevel = accessLevelName(
    entry.access_request.access_level,
  ).toLowerCase();
  const entityType = entityTagName(entry.entity.entity_tag);
  const userLabel = formatUserLightLabel(entry.subject);
  const summaryText =
    props.subjectMode === "from"
      ? `User ${userLabel} is asking for ${accessLevel} access to ${entityType} ${entry.entity.name}`
      : `Asking user ${userLabel} for ${accessLevel} access to ${entityType} ${entry.entity.name}`;

  return (
    <EntityCard
      entityId={`collaboration-request-${entry.access_request.ref_id}`}
      allowMarkDone={canDecide && inputsEnabled}
      allowMarkNotDone={canDecide && inputsEnabled}
      onMarkDone={props.onAccept}
      onMarkNotDone={props.onReject}
    >
      <EntityLink to={props.requestPath}>
        {summaryText}
        <TimeDiffTag
          today={props.today}
          labelPrefix="Requested"
          collectionTime={entry.access_request.last_modified_time}
          compact
        />
      </EntityLink>
    </EntityCard>
  );
}
