"""A concept registry built by exploring module trees."""

import dataclasses
from types import ModuleType
from typing import Final, cast

from jupiter.framework.concept import Concept
from jupiter.framework.concepts.registry import ConceptNotFoundError, ConceptRegistry
from jupiter.framework.entity import (
    AboveGroundEntity,
    BranchEntity,
    ContainsLink,
    ContainsMany,
    CrownEntity,
    Entity,
    EntityLink,
    LeafEntity,
    LeafSupportEntity,
    OwnsLink,
    ParentLink,
    RootEntity,
    StubEntity,
    TrunkEntity,
)
from jupiter.framework.record import ContainsRecordLink, Record
from jupiter.framework.utils.utils import find_all_modules
from jupiter.framework.value import Value


class ModuleExplorerConceptRegistry(ConceptRegistry):
    """A registry for concepts constructed by exploring a module tree."""

    _concepts: Final[dict[str, type[Concept]]]
    _entities: Final[
        dict[str, type[RootEntity | StubEntity | TrunkEntity | CrownEntity]]
    ]
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

                if issubclass(obj, (RootEntity, StubEntity, TrunkEntity, CrownEntity)):
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

        registry._check_parent_type_names()
        registry._check_record_parent_type_names()
        registry._check_non_root_entities_reach_root()
        registry._check_non_root_records_reach_root()
        registry._check_entity_link_targets()
        registry._check_contains_hierarchy()
        registry._check_only_leaves_contain_records()
        registry._check_no_contains_cycles()
        registry._check_no_owns_cycles()

        return registry

    def _check_parent_type_names(self) -> None:
        """Verify that every AboveGroundEntity's parent_type_name refers to a registered entity."""
        for class_name, entity_cls in self._entities.items():
            if not issubclass(entity_cls, AboveGroundEntity):
                continue
            parent_name = entity_cls.parent_type_name()
            if parent_name not in self._entities:
                raise Exception(
                    f"Entity '{class_name}' declares parent type name "
                    f"'{parent_name}' which is not a registered entity"
                )

    def _check_non_root_entities_reach_root(self) -> None:
        """Verify every non-root entity reaches a RootEntity via parent_type_name."""
        for class_name, entity_cls in self._entities.items():
            if issubclass(entity_cls, RootEntity):
                continue
            visited: set[str] = set()
            current: type[Entity] = entity_cls
            while not issubclass(current, RootEntity):
                step_name = current.__name__
                if step_name in visited:
                    chain = " -> ".join([*visited, step_name])
                    raise Exception(
                        f"Entity '{class_name}' parent chain does not reach a root "
                        f"(cycle: {chain})"
                    )
                visited.add(step_name)
                parent_name = cast(type[AboveGroundEntity], current).parent_type_name()
                current = self._entities[parent_name]

    def _check_record_parent_type_names(self) -> None:
        """Verify that every record's parent_type_name refers to a registered type."""
        for class_name, record_cls in self._records.items():
            parent_name = record_cls.parent_type_name()
            try:
                self._get_entity_or_record_by_name(parent_name)
            except ConceptNotFoundError:
                raise Exception(
                    f"Record '{class_name}' declares parent type name "
                    f"'{parent_name}' which is not a registered entity or record"
                ) from None

    def _check_non_root_records_reach_root(self) -> None:
        """Verify every record reaches a RootEntity via parent_type_name (and entity parents)."""
        for class_name, record_cls in self._records.items():
            visited: set[str] = set()
            current: type[Entity | Record] = record_cls
            while not issubclass(current, RootEntity):
                step_name = current.__name__
                if step_name in visited:
                    chain = " -> ".join([*visited, step_name])
                    raise Exception(
                        f"Record '{class_name}' parent chain does not reach a root "
                        f"(cycle: {chain})"
                    )
                visited.add(step_name)
                if issubclass(current, Record):
                    current = self._get_entity_or_record_by_name(
                        current.parent_type_name()
                    )
                else:
                    parent_name = cast(
                        type[AboveGroundEntity], current
                    ).parent_type_name()
                    current = self._entities[parent_name]

    def _get_entity_or_record_by_name(self, name: str) -> type[Entity] | type[Record]:
        """Resolve a registered entity or record class by its short name."""
        if name in self._entities:
            return self._entities[name]
        if name in self._records:
            return self._records[name]
        raise ConceptNotFoundError(
            f"No entity or record with name '{name}' found in the registry"
        )

    def _check_entity_link_targets(self) -> None:
        """Verify that all EntityLink targets are registered and filter fields exist."""
        for class_name, entity_cls in self._entities.items():
            for attr_name, attr_value in entity_cls.__dict__.items():
                if not isinstance(attr_value, EntityLink):
                    continue
                target_cls = attr_value.the_type
                target_name = target_cls.__name__
                if target_name not in self._entities:
                    raise Exception(
                        f"Entity '{class_name}' has link '{attr_name}' "
                        f"targeting '{target_name}' which is not a "
                        f"registered entity"
                    )
                target_fields = {f.name for f in dataclasses.fields(target_cls)}
                parent_link_ref_id_fields = {
                    f.name + "_ref_id"
                    for f in dataclasses.fields(target_cls)
                    if f.type is ParentLink
                }
                valid_filter_names = target_fields | parent_link_ref_id_fields
                for filter_name in attr_value.filters:
                    if filter_name not in valid_filter_names:
                        raise Exception(
                            f"Entity '{class_name}' link '{attr_name}' "
                            f"filters by '{filter_name}' which does not "
                            f"exist on target entity '{target_name}'"
                        )

    def _check_contains_hierarchy(self) -> None:
        """Verify that Contains relationships obey the entity hierarchy rules.

        Rules:
        - Root can contain Trunk, Branch, Leaf with any cardinality.
        - Root can only contain Stub with ContainsOne/ContainsAtMostOne (not Many).
        - Stub can only contain Stub with ContainsOne/ContainsAtMostOne.
        - Trunk can contain Branch, Leaf with any cardinality.
        - Trunk can contain Trunk, Stub with ContainsOne/ContainsAtMostOne.
        - Branch can contain Leaf with any cardinality.
        - Branch can contain Branch, Stub with ContainsOne/ContainsAtMostOne.
        - Leaf can only contain Leaf with any cardinality.
        """
        for class_name, entity_cls in self._entities.items():
            for attr_name, attr_value in entity_cls.__dict__.items():
                if not isinstance(attr_value, ContainsLink):
                    continue
                child_cls = attr_value.the_type
                if not _is_allowed_contains(entity_cls, child_cls, attr_value):
                    parent_kind = _entity_kind_label(entity_cls)
                    child_kind = _entity_kind_label(child_cls)
                    link_kind = type(attr_value).__name__
                    raise Exception(
                        f"Entity '{class_name}' ({parent_kind}) cannot "
                        f"contain '{child_cls.__name__}' ({child_kind}) "
                        f"via {link_kind} on attribute '{attr_name}'"
                    )

    def _check_only_leaves_contain_records(self) -> None:
        """Verify that only Leaf entities (including LeafSupport) have record links."""
        for class_name, entity_cls in self._entities.items():
            if issubclass(entity_cls, (TrunkEntity, BranchEntity, LeafEntity)):
                continue
            for attr_name, attr_value in entity_cls.__dict__.items():
                if isinstance(attr_value, ContainsRecordLink):
                    entity_kind = _entity_kind_label(entity_cls)
                    raise Exception(
                        f"Entity '{class_name}' ({entity_kind}) has record "
                        f"link '{attr_name}' but only Leaf/Branch/LeafSupport entities can "
                        f"contain records"
                    )

    def _check_no_contains_cycles(self) -> None:
        """Verify there are no cycles in the Contains dependency graph."""
        graph: dict[str, list[str]] = {name: [] for name in self._entities}
        for class_name, entity_cls in self._entities.items():
            for attr_value in entity_cls.__dict__.values():
                if isinstance(attr_value, ContainsLink):
                    child_name = attr_value.the_type.__name__
                    if child_name in graph:
                        graph[class_name].append(child_name)
        cycle = _find_cycle(graph)
        if cycle is not None:
            raise Exception(
                f"Cycle detected in Contains relationships: " f"{' -> '.join(cycle)}"
            )

    def _check_no_owns_cycles(self) -> None:
        """Verify there are no cycles in the Owns dependency graph."""
        graph: dict[str, list[str]] = {name: [] for name in self._entities}
        for class_name, entity_cls in self._entities.items():
            for attr_value in entity_cls.__dict__.values():
                if isinstance(attr_value, OwnsLink):
                    child_name = attr_value.the_type.__name__
                    if child_name in graph:
                        graph[class_name].append(child_name)
        cycle = _find_cycle(graph)
        if cycle is not None:
            raise Exception(
                f"Cycle detected in Owns relationships: " f"{' -> '.join(cycle)}"
            )

    def get_entity_by_name(
        self, name: str
    ) -> type[RootEntity | StubEntity | TrunkEntity | CrownEntity]:
        """Get an entity class by its name, or raise ConceptNotFoundError."""
        if name not in self._entities:
            raise ConceptNotFoundError(
                f"No entity with name '{name}' found in the registry"
            )
        return self._entities[name]


