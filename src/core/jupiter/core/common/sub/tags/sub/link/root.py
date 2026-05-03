"""A link between an entity and its tags."""

import abc
from typing import Final

from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsOneOfRefId,
    LeafSupportEntity,
    ParentLink,
    RefsMany,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction

# Allowed ``EntityLink.the_type`` values for :class:`TagLink` owners.
ALLOWED_TAG_LINK_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,
        NamedEntityTag.TIME_PLAN.value,
        NamedEntityTag.SCHEDULE_STREAM.value,
        NamedEntityTag.SCHEDULE_EXPORT.value,
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
        NamedEntityTag.HABIT.value,
        NamedEntityTag.CHORE.value,
        NamedEntityTag.BIG_PLAN.value,
        NamedEntityTag.DOC.value,
        NamedEntityTag.DIR.value,
        NamedEntityTag.JOURNAL.value,
        NamedEntityTag.VACATION.value,
        NamedEntityTag.ASPECT.value,
        NamedEntityTag.CHAPTER.value,
        NamedEntityTag.GOAL.value,
        NamedEntityTag.MILESTONE.value,
        NamedEntityTag.SMART_LIST.value,
        NamedEntityTag.SMART_LIST_ITEM.value,
        NamedEntityTag.METRIC.value,
        NamedEntityTag.METRIC_ENTRY.value,
        NamedEntityTag.PERSON.value,
        NamedEntityTag.OCCASION.value,
    }
)


@entity("TagDomain")
class TagLink(LeafSupportEntity):
    """A link between an entity and its tags."""

    tag_domain: ParentLink

    owner: EntityLink
    ref_ids: list[EntityId]

    tags = RefsMany(Tag, ref_id=IsOneOfRefId("ref_ids"))

    @staticmethod
    @create_entity_action
    def new_tag_link(
        ctx: DomainContext,
        tag_domain_ref_id: EntityId,
        owner: EntityLink,
        ref_ids: list[EntityId],
    ) -> "TagLink":
        """Create a new tag link."""
        if owner.the_type not in ALLOWED_TAG_LINK_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid tag link owner entity type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Tag link owner purpose must be 'std', got {owner.purpose!r}",
            )
        return TagLink._create(
            ctx,
            name=NOT_USED_NAME,
            tag_domain=ParentLink(tag_domain_ref_id),
            owner=owner,
            ref_ids=ref_ids,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        ref_ids: UpdateAction[list[EntityId]],
    ) -> "TagLink":
        """Update the tag link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            ref_ids=ref_ids.or_else(self.ref_ids),
        )


class TagLinkRepository(LeafEntityRepository[TagLink], abc.ABC):
    """The repository for tag links."""

    @abc.abstractmethod
    async def upsert(self, tag_link: TagLink) -> TagLink:
        """Upsert a tag link."""

    @abc.abstractmethod
    async def load_optional_for_owner(
        self,
        owner: EntityLink,
    ) -> TagLink | None:
        """Load a tag link by its owner link."""
