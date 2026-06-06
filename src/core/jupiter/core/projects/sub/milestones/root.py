"""A milestone for a project."""

import abc

from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


class ProjectMilestoneAlreadyExistsForDateError(EntityAlreadyExistsError):
    """A project milestone already exists for the given date."""


@entity("Project")
class ProjectMilestone(LeafSupportEntity):
    """A milestone for tracking progress of a project."""

    project: ParentLink
    date: ADate
    name: EntityName

    @staticmethod
    @create_entity_action
    def new_project_milestone(
        ctx: DomainContext,
        project_ref_id: EntityId,
        date: ADate,
        name: EntityName,
    ) -> "ProjectMilestone":
        """Create a project milestone."""
        return ProjectMilestone._create(
            ctx,
            name=name,
            project=ParentLink(project_ref_id),
            date=date,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        date: UpdateAction[ADate],
        name: UpdateAction[EntityName],
    ) -> "ProjectMilestone":
        """Update the project milestone."""
        return self._new_version(
            ctx,
            date=date.or_else(self.date),
            name=name.or_else(self.name),
        )


class ProjectMilestoneRepository(LeafEntityRepository[ProjectMilestone], abc.ABC):
    """The repository for project milestones."""
