"""The PostgreSQL repository for docs and directories."""

from jupiter.core.docs.sub.dir.root import Dir, DirRepository
from jupiter.core.docs.sub.doc.root import Doc, DocRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
)
from sqlalchemy import select


class PostgresDocRepository(PostgresLeafEntityRepository[Doc], DocRepository):
    """The PostgreSQL repository for docs."""

    async def create_if_not_exists(self, doc: Doc) -> tuple[Doc, bool]:
        """Create a doc if it doesn't exist."""
        query_stmt = select(self._table).where(
            self._table.c.idempotency_key == str(doc.idempotency_key)
        )
        result = await self._connection.execute(query_stmt)
        existing_doc = result.fetchone()
        if existing_doc:
            return self._row_to_entity(existing_doc), False
        return await super().create(doc), True

    async def find_all_for_parent_dir(
        self,
        *,
        doc_collection_ref_id: EntityId,
        parent_dir_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[Doc]:
        """Load all docs whose parent folder is the given directory."""
        return await self.find_all_generic(
            parent_ref_id=doc_collection_ref_id,
            allow_archived=allow_archived,
            parent_dir_ref_id=[parent_dir_ref_id],
        )


class PostgresDirRepository(PostgresLeafEntityRepository[Dir], DirRepository):
    """The PostgreSQL repository for directories."""

    async def load_root_dir(self, parent_ref_id: EntityId) -> Dir:
        """Load the root directory."""
        dirs = await self.find_all_generic(
            parent_ref_id=parent_ref_id,
            allow_archived=False,
            parent_dir_ref_id=None,
        )

        if len(dirs) == 0:
            raise Exception("Root directory not found.")

        return dirs[0]
