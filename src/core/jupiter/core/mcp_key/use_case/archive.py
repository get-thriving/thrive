"""Archive an MCP key."""

from jupiter.core.mcp_key.root import MCPKey
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MCPKeyArchiveArgs(UseCaseArgsBase):
    """MCP key archive args."""

    ref_id: EntityId


@secure_class
class MCPKeyArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MCPKeyArchiveArgs, None]
):
    """The command for archiving an MCP key."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MCPKeyArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        mcp_key = await uow.get_for(MCPKey).load_by_id(args.ref_id, allow_archived=True)
        mcp_key = mcp_key.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(MCPKey).save(mcp_key)
