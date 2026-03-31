"""A service for unlinking entities from a milestone."""

from jupiter.core.life_plan.partial_date import PartialDate
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class MilestoneUnlinkEntitiesService:
    """A service for unlinking entities from a milestone."""

    async def unlink_entities(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        life_plan: LifePlan,
        milestone: Milestone,
    ) -> None:
        """Unlink entities from a milestone."""
        # Load all chapters
        chapters = await uow.get_for(Chapter).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )

        all_milestones = await uow.get_for(Milestone).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )
        milestone_dates_by_ref_id = {
            milestone.ref_id: milestone.date for milestone in all_milestones
        }

        # For each chapter, update the milestone
        for chapter in chapters:
            if chapter.start_date.contains_milestone(milestone.ref_id):
                chapter = chapter.update(
                    ctx,
                    birthday=life_plan.birthday_date,
                    milestone_dates_by_ref_id=milestone_dates_by_ref_id,
                    aspect_ref_id=UpdateAction.do_nothing(),
                    name=UpdateAction.do_nothing(),
                    start_date=UpdateAction.change_to(
                        PartialDate.from_absolute_ymd(
                            milestone.date.year,
                            milestone.date.month,
                            milestone.date.day,
                        )
                    ),
                    end_date=UpdateAction.do_nothing(),
                )

            if chapter.end_date.contains_milestone(milestone.ref_id):
                chapter = chapter.update(
                    ctx,
                    birthday=life_plan.birthday_date,
                    milestone_dates_by_ref_id=milestone_dates_by_ref_id,
                    aspect_ref_id=UpdateAction.change_to(chapter.aspect_ref_id),
                    name=UpdateAction.do_nothing(),
                    start_date=UpdateAction.do_nothing(),
                    end_date=UpdateAction.change_to(
                        PartialDate.from_absolute_ymd(
                            milestone.date.year,
                            milestone.date.month,
                            milestone.date.day,
                        )
                    ),
                )

            await uow.get_for(Chapter).save(chapter)
            await progress_reporter.mark_updated(chapter)
