"""Standard exceptions for the web API."""

from json import JSONDecodeError

from jupiter.framework.appform.webapi.exception import (
    ExceptionDetailT,
    WebApiExceptionHandler,
)
from jupiter.framework.auth.auth_token import (
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework.component_properties import UnavailableForComponentError
from jupiter.framework.errors import InputValidationError, MultiInputValidationError
from jupiter.framework.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework.realm.realm import RealmDecodingError
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from jupiter.framework.use_case import UnavailableForContextError
from starlette import status


class UnavailableGloballyHandler(
    WebApiExceptionHandler[
        GlobalProperties, ServiceProperties, UnavailableGloballyError
    ]
):
    """Handle unavailable globally errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_406_NOT_ACCEPTABLE

    def get_detail(self, exception: UnavailableGloballyError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "This action is not available globally",
            "detail": f"{exception}",
        }


class UnavailableForComponentHandler(
    WebApiExceptionHandler[
        GlobalProperties, ServiceProperties, UnavailableForComponentError
    ]
):
    """Handle unavailable for component errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_406_NOT_ACCEPTABLE

    def get_detail(self, exception: UnavailableForComponentError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "This action is not available in component",
            "detail": f"{exception}",
        }


class UnavailableForContextHandler(
    WebApiExceptionHandler[
        GlobalProperties, ServiceProperties, UnavailableForContextError
    ]
):
    """Handle unavailable for context errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_406_NOT_ACCEPTABLE

    def get_detail(self, exception: UnavailableForContextError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "This action is not available in context",
            "detail": f"{exception}",
        }


class EntityNotFoundHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, EntityNotFoundError]
):
    """Handle entity not found errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_404_NOT_FOUND

    def get_detail(self, exception: EntityNotFoundError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "Entity does not exist",
            "detail": f"{exception}",
        }


class EntityAlreadyExistsHandler(
    WebApiExceptionHandler[
        GlobalProperties, ServiceProperties, EntityAlreadyExistsError
    ]
):
    """Handle entity already exists errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_400_BAD_REQUEST

    def get_detail(self, exception: EntityAlreadyExistsError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "Entity already exists",
            "detail": f"{exception}",
        }


class ExpiredAuthTokenHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, ExpiredAuthTokenError]
):
    """Handle expired auth token errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_401_UNAUTHORIZED

    def get_detail(self, exception: ExpiredAuthTokenError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "Your session token seems to be busted",
            "detail": f"{exception}",
        }


class InvalidAuthTokenHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, InvalidAuthTokenError]
):
    """Handle invalid auth token errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_426_UPGRADE_REQUIRED

    def get_detail(self, exception: InvalidAuthTokenError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "Your session token seems to be invalid",
            "detail": f"{exception}",
        }


class RealmDecodingHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, RealmDecodingError]
):
    """Handle realm decoding errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: RealmDecodingError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "Could not decode JSON body",
            "detail": [
                {
                    "loc": ["body"],
                    "msg": f"{exception}",
                    "type": "value_error.realmdecodingerror",
                }
            ],
        }


class InputValidationHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, InputValidationError]
):
    """Handle input validation errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: InputValidationError) -> ExceptionDetailT:
        """Handle input validation errors."""
        return {
            "detail": [
                {
                    "loc": [
                        "body",
                    ],
                    "msg": f"{exception}",
                    "type": "value_error.inputvalidationerror",
                },
            ],
        }


class MultiInputValidationHandler(
    WebApiExceptionHandler[
        GlobalProperties, ServiceProperties, MultiInputValidationError
    ]
):
    """Handle input validation errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: MultiInputValidationError) -> ExceptionDetailT:
        """Handle input validation errors."""
        return {
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
        }


class JSONDecodeHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, JSONDecodeError]
):
    """Handle JSON decode errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: JSONDecodeError) -> ExceptionDetailT:
        """Get the detail for the exception."""
        return {
            "reason": "Expected JSON body, but none was found",
            "detail": f"{exception}",
        }
