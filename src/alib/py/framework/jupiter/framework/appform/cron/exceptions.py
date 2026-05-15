"""Standard exceptions for cron application forms."""

from json import JSONDecodeError

from jupiter.framework.appform.cron.exception import CronExceptionHandler
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


class UnavailableGloballyHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, UnavailableGloballyError]
):
    """Handle unavailable globally errors."""


class UnavailableForComponentHandler(
    CronExceptionHandler[
        GlobalProperties, ServiceProperties, UnavailableForComponentError
    ]
):
    """Handle unavailable for component errors."""


class UnavailableForContextHandler(
    CronExceptionHandler[
        GlobalProperties, ServiceProperties, UnavailableForContextError
    ]
):
    """Handle unavailable for context errors."""


class EntityNotFoundHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, EntityNotFoundError]
):
    """Handle entity not found errors."""


class EntityAlreadyExistsHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, EntityAlreadyExistsError]
):
    """Handle entity already exists errors."""


class ExpiredAuthTokenHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, ExpiredAuthTokenError]
):
    """Handle expired auth token errors."""


class InvalidAuthTokenHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, InvalidAuthTokenError]
):
    """Handle invalid auth token errors."""


class RealmDecodingHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, RealmDecodingError]
):
    """Handle realm decoding errors."""


class InputValidationHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, InputValidationError]
):
    """Handle input validation errors."""


class MultiInputValidationHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, MultiInputValidationError]
):
    """Handle multi input validation errors."""


class JSONDecodeHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, JSONDecodeError]
):
    """Handle JSON decode errors."""
