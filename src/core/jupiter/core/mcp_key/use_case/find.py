"""Use case for finding MCP keys."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.mcp_key.mcp_key_summary import MCPKeySummary
from jupiter.core.mcp_key.root import MCPKey
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MCPKeyFindArgs(JupiterFindCrownEntityArgs):
    """MCPKeyFind args."""

    allow_archived: bool | None


@use_case_result
class MCPKeyFindResult(UseCaseResultBase):
    """MCPKeyFind result."""

    mcp_keys: list[MCPKeySummary]


class MCPKeyFindUseCase(
    JupiterFindCrownEntityUseCase[MCPKeyFindArgs, MCPKeyFindResult]
):
    """Use case for finding MCP keys."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MCPKeyFindArgs,
    ) -> MCPKeyFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        user = context.user
        mcp_keys = await uow.get_for(MCPKey).find_all(
            parent_ref_id=user.ref_id,
            allow_archived=allow_archived,
        )
        return MCPKeyFindResult(mcp_keys=[mk.summary for mk in mcp_keys])
