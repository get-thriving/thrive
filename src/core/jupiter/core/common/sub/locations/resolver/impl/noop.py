"""The NoOp location resolver."""

import logging

from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.resolver.resolver import (
    LocationResolver,
    LocationResolverMatchesPage,
)

LOGGER = logging.getLogger(__name__)


class NoOpLocationResolver(LocationResolver):
    """A location resolver that never finds candidates."""

    async def resolve(
        self,
        query: SearchQuery,
        limit: SearchLimit,
    ) -> LocationResolverMatchesPage:
        """Return no candidates."""
        LOGGER.debug(
            "NoOp location resolver returning no candidates for query %r limit %s",
            str(query),
            limit,
        )
        return LocationResolverMatchesPage(candidates=[])
