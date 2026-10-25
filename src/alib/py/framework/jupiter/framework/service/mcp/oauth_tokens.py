"""The tokens an MCP service hands back to an OAuth client."""

from jupiter.framework.value import SecretValue, secret_value


@secret_value
class OAuthTokens(SecretValue):
    """The tokens handed back to a client: an access token, and the next refresh token."""

    access_token: str
    refresh_token: str
    expires_in: int
