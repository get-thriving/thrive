"""Use case for updating a directory."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.docs.sub.dir.name import DirName
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.dir.service.check_cycles import (
    DirCheckCyclesService,
    DirTreeHasCyclesError,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DirUpdateArgs(UseCaseArgsBase):
    """DirUpdate args."""

    ref_id: EntityId
    name: UpdateAction[DirName]
    parent_dir_ref_id: UpdateAction[EntityId]


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DirUpdateArgs, None]
):
    """Use case for updating a directory."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DirUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        dir_entity = await uow.get_for(Dir).load_by_id(args.ref_id)
        if dir_entity.is_root:
            raise InputValidationError("Cannot update the root directory.")
        dir_entity = dir_entity.update(
            context.domain_context,
            name=args.name,
            parent_dir_ref_id=args.parent_dir_ref_id,
        )
        try:
            await DirCheckCyclesService().check_for_cycles(uow, dir_entity)
        except DirTreeHasCyclesError as err:
            raise InputValidationError(
                "Cannot move a folder into its own subtree (that would create a cycle).",
            ) from err
        dir_entity = await uow.get_for(Dir).save(dir_entity)
        await progress_reporter.mark_updated(dir_entity)
