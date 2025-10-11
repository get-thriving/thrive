"""Use case for loading a smart list tag."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list_tag import SmartListTag
from jupiter.core.domain.features import WorkspaceFeature
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
class SmartListTagLoadArgs(UseCaseArgsBase):
    """SmartListTagLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class SmartListTagLoadResult(UseCaseResultBase):
    """SmartListTagLoadResult."""

    smart_list_tag: SmartListTag


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListTagLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        SmartListTagLoadArgs, SmartListTagLoadResult
    ]
):
    """Use case for loading a smart list tag."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: SmartListTagLoadArgs,
    ) -> SmartListTagLoadResult:
        """Execute the command's action."""
        smart_list_tag = await uow.get_for(SmartListTag).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        return SmartListTagLoadResult(smart_list_tag=smart_list_tag)
