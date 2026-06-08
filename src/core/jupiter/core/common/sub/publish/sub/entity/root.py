"""A publish entity."""

import abc
from typing import Final

from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.name import PublishEntityName
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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

# Allowed ``EntityLink.the_type`` values for shareable :class:`PublishEntity` owners.
ALLOWED_PUBLISH_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,  # done
        NamedEntityTag.TIME_PLAN.value,  # done
        NamedEntityTag.SCHEDULE_STREAM.value,
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,  # done
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,  # done
        NamedEntityTag.HABIT.value,  # done
        NamedEntityTag.CHORE.value,  # done
        NamedEntityTag.BIG_PLAN.value,  # done
        NamedEntityTag.DOC.value,  # done
        NamedEntityTag.DIR.value,
        NamedEntityTag.JOURNAL.value,  # done
        NamedEntityTag.VACATION.value,  # done
        NamedEntityTag.SMART_LIST.value,  # done
        NamedEntityTag.SMART_LIST_ITEM.value,  # done
        NamedEntityTag.METRIC.value,  # done
        NamedEntityTag.METRIC_ENTRY.value,  # done
        NamedEntityTag.PERSON.value,  # done
    }
)


class PublishEntityAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a publish entity already exists for an entity."""


class EntityIsAlreadyActiveError(Exception):
    """Error raised when trying to activate an already active entity."""


class EntityIsAlreadyDraftError(Exception):
    """Error raised when trying to move an already draft entity to draft."""


DEFAULT_PUBLISH_ENTITY_NAME = PublishEntityName("PublishEntity")


@entity("PublishDomain")
class PublishEntity(LeafEntity):
    """A publish entity."""

    publish_domain: ParentLink
    name: PublishEntityName
    owner: EntityLink
    external_id: PublishExternalId
    status: PublishEntityStatus

    @staticmethod
    @create_entity_action
    def new_publish_entity(
        ctx: DomainContext,
        publish_domain_ref_id: EntityId,
        owner: EntityLink,
    ) -> "PublishEntity":
        """Create a publish entity."""
        if owner.the_type not in ALLOWED_PUBLISH_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid publish entity owner type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Publish entity owner link purpose must be 'std', got {owner.purpose!r}",
            )
        return PublishEntity._create(
            ctx,
            publish_domain=ParentLink(publish_domain_ref_id),
            name=DEFAULT_PUBLISH_ENTITY_NAME,
            owner=owner,
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
    async def load_optional_for_owner(
        self,
        owner: EntityLink,
        allow_archived: bool = False,
    ) -> PublishEntity | None:
        """Load a publish entity by its owner link."""

    @abc.abstractmethod
    async def load_by_external_id(
        self,
        external_id: PublishExternalId,
        allow_archived: bool = False,
    ) -> PublishEntity:
        """Load a publish entity by its external id."""
