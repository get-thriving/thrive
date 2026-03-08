"""Use case for loading big plans."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.stats import BigPlanStats, BigPlanStatsRepository
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.namespace import TimeEventNamespace
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.common.suggested_date import SuggestedDate
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class BigPlanLoadArgs(UseCaseArgsBase):
    """BigPlanLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class BigPlanLoadResult(UseCaseResultBase):
    """BigPlanLoadResult."""

    big_plan: BigPlan
    project: Project
    chapter: Chapter | None
    goal: Goal | None
    milestones: list[BigPlanMilestone]
    inbox_tasks: list[InboxTask]
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    time_event_blocks: list[TimeEventInDayBlock]
    stats: BigPlanStats
    actionable_date_suggested_dates: list[SuggestedDate]
    due_date_suggested_dates: list[SuggestedDate]


@readonly_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[BigPlanLoadArgs, BigPlanLoadResult]
):
    """The use case for loading a particular big plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: BigPlanLoadArgs,
    ) -> BigPlanLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace

        big_plan = await uow.get_for(BigPlan).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        project = await uow.get_for(Project).load_by_id(big_plan.project_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(big_plan.chapter_ref_id)
            if big_plan.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(big_plan.goal_ref_id)
            if big_plan.goal_ref_id
            else None
        )
        milestones = await uow.get_for(BigPlanMilestone).find_all_generic(
            parent_ref_id=big_plan.ref_id,
            allow_archived=False,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=allow_archived,
            source=InboxTaskSource.BIG_PLAN,
            source_entity_ref_id=big_plan.ref_id,
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.BIG_PLAN,
            source_entity_ref_id=big_plan.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_link = await uow.get(
            ContactLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=ContactNamespace.BIG_PLAN,
            source_entity_ref_id=big_plan.ref_id,
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.BIG_PLAN,
            big_plan.ref_id,
            allow_archived=allow_archived,
        )
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )
        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            parent_ref_id=time_event_domain.ref_id,
            allow_archived=False,
            namespace=TimeEventNamespace.BIG_PLAN,
            source_entity_ref_id=[big_plan.ref_id],
        )
        stats = await uow.get(BigPlanStatsRepository).load_by_key_optional(
            big_plan.ref_id
        )
        if stats is None:
            raise Exception("Stats not found")

        actionable_date_suggested_dates: list[SuggestedDate] = []
        due_date_suggested_dates: list[SuggestedDate] = []
        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            milestones_for_lp = await uow.get_for(Milestone).find_all(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
            )
            milestone_dates_by_ref_id = {
                m.ref_id: m.date for m in milestones_for_lp
            }
            all_chapters = await uow.get_for(Chapter).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
            )
            today = ADate.from_timestamp(context.domain_context.action_timestamp)
            for lp_chapter in all_chapters:
                chapter_start = lp_chapter.start_date.earliest_relative_to(
                    life_plan.birthday_date, today, milestone_dates_by_ref_id
                )
                chapter_end = lp_chapter.end_date.latest_relative_to(
                    life_plan.birthday_date, today, milestone_dates_by_ref_id
                )
                if chapter_start <= today <= chapter_end:
                    actionable_date_suggested_dates.append(
                        SuggestedDate(
                            date=chapter_start,
                            description=f"Start of chapter '{lp_chapter.name}'",
                        )
                    )
                    due_date_suggested_dates.append(
                        SuggestedDate(
                            date=chapter_end,
                            description=f"End of chapter '{lp_chapter.name}'",
                        )
                    )

        return BigPlanLoadResult(
            big_plan=big_plan,
            project=project,
            chapter=chapter,
            goal=goal,
            milestones=milestones,
            inbox_tasks=inbox_tasks,
            tags=tags,
            contacts=contacts,
            note=note,
            time_event_blocks=time_event_blocks,
            stats=stats,
            actionable_date_suggested_dates=actionable_date_suggested_dates,
            due_date_suggested_dates=due_date_suggested_dates,
        )
