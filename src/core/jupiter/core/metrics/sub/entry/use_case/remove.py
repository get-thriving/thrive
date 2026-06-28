"""The command for removing a metric entry."""

from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class MetricEntryRemoveArgs(JupiterRemoveCrownEntityArgs):
    """MetricEntryRemove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricEntryRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[MetricEntryRemoveArgs, None]
):
    """The command for removing a metric entry."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricEntryRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, MetricEntry, args.ref_id)

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_owner(
            context.domain_context,
            uow,
            EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, args.ref_id),
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, args.ref_id),
        )

        metric_entry = await uow.get_for(MetricEntry).remove(
            context.domain_context, args.ref_id
        )
        await progress_reporter.mark_removed(metric_entry)
