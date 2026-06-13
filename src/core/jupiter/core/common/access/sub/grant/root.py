"""A grant of access to a resource for a principal."""

import abc
from typing import Final

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.sub.grant.principal_type import PrincipalType
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction

# Allowed ``EntityLink.the_type`` values for shareable :class:`AccessGrant` owners.
ALLOWED_SHARED_ACCESS_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,  # done
        NamedEntityTag.TIME_PLAN.value,  # done
        NamedEntityTag.SCHEDULE_STREAM.value,  # done
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,  # done
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,  # done
        NamedEntityTag.HABIT.value,  # done
        NamedEntityTag.CHORE.value,  # done
        NamedEntityTag.BIG_PLAN.value,  # done
        NamedEntityTag.DOC.value,  # done
        NamedEntityTag.DIR.value,  # done
        NamedEntityTag.JOURNAL.value,  # done
        NamedEntityTag.VACATION.value,  # done
        NamedEntityTag.SMART_LIST.value,  # done
        NamedEntityTag.SMART_LIST_ITEM.value,  # done
        NamedEntityTag.METRIC.value,  # done
        NamedEntityTag.METRIC_ENTRY.value,  # done
        NamedEntityTag.PERSON.value,  # done
    }
)


@entity("AccessDomain")
class AccessGrant(LeafSupportEntity):
    """A grant of access to a resource for a principal."""

    access_domain: ParentLink

    entity: EntityLink
    principal: PrincipalType
    user_ref_id: EntityId
    access_level: AccessLevel

    @staticmethod
    @create_entity_action
    def new_access_grant(
        ctx: DomainContext,
        access_domain_ref_id: EntityId,
        entity: EntityLink,
        principal: PrincipalType,
        user_ref_id: EntityId,
        access_level: AccessLevel,
    ) -> "AccessGrant":
        """Create a new access grant."""
        if principal != PrincipalType.USER:
            raise InputValidationError(
                f"Unsupported access grant principal type: {principal.value!r}",
            )
        return AccessGrant._create(
            ctx,
            name=NOT_USED_NAME,
            access_domain=ParentLink(access_domain_ref_id),
            entity=entity,
            principal=principal,
            user_ref_id=user_ref_id,
            access_level=access_level,
        )

    @update_entity_action
    def change_access_level(
        self,
        ctx: DomainContext,
        access_level: UpdateAction[AccessLevel],
    ) -> "AccessGrant":
        """Change the access level of the grant."""
        return self._new_version(
            ctx,
            access_level=access_level.or_else(self.access_level),
        )


class AccessGrantRepository(LeafEntityRepository[AccessGrant], abc.ABC):
    """A repository for access grants."""

    @abc.abstractmethod
    async def find_all_for_entity(
        self,
        entity: EntityLink,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants for a resource, across all principals."""

    @abc.abstractmethod
    async def upsert(self, grant: AccessGrant) -> AccessGrant:
        """Insert a grant, or update the access level of the matching existing grant."""
