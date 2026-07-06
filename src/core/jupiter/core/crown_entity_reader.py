"""Readers for loading crown entities with or without ACL enforcement."""

from typing import Protocol, TypeVar

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.sub.status.root import AccessStatusRepository
from jupiter.core.common.access.sub.status.service.load_for_acl import LoadForAclService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import DomainUnitOfWork

_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class CrownEntityReader(Protocol):
    """Load crown entities, optionally enforcing user access control."""

    async def load_entity(
        self,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        *,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Load a single crown entity."""
        ...

    async def find_all_entities(
        self,
        entity_type: type[_CrownEntityT],
        ref_ids: list[EntityId],
        *,
        allow_archived: bool = False,
    ) -> list[_CrownEntityT]:
        """Load crown entities by ref id, omitting any the reader cannot access."""
        ...

    async def check_all_entities(
        self,
        entity_type: type[_CrownEntityT],
        ref_ids: list[EntityId],
        *,
        allow_archived: bool = False,
    ) -> list[EntityId]:
        """Return ref ids the reader can access, preserving input order."""
        ...

    async def retain_accessible_entities(
        self,
        entity_type: type[_CrownEntityT],
        entities: list[_CrownEntityT],
        *,
        allow_archived: bool = False,
    ) -> list[_CrownEntityT]:
        """Return the subset of entities the reader can access, preserving input order."""
        ...


class AclCrownEntityReader:
    """Load crown entities for a logged-in user, enforcing reader access."""

    def __init__(self, uow: DomainUnitOfWork, user_id: EntityId) -> None:
        """Construct a reader bound to a unit of work and user."""
        self._uow = uow
        self._user_id = user_id

    async def load_entity(
        self,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        *,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Load a crown entity for the current user, enforcing reader access."""
        return await LoadForAclService().do_it(
            self._uow,
            entity_type,
            ref_id,
            self._user_id,
            AccessLevel.READER,
            allow_archived=allow_archived,
        )

    async def check_all_entities(
        self,
        entity_type: type[_CrownEntityT],
        ref_ids: list[EntityId],
        *,
        allow_archived: bool = False,
    ) -> list[EntityId]:
        """Return ref ids the user can read, preserving input order."""
        if not ref_ids:
            return []

        entities = [EntityLink.std(entity_type.__name__, ref_id) for ref_id in ref_ids]
        statuses = await self._uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(
            entities, self._user_id, allow_archived=allow_archived
        )
        accessible_ref_ids = {
            status.entity.ref_id
            for status in statuses
            if status.access_level.allows(AccessLevel.READER)
        }
        return [ref_id for ref_id in ref_ids if ref_id in accessible_ref_ids]

    async def find_all_entities(
        self,
        entity_type: type[_CrownEntityT],
        ref_ids: list[EntityId],
        *,
        allow_archived: bool = False,
    ) -> list[_CrownEntityT]:
        """Find crown entities for the current user, enforcing reader access."""
        filtered_ref_ids = await self.check_all_entities(
            entity_type, ref_ids, allow_archived=allow_archived
        )
        if not filtered_ref_ids:
            return []

        return await self._uow.get_for(entity_type).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            ref_id=filtered_ref_ids,
        )

    async def retain_accessible_entities(
        self,
        entity_type: type[_CrownEntityT],
        entities: list[_CrownEntityT],
        *,
        allow_archived: bool = False,
    ) -> list[_CrownEntityT]:
        """Return the subset of entities the reader can access, preserving input order."""
        if not entities:
            return []

        accessible_ref_ids = set(
            await self.check_all_entities(
                entity_type,
                [entity.ref_id for entity in entities],
                allow_archived=allow_archived,
            )
        )
        return [entity for entity in entities if entity.ref_id in accessible_ref_ids]


class UnrestrictedCrownEntityReader:
    """Load crown entities directly from storage, without ACL checks."""

    def __init__(self, uow: DomainUnitOfWork) -> None:
        """Construct a reader bound to a unit of work."""
        self._uow = uow

    async def load_entity(
        self,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        *,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Load a crown entity without ACL checks."""
        return await self._uow.get_for(entity_type).load_by_id(
            ref_id, allow_archived=allow_archived
        )

    async def check_all_entities(
        self,
        entity_type: type[_CrownEntityT],
        ref_ids: list[EntityId],
        *,
        allow_archived: bool = False,
    ) -> list[EntityId]:
        """Return all ref ids, preserving input order."""
        return list(ref_ids)

    async def find_all_entities(
        self,
        entity_type: type[_CrownEntityT],
        ref_ids: list[EntityId],
        *,
        allow_archived: bool = False,
    ) -> list[_CrownEntityT]:
        """Find crown entities by ref id without ACL checks."""
        if not ref_ids:
            return []

        return await self._uow.get_for(entity_type).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            ref_id=ref_ids,
        )

    async def retain_accessible_entities(
        self,
        entity_type: type[_CrownEntityT],
        entities: list[_CrownEntityT],
        *,
        allow_archived: bool = False,
    ) -> list[_CrownEntityT]:
        """Return the subset of entities the reader can access, preserving input order."""
        if not entities:
            return []

        accessible_ref_ids = set(
            await self.check_all_entities(
                entity_type,
                [entity.ref_id for entity in entities],
                allow_archived=allow_archived,
            )
        )
        return [entity for entity in entities if entity.ref_id in accessible_ref_ids]
