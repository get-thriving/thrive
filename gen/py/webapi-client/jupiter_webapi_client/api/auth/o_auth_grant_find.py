from http import HTTPStatus
from typing import Any

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.o_auth_grant_find_args import OAuthGrantFindArgs
from ...models.o_auth_grant_find_result import OAuthGrantFindResult
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    body: OAuthGrantFindArgs | Unset = UNSET,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/o-auth-grant-find",
    }

    if not isinstance(body, Unset):
        _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | OAuthGrantFindResult | None:
    if response.status_code == 200:
        response_200 = OAuthGrantFindResult.from_dict(response.json())

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

    if response.status_code == 429:
        response_429 = ErrorResponse.from_dict(response.json())

        return response_429

    if response.status_code == 502:
        response_502 = ErrorResponse.from_dict(response.json())

        return response_502

    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[ErrorResponse | OAuthGrantFindResult]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient,
    body: OAuthGrantFindArgs | Unset = UNSET,
) -> Response[ErrorResponse | OAuthGrantFindResult]:
    """Use case for finding the OAuth grants a user has given.

    Only grants whose code was redeemed are real connections. A consent that was
    never followed through is not listed. Grants are private to the user who gave
    them, so this lists only the caller's own and needs no access grants.

    Args:
        body (OAuthGrantFindArgs | Unset): OAuth grant find args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | OAuthGrantFindResult]
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
    client: AuthenticatedClient,
    body: OAuthGrantFindArgs | Unset = UNSET,
) -> ErrorResponse | OAuthGrantFindResult | None:
    """Use case for finding the OAuth grants a user has given.

    Only grants whose code was redeemed are real connections. A consent that was
    never followed through is not listed. Grants are private to the user who gave
    them, so this lists only the caller's own and needs no access grants.

    Args:
        body (OAuthGrantFindArgs | Unset): OAuth grant find args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | OAuthGrantFindResult
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient,
    body: OAuthGrantFindArgs | Unset = UNSET,
) -> Response[ErrorResponse | OAuthGrantFindResult]:
    """Use case for finding the OAuth grants a user has given.

    Only grants whose code was redeemed are real connections. A consent that was
    never followed through is not listed. Grants are private to the user who gave
    them, so this lists only the caller's own and needs no access grants.

    Args:
        body (OAuthGrantFindArgs | Unset): OAuth grant find args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | OAuthGrantFindResult]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient,
    body: OAuthGrantFindArgs | Unset = UNSET,
) -> ErrorResponse | OAuthGrantFindResult | None:
    """Use case for finding the OAuth grants a user has given.

    Only grants whose code was redeemed are real connections. A consent that was
    never followed through is not listed. Grants are private to the user who gave
    them, so this lists only the caller's own and needs no access grants.

    Args:
        body (OAuthGrantFindArgs | Unset): OAuth grant find args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | OAuthGrantFindResult
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
