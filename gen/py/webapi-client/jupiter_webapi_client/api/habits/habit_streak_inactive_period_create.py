from http import HTTPStatus
from typing import Any

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.error_response import ErrorResponse
from ...models.habit_streak_inactive_period_create_args import HabitStreakInactivePeriodCreateArgs
from ...models.habit_streak_inactive_period_create_result import HabitStreakInactivePeriodCreateResult
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    body: HabitStreakInactivePeriodCreateArgs | Unset = UNSET,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/habit-streak-inactive-period-create",
    }

    if not isinstance(body, Unset):
        _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> ErrorResponse | HabitStreakInactivePeriodCreateResult | None:
    if response.status_code == 200:
        response_200 = HabitStreakInactivePeriodCreateResult.from_dict(response.json())

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
) -> Response[ErrorResponse | HabitStreakInactivePeriodCreateResult]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient,
    body: HabitStreakInactivePeriodCreateArgs | Unset = UNSET,
) -> Response[ErrorResponse | HabitStreakInactivePeriodCreateResult]:
    """The command for creating a habit streak inactive period.

    Args:
        body (HabitStreakInactivePeriodCreateArgs | Unset): Habit streak inactive period create
            args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | HabitStreakInactivePeriodCreateResult]
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
    body: HabitStreakInactivePeriodCreateArgs | Unset = UNSET,
) -> ErrorResponse | HabitStreakInactivePeriodCreateResult | None:
    """The command for creating a habit streak inactive period.

    Args:
        body (HabitStreakInactivePeriodCreateArgs | Unset): Habit streak inactive period create
            args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | HabitStreakInactivePeriodCreateResult
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient,
    body: HabitStreakInactivePeriodCreateArgs | Unset = UNSET,
) -> Response[ErrorResponse | HabitStreakInactivePeriodCreateResult]:
    """The command for creating a habit streak inactive period.

    Args:
        body (HabitStreakInactivePeriodCreateArgs | Unset): Habit streak inactive period create
            args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[ErrorResponse | HabitStreakInactivePeriodCreateResult]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient,
    body: HabitStreakInactivePeriodCreateArgs | Unset = UNSET,
) -> ErrorResponse | HabitStreakInactivePeriodCreateResult | None:
    """The command for creating a habit streak inactive period.

    Args:
        body (HabitStreakInactivePeriodCreateArgs | Unset): Habit streak inactive period create
            args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        ErrorResponse | HabitStreakInactivePeriodCreateResult
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
