"""Standard exceptions for the web API."""

import logging
from json import JSONDecodeError

from jupiter.framework.appform.webapi.exception import (
    WebApiError,
    WebApiErrorDetailItem,
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

LOGGER = logging.getLogger(__name__)


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

    def get_detail(self, exception: UnavailableGloballyError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple(
            "This action is not available globally", str(exception)
        )


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

    def get_detail(self, exception: UnavailableForComponentError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple(
            "This action is not available in component", str(exception)
        )


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

    def get_detail(self, exception: UnavailableForContextError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple(
            "This action is not available in context", str(exception)
        )


class EntityNotFoundHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, EntityNotFoundError]
):
    """Handle entity not found errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_404_NOT_FOUND

    def get_detail(self, exception: EntityNotFoundError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple("Entity does not exist", str(exception))


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

    def get_detail(self, exception: EntityAlreadyExistsError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple("Entity already exists", str(exception))


class ExpiredAuthTokenHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, ExpiredAuthTokenError]
):
    """Handle expired auth token errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_401_UNAUTHORIZED

    def get_detail(self, exception: ExpiredAuthTokenError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple(
            "Your session token seems to be busted", str(exception)
        )


class InvalidAuthTokenHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, InvalidAuthTokenError]
):
    """Handle invalid auth token errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_426_UPGRADE_REQUIRED

    def get_detail(self, exception: InvalidAuthTokenError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple(
            "Your session token seems to be invalid", str(exception)
        )


class RealmDecodingHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, RealmDecodingError]
):
    """Handle realm decoding errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: RealmDecodingError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.validation(
            "Could not decode JSON body",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.realmdecodingerror",
        )


class InputValidationHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, InputValidationError]
):
    """Handle input validation errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: InputValidationError) -> WebApiError:
        """Handle input validation errors."""
        return WebApiError.validation(
            "Looks like there's something wrong with the command's arguments",
            loc=["body"],
            msg=str(exception),
            error_type="value_error.inputvalidationerror",
        )


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

    def get_detail(self, exception: MultiInputValidationError) -> WebApiError:
        """Handle input validation errors."""
        return WebApiError.validations(
            "Looks like there's something wrong with the command's arguments",
            [
                WebApiErrorDetailItem(
                    loc=["body", k],
                    msg=str(v),
                    type="value_error.inputvalidationerror",
                )
                for k, v in exception.errors.items()
            ],
        )


class JSONDecodeHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, JSONDecodeError]
):
    """Handle JSON decode errors."""

    @staticmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""
        return status.HTTP_422_UNPROCESSABLE_ENTITY

    def get_detail(self, exception: JSONDecodeError) -> WebApiError:
        """Get the detail for the exception."""
        return WebApiError.simple(
            "Expected JSON body, but none was found", str(exception)
        )
