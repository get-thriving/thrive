from http import HTTPStatus
from typing import Any

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.load_progress_reporter_token_args import LoadProgressReporterTokenArgs
from ...models.load_progress_reporter_token_result import LoadProgressReporterTokenResult
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    body: LoadProgressReporterTokenArgs | Unset = UNSET,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/load-progress-reporter-token",
    }

    if not isinstance(body, Unset):
        _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | LoadProgressReporterTokenResult | None:
    if response.status_code == 200:
        response_200 = LoadProgressReporterTokenResult.from_dict(response.json())

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
) -> Response[ErrorResponse | LoadProgressReporterTokenResult]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient,
    body: LoadProgressReporterTokenArgs | Unset = UNSET,
) -> Response[ErrorResponse | LoadProgressReporterTokenResult]:
    """The use case for retrieving summaries about entities.

    Args:
        body (LoadProgressReporterTokenArgs | Unset): Load progress reporter token args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | LoadProgressReporterTokenResult]
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
    body: LoadProgressReporterTokenArgs | Unset = UNSET,
) -> ErrorResponse | LoadProgressReporterTokenResult | None:
    """The use case for retrieving summaries about entities.

    Args:
        body (LoadProgressReporterTokenArgs | Unset): Load progress reporter token args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | LoadProgressReporterTokenResult
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient,
    body: LoadProgressReporterTokenArgs | Unset = UNSET,
) -> Response[ErrorResponse | LoadProgressReporterTokenResult]:
    """The use case for retrieving summaries about entities.

    Args:
        body (LoadProgressReporterTokenArgs | Unset): Load progress reporter token args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | LoadProgressReporterTokenResult]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient,
    body: LoadProgressReporterTokenArgs | Unset = UNSET,
) -> ErrorResponse | LoadProgressReporterTokenResult | None:
    """The use case for retrieving summaries about entities.

    Args:
        body (LoadProgressReporterTokenArgs | Unset): Load progress reporter token args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | LoadProgressReporterTokenResult
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
