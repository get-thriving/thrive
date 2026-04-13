"""Framework level elements for storage."""

import abc
from collections.abc import Iterable
from contextlib import AbstractAsyncContextManager
from typing import Generic, TypeVar, overload

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    BranchEntity,
    CrownEntity,
    Entity,
    EntityLinkFilterCompiled,
    LeafEntity,
    RootEntity,
    StubEntity,
    TrunkEntity,
)
from jupiter.framework.record import Record
from jupiter.framework.value import EnumValue


class Repository:
    """A repository."""


_RecordT = TypeVar("_RecordT", bound=Record)
_RecordKeyT = TypeVar("_RecordKeyT")


class RecordAlreadyExistsError(Exception):
    """Error raised when a record already exists."""


class RecordNotFoundError(Exception):
    """Error raised when a record is not found."""


class RecordRepository(Repository, abc.ABC, Generic[_RecordT, _RecordKeyT]):
    """A repository for records."""

    @abc.abstractmethod
    async def create(self, record: _RecordT) -> _RecordT:
        """Create a record."""

    @abc.abstractmethod
    async def save(self, record: _RecordT) -> _RecordT:
        """Save a record."""

    @abc.abstractmethod
    async def remove(self, key: _RecordKeyT) -> None:
        """Hard remove a record - an irreversible operation."""

    @abc.abstractmethod
    async def load_by_key_optional(self, key: _RecordKeyT) -> _RecordT | None:
        """Load a record by it's unique key."""

    @abc.abstractmethod
    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[_RecordT]:
        """Find all records matching some criteria."""


class EntityAlreadyExistsError(Exception):
    """Error raised when an entity already exists."""


class EntityNotFoundError(Exception):
    """Error raised when an entity is not found."""


_EntityT = TypeVar("_EntityT", bound=Entity)
_ArchivalReasonT = TypeVar("_ArchivalReasonT", bound=EnumValue)


class EntityRepository(Repository, abc.ABC, Generic[_EntityT]):
    """A repository for entities."""

    @abc.abstractmethod
    async def create(self, entity: _EntityT) -> _EntityT:
        """Create an entity."""

    @abc.abstractmethod
    async def save(self, entity: _EntityT) -> _EntityT:
        """Save an entity."""

    @abc.abstractmethod
    async def remove(self, ctx: DomainContext, ref_id: EntityId) -> _EntityT:
        """Hard remove an entity - an irreversible operation."""

    @abc.abstractmethod
    async def load_by_id(
        self,
        ref_id: EntityId,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
    ) -> _EntityT:
        """Loads the root entity."""

    async def load_optional_by_id(
        self,
        ref_id: EntityId,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
    ) -> _EntityT | None:
        """Loads the entity but returns null if there isn't one."""
        try:
            return await self.load_by_id(ref_id, allow_archived)
        except EntityNotFoundError:
            return None


_RootEntityT = TypeVar("_RootEntityT", bound=RootEntity)


