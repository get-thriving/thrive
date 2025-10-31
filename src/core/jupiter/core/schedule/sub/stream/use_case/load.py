"""Use case for loading a particular stream."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domainx.core.notes.note import Note, NoteRepository
from jupiter.core.domainx.core.notes.note_domain import NoteDomain
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.stream.root import ScheduleStream
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
class ScheduleStreamLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class ScheduleStreamLoadResult(UseCaseResultBase):
    """Result."""

    schedule_stream: ScheduleStream
    note: Note | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleStreamLoadArgs, ScheduleStreamLoadResult
    ]
):
    """Use case for loading a particular stream."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleStreamLoadArgs,
    ) -> ScheduleStreamLoadResult:
        """Execute the command's action."""
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.SCHEDULE_STREAM,
            schedule_stream.ref_id,
            allow_archived=args.allow_archived,
        )

        return ScheduleStreamLoadResult(schedule_stream=schedule_stream, note=note)
