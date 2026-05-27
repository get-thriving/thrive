"""Use case for loading an MCP key."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.mcp_key.mcp_key_summary import MCPKeySummary
from jupiter.core.mcp_key.root import MCPKey
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MCPKeyLoadArgs(UseCaseArgsBase):
    """MCPKeyLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class MCPKeyLoadResult(UseCaseResultBase):
    """MCPKeyLoad result."""

    mcp_key: MCPKeySummary


class MCPKeyLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MCPKeyLoadArgs, MCPKeyLoadResult]
):
    """Use case for loading an MCP key."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MCPKeyLoadArgs,
    ) -> MCPKeyLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        mcp_key = await uow.get_for(MCPKey).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        if mcp_key.user.ref_id != context.user.ref_id:
            raise EntityNotFoundError("MCP key not found")
        return MCPKeyLoadResult(mcp_key=mcp_key.summary)
