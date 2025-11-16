import { PersonRelationship } from "@jupiter/webapi-client";

import { SlimChip } from "~/infra/component/chips";
import { personRelationshipName } from "~/persons/relationship";

interface PersonRelationshipTagProps {
  relationship: PersonRelationship;
}

export function PersonRelationshipTag(props: PersonRelationshipTagProps) {
  return (
    <SlimChip
      label={personRelationshipName(props.relationship)}
      color={relaionshipToColor(props.relationship)}
    />
  );
}

function relaionshipToColor(
  relationship: PersonRelationship,
): "success" | "info" | "default" {
  switch (relationship) {
    case PersonRelationship.FRIEND:
    case PersonRelationship.FAMILY:
      return "success";
    case PersonRelationship.WORK_BUDDY:
    case PersonRelationship.SCHOOL_BUDDY:
    case PersonRelationship.COLLEAGUE:
      return "info";
    case PersonRelationship.ACQUAINTANCE:
    case PersonRelationship.OTHER:
      return "default";
  }
}
