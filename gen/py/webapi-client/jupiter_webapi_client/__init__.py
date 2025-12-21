"""A client library for accessing The Web RPC API client for Thrive"""

from .client import AuthenticatedClient, Client

__all__ = (
    "AuthenticatedClient",
    "Client",
)
