"""The command for finding circles."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CircleFindArgs(JupiterFindCrownEntityArgs):
    """Circle find args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class CircleFindResult(UseCaseResultBase):
    """Circle find result."""

    circles: list[Circle]


@readonly_use_case(WorkspaceFeature.PRM)
class CircleFindUseCase(
    JupiterFindCrownEntityUseCase[CircleFindArgs, CircleFindResult]
):
    """The command for finding circles."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: CircleFindArgs,
    ) -> CircleFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace

        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )

        accessible_circle_ref_ids = await self.find_accessible_ref_ids(
            uow, context.user.ref_id, Circle, allow_archived
        )
        if args.filter_ref_ids is not None:
            accessible_set = set(accessible_circle_ref_ids)
            accessible_circle_ref_ids = [
                ref_id for ref_id in args.filter_ref_ids if ref_id in accessible_set
            ]
        if not accessible_circle_ref_ids:
            return CircleFindResult(circles=[])

        circles = await uow.get_for(Circle).find_all(
            parent_ref_id=prm.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=accessible_circle_ref_ids,
        )

        return CircleFindResult(circles=circles)
