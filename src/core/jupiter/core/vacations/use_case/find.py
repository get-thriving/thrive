"""The command for finding vacations."""

from collections import defaultdict

from jupiter.core.common.notes.collection import NoteCollection
from jupiter.core.common.notes.domain import NoteDomain
from jupiter.core.common.notes.root import Note
from jupiter.core.common.time_events.domain import TimeEventDomain
from jupiter.core.common.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.vacations.collection import VacationCollection
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


@use_case_args
class VacationFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool
    include_notes: bool
    include_time_event_blocks: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result
class VacationFindResultEntry(UseCaseResultBase):
    """PersonFindResult object."""

    vacation: Vacation
    note: Note | None
    time_event_block: TimeEventFullDaysBlock | None


@use_case_result
class VacationFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[VacationFindResultEntry]


@readonly_use_case(WorkspaceFeature.VACATIONS)
class VacationFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[VacationFindArgs, VacationFindResult]
):
    """The command for finding vacations."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VacationFindArgs,
    ) -> VacationFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
            workspace.ref_id,
        )
        vacations = await uow.get_for(Vacation).find_all(
            parent_ref_id=vacation_collection.ref_id,
            allow_archived=args.allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        notes_by_vacation_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                domain=NoteDomain.VACATION,
                allow_archived=True,
                source_entity_ref_id=[vacation.ref_id for vacation in vacations],
            )
            for note in notes:
                notes_by_vacation_ref_id[note.parent_ref_id] = note

        time_event_blocks_by_vacation_ref_id: defaultdict[
            EntityId, TimeEventFullDaysBlock
        ] = defaultdict(None)
        if args.include_time_event_blocks:
            time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
                workspace.ref_id,
            )
            time_event_blocks = await uow.get_for(
                TimeEventFullDaysBlock
            ).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=True,
                namespace=TimeEventNamespace.VACATION,
                source_entity_ref_id=[vacation.ref_id for vacation in vacations],
            )
            for time_event_block in time_event_blocks:
                time_event_blocks_by_vacation_ref_id[
                    time_event_block.source_entity_ref_id
                ] = time_event_block

        return VacationFindResult(
            entries=[
                VacationFindResultEntry(
                    vacation=vacation,
                    note=notes_by_vacation_ref_id.get(vacation.ref_id, None),
                    time_event_block=time_event_blocks_by_vacation_ref_id.get(
                        vacation.ref_id, None
                    ),
                )
                for vacation in vacations
            ]
        )
