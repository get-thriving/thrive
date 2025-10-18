"""A 1:1 link between users and workspaces."""

import abc

from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.entity import RootEntity, create_entity_action, entity
from jupiter.framework_new.repository import RootEntityRepository


@entity
class UserWorkspaceLink(RootEntity):
    """A 1:1 link between a user and a workspace."""

    user_ref_id: EntityId
    workspace_ref_id: EntityId

    @staticmethod
    @create_entity_action
    def new_user_workspace_link(
        ctx: MutationContext,
        user_ref_id: EntityId,
        workspace_ref_id: EntityId,
    ) -> "UserWorkspaceLink":
        """Create a new user workspace link."""
        return UserWorkspaceLink._create(
            ctx, user_ref_id=user_ref_id, workspace_ref_id=workspace_ref_id
        )


class UserWorkspaceLinkRepository(RootEntityRepository[UserWorkspaceLink], abc.ABC):
    """A repository for user workspace links."""

    @abc.abstractmethod
    async def load_by_user(self, user_ref_id: EntityId) -> UserWorkspaceLink:
        """Load the user workspace link for a particular user."""
