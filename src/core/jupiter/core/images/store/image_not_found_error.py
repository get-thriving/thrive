"""Raised when the store has no image at a path."""

from jupiter.framework.storage.repository import EntityNotFoundError


class ImageNotFoundError(EntityNotFoundError):
    """Raised when the store has no image at a path.

    An entity not found error, so that the WebAPI answers it with a 404.
    """
