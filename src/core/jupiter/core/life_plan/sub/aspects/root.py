"""The aspect."""

import abc
from typing import TYPE_CHECKING

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.habits.root import Habit
from jupiter.core.life_plan.sub.aspects.name import AspectName
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
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

MAX_ASPECT_DEPTH_FROM_ROOT = 5

if TYPE_CHECKING:
    from jupiter.core.life_plan.root import LifePlan


@entity
class Aspect(LeafEntity):
    """The aspect."""

    life_plan: ParentLink["LifePlan"]
    parent_aspect_ref_id: EntityId | None
    name: AspectName
    order_of_child_aspects: list[EntityId]

    chapters = RefsMany(Chapter, aspect_ref_id=IsRefId())
    goals = RefsMany(Goal, aspect_ref_id=IsRefId())
    milestones = RefsMany(Milestone, aspect_ref_id=IsRefId())

    habits = RefsMany(Habit, aspect_ref_id=IsRefId())
    chores = RefsMany(Chore, aspect_ref_id=IsRefId())
    big_plans = RefsMany(BigPlan, aspect_ref_id=IsRefId())

    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.ASPECT, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.ASPECT, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_root_aspect(
        ctx: DomainContext,
        life_plan_ref_id: EntityId,
        name: AspectName,
    ) -> "Aspect":
        """Create a root aspect."""
        return Aspect._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            parent_aspect_ref_id=None,
            name=name,
            order_of_child_aspects=[],
        )

    @staticmethod
    @create_entity_action
    def new_aspect(
        ctx: DomainContext,
        life_plan_ref_id: EntityId,
        parent_aspect_ref_id: EntityId,
        name: AspectName,
    ) -> "Aspect":
        """Create a aspect."""
        return Aspect._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            parent_aspect_ref_id=parent_aspect_ref_id,
            name=name,
            order_of_child_aspects=[],
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[AspectName],
        parent_aspect_ref_id: UpdateAction[EntityId | None],
    ) -> "Aspect":
        """Change the aspect."""
        if self.is_root and parent_aspect_ref_id.should_change:
            raise Exception("Cannot change the parent of a root aspect.")
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            parent_aspect_ref_id=parent_aspect_ref_id.or_else(
                self.parent_aspect_ref_id
            ),
        )

    @update_entity_action
    def add_child_aspect(
        self,
        ctx: DomainContext,
        child_aspect_ref_id: EntityId,
    ) -> "Aspect":
        """Add a child aspect."""
        return self._new_version(
            ctx,
            order_of_child_aspects=[
                *self.order_of_child_aspects,
                child_aspect_ref_id,
            ],
        )

    @update_entity_action
    def remove_child_aspect(
        self,
        ctx: DomainContext,
        child_aspect_ref_id: EntityId,
    ) -> "Aspect":
        """Remove a child aspect."""
        return self._new_version(
            ctx,
            order_of_child_aspects=[
                child_ref_id
                for child_ref_id in self.order_of_child_aspects
                if child_ref_id != child_aspect_ref_id
            ],
        )

    @update_entity_action
    def reorder_child_aspects(
        self,
        ctx: DomainContext,
        new_order: list[EntityId],
    ) -> "Aspect":
        """Reorder child aspects."""
        return self._new_version(
            ctx,
            order_of_child_aspects=new_order,
        )

    @property
    def is_safe_to_archive(self) -> bool:
        """Return True if it is safe to archive the aspect."""
        return not self.is_root

    @property
    def is_root(self) -> bool:
        """Return True if this is a root aspect."""
        return self.parent_aspect_ref_id is None

    @property
    def surely_parent_aspect_ref_id(self) -> EntityId:
        """Return the parent ref id."""
        if self.parent_aspect_ref_id is None:
            raise Exception("This is a root aspect.")
        return self.parent_aspect_ref_id


class AspectRepository(LeafEntityRepository[Aspect], abc.ABC):
    """A repository of aspects."""

    @abc.abstractmethod
    async def load_root_aspect(self, parent_ref_id: EntityId) -> Aspect:
        """Load the root aspect."""
