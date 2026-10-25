"""An OAuth error to report to a client at the token endpoint."""


class OAuthTokenError(Exception):
    """An OAuth error to report to the client, per RFC 6749 section 5.2."""

    error: str
    description: str

    def __init__(self, error: str, description: str) -> None:
        """Constructor."""
        super().__init__(f"{error}: {description}")
        self.error = error
        self.description = description
