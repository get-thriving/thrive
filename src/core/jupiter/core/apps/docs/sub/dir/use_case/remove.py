"""Use case for removing a directory."""

from jupiter.core.app import AppCore
from jupiter.core.apps.docs.sub.dir.root import Dir
from jupiter.core.apps.docs.sub.dir.service.remove import DirRemoveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class DirRemoveArgs(JupiterRemoveCrownEntityArgs):
    """DirRemove arguments."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirRemoveUseCase(JupiterRemoveCrownEntityUseCase[DirRemoveArgs, None]):
    """Use case for removing a directory."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DirRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        dir_entity = await self.load_entity(uow, context.user.ref_id, Dir, args.ref_id)
        if dir_entity.is_root:
            raise InputValidationError("Cannot remove the root directory.")
        await DirRemoveService().do_it(
            context.domain_context, uow, progress_reporter, dir_entity
        )
