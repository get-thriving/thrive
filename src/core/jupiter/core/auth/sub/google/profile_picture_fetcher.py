"""Download the profile picture Google has for an account."""

import logging
import re
from typing import Final
from urllib.parse import urlsplit

import httpx
from jupiter.core.common.sub.images.sub.image.image_normaliser import MAX_INPUT_BYTES

LOGGER = logging.getLogger(__name__)

_HOST_SUFFIX: Final[str] = ".googleusercontent.com"
_TIMEOUT_SECONDS: Final[float] = 10.0
# The size Google serves is a suffix on the URL, `=s96-c` by default. We keep a
# 256 px picture, so ask for twice that and leave room to crop.
_SIZE_SUFFIX: Final[re.Pattern[str]] = re.compile(r"=s\d+(-c)?$")
_WANTED_SIZE_SUFFIX: Final[str] = "=s512-c"


class GoogleProfilePictureFetcher:
    """Download the profile picture Google has for an account.

    The URL comes out of a token or a response from Google, but it is still
    only followed if it is an https one on Google's own picture hosts, and
    never through a redirect, so that it cannot be turned on our network.
    """

    _transport: Final[httpx.AsyncBaseTransport | None]

    def __init__(self, transport: httpx.AsyncBaseTransport | None = None) -> None:
        """Constructor."""
        self._transport = transport

    @staticmethod
    def is_acceptable_url(picture_url: str) -> bool:
        """Whether the URL is one we would download."""
        parts = urlsplit(picture_url)
        try:
            port = parts.port
        except ValueError:
            return False
        host = parts.hostname or ""
        return (
            parts.scheme == "https"
            and host.endswith(_HOST_SUFFIX)
            and port is None
            and parts.username is None
            and parts.password is None
        )

    @staticmethod
    def with_wanted_size(picture_url: str) -> str:
        """The URL asking for the size we want."""
        if _SIZE_SUFFIX.search(picture_url):
            return _SIZE_SUFFIX.sub(_WANTED_SIZE_SUFFIX, picture_url)
        return picture_url

    async def fetch(self, picture_url: str) -> bytes | None:
        """Download it. Gives nothing, and says why in the log, if it can't."""
        if not self.is_acceptable_url(picture_url):
            LOGGER.warning("Not downloading a Google picture from an odd URL")
            return None

        try:
            async with httpx.AsyncClient(
                transport=self._transport,
                timeout=_TIMEOUT_SECONDS,
                follow_redirects=False,
            ) as http:
                async with http.stream(
                    "GET", self.with_wanted_size(picture_url)
                ) as response:
                    if response.status_code != 200:
                        LOGGER.warning(
                            "Google picture download answered %s", response.status_code
                        )
                        return None
                    content = bytearray()
                    async for chunk in response.aiter_bytes():
                        content.extend(chunk)
                        if len(content) > MAX_INPUT_BYTES:
                            LOGGER.warning("Google picture is too big, skipping it")
                            return None
                    return bytes(content)
        except httpx.HTTPError:
            LOGGER.warning("Google picture download failed", exc_info=True)
            return None
