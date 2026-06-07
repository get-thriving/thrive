"""Use case for activating a publish entity."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntity
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class PublishEntityActivateArgs(UseCaseArgsBase):
    """PublishEntityActivate args."""

    ref_id: EntityId


@mutation_use_case()
class PublishEntityActivateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[PublishEntityActivateArgs, None]
):
    """Use case for activating a publish entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PublishEntityActivateArgs,
    ) -> None:
        """Execute the command's action."""
        publish_domain = await uow.get_for(PublishDomain).load_by_parent(
            context.workspace.ref_id
        )
        publish_entity = await uow.get_for(PublishEntity).load_by_id(args.ref_id)

        if publish_entity.parent_ref_id != publish_domain.ref_id:
            raise InputValidationError(
                "The publish entity does not belong to this workspace."
            )

        publish_entity = publish_entity.activate(ctx=context.domain_context)
        await uow.get_for(PublishEntity).save(publish_entity)
        await progress_reporter.mark_updated(publish_entity)
