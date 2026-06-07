"""A publish entity."""

import abc
from typing import Final

from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.name import PublishEntityName
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)

# Allowed ``NamedEntityTag`` values for shareable :class:`PublishEntity` targets.
ALLOWED_PUBLISH_ENTITY_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.WORKING_MEM.value,
        NamedEntityTag.TIME_PLAN.value,
        NamedEntityTag.SCHEDULE_STREAM.value,
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
        NamedEntityTag.HABIT.value,
        NamedEntityTag.CHORE.value,
        NamedEntityTag.BIG_PLAN.value,
        NamedEntityTag.DOC.value,
        NamedEntityTag.DIR.value,
        NamedEntityTag.JOURNAL.value,
        NamedEntityTag.CHAPTER.value,
        NamedEntityTag.GOAL.value,
        NamedEntityTag.MILESTONE.value,
        NamedEntityTag.VISION.value,
        NamedEntityTag.VACATION.value,
        NamedEntityTag.ASPECT.value,
        NamedEntityTag.SMART_LIST.value,
        NamedEntityTag.SMART_LIST_ITEM.value,
        NamedEntityTag.METRIC.value,
        NamedEntityTag.METRIC_ENTRY.value,
        NamedEntityTag.PERSON.value,
    }
)


class PublishEntityAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a publish entity already exists for an entity."""


class EntityIsAlreadyActiveError(Exception):
    """Error raised when trying to activate an already active entity."""


class EntityIsAlreadyDraftError(Exception):
    """Error raised when trying to move an already draft entity to draft."""


@entity("PublishDomain")
class PublishEntity(LeafEntity):
    """A publish entity."""

    publish_domain: ParentLink
    name: PublishEntityName
    entity_type: str
    entity_ref_id: EntityId
    external_id: PublishExternalId
    status: PublishEntityStatus

    @staticmethod
    @create_entity_action
    def new_publish_entity(
        ctx: DomainContext,
        publish_domain_ref_id: EntityId,
        name: PublishEntityName,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> "PublishEntity":
        """Create a publish entity."""
        if entity_type not in ALLOWED_PUBLISH_ENTITY_TYPES:
            raise InputValidationError(
                f"Invalid publish entity type: {entity_type!r}",
            )
        return PublishEntity._create(
            ctx,
            publish_domain=ParentLink(publish_domain_ref_id),
            name=name,
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
            external_id=PublishExternalId.new_external_id(),
            status=PublishEntityStatus.DRAFT,
        )

    @update_entity_action
    def activate(self, ctx: DomainContext) -> "PublishEntity":
        """Activate the publish entity."""
        if self.status == PublishEntityStatus.ACTIVE:
            raise EntityIsAlreadyActiveError(
                "The publish entity is already active.",
            )
        return self._new_version(ctx, status=PublishEntityStatus.ACTIVE)

    @update_entity_action
    def to_draft(self, ctx: DomainContext) -> "PublishEntity":
        """Move the publish entity back to draft."""
        if self.status == PublishEntityStatus.DRAFT:
            raise EntityIsAlreadyDraftError(
                "The publish entity is already a draft.",
            )
        return self._new_version(ctx, status=PublishEntityStatus.DRAFT)


class PublishEntityRepository(LeafEntityRepository[PublishEntity], abc.ABC):
    """A repository for publish entities."""

    @abc.abstractmethod
    async def load_by_external_id(
        self,
        external_id: PublishExternalId,
        allow_archived: bool = False,
    ) -> PublishEntity:
        """Load a publish entity by its external id."""
