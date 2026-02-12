"""Use case for loading a tag."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TagLoadArgs(UseCaseArgsBase):
    """TagLoad args."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class TagLoadResult(UseCaseResultBase):
    """TagLoad result."""

    tag: Tag


@readonly_use_case(exclude_component=[AppCore.CLI])
class TagLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TagLoadArgs, TagLoadResult]
):
    """Use case for loading a tag."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TagLoadArgs,
    ) -> TagLoadResult:
        """Execute the command's action."""
        tag = await uow.get_for(Tag).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )
        return TagLoadResult(tag=tag)
