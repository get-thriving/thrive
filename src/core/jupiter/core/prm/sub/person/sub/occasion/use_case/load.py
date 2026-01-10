"""Use case for loading an occasion."""

from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class OccasionLoadArgs(UseCaseArgsBase):
    """OccasionLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class OccasionLoadResult(UseCaseResultBase):
    """OccasionLoadResult."""

    occasion: Occasion
    note: Note | None


@readonly_use_case(WorkspaceFeature.PRM)
class OccasionLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[OccasionLoadArgs, OccasionLoadResult]
):
    """Use case for loading an occasion."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: OccasionLoadArgs,
    ) -> OccasionLoadResult:
        """Execute the command's action."""
        occasion, note = await generic_loader(
            uow,
            Occasion,
            args.ref_id,
            Occasion.note,
            allow_archived=args.allow_archived,
        )

        return OccasionLoadResult(occasion=occasion, note=note)
