from http import HTTPStatus
from typing import Any

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.time_plan_associate_with_big_plans_args import TimePlanAssociateWithBigPlansArgs
from ...models.time_plan_associate_with_big_plans_result import TimePlanAssociateWithBigPlansResult
from ...types import Response


def _get_kwargs(
    *,
    body: TimePlanAssociateWithBigPlansArgs,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "post",
        "url": "/time-plan-associate-with-big-plans",
    }

    _kwargs["json"] = body.to_dict()

    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Any | TimePlanAssociateWithBigPlansResult | None:
    if response.status_code == 200:
        response_200 = TimePlanAssociateWithBigPlansResult.from_dict(response.json())

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
) -> Response[Any | TimePlanAssociateWithBigPlansResult]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient,
    body: TimePlanAssociateWithBigPlansArgs,
) -> Response[Any | TimePlanAssociateWithBigPlansResult]:
    """Use case for creating activities starting from big plans.

    Args:
        body (TimePlanAssociateWithBigPlansArgs): Args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Any | TimePlanAssociateWithBigPlansResult]
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
    body: TimePlanAssociateWithBigPlansArgs,
) -> Any | TimePlanAssociateWithBigPlansResult | None:
    """Use case for creating activities starting from big plans.

    Args:
        body (TimePlanAssociateWithBigPlansArgs): Args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Any | TimePlanAssociateWithBigPlansResult
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient,
    body: TimePlanAssociateWithBigPlansArgs,
) -> Response[Any | TimePlanAssociateWithBigPlansResult]:
    """Use case for creating activities starting from big plans.

    Args:
        body (TimePlanAssociateWithBigPlansArgs): Args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Any | TimePlanAssociateWithBigPlansResult]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient,
    body: TimePlanAssociateWithBigPlansArgs,
) -> Any | TimePlanAssociateWithBigPlansResult | None:
    """Use case for creating activities starting from big plans.

    Args:
        body (TimePlanAssociateWithBigPlansArgs): Args.

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Any | TimePlanAssociateWithBigPlansResult
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
