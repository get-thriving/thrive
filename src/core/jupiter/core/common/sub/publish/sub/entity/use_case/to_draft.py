"""Use case for moving a publish entity back to draft."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.root import (
    ALLOWED_PUBLISH_OWNER_TYPES,
    PublishEntity,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpdateLeafSupportEntityArgs,
    JupiterUpdateLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class PublishEntityToDraftArgs(JupiterUpdateLeafSupportEntityArgs):
    """PublishEntityToDraft args."""

    ref_id: EntityId


@mutation_use_case()
class PublishEntityToDraftUseCase(
    JupiterUpdateLeafSupportEntityUseCase[PublishEntityToDraftArgs, None]
):
    """Use case for moving a publish entity back to draft."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PublishEntityToDraftArgs,
    ) -> None:
        """Execute the command's action."""
        _, publish_entity = await self.load_for_owner(
            uow,
            PublishDomain,
            PublishEntity,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_PUBLISH_OWNER_TYPES,
            AccessLevel.OWNER,
        )

        publish_entity = publish_entity.to_draft(ctx=context.domain_context)
        await uow.get_for(PublishEntity).save(publish_entity)
        await progress_reporter.mark_updated(publish_entity)
