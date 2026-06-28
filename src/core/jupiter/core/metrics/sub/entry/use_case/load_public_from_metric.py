"""Guest readonly use case for loading a metric entry via a published metric."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.metrics.sub.entry.service.load import (
    MetricEntryLoadResult,
    MetricEntryLoadService,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MetricEntryLoadPublicFromMetricArgs(UseCaseArgsBase):
    """MetricEntryLoadPublicFromMetric args."""

    external_id: PublishExternalId
    ref_id: EntityId


class MetricEntryLoadPublicFromMetricUseCase(
    JupiterGuestReadonlyUseCase[
        MetricEntryLoadPublicFromMetricArgs, MetricEntryLoadResult
    ]
):
    """Load a metric entry through a published metric."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: MetricEntryLoadPublicFromMetricArgs,
    ) -> MetricEntryLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.METRIC.value:
                raise InputValidationError(
                    "The publish entity does not refer to a metric."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            metric_collection = await uow.get_for(MetricCollection).load_by_parent(
                publish_domain.workspace.ref_id
            )
            metric = await uow.get_for(Metric).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if metric.parent_ref_id != metric_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace metric."
                )

            metric_entry = await uow.get_for(MetricEntry).load_by_id(
                args.ref_id,
                allow_archived=False,
            )
            if metric_entry.metric.ref_id != metric.ref_id:
                raise InputValidationError(
                    "The metric entry does not belong to the published metric."
                )

            return await MetricEntryLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                args.ref_id,
                allow_archived=False,
                include_publish_entity=False,
            )
