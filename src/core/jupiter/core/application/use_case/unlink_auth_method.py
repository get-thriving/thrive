"""Use case for removing a way of signing in from the user's account."""

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.service.auth_link_errors import (
    AuthMethodNotLinkedError,
    CannotRemoveLastAuthMethodError,
)
from jupiter.core.auth.service.load_linked_auth_methods import (
    LoadLinkedAuthMethodsService,
)
from jupiter.core.auth.service.urgent_clear_auth_info_for_user import (
    UrgentClearAuthInfoForUser,
)
from jupiter.core.auth.sub.apple.root import AuthApple
from jupiter.core.auth.sub.google.root import AuthGoogle
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.auth.sub.local.sub.recovery_token.root import RecoveryToken
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class UnlinkAuthMethodArgs(UseCaseArgsBase):
    """Unlink auth method arguments."""

    auth_method: UserAuthMethod


@secure_class
@mutation_use_case()
class UnlinkAuthMethodUseCase(
    JupiterTransactionalLoggedInMutationUseCase[UnlinkAuthMethodArgs, None]
):
    """Use case for removing a way of signing in from the user's account."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: UnlinkAuthMethodArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        ctx = context.domain_context

        linked = await LoadLinkedAuthMethodsService().do_it(uow, user.ref_id)
        if args.auth_method not in linked:
            raise AuthMethodNotLinkedError("This sign in method isn't linked")
        if len(linked) <= 1:
            raise CannotRemoveLastAuthMethodError(
                "This is the only way to sign in to this account. "
                "Add another one before removing it."
            )

        match args.auth_method:
            case UserAuthMethod.LOCAL:
                auth = await uow.get_for(AuthLocal).load_by_parent(user.ref_id)
                try:
                    await uow.get_for(RecoveryToken).remove_by_parent(ctx, auth.ref_id)
                except EntityNotFoundError:
                    pass
                await uow.get_for(AuthLocal).remove_by_parent(ctx, user.ref_id)
            case UserAuthMethod.GOOGLE:
                await uow.get_for(AuthGoogle).remove_by_parent(ctx, user.ref_id)
            case UserAuthMethod.APPLE:
                # Apple wants the token revoked whenever we stop using it.
                await UrgentClearAuthInfoForUser(
                    self._ports.apple_oauth_client
                ).revoke_apple_refresh_token(uow, ctx, user)
                await uow.get_for(AuthApple).remove_by_parent(ctx, user.ref_id)
