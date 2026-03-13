"""Load settings for metrics use case."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.metrics.collection import MetricCollection
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MetricLoadSettingsArgs(UseCaseArgsBase):
    """MetricLoadSettings args."""


@use_case_result
class MetricLoadSettingsResult(UseCaseResultBase):
    """MetricLoadSettings results."""

    collection_aspect: Aspect


@readonly_use_case(WorkspaceFeature.METRICS, exclude_component=[AppCore.CLI])
class MetricLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        MetricLoadSettingsArgs, MetricLoadSettingsResult
    ],
):
    """The command for loading the settings around metrics."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricLoadSettingsArgs,
    ) -> MetricLoadSettingsResult:
        """Execute the command's action."""
        workspace = context.workspace

        metric_collection = await uow.get_for(MetricCollection).load_by_parent(
            workspace.ref_id,
        )
        collection_aspect = await uow.get_for(Aspect).load_by_id(
            metric_collection.collection_aspect_ref_id,
        )

        return MetricLoadSettingsResult(collection_aspect=collection_aspect)
