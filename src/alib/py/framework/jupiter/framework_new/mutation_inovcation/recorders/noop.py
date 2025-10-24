"""A noop recorder for mutations."""

from jupiter.framework_new.mutation_inovcation.record import (
    MutationInvocationRecord,
)
from jupiter.framework_new.mutation_inovcation.recorder import (
    MutationInvocationRecorder,
)


class NoopMutationInvocationRecorder(MutationInvocationRecorder):
    """A noop recorder for mutations."""

    async def record(self, invocation_record: MutationInvocationRecord) -> None:
        """Record the invocation of the mutation."""

    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
