"""Links between persons and circles."""

import abc
from typing import TYPE_CHECKING

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, create_record_action, record
from jupiter.framework.storage.repository import RecordRepository

if TYPE_CHECKING:
    from jupiter.core.prm.root import PRM


@record
class PersonCircleLink(Record):
    """A link between a person and a circle."""

    prm: ParentLink["PRM"]
    person_ref_id: EntityId
    circle_ref_id: EntityId

    @staticmethod
    @create_record_action
    def new_link(
        ctx: DomainContext,
        prm_ref_id: EntityId,
        person_ref_id: EntityId,
        circle_ref_id: EntityId,
    ) -> "PersonCircleLink":
        """Create a new person-circle link."""
        return PersonCircleLink._create(
            ctx,
            prm=ParentLink(prm_ref_id),
            person_ref_id=person_ref_id,
            circle_ref_id=circle_ref_id,
        )

    @property
    def raw_key(self) -> object:
        """Return the raw key."""
        return (self.prm.ref_id, self.person_ref_id, self.circle_ref_id)


class PersonCircleLinkRepository(
    RecordRepository[PersonCircleLink, tuple[EntityId, EntityId, EntityId]],
    abc.ABC,
):
    """A repository for person-circle links."""
