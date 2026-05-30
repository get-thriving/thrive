"""Token payload returned by Google's OAuth token endpoint."""

from jupiter.core.auth.sub.google.google_auth_code import GoogleAuthCode
from jupiter.core.auth.sub.google.refresh_token_plain import GoogleRefreshTokenPlain
from jupiter.framework.realm.realm import (
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import CompositeValue, value


@value
@only_in_realm(WebRealm)
class GoogleOAuthTokenResponse(CompositeValue):
    """Fields we read from Google's token endpoint response."""

    access_token: GoogleAuthCode
    id_token: str
    refresh_token: GoogleRefreshTokenPlain | None
