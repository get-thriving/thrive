"""Use case for creating a new email verification attempt and sending the code."""

from jupiter.core.auth.sub.email_verification.root import EmailVerificationAttempt
from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.users.root import User
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)

_DEFAULT_EXPIRY_SECS = 600  # 10 minutes


@use_case_args
class CreateEmailVerificationAttemptArgs(UseCaseArgsBase):
    """Create email verification attempt use case arguments."""

    user_id: EntityId


@secure_class
class CreateEmailVerificationAttemptUseCase(
    JupiterGuestMutationUseCase[CreateEmailVerificationAttemptArgs, None]
):
    """Use case for creating a new email verification attempt and sending the code."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: CreateEmailVerificationAttemptArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(args.user_id)

            attempt, plain_code = EmailVerificationAttempt.new_email_verification_attempt(
                ctx=context.domain_context,
                user_ref_id=user.ref_id,
                expiry_duration_secs=_DEFAULT_EXPIRY_SECS,
            )
            await uow.get_for(EmailVerificationAttempt).create(attempt)

        await self._ports.email_verification.send_verification_email(
            email_address=user.email_address,
            verification_token=plain_code.code_raw,
        )
