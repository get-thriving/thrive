"""Mutation invocation recorders for the application."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
)


class MutationInvocationRecorder(abc.ABC):
    """A special type of recorder for mutations which records the outcome of a particular mutation."""

    @abc.abstractmethod
    async def record(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Record the invocation of the mutation."""

    @abc.abstractmethod
    async def find_all_invocation_records(
        self, mutation_ids: list[MutationId]
    ) -> list[MutationInvocationRecord]:
        """Retrieve all mutation records."""

    @abc.abstractmethod
    async def find_all_entity_events_by_timestamp_desc(
        self, entity_type: str, entity_ref_id: EntityId, offset: int, limit: int
    ) -> tuple[list[MutationEntityEvent], int]:
        """Retrieve all events on an entity in a given range."""

    @abc.abstractmethod
    async def find_all_entity_events_between(
        self,
        entity_type: str,
        entity_ref_id: EntityId,
        start: Timestamp,
        end: Timestamp,
    ) -> list[MutationEntityEvent]:
        """Retrieve all events on an entity between two timestamps."""

    @abc.abstractmethod
    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
