"""The use case for loading a partcular inbox task."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import (
    ALLOWED_INBOX_TASK_OWNER_TYPES,
    InboxTask,
)
from jupiter.core.common.sub.inbox_tasks.service.load import (
    InboxTaskLoadResult,
    InboxTaskLoadService,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterLoadLeafSupportEntityArgs,
    JupiterLoadLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    use_case_args,
)

__all__ = ["InboxTaskLoadArgs", "InboxTaskLoadResult", "InboxTaskLoadUseCase"]


@use_case_args
class InboxTaskLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """InboxTaskLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


class InboxTaskLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[InboxTaskLoadArgs, InboxTaskLoadResult]
):
    """The use case for loading a particular inbox task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: InboxTaskLoadArgs,
    ) -> InboxTaskLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        _, inbox_task = await self.load_for_owner(
            uow,
            InboxTaskCollection,
            InboxTask,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_INBOX_TASK_OWNER_TYPES,
            AccessLevel.READER,
            allow_archived=allow_archived,
        )

        return await InboxTaskLoadService().do_it(
            uow,
            inbox_task,
            user_ref_id=context.user.ref_id,
            allow_archived=allow_archived,
        )
