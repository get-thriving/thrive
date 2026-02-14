"""Use case for exchanging an API key for an authentication token."""

from jupiter.core.api_key.api_key_external import APIKeyExternal
from jupiter.core.api_key.root import APIKey, InvalidAPIKeyError
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
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
class APIKeyExchangeArgs(UseCaseArgsBase):
    """API key exchange arguments."""

    api_key_external: APIKeyExternal


@use_case_result
class APIKeyExchangeResult(UseCaseResultBase):
    """API key exchange result."""

    auth_token_ext: AuthTokenExt


@secure_class
class APIKeyExchangeUseCase(
    JupiterGuestReadonlyUseCase[APIKeyExchangeArgs, APIKeyExchangeResult]
):
    """Use case for exchanging an API key for an authentication token."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: APIKeyExchangeArgs,
    ) -> APIKeyExchangeResult:
        """Execute the command."""
        if args.api_key_external.env != self._global_properties.env:
            raise InvalidAPIKeyError("Invalid API key environment")

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                api_key = await uow.get_for(APIKey).load_by_id(
                    args.api_key_external.ref_id
                )
            except EntityNotFoundError as err:
                raise InvalidAPIKeyError("Invalid API key") from err

            if not api_key.key_hash.check_against(args.api_key_external.secret):
                raise InvalidAPIKeyError("Invalid API key")

            auth_token = self._auth_token_stamper.stamp_for_general_short(
                api_key.user.ref_id
            )

            return APIKeyExchangeResult(auth_token_ext=auth_token.to_ext())
