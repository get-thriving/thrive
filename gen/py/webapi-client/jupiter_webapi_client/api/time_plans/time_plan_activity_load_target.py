from http import HTTPStatus
from typing import Any

import httpx2

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.time_plan_activity_load_target_args import TimePlanActivityLoadTargetArgs
from ...models.time_plan_activity_load_target_result import TimePlanActivityLoadTargetResult
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    body: TimePlanActivityLoadTargetArgs | Unset = UNSET,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/time-plan-activity-load-target",
    }

    if not isinstance(body, Unset):
        _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx2.Response
) -> ErrorResponse | TimePlanActivityLoadTargetResult | None:
    if response.status_code == 200:
        response_200 = TimePlanActivityLoadTargetResult.from_dict(response.json())

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
    *, client: AuthenticatedClient | Client, response: httpx2.Response
) -> Response[ErrorResponse | TimePlanActivityLoadTargetResult]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient,
    body: TimePlanActivityLoadTargetArgs | Unset = UNSET,
) -> Response[ErrorResponse | TimePlanActivityLoadTargetResult]:
    """Use case for loading a time plan activity and what it targets.

    For callers that name an activity or place events on it, and so need its
    target but none of the target's details.

    Args:
        body (TimePlanActivityLoadTargetArgs | Unset): TimePlanActivityLoadTarget args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx2.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | TimePlanActivityLoadTargetResult]
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
    body: TimePlanActivityLoadTargetArgs | Unset = UNSET,
) -> ErrorResponse | TimePlanActivityLoadTargetResult | None:
    """Use case for loading a time plan activity and what it targets.

    For callers that name an activity or place events on it, and so need its
    target but none of the target's details.

    Args:
        body (TimePlanActivityLoadTargetArgs | Unset): TimePlanActivityLoadTarget args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx2.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | TimePlanActivityLoadTargetResult
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient,
    body: TimePlanActivityLoadTargetArgs | Unset = UNSET,
) -> Response[ErrorResponse | TimePlanActivityLoadTargetResult]:
    """Use case for loading a time plan activity and what it targets.

    For callers that name an activity or place events on it, and so need its
    target but none of the target's details.

    Args:
        body (TimePlanActivityLoadTargetArgs | Unset): TimePlanActivityLoadTarget args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx2.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | TimePlanActivityLoadTargetResult]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient,
    body: TimePlanActivityLoadTargetArgs | Unset = UNSET,
) -> ErrorResponse | TimePlanActivityLoadTargetResult | None:
    """Use case for loading a time plan activity and what it targets.

    For callers that name an activity or place events on it, and so need its
    target but none of the target's details.

    Args:
        body (TimePlanActivityLoadTargetArgs | Unset): TimePlanActivityLoadTarget args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx2.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | TimePlanActivityLoadTargetResult
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
