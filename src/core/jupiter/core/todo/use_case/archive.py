"""The command for archiving a todo task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.todo.root import TodoTask
from jupiter.core.todo.service.archive import TodoTaskArchiveService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TodoTaskArchiveArgs(UseCaseArgsBase):
    """TodoTaskArchive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TodoTaskArchiveArgs, None]
):
    """The command for archiving a todo task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TodoTaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        todo_task = await uow.get_for(TodoTask).load_by_id(args.ref_id)
        todo_task_archive_service = TodoTaskArchiveService()
        await todo_task_archive_service.do_it(
            context.domain_context,
            uow,
            progress_reporter,
            todo_task,
            JupiterArchivalReason.USER,
        )
