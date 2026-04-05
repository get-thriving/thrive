"""A concept registry built by exploring module trees."""

from types import ModuleType
from typing import Final

from jupiter.framework.concept import Concept
from jupiter.framework.concept.registry import ConceptNotFoundError, ConceptRegistry
from jupiter.framework.entity import Entity
from jupiter.framework.record import Record
from jupiter.framework.utils.utils import find_all_modules
from jupiter.framework.value import Value


class ModuleExplorerConceptRegistry(ConceptRegistry):
    """A registry for concepts constructed by exploring a module tree."""

    _concepts: Final[dict[str, type[Concept]]]
    _entities: Final[dict[str, type[Entity]]]
    _records: Final[dict[str, type[Record]]]
    _values: Final[dict[str, type[Value]]]

    def __init__(self) -> None:
        """Initialize the registry."""
        self._concepts = {}
        self._entities = {}
        self._records = {}
        self._values = {}

    @staticmethod
    def build_from_module_root(
        *module_roots: ModuleType,
    ) -> "ModuleExplorerConceptRegistry":
        """Build a registry from a module root by exploring all modules."""
        registry = ModuleExplorerConceptRegistry()

        for m in find_all_modules(*module_roots):
            for _name, obj in m.__dict__.items():
                if not isinstance(obj, type):
                    continue

                if not issubclass(obj, Concept):
                    continue

                if obj.__module__ != m.__name__:
                    continue

                class_name = obj.__name__

                if class_name in registry._concepts:
                    raise Exception(
                        f"Duplicate concept name '{class_name}': "
                        f"defined in both {registry._concepts[class_name].__module__} "
                        f"and {obj.__module__}"
                    )
                registry._concepts[class_name] = obj

                if issubclass(obj, Entity):
                    if class_name in registry._entities:
                        raise Exception(
                            f"Duplicate entity name '{class_name}': "
                            f"defined in both {registry._entities[class_name].__module__} "
                            f"and {obj.__module__}"
                        )
                    registry._entities[class_name] = obj
                elif issubclass(obj, Record):
                    if class_name in registry._records:
                        raise Exception(
                            f"Duplicate record name '{class_name}': "
                            f"defined in both {registry._records[class_name].__module__} "
                            f"and {obj.__module__}"
                        )
                    registry._records[class_name] = obj
                elif issubclass(obj, Value):
                    if class_name in registry._values:
                        raise Exception(
                            f"Duplicate value name '{class_name}': "
                            f"defined in both {registry._values[class_name].__module__} "
                            f"and {obj.__module__}"
                        )
                    registry._values[class_name] = obj

        return registry

    def get_entity_by_name(self, name: str) -> type[Entity]:
        """Get an entity class by its name, or raise ConceptNotFoundError."""
        if name not in self._entities:
            raise ConceptNotFoundError(
                f"No entity with name '{name}' found in the registry"
            )
        return self._entities[name]
