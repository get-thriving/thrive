"""Use case for loading a particular todo task."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.todo.root import TodoTask
from jupiter.core.todo.service.load import TodoTaskLoadResult, TodoTaskLoadService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import use_case_args

__all__ = ["TodoTaskLoadArgs", "TodoTaskLoadResult", "TodoTaskLoadUseCase"]


@use_case_args
class TodoTaskLoadArgs(JupiterLoadCrownEntityArgs):
    """TodoTaskLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskLoadUseCase(
    JupiterLoadCrownEntityUseCase[TodoTaskLoadArgs, TodoTaskLoadResult]
):
    """Use case for loading a particular todo task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TodoTaskLoadArgs,
    ) -> TodoTaskLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace

        todo_task = await self.load_entity(
            uow,
            context.user.ref_id,
            TodoTask,
            args.ref_id,
            allow_archived,
        )

        return await TodoTaskLoadService().do_it(
            uow,
            workspace.ref_id,
            todo_task,
            allow_archived=allow_archived,
        )
