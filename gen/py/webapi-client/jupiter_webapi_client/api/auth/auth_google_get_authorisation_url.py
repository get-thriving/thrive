from http import HTTPStatus
from typing import Any

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.auth_google_get_authorisation_url_args import AuthGoogleGetAuthorisationUrlArgs
from ...models.auth_google_get_authorisation_url_result import AuthGoogleGetAuthorisationUrlResult
from ...models.error_response import ErrorResponse
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    body: AuthGoogleGetAuthorisationUrlArgs | Unset = UNSET,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/auth-google-get-authorisation-url",
    }

    if not isinstance(body, Unset):
        _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> AuthGoogleGetAuthorisationUrlResult | ErrorResponse | None:
    if response.status_code == 200:
        response_200 = AuthGoogleGetAuthorisationUrlResult.from_dict(response.json())

        return response_200

    if response.status_code == 400:
        response_400 = ErrorResponse.from_dict(response.json())

        return response_400

    if response.status_code == 401:
        response_401 = ErrorResponse.from_dict(response.json())

        return response_401

    if response.status_code == 404:
        response_404 = ErrorResponse.from_dict(response.json())

        return response_404

    if response.status_code == 406:
        response_406 = ErrorResponse.from_dict(response.json())

        return response_406

    if response.status_code == 409:
        response_409 = ErrorResponse.from_dict(response.json())

        return response_409

    if response.status_code == 410:
        response_410 = ErrorResponse.from_dict(response.json())

        return response_410

    if response.status_code == 422:
        response_422 = ErrorResponse.from_dict(response.json())

        return response_422

    if response.status_code == 426:
        response_426 = ErrorResponse.from_dict(response.json())

        return response_426

    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[AuthGoogleGetAuthorisationUrlResult | ErrorResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: AuthGoogleGetAuthorisationUrlArgs | Unset = UNSET,
) -> Response[AuthGoogleGetAuthorisationUrlResult | ErrorResponse]:
    """Build a Google OAuth authorisation redirect URL.

    Args:
        body (AuthGoogleGetAuthorisationUrlArgs | Unset): Arguments for building a Google OAuth
            authorisation URL.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AuthGoogleGetAuthorisationUrlResult | ErrorResponse]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient | Client,
    body: AuthGoogleGetAuthorisationUrlArgs | Unset = UNSET,
) -> AuthGoogleGetAuthorisationUrlResult | ErrorResponse | None:
    """Build a Google OAuth authorisation redirect URL.

    Args:
        body (AuthGoogleGetAuthorisationUrlArgs | Unset): Arguments for building a Google OAuth
            authorisation URL.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AuthGoogleGetAuthorisationUrlResult | ErrorResponse
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: AuthGoogleGetAuthorisationUrlArgs | Unset = UNSET,
) -> Response[AuthGoogleGetAuthorisationUrlResult | ErrorResponse]:
    """Build a Google OAuth authorisation redirect URL.

    Args:
        body (AuthGoogleGetAuthorisationUrlArgs | Unset): Arguments for building a Google OAuth
            authorisation URL.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AuthGoogleGetAuthorisationUrlResult | ErrorResponse]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: AuthGoogleGetAuthorisationUrlArgs | Unset = UNSET,
) -> AuthGoogleGetAuthorisationUrlResult | ErrorResponse | None:
    """Build a Google OAuth authorisation redirect URL.

    Args:
        body (AuthGoogleGetAuthorisationUrlArgs | Unset): Arguments for building a Google OAuth
            authorisation URL.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AuthGoogleGetAuthorisationUrlResult | ErrorResponse
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
