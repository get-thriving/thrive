"""An OAuth grant: a user's consent to let a client use the MCP server in their name."""

from typing import Final
from urllib.parse import urlsplit

from jupiter.core.auth.sub.oauth_grant.client_id import OAuthClientId
from jupiter.core.auth.sub.oauth_grant.oauth_grant_status import OAuthGrantStatus
from jupiter.core.auth.sub.oauth_grant.oauth_grant_summary import OAuthGrantSummary
from jupiter.core.auth.sub.oauth_grant.oauth_secret_hash import OAuthSecretHash
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.core.auth.sub.oauth_grant.pkce_code_challenge import PkceCodeChallenge
from jupiter.core.auth.sub.oauth_grant.pkce_code_verifier import PkceCodeVerifier
from jupiter.core.auth.sub.oauth_grant.resource import OAuthResource
from jupiter.core.common.system_url import SystemUrl
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.secure import secure_class

CODE_EXPIRES_IN_MINS: Final[int] = 10
REFRESH_EXPIRES_IN_MINS: Final[int] = 60 * 24 * 30
DEFAULT_OAUTH_GRANT_NAME: Final[EntityName] = EntityName("OAuth Grant")

# Redirect URIs a client may use besides a loopback address (RFC 8252). Entries are
# exact matches, taken from each vendor's documentation.
ALLOWED_REDIRECT_URIS: Final[frozenset[str]] = frozenset(
    (
        "https://claude.ai/api/mcp/auth_callback",
        "https://claude.com/api/mcp/auth_callback",
        # ChatGPT's stable callback. It is only used with authorization servers that
        # support issuer identification (RFC 9207); otherwise ChatGPT uses a callback
        # per app, https://chatgpt.com/connector/oauth/{callback_id}, which is not
        # allowed here.
        "https://chatgpt.com/connector_platform_oauth_redirect",
    )
)
_LOOPBACK_HOSTS: Final[frozenset[str]] = frozenset(("localhost", "127.0.0.1", "::1"))


class InvalidOAuthRequestError(Exception):
    """Error raised when an OAuth request is malformed or not allowed."""


class InvalidOAuthGrantError(Exception):
    """Error raised when a code or refresh token does not match a live grant."""


def check_redirect_uri(redirect_uri: SystemUrl) -> None:
    """Check that a redirect URI is a loopback one or on the allow list."""
    if redirect_uri.the_url in ALLOWED_REDIRECT_URIS:
        return
    parts = urlsplit(redirect_uri.the_url)
    if (
        parts.scheme == "http"
        and parts.hostname in _LOOPBACK_HOSTS
        and not parts.fragment
    ):
        return
    raise InvalidOAuthRequestError("Redirect URI is not allowed")


