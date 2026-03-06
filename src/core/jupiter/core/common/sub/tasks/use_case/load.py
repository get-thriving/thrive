"""Use case for loading a task."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tasks.root import Task
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TaskLoadArgs(UseCaseArgsBase):
    """TaskLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TaskLoadResult(UseCaseResultBase):
    """TaskLoad result."""

    task: Task


@readonly_use_case(exclude_component=[AppCore.CLI])
class TaskLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TaskLoadArgs, TaskLoadResult]
):
    """Use case for loading a task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TaskLoadArgs,
    ) -> TaskLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        task = await uow.get_for(Task).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        return TaskLoadResult(task=task)