def _entity_kind_label(cls: type[Entity]) -> str:
    """Return a human-readable label for the entity kind."""
    if issubclass(cls, RootEntity):
        return "Root"
    if issubclass(cls, StubEntity):
        return "Stub"
    if issubclass(cls, TrunkEntity):
        return "Trunk"
    if issubclass(cls, BranchEntity):
        return "Branch"
    if issubclass(cls, LeafSupportEntity):
        return "LeafSupport"
    if issubclass(cls, LeafEntity):
        return "Leaf"
    return "Unknown"


_MANY_OK = {ContainsMany}

_ALLOWED_CONTAINS: dict[str, dict[str, bool]] = {
    # parent_kind -> child_kind -> whether ContainsMany is allowed
    "Root": {
        "Trunk": True,
        "Branch": True,
        "Leaf": True,
        "LeafSupport": True,
        "Stub": False,
    },
    "Stub": {"Stub": False},
    "Trunk": {
        "Branch": True,
        "Leaf": True,
        "LeafSupport": True,
        "Trunk": False,
        "Stub": False,
    },
    "Branch": {"Leaf": True, "LeafSupport": True, "Branch": False, "Stub": False},
    "Leaf": {"Leaf": True, "LeafSupport": True},
    "LeafSupport": {"LeafSupport": True},
}


