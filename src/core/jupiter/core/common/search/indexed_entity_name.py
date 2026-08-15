"""Display name material used in search index rows."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.entity import AboveGroundEntity, CrownEntity, StubEntity


def indexed_entity_name(entity: AboveGroundEntity) -> EntityName:
    """Text stored in the search index ``name`` column / Algolia ``name`` field.

    Crown entities use their user-facing :attr:`~CrownEntity.name`. Stub entities
    have no crown name; we use the Python class name so rows remain searchable
    and snippets stay well-defined.
    """
    if isinstance(entity, CrownEntity):
        return entity.name
    if isinstance(entity, StubEntity):
        return EntityName(entity.__class__.__name__)
    raise TypeError(
        f"Search indexing expected CrownEntity or StubEntity, got {type(entity).__name__}",
    )
