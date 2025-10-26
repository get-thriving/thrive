"""Mutation invocation recorders for the application."""

import abc

from jupiter.framework.mutation_inovcation.record import MutationInvocationRecord


class MutationInvocationRecorder(abc.ABC):
    """A special type of recorder for mutations which records the outcome of a particular mutation."""

    @abc.abstractmethod
    async def record(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Record the invocation of the mutation."""

    @abc.abstractmethod
    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
