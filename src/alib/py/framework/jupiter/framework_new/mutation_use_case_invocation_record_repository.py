"""A repository for mutation use cases invocation records."""

import abc

from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import Repository
from jupiter.framework_new.use_case import MutationUseCaseInvocationRecord, UseCaseArgsT


class MutationUseCaseInvocationRecordRepository(Repository, abc.ABC):
    """A repository for mutation use cases invocation records."""

    @abc.abstractmethod
    async def create(
        self,
        invocation_record: MutationUseCaseInvocationRecord[UseCaseArgsT],
    ) -> None:
        """Create a new invocation record."""

    @abc.abstractmethod
    async def clear_all(self, workspace_ref_id: EntityId) -> None:
        """Clear all invocation record entries."""
