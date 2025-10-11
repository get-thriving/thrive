"""Use case for loading a smart list item."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list_item import SmartListItem
from jupiter.core.domain.concept.smart_lists.smart_list_tag import SmartListTag
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_loader import generic_loader
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class SmartListItemLoadArgs(UseCaseArgsBase):
    """SmartListItemLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class SmartListItemLoadResult(UseCaseResultBase):
    """SmartListItemLoadResult."""

    item: SmartListItem
    tags: list[SmartListTag]
    note: Note | None


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        SmartListItemLoadArgs, SmartListItemLoadResult
    ]
):
    """Use case for loading a smart list item."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: SmartListItemLoadArgs,
    ) -> SmartListItemLoadResult:
        """Execute the command's action."""
        item, tags, note = await generic_loader(
            uow,
            SmartListItem,
            args.ref_id,
            SmartListItem.all_tags,
            SmartListItem.note,
            allow_archived=args.allow_archived,
        )

        return SmartListItemLoadResult(item=item, tags=list(tags), note=note)
