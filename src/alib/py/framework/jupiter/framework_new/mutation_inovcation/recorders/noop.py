"""A noop recorder for mutations."""

from jupiter.framework_new.mutation_inovcation.record import (
    MutationInvocationRecord,
    MutationInvocationRecorder,
)


class NoopMutationInvocationRecorder(MutationInvocationRecorder):
    """A noop recorder for mutations."""

    async def record(self, invocation_record: MutationInvocationRecord) -> None:
        """Record the invocation of the mutation."""
