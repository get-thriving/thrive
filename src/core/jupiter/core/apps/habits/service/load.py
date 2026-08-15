"""Shared service for loading a habit and its dependent entities."""

from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.habits.streak_mark import (
    HabitStreakMark,
    HabitStreakMarkRepository,
)
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import AccessStatus
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.time_provider import TimeProvider
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class HabitLoadResult(UseCaseResultBase):
    """HabitLoadResult."""

    habit: Habit
    aspect: Aspect
    chapter: Chapter | None
    goal: Goal | None
    inbox_tasks: list[InboxTask]
    inbox_tasks_total_cnt: int
    inbox_tasks_page_size: int
    streak_marks: list[HabitStreakMark]
    streak_mark_earliest_date: ADate
    streak_mark_latest_date: ADate
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    time_event_blocks: list[TimeEventInDayBlock]
    publish_entity: PublishEntity | None
    owner: UserLight
    access_status: AccessStatus | None


class HabitLoadService:
    """Shared service for loading a habit and its dependent entities."""

    def __init__(self, time_provider: TimeProvider) -> None:
        """Constructor."""
        self._time_provider = time_provider

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        habit: Habit,
        *,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
        inbox_task_retrieve_offset: int = 0,
        include_streak_marks_earliest_date: ADate | None = None,
        include_streak_marks_latest_date: ADate | None = None,
        include_publish_entity: bool = True,
    ) -> HabitLoadResult:
        """Load a habit and its dependent entities.

        Callers must have already authorized access to the habit (via ACL or
        publish). Life-plan crown entities referenced on the habit are loaded
        below without a separate ACL check.
        """
        habit = await uow.get_for(Habit).load_by_id(
            habit.ref_id, allow_archived=allow_archived
        )
        # Aspect/chapter/goal are crown entities, but readable because the
        # caller already proved access to the habit that references them.
        aspect = await uow.get_for(Aspect).load_by_id(habit.aspect_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(habit.chapter_ref_id)
            if habit.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(habit.goal_ref_id)
            if habit.goal_ref_id
            else None
        )
        inbox_tasks_total_cnt = await uow.get(InboxTaskRepository).count_all_for_owner(
            allow_archived=allow_archived,
            owner=EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            allow_archived=True,
            owner=EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
            retrieve_offset=inbox_task_retrieve_offset,
            retrieve_limit=InboxTaskRepository.PAGE_SIZE,
        )

        streak_mark_earliest_date = (
            include_streak_marks_earliest_date
            or self._time_provider.get_current_date().subtract_days(365)
        )
        streak_mark_latest_date = (
            include_streak_marks_latest_date or self._time_provider.get_current_date()
        )

        streak_marks = await uow.get(HabitStreakMarkRepository).find_all_between_dates(
            habit.ref_id,
            streak_mark_earliest_date,
            streak_mark_latest_date,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
            allow_archived=allow_archived,
        )

        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )

        owner_link = EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id)
        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                owner_link,
                allow_archived=allow_archived,
            )

        owner = await LoadUserThatOwnsEntityService().do_it(uow, owner_link)
        access_status = (
            await GetAccessLevelForEntityService().do_it(uow, owner_link, user_ref_id)
            if user_ref_id is not None
            else None
        )

        return HabitLoadResult(
            habit=habit,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
            inbox_tasks=inbox_tasks,
            inbox_tasks_total_cnt=inbox_tasks_total_cnt,
            inbox_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
            streak_marks=streak_marks,
            streak_mark_earliest_date=streak_mark_earliest_date,
            streak_mark_latest_date=streak_mark_latest_date,
            tags=tags,
            contacts=contacts,
            note=note,
            time_event_blocks=time_event_blocks,
            publish_entity=publish_entity,
            owner=owner,
            access_status=access_status,
        )
