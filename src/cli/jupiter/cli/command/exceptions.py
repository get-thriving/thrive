"""Specific exception handling."""

import sys

from jupiter.cli.config import JupiterExceptionHandler
from jupiter.core.application.use_case.login_local import (
    InvalidLoginCredentialsError,
    InvalidLoginMethodError,
)
from jupiter.core.big_plans.sub.milestones.root import (
    BigPlanMilestoneAlreadyExistsForDateError,
)
from jupiter.core.common.sub.contacts.sub.contact.root import ContactAlreadyExistsError
from jupiter.core.common.sub.publish.sub.entity.root import (
    EntityIsAlreadyActiveError,
    EntityIsAlreadyDraftError,
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
    UserAlreadyExistsError,
    UserNotFoundError,
)
from jupiter.core.workspaces.root import (
    WorkspaceAlreadyExistsError,
    WorkspaceNotFoundError,
)
from rich.console import Console


class UserAlreadyExistsHandler(JupiterExceptionHandler[UserAlreadyExistsError]):
    """Handle user already exists errors."""

    def handle(self, console: Console, exception: UserAlreadyExistsError) -> None:
        """Handle user already exists errors."""
        print("A user with the same identity already seems to exist here!")
        print("Please try creating another user.")
        sys.exit(1)


class WorkspaceAlreadyExistsHandler(
    JupiterExceptionHandler[WorkspaceAlreadyExistsError]
):
    """Handle workspace already exists errors."""

    def handle(self, console: Console, exception: WorkspaceAlreadyExistsError) -> None:
        """Handle workspace already exists errors."""
        print("A workspace already exists for this user!")
        print("Each user can only have one workspace.")
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
            f"For more information checkout: {self._service_properties.docs_init_workspace_url}",
        )
        sys.exit(1)


class InvalidLoginMethodHandler(JupiterExceptionHandler[InvalidLoginMethodError]):
    """Handle invalid login method errors."""

    def handle(self, console: Console, exception: InvalidLoginMethodError) -> None:
        """Handle invalid login method errors."""
        print("This account does not use local authentication.")
        print(str(exception))
        sys.exit(1)


class AspectInSignificantUseHandler(
    JupiterExceptionHandler[AspectInSignificantUseError]
):
    """Handle aspect in significant use errors."""

    def handle(self, console: Console, exception: AspectInSignificantUseError) -> None:
        """Handle aspect in significant use errors."""
        print(f"The selected aspect is still being used. Reason: {exception}")
        print("Please select a backup aspect via --backup-aspect-id")
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


class TagAlreadyExistsHandler(JupiterExceptionHandler[TagAlreadyExistsError]):
    """Handle tag already exists errors."""

    def handle(self, console: Console, exception: TagAlreadyExistsError) -> None:
        """Handle tag already exists errors."""
        print("A tag for that particular name already exists")
        sys.exit(1)


class ContactAlreadyExistsHandler(JupiterExceptionHandler[ContactAlreadyExistsError]):
    """Handle contact already exists errors."""

    def handle(self, console: Console, exception: ContactAlreadyExistsError) -> None:
        """Handle contact already exists errors."""
        print("A contact for that particular name already exists")
        sys.exit(1)


class EntityIsAlreadyActiveHandler(JupiterExceptionHandler[EntityIsAlreadyActiveError]):
    """Handle entity is already active errors."""

    def handle(self, console: Console, exception: EntityIsAlreadyActiveError) -> None:
        """Handle entity is already active errors."""
        print(str(exception))
        sys.exit(1)


class EntityIsAlreadyDraftHandler(JupiterExceptionHandler[EntityIsAlreadyDraftError]):
    """Handle entity is already draft errors."""

    def handle(self, console: Console, exception: EntityIsAlreadyDraftError) -> None:
        """Handle entity is already draft errors."""
        print(str(exception))
        sys.exit(1)


class UserNotFoundHandler(JupiterExceptionHandler[UserNotFoundError]):
    """Handle user not found errors."""

    def handle(self, console: Console, exception: UserNotFoundError) -> None:
        """Handle user not found errors."""
        print(
            "The user you're trying to operate as does't seem to exist! Please run `init` to create a user and workspace."
        )
        print(
            f"For more information checkout: {self._service_properties.docs_init_workspace_url}",
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
            f"For more information checkout: {self._service_properties.docs_init_workspace_url}",
        )
        sys.exit(2)
