"""A project."""

import abc
from typing import Iterable

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.projects.name import ProjectName
from jupiter.core.projects.stats import ProjectStats
from jupiter.core.projects.status import ProjectStatus
from jupiter.core.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsEntityLinkStd,
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.record import ContainsOneRecord
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity("ProjectCollection")
class Project(LeafEntity):
    """A project."""

    project_collection: ParentLink
    aspect_ref_id: EntityId
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    name: ProjectName
    status: ProjectStatus
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_date: ADate | None
    due_date: ADate | None
    working_time: Timestamp | None
    completed_time: Timestamp | None

    milestones = ContainsMany(ProjectMilestone, project_ref_id=IsRefId())
    inbox_tasks = OwnsMany(
        InboxTask,
        owner=IsEntityLinkStd(NamedEntityTag.PROJECT.value),
    )
    time_event_in_day_blocks = OwnsMany(
        TimeEventInDayBlock,
        owner=IsEntityLinkStd(NamedEntityTag.PROJECT.value),
    )
    tag_link = OwnsAtMostOne(
        TagLink, owner=IsEntityLinkStd(NamedEntityTag.PROJECT.value)
    )
    note = OwnsAtMostOne(Note, owner=IsEntityLinkStd(NamedEntityTag.PROJECT.value))
    stats = ContainsOneRecord(ProjectStats, project_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_project(
        ctx: DomainContext,
        project_collection_ref_id: EntityId,
        aspect_ref_id: EntityId,
        chapter_ref_id: EntityId | None,
        goal_ref_id: EntityId | None,
        name: ProjectName,
        status: ProjectStatus,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
    ) -> "Project":
        """Create a project."""
        Project._check_actionable_and_due_dates(actionable_date, due_date)
        working_time = ctx.action_timestamp if status.is_working_or_more else None
        completed_time = ctx.action_timestamp if status.is_completed else None

        return Project._create(
            ctx,
            project_collection=ParentLink(project_collection_ref_id),
            aspect_ref_id=aspect_ref_id,
            chapter_ref_id=chapter_ref_id,
            goal_ref_id=goal_ref_id,
            name=name,
            status=status,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            working_time=working_time,
            completed_time=completed_time,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[ProjectName],
        status: UpdateAction[ProjectStatus],
        aspect_ref_id: UpdateAction[EntityId],
        chapter_ref_id: UpdateAction[EntityId | None],
        goal_ref_id: UpdateAction[EntityId | None],
        is_key: UpdateAction[bool],
        eisen: UpdateAction[Eisen],
        difficulty: UpdateAction[Difficulty],
        actionable_date: UpdateAction[ADate | None],
        due_date: UpdateAction[ADate | None],
    ) -> "Project":
        """Update the project."""
        Project._check_actionable_and_due_dates(
            actionable_date.or_else(self.actionable_date),
            due_date.or_else(self.due_date),
        )
        new_name = name.or_else(self.name)

        new_working_time = self.working_time
        new_completed_time = self.completed_time
        if status.should_change:
            if (
                not self.status.is_working_or_more
                and status.just_the_value.is_working_or_more
            ):
                new_working_time = ctx.action_timestamp
            elif (
                self.status.is_working_or_more
                and not status.just_the_value.is_working_or_more
            ):
                new_working_time = None

            if not self.status.is_completed and status.just_the_value.is_completed:
                new_completed_time = ctx.action_timestamp
            elif self.status.is_completed and not status.just_the_value.is_completed:
                new_completed_time = None
            new_status = status.just_the_value
        else:
            new_status = self.status

        new_actionable_date = actionable_date.or_else(self.actionable_date)
        new_due_date = due_date.or_else(self.due_date)
        new_eisen = eisen.or_else(self.eisen)
        new_difficulty = difficulty.or_else(self.difficulty)

        return self._new_version(
            ctx,
            name=new_name,
            status=new_status,
            aspect_ref_id=aspect_ref_id.or_else(self.aspect_ref_id),
            chapter_ref_id=chapter_ref_id.or_else(self.chapter_ref_id),
            goal_ref_id=goal_ref_id.or_else(self.goal_ref_id),
            is_key=is_key.or_else(self.is_key),
            eisen=new_eisen,
            difficulty=new_difficulty,
            working_time=new_working_time,
            completed_time=new_completed_time,
            actionable_date=new_actionable_date,
            due_date=new_due_date,
        )

    @update_entity_action
    def change_dates_via_time_plan(
        self,
        ctx: DomainContext,
        actionable_date: ADate,
        due_date: ADate,
    ) -> "Project":
        """Update the inbox task."""
        self._check_actionable_and_due_dates(actionable_date, due_date)

        return self._new_version(
            ctx, actionable_date=actionable_date, due_date=due_date
        )

    @property
    def is_working(self) -> bool:
        """Whether this task is being worked on or not."""
        return self.status.is_working

    @property
    def is_working_or_more(self) -> bool:
        """Whether this task is being worked on or not."""
        return self.status.is_working_or_more

    @property
    def is_completed(self) -> bool:
        """Whether the project is completed or not."""
        return self.status.is_completed

    @staticmethod
    def _check_actionable_and_due_dates(
        actionable_date: ADate | None,
        due_date: ADate | None,
    ) -> None:
        if actionable_date is None or due_date is None:
            return

        if actionable_date > due_date:
            raise InputValidationError(
                f"The actionable date {actionable_date} should be before the due date {due_date}",
            )


class ProjectRepository(LeafEntityRepository[Project], abc.ABC):
    """A repository of projects."""

    @abc.abstractmethod
    async def find_completed_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        filter_start_completed_date: ADate,
        filter_end_completed_date: ADate,
        filter_exclude_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[Project]:
        """Find all completed projects in a time range."""
