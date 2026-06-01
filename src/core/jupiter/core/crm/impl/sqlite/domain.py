"""SQLite repository for the CRM domain."""

from jupiter.core.crm.root import (
    THE_CRM_DOMAIN_REF_ID,
    CRMDomain,
    CRMDomainNotFoundError,
    CRMDomainRepository,
)
from jupiter.framework.storage.sqlite.repository import SqliteRootEntityRepository
from sqlalchemy import select


class SqliteCRMDomainRepository(
    SqliteRootEntityRepository[CRMDomain], CRMDomainRepository
):
    """SQLite implementation of the CRM domain repository."""

    async def load_the_crm_domain(self) -> CRMDomain:
        """Load the singleton CRM domain."""
        query_stmt = select(self._table).where(
            self._table.c.ref_id == THE_CRM_DOMAIN_REF_ID.as_int(),
            self._table.c.archived.is_(False),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise CRMDomainNotFoundError("CRM domain does not exist")
        return self._row_to_entity(result)
