"""The command for updating a milestone."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.partial_date import PartialDate
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class MilestoneUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Milestone update args."""

    ref_id: EntityId
    name: UpdateAction[MilestoneName]
    date: UpdateAction[ADate]
    aspect_ref_id: UpdateAction[EntityId]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[MilestoneUpdateArgs, None]
):
    """The command for updating a milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MilestoneUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await self.load_entity(
            uow, context.user.ref_id, Milestone, args.ref_id
        )

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            context.workspace.ref_id,
        )

        if args.date.should_change:
            if args.date.just_the_value < life_plan.birthday_date:
                raise InputValidationError(
                    f"Milestone date {args.date.just_the_value} must be after life plan's birthday {life_plan.birthday_date}"
                )
            if args.date.just_the_value > life_plan.end_date:
                raise InputValidationError(
                    f"Milestone date {args.date.just_the_value} must be before life plan's end date {life_plan.end_date}"
                )

            all_milestones = await uow.get_for(Milestone).find_all(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
            )
            milestone_dates_by_ref_id = {
                milestone.ref_id: milestone.date for milestone in all_milestones
            }
            chapters = await uow.get_for(Chapter).find_all(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
            )

            for chapter in chapters:
                try:
                    if chapter.start_date.contains_milestone(milestone.ref_id):
                        _ = chapter.update(
                            ctx=context.domain_context,
                            birthday=life_plan.birthday_date,
                            milestone_dates_by_ref_id=milestone_dates_by_ref_id,
                            aspect_ref_id=UpdateAction.do_nothing(),
                            name=UpdateAction.do_nothing(),
                            start_date=args.date.transform(
                                lambda date: PartialDate.from_absolute_ymd(
                                    date.year, date.month, date.day
                                )
                            ),
                            end_date=UpdateAction.do_nothing(),
                        )
                    if chapter.end_date.contains_milestone(milestone.ref_id):
                        _ = chapter.update(
                            ctx=context.domain_context,
                            birthday=life_plan.birthday_date,
                            milestone_dates_by_ref_id=milestone_dates_by_ref_id,
                            aspect_ref_id=UpdateAction.do_nothing(),
                            name=UpdateAction.do_nothing(),
                            start_date=UpdateAction.do_nothing(),
                            end_date=args.date.transform(
                                lambda date: PartialDate.from_absolute_ymd(
                                    date.year, date.month, date.day
                                )
                            ),
                        )
                except InputValidationError as err:
                    raise InputValidationError(
                        f"Cannot update milestone because chapter {chapter.name} would be invalid"
                    ) from err

        aspect_ref_id = args.aspect_ref_id.or_else(milestone.aspect_ref_id)
        if args.aspect_ref_id.should_change:
            _ = await self.load_entity(uow, context.user.ref_id, Aspect, aspect_ref_id)
        else:
            _ = await uow.get_for(Aspect).load_by_id(aspect_ref_id)

        milestone = milestone.update(
            ctx=context.domain_context,
            name=args.name,
            date=args.date,
            aspect_ref_id=args.aspect_ref_id,
        )

        await uow.get_for(Milestone).save(milestone)
        await progress_reporter.mark_updated(milestone)
