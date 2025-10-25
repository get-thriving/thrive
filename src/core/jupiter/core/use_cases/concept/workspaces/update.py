"""UseCase for updating a workspace."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.core.domain.concept.workspaces.workspace_name import WorkspaceName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class WorkspaceUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    name: UpdateAction[WorkspaceName]


@mutation_use_case()
class WorkspaceUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[WorkspaceUpdateArgs, None]
):
    """UseCase for updating a workspace."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: WorkspaceUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        workspace = workspace.update(
            context.domain_context,
            name=args.name,
        )

        await uow.get_for(Workspace).save(workspace)
