"""Command for updating the time configuration of a journal."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domainx.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.features import WorkspaceFeature
from jupiter.core.journals.root import Journal
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class JournalChangeTimeConfigArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    right_now: UpdateAction[ADate]
    period: UpdateAction[RecurringTaskPeriod]


@mutation_use_case(WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI])
class JournalChangeTimeConfigUseCase(
    JupiterTransactionalLoggedInMutationUseCase[JournalChangeTimeConfigArgs, None]
):
    """Command for updating the time configuration of a journal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalChangeTimeConfigArgs,
    ) -> None:
        """Execute the command's action."""
        journal = await uow.get_for(Journal).load_by_id(args.ref_id)
        journal = journal.change_time_config(
            context.domain_context, args.right_now, args.period
        )
        await uow.get_for(Journal).save(journal)
        await progress_reporter.mark_updated(journal)
