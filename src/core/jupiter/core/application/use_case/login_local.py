"""Use case for logging in as a particular user with local auth."""

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.local.password_plain import PasswordPlain
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.users.root import (
    UserNotFoundError,
    UserRepository,
)
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.secure import secure_class
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


class InvalidLoginCredentialsError(Exception):
    """Error raised when either an email address or password are not good."""


class InvalidLoginMethodError(Exception):
    """Error raised when the user does not use local authentication."""


@use_case_args
class LoginLocalArgs(UseCaseArgsBase):
    """Login (local auth) arguments."""

    email_address: EmailAddress
    password: PasswordPlain


@use_case_result
class LoginLocalResult(UseCaseResultBase):
    """Login (local auth) result."""

    auth_token_ext: AuthTokenExt


@secure_class
class LoginLocalUseCase(JupiterGuestReadonlyUseCase[LoginLocalArgs, LoginLocalResult]):
    """Use case for logging in as a particular user with local auth."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: LoginLocalArgs,
    ) -> LoginLocalResult:
        """Execute the command."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                user = await uow.get(UserRepository).load_by_email_address(
                    args.email_address
                )
                if user.auth_method != UserAuthMethod.LOCAL:
                    raise InvalidLoginMethodError(
                        "This account does not use local authentication"
                    )

                auth = await uow.get_for(AuthLocal).load_by_parent(user.ref_id)

                if not auth.check_password_against(args.password):
                    raise InvalidLoginCredentialsError("User email or password invalid")
            except UserNotFoundError as err:
                raise InvalidLoginCredentialsError(
                    "User email or password invalid"
                ) from err

            auth_token = self._auth_token_stamper.stamp_for_general_long(user.ref_id)

            return LoginLocalResult(auth_token_ext=auth_token.to_ext())
