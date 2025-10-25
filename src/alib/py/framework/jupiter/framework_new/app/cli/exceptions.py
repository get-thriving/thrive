"""Standard exceptions for the CLI."""

import sys

from jupiter.framework_new.app.cli.exception import CliExceptionHandler
from jupiter.framework_new.app.cli.session_storage import SessionInfoNotFoundError
from jupiter.framework_new.auth.auth_token import (
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework_new.component_properties import UnavailableForComponentError
from jupiter.framework_new.errors import InputValidationError, MultiInputValidationError
from jupiter.framework_new.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework_new.realm.realm import RealmDecodingError
from jupiter.framework_new.storage.connection import ConnectionPrepareError
from jupiter.framework_new.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from jupiter.framework_new.use_case import UnavailableForContextError
from rich.console import Console


class UnavailableGloballyHandler(
    CliExceptionHandler[GlobalProperties, UnavailableGloballyError]
):
    """Handle unavailable globally errors."""

    def handle(self, console: Console, exception: UnavailableGloballyError) -> None:
        """Handle unavailable globally errors."""
        print("This action is not available")
        sys.exit(1)


class UnavailableForComponentHandler(
    CliExceptionHandler[GlobalProperties, UnavailableForComponentError]
):
    """Handle unavailable for component errors."""

    def handle(self, console: Console, exception: UnavailableForComponentError) -> None:
        """Handle unavailable for component errors."""
        print("This action is not available in component")
        sys.exit(1)


class UnavailableForContextHandler(
    CliExceptionHandler[GlobalProperties, UnavailableForContextError]
):
    """Handle unavailable for context errors."""

    def handle(self, console: Console, exception: UnavailableForContextError) -> None:
        """Handle unavailable for context errors."""
        print("This action is not available in context")
        sys.exit(1)


class EntityNotFoundHandler(CliExceptionHandler[GlobalProperties, EntityNotFoundError]):
    """Handle entity not found errors."""

    def handle(self, console: Console, exception: EntityNotFoundError) -> None:
        """Handle entity not found errors."""
        print(str(exception))
        sys.exit(1)


class EntityAlreadyExistsHandler(
    CliExceptionHandler[GlobalProperties, EntityAlreadyExistsError]
):
    """Handle entity already exists errors."""

    def handle(self, console: Console, exception: EntityAlreadyExistsError) -> None:
        """Handle entity already exists errors."""
        print(str(exception))
        sys.exit(1)


class ExpiredAuthTokenHandler(
    CliExceptionHandler[GlobalProperties, ExpiredAuthTokenError]
):
    """Handle expired auth token errors."""

    def handle(self, console: Console, exception: ExpiredAuthTokenError) -> None:
        """Handle expired auth token errors."""
        print("Your authentication token has expired.")
        print("Please log in again.")
        sys.exit(1)


class InvalidAuthTokenHandler(
    CliExceptionHandler[GlobalProperties, InvalidAuthTokenError]
):
    """Handle invalid auth token errors."""

    def handle(self, console: Console, exception: InvalidAuthTokenError) -> None:
        """Handle invalid auth token errors."""
        print(
            "Your session seems to be invalid! Please run 'init' or 'login' to fix this!"
        )
        sys.exit(2)


class RealmDecodingHandler(CliExceptionHandler[GlobalProperties, RealmDecodingError]):
    """Handle realm decoding errors."""

    def handle(self, console: Console, exception: RealmDecodingError) -> None:
        """Handle realm decoding errors."""
        print("Could not decode the body")
        print(exception)
        sys.exit(1)


class InputValidationHandler(
    CliExceptionHandler[GlobalProperties, InputValidationError]
):
    """Handle input validation errors."""

    def handle(self, console: Console, exception: InputValidationError) -> None:
        """Handle input validation errors."""
        print("Looks like there's something wrong with the command's arguments:")
        print(f"  {exception}")
        sys.exit(1)


class MultiInputValidationHandler(
    CliExceptionHandler[GlobalProperties, MultiInputValidationError]
):
    """Handle input validation errors."""

    def handle(self, console: Console, exception: MultiInputValidationError) -> None:
        """Handle input validation errors."""
        print("Looks like there's something wrong with the command's arguments:")
        for k, v in exception.errors.items():
            print(f"  {k}: {v}")
        sys.exit(1)


class SessionInfoNotFoundHandler(
    CliExceptionHandler[GlobalProperties, SessionInfoNotFoundError]
):
    """Handle the session info not found error."""

    def handle(self, console: Console, exception: SessionInfoNotFoundError) -> None:
        """Handle the session info not found error."""
        console.print("No session info found. Please log in or create a new account.")
        sys.exit(1)


class ConnectionPrepareHandler(
    CliExceptionHandler[GlobalProperties, ConnectionPrepareError]
):
    """Handle connection prepare errors."""

    def handle(self, console: Console, exception: ConnectionPrepareError) -> None:
        """Handle connection prepare errors."""
        print("A connection to the database couldn't be established!")
        print("Check if the database path exists")
        print(exception.__traceback__)
        sys.exit(2)
