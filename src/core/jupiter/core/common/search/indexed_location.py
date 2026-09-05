"""Location fields denormalized into search index documents."""

from collections.abc import Iterable

from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.value import CompositeValue, value


@value
class IndexedLocation(CompositeValue):
    """Searchable location properties plus location ref ids for filtering."""

    name: str
    address: str
    country: str
    gps: str
    ref_ids: list[EntityId]

    @staticmethod
    def from_locations(locations: list[Location]) -> "IndexedLocation":
        """Flatten linked locations (or their absence) into search-index fields."""
        if not locations:
            return IndexedLocation(name="", address="", country="", gps="", ref_ids=[])
        return IndexedLocation(
            name=_join_nonempty(str(location.name) for location in locations),
            address=_join_nonempty(
                str(location.address_line)
                for location in locations
                if location.address_line is not None
            ),
            country=_join_nonempty(
                str(location.country)
                for location in locations
                if location.country is not None
            ),
            gps=_join_nonempty(
                str(location.gps) for location in locations if location.gps is not None
            ),
            ref_ids=[location.ref_id for location in locations],
        )


def _join_nonempty(parts: Iterable[str]) -> str:
    return " ".join(part for part in parts if part)
