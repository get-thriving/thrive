"""The command for updating a aspect."""

from typing import cast

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.name import AspectName
from jupiter.core.life_plan.sub.aspects.root import MAX_ASPECT_DEPTH_FROM_ROOT, Aspect
from jupiter.core.life_plan.sub.aspects.service.check_cycles import (
    AspectCheckCyclesService,
    AspectTreeHasCyclesError,
)
from jupiter.core.life_plan.sub.aspects.service.compute_depth_from_root import (
    AspectComputeDepthFromRootService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class AspectUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[AspectName]
    parent_aspect_ref_id: UpdateAction[EntityId | None] = UpdateAction.do_nothing()


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class AspectUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[AspectUpdateArgs, None]
):
    """The command for updating a aspect."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AspectUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        aspect = await uow.get_for(Aspect).load_by_id(args.ref_id)

        current_parent: Aspect | None = None
        new_parent: Aspect | None = None

        new_parent_aspect_ref_id = args.parent_aspect_ref_id.or_else(
            aspect.parent_aspect_ref_id
        )
        if args.parent_aspect_ref_id.should_change:
            if aspect.is_root and new_parent_aspect_ref_id is not None:
                raise InputValidationError("Root aspects cannot have a parent aspect.")
            if not aspect.is_root and new_parent_aspect_ref_id is None:
                raise InputValidationError(
                    "A non-root aspect must have a parent aspect."
                )

            if not aspect.is_root and new_parent_aspect_ref_id is not None:
                current_parent = await uow.get_for(Aspect).load_by_id(
                    cast(EntityId, aspect.parent_aspect_ref_id)  # Null on root aspects
                )
                new_parent = await uow.get_for(Aspect).load_by_id(
                    new_parent_aspect_ref_id
                )

                if current_parent.ref_id != new_parent.ref_id:
                    new_parent_depth = await AspectComputeDepthFromRootService().do_it(
                        uow, new_parent
                    )
                    if new_parent_depth + 1 >= MAX_ASPECT_DEPTH_FROM_ROOT:
                        raise InputValidationError(
                            f"Cannot move a aspect deeper than {MAX_ASPECT_DEPTH_FROM_ROOT} levels from the root."
                        )

                current_parent = current_parent.remove_child_aspect(
                    context.domain_context, aspect.ref_id
                )
                await uow.get_for(Aspect).save(current_parent)
                await progress_reporter.mark_updated(current_parent)

                new_parent = new_parent.add_child_aspect(
                    context.domain_context, aspect.ref_id
                )
                await uow.get_for(Aspect).save(new_parent)
                await progress_reporter.mark_updated(new_parent)

        aspect = aspect.update(
            ctx=context.domain_context,
            name=args.name,
            parent_aspect_ref_id=args.parent_aspect_ref_id,
        )

        aspect = await uow.get_for(Aspect).save(aspect)
        await progress_reporter.mark_updated(aspect)

        try:
            await AspectCheckCyclesService().check_for_cycles(uow, aspect)
        except AspectTreeHasCyclesError as err:
            raise InputValidationError("The aspect tree has cycles.") from err
