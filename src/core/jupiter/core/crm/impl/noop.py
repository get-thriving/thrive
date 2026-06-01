"""The NoOp implementation of the CRM."""

import logging

from jupiter.core.crm.crm import CRM, CrmDeploymentContext, CrmUpsertResult
from jupiter.core.crm.entity_indexing_record import (
    FIRST_CRM_REVISION,
    CRMEntityIndexingRecord,
)
from jupiter.core.users.root import User

LOGGER = logging.getLogger(__name__)


class NoOpCRM(CRM):
    """The NoOp implementation of the CRM."""

    def __init__(self, deployment: CrmDeploymentContext) -> None:
        """Constructor."""
        super().__init__()
        self._deployment = deployment

    async def upsert_as_user(
        self,
        user: User,
        *,
        deployment: CrmDeploymentContext,
        indexing_record: CRMEntityIndexingRecord | None = None,
    ) -> CrmUpsertResult:
        """Upsert a user in the CRM."""
        LOGGER.info(
            "Upserting user %s in the CRM deployment=%s indexing_record=%s",
            user.email_address,
            deployment.as_strings(),
            (
                {
                    "object_id": indexing_record.object_id,
                    "revision": indexing_record.revision,
                }
                if indexing_record is not None
                else None
            ),
        )
        revision = (
            indexing_record.revision
            if indexing_record is not None
            else FIRST_CRM_REVISION
        )
        return CrmUpsertResult(object_id=str(user.ref_id), revision=revision)

    async def remove_user(
        self,
        *,
        indexing_record: CRMEntityIndexingRecord,
    ) -> None:
        """Remove a user from the CRM."""
        LOGGER.info(
            "Removing user %s from the CRM (object_id=%s)",
            indexing_record.entity_ref_id,
            indexing_record.object_id,
        )

    async def close(self) -> None:
        """Release CRM resources."""
        LOGGER.info("Closing NoOp CRM")
