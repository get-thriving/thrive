"""Use case for exchanging an MCP key for an authentication token."""

from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.mcp_key.mcp_key_external import MCPKeyExternal
from jupiter.core.mcp_key.root import InvalidMCPKeyError, MCPKey
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MCPKeyExchangeArgs(UseCaseArgsBase):
    """MCP key exchange arguments."""

    mcp_key_external: MCPKeyExternal


@use_case_result
class MCPKeyExchangeResult(UseCaseResultBase):
    """MCP key exchange result."""

    auth_token_ext: AuthTokenExt


@secure_class
class MCPKeyExchangeUseCase(
    JupiterGuestReadonlyUseCase[MCPKeyExchangeArgs, MCPKeyExchangeResult]
):
    """Use case for exchanging an MCP key for an authentication token."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: MCPKeyExchangeArgs,
    ) -> MCPKeyExchangeResult:
        """Execute the command."""
        if args.mcp_key_external.env != self._global_properties.env:
            raise InvalidMCPKeyError("Invalid MCP key environment")

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                mcp_key = await uow.get_for(MCPKey).load_by_id(
                    args.mcp_key_external.ref_id
                )
            except EntityNotFoundError as err:
                raise InvalidMCPKeyError("Invalid MCP key") from err

            if not mcp_key.key_hash.check_against(args.mcp_key_external.secret):
                raise InvalidMCPKeyError("Invalid MCP key")

            auth_token = self._auth_token_stamper.stamp_for_mcp(mcp_key.user.ref_id)

            return MCPKeyExchangeResult(auth_token_ext=auth_token.to_ext())
