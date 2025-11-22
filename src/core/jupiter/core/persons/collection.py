"""The person collection."""

from jupiter.core.persons.root import Person
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


@entity
class PersonCollection(TrunkEntity):
    """The personal relationship database."""

    workspace: ParentLink
    catch_up_project_ref_id: EntityId

    persons = ContainsMany(Person, person_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_person_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
        catch_up_project_ref_id: EntityId,
    ) -> "PersonCollection":
        """Create a new personal database."""
        return PersonCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            catch_up_project_ref_id=catch_up_project_ref_id,
        )

    @update_entity_action
    def change_catch_up_project(
        self,
        ctx: MutationContext,
        catch_up_project_ref_id: EntityId,
    ) -> "PersonCollection":
        """Change the catch up project."""
        return self._new_version(
            ctx,
            catch_up_project_ref_id=catch_up_project_ref_id,
        )
