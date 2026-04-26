"""Use case for removing a schedule stream."""

from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.schedule.sub.stream.source import (
    ScheduleStreamSource,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class ScheduleStreamRemoveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleStreamRemoveArgs, None]
):
    """Use case for removing a schedule stream."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleStreamRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.ref_id, allow_archived=True
        )
        if (
            not schedule_stream.archived
            and schedule_stream.source == ScheduleStreamSource.USER
        ):
            all_user_schedule_streams = await uow.get_for(
                ScheduleStream
            ).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                source=ScheduleStreamSource.USER,
                allow_archived=False,
            )

            if len(all_user_schedule_streams) == 1:
                raise InputValidationError("You cannot remove the last user schedule")

        schedule_exports = await uow.get_for(ScheduleExport).find_all_generic(
            parent_ref_id=schedule_domain.ref_id,
            allow_archived=True,
        )
        for schedule_export in schedule_exports:
            if schedule_stream.ref_id not in schedule_export.schedule_stream_ref_ids:
                continue

            updated_schedule_stream_ref_ids = [
                stream_ref_id
                for stream_ref_id in schedule_export.schedule_stream_ref_ids
                if stream_ref_id != schedule_stream.ref_id
            ]
            schedule_export = schedule_export.update(
                context.domain_context,
                name=UpdateAction.do_nothing(),
                schedule_stream_ref_ids=UpdateAction.change_to(
                    updated_schedule_stream_ref_ids
                ),
            )
            await uow.get_for(ScheduleExport).save(schedule_export)
            await progress_reporter.mark_updated(schedule_export)

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(
                NamedEntityTag.SCHEDULE_STREAM.value,
                schedule_stream.ref_id,
            ),
        )

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, ScheduleStream, args.ref_id
        )
