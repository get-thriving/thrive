from http import HTTPStatus
from typing import Any

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.reset_password_args import ResetPasswordArgs
from ...models.reset_password_result import ResetPasswordResult
from ...types import Response


def _get_kwargs(
    *,
    body: ResetPasswordArgs,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/reset-password",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Any | ResetPasswordResult | None:
    if response.status_code == 200:
        response_200 = ResetPasswordResult.from_dict(response.json())

        return response_200

    if response.status_code == 400:
        response_400 = response.json()
        return response_400

    if response.status_code == 401:
        response_401 = response.json()
        return response_401

    if response.status_code == 404:
        response_404 = response.json()
        return response_404

    if response.status_code == 406:
        response_406 = response.json()
        return response_406

    if response.status_code == 409:
        response_409 = response.json()
        return response_409

    if response.status_code == 410:
        response_410 = response.json()
        return response_410

    if response.status_code == 422:
        response_422 = response.json()
        return response_422

    if response.status_code == 426:
        response_426 = response.json()
        return response_426

    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[Any | ResetPasswordResult]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: ResetPasswordArgs,
) -> Response[Any | ResetPasswordResult]:
    """Use case for reseting a password.

    Args:
        body (ResetPasswordArgs): Reset password args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Any | ResetPasswordResult]
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
    body: ResetPasswordArgs,
) -> Any | ResetPasswordResult | None:
    """Use case for reseting a password.

    Args:
        body (ResetPasswordArgs): Reset password args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Any | ResetPasswordResult
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient | Client,
    body: ResetPasswordArgs,
) -> Response[Any | ResetPasswordResult]:
    """Use case for reseting a password.

    Args:
        body (ResetPasswordArgs): Reset password args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Any | ResetPasswordResult]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient | Client,
    body: ResetPasswordArgs,
) -> Any | ResetPasswordResult | None:
    """Use case for reseting a password.

    Args:
        body (ResetPasswordArgs): Reset password args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Any | ResetPasswordResult
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
