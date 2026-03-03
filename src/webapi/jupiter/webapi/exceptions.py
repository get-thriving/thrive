"""Exceptions handling for the webapi module."""

from jupiter.core.api_key.root import InvalidAPIKeyError
from jupiter.core.application.use_case.login import InvalidLoginCredentialsError
from jupiter.core.big_plans.sub.milestones.root import (
    BigPlanMilestoneAlreadyExistsForDateError,
)
from jupiter.core.common.sub.contacts.sub.contact.root import ContactAlreadyExistsError
from jupiter.core.common.sub.tags.sub.tag.root import TagAlreadyExistsError
from jupiter.core.journals.root import (
    JournalExistsForDatePeriodCombinationError,
)
from jupiter.core.life_plan.sub.aspects.errors import ProjectInSignificantUseError
from jupiter.core.time_plans.root import (
    TimePlanExistsForDatePeriodCombinationError,
)
from jupiter.core.users.root import (
    UserAlreadyExistsError,
    UserNotFoundError,
)
from jupiter.core.workspaces.root import WorkspaceNotFoundError
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


class ProjectInSignificantUseHandler(
    JupiterExceptionHandler[ProjectInSignificantUseError]
):
    """Handle project in significant use errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: ProjectInSignificantUseError) -> WebApiError:
        """Handle project in significant use errors."""
        return WebApiError.validation(
            "Cannot remove because project",
            loc=["body"],
            msg=f"Cannot remove because: {exception}",
            error_type="value_error.projectinsignificantuserror",
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
