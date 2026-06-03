"""Exceptions handling for the webapi module."""

from jupiter.core.api_key.root import InvalidAPIKeyError
from jupiter.core.application.use_case.login_local import (
    InvalidLoginCredentialsError,
    InvalidLoginMethodError,
)
from jupiter.core.auth.sub.email_verification.impl.resend import EmailSendError
from jupiter.core.auth.sub.email_verification.root import (
    ActiveEmailVerificationAttemptAlreadyExistsError,
    EmailAttemptVerificationExpiredError,
    InvalidEmailAttemptVerificationStateError,
    NoActiveEmailVerificationAttemptError,
    TooManyEmailVerificationAttemptsError,
)
from jupiter.core.big_plans.sub.milestones.root import (
    BigPlanMilestoneAlreadyExistsForDateError,
)
from jupiter.core.common.sub.contacts.sub.contact.root import (
    ContactAlreadyExistsError,
    ContactInSignificantUseError,
)
from jupiter.core.common.sub.tags.sub.tag.root import TagAlreadyExistsError
from jupiter.core.journals.root import (
    JournalExistsForDatePeriodCombinationError,
)
from jupiter.core.life_plan.sub.aspects.errors import AspectInSignificantUseError
from jupiter.core.time_plans.root import (
    TimePlanExistsForDatePeriodCombinationError,
)
from jupiter.core.users.root import (
    UserAlreadyExistsButIsArchivedError,
    UserAlreadyExistsError,
    UserEmailAlreadyVerifiedError,
    UserNotFoundError,
)
from jupiter.core.workspaces.root import (
    WorkspaceAlreadyExistsError,
    WorkspaceNotFoundError,
)
from jupiter.framework.appform.webapi.exception import WebApiError
from jupiter.webapi.config import JupiterExceptionHandler
from starlette import status


class UserAlreadyExistsHandler(JupiterExceptionHandler[UserAlreadyExistsError]):
    """Handle user already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: UserAlreadyExistsError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "A user with the same identity already seems to exist here!",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.useralreadyexistserror",
        )


class UserAlreadyExistsButIsArchivedHandler(
    JupiterExceptionHandler[UserAlreadyExistsButIsArchivedError]
):
    """Handle user already exists but is archived errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(self, exception: UserAlreadyExistsButIsArchivedError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "This account was previously closed and cannot be used to sign in again.",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.useralreadyexistsbutisarchivederror",
        )


class WorkspaceAlreadyExistsHandler(
    JupiterExceptionHandler[WorkspaceAlreadyExistsError]
):
    """Handle workspace already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: WorkspaceAlreadyExistsError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "A workspace already exists for this user!",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.workspacealreadyexistserror",
        )


class InvalidLoginCredentialsHandler(
    JupiterExceptionHandler[InvalidLoginCredentialsError]
):
    """Handle invalid login credentials errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: InvalidLoginCredentialsError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "User email or password invalid",
            loc=["body"],
            msg="User email or password invalid",
            error_type="value_error.invalidlogincredentialserror",
        )


class InvalidLoginMethodHandler(JupiterExceptionHandler[InvalidLoginMethodError]):
    """Handle invalid login method errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: InvalidLoginMethodError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "This account does not use local authentication",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.invalidloginmethoderror",
        )


class InvalidAPIKeyErrorHandler(JupiterExceptionHandler[InvalidAPIKeyError]):
    """Handle invalid API key errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: InvalidAPIKeyError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Invalid API key",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.invalidapikeyerror",
        )


class AspectInSignificantUseHandler(
    JupiterExceptionHandler[AspectInSignificantUseError]
):
    """Handle aspect in significant use errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: AspectInSignificantUseError) -> WebApiError:
        """Handle aspect in significant use errors."""
        return WebApiError.validation(
            "Cannot remove because aspect",
            loc=["body"],
            msg=f"Cannot remove because: {exception}",
            error_type="value_error.aspectinsignificantuserror",
        )


class UserEmailAlreadyVerifiedHandler(
    JupiterExceptionHandler[UserEmailAlreadyVerifiedError]
):
    """Handle user email already verified errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: UserEmailAlreadyVerifiedError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "The user's email is already verified",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.useremailalreadyverifiederror",
        )


