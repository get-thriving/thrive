"""Use case for finding tasks."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tasks.domain import TaskDomain
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import Task
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TaskFindArgs(UseCaseArgsBase):
    """TaskFind args."""

    allow_archived: bool | None
    filter_namespace: list[TaskNamespace] | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class TaskFindResult(UseCaseResultBase):
    """TaskFind result."""

    tasks: list[Task]


@readonly_use_case(exclude_component=[AppCore.CLI])
class TaskFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TaskFindArgs, TaskFindResult]
):
    """Use case for finding tasks."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TaskFindArgs,
    ) -> TaskFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        task_domain = await uow.get_for(TaskDomain).load_by_parent(workspace.ref_id)

        tasks = await uow.get_for(Task).find_all_generic(
            parent_ref_id=task_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            namespace=args.filter_namespace or NoFilter(),
        )

        return TaskFindResult(tasks=tasks)
