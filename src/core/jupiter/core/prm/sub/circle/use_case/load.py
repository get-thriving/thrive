"""Use case for loading a circle."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.circle.root import Circle
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
class CircleLoadArgs(UseCaseArgsBase):
    """Circle load args."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class CircleLoadResult(UseCaseResultBase):
    """Circle load result."""

    circle: Circle


@readonly_use_case(WorkspaceFeature.PRM)
class CircleLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[CircleLoadArgs, CircleLoadResult]
):
    """Use case for loading a circle."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: CircleLoadArgs,
    ) -> CircleLoadResult:
        """Execute the command's action."""
        circle = await uow.get_for(Circle).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )
        return CircleLoadResult(circle=circle)
