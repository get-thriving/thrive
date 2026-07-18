"""The command for removing a smart list item."""

from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class SmartListItemRemoveArgs(JupiterRemoveCrownEntityArgs):
    """SmartListItemRemove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[SmartListItemRemoveArgs, None]
):
    """The command for removing a smart list item."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListItemRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, SmartListItem, args.ref_id)

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, args.ref_id),
        )
        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, SmartListItem, args.ref_id
        )
