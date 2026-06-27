"""Use case for creating an API key."""

from jupiter.core.api_key.api_key_external import APIKeyExternal
from jupiter.core.api_key.key_secret_plain import KeySecretPlain
from jupiter.core.api_key.name import APIKeyName
from jupiter.core.api_key.root import APIKey
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class APIKeyCreateArgs(JupiterCreateCrownEntityArgs):
    """APIKeyCreateArgs."""

    name: APIKeyName


@use_case_result
class APIKeyCreateResult(UseCaseResultBase):
    """APIKeyCreateResult."""

    api_key: APIKeyExternal


@secure_class
class APIKeyCreateUseCase(
    JupiterCreateCrownEntityUseCase[APIKeyCreateArgs, APIKeyCreateResult]
):
    """Use case for creating an API key."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: APIKeyCreateArgs,
    ) -> APIKeyCreateResult:
        """Execute the use case."""
        secret_plain = KeySecretPlain.generate()
        api_key = APIKey.new_api_key(
            ctx=context.domain_context,
            user_ref_id=context.user.ref_id,
            name=args.name,
            secret_plain=secret_plain,
        )
        api_key = await self.create_entity(
            context.domain_context, uow, progress_reporter, context.user.ref_id, api_key
        )
        api_key_external = APIKeyExternal.from_api_key(
            env=self._global_properties.env,
            api_key=api_key,
            secret=secret_plain,
        )
        return APIKeyCreateResult(api_key=api_key_external)
