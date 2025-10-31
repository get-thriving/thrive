"""Set a particular feature in the workspace."""

from typing import cast

from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.env import Env
from jupiter.core.features import WorkspaceFeature
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class WorkspaceSetFeatureArgs(UseCaseArgsBase):
    """Arguments for setting a feature in the workspace."""

    feature: WorkspaceFeature
    value: bool


@mutation_use_case(exclude_globally=[Env.PRODUCTION])
class WorkspaceSetFeatureUseCase(
    JupiterTransactionalLoggedInMutationUseCase[WorkspaceSetFeatureArgs, None]
):
    """Set a particular feature in the workspace."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: WorkspaceSetFeatureArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        feature = args.feature
        value = args.value
        # TODO(horia141): param
        _, feature_flag_controls = infer_feature_flag_controls(
            cast(JupiterGlobalProperties, self._global_properties)
        )

        workspace = workspace.change_feature_flags(
            context.domain_context,
            feature_flag_controls=feature_flag_controls,
            feature_flags={**workspace.feature_flags, feature: value},
        )

        await uow.get_for(Workspace).save(workspace)
