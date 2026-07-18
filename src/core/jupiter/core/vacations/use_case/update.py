"""The command for updating a vacation's properties."""

from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.vacations.name import VacationName
from jupiter.core.vacations.root import Vacation
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class VacationUpdateArgs(JupiterUpdateCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[VacationName]
    start_date: UpdateAction[ADate]
    end_date: UpdateAction[ADate]


@mutation_use_case(WorkspaceFeature.VACATIONS)
class VacationUpdateUseCase(JupiterUpdateCrownEntityUseCase[VacationUpdateArgs, None]):
    """The command for updating a vacation's properties."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: VacationUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        vacation = await self.load_entity(
            uow, context.user.ref_id, Vacation, args.ref_id
        )
        time_event_blocks = await uow.get_for(TimeEventFullDaysBlock).find_all_generic(
            parent_ref_id=None,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.VACATION.value, args.ref_id),
        )
        if not time_event_blocks:
            raise EntityNotFoundError(
                f"Could not find time event block for vacation {args.ref_id}"
            )
        time_event_block = time_event_blocks[0]

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
