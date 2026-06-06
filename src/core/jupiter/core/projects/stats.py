"""Stats about a project."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.record import Record, create_record_action, record
from jupiter.framework.storage.repository import RecordRepository


@record("Project")
class ProjectStats(Record):
    """Stats about a project."""

    project: ParentLink
    all_inbox_tasks_cnt: int
    completed_inbox_tasks_cnt: int

    @staticmethod
    @create_record_action
    def new_stats(ctx: DomainContext, project_ref_id: EntityId) -> "ProjectStats":
        """Create a new project stats."""
        return ProjectStats._create(
            ctx,
            project=ParentLink(project_ref_id),
            all_inbox_tasks_cnt=0,
            completed_inbox_tasks_cnt=0,
        )

    @staticmethod
    @create_record_action
    def new_stats_for_project(
        ctx: DomainContext,
        project_ref_id: EntityId,
        all_inbox_tasks_cnt: int,
        completed_inbox_tasks_cnt: int,
    ) -> "ProjectStats":
        """Create a new project stats for a project."""
        if all_inbox_tasks_cnt < 0:
            raise InputValidationError("Cannot have negative inbox tasks counts")
        if completed_inbox_tasks_cnt < 0:
            raise InputValidationError("Cannot have negative completed inbox tasks")
        if completed_inbox_tasks_cnt > all_inbox_tasks_cnt:
            raise InputValidationError(
                "Cannot have more done inbox tasks than all inbox taks"
            )
        return ProjectStats._create(
            ctx,
            project=ParentLink(project_ref_id),
            all_inbox_tasks_cnt=all_inbox_tasks_cnt,
            completed_inbox_tasks_cnt=completed_inbox_tasks_cnt,
        )

    @property
    def raw_key(self) -> object:
        """The raw key of the project stats."""
        return self.project.ref_id


class ProjectStatsRepository(RecordRepository[ProjectStats, EntityId], abc.ABC):
    """A repository of project stats."""

    @abc.abstractmethod
    async def mark_add_inbox_task(self, project_ref_id: EntityId) -> None:
        """Mark that a new inbox task has been added to the project."""

    @abc.abstractmethod
    async def mark_remove_inbox_task(
        self, project_ref_id: EntityId, is_completed: bool
    ) -> None:
        """Mark that an inbox task has been removed from the project."""

    @abc.abstractmethod
    async def mark_inbox_task_done(self, project_ref_id: EntityId) -> None:
        """Mark that an inbox task has been done on the project."""

    @abc.abstractmethod
    async def mark_inbox_task_undone(self, project_ref_id: EntityId) -> None:
        """Mark that an inbox task has been undone on the project."""
