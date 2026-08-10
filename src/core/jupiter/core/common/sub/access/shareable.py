"""Shareable entity allowlist and domain-specific access refresh registry."""

from collections.abc import Mapping
from typing import Final

from jupiter.core.common.sub.access.service.refresh_access_for_entity import (
    RefreshAccessForEntityService,
)
from jupiter.core.docs.service.refresh_dir_access import RefreshDirAccessService
from jupiter.core.docs.service.refresh_doc_access import RefreshDocAccessService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork

# Allowed ``EntityLink.the_type`` values for shareable :class:`AccessGrant` owners.
ALLOWED_SHARED_ACCESS_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,  # done #share
        NamedEntityTag.TIME_PLAN.value,  # done #share
        NamedEntityTag.TIME_PLAN_ACTIVITY.value,  # cascade from time plan only
        NamedEntityTag.SCHEDULE_STREAM.value,  # done #share
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,  # done #share
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,  # done #share
        NamedEntityTag.HABIT.value,  # done #share
        NamedEntityTag.CHORE.value,  # done #share
        NamedEntityTag.BIG_PLAN.value,  # done #share
        NamedEntityTag.DOC.value,  # done #share
        NamedEntityTag.DIR.value,  # done #share
        NamedEntityTag.JOURNAL.value,  # done #share
        NamedEntityTag.VACATION.value,  # done #share
        NamedEntityTag.SMART_LIST.value,  # done #share
        NamedEntityTag.SMART_LIST_ITEM.value,  # cascade from smart list only
        NamedEntityTag.METRIC.value,  # done #share
        NamedEntityTag.METRIC_ENTRY.value,  # cascade from metric only
        NamedEntityTag.PERSON.value,  # done #share
    }
)

REFRESH_ACCESS_FOR_ENTITY_SERVICES: Final[
    Mapping[str, RefreshAccessForEntityService]
] = {
    NamedEntityTag.DOC.value: RefreshDocAccessService(),
    NamedEntityTag.DIR.value: RefreshDirAccessService(),
}


async def refresh_domain_specific_access_for_entity(
    ctx: DomainContext,
    uow: DomainUnitOfWork,
    entity_type: str,
    entity_ref_id: EntityId,
) -> None:
    """Run a registered domain-specific access refresh, if any, for the type."""
    service = REFRESH_ACCESS_FOR_ENTITY_SERVICES.get(entity_type)
    if service is None:
        return
    await service.refresh_for_entity(ctx, uow, entity_ref_id)
