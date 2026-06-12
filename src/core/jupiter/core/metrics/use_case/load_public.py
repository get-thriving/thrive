"""Guest readonly use case for loading a published metric."""

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
from jupiter.core.metrics.service.load import (
    MetricLoadResult,
    MetricLoadService,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MetricLoadPublicArgs(UseCaseArgsBase):
    """MetricLoadPublic args."""

    external_id: PublishExternalId
    include_entry_tags_and_contacts: bool | None


class MetricLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[MetricLoadPublicArgs, MetricLoadResult]
):
    """Load a published metric by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: MetricLoadPublicArgs,
    ) -> MetricLoadResult:
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

            return await MetricLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                metric,
                allow_archived=False,
                allow_archived_entries=False,
                allow_archived_tags=False,
                include_entry_tags_and_contacts=(
                    args.include_entry_tags_and_contacts or True
                ),
                include_collection_tasks=False,
                include_publish_entity=False,
            )
