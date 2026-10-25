"""Tests for how MCP tools expose update calls and report failures."""

import asyncio
from http import HTTPStatus
from types import SimpleNamespace
from typing import Any, Callable

import httpx
import pytest
from jupiter.framework.service.mcp.oauth_tokens import OAuthTokens
from jupiter.framework.service.mcp.service import McpService
from jupiter.framework.service.mcp.tool import McpApiGatewayTool
from jupiter.framework.service.rest.api_gateway_method import (
    _extract_types_from_api_call,
)
from jupiter_webapi_client.api.todo.todo_task_update import (
    asyncio_detailed as todo_task_update,
)
from jupiter_webapi_client.models.error_detail_item import ErrorDetailItem
from jupiter_webapi_client.models.error_response import ErrorResponse
from jupiter_webapi_client.types import Unset
from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError, UnexpectedToolError


class _FakeTool(
    McpApiGatewayTool[  # type: ignore[explicit-any]
        object, object, object, object, Unset, ErrorResponse, object, object, object
    ]
):
    def get_authenticated_client(  # type: ignore[explicit-any]
        self, ports: Any, trace_id: object, token: str
    ) -> object:
        return object()


class _FakeService(McpService[Any, Any, Any]):  # type: ignore[explicit-any]
    description = "test"  # type: ignore[assignment]
    version = "0"  # type: ignore[assignment]
    host = "localhost"  # type: ignore[assignment]
    port = 0  # type: ignore[assignment]
    public_url = "http://mcp.test"  # type: ignore[assignment]
    consent_url = "http://webui.test/consent"  # type: ignore[assignment]

    async def _do_key_exchange(self, key_str: str) -> str | None:
        return key_str

    async def _do_code_exchange(
        self,
        code: str,
        code_verifier: str,
        client_id: str,
        redirect_uri: str,
        resource: str,
    ) -> OAuthTokens:
        raise NotImplementedError

    async def _do_refresh(self, refresh_token: str, client_id: str) -> OAuthTokens:
        raise NotImplementedError


def _ok() -> Any:  # type: ignore[explicit-any]
    return SimpleNamespace(status_code=SimpleNamespace(is_success=True), parsed=None)


def _tool_builder(
    respond: Callable[[dict[str, Any]], Any],  # type: ignore[explicit-any]
) -> Callable[[Any, Any, Any], _FakeTool]:  # type: ignore[explicit-any]
    async def fake_call(client: object, body: Any) -> Any:  # type: ignore[explicit-any]
        return respond(body.to_dict())

    args, result = _extract_types_from_api_call(todo_task_update, Unset, ErrorResponse)

    def build_it(ports: Any, global_properties: Any, service_properties: Any) -> _FakeTool:  # type: ignore[explicit-any]
        return _FakeTool("update-todo", "Update", args, result, fake_call)

    return build_it


def _server(
    respond: Callable[[dict[str, Any]], Any],  # type: ignore[explicit-any]
    signed_in: bool = True,
) -> MCPServer:
    """Build a real MCP service with an ``update-todo`` tool answered by ``respond``.

    The service has an auth token for the call unless ``signed_in`` is false.
    """
    service = _FakeService.build(
        object(),
        SimpleNamespace(),
        SimpleNamespace(),
        _tool_builder(respond),
    )
    service._auth_token_var.set("an-auth-token" if signed_in else None)
    return service._mcp_server


def _error(status: HTTPStatus, reason: str, detail: Any) -> Callable[[dict[str, Any]], Any]:  # type: ignore[explicit-any]
    return lambda _body: SimpleNamespace(
        status_code=status,
        parsed=ErrorResponse(reason=reason, detail=detail),
        content=b"",
    )


def _call(server: MCPServer, **arguments: Any) -> None:  # type: ignore[explicit-any]
    asyncio.run(server.call_tool("update-todo", {"ref_id": "1", **arguments}))


# --- Flattening of update actions ---


def test_only_ref_id_is_required() -> None:
    tool = asyncio.run(_server(lambda _b: _ok()).list_tools())[0]
    assert tool.input_schema["required"] == ["ref_id"]
    assert tool.input_schema["properties"]["name"]["type"] == "string"
    assert {"type": "null"} in tool.input_schema["properties"]["due_date"]["anyOf"]


def test_provided_field_changes_and_omitted_fields_do_not() -> None:
    captured: dict[str, Any] = {}  # type: ignore[explicit-any]

    def respond(body: dict[str, Any]) -> Any:  # type: ignore[explicit-any]
        captured.update(body)
        return _ok()

    _call(_server(respond), name="New")
    assert captured["name"] == {"should_change": True, "value": "New"}
    assert captured["due_date"] == {"should_change": False}


def test_explicit_null_clears_a_nullable_field() -> None:
    captured: dict[str, Any] = {}  # type: ignore[explicit-any]

    def respond(body: dict[str, Any]) -> Any:  # type: ignore[explicit-any]
        captured.update(body)
        return _ok()

    _call(_server(respond), due_date=None)
    assert captured["due_date"] == {"should_change": True, "value": None}


# --- Error handling ---


def test_invalid_value_is_a_tool_error_naming_the_problem() -> None:
    server = _server(lambda _b: _ok())
    with pytest.raises(ToolError, match="Invalid arguments") as err:
        _call(server, status="not-a-status")
    assert not isinstance(err.value, UnexpectedToolError)


def test_webapi_error_is_a_tool_error_carrying_the_response() -> None:
    items = [
        ErrorDetailItem(loc=["body", "name"], msg="too long", type_="value_error"),
        ErrorDetailItem(loc=["body", "due_date"], msg="bad date", type_="value_error"),
    ]
    server = _server(_error(HTTPStatus.UNPROCESSABLE_ENTITY, "Invalid input", items))
    with pytest.raises(ToolError, match="422: Invalid input:") as err:
        _call(server, name="x")
    message = str(err.value)
    assert "body.name: too long" in message
    assert "body.due_date: bad date" in message


def test_not_found_response() -> None:
    server = _server(_error(HTTPStatus.NOT_FOUND, "Entity does not exist", "no todo 1"))
    with pytest.raises(ToolError, match="404: Entity does not exist: no todo 1"):
        _call(server)


def test_webapi_auth_failure_is_the_same_kind_of_tool_error() -> None:
    server = _server(_error(HTTPStatus.UNAUTHORIZED, "Expired", "token expired"))
    with pytest.raises(ToolError, match="401: Expired: token expired"):
        _call(server)


def test_server_failure_is_a_tool_error_with_the_status() -> None:
    server = _server(_error(HTTPStatus.INTERNAL_SERVER_ERROR, "Boom", "secret stack"))
    with pytest.raises(ToolError, match="500: Boom: secret stack"):
        _call(server)


def test_unreachable_server() -> None:
    def respond(_body: dict[str, Any]) -> Any:  # type: ignore[explicit-any]
        raise httpx.ConnectError("refused")

    with pytest.raises(ToolError, match="Could not reach the Thrive server"):
        _call(_server(respond))


def test_missing_token() -> None:
    with pytest.raises(ToolError, match="Not authenticated"):
        _call(_server(lambda _b: _ok(), signed_in=False))


def test_unexpected_exception_stays_a_crash() -> None:
    def respond(_body: dict[str, Any]) -> Any:  # type: ignore[explicit-any]
        raise RuntimeError("bug")

    with pytest.raises(UnexpectedToolError):
        _call(_server(respond))
