"""Reorder the children of a aspect."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class AspectReorderChildrenArgs(UseCaseArgsBase):
    """Aspect reorder children args."""

    ref_id: EntityId
    new_order_of_child_aspects: list[EntityId]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class AspectReorderChildrenUseCase(
    JupiterTransactionalLoggedInMutationUseCase[AspectReorderChildrenArgs, None]
):
    """Reorder the children of a aspect."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AspectReorderChildrenArgs,
    ) -> None:
        """Execute the command's action."""
        aspect = await uow.get_for(Aspect).load_by_id(args.ref_id)
        child_aspects = await uow.get_for(Aspect).find_all_generic(
            parent_ref_id=aspect.life_plan.ref_id,
            allow_archived=False,
            parent_aspect_ref_id=args.ref_id,
        )

        child_aspect_ref_ids = {child.ref_id for child in child_aspects}
        if set(args.new_order_of_child_aspects) != child_aspect_ref_ids:
            raise InputValidationError(
                "The new order of child aspects does not match the actual child aspects."
            )

        aspect = aspect.reorder_child_aspects(
            ctx=context.domain_context,
            new_order=args.new_order_of_child_aspects,
        )

        await uow.get_for(Aspect).save(aspect)
        await progress_reporter.mark_updated(aspect)
