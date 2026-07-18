"""PostgreSQL repository for the access domain."""

from jupiter.core.common.access.root import (
    THE_ACCESS_DOMAIN_REF_ID,
    AccessDomain,
    AccessDomainNotFoundError,
    AccessDomainRepository,
)
from jupiter.framework.storage.postgres.repository import PostgresRootEntityRepository
from sqlalchemy import select


class PostgresAccessDomainRepository(
    PostgresRootEntityRepository[AccessDomain], AccessDomainRepository
):
    """PostgreSQL implementation of the access domain repository."""

    async def load_the_access_domain(self) -> AccessDomain:
        """Load the singleton access domain."""
        query_stmt = select(self._table).where(
            self._table.c.ref_id == THE_ACCESS_DOMAIN_REF_ID.as_int(),
            self._table.c.archived.is_(False),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise AccessDomainNotFoundError("Access domain does not exist")
        return self._row_to_entity(result)
