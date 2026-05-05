"""PostgreSQL variant — see `repository.py` for SQLite."""


from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
    UserWorkspaceLinkRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.storage.postgres.repository import (
    PostgresRootEntityRepository,
)
from sqlalchemy import (
    select,
)


class PostgresUserWorkspaceLinkRepository(
    PostgresRootEntityRepository[UserWorkspaceLink], UserWorkspaceLinkRepository
):
    """The PostgreSQL based user workspace links repository."""

    async def load_by_user(self, user_id: EntityId) -> UserWorkspaceLink:
        """Load the user workspace link for a particular user."""
        query_stmt = select(self._table).where(
            self._table.c.user_ref_id == user_id.as_int()
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"User workspace link for user with id {user_id} does not exist"
            )
        return self._row_to_entity(result)
