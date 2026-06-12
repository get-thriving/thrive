"""Exceptions handling for the Search mutation log drain do-all WebAPI cron."""

from jupiter.core.api_key.root import InvalidAPIKeyError
from jupiter.core.application.use_case.login_local import (
    InvalidLoginCredentialsError,
    InvalidLoginMethodError,
)
from jupiter.core.big_plans.sub.milestones.root import (
    BigPlanMilestoneAlreadyExistsForDateError,
)
from jupiter.core.common.sub.contacts.sub.contact.root import (
    ContactAlreadyExistsError,
    ContactInSignificantUseError,
)
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
from jupiter.core.workspaces.root import WorkspaceNotFoundError

from jupiter_webapi_search_mutation_log_drain_do_all.config import (
    JupiterExceptionHandler,
)


class UserAlreadyExistsHandler(JupiterExceptionHandler[UserAlreadyExistsError]):
    """Handle user already exists errors."""


class InvalidLoginCredentialsHandler(
    JupiterExceptionHandler[InvalidLoginCredentialsError]
):
    """Handle invalid login credentials errors."""


class InvalidLoginMethodHandler(JupiterExceptionHandler[InvalidLoginMethodError]):
    """Handle invalid login method errors."""


class InvalidAPIKeyErrorHandler(JupiterExceptionHandler[InvalidAPIKeyError]):
    """Handle invalid API key errors."""


class AspectInSignificantUseHandler(
    JupiterExceptionHandler[AspectInSignificantUseError]
):
    """Handle aspect in significant use errors."""


class UserNotFoundHandler(JupiterExceptionHandler[UserNotFoundError]):
    """Handle user not found errors."""


class WorkspaceNotFoundHandler(JupiterExceptionHandler[WorkspaceNotFoundError]):
    """Handle workspace not found errors."""


class TimePlanExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[TimePlanExistsForDatePeriodCombinationError]
):
    """Handle time plan exists for date period combination errors."""


class BigPlanMilestoneAlreadyExistsForDateHandler(
    JupiterExceptionHandler[BigPlanMilestoneAlreadyExistsForDateError]
):
    """Handle big plan milestone already exists for date errors."""


class JournalExistsForDatePeriodCombinationHandler(
    JupiterExceptionHandler[JournalExistsForDatePeriodCombinationError]
):
    """Handle journal exists for date period combination errors."""


class ContactAlreadyExistsHandler(JupiterExceptionHandler[ContactAlreadyExistsError]):
    """Handle contact already exists errors."""


class ContactInSignificantUseHandler(
    JupiterExceptionHandler[ContactInSignificantUseError]
):
    """Handle contact in significant use errors."""


class TagAlreadyExistsHandler(JupiterExceptionHandler[TagAlreadyExistsError]):
    """Handle tag already exists errors."""


class EntityIsAlreadyActiveHandler(JupiterExceptionHandler[EntityIsAlreadyActiveError]):
    """Handle entity is already active errors."""


class EntityIsAlreadyDraftHandler(JupiterExceptionHandler[EntityIsAlreadyDraftError]):
    """Handle entity is already draft errors."""
