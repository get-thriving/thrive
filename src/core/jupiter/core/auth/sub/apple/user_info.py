"""User profile extracted from an Apple OAuth callback."""

import json

from jupiter.core.auth.sub.apple.id_token_claims import AppleIdTokenClaims
from jupiter.core.auth.sub.apple.oauth_token_response import AppleOAuthTokenResponse
from jupiter.core.auth.sub.apple.refresh_token_encrypted import (
    AppleRefreshTokenEncrypted,
)
from jupiter.core.auth.sub.apple.subject_id import AppleSubjectId
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.name import UserName
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.value import CompositeValue, value


@value
@only_in_realm(DatabaseRealm)
class AppleUserInfo(CompositeValue):
    """Profile and credentials extracted from an Apple OAuth authorisation."""

    apple_subject_id: AppleSubjectId
    email_address: EmailAddress
    user_name: UserName
    verified: bool
    encrypted_refresh_token: AppleRefreshTokenEncrypted | None

    @staticmethod
    def from_oauth(
        token_response: AppleOAuthTokenResponse,
        claims: AppleIdTokenClaims,
        *,
        user_json: str | None,
        refresh_token_encryption_key: str,
    ) -> "AppleUserInfo":
        """Build user info from the token response, ID token, and first-sign-in name."""
        encrypted_refresh_token: AppleRefreshTokenEncrypted | None = None
        if token_response.refresh_token is not None:
            encrypted_refresh_token = AppleRefreshTokenEncrypted.from_plain(
                token_response.refresh_token,
                refresh_token_encryption_key,
            )

        return AppleUserInfo(
            apple_subject_id=claims.sub,
            email_address=claims.email,
            user_name=AppleUserInfo.user_name_from_apple_user_json(
                user_json, claims.email
            ),
            verified=claims.email_verified,
            encrypted_refresh_token=encrypted_refresh_token,
        )

    @staticmethod
    def user_name_from_apple_user_json(
        user_json: str | None, email_address: EmailAddress
    ) -> UserName:
        """Resolve a display name from Apple's first-sign-in user payload.

        Apple sends the name only once, in the ``user`` form field. Later sign-ins
        fall back to the email local-part, matching ``GoogleIdTokenClaims.to_user_name``.
        """
        if user_json:
            try:
                payload = json.loads(user_json)
            except json.JSONDecodeError:
                payload = None
            if isinstance(payload, dict):
                name = payload.get("name")
                if isinstance(name, dict):
                    first = name.get("firstName")
                    last = name.get("lastName")
                    parts = [
                        part.strip()
                        for part in (first, last)
                        if isinstance(part, str) and part.strip()
                    ]
                    if parts:
                        return UserName(" ".join(parts))
        return UserName(email_address.the_address.split("@", maxsplit=1)[0])
