"""Use case for archiving a task."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tasks.root import Task
from jupiter.core.common.sub.tasks.service.archive import (
    TaskArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TaskArchiveArgs(UseCaseArgsBase):
    """TaskArchive args."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class TaskArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TaskArchiveArgs, None]
):
    """Use case for archiving a task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        task = await uow.get_for(Task).load_by_id(args.ref_id)
        await TaskArchiveService().archive(
            context.domain_context, uow, task, JupiterArchivalReason.USER
        )
