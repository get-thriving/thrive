"""A user of jupiter."""

import abc

from jupiter.core.api_key.root import APIKey
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.email_verification.root import EmailVerificationAttempt
from jupiter.core.auth.sub.google.root import AuthGoogle
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.common.timezone import UTC, Timezone
from jupiter.core.features import (
    UserFeature,
    UserFeatureFlags,
    UserFeatureFlagsControls,
)
from jupiter.core.gamification.score_log import ScoreLog
from jupiter.core.mcp_key.root import MCPKey
from jupiter.core.users.avatar import Avatar
from jupiter.core.users.category import UserCategory
from jupiter.core.users.name import UserName
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsAtMostOne,
    ContainsMany,
    ContainsOne,
    IsRefId,
    RootEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
    RootEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


@entity
class User(RootEntity):
    """A user of jupiter."""

    category: UserCategory
    email_address: EmailAddress
    name: UserName
    avatar: Avatar
    timezone: Timezone
    feature_flags: UserFeatureFlags
    auth_method: UserAuthMethod
    verified: bool

    auth_local = ContainsAtMostOne(AuthLocal, user_ref_id=IsRefId())
    auth_google = ContainsAtMostOne(AuthGoogle, user_ref_id=IsRefId())
    email_verification_attempt = ContainsAtMostOne(
        EmailVerificationAttempt, user_ref_id=IsRefId()
    )
    score_log = ContainsOne(ScoreLog, user_ref_id=IsRefId())
    web_ui_settings = ContainsOne(WebUiSettings, user_ref_id=IsRefId())
    api_keys = ContainsMany(APIKey, user_ref_id=IsRefId())
    mcp_keys = ContainsMany(MCPKey, user_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_standard_user_local(
        ctx: DomainContext,
        email_address: EmailAddress,
        name: UserName,
        feature_flag_controls: UserFeatureFlagsControls,
        feature_flags: UserFeatureFlags,
    ) -> "User":
        """Create a new user."""
        return User._create(
            ctx,
            category=UserCategory.STANDARD,
            email_address=email_address,
            name=name,
            avatar=Avatar.from_user_name(name),
            timezone=UTC,
            feature_flags=feature_flag_controls.validate_and_complete(
                feature_flags_delta=feature_flags, current_feature_flags={}
            ),
            auth_method=UserAuthMethod.LOCAL,
            verified=False,
        )

    @staticmethod
    @create_entity_action
    def new_app_store_review_user(
        ctx: DomainContext,
        email_address: EmailAddress,
        name: UserName,
        feature_flag_controls: UserFeatureFlagsControls,
    ) -> "User":
        """Create a new user."""
        return User._create(
            ctx,
            category=UserCategory.APP_STORE_REVIEW,
            email_address=email_address,
            name=name,
            avatar=Avatar.from_user_name(name),
            timezone=UTC,
            feature_flags=feature_flag_controls.validate_and_complete(
                feature_flags_delta={}, current_feature_flags={}
            ),
            auth_method=UserAuthMethod.LOCAL,
            verified=False,
        )

    @staticmethod
    @create_entity_action
    def new_standard_user_google(
        ctx: DomainContext,
        email_address: EmailAddress,
        name: UserName,
        feature_flag_controls: UserFeatureFlagsControls,
        feature_flags: UserFeatureFlags,
    ) -> "User":
        """Create a new user with Google authentication."""
        return User._create(
            ctx,
            category=UserCategory.STANDARD,
            email_address=email_address,
            name=name,
            avatar=Avatar.from_user_name(name),
            timezone=UTC,
            feature_flags=feature_flag_controls.validate_and_complete(
                feature_flags_delta=feature_flags, current_feature_flags={}
            ),
            auth_method=UserAuthMethod.GOOGLE,
            verified=False,
        )

    @update_entity_action
    def sync_google_profile(
        self,
        ctx: DomainContext,
        name: UserName,
        email_address: EmailAddress,
    ) -> "User":
        """Update profile fields from a Google account sync."""
        return self._new_version(
            ctx,
            name=name,
            email_address=email_address,
            avatar=Avatar.from_user_name(name),
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[UserName],
        timezone: UpdateAction[Timezone],
    ) -> "User":
        """Update properties of the user."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            avatar=name.transform(lambda n: Avatar.from_user_name(n)).or_else(
                self.avatar
            ),
            timezone=timezone.or_else(self.timezone),
        )

    @update_entity_action
    def change_feature_flags(
        self,
        ctx: DomainContext,
        feature_flag_controls: UserFeatureFlagsControls,
        feature_flags: UserFeatureFlags,
    ) -> "User":
        """Change the feature settings for this user."""
        return self._new_version(
            ctx,
            feature_flags=feature_flag_controls.validate_and_complete(
                feature_flags_delta=feature_flags,
                current_feature_flags=self.feature_flags,
            ),
        )

    def is_feature_available(self, feature: UserFeature) -> bool:
        """Check if a feature is available for this user."""
        return self.feature_flags[feature]

    @update_entity_action
    def verify_email(self, ctx: DomainContext) -> "User":
        """Mark this user's email as verified."""
        return self._new_version(ctx, verified=True)

    @property
    def should_go_through_onboarding_flow(self) -> bool:
        """Return whether the user should go through the onboarding flow."""
        return self.category == UserCategory.STANDARD


class UserAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a user already exists."""


class UserAlreadyExistsButIsArchivedError(EntityAlreadyExistsError):
    """Error raised when a user already exists but is archived."""


class UserNotFoundError(EntityNotFoundError):
    """Error raised when a user does not exist."""


class UserIsUnverifiedError(Exception):
    """Error raised when a user's email is not verified."""


class UserRepository(RootEntityRepository[User], abc.ABC):
    """A repository for users."""

    @abc.abstractmethod
    async def load_by_email_address(self, email_address: EmailAddress) -> User:
        """Load a user given their email address."""

    @abc.abstractmethod
    async def find_all_unarchived_by_auth_method(
        self, auth_method: UserAuthMethod
    ) -> list[User]:
        """Find all unarchived users with the given auth method."""
