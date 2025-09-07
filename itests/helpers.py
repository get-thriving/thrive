"""Helpers for the tests."""

from typing import Type, TypeVar, cast

from jupiter_webapi_client.types import Response

T = TypeVar("T")
S = TypeVar("S")  # whatever the Response actually contains (may be a union)


def get_parsed_from_response(clazz: Type[T], response: Response[S]) -> T:
    """Get the parsed response as a specific type."""
    if response.status_code != 200:
        raise ValueError(f"Unexpected status code: {response.status_code}")
    if response.parsed is None:
        raise ValueError("Response parsed is None")
    # Optional safety: ensure it's the expected type at runtime
    if not isinstance(response.parsed, clazz):
        raise TypeError(
            f"Expected {clazz.__name__}, got {type(response.parsed).__name__}"
        )
    return cast(T, response.parsed)
