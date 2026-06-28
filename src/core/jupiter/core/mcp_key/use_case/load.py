"""Use case for loading an MCP key."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.mcp_key.mcp_key_summary import MCPKeySummary
from jupiter.core.mcp_key.root import MCPKey
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MCPKeyLoadArgs(JupiterLoadCrownEntityArgs):
    """MCPKeyLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class MCPKeyLoadResult(UseCaseResultBase):
    """MCPKeyLoad result."""

    mcp_key: MCPKeySummary


class MCPKeyLoadUseCase(
    JupiterLoadCrownEntityUseCase[MCPKeyLoadArgs, MCPKeyLoadResult]
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
        mcp_key = await self.load_entity(
            uow, context.user.ref_id, MCPKey, args.ref_id, allow_archived
        )
        return MCPKeyLoadResult(mcp_key=mcp_key.summary)
