"""Sync a user to the CRM backend and mirror state in the indexing map."""

from typing import Final, Protocol

from jupiter.core.crm.crm import CRM, CrmDeploymentContext
from jupiter.core.crm.entity_indexing_record import (
    CRM_USER_ENTITY_TYPE,
    CRMEntityIndexingRecord,
)
from jupiter.core.crm.indexing_storage_engine import CRMIndexingStorageEngine
from jupiter.core.crm.root import CRMDomainRepository
from jupiter.core.users.root import User
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import ParentLink
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.time_provider import TimeProvider

INDEX_METHOD_VERSION: Final[int] = 7


class SupportsCRMEntityIndexing(Protocol):
    """Subset of app ports required for CRM user sync."""

    @property
    def domain_storage_engine(self) -> DomainStorageEngine:
        """The domain storage engine."""
        ...

    @property
    def crm(self) -> CRM:
        """The CRM integration."""
        ...

    @property
    def crm_indexing_storage_engine(self) -> CRMIndexingStorageEngine:
        """The CRM indexing storage engine."""
        ...


class CRMEntityIndexService:
    """Loads domain users, updates the CRM, and mirrors state in the map."""

    _ports: Final[SupportsCRMEntityIndexing]
    _time_provider: Final[TimeProvider]
    _deployment: Final[CrmDeploymentContext]

    def __init__(
        self,
        ports: SupportsCRMEntityIndexing,
        time_provider: TimeProvider,
        deployment: CrmDeploymentContext,
    ) -> None:
        """Constructor."""
        self._ports = ports
        self._time_provider = time_provider
        self._deployment = deployment

    async def index(
        self,
        crm_domain_ref_id: EntityId,
        entity_ref_id: EntityId,
    ) -> str:
        """Load the user, upsert in CRM, and persist the indexing map row."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            crm_domain = await uow.get(CRMDomainRepository).load_the_crm_domain()
            if crm_domain.ref_id != crm_domain_ref_id:
                raise ValueError(
                    f"CRM domain {crm_domain_ref_id} is not the singleton domain"
                )
            user = await uow.get_for(User).load_by_id(
                entity_ref_id, allow_archived=True
            )

        async with self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow:
            map_row = await iuow.crm_entity_indexing_record_repository.load_optional(
                crm_domain_ref_id, CRM_USER_ENTITY_TYPE, entity_ref_id
            )

        crm_result = await self._ports.crm.upsert_as_user(
            user,
            deployment=self._deployment,
            indexing_record=map_row,
        )
        indexed_at = self._time_provider.get_current_time()
        async with self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow:
            await iuow.crm_entity_indexing_record_repository.upsert(
                CRMEntityIndexingRecord(
                    created_time=(
                        map_row.created_time if map_row is not None else indexed_at
                    ),
                    last_modified_time=indexed_at,
                    crm_domain=ParentLink(crm_domain_ref_id),
                    entity_type=CRM_USER_ENTITY_TYPE,
                    entity_ref_id=user.ref_id,
                    object_id=crm_result.object_id,
                    revision=crm_result.revision,
                    index_method_version=INDEX_METHOD_VERSION,
                )
            )
        return crm_result.object_id

    async def remove(
        self,
        *,
        crm_domain_ref_id: EntityId,
        entity_ref_id: EntityId,
    ) -> None:
        """Remove from the CRM and drop the map row (domain row may already be gone)."""
        async with self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow:
            map_row = await iuow.crm_entity_indexing_record_repository.load_optional(
                crm_domain_ref_id, CRM_USER_ENTITY_TYPE, entity_ref_id
            )
        if map_row is None:
            return
        await self._ports.crm.remove_user(indexing_record=map_row)
        async with self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow:
            await iuow.crm_entity_indexing_record_repository.remove(
                (
                    crm_domain_ref_id,
                    map_row.entity_type,
                    map_row.entity_ref_id,
                )
            )
