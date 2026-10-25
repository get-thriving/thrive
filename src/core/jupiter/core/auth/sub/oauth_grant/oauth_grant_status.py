"""Where an OAuth grant is in its life."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class OAuthGrantStatus(EnumValue):
    """Where an OAuth grant is in its life."""

    # The user approved it, and the app has not yet traded its code for tokens.
    PENDING = "pending"
    # The app holds tokens it can refresh.
    ACTIVE = "active"
    # The code or the refresh token ran out without being used.
    EXPIRED = "expired"
    # The user, or a reuse of a token, ended it.
    REVOKED = "revoked"
