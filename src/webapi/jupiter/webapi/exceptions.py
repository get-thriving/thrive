"""Exceptions handling for the webapi module."""

from jupiter.core.domain.concept.big_plans.big_plan_milestone import (
    BigPlanMilestoneAlreadyExistsForDateError,
)
from jupiter.core.domain.concept.journals.journal import (
    JournalExistsForDatePeriodCombinationError,
)
from jupiter.core.domain.concept.projects.errors import ProjectInSignificantUseError
from jupiter.core.domain.concept.time_plans.time_plan import (
    TimePlanExistsForDatePeriodCombinationError,
)
from jupiter.core.domain.concept.user.user import (
    UserAlreadyExistsError,
    UserNotFoundError,
)
from jupiter.core.domain.concept.workspaces.workspace import WorkspaceNotFoundError
from jupiter.core.use_cases.login import InvalidLoginCredentialsError
from jupiter.framework.appform.webapi.exception import ExceptionDetailT
from jupiter.webapi.config import JupiterExceptionHandler
from starlette import status


class UserAlreadyExistsHandler(JupiterExceptionHandler[UserAlreadyExistsError]):
    """Handle user already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: UserAlreadyExistsError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": f"{exception}",
                    "type": "value_error.useralreadyexistserror",
                },
            ],
        }


class InvalidLoginCredentialsHandler(
    JupiterExceptionHandler[InvalidLoginCredentialsError]
):
    """Handle invalid login credentials errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: InvalidLoginCredentialsError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": "User email or password invalid",
                    "type": "value_error.invalidlogincredentialserror",
                },
            ],
        }


class ProjectInSignificantUseHandler(
    JupiterExceptionHandler[ProjectInSignificantUseError]
):
    """Handle project in significant use errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: ProjectInSignificantUseError) -> ExceptionDetailT:
        """Handle project in significant use errors."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": f"Cannot remove because: {exception}",
                    "type": "value_error.projectinsignificantuserror",
                },
            ],
        }


class UserNotFoundHandler(JupiterExceptionHandler[UserNotFoundError]):
    """Handle user not found errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_410_GONE

    def get_detail(self, exception: UserNotFoundError) -> ExceptionDetailT:
        """Handle user not found errors."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": "User does not exist",
                    "type": "value_error.usernotfounderror",
                },
            ],
        }


class WorkspaceNotFoundHandler(JupiterExceptionHandler[WorkspaceNotFoundError]):
    """Handle workspace not found errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_410_GONE

    def get_detail(self, exception: WorkspaceNotFoundError) -> ExceptionDetailT:
        """Handle workspace not found errors."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": "Workspace does not exist",
                    "type": "value_error.workspacenotfounderror",
                },
            ],
        }


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
    ) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": "Time plan already exists for this date and period combination",
                    "type": "value_error.timeplanexistsfordateperiodcombinationerror",
                },
            ],
        }


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
    ) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": "Big plan milestone already exists for this date",
                    "type": "value_error.bigplanmilestonealreadyexistsfordateerror",
                },
            ],
        }


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
    ) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": "Journal already exists for this date and period combination",
                    "type": "value_error.journalexistsfordateperiodcombinationerror",
                },
            ],
        }
