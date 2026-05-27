"""A producer of auth tokens."""

from typing import Final

from jupiter.framework.auth.auth_token import AuthToken
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.secure import secure_class
from jupiter.framework.time_provider import TimeProvider


@secure_class
class AuthTokenStamper:
    """A producer of auth tokens."""

    _auth_token_secret: Final[str]
    _time_provider: Final[TimeProvider]

    def __init__(self, auth_token_secret: str, time_provider: TimeProvider) -> None:
        """Constructor."""
        self._auth_token_secret = auth_token_secret
        self._time_provider = time_provider

    def stamp_for_general_long(self, user_ref_id: EntityId) -> AuthToken:
        """Produce a token for a particular user and general modifications."""
        return AuthToken.new_for_general_long(
            secret=self._auth_token_secret,
            user_ref_id=user_ref_id,
            right_now=self._time_provider.get_current_time(),
        )

    def stamp_for_general_short(self, user_ref_id: EntityId) -> AuthToken:
        """Produce a token for a particular user and API modifications."""
        return AuthToken.new_for_general_short(
            secret=self._auth_token_secret,
            user_ref_id=user_ref_id,
            right_now=self._time_provider.get_current_time(),
        )

    def stamp_for_mcp(self, user_ref_id: EntityId) -> AuthToken:
        """Produce a token for a particular user and an MCP session."""
        return AuthToken.new_for_mcp(
            secret=self._auth_token_secret,
            user_ref_id=user_ref_id,
            right_now=self._time_provider.get_current_time(),
        )

    def stamp_for_progress_reporter(self, user_ref_id: EntityId) -> AuthToken:
        """Produce a token for progress reporting."""
        return AuthToken.new_for_progress_reporter(
            secret=self._auth_token_secret,
            user_ref_id=user_ref_id,
            right_now=self._time_provider.get_current_time(),
        )

    def verify_auth_token_general(self, auth_token_ext: AuthTokenExt) -> AuthToken:
        """Verify that a token is valid for a general use case."""
        return AuthToken.from_raw_general(
            secret=self._auth_token_secret, auth_token_raw=auth_token_ext.auth_token_str
        )

    def verify_auth_token_progress_reporter(
        self, auth_token_ext: AuthTokenExt
    ) -> AuthToken:
        """Verify that a token is valid for a progress reporting use case."""
        return AuthToken.from_raw_progress_reporter(
            secret=self._auth_token_secret, auth_token_raw=auth_token_ext.auth_token_str
        )
