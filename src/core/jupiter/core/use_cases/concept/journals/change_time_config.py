"""Command for updating the time configuration of a journal."""

from jupiter.core.config import JupiterTransactionalLoggedInMutationUseCase
from jupiter.core.domain.concept.journals.journal import Journal
from jupiter.core.domain.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.storage_engine import DomainUnitOfWork
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInMutationUseCaseContext,
    mutation_use_case,
)
from jupiter.framework_new.base.adate import ADate
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class JournalChangeTimeConfigArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    right_now: UpdateAction[ADate]
    period: UpdateAction[RecurringTaskPeriod]


@mutation_use_case(WorkspaceFeature.JOURNALS)
class JournalChangeTimeConfigUseCase(
    JupiterTransactionalLoggedInMutationUseCase[JournalChangeTimeConfigArgs, None]
):
    """Command for updating the time configuration of a journal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: JournalChangeTimeConfigArgs,
    ) -> None:
        """Execute the command's action."""
        journal = await uow.get_for(Journal).load_by_id(args.ref_id)
        journal = journal.change_time_config(
            context.domain_context, args.right_now, args.period
        )
        await uow.get_for(Journal).save(journal)
        await progress_reporter.mark_updated(journal)
