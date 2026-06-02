"""Use case for verifying an email verification code and marking the user verified."""

from jupiter.core.auth.sub.email_verification.root import (
    EmailVerificationAttempt,
    EmailVerificationAttemptExpiredError,
    EmailVerificationAttemptTooManyAttemptsError,
)
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.users.root import User
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
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
    """Verify email verification attempt use case arguments."""

    user_id: EntityId
    code: VerificationCodePlain


@use_case_result
class VerifyEmailVerificationAttemptResult(UseCaseResultBase):
    """Verify email verification attempt use case result."""

    verified: bool


@secure_class
class VerifyEmailVerificationAttemptUseCase(
    JupiterGuestMutationUseCase[
        VerifyEmailVerificationAttemptArgs, VerifyEmailVerificationAttemptResult
    ]
):
    """Use case for verifying an email verification code."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: VerifyEmailVerificationAttemptArgs,
    ) -> VerifyEmailVerificationAttemptResult:
        """Execute the command's action."""
        current_time = self._time_provider.get_current_time()

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(args.user_id)
            attempt = await uow.get_for(EmailVerificationAttempt).load_by_parent(
                user.ref_id
            )

            try:
                attempt, was_correct = attempt.verify_against_code(
                    ctx=context.domain_context,
                    code=args.code,
                    current_time=current_time,
                )
            except EmailVerificationAttemptExpiredError as err:
                raise InputValidationError(
                    "The verification code has expired. Please request a new one."
                ) from err
            except EmailVerificationAttemptTooManyAttemptsError as err:
                raise InputValidationError(
                    "Too many failed attempts. Please request a new verification code."
                ) from err

            await uow.get_for(EmailVerificationAttempt).save(attempt)

            if was_correct:
                user = user.verify_email(context.domain_context)
                await uow.get_for(User).save(user)

        return VerifyEmailVerificationAttemptResult(verified=was_correct)
