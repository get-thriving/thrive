"""Use case for creating a publish entity."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.name import PublishEntityName
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntity
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PublishEntityCreateArgs(UseCaseArgsBase):
    """PublishEntityCreate args."""

    name: PublishEntityName
    entity_type: str
    entity_ref_id: EntityId


@use_case_result
class PublishEntityCreateResult(UseCaseResultBase):
    """PublishEntityCreate result."""

    new_publish_entity: PublishEntity


@mutation_use_case()
class PublishEntityCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
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
        workspace = context.workspace
        publish_domain = await uow.get_for(PublishDomain).load_by_parent(
            workspace.ref_id
        )

        new_publish_entity = PublishEntity.new_publish_entity(
            ctx=context.domain_context,
            publish_domain_ref_id=publish_domain.ref_id,
            name=args.name,
            entity_type=args.entity_type,
            entity_ref_id=args.entity_ref_id,
        )
        new_publish_entity = await uow.get_for(PublishEntity).create(new_publish_entity)
        return PublishEntityCreateResult(new_publish_entity=new_publish_entity)
