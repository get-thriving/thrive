"""The command for creating a aspect."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
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
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class AspectCreateArgs(JupiterCreateCrownEntityArgs):
    """Aspect create args."""

    parent_aspect_ref_id: EntityId
    name: AspectName


@use_case_result
class AspectCreateResult(UseCaseResultBase):
    """Aspect create results."""

    new_aspect: Aspect


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class AspectCreateUseCase(
    JupiterCreateCrownEntityUseCase[AspectCreateArgs, AspectCreateResult]
):
    """The command for creating a aspect."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AspectCreateArgs,
    ) -> AspectCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )

        parent_aspect = await self.load_entity(
            uow, context.user.ref_id, Aspect, args.parent_aspect_ref_id
        )
        parent_depth = await AspectComputeDepthFromRootService().do_it(
            uow, parent_aspect
        )
        if parent_depth + 1 >= MAX_ASPECT_DEPTH_FROM_ROOT:
            raise InputValidationError(
                f"Cannot create a aspect deeper than {MAX_ASPECT_DEPTH_FROM_ROOT} levels from the root."
            )

        new_aspect = Aspect.new_aspect(
            ctx=context.domain_context,
            life_plan_ref_id=life_plan.ref_id,
            parent_aspect_ref_id=args.parent_aspect_ref_id,
            name=args.name,
        )

        new_aspect = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_aspect,
        )

        parent_aspect = parent_aspect.add_child_aspect(
            ctx=context.domain_context,
            child_aspect_ref_id=new_aspect.ref_id,
        )
        await uow.get_for(Aspect).save(parent_aspect)

        try:
            await AspectCheckCyclesService().check_for_cycles(uow, new_aspect)
        except AspectTreeHasCyclesError as err:
            raise InputValidationError("The aspect tree has cycles.") from err

        return AspectCreateResult(new_aspect=new_aspect)
