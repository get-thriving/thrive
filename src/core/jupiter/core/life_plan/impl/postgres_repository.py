"""Implementation for aspects repo via PostgreSQL."""

from jupiter.core.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
)


class PostgresAspectRepository(PostgresLeafEntityRepository[Aspect], AspectRepository):
    """Postgres implementation of the aspect repository."""

    async def load_root_aspect(self, parent_ref_id: EntityId) -> Aspect:
        """Load the root aspect."""
        aspects = await self.find_all_generic(
            parent_ref_id=parent_ref_id,
            allow_archived=False,
            parent_aspect_ref_id=None,
        )

        if len(aspects) == 0:
            raise Exception("Root aspect not found.")

        return aspects[0]
