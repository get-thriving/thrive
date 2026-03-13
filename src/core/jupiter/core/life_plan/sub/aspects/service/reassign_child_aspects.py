"""Service for reassigning linked entities when archiving/removing a aspect."""

from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.aspects.service.check_cycles import (
    AspectCheckCyclesService,
    AspectTreeHasCyclesError,
)
from jupiter.framework.context import MutationContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class AspectReassignChildAspectsService:
    """Service for reassigning direct children aspects to the aspect's parent."""

    async def reassign_child_aspects(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        life_plan: LifePlan,
        old_aspect: Aspect,
    ) -> None:
        """Reassign all direct children of the aspect to the aspect's parent."""
        if old_aspect.is_root:
            raise InputValidationError(
                "The root aspect cannot be processed by this service."
            )

        new_parent_aspect_ref_id = old_aspect.surely_parent_aspect_ref_id

        child_aspects = await uow.get_for(Aspect).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=True,
            parent_aspect_ref_id=old_aspect.ref_id,
        )

        for child_aspect in child_aspects:
            child_aspect = child_aspect.update(
                ctx,
                name=UpdateAction.do_nothing(),
                parent_aspect_ref_id=UpdateAction.change_to(new_parent_aspect_ref_id),
            )

            await uow.get_for(Aspect).save(child_aspect)
            await progress_reporter.mark_updated(child_aspect)

            try:
                await AspectCheckCyclesService().check_for_cycles(uow, child_aspect)
            except AspectTreeHasCyclesError as err:
                raise InputValidationError("The aspect tree has cycles.") from err
