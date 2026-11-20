"""Display name material used in search index rows."""

from collections.abc import Iterable

from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.entity import AboveGroundEntity, CrownEntity, StubEntity


def indexed_entity_name(
    entity: AboveGroundEntity, contacts: Iterable[Contact] = ()
) -> EntityName:
    """Text stored in the search index ``name`` column / Algolia ``name`` field.

    Crown entities use their user-facing :attr:`~CrownEntity.name`. Stub entities
    have no crown name; we use the Python class name so rows remain searchable
    and snippets stay well-defined.

    A person has no meaningful name of its own (it is a fixed placeholder); the
    name people know it by is the name of its linked contact, so that is what we
    index when there is one.
    """
    if isinstance(entity, CrownEntity):
        if NamedEntityTag.from_entity(entity) == NamedEntityTag.PERSON:
            contact_names = [c.name.the_name for c in contacts]
            if len(contact_names) > 0:
                return EntityName(" ".join(contact_names))
        return entity.name
    if isinstance(entity, StubEntity):
        return EntityName(entity.__class__.__name__)
    raise TypeError(
        f"Search indexing expected CrownEntity or StubEntity, got {type(entity).__name__}",
    )
