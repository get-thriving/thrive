"""Tests for the image normaliser."""

import io

import pytest
from jupiter.core.common.sub.images.sub.image.image_content_hash import ImageContentHash
from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.core.common.sub.images.sub.image.image_normaliser import (
    MAX_INPUT_BYTES,
    ImageNormaliser,
)
from jupiter.framework.errors import InputValidationError
from PIL import Image, ImageCms

_RED = (220, 30, 30)
_BLUE = (30, 30, 220)


def _encode(image: Image.Image, image_format: str, **options: object) -> bytes:
    output = io.BytesIO()
    image.save(output, format=image_format, **options)
    return output.getvalue()


def _solid(
    size: tuple[int, int], colour: tuple[int, ...], mode: str = "RGB"
) -> Image.Image:
    return Image.new(mode, size, colour)


def _two_halves(
    size: tuple[int, int], left: tuple[int, int, int], right: tuple[int, int, int]
) -> Image.Image:
    image = Image.new("RGB", size, left)
    image.paste(right, (size[0] // 2, 0, size[0], size[1]))
    return image


def _open(content: bytes) -> Image.Image:
    return Image.open(io.BytesIO(content))


def _close_to(pixel: tuple[int, ...], expected: tuple[int, int, int]) -> bool:
    return all(abs(a - b) <= 30 for a, b in zip(pixel[:3], expected, strict=True))


def _normalise(raw: bytes):  # type: ignore[no-untyped-def]
    return ImageNormaliser().normalise(raw)


def test_a_big_photo_becomes_a_small_square_webp() -> None:
    result = _normalise(_encode(_solid((1600, 1200), _RED), "JPEG"))

    assert result.content_type == ImageContentType.WEBP
    assert (result.width, result.height) == (256, 256)
    stored = _open(result.content)
    assert stored.format == "WEBP"
    assert stored.size == (256, 256)
    assert result.size_in_bytes == len(result.content)
    assert result.content_hash == ImageContentHash.from_content(result.content)


def test_the_crop_is_taken_from_the_middle() -> None:
    # 600x300, red on the left half and blue on the right: the middle 300x300 is half each.
    result = _normalise(_encode(_two_halves((600, 300), _RED, _BLUE), "PNG"))

    stored = _open(result.content).convert("RGB")
    assert _close_to(stored.getpixel((10, 128)), _RED)
    assert _close_to(stored.getpixel((245, 128)), _BLUE)


def test_a_picture_is_never_scaled_up() -> None:
    result = _normalise(_encode(_solid((180, 400), _RED), "PNG"))

    assert (result.width, result.height) == (180, 180)
    assert _open(result.content).size == (180, 180)


def test_the_smallest_acceptable_picture_is_kept_as_it_is() -> None:
    result = _normalise(_encode(_solid((128, 128), _RED), "PNG"))

    assert (result.width, result.height) == (128, 128)


@pytest.mark.parametrize("size", [(127, 500), (500, 127), (50, 50)])
def test_a_picture_too_small_is_refused(size: tuple[int, int]) -> None:
    with pytest.raises(InputValidationError, match="too small"):
        _normalise(_encode(_solid(size, _RED), "PNG"))


def test_the_camera_rotation_is_applied() -> None:
    # Stored 300x200 with the top half red. Orientation 6 means "turn it a quarter
    # clockwise to look at it", which puts the stored top edge on the right.
    stored = Image.new("RGB", (300, 200), _BLUE)
    stored.paste(_RED, (0, 0, 300, 100))
    exif = Image.Exif()
    exif[0x0112] = 6

    result = _normalise(_encode(stored, "JPEG", exif=exif.tobytes(), quality=95))

    shown = _open(result.content).convert("RGB")
    assert shown.size == (200, 200)
    assert _close_to(shown.getpixel((190, 100)), _RED)
    assert _close_to(shown.getpixel((10, 100)), _BLUE)


def test_a_rotated_picture_is_judged_by_how_it_ends_up() -> None:
    # 300x100 on disk, but shown 100x300: too small either way.
    exif = Image.Exif()
    exif[0x0112] = 6
    with pytest.raises(InputValidationError, match="too small"):
        _normalise(_encode(_solid((300, 100), _RED), "JPEG", exif=exif.tobytes()))


def test_where_the_photo_was_taken_does_not_survive() -> None:
    exif = Image.Exif()
    exif[0x010F] = "SomePhoneMaker"  # Make
    gps = exif.get_ifd(0x8825)
    gps[1] = "N"
    gps[2] = (48.0, 51.0, 24.0)
    gps[3] = "E"
    gps[4] = (2.0, 17.0, 40.0)
    photo = _encode(_solid((600, 600), _RED), "JPEG", exif=exif.tobytes())
    assert b"SomePhoneMaker" in photo  # the fixture really carries it

    result = _normalise(photo)

    assert b"SomePhoneMaker" not in result.content
    assert b"EXIF" not in result.content
    stored = _open(result.content)
    assert not stored.getexif()
    assert "exif" not in stored.info
    assert "xmp" not in stored.info


def test_a_colour_profile_is_applied_and_dropped() -> None:
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
    photo = _encode(_solid((400, 400), _RED), "JPEG", icc_profile=srgb, quality=95)

    result = _normalise(photo)

    stored = _open(result.content)
    assert "icc_profile" not in stored.info
    assert _close_to(stored.convert("RGB").getpixel((100, 100)), _RED)


def test_a_colour_profile_nobody_can_read_is_ignored() -> None:
    photo = _encode(_solid((400, 400), _RED), "JPEG", icc_profile=b"not a profile")

    result = _normalise(photo)

    assert _close_to(_open(result.content).convert("RGB").getpixel((100, 100)), _RED)


def test_transparency_is_kept() -> None:
    image = _solid((300, 300), (220, 30, 30, 0), "RGBA")

    result = _normalise(_encode(image, "PNG"))

    stored = _open(result.content)
    assert stored.mode == "RGBA"
    assert stored.getpixel((100, 100))[3] == 0


def test_a_palette_picture_with_transparency_keeps_it() -> None:
    image = Image.new("P", (300, 300), 0)
    image.putpalette([220, 30, 30] + [0] * 765)

    result = _normalise(_encode(image, "PNG", transparency=0))

    assert _open(result.content).mode == "RGBA"


def test_a_cmyk_photo_comes_out_as_ordinary_colours() -> None:
    result = _normalise(_encode(_solid((300, 300), _RED).convert("CMYK"), "JPEG"))

    assert _open(result.content).convert("RGB").getpixel((100, 100))[0] > 150


def test_an_animated_picture_keeps_its_first_frame() -> None:
    red = _solid((300, 300), _RED)
    blue = _solid((300, 300), _BLUE)
    animated = _encode(red, "WEBP", save_all=True, append_images=[blue], duration=100)
    assert getattr(_open(animated), "n_frames", 1) == 2  # the fixture really moves

    result = _normalise(animated)

    stored = _open(result.content)
    assert getattr(stored, "n_frames", 1) == 1
    assert _close_to(stored.convert("RGB").getpixel((100, 100)), _RED)


def test_the_same_picture_always_gives_the_same_bytes() -> None:
    photo = _encode(_two_halves((500, 500), _RED, _BLUE), "JPEG")

    assert _normalise(photo).content_hash == _normalise(photo).content_hash


@pytest.mark.parametrize("image_format", ["JPEG", "PNG", "WEBP"])
def test_each_accepted_format_works(image_format: str) -> None:
    result = _normalise(_encode(_solid((300, 300), _RED), image_format))

    assert (result.width, result.height) == (256, 256)


@pytest.mark.parametrize("image_format", ["GIF", "BMP", "TIFF"])
def test_other_formats_are_refused(image_format: str) -> None:
    with pytest.raises(InputValidationError, match="JPEG, PNG or WebP"):
        _normalise(_encode(_solid((300, 300), _RED), image_format))


def test_svg_is_refused() -> None:
    svg = b'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><script>alert(1)</script></svg>'

    with pytest.raises(InputValidationError, match="could not be read"):
        _normalise(svg)


@pytest.mark.parametrize("junk", [b"", b"hello", bytes(range(256)) * 10])
def test_things_that_are_not_pictures_are_refused(junk: bytes) -> None:
    with pytest.raises(InputValidationError, match="could not be read"):
        _normalise(junk)


def test_a_picture_cut_short_is_refused() -> None:
    photo = _encode(_two_halves((800, 800), _RED, _BLUE), "JPEG")

    with pytest.raises(InputValidationError, match="could not be read"):
        _normalise(photo[: len(photo) // 2])


def test_a_file_that_is_too_big_is_refused_before_it_is_looked_at() -> None:
    with pytest.raises(InputValidationError, match="too big"):
        _normalise(b"\x00" * (MAX_INPUT_BYTES + 1))


def test_a_small_file_with_far_too_many_pixels_is_refused() -> None:
    # A solid colour packs into almost nothing, and unpacks into 49 million pixels.
    bomb = _encode(_solid((7000, 7000), _RED), "PNG")
    assert len(bomb) < MAX_INPUT_BYTES

    with pytest.raises(InputValidationError, match="too many pixels"):
        _normalise(bomb)
