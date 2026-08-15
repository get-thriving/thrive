"""Use case for updating a directory."""

from jupiter.core.app import AppCore
from jupiter.core.apps.docs.service.replicate_dir_hierarchy_rights import (
    ReplicateDirHierarchyRightsService,
)
from jupiter.core.apps.docs.sub.dir.name import DirName
from jupiter.core.apps.docs.sub.dir.root import Dir
from jupiter.core.apps.docs.sub.dir.service.check_cycles import (
    DirCheckCyclesService,
    DirTreeHasCyclesError,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class DirUpdateArgs(JupiterUpdateCrownEntityArgs):
    """DirUpdate args."""

    ref_id: EntityId
    name: UpdateAction[DirName]
    parent_dir_ref_id: UpdateAction[EntityId]


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirUpdateUseCase(JupiterUpdateCrownEntityUseCase[DirUpdateArgs, None]):
    """Use case for updating a directory."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DirUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        dir_entity = await self.load_entity(uow, context.user.ref_id, Dir, args.ref_id)
        if dir_entity.is_root:
            raise InputValidationError("Cannot update the root directory.")

        parent_changed = (
            args.parent_dir_ref_id.should_change
            and args.parent_dir_ref_id.just_the_value != dir_entity.parent_dir_ref_id
        )
        if parent_changed:
            # Only ACL-check the destination folder when retargeting. Shared
            # writers keep the owner's existing parent without needing access to it.
            parent_dir = await self.load_entity(
                uow,
                context.user.ref_id,
                Dir,
                args.parent_dir_ref_id.just_the_value,
            )
            if parent_dir.doc_collection.ref_id != dir_entity.doc_collection.ref_id:
                raise InputValidationError(
                    "Cannot move a directory to a parent in a different doc collection."
                )

        dir_entity = dir_entity.update(
            context.domain_context,
            name=args.name,
            parent_dir_ref_id=(
                args.parent_dir_ref_id if parent_changed else UpdateAction.do_nothing()
            ),
        )
        try:
            await DirCheckCyclesService().check_for_cycles(uow, dir_entity)
        except DirTreeHasCyclesError as err:
            raise InputValidationError(
                "Cannot move a folder into its own subtree (that would create a cycle).",
            ) from err
        dir_entity = await uow.get_for(Dir).save(dir_entity)
        await progress_reporter.mark_updated(dir_entity)
        if parent_changed:
            await ReplicateDirHierarchyRightsService().refresh_for_dir_and_descendants(
                context.domain_context, uow, dir_entity
            )
