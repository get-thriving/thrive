"""A life plan."""

from jupiter.core.common.birth_year import BirthYear
from jupiter.core.common.birthday import Birthday
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity
class LifePlan(TrunkEntity):
    """A project collection."""

    workspace: ParentLink

    birthday: Birthday
    birth_year: BirthYear

    projects = ContainsMany(Project, life_plan_ref_id=IsRefId())
    chapters = ContainsMany(Chapter, life_plan_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_life_plan(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
        birthday: Birthday,
        birth_year: BirthYear,
    ) -> "LifePlan":
        """Create a life plan."""
        return LifePlan._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            birthday=birthday,
            birth_year=birth_year,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        birthday: UpdateAction[Birthday],
        birth_year: UpdateAction[BirthYear],
    ) -> "LifePlan":
        """Update a life plan."""
        final_birthday = birthday.or_else(self.birthday)
        final_birth_year = birth_year.or_else(self.birth_year)
        return self._new_version(
            ctx, birthday=final_birthday, birth_year=final_birth_year
        )
