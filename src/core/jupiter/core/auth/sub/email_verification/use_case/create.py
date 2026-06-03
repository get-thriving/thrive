"""Use case for creating an email verification attempt."""

from jupiter.core.auth.sub.email_verification.service.create_email_verification_attempt import (
    CreateEmailVerificationAttemptService,
)
from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class CreateEmailVerificationAttemptArgs(UseCaseArgsBase):
    """Create email verification attempt args."""

    user_id: EntityId


@secure_class
class CreateEmailVerificationAttemptUseCase(
    JupiterGuestMutationUseCase[CreateEmailVerificationAttemptArgs, None]
):
    """Use case for creating an email verification attempt."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: CreateEmailVerificationAttemptArgs,
    ) -> None:
        """Execute the command's action."""
        await CreateEmailVerificationAttemptService(
            self._ports.domain_storage_engine,
            self._ports.email_sender,
        ).do_it(
            ctx=context.domain_context,
            right_now=self._time_provider.get_current_time(),
            user_id=args.user_id,
        )
