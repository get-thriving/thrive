"""The SQLite based Workspace repository."""

from jupiter.core.domain.concept.workspaces.workspace import (
    Workspace,
    WorkspaceNotFoundError,
    WorkspaceRepository,
)
from jupiter.core.impl.repository.sqlite.infra.repository import (
    SqliteRootEntityRepository,
)
from jupiter.framework_new.realm import RealmCodecRegistry
from sqlalchemy import (
    MetaData,
)
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteWorkspaceRepository(
    SqliteRootEntityRepository[Workspace], WorkspaceRepository
):
    """A repository for Workspaces."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            not_found_err_cls=WorkspaceNotFoundError,
        )
