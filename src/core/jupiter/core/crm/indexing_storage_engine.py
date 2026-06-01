"""Storage engine for CRM indexing persistence."""

import abc
from contextlib import AbstractAsyncContextManager

from jupiter.core.crm.entity_indexing_record import CRMEntityIndexingRecordRepository
from jupiter.framework.storage.repository import StorageEngine, UnitOfWork


class CRMIndexingUnitOfWork(UnitOfWork):
    """Unit of work for CRM indexing persistence."""

    @property
    @abc.abstractmethod
    def crm_entity_indexing_record_repository(
        self,
    ) -> CRMEntityIndexingRecordRepository:
        """The entity indexing map repository."""


class CRMIndexingStorageEngine(StorageEngine[CRMIndexingUnitOfWork]):
    """Engine exposing CRM indexing record repositories."""

    @abc.abstractmethod
    def get_unit_of_work(
        self,
    ) -> AbstractAsyncContextManager[CRMIndexingUnitOfWork]:
        """Build a unit of work."""
