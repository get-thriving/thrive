"""Use case for loading a particular chore."""

from jupiter.core.chores.root import Chore
from jupiter.core.chores.service.load import ChoreLoadResult, ChoreLoadService
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)

__all__ = ["ChoreLoadArgs", "ChoreLoadResult", "ChoreLoadUseCase"]


@use_case_args
class ChoreLoadArgs(JupiterLoadCrownEntityArgs):
    """ChoreLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    inbox_task_retrieve_offset: int | None


@readonly_use_case(WorkspaceFeature.CHORES)
class ChoreLoadUseCase(JupiterLoadCrownEntityUseCase[ChoreLoadArgs, ChoreLoadResult]):
    """Use case for loading a particular chore."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ChoreLoadArgs,
    ) -> ChoreLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        if (
            args.inbox_task_retrieve_offset is not None
            and args.inbox_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")
        workspace = context.workspace
        chore = await self.load_entity(
            uow,
            context.user.ref_id,
            Chore,
            args.ref_id,
            allow_archived,
        )

        return await ChoreLoadService().do_it(
            uow,
            workspace.ref_id,
            chore,
            allow_archived=allow_archived,
            inbox_task_retrieve_offset=args.inbox_task_retrieve_offset or 0,
        )
