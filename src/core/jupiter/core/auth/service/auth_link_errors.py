"""Errors raised while linking or unlinking an auth method."""


class AuthLinkError(Exception):
    """Base for errors the user can fix by choosing differently."""


class AuthMethodAlreadyLinkedError(AuthLinkError):
    """Raised when the user already has a record for the auth method."""


class ProviderAccountLinkedElsewhereError(AuthLinkError):
    """Raised when the provider account already belongs to another user."""


class CannotRemoveLastAuthMethodError(AuthLinkError):
    """Raised when unlinking would leave the user with no way to sign in."""


class AuthMethodNotLinkedError(AuthLinkError):
    """Raised when unlinking an auth method the user never linked."""
