"""Use case for finding publish entities."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntity
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PublishEntityFindArgs(UseCaseArgsBase):
    """PublishEntityFind args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class PublishEntityFindResult(UseCaseResultBase):
    """PublishEntityFind result."""

    publish_entities: list[PublishEntity]


@readonly_use_case(exclude_component=[AppCore.CLI])
class PublishEntityFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        PublishEntityFindArgs, PublishEntityFindResult
    ]
):
    """Use case for finding publish entities."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PublishEntityFindArgs,
    ) -> PublishEntityFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        publish_domain = await uow.get_for(PublishDomain).load_by_parent(
            workspace.ref_id
        )

        publish_entities = await uow.get_for(PublishEntity).find_all_generic(
            parent_ref_id=publish_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        return PublishEntityFindResult(publish_entities=publish_entities)
