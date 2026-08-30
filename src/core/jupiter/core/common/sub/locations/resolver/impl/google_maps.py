"""Google Maps Places Autocomplete location resolver."""

import logging
from typing import Any, Final

import httpx
from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.resolver.resolver import (
    LocationResolver,
    LocationResolverCandidate,
    LocationResolverMatchesPage,
)
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.framework.errors import InputValidationError

LOGGER = logging.getLogger(__name__)

_AUTOCOMPLETE_URL: Final[str] = "https://places.googleapis.com/v1/places:autocomplete"
_PLACE_DETAILS_URL: Final[str] = "https://places.googleapis.com/v1/places/{place_id}"
_SOURCE: Final[str] = "google-maps"
_DETAILS_FIELD_MASK: Final[str] = (
    "displayName,formattedAddress,location,addressComponents"
)


class GoogleMapsLocationResolver(LocationResolver):
    """Suggests locations via the Google Maps Places Autocomplete API."""

    _api_key: str

    def __init__(self, api_key: str) -> None:
        """Constructor."""
        self._api_key = api_key

    async def resolve(
        self,
        query: SearchQuery,
        limit: SearchLimit,
    ) -> LocationResolverMatchesPage:
        """Return candidate locations for ``query``."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            suggestions = await self._autocomplete(client, str(query), limit.the_limit)
            candidates: list[LocationResolverCandidate] = []
            for suggestion in suggestions:
                candidate = await self._candidate_from_suggestion(client, suggestion)
                if candidate is not None:
                    candidates.append(candidate)
            return LocationResolverMatchesPage(candidates=candidates)

    async def _autocomplete(
        self,
        client: httpx.AsyncClient,
        query: str,
        limit: int,
    ) -> list[dict[str, Any]]:
        response = await client.post(
            _AUTOCOMPLETE_URL,
            headers={
                "Content-Type": "application/json",
                "X-Goog-Api-Key": self._api_key,
            },
            json={"input": query},
        )
        response.raise_for_status()
        payload = response.json()
        suggestions = payload.get("suggestions") or []
        return suggestions[:limit]

    async def _candidate_from_suggestion(
        self,
        client: httpx.AsyncClient,
        suggestion: dict[str, Any],
    ) -> LocationResolverCandidate | None:
        prediction = suggestion.get("placePrediction") or {}
        place_id = prediction.get("placeId")
        structured = prediction.get("structuredFormat") or {}
        main_text = _text_of(structured.get("mainText"))
        secondary_text = _text_of(structured.get("secondaryText"))
        full_text = _text_of(prediction.get("text")) or main_text

        details: dict[str, Any] | None = None
        if isinstance(place_id, str) and place_id:
            try:
                details = await self._place_details(client, place_id)
            except Exception:
                LOGGER.warning(
                    "Failed to load Google Maps place details for %s",
                    place_id,
                    exc_info=True,
                )

        name_raw = (
            _text_of((details or {}).get("displayName")) or main_text or full_text
        )
        address_raw = (details or {}).get("formattedAddress") or secondary_text
        gps = _gps_from_details(details)
        country = _country_from_details(details)

        if not isinstance(name_raw, str):
            return None
        try:
            name = LocationName(name_raw)
        except InputValidationError:
            return None

        return LocationResolverCandidate(
            name=name,
            address_line=_optional_address(address_raw),
            country=country,
            gps=gps,
            source=_SOURCE,
            source_id=place_id if isinstance(place_id, str) else None,
        )

    async def _place_details(
        self,
        client: httpx.AsyncClient,
        place_id: str,
    ) -> dict[str, Any]:
        response = await client.get(
            _PLACE_DETAILS_URL.format(place_id=place_id),
            headers={
                "X-Goog-Api-Key": self._api_key,
                "X-Goog-FieldMask": _DETAILS_FIELD_MASK,
            },
        )
        response.raise_for_status()
        payload = response.json()
        return payload if isinstance(payload, dict) else {}


def _text_of(value: object) -> str | None:
    if isinstance(value, str) and value.strip():
        return value
    if isinstance(value, dict):
        text = value.get("text")
        if isinstance(text, str) and text.strip():
            return text
    return None


def _optional_address(raw: object) -> AddressLine | None:
    if not isinstance(raw, str) or not raw.strip():
        return None
    try:
        return AddressLine(raw)
    except InputValidationError:
        return None


def _gps_from_details(details: dict[str, Any] | None) -> GpsCoordinates | None:
    if details is None:
        return None
    location = details.get("location") or {}
    latitude = location.get("latitude")
    longitude = location.get("longitude")
    if not isinstance(latitude, (int, float)) or not isinstance(
        longitude, (int, float)
    ):
        return None
    try:
        return GpsCoordinates(latitude=float(latitude), longitude=float(longitude))
    except InputValidationError:
        return None


def _country_from_details(details: dict[str, Any] | None) -> CountryCode | None:
    if details is None:
        return None
    components = details.get("addressComponents") or []
    if not isinstance(components, list):
        return None
    for component in components:
        if not isinstance(component, dict):
            continue
        types = component.get("types") or []
        if "country" not in types:
            continue
        short_text = component.get("shortText") or component.get("short_text")
        if isinstance(short_text, str):
            try:
                return CountryCode(short_text)
            except InputValidationError:
                return None
    return None
