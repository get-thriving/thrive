"""A logging recorder for mutations."""

import logging

from jupiter.framework_new.mutation_inovcation.record import (
    MutationInvocationRecord,
)
from jupiter.framework_new.mutation_inovcation.recorder import (
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

    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
