"""User profile extracted from a Google OAuth callback."""

from jupiter.core.auth.sub.google.id_token_claims import GoogleIdTokenClaims
from jupiter.core.auth.sub.google.oauth_token_response import GoogleOAuthTokenResponse
from jupiter.core.auth.sub.google.refresh_token_encrypted import (
    GoogleRefreshTokenEncrypted,
)
from jupiter.core.auth.sub.google.subject_id import GoogleSubjectId
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.name import UserName
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.value import CompositeValue, value


@value
@only_in_realm(DatabaseRealm)
class GoogleUserInfo(CompositeValue):
    """Profile and credentials extracted from a Google OAuth authorisation."""

    google_subject_id: GoogleSubjectId
    email_address: EmailAddress
    user_name: UserName
    encrypted_refresh_token: GoogleRefreshTokenEncrypted | None

    @staticmethod
    def from_oauth(
        token_response: GoogleOAuthTokenResponse,
        claims: GoogleIdTokenClaims,
        *,
        refresh_token_encryption_key: str,
    ) -> "GoogleUserInfo":
        """Build user info from parsed token response and ID token claims."""
        encrypted_refresh_token: GoogleRefreshTokenEncrypted | None = None
        if token_response.refresh_token is not None:
            encrypted_refresh_token = GoogleRefreshTokenEncrypted.from_plain(
                token_response.refresh_token,
                refresh_token_encryption_key,
            )

        return GoogleUserInfo(
            google_subject_id=claims.sub,
            email_address=claims.email,
            user_name=claims.to_user_name(),
            encrypted_refresh_token=encrypted_refresh_token,
        )

    @staticmethod
    def from_id_token_claims(
        claims: GoogleIdTokenClaims,
        *,
        encrypted_refresh_token: GoogleRefreshTokenEncrypted | None = None,
    ) -> "GoogleUserInfo":
        """Build user info from OpenID profile claims (e.g. userinfo endpoint)."""
        return GoogleUserInfo(
            google_subject_id=claims.sub,
            email_address=claims.email,
            user_name=claims.to_user_name(),
            encrypted_refresh_token=encrypted_refresh_token,
        )