class UserNotFoundHandler(JupiterExceptionHandler[UserNotFoundError]):
    """Handle user not found errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_410_GONE

    def get_detail(self, exception: UserNotFoundError) -> WebApiError:
        """Handle user not found errors."""
        return WebApiError.validation(
            "User does not exist",
            loc=["body"],
            msg="User does not exist",
            error_type="value_error.usernotfounderror",
        )


class WorkspaceNotFoundHandler(JupiterExceptionHandler[WorkspaceNotFoundError]):
    """Handle workspace not found errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_410_GONE

    def get_detail(self, exception: WorkspaceNotFoundError) -> WebApiError:
        """Handle workspace not found errors."""
        return WebApiError.validation(
            "Workspace does not exist",
            loc=["body"],
            msg="Workspace does not exist",
            error_type="value_error.workspacenotfounderror",
        )


class TimePlanExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[TimePlanExistsForDatePeriodCombinationError]
):
    """Handle time plan exists for date period combination errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(
        self, exception: TimePlanExistsForDatePeriodCombinationError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Time plan already exists for this date and period combination",
            loc=["body"],
            msg="Time plan already exists for this date and period combination",
            error_type="value_error.timeplanexistsfordateperiodcombinationerror",
        )


class BigPlanMilestoneAlreadyExistsForDateHandler(
    JupiterExceptionHandler[BigPlanMilestoneAlreadyExistsForDateError]
):
    """Handle big plan milestone already exists for date errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(
        self, exception: BigPlanMilestoneAlreadyExistsForDateError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Big plan milestone already exists for this date",
            loc=["body"],
            msg="Big plan milestone already exists for this date",
            error_type="value_error.bigplanmilestonealreadyexistsfordateerror",
        )


class JournalExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[JournalExistsForDatePeriodCombinationError]
):
    """Handle journal exists for date period combination errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(
        self, exception: JournalExistsForDatePeriodCombinationError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Journal already exists for this date and period combination",
            loc=["body"],
            msg="Journal already exists for this date and period combination",
            error_type="value_error.journalexistsfordateperiodcombinationerror",
        )


class ContactAlreadyExistsHandler(JupiterExceptionHandler[ContactAlreadyExistsError]):
    """Handle contact already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(self, exception: ContactAlreadyExistsError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Contact already exists",
            loc=["body"],
            msg="Contact already exists",
            error_type="value_error.contactalreadyexistserror",
        )


class ContactInSignificantUseHandler(
    JupiterExceptionHandler[ContactInSignificantUseError]
):
    """Handle contact in significant use errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: ContactInSignificantUseError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Contact is in significant use",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.contactinsignificantuseerror",
        )


class TagAlreadyExistsHandler(JupiterExceptionHandler[TagAlreadyExistsError]):
    """Handle tag already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(self, exception: TagAlreadyExistsError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Tag already exists",
            loc=["body"],
            msg="Tag already exists",
            error_type="value_error.tagalreadyexistserror",
        )


class InvalidEmailAttemptVerificationStateHandler(
    JupiterExceptionHandler[InvalidEmailAttemptVerificationStateError]
):
    """Handle invalid email verification attempt state errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(
        self, exception: InvalidEmailAttemptVerificationStateError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Email verification attempt is in an invalid state",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.invalidemailattemptverificationstateerror",
        )


class EmailAttemptVerificationExpiredHandler(
    JupiterExceptionHandler[EmailAttemptVerificationExpiredError]
):
    """Handle expired email verification attempt errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(
        self, exception: EmailAttemptVerificationExpiredError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Email verification attempt has expired",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.emailattemptverificationexpirederror",
        )


class ActiveEmailVerificationAttemptAlreadyExistsHandler(
    JupiterExceptionHandler[ActiveEmailVerificationAttemptAlreadyExistsError]
):
    """Handle active email verification attempt already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_409_CONFLICT

    def get_detail(
        self, exception: ActiveEmailVerificationAttemptAlreadyExistsError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "An active email verification attempt already exists",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.activeemailverificationattemptalreadyexists",
        )


class TooManyEmailVerificationAttemptsHandler(
    JupiterExceptionHandler[TooManyEmailVerificationAttemptsError]
):
    """Handle too many email verification attempts errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_429_TOO_MANY_REQUESTS

    def get_detail(
        self, exception: TooManyEmailVerificationAttemptsError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Too many email verification attempts were created recently",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.toomanyemailverificationattemptserror",
        )


class NoActiveEmailVerificationAttemptHandler(
    JupiterExceptionHandler[NoActiveEmailVerificationAttemptError]
):
    """Handle no active email verification attempt errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(
        self, exception: NoActiveEmailVerificationAttemptError
    ) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "No active email verification attempt exists",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.noactiveemailverificationattempt",
        )


class EmailSendErrorHandler(JupiterExceptionHandler[EmailSendError]):
    """Handle email send errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_502_BAD_GATEWAY

    def get_detail(self, exception: EmailSendError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Failed to send verification email",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.emailsenderror",
        )
