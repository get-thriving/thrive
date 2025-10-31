"""The command for updating a vacation's properties."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.core.time_events.time_event_full_days_block import (
    TimeEventFullDaysBlock,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_loader import generic_loader
from jupiter.core.vacations.name import VacationName
from jupiter.core.vacations.root import Vacation
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
class VacationUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[VacationName]
    start_date: UpdateAction[ADate]
    end_date: UpdateAction[ADate]


@mutation_use_case(WorkspaceFeature.VACATIONS)
class VacationUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[VacationUpdateArgs, None]
):
    """The command for updating a vacation's properties."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: VacationUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        vacation, time_event_block = await generic_loader(
            uow, Vacation, args.ref_id, Vacation.time_event_block
        )

        vacation = vacation.update(
            context.domain_context,
            name=args.name,
            start_date=args.start_date,
            end_date=args.end_date,
        )

        vacation = await uow.get_for(Vacation).save(vacation)
        await progress_reporter.mark_updated(vacation)

        time_event_block = time_event_block.update_for_vacation(
            context.domain_context,
            start_date=vacation.start_date,
            end_date=vacation.end_date,
        )

        time_event_block = await uow.get_for(TimeEventFullDaysBlock).save(
            time_event_block
        )
