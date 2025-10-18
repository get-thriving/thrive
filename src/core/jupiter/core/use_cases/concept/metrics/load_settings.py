"""Load settings for metrics use case."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.metrics.metric_collection import MetricCollection
from jupiter.core.domain.concept.projects.project import Project
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
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

    collection_project: Project


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
        collection_project = await uow.get_for(Project).load_by_id(
            metric_collection.collection_project_ref_id,
        )

        return MetricLoadSettingsResult(collection_project=collection_project)
