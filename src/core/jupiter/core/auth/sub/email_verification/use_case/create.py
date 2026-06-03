"""Use case for creating an email verification attempt."""

from jupiter.core.auth.sub.email_verification.root import (
    ATTEMPT_RATE_LIMIT_WINDOW_MINS,
    MAX_ATTEMPTS_PER_HOUR,
    ActiveEmailVerificationAttemptAlreadyExistsError,
    EmailVerificationAttempt,
    TooManyEmailVerificationAttemptsError,
)
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.users.root import User, UserEmailAlreadyVerifiedError
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
        right_now = self._time_provider.get_current_time()

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(args.user_id)
            if user.verified:
                raise UserEmailAlreadyVerifiedError(
                    "The user's email is already verified"
                )

            attempts = await uow.get_for(EmailVerificationAttempt).find_all(
                parent_ref_id=user.ref_id,
            )

            if any(
                attempt.active_at(right_now) and not attempt.solved
                for attempt in attempts
            ):
                raise ActiveEmailVerificationAttemptAlreadyExistsError(
                    "An active email verification attempt already exists"
                )

            one_hour_ago = right_now.subtract_minutes(ATTEMPT_RATE_LIMIT_WINDOW_MINS)
            attempts_in_last_hour = [
                attempt for attempt in attempts if attempt.created_time >= one_hour_ago
            ]
            if len(attempts_in_last_hour) > MAX_ATTEMPTS_PER_HOUR:
                raise TooManyEmailVerificationAttemptsError(
                    "Too many email verification attempts were created recently"
                )

            code_plain = VerificationCodePlain.generate()
            attempt = EmailVerificationAttempt.new_attempt(
                ctx=context.domain_context,
                user_ref_id=user.ref_id,
                code_plain=code_plain,
            )
            attempt = await uow.get_for(EmailVerificationAttempt).create(attempt)

        await self._ports.email_sender.send_email(
            user.email_address,
            code_plain,
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            attempt = attempt.mark_email_sent(ctx=context.domain_context)
            await uow.get_for(EmailVerificationAttempt).save(attempt)
