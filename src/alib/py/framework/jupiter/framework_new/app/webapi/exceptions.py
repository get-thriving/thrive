"""Standard exceptions for the web API."""

from json import JSONDecodeError

from fastapi.responses import JSONResponse
from jupiter.framework_new.app.webapi.exception import WebApiExceptionHandler
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
from jupiter.framework_new.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from jupiter.framework_new.use_case import UnavailableForContextError
from starlette import status


class UnavailableGloballyHandler(
    WebApiExceptionHandler[GlobalProperties, UnavailableGloballyError]
):
    """Handle unavailable globally errors."""

    def handle(self, exception: UnavailableGloballyError) -> JSONResponse:
        """Handle unavailable globally errors."""
        return JSONResponse(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            content={
                "reason": "This action is not available globally",
                "detail": f"{exception}",
            },
        )


class UnavailableForComponentHandler(
    WebApiExceptionHandler[GlobalProperties, UnavailableForComponentError]
):
    """Handle unavailable for component errors."""

    def handle(self, exception: UnavailableForComponentError) -> JSONResponse:
        """Handle unavailable for component errors."""
        return JSONResponse(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            content={
                "reason": "This action is not available in component",
                "detail": f"{exception}",
            },
        )


class UnavailableForContextHandler(
    WebApiExceptionHandler[GlobalProperties, UnavailableForContextError]
):
    """Handle unavailable for context errors."""

    def handle(self, exception: UnavailableForContextError) -> JSONResponse:
        """Handle unavailable for context errors."""
        return JSONResponse(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            content={
                "reason": "This action is not available in context",
                "detail": f"{exception}",
            },
        )


class EntityNotFoundHandler(
    WebApiExceptionHandler[GlobalProperties, EntityNotFoundError]
):
    """Handle entity not found errors."""

    def handle(self, exception: EntityNotFoundError) -> JSONResponse:
        """Handle entity not found errors."""
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "reason": "Entity does not exist",
                "detail": f"{exception}",
            },
        )


class EntityAlreadyExistsHandler(
    WebApiExceptionHandler[GlobalProperties, EntityAlreadyExistsError]
):
    """Handle entity already exists errors."""

    def handle(self, exception: EntityAlreadyExistsError) -> JSONResponse:
        """Handle entity already exists errors."""
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "reason": "Entity already exists",
                "detail": f"{exception}",
            },
        )


class ExpiredAuthTokenHandler(
    WebApiExceptionHandler[GlobalProperties, ExpiredAuthTokenError]
):
    """Handle expired auth token errors."""

    def handle(self, exception: ExpiredAuthTokenError) -> JSONResponse:
        """Handle expired auth token errors."""
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "reason": "Your session token seems to be busted",
                "detail": f"{exception}",
            },
        )


class InvalidAuthTokenHandler(
    WebApiExceptionHandler[GlobalProperties, InvalidAuthTokenError]
):
    """Handle invalid auth token errors."""

    def handle(self, exception: InvalidAuthTokenError) -> JSONResponse:
        """Handle invalid auth token errors."""
        return JSONResponse(
            status_code=status.HTTP_426_UPGRADE_REQUIRED,
            content={
                "reason": "Your session token seems to be invalid",
                "detail": f"{exception}",
            },
        )


class RealmDecodingHandler(
    WebApiExceptionHandler[GlobalProperties, RealmDecodingError]
):
    """Handle realm decoding errors."""

    def handle(self, exception: RealmDecodingError) -> JSONResponse:
        """Handle realm decoding errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "reason": "Could not decode JSON body",
                "detail": f"{exception}",
            },
        )


class InputValidationHandler(
    WebApiExceptionHandler[GlobalProperties, InputValidationError]
):
    """Handle input validation errors."""

    def handle(self, exception: InputValidationError) -> JSONResponse:
        """Handle input validation errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": [
                    {
                        "loc": [
                            "body",
                        ],
                        "msg": f"{exception}",
                        "type": "value_error.inputvalidationerror",
                    },
                ],
            },
        )


class MultiInputValidationHandler(
    WebApiExceptionHandler[GlobalProperties, MultiInputValidationError]
):
    """Handle input validation errors."""

    def handle(self, exception: MultiInputValidationError) -> JSONResponse:
        """Handle input validation errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": [
                    {
                        "loc": [
                            "body",
                            k,
                        ],
                        "msg": f"{v}",
                        "type": "value_error.inputvalidationerror",
                    }
                    for k, v in exception.errors.items()
                ]
            },
        )


class JSONDecodeHandler(WebApiExceptionHandler[GlobalProperties, JSONDecodeError]):
    """Handle JSON decode errors."""

    def handle(self, exception: JSONDecodeError) -> JSONResponse:
        """Handle JSON decode errors."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "reason": "Expected JSON body, but none was found",
                "detail": f"{exception}",
            },
        )
