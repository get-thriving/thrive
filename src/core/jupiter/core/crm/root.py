"""The CRM domain root entity."""

import abc

from jupiter.core.crm.entity_indexing_record import CRMEntityIndexingRecord
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsRefId,
    RootEntity,
    create_entity_action,
    entity,
)
from jupiter.framework.record import ContainsManyRecords
from jupiter.framework.storage.repository import (
    EntityNotFoundError,
    RootEntityRepository,
)

THE_CRM_DOMAIN_REF_ID = EntityId("1")


@entity
class CRMDomain(RootEntity):
    """The singleton CRM domain for application-wide CRM synchronisation."""

    entity_indexing_records = ContainsManyRecords(
        CRMEntityIndexingRecord, crm_domain_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_crm_domain(ctx: DomainContext) -> "CRMDomain":
        """Create the CRM domain singleton."""
        raise RuntimeError("CRMDomain singleton should never be created directly")


class CRMDomainNotFoundError(EntityNotFoundError):
    """Error raised when the CRM domain is not found."""


class CRMDomainRepository(RootEntityRepository[CRMDomain], abc.ABC):
    """Repository for the CRM domain singleton."""

    @abc.abstractmethod
    async def load_the_crm_domain(self) -> CRMDomain:
        """Load the singleton CRM domain."""
