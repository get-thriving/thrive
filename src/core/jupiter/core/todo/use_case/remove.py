"""The command for removing a todo task."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.todo.root import TodoTask
from jupiter.core.todo.service.remove import TodoTaskRemoveService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class TodoTaskRemoveArgs(JupiterRemoveCrownEntityArgs):
    """TodoTaskRemove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskRemoveUseCase(JupiterRemoveCrownEntityUseCase[TodoTaskRemoveArgs, None]):
    """The command for removing a todo task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TodoTaskRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        todo_task = await self.load_entity(
            uow, context.user.ref_id, TodoTask, args.ref_id
        )
        todo_task_remove_service = TodoTaskRemoveService()
        await todo_task_remove_service.do_it(
            context.domain_context,
            uow,
            progress_reporter,
            todo_task,
        )
