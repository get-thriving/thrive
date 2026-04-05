"""A logging recorder for mutations."""

import logging

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
)
from jupiter.framework.mutation_inovcation.recorder import (
    MutationInvocationRecorder,
)

LOGGER = logging.getLogger(__name__)


class LoggingMutationInvocationRecorder(MutationInvocationRecorder):
    """A logging recorder for mutations."""

    async def record(self, invocation_record: MutationInvocationRecord) -> None:
        """Record the invocation of the mutation."""
        LOGGER.info(
            "Mutation %s for %s at %s with args %s and result %s and (error %s)",
            invocation_record.name,
            invocation_record.context_str,
            invocation_record.timestamp,
            invocation_record.args.__class__.__name__,
            invocation_record.result.value,
            invocation_record.error_str,
        )

    async def find_all_invocation_records(
        self, mutation_ids: list[MutationId]
    ) -> list[MutationInvocationRecord]:
        """Retrieve all mutation records."""
        return []

    async def find_all_entity_events_by_timestamp_desc(
        self, entity_type: str, entity_ref_id: EntityId, offset: int, limit: int
    ) -> tuple[list[MutationEntityEvent], int]:
        """Retrieve all events on an entity in a given range."""
        return [], 0

    async def find_all_entity_events_between(
        self,
        entity_type: str,
        entity_ref_id: EntityId,
        start: Timestamp,
        end: Timestamp,
    ) -> list[MutationEntityEvent]:
        """Retrieve all events on an entity between two timestamps."""
        return []

    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
