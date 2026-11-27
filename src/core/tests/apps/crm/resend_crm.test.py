"""Tests for the Resend CRM, against a mocked Resend API."""

import asyncio
import json
from types import SimpleNamespace
from typing import Callable, cast
from unittest.mock import patch

import httpx
from jupiter.core.apps.crm.crm import CrmDeploymentContext
from jupiter.core.apps.crm.entity_indexing_record import CRMEntityIndexingRecord
from jupiter.core.apps.crm.impl.resend import ResendCRM
from jupiter.core.env import Env
from jupiter.core.instance import Instance
from jupiter.core.universe import Universe
from jupiter.core.users.root import User

Handler = Callable[[httpx.Request], httpx.Response]

DEPLOYMENT = CrmDeploymentContext(
    universe=Universe("thrive"), env=Env("production"), instance=Instance("main")
)
USER = cast(
    User,
    SimpleNamespace(ref_id="7", name="Ada", email_address="ada@example.com"),
)


def _record(object_id: str, revision: int = 3) -> CRMEntityIndexingRecord:
    return cast(
        CRMEntityIndexingRecord,
        SimpleNamespace(object_id=object_id, revision=revision, entity_ref_id="7"),
    )


def _crm(handler: Handler, calls: list[httpx.Request]) -> ResendCRM:
    def recording(request: httpx.Request) -> httpx.Response:
        calls.append(request)
        return handler(request)

    client = httpx.AsyncClient(transport=httpx.MockTransport(recording))
    return ResendCRM(api_key="re_test", deployment=DEPLOYMENT, client=client)


def _summary(calls: list[httpx.Request]) -> list[str]:
    return [f"{c.method} {c.url.path}" for c in calls]


def _body(request: httpx.Request) -> dict[str, object]:
    return cast(dict[str, object], json.loads(request.content))


def test_creates_a_contact_for_a_new_user() -> None:
    calls: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/contact-properties":
            return httpx.Response(200, json={"id": "p"})
        if request.method == "PATCH":
            return httpx.Response(404, json={"name": "not_found"})
        return httpx.Response(200, json={"object": "contact", "id": "c-new"})

    async def run() -> None:
        crm = _crm(handler, calls)
        result = await crm.upsert_as_user(USER, deployment=DEPLOYMENT)
        assert result.object_id == "c-new"
        assert result.revision == 1
        await crm.close()

    asyncio.run(run())
    assert _summary(calls)[-2:] == [
        "PATCH /contacts/ada@example.com",
        "POST /contacts",
    ]
    create = calls[-1]
    assert create.headers["authorization"] == "Bearer re_test"
    body = _body(create)
    assert body["email"] == "ada@example.com"
    assert body["first_name"] == "Ada"
    assert "unsubscribed" not in body
    properties = cast(dict[str, dict[str, str]], body["properties"])
    assert properties["thrive_universe"] == {
        "key": "thrive_universe",
        "value": "thrive",
    }
    assert properties["thrive_instance"]["value"] == "main"


def test_updates_the_known_contact_and_never_sends_unsubscribed() -> None:
    calls: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/contact-properties":
            return httpx.Response(409, json={"name": "already_exists"})
        if request.method == "GET":
            return httpx.Response(200, json={"id": "c-1", "email": "ADA@example.com"})
        return httpx.Response(200, json={"object": "contact", "id": "c-1"})

    async def run() -> None:
        crm = _crm(handler, calls)
        result = await crm.upsert_as_user(
            USER, deployment=DEPLOYMENT, indexing_record=_record("c-1")
        )
        assert (result.object_id, result.revision) == ("c-1", 4)

    asyncio.run(run())
    assert _summary(calls)[-2:] == ["GET /contacts/c-1", "PATCH /contacts/c-1"]
    assert "unsubscribed" not in _body(calls[-1])


def test_recreates_the_contact_when_the_email_changed() -> None:
    calls: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/contact-properties":
            return httpx.Response(200, json={"id": "p"})
        if request.method == "GET":
            return httpx.Response(200, json={"id": "c-1", "email": "old@example.com"})
        if request.method == "DELETE":
            return httpx.Response(200, json={"deleted": True})
        if request.method == "PATCH":
            return httpx.Response(404, json={})
        return httpx.Response(200, json={"id": "c-2"})

    async def run() -> None:
        crm = _crm(handler, calls)
        result = await crm.upsert_as_user(
            USER, deployment=DEPLOYMENT, indexing_record=_record("c-1")
        )
        assert result.object_id == "c-2"

    asyncio.run(run())
    assert _summary(calls)[-4:] == [
        "GET /contacts/c-1",
        "DELETE /contacts/c-1",
        "PATCH /contacts/ada@example.com",
        "POST /contacts",
    ]


def test_falls_back_to_email_when_the_map_row_holds_a_foreign_id() -> None:
    """Rows written by the old Wix CRM carry ids Resend does not know."""
    calls: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/contact-properties":
            return httpx.Response(200, json={"id": "p"})
        if request.url.path == "/contacts/wix-id":
            return httpx.Response(404, json={})
        return httpx.Response(200, json={"id": "c-9"})

    async def run() -> None:
        crm = _crm(handler, calls)
        result = await crm.upsert_as_user(
            USER, deployment=DEPLOYMENT, indexing_record=_record("wix-id")
        )
        assert result.object_id == "c-9"

    asyncio.run(run())
    assert _summary(calls)[-2:] == [
        "GET /contacts/wix-id",
        "PATCH /contacts/ada@example.com",
    ]


def test_drops_deployment_properties_when_resend_rejects_them() -> None:
    calls: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/contact-properties":
            return httpx.Response(200, json={"id": "p"})
        if "properties" in _body(request):
            return httpx.Response(422, json={"name": "invalid_parameter"})
        return httpx.Response(200, json={"id": "c-1"})

    async def run() -> None:
        crm = _crm(handler, calls)
        result = await crm.upsert_as_user(USER, deployment=DEPLOYMENT)
        assert result.object_id == "c-1"

    asyncio.run(run())
    assert "properties" not in _body(calls[-1])


def test_waits_out_the_rate_limit() -> None:
    calls: list[httpx.Request] = []
    state = {"limited": 1}

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/contact-properties":
            return httpx.Response(200, json={"id": "p"})
        if state["limited"] > 0:
            state["limited"] -= 1
            return httpx.Response(429, headers={"retry-after": "2"}, json={})
        return httpx.Response(200, json={"id": "c-1"})

    slept: list[float] = []

    async def fake_sleep(seconds: float) -> None:
        slept.append(seconds)

    async def run() -> None:
        crm = _crm(handler, calls)
        with patch("jupiter.core.apps.crm.impl.resend.asyncio.sleep", fake_sleep):
            result = await crm.upsert_as_user(USER, deployment=DEPLOYMENT)
        assert result.object_id == "c-1"

    asyncio.run(run())
    assert slept == [2.0]


def test_remove_ignores_a_contact_that_is_already_gone() -> None:
    calls: list[httpx.Request] = []

    async def run() -> None:
        crm = _crm(lambda request: httpx.Response(404, json={}), calls)
        await crm.remove_user(indexing_record=_record("c-1"))

    asyncio.run(run())
    assert _summary(calls) == ["DELETE /contacts/c-1"]
