"""A registry for concepts."""

import abc

from jupiter.framework.entity import Entity


class ConceptNotFoundError(Exception):
    """A concept was not found."""


class ConceptRegistry(abc.ABC):
    """A registry for concepts."""

    @abc.abstractmethod
    def get_entity_by_name(self, name: str) -> type[Entity]:
        """Get an entity class by its name, or raise ConceptNotFoundError."""
