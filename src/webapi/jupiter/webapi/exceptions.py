"""Exceptions handling for the webapi module."""

from fastapi.responses import JSONResponse
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
from jupiter.webapi.config import JupiterExceptionHandler
from starlette import status


class UserAlreadyExistsHandler(JupiterExceptionHandler[UserAlreadyExistsError]):
    """Handle user already exists errors."""

    def handle(self, exception: UserAlreadyExistsError) -> JSONResponse:
        """Handle user already exists errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": [
                    {
                        "loc": [
                            "body",
                        ],
                        "msg": f"{exception}",
                        "type": "value_error.useralreadyexistserror",
                    },
                ],
            },
        )


class InvalidLoginCredentialsHandler(
    JupiterExceptionHandler[InvalidLoginCredentialsError]
):
    """Handle invalid login credentials errors."""

    def handle(self, exception: InvalidLoginCredentialsError) -> JSONResponse:
        """Handle invalid login credentials errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": [
                    {
                        "loc": [
                            "body",
                        ],
                        "msg": "User email or password invalid",
                        "type": "value_error.invalidlogincredentialserror",
                    },
                ],
            },
        )


class ProjectInSignificantUseHandler(
    JupiterExceptionHandler[ProjectInSignificantUseError]
):
    """Handle project in significant use errors."""

    def handle(self, exception: ProjectInSignificantUseError) -> JSONResponse:
        """Handle project in significant use errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": [
                    {
                        "loc": [
                            "body",
                        ],
                        "msg": f"Cannot remove because: {exception}",
                        "type": "value_error.projectinsignificantuserror",
                    },
                ],
            },
        )


class UserNotFoundHandler(JupiterExceptionHandler[UserNotFoundError]):
    """Handle user not found errors."""

    def handle(self, exception: UserNotFoundError) -> JSONResponse:
        """Handle user not found errors."""
        return JSONResponse(
            status_code=status.HTTP_410_GONE,
            content="User does not exist",
        )


class WorkspaceNotFoundHandler(JupiterExceptionHandler[WorkspaceNotFoundError]):
    """Handle workspace not found errors."""

    def handle(self, exception: WorkspaceNotFoundError) -> JSONResponse:
        """Handle workspace not found errors."""
        return JSONResponse(
            status_code=status.HTTP_410_GONE,
            content="Workspace does not exist",
        )


class TimePlanExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[TimePlanExistsForDatePeriodCombinationError]
):
    """Handle time plan exists for date period combination errors."""

    def handle(
        self, exception: TimePlanExistsForDatePeriodCombinationError
    ) -> JSONResponse:
        """Handle time plan exists for date period combination errors."""
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content="Time plan already exists for this date and period combination"
            + str(exception),
        )


class BigPlanMilestoneAlreadyExistsForDateHandler(
    JupiterExceptionHandler[BigPlanMilestoneAlreadyExistsForDateError]
):
    """Handle big plan milestone already exists for date errors."""

    def handle(
        self, exception: BigPlanMilestoneAlreadyExistsForDateError
    ) -> JSONResponse:
        """Handle big plan milestone already exists for date errors."""
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content="Big plan milestone already exists for this date",
        )


class JournalExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[JournalExistsForDatePeriodCombinationError]
):
    """Handle journal exists for date period combination errors."""

    def handle(
        self, exception: JournalExistsForDatePeriodCombinationError
    ) -> JSONResponse:
        """Handle journal exists for date period combination errors."""
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content="Journal already exists for this date and period combination",
        )
