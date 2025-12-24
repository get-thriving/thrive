"""The project."""

import abc

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.habits.root import Habit
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.life_plan.sub.aspects.name import ProjectName
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    RefsMany,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class Project(LeafEntity):
    """The project."""

    life_plan: ParentLink
    parent_project_ref_id: EntityId | None
    name: ProjectName
    order_of_child_projects: list[EntityId]

    chapters = RefsMany(Chapter, project_ref_id=IsRefId())

    inbox_tasks = RefsMany(InboxTask, project_ref_id=IsRefId())
    habits = RefsMany(Habit, project_ref_id=IsRefId())
    chores = RefsMany(Chore, project_ref_id=IsRefId())
    big_plans = RefsMany(BigPlan, project_ref_id=IsRefId())

    note = OwnsAtMostOne(
        Note, domain=NoteDomain.PROJECT, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_root_project(
        ctx: MutationContext,
        life_plan_ref_id: EntityId,
        name: ProjectName,
    ) -> "Project":
        """Create a root project."""
        return Project._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            parent_project_ref_id=None,
            name=name,
            order_of_child_projects=[],
        )

    @staticmethod
    @create_entity_action
    def new_project(
        ctx: MutationContext,
        life_plan_ref_id: EntityId,
        parent_project_ref_id: EntityId,
        name: ProjectName,
    ) -> "Project":
        """Create a project."""
        return Project._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            parent_project_ref_id=parent_project_ref_id,
            name=name,
            order_of_child_projects=[],
        )

    @update_entity_action
    def change_parent(
        self,
        ctx: MutationContext,
        parent_project_ref_id: EntityId,
    ) -> "Project":
        """Change the parent project of the project."""
        if self.is_root:
            raise Exception("Cannot change the parent of a root project.")
        return self._new_version(
            ctx,
            parent_project_ref_id=parent_project_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[ProjectName],
    ) -> "Project":
        """Change the project."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )

    @update_entity_action
    def add_child_project(
        self,
        ctx: MutationContext,
        child_project_ref_id: EntityId,
    ) -> "Project":
        """Add a child project."""
        return self._new_version(
            ctx,
            order_of_child_projects=[
                *self.order_of_child_projects,
                child_project_ref_id,
            ],
        )

    @update_entity_action
    def remove_child_project(
        self,
        ctx: MutationContext,
        child_project_ref_id: EntityId,
    ) -> "Project":
        """Remove a child project."""
        return self._new_version(
            ctx,
            order_of_child_projects=[
                child_ref_id
                for child_ref_id in self.order_of_child_projects
                if child_ref_id != child_project_ref_id
            ],
        )

    @update_entity_action
    def reorder_child_projects(
        self,
        ctx: MutationContext,
        new_order: list[EntityId],
    ) -> "Project":
        """Reorder child projects."""
        return self._new_version(
            ctx,
            order_of_child_projects=new_order,
        )

    @property
    def is_safe_to_archive(self) -> bool:
        """Return True if it is safe to archive the project."""
        return not self.is_root

    @property
    def is_root(self) -> bool:
        """Return True if this is a root project."""
        return self.parent_project_ref_id is None

    @property
    def surely_parent_project_ref_id(self) -> EntityId:
        """Return the parent ref id."""
        if self.parent_project_ref_id is None:
            raise Exception("This is a root project.")
        return self.parent_project_ref_id


class ProjectRepository(LeafEntityRepository[Project], abc.ABC):
    """A repository of projects."""

    @abc.abstractmethod
    async def load_root_project(self, parent_ref_id: EntityId) -> Project:
        """Load the root project."""
