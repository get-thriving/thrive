"""Use case for creating a publish entity."""

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
    JupiterCreateLeafSupportEntityArgs,
    JupiterCreateLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PublishEntityCreateArgs(JupiterCreateLeafSupportEntityArgs):
    """PublishEntityCreate args."""

    owner: EntityLink


@use_case_result
class PublishEntityCreateResult(UseCaseResultBase):
    """PublishEntityCreate result."""

    new_publish_entity: PublishEntity


@mutation_use_case()
class PublishEntityCreateUseCase(
    JupiterCreateLeafSupportEntityUseCase[
        PublishEntityCreateArgs, PublishEntityCreateResult
    ]
):
    """Use case for creating a publish entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PublishEntityCreateArgs,
    ) -> PublishEntityCreateResult:
        """Execute the command's action."""
        # Publishing exposes the entity publicly, so it stays an owner right
        # over entities in this workspace namespace.
        await self.check_owner_and_find_workspace(
            uow,
            context.user.ref_id,
            context.workspace.ref_id,
            args.owner,
            ALLOWED_PUBLISH_OWNER_TYPES,
            AccessLevel.OWNER,
            require_in_caller_workspace=True,
        )
        publish_domain = await self.load_parent(
            uow, PublishDomain, context.workspace.ref_id
        )

        new_publish_entity = PublishEntity.new_publish_entity(
            ctx=context.domain_context,
            publish_domain_ref_id=publish_domain.ref_id,
            owner=args.owner,
        )
        new_publish_entity = await uow.get_for(PublishEntity).create(new_publish_entity)
        return PublishEntityCreateResult(new_publish_entity=new_publish_entity)
