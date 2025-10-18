"""Specific exception handling."""

import sys

from jupiter.cli.config import JupiterExceptionHandler
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
from rich.console import Console


class UserAlreadyExistsHandler(JupiterExceptionHandler[UserAlreadyExistsError]):
    """Handle user already exists errors."""

    def handle(self, console: Console, exception: UserAlreadyExistsError) -> None:
        """Handle user already exists errors."""
        print("A user with the same identity already seems to exist here!")
        print("Please try creating another user.")
        sys.exit(1)


class InvalidLoginCredentialsHandler(
    JupiterExceptionHandler[InvalidLoginCredentialsError]
):
    """Handle invalid login credentials errors."""

    def handle(self, console: Console, exception: InvalidLoginCredentialsError) -> None:
        """Handle invalid login credentials errors."""
        print("The user and/or password are invalid!")
        print("You can:")
        print(" * Run `login` to login.")
        print(" * Run 'init' to create a user and workspace!")
        print(" * Run 'reset-password' to reset your password!")
        print(
            f"For more information checkout: {self._global_properties.docs_init_workspace_url}",
        )
        sys.exit(1)


class ProjectInSignificantUseHandler(
    JupiterExceptionHandler[ProjectInSignificantUseError]
):
    """Handle project in significant use errors."""

    def handle(self, console: Console, exception: ProjectInSignificantUseError) -> None:
        """Handle project in significant use errors."""
        print(f"The selected project is still being used. Reason: {exception}")
        print("Please select a backup project via --backup-project-id")
        sys.exit(1)


class TimePlanExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[TimePlanExistsForDatePeriodCombinationError]
):
    """Handle time plans already existing."""

    def handle(
        self,
        console: Console,
        exception: TimePlanExistsForDatePeriodCombinationError,
    ) -> None:
        """Handle time plans already existing."""
        print("A time plan for that particular day and period already exists")
        sys.exit(1)


class BigPlanMilestoneAlreadyExistsForDateHandler(
    JupiterExceptionHandler[BigPlanMilestoneAlreadyExistsForDateError]
):
    """Handle big plan milestone already exists for date errors."""

    def handle(
        self,
        console: Console,
        exception: BigPlanMilestoneAlreadyExistsForDateError,
    ) -> None:
        """Handle big plan milestone already exists for date errors."""
        print("A big plan milestone for that particular date already exists")
        sys.exit(1)


class JournalExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[JournalExistsForDatePeriodCombinationError]
):
    """Handle journal already existing."""

    def handle(
        self,
        console: Console,
        exception: JournalExistsForDatePeriodCombinationError,
    ) -> None:
        """Handle journal already existing."""
        print("A journal for that particular day and period already exists")
        sys.exit(1)


class UserNotFoundHandler(JupiterExceptionHandler[UserNotFoundError]):
    """Handle user not found errors."""

    def handle(self, console: Console, exception: UserNotFoundError) -> None:
        """Handle user not found errors."""
        print(
            "The user you're trying to operate as does't seem to exist! Please run `init` to create a user and workspace."
        )
        print(
            f"For more information checkout: {self._global_properties.docs_init_workspace_url}",
        )
        sys.exit(2)


class WorkspaceNotFoundHandler(JupiterExceptionHandler[WorkspaceNotFoundError]):
    """Handle workspace not found errors."""

    def handle(self, console: Console, exception: WorkspaceNotFoundError) -> None:
        """Handle workspace not found errors."""
        print(
            "The workspace you're trying to operate in does't seem to exist! Please run `init` to create a user and workspace."
        )
        print(
            f"For more information checkout: {self._global_properties.docs_init_workspace_url}",
        )
        sys.exit(2)
