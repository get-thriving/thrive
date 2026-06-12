"""Use case for loading big plans."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.service.load import BigPlanLoadResult, BigPlanLoadService
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)

__all__ = ["BigPlanLoadArgs", "BigPlanLoadResult", "BigPlanLoadUseCase"]


@use_case_args
class BigPlanLoadArgs(UseCaseArgsBase):
    """BigPlanLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[BigPlanLoadArgs, BigPlanLoadResult]
):
    """The use case for loading a particular big plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: BigPlanLoadArgs,
    ) -> BigPlanLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace
        big_plan = await uow.get_for(BigPlan).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await BigPlanLoadService().do_it(
            uow,
            workspace.ref_id,
            big_plan,
            allow_archived=allow_archived,
        )