@entity("User")
@secure_class
@only_in_realm(DatabaseRealm)
class OAuthGrant(LeafSupportEntity):
    """A user's consent for a client, with its one-time code and rotating refresh token."""

    user: ParentLink
    client_id: OAuthClientId
    redirect_uri: SystemUrl
    resource: OAuthResource
    code_challenge: PkceCodeChallenge
    code_hash: OAuthSecretHash
    code_redeemed: bool
    # Never null: the storage layer can't hold a missing secret hash. Until the code is
    # redeemed they hold the hash of a random secret nobody has, so nothing matches.
    refresh_hash: OAuthSecretHash
    previous_refresh_hash: OAuthSecretHash
    refresh_issued_time: Timestamp | None

    @staticmethod
    @create_entity_action
    def new_grant(
        ctx: DomainContext,
        user_ref_id: EntityId,
        client_id: OAuthClientId,
        redirect_uri: SystemUrl,
        resource: OAuthResource,
        code_challenge: PkceCodeChallenge,
        code_plain: OAuthSecretPlain,
    ) -> "OAuthGrant":
        """Create a grant, waiting for its code to be redeemed."""
        check_redirect_uri(redirect_uri)
        return OAuthGrant._create(
            ctx,
            name=DEFAULT_OAUTH_GRANT_NAME,
            user=ParentLink(user_ref_id),
            client_id=client_id,
            redirect_uri=redirect_uri,
            resource=resource,
            code_challenge=code_challenge,
            code_hash=OAuthSecretHash.from_plain(code_plain),
            code_redeemed=False,
            refresh_hash=OAuthSecretHash.from_plain(OAuthSecretPlain.generate()),
            previous_refresh_hash=OAuthSecretHash.from_plain(
                OAuthSecretPlain.generate()
            ),
            refresh_issued_time=None,
        )

    @update_entity_action
    def redeem_code(
        self,
        ctx: DomainContext,
        right_now: Timestamp,
        code_plain: OAuthSecretPlain,
        code_verifier: PkceCodeVerifier,
        client_id: OAuthClientId,
        redirect_uri: SystemUrl,
        resource: OAuthResource,
        new_refresh_plain: OAuthSecretPlain,
    ) -> "OAuthGrant":
        """Redeem the one-time code, starting the refresh token chain."""
        if self.code_redeemed:
            raise InvalidOAuthGrantError("Code was already redeemed")
        if right_now >= self.created_time.add_minutes(CODE_EXPIRES_IN_MINS):
            raise InvalidOAuthGrantError("Code has expired")
        if not self.code_hash.check_against(code_plain):
            raise InvalidOAuthGrantError("Code does not match")
        if (
            client_id != self.client_id
            or redirect_uri != self.redirect_uri
            or resource != self.resource
        ):
            raise InvalidOAuthGrantError("Request does not match the authorization")
        if not self.code_challenge.matches(code_verifier):
            raise InvalidOAuthGrantError("PKCE verifier does not match")
        return self._new_version(
            ctx,
            code_redeemed=True,
            refresh_hash=OAuthSecretHash.from_plain(new_refresh_plain),
            refresh_issued_time=right_now,
        )

    @update_entity_action
    def rotate_refresh(
        self,
        ctx: DomainContext,
        right_now: Timestamp,
        refresh_plain: OAuthSecretPlain,
        client_id: OAuthClientId,
        new_refresh_plain: OAuthSecretPlain,
    ) -> "OAuthGrant":
        """Swap the refresh token for a new one; the old one stops working."""
        if client_id != self.client_id:
            raise InvalidOAuthGrantError("Request does not match the authorization")
        if not self.code_redeemed or self.refresh_issued_time is None:
            raise InvalidOAuthGrantError("Grant has no refresh token")
        if right_now >= self.refresh_issued_time.add_minutes(REFRESH_EXPIRES_IN_MINS):
            raise InvalidOAuthGrantError("Refresh token has expired")
        if not self.refresh_hash.check_against(refresh_plain):
            raise InvalidOAuthGrantError("Refresh token does not match")
        return self._new_version(
            ctx,
            previous_refresh_hash=self.refresh_hash,
            refresh_hash=OAuthSecretHash.from_plain(new_refresh_plain),
            refresh_issued_time=right_now,
        )

    def was_previous_refresh(self, refresh_plain: OAuthSecretPlain) -> bool:
        """Whether the token is the one just replaced, which means it was replayed."""
        return self.code_redeemed and self.previous_refresh_hash.check_against(
            refresh_plain
        )

    def status_at(self, right_now: Timestamp) -> OAuthGrantStatus:
        """Where this grant is in its life at the given time."""
        if self.archived:
            return OAuthGrantStatus.REVOKED
        expires_time = self.expires_time
        if expires_time is not None and right_now >= expires_time:
            return OAuthGrantStatus.EXPIRED
        if not self.code_redeemed:
            return OAuthGrantStatus.PENDING
        return OAuthGrantStatus.ACTIVE

    @property
    def expires_time(self) -> Timestamp | None:
        """When the code, or once redeemed the refresh token, runs out."""
        if self.code_redeemed and self.refresh_issued_time is not None:
            return self.refresh_issued_time.add_minutes(REFRESH_EXPIRES_IN_MINS)
        return self.created_time.add_minutes(CODE_EXPIRES_IN_MINS)

    def summary_at(self, right_now: Timestamp) -> OAuthGrantSummary:
        """Get the summary of this grant at the given time."""
        return OAuthGrantSummary(
            ref_id=self.ref_id,
            client_id=self.client_id,
            redirect_uri=self.redirect_uri,
            status=self.status_at(right_now),
            created_time=self.created_time,
            refresh_issued_time=self.refresh_issued_time,
            expires_time=self.expires_time,
            archived=self.archived,
        )
