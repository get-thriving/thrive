"""Persistent map of domain entities to CRM object ids."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, record
from jupiter.framework.storage.repository import RecordRepository

CRM_USER_ENTITY_TYPE = "User"
FIRST_CRM_REVISION = 1


@record("CRMDomain")
class CRMEntityIndexingRecord(Record):
    """One row in ``crm_entity_indexing_map``."""

    crm_domain: ParentLink
    entity_type: str
    entity_ref_id: EntityId
    object_id: str
    revision: int
    index_method_version: int

    @property
    def raw_key(self) -> object:
        """Stable composite key for this map row."""
        return (self.crm_domain.ref_id, self.entity_type, self.entity_ref_id)


class CRMEntityIndexingRecordRepository(
    RecordRepository[CRMEntityIndexingRecord, tuple[EntityId, str, EntityId]],
    abc.ABC,
):
    """Repository for :class:`CRMEntityIndexingRecord`."""

    @abc.abstractmethod
    async def find_all_for_crm_domain_entity_type(
        self, crm_domain_ref_id: EntityId, entity_type: str
    ) -> list[CRMEntityIndexingRecord]:
        """All map rows for a CRM domain and entity type string."""

    @abc.abstractmethod
    async def load_optional(
        self,
        crm_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> CRMEntityIndexingRecord | None:
        """Return the map row for one entity, if present."""

    @abc.abstractmethod
    async def upsert(self, record: CRMEntityIndexingRecord) -> None:
        """Insert or replace a row."""

    @abc.abstractmethod
    async def remove_all_for_crm_domain(self, crm_domain_ref_id: EntityId) -> None:
        """Remove every map row for a CRM domain (e.g. test teardown)."""
