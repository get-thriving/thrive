"""Change the workspace feature flags."""

from typing import cast

from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.framework_new.repository import (
    DomainUnitOfWork,
)
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class WorkspaceChangeFeatureFlagsArgs(UseCaseArgsBase):
    """WorkspaceChangeFeatureFlags args."""

    feature_flags: set[WorkspaceFeature]


@mutation_use_case()
class WorkspaceChangeFeatureFlagsUseCase(
    JupiterTransactionalLoggedInMutationUseCase[WorkspaceChangeFeatureFlagsArgs, None]
):
    """Usecase for changing the feature flags for the workspace."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: WorkspaceChangeFeatureFlagsArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        # TODO(horia141): params
        _, feature_flags_controls = infer_feature_flag_controls(
            cast(JupiterGlobalProperties, self._global_properties)
        )
        workspace_feature_flags = {}
        for feature_flag in WorkspaceFeature:
            workspace_feature_flags[feature_flag] = feature_flag in args.feature_flags

        workspace = workspace.change_feature_flags(
            context.domain_context,
            feature_flag_controls=feature_flags_controls,
            feature_flags=workspace_feature_flags,
        )
        await uow.get_for(Workspace).save(workspace)
