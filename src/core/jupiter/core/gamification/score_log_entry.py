"""A particular entry in the score log related to an task being completed."""

import abc
import random

from jupiter.core.projects.root import Project
from jupiter.core.projects.status import ProjectStatus
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.gamification.score_source import ScoreSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
)
from jupiter.framework.storage.repository import LeafEntityRepository


@entity("ScoreLog")
class ScoreLogEntry(LeafEntity):
    """A record of a win or loss in accomplishing a task."""

    score_log: ParentLink
    source: ScoreSource
    task_ref_id: EntityId
    difficulty: Difficulty | None
    success: bool
    has_lucky_puppy_bonus: bool | None
    score: int

    @staticmethod
    @create_entity_action
    def new_from_inbox_task(
        ctx: DomainContext,
        score_log_ref_id: EntityId,
        inbox_task: InboxTask,
    ) -> "ScoreLogEntry":
        """Create an entry from an inbox task."""
        if not inbox_task.status.is_completed:
            raise Exception(
                "Cannot create score logs for inbox tasks that are not complete!"
            )

        has_lucky_puppy_bonus = None
        if inbox_task.status == InboxTaskStatus.DONE:
            has_lucky_puppy_bonus = random.randint(0, 99) < 10  # nosec

        return ScoreLogEntry._create(
            ctx,
            name=EntityName(f"For InboxTask #{inbox_task.ref_id} '{inbox_task.name}'"),
            score_log=ParentLink(score_log_ref_id),
            source=ScoreSource.INBOX_TASK,
            task_ref_id=inbox_task.ref_id,
            difficulty=inbox_task.difficulty,
            success=inbox_task.status == InboxTaskStatus.DONE,
            has_lucky_puppy_bonus=has_lucky_puppy_bonus,
            score=ScoreLogEntry._compute_score_for_inbox_task(
                inbox_task, has_lucky_puppy_bonus
            ),
        )

    @staticmethod
    @create_entity_action
    def new_from_project(
        ctx: DomainContext,
        score_log_ref_id: EntityId,
        project: Project,
    ) -> "ScoreLogEntry":
        """Create an entry from an inbox task."""
        if not project.status.is_completed:
            raise Exception(
                "Cannot create score logs for projects that are not completed!e"
            )

        return ScoreLogEntry._create(
            ctx,
            name=EntityName(f"For Project #{project.ref_id} '{project.name}'"),
            score_log=ParentLink(score_log_ref_id),
            source=ScoreSource.PROJECT,
            task_ref_id=project.ref_id,
            difficulty=None,
            success=project.status == ProjectStatus.DONE,
            has_lucky_puppy_bonus=None,
            score=ScoreLogEntry._compute_score_for_project(project),
        )

    @staticmethod
    def _compute_score_for_inbox_task(
        inbox_task: InboxTask, has_lucky_puppy_bonus: bool | None
    ) -> int:
        lucky_puppy_modifier = 1 if has_lucky_puppy_bonus else 0
        is_key_modifier = 1 if inbox_task.is_key else 0
        if inbox_task.status == InboxTaskStatus.DONE:
            if inbox_task.difficulty == Difficulty.EASY:
                return 1 + lucky_puppy_modifier + is_key_modifier
            elif inbox_task.difficulty == Difficulty.MEDIUM:
                return 2 + lucky_puppy_modifier + is_key_modifier
            else:  # inbox_task.difficulty == Difficulty.HARD:
                return 5 + lucky_puppy_modifier + is_key_modifier
        else:  # inbox_task.status == InboxTaskStatus.NOT_DONE:
            if inbox_task.difficulty == Difficulty.EASY:
                return -1
            elif inbox_task.difficulty == Difficulty.MEDIUM:
                return -2
            else:  # inbox_task.difficulty == Difficulty.HARD:
                return -5

    @staticmethod
    def _compute_score_for_project(project: Project) -> int:
        if project.status == ProjectStatus.DONE:
            if project.difficulty == Difficulty.EASY:
                return 10 + (5 if project.is_key else 0)
            elif project.difficulty == Difficulty.MEDIUM:
                return 25 + (10 if project.is_key else 0)
            else:  # project.difficulty == Difficulty.HARD:
                return 50 + (25 if project.is_key else 0)
        else:  # project.status == ProjectStatus.NOT_DONE:
            if project.difficulty == Difficulty.EASY:
                return -10
            elif project.difficulty == Difficulty.MEDIUM:
                return -25
            else:  # project.difficulty == Difficulty.HARD:
                return -50


class ScoreLogEntryRepository(LeafEntityRepository[ScoreLogEntry], abc.ABC):
    """A repository of score log entries."""
