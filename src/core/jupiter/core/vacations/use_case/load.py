"""Use case for loading a particular vacation."""

from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.vacations.root import Vacation
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


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
        context: JupiterLoggedInReadonlyContext,
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
