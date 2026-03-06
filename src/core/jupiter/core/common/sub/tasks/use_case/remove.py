"""The command for removing a task."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tasks.root import Task
from jupiter.core.common.sub.tasks.service.remove import (
    TaskRemoveService,
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
class TaskRemoveArgs(UseCaseArgsBase):
    """TaskRemove arguments."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class TaskRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TaskRemoveArgs, None]
):
    """The command for removing a task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TaskRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        task = await uow.get_for(Task).load_by_id(args.ref_id)
        await TaskRemoveService().remove(context.domain_context, uow, task)
