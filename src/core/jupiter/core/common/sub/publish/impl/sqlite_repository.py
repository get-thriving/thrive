"""SQLite implementation of publish infra classes."""

from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityAlreadyExistsError,
    PublishEntityRepository,
)
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.storage.sqlite.repository import SqliteLeafEntityRepository
from sqlalchemy import MetaData, select
from sqlalchemy.ext.asyncio import AsyncConnection


class SqlitePublishEntityRepository(
    SqliteLeafEntityRepository[PublishEntity],
    PublishEntityRepository,
):
    """SQLite implementation of the publish entity repository."""

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
            already_exists_err_cls=PublishEntityAlreadyExistsError,
        )

    async def load_by_external_id(
        self,
        external_id: PublishExternalId,
        allow_archived: bool = False,
    ) -> PublishEntity:
        """Load a publish entity by its external id."""
        query_stmt = select(self._table).where(
            self._table.c.external_id == str(external_id)
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))

        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"Publish entity with external id {external_id} does not exist"
            )
        return self._row_to_entity(result)