class RootEntityRepository(EntityRepository[_RootEntityT], abc.ABC):
    """A repository for root entities."""

    @abc.abstractmethod
    async def find_all(
        self,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[_RootEntityT]:
        """Find all root entities matching some criteria."""


class TrunkEntityAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a trunk entity already exists."""


class TrunkEntityNotFoundError(EntityNotFoundError):
    """Error raised when a trunk entity is not found."""


_TrunkEntityT = TypeVar("_TrunkEntityT", bound=TrunkEntity)


class TrunkEntityRepository(EntityRepository[_TrunkEntityT], abc.ABC):
    """A repository for trunk entities."""

    @abc.abstractmethod
    async def load_by_parent(self, parent_ref_id: EntityId) -> _TrunkEntityT:
        """Retrieve a trunk by its owning parent id."""

    @abc.abstractmethod
    async def remove_by_parent(
        self, ctx: DomainContext, parent_ref_id: EntityId
    ) -> _TrunkEntityT:
        """Remove a trunk by its owning parent id."""


class StubEntityAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a stub entity with the given key already exists."""


class StubEntityNotFoundError(EntityNotFoundError):
    """Error raised when a stub entity is not found."""


_StubEntityT = TypeVar("_StubEntityT", bound=StubEntity)


class StubEntityRepository(EntityRepository[_StubEntityT], abc.ABC):
    """A repository for stub entities."""

    @abc.abstractmethod
    async def load_by_parent(self, parent_ref_id: EntityId) -> _StubEntityT:
        """Retrieve a stub by its owning parent id."""

    @abc.abstractmethod
    async def remove_by_parent(
        self, ctx: DomainContext, parent_ref_id: EntityId
    ) -> _StubEntityT:
        """Remove a stub by its owning parent id."""


_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class CrownEntityRepository(EntityRepository[_CrownEntityT], abc.ABC):
    """A repository for crown entities."""

    @abc.abstractmethod
    async def find_all(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[_CrownEntityT]:
        """Find all crowns matching some criteria."""

    @abc.abstractmethod
    async def find_all_generic(
        self,
        *,
        parent_ref_id: EntityId | None = None,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        **kwargs: EntityLinkFilterCompiled,
    ) -> list[_CrownEntityT]:
        """Find all crowns with generic filters."""


_BranchEntityT = TypeVar("_BranchEntityT", bound=BranchEntity)


class BranchEntityRepository(
    CrownEntityRepository[_BranchEntityT], abc.ABC, Generic[_BranchEntityT]
):
    """A repository for branch entities."""


_LeafEntityT = TypeVar("_LeafEntityT", bound=LeafEntity)


class LeafEntityRepository(
    CrownEntityRepository[_LeafEntityT], abc.ABC, Generic[_LeafEntityT]
):
    """A repository for leaf entities."""


class UnitOfWork:
    """A unit of work from an engine."""


_UnitOfWorkT = TypeVar("_UnitOfWorkT", bound=UnitOfWork)


class StorageEngine(abc.ABC, Generic[_UnitOfWorkT]):
    """A storage engine that can produce a unit of work."""

    @abc.abstractmethod
    def get_unit_of_work(self) -> AbstractAsyncContextManager[_UnitOfWorkT]:
        """Build a unit of work."""


_RepositoryT = TypeVar("_RepositoryT", bound=Repository)


class DomainUnitOfWork(UnitOfWork):
    """A transactional unit of work for domain objects."""

    @abc.abstractmethod
    def get(self, repository: type[_RepositoryT]) -> _RepositoryT:
        """Retrieve a repository."""

    @overload
    @abc.abstractmethod
    def get_for(
        self, entity_type: type[_RootEntityT]
    ) -> RootEntityRepository[_RootEntityT]: ...

    @overload
    @abc.abstractmethod
    def get_for(
        self, entity_type: type[_StubEntityT]
    ) -> StubEntityRepository[_StubEntityT]: ...

    @overload
    @abc.abstractmethod
    def get_for(
        self, entity_type: type[_TrunkEntityT]
    ) -> TrunkEntityRepository[_TrunkEntityT]: ...

    @overload
    @abc.abstractmethod
    def get_for(
        self, entity_type: type[_CrownEntityT]
    ) -> CrownEntityRepository[_CrownEntityT]: ...

    @abc.abstractmethod
    def get_for(
        self,
        entity_type: (
            type[_RootEntityT]
            | type[_StubEntityT]
            | type[_TrunkEntityT]
            | type[_CrownEntityT]
        ),
    ) -> (
        RootEntityRepository[_RootEntityT]
        | StubEntityRepository[_StubEntityT]
        | TrunkEntityRepository[_TrunkEntityT]
        | CrownEntityRepository[_CrownEntityT]
    ):
        """Retrieve a repository for a specific entity type."""

    @abc.abstractmethod
    def get_for_record(
        self, record_type: type[_RecordT]
    ) -> RecordRepository[_RecordT, object]:
        """Retrieve a repository for a specific record type."""


class DomainStorageEngine(StorageEngine[DomainUnitOfWork], abc.ABC):
    """A storage engine for the domain form."""

    @abc.abstractmethod
    def get_unit_of_work(self) -> AbstractAsyncContextManager[DomainUnitOfWork]:
        """Build a unit of work."""