def _is_allowed_contains(
    parent_cls: type[Entity],
    child_cls: type[Entity],
    link: ContainsLink,  # type: ignore[type-arg]
) -> bool:
    """Check if a contains relationship is valid per the hierarchy rules."""
    parent_kind = _entity_kind_label(parent_cls)
    child_kind = _entity_kind_label(child_cls)

    allowed_children = _ALLOWED_CONTAINS.get(parent_kind)
    if allowed_children is None:
        return False

    many_allowed = allowed_children.get(child_kind)
    if many_allowed is None:
        return False

    if not many_allowed and isinstance(link, ContainsMany):
        return False

    return True


def _find_cycle(graph: dict[str, list[str]]) -> list[str] | None:
    """Find a cycle in a directed graph via DFS. Returns the cycle path or None."""
    white, gray, black = 0, 1, 2
    color: dict[str, int] = {node: white for node in graph}
    path: list[str] = []

    def dfs(node: str) -> list[str] | None:
        color[node] = gray
        path.append(node)
        for neighbor in graph[node]:
            if color[neighbor] == gray:
                idx = path.index(neighbor)
                return path[idx:] + [neighbor]
            if color[neighbor] == white:
                result = dfs(neighbor)
                if result is not None:
                    return result
        path.pop()
        color[node] = black
        return None

    for node in graph:
        if color[node] == white:
            result = dfs(node)
            if result is not None:
                return result
    return None
