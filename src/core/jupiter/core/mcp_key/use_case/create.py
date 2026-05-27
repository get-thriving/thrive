"""Use case for creating an MCP key."""

from jupiter.core.api_key.key_secret_plain import KeySecretPlain
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.mcp_key.mcp_key_external import MCPKeyExternal
from jupiter.core.mcp_key.name import MCPKeyName
from jupiter.core.mcp_key.root import MCPKey
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MCPKeyCreateArgs(UseCaseArgsBase):
    """MCPKeyCreateArgs."""

    name: MCPKeyName


@use_case_result
class MCPKeyCreateResult(UseCaseResultBase):
    """MCPKeyCreateResult."""

    mcp_key: MCPKeyExternal


@secure_class
class MCPKeyCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MCPKeyCreateArgs, MCPKeyCreateResult]
):
    """Use case for creating an MCP key."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MCPKeyCreateArgs,
    ) -> MCPKeyCreateResult:
        """Execute the use case."""
        secret_plain = KeySecretPlain.generate()
        mcp_key = MCPKey.new_mcp_key(
            ctx=context.domain_context,
            user_ref_id=context.user.ref_id,
            name=args.name,
            secret_plain=secret_plain,
        )
        mcp_key = await uow.get_for(MCPKey).create(mcp_key)
        mcp_key_external = MCPKeyExternal.from_mcp_key(
            env=self._global_properties.env,
            mcp_key=mcp_key,
            secret=secret_plain,
        )
        return MCPKeyCreateResult(mcp_key=mcp_key_external)
