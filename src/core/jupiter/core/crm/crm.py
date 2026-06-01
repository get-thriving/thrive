"""A representation of the CRM domain."""

from abc import ABC, abstractmethod
from dataclasses import dataclass

from jupiter.core.crm.entity_indexing_record import CRMEntityIndexingRecord
from jupiter.core.env import Env
from jupiter.core.instance import Instance
from jupiter.core.universe import Universe
from jupiter.core.users.root import User
from jupiter.framework.value import CompositeValue, value


@dataclass(frozen=True)
class CrmDeploymentContext:
    """Universe, environment, and instance for the running Thrive deployment.

    CRM implementations should persist these via ``str()`` on each value
    (e.g. Wix extended-field items use keys like ``custom.<field-key>``).
    """

    universe: Universe
    env: Env
    instance: Instance

    def as_strings(self) -> dict[str, str]:
        """Deployment metadata as plain strings for logging and CRM payloads."""
        return {
            "universe": str(self.universe),
            "env": str(self.env),
            "instance": str(self.instance),
        }


@value
class CrmUpsertResult(CompositeValue):
    """Result of upserting a user in an external CRM."""

    object_id: str
    revision: int


class CRM(ABC):
    """A representation of the CRM domain."""

    @abstractmethod
    async def upsert_as_user(
        self,
        user: User,
        *,
        deployment: CrmDeploymentContext,
        indexing_record: CRMEntityIndexingRecord | None = None,
    ) -> CrmUpsertResult:
        """Upsert a user in the CRM.

        When ``indexing_record`` is provided, implementations should update the
        existing CRM record. Otherwise they should create one.
        """

    @abstractmethod
    async def remove_user(
        self,
        *,
        indexing_record: CRMEntityIndexingRecord,
    ) -> None:
        """Remove a user from the CRM using the indexing map row."""

    @abstractmethod
    async def close(self) -> None:
        """Release CRM resources."""
