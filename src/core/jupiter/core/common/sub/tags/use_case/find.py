"""Use case for finding tags."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tags.domain import TagDomain
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import Tag
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
class TagFindArgs(UseCaseArgsBase):
    """TagFind args."""

    allow_archived: bool
    filter_namespace: list[TagNamespace] | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class TagFindResult(UseCaseResultBase):
    """TagFind result."""

    tags: list[Tag]


@readonly_use_case(exclude_component=[AppCore.CLI])
class TagFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TagFindArgs, TagFindResult]
):
    """Use case for finding tags."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TagFindArgs,
    ) -> TagFindResult:
        """Execute the command's action."""
        workspace = context.workspace
        tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)

        tags = await uow.get_for(Tag).find_all_generic(
            parent_ref_id=tag_domain.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            namespace=args.filter_namespace or NoFilter(),
        )

        return TagFindResult(tags=tags)
