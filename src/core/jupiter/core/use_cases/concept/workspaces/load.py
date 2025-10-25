"""The command for finding workspaces."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.framework_new.storage.repository import DomainUnitOfWork
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
class WorkspaceLoadArgs(UseCaseArgsBase):
    """Workspace find args."""


@use_case_result
class WorkspaceLoadResult(UseCaseResultBase):
    """PersonFindResult object."""

    workspace: Workspace


@readonly_use_case()
class WorkspaceLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[WorkspaceLoadArgs, WorkspaceLoadResult]
):
    """The command for loading workspaces."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: WorkspaceLoadArgs,
    ) -> WorkspaceLoadResult:
        """Execute the command's action."""
        workspace = context.workspace
        return WorkspaceLoadResult(workspace=workspace)
