"""The person domain."""

from jupiter.core.common.sub.persons.sub.link.root import CommonPersonLink
from jupiter.core.common.sub.persons.sub.person.root import CommonPerson
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity
class PersonDomain(TrunkEntity):
    """Person domain trunk entity."""

    workspace: ParentLink

    persons = ContainsMany(CommonPerson, person_domain_ref_id=IsRefId())
    links = ContainsMany(CommonPersonLink, person_domain_ref_id=IsRefId())

    @staticmethod
    def new_person_domain(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "PersonDomain":
        """Create a person domain."""
        return PersonDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
