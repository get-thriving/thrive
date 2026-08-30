"""Location resolver implementations (``noop``, ``google_maps``)."""

from jupiter.core.backend_blend import JupiterWebApiLocationResolver
from jupiter.core.common.sub.locations.resolver.impl.google_maps import (
    GoogleMapsLocationResolver,
)
from jupiter.core.common.sub.locations.resolver.impl.noop import NoOpLocationResolver
from jupiter.core.common.sub.locations.resolver.resolver import LocationResolver


def build_location_resolver(
    backend: JupiterWebApiLocationResolver,
    google_maps_api_key: str = "",
) -> LocationResolver:
    """Construct the location resolver for a blend token."""
    if backend == JupiterWebApiLocationResolver.GOOGLE_MAPS:
        if not google_maps_api_key:
            raise Exception(
                "GOOGLE_MAPS_API_KEY is required when WEBAPI_LOCATION_RESOLVER=google-maps"
            )
        return GoogleMapsLocationResolver(google_maps_api_key)
    return NoOpLocationResolver()
