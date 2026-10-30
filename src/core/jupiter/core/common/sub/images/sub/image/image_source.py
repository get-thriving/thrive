"""Where a stored image came from."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ImageSource(EnumValue):
    """Where a stored image came from.

    It decides who may replace it: a refresh from a social login only ever
    replaces a picture that same login brought, never one the user chose.
    """

    UPLOADED = "uploaded"
    GOOGLE = "google"
