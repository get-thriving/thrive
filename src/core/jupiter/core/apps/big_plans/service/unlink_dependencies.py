"""A service for unlinking a big plan from the big plans that depend on it."""

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class BigPlanUnlinkDependenciesService:
    """A service for unlinking a big plan from the big plans that depend on it."""

    async def unlink_dependencies(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        big_plan: BigPlan,
    ) -> None:
        """Drop the big plan from the dependencies of every other big plan.

        Callers must have already authorized write access to the big plan being
        unlinked. The big plans that depend on it live in the same collection
        and are updated without a separate ACL check each.
        """
        # Dependencies are a list in a JSON column, so there's nothing to filter
        # on in the query - the whole collection is scanned instead.
        all_big_plans = await uow.get_for(BigPlan).find_all_generic(
            parent_ref_id=big_plan.big_plan_collection.ref_id,
            allow_archived=True,
        )

        for other_big_plan in all_big_plans:
            if big_plan.ref_id not in other_big_plan.dependency_ref_ids:
                continue

            updated_big_plan = other_big_plan.update(
                ctx,
                name=UpdateAction.do_nothing(),
                status=UpdateAction.do_nothing(),
                aspect_ref_id=UpdateAction.do_nothing(),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.do_nothing(),
                is_key=UpdateAction.do_nothing(),
                eisen=UpdateAction.do_nothing(),
                difficulty=UpdateAction.do_nothing(),
                actionable_date=UpdateAction.do_nothing(),
                due_date=UpdateAction.do_nothing(),
                dependency_ref_ids=UpdateAction.change_to(
                    [
                        dependency_ref_id
                        for dependency_ref_id in other_big_plan.dependency_ref_ids
                        if dependency_ref_id != big_plan.ref_id
                    ]
                ),
            )
            await uow.get_for(BigPlan).save(updated_big_plan)
            await progress_reporter.mark_updated(updated_big_plan)
