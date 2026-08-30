"""Tests for the Google Maps location resolver."""

import asyncio
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.resolver.impl.google_maps import (
    GoogleMapsLocationResolver,
)


def _autocomplete_response(suggestions: list[dict[str, Any]]) -> MagicMock:
    response = MagicMock()
    response.json.return_value = {"suggestions": suggestions}
    response.raise_for_status.return_value = None
    return response


def _details_response(payload: dict[str, Any]) -> MagicMock:
    response = MagicMock()
    response.json.return_value = payload
    response.raise_for_status.return_value = None
    return response


def test_resolve_maps_autocomplete_and_details() -> None:
    resolver = GoogleMapsLocationResolver("test-key")
    autocomplete = _autocomplete_response(
        [
            {
                "placePrediction": {
                    "placeId": "ChIJ123",
                    "text": {"text": "Eiffel Tower, Paris, France"},
                    "structuredFormat": {
                        "mainText": {"text": "Eiffel Tower"},
                        "secondaryText": {"text": "Paris, France"},
                    },
                }
            }
        ]
    )
    details = _details_response(
        {
            "displayName": {"text": "Eiffel Tower"},
            "formattedAddress": "Av. Gustave Eiffel, Paris, France",
            "location": {"latitude": 48.8584, "longitude": 2.2945},
            "addressComponents": [
                {"types": ["country"], "shortText": "FR"},
            ],
        }
    )

    client = AsyncMock()
    client.post.return_value = autocomplete
    client.get.return_value = details
    client.__aenter__.return_value = client
    client.__aexit__.return_value = None

    with patch(
        "jupiter.core.common.sub.locations.resolver.impl.google_maps.httpx.AsyncClient",
        return_value=client,
    ):
        page = asyncio.run(resolver.resolve(SearchQuery("eiffel"), SearchLimit(5)))

    assert len(page.candidates) == 1
    candidate = page.candidates[0]
    assert str(candidate.name) == "Eiffel Tower"
    assert str(candidate.address_line) == "Av. Gustave Eiffel, Paris, France"
    assert str(candidate.country) == "FR"
    assert candidate.gps is not None
    assert candidate.gps.latitude == 48.8584
    assert candidate.source == "google-maps"
    assert candidate.source_id == "ChIJ123"


def test_resolve_skips_candidate_without_name() -> None:
    resolver = GoogleMapsLocationResolver("test-key")
    autocomplete = _autocomplete_response(
        [
            {
                "placePrediction": {
                    "placeId": "ChIJ123",
                    "text": {"text": "   "},
                }
            }
        ]
    )
    details = _details_response({})
    client = AsyncMock()
    client.post.return_value = autocomplete
    client.get.return_value = details
    client.__aenter__.return_value = client
    client.__aexit__.return_value = None

    with patch(
        "jupiter.core.common.sub.locations.resolver.impl.google_maps.httpx.AsyncClient",
        return_value=client,
    ):
        page = asyncio.run(resolver.resolve(SearchQuery("x"), SearchLimit(5)))

    assert page.candidates == []


def test_resolve_uses_autocomplete_text_when_details_fail() -> None:
    resolver = GoogleMapsLocationResolver("test-key")
    autocomplete = _autocomplete_response(
        [
            {
                "placePrediction": {
                    "placeId": "ChIJ123",
                    "text": {"text": "Louvre Museum, Paris"},
                    "structuredFormat": {
                        "mainText": {"text": "Louvre Museum"},
                        "secondaryText": {"text": "Paris, France"},
                    },
                }
            }
        ]
    )
    client = AsyncMock()
    client.post.return_value = autocomplete
    client.get.side_effect = Exception("details unavailable")
    client.__aenter__.return_value = client
    client.__aexit__.return_value = None

    with patch(
        "jupiter.core.common.sub.locations.resolver.impl.google_maps.httpx.AsyncClient",
        return_value=client,
    ):
        page = asyncio.run(resolver.resolve(SearchQuery("louvre"), SearchLimit(5)))

    assert len(page.candidates) == 1
    candidate = page.candidates[0]
    assert str(candidate.name) == "Louvre Museum"
    assert str(candidate.address_line) == "Paris, France"
    assert candidate.country is None
    assert candidate.gps is None
    assert candidate.source_id == "ChIJ123"
