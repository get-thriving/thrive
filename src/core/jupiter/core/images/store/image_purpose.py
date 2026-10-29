"""What a stored image is used for."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ImagePurpose(EnumValue):
    """What a stored image is used for.

    Each purpose has its own bucket or directory, so a new use of images (for
    example pictures inside docs) gets a clean namespace and its own rules.
    """

    AVATARS = "avatars"
