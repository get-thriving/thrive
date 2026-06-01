"""Background reconciliation between domain users and the CRM."""

import logging

from jupiter.core.app import AppComponent
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
)
from jupiter.core.crm.crm import CrmDeploymentContext
from jupiter.core.crm.entity_indexing_record import CRM_USER_ENTITY_TYPE
from jupiter.core.crm.root import CRMDomainRepository
from jupiter.core.crm.service.entity_index import (
    INDEX_METHOD_VERSION,
    CRMEntityIndexService,
)
from jupiter.core.users.root import User
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.use_case import EmptyContext
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class CrmBackfillDoAllArgs(UseCaseArgsBase):
    """Args for the CRM backfill job."""


class CrmBackfillDoAllUseCase(
    JupiterBackgroundMutationUseCase[CrmBackfillDoAllArgs, None]
):
    """Re-sync changed users and drop stale CRM map rows."""

    async def _execute(
        self,
        context: EmptyContext,
        args: CrmBackfillDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        _ = DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.CRM_BACKFILL,
                version=self._global_properties.version,
            ),
            TraceId.new(),
            self._time_provider.get_current_time(),
        )

        deployment = CrmDeploymentContext(
            universe=self._global_properties.universe,
            env=self._global_properties.env,
            instance=self._global_properties.instance,
        )
        index_service = CRMEntityIndexService(
            self._ports, self._time_provider, deployment
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            crm_domain = await uow.get(CRMDomainRepository).load_the_crm_domain()
            summaries = await uow.get_for(User).find_summary(allow_archived=False)

        async with self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow:
            map_rows = await iuow.crm_entity_indexing_record_repository.find_all_for_crm_domain_entity_type(
                crm_domain.ref_id,
                CRM_USER_ENTITY_TYPE,
            )

        by_id = {r.entity_ref_id: r for r in map_rows}
        summary_by_id = {s.ref_id: s for s in summaries}

        indexed = 0
        failed = 0
        for summary in summaries:
            row = by_id.get(summary.ref_id)
            if (
                row is None
                or summary.last_modified_time > row.last_modified_time
                or row.index_method_version < INDEX_METHOD_VERSION
            ):
                try:
                    object_id = await index_service.index(
                        crm_domain.ref_id,
                        summary.ref_id,
                    )
                except Exception:
                    LOGGER.exception(
                        "crm_backfill failed to sync User:%s",
                        summary.ref_id,
                    )
                    failed += 1
                    continue
                LOGGER.info(
                    "crm_backfill indexed User:%s => %s time=%s",
                    summary.ref_id,
                    object_id,
                    summary.last_modified_time.value,
                )
                indexed += 1

        removed = 0
        remove_failed = 0
        for row in map_rows:
            if row.entity_ref_id not in summary_by_id:
                try:
                    await index_service.remove(
                        crm_domain_ref_id=crm_domain.ref_id,
                        entity_ref_id=row.entity_ref_id,
                    )
                except Exception:
                    LOGGER.exception(
                        "crm_backfill failed to remove User:%s => %s",
                        row.entity_ref_id,
                        row.object_id,
                    )
                    remove_failed += 1
                    continue
                LOGGER.info(
                    "crm_backfill removed User:%s => %s time=%s",
                    row.entity_ref_id,
                    row.object_id,
                    row.last_modified_time.value,
                )
                removed += 1

        LOGGER.info(
            "crm_backfill finished users=%d map_rows=%d indexed=%d failed=%d "
            "removed=%d remove_failed=%d",
            len(summaries),
            len(map_rows),
            indexed,
            failed,
            removed,
            remove_failed,
        )
