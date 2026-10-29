"""Turns whatever picture someone sent into the one image we keep."""

import io
from typing import Final

from jupiter.core.images.image_content_hash import ImageContentHash
from jupiter.core.images.normaliser.normalised_image import NormalisedImage
from jupiter.core.images.store.image_content_type import ImageContentType
from jupiter.framework.errors import InputValidationError
from PIL import Image, ImageCms, ImageOps

MAX_INPUT_BYTES: Final[int] = 4 * 1024 * 1024
# A small file can still unpack into a huge picture, so the size in pixels is
# checked off the header, before anything gets decoded.
MAX_INPUT_PIXELS: Final[int] = 40_000_000
MIN_SIDE_PIXELS: Final[int] = 128
OUTPUT_SIDE_PIXELS: Final[int] = 256
OUTPUT_QUALITY: Final[int] = 85

_ACCEPTED_FORMATS: Final[frozenset[str]] = frozenset({"JPEG", "PNG", "WEBP"})


class ImageNormaliser:
    """Turns whatever picture someone sent into the one image we keep.

    Everything that reaches the store, an upload or a picture fetched from a
    social login, goes through here, so the store only ever holds square WebP
    pictures of one bounded size with nothing else in them:

    - JPEG, PNG and WebP only. SVG can carry scripts, and HEIC needs a native
      decoder we have decided not to ship.
    - Rotated the way the camera meant it, and then stripped of all metadata:
      phones record where a picture was taken.
    - Colours moved to sRGB, since phones shoot in wider colour spaces that
      would look dull once the profile is gone.
    - Cropped square around the middle, and scaled down to at most 256 pixels.
      A picture is never scaled up, and one too small to look good is refused.
    - Animated pictures keep their first frame.

    It does the work of the CPU, so callers off the event loop should run it in
    a thread.
    """

    def normalise(self, raw: bytes) -> NormalisedImage:
        """Normalise a picture, or raise InputValidationError saying what is wrong."""
        if len(raw) > MAX_INPUT_BYTES:
            raise InputValidationError(
                f"The picture is too big: at most {MAX_INPUT_BYTES // (1024 * 1024)} MB"
            )

        try:
            with Image.open(io.BytesIO(raw)) as source:
                return self._normalise(source)
        except InputValidationError:
            raise
        except (OSError, SyntaxError, ValueError, Image.DecompressionBombError):
            # Not a picture at all, or cut short: Pillow reports both ways.
            raise InputValidationError("The picture could not be read") from None

    def _normalise(self, source: Image.Image) -> NormalisedImage:
        """Normalise a picture that has been opened but not yet decoded."""
        if source.format not in _ACCEPTED_FORMATS:
            raise InputValidationError("The picture has to be a JPEG, PNG or WebP")
        if source.width * source.height > MAX_INPUT_PIXELS:
            raise InputValidationError(
                f"The picture has too many pixels: at most {MAX_INPUT_PIXELS // 1_000_000} million"
            )

        icc_profile = source.info.get("icc_profile")
        source.load()
        # An animated picture is on its first frame once opened.
        oriented = ImageOps.exif_transpose(source)

        if min(oriented.size) < MIN_SIDE_PIXELS:
            raise InputValidationError(
                f"The picture is too small: at least {MIN_SIDE_PIXELS}x{MIN_SIDE_PIXELS} pixels"
            )

        side = min(OUTPUT_SIDE_PIXELS, *oriented.size)
        squared = ImageOps.fit(
            self._to_srgb(oriented, icc_profile),
            (side, side),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )

        output = io.BytesIO()
        # Nothing but pixels goes in: no exif, xmp or colour profile is passed along.
        squared.save(output, format="WEBP", quality=OUTPUT_QUALITY, method=4)
        content = output.getvalue()

        return NormalisedImage(
            content=content,
            content_type=ImageContentType.WEBP,
            content_hash=ImageContentHash.from_content(content),
            width=side,
            height=side,
        )

    @staticmethod
    def _to_srgb(image: Image.Image, icc_profile: bytes | None) -> Image.Image:
        """Bring a picture to RGB, or RGBA if it is see-through, in sRGB."""
        has_alpha = image.mode in ("RGBA", "LA", "PA") or (
            image.mode == "P" and "transparency" in image.info
        )
        target_mode = "RGBA" if has_alpha else "RGB"

        if icc_profile and image.mode in ("RGB", "RGBA"):
            try:
                converted = ImageCms.profileToProfile(
                    image,
                    ImageCms.ImageCmsProfile(io.BytesIO(icc_profile)),
                    ImageCms.createProfile("sRGB"),
                    outputMode=target_mode,
                )
            except (ImageCms.PyCMSError, OSError, ValueError):
                # A profile we can't make sense of is no reason to refuse the picture.
                converted = None
            if converted is not None:
                return converted

        return image.convert(target_mode)
