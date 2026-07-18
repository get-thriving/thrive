"""Use case for loading a particular vacation."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.vacations.root import Vacation
from jupiter.core.vacations.service.load import VacationLoadResult, VacationLoadService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)

__all__ = ["VacationLoadArgs", "VacationLoadResult", "VacationLoadUseCase"]


@use_case_args
class VacationLoadArgs(JupiterLoadCrownEntityArgs):
    """VacationLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.VACATIONS)
class VacationLoadUseCase(
    JupiterLoadCrownEntityUseCase[VacationLoadArgs, VacationLoadResult]
):
    """Use case for loading a particular vacation."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VacationLoadArgs,
    ) -> VacationLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace

        vacation = await self.load_entity(
            uow,
            context.user.ref_id,
            Vacation,
            args.ref_id,
            allow_archived,
        )

        return await VacationLoadService().do_it(
            uow,
            workspace.ref_id,
            vacation,
            allow_archived=allow_archived,
        )
