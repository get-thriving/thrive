"""Stop a sign in from creating a user whose email another account holds."""

from jupiter.core.application.use_case.login_local import InvalidLoginMethodError
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.service.load_linked_auth_methods import (
    LoadLinkedAuthMethodsService,
)
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.root import UserNotFoundError, UserRepository
from jupiter.framework.storage.repository import DomainUnitOfWork

_METHOD_LABELS = {
    UserAuthMethod.LOCAL: "your email and password",
    UserAuthMethod.GOOGLE: "Google",
    UserAuthMethod.APPLE: "Apple",
}


class AccountExistsWithOtherAuthMethodError(InvalidLoginMethodError):
    """Raised when a sign in would create a user whose email is already taken."""


class CheckEmailNotTakenByOtherMethodService:
    """Fails with a pointer at the existing methods if the email has a user."""

    async def do_it(self, uow: DomainUnitOfWork, email_address: EmailAddress) -> None:
        """Fail with a pointer at the existing methods if the email has a user."""
        try:
            existing = await uow.get(UserRepository).load_by_email_address(
                email_address
            )
        except UserNotFoundError:
            return
        if existing.archived:
            return
        methods = await LoadLinkedAuthMethodsService().do_it(uow, existing.ref_id)
        labels = " or ".join(_METHOD_LABELS[method] for method in methods)
        raise AccountExistsWithOtherAuthMethodError(
            f"An account with this email already exists. Sign in with {labels} "
            "instead. You can link this sign-in method from your Account page "
            "afterwards."
        )
