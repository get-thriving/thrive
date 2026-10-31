"""PostgreSQL repositories for the images domain."""

from jupiter.core.common.sub.images.root import (
    THE_IMAGE_DOMAIN_REF_ID,
    ImageDomain,
    ImageDomainNotFoundError,
    ImageDomainRepository,
)
from jupiter.framework.storage.postgres.repository import PostgresRootEntityRepository
from sqlalchemy import select


class PostgresImageDomainRepository(
    PostgresRootEntityRepository[ImageDomain], ImageDomainRepository
):
    """PostgreSQL implementation of the images domain repository."""

    async def load_the_image_domain(self) -> ImageDomain:
        """Load the singleton images domain."""
        query_stmt = select(self._table).where(
            self._table.c.ref_id == THE_IMAGE_DOMAIN_REF_ID.as_int(),
            self._table.c.archived.is_(False),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise ImageDomainNotFoundError("Images domain does not exist")
        return self._row_to_entity(result)
