"""Use case for verifying an email verification attempt."""

from jupiter.core.auth.sub.email_verification.root import (
    EmailVerificationAttempt,
    NoActiveEmailVerificationAttemptError,
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
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VerifyEmailVerificationAttemptArgs(UseCaseArgsBase):
    """Verify email verification attempt args."""

    user_id: EntityId
    code: VerificationCodePlain


@use_case_result
class VerifyEmailVerificationAttemptResult(UseCaseResultBase):
    """Verify email verification attempt result."""

    verified: bool
    can_retry: bool


@secure_class
class VerifyEmailVerificationAttemptUseCase(
    JupiterGuestMutationUseCase[
        VerifyEmailVerificationAttemptArgs, VerifyEmailVerificationAttemptResult
    ]
):
    """Use case for verifying an email verification attempt."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: VerifyEmailVerificationAttemptArgs,
    ) -> VerifyEmailVerificationAttemptResult:
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
            active_attempts = [
                attempt
                for attempt in attempts
                if attempt.active_at(right_now)
                and not attempt.solved
                and attempt.email_sent
            ]
            if not active_attempts:
                raise NoActiveEmailVerificationAttemptError(
                    "No active email verification attempt exists"
                )

            active_attempt = max(active_attempts, key=lambda a: a.created_time)
            updated_attempt = active_attempt.attempt_verification(
                ctx=context.domain_context,
                code_plain=args.code,
                right_now=right_now,
            )
            await uow.get_for(EmailVerificationAttempt).save(updated_attempt)

            if updated_attempt.solved:
                user = user.mark_verified(ctx=context.domain_context)
                await uow.get_for(User).save(user)

            attempts_after_update = [
                updated_attempt if attempt.ref_id == updated_attempt.ref_id else attempt
                for attempt in attempts
            ]
            latest_attempt = max(attempts_after_update, key=lambda a: a.created_time)
            verified = updated_attempt.solved
            can_retry = not verified and not latest_attempt.active_at(right_now)

        return VerifyEmailVerificationAttemptResult(
            verified=verified,
            can_retry=can_retry,
        )
