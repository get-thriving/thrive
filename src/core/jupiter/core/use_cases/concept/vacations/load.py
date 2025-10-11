"""Use case for loading a particular vacation."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.vacations.vacation import Vacation
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.time_events.time_event_full_days_block import (
    TimeEventFullDaysBlock,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_loader import generic_loader
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VacationLoadArgs(UseCaseArgsBase):
    """VacationLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class VacationLoadResult(UseCaseResultBase):
    """VacationLoadResult."""

    vacation: Vacation
    note: Note | None
    time_event_block: TimeEventFullDaysBlock


@readonly_use_case(WorkspaceFeature.VACATIONS)
class VacationLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[VacationLoadArgs, VacationLoadResult]
):
    """Use case for loading a particular vacation."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: VacationLoadArgs,
    ) -> VacationLoadResult:
        """Execute the command's action."""
        vacation, note, time_event_block = await generic_loader(
            uow,
            Vacation,
            args.ref_id,
            Vacation.note,
            Vacation.time_event_block,
            allow_archived=args.allow_archived,
        )

        return VacationLoadResult(
            vacation=vacation, note=note, time_event_block=time_event_block
        )
