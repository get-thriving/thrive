"""A link to serve an image from, and for how long it is good."""

from jupiter.core.common.sub.images.sub.image.image_url import ImageUrl
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.value import CompositeValue, value


@value
class ImageLink(CompositeValue):
    """A link to serve an image from, and for how long it is good.

    Public stores hand out links that never expire. A store that signs its
    links (a private bucket) would set ``expires_at``, and callers must not
    keep such a link around past that moment.
    """

    url: ImageUrl
    expires_at: Timestamp | None
