"""Configuration for the WebAPI app."""

import abc
from typing import Any, Final, Generic, TypeVar, Union

from fastapi import HTTPException, Request, Response
from jupiter.core.config import (
    JupiterComponentProperties,
    JupiterGlobalProperties,
    JupiterGuestMutationUseCase,
    JupiterGuestMutationUseCaseContext,
    JupiterGuestReadonlyUseCase,
    JupiterGuestReadonlyUseCaseContext,
    JupiterGuestUseCaseSession,
    JupiterLoggedInMutationUseCase,
    JupiterLoggedInMutationUseCaseContext,
    JupiterLoggedInReadonlyUseCase,
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterLoggedInUseCaseSession,
    JupiterPorts,
)
from jupiter.core.domain.app import (
    AppCore,
    AppDistribution,
    AppPlatform,
    AppShell,
    AppVersion,
)
from jupiter.core.domain.app_version_decoder import AppVersionDatabaseDecoder
from jupiter.framework_new.auth.auth_token_ext import (
    AuthTokenExt,
    AuthTokenExtDatabaseDecoder,
)
from jupiter.framework_new.impl.realms import (
    _StandardEnumValueDatabaseDecoder,
)
from jupiter.framework_new.use_case_io import UseCaseResultBase
from jupiter.webapi.app import (
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
    WebApiApp,
    WebApiExceptionHandler,
)
from starlette.status import HTTP_401_UNAUTHORIZED

ENV_HEADER: Final[str] = "X-Jupiter-Env"
HOSTING_HEADER: Final[str] = "X-Jupiter-Hosting"
VERSION_HEADER: Final[str] = "X-Jupiter-Version"
FRONTDOOR_HEADER: Final[str] = "X-Jupiter-FrontDoor"

_AUTH_TOKEN_EXT_DECODER = AuthTokenExtDatabaseDecoder()
_APP_VERSION_DECODER = AppVersionDatabaseDecoder()
_APP_SHELL_DECODER = _StandardEnumValueDatabaseDecoder(AppShell)
_APP_PLATFORM_DECODER = _StandardEnumValueDatabaseDecoder(AppPlatform)
_APP_DISTRIBUTION_DECODER = _StandardEnumValueDatabaseDecoder(AppDistribution)


_JupiterGuestMutationUseCaseT = TypeVar("_JupiterGuestMutationUseCaseT", bound=JupiterGuestMutationUseCase[Any, Any])  # type: ignore
_JupiterGuestReadonlyUseCaseT = TypeVar("_JupiterGuestReadonlyUseCaseT", bound=JupiterGuestReadonlyUseCase[Any, Any])  # type: ignore
_JupiterLoggedInMutationUseCaseT = TypeVar("_JupiterLoggedInMutationUseCaseT", bound=JupiterLoggedInMutationUseCase[Any, Any])  # type: ignore
_JupiterLoggedInReadonlyUseCaseT = TypeVar("_JupiterLoggedInReadonlyUseCaseT", bound=JupiterLoggedInReadonlyUseCase[Any, Any])  # type: ignore
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=Union[None, UseCaseResultBase])
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class JupiterGuestMutationCommand(
    Generic[_JupiterGuestMutationUseCaseT, _UseCaseResultT],
    GuestMutationCommand[_JupiterGuestMutationUseCaseT, JupiterGlobalProperties, JupiterGuestUseCaseSession, JupiterGuestMutationUseCaseContext, _UseCaseResultT],  # type: ignore
):
    """A guest mutation commmand tailore to Jupiter."""

    def _build_session(self, request: Request) -> JupiterGuestUseCaseSession:
        """Build the session."""
        # extract auth token from the "Authorization" header,
        auth_token_ext_str = _extract_auth_token_ext(request)
        app_component = _extract_component_from_frontdoor(request)

        return JupiterGuestUseCaseSession(
            app_component,
            auth_token_ext_str,
        )


class JupiterGuestReadonlyCommand(
    Generic[_JupiterGuestReadonlyUseCaseT, _UseCaseResultT],
    GuestReadonlyCommand[_JupiterGuestReadonlyUseCaseT, JupiterGlobalProperties, JupiterGuestUseCaseSession, JupiterGuestReadonlyUseCaseContext, _UseCaseResultT],  # type: ignore
):
    """A guest readonly command tailore to Jupiter."""

    def _build_session(self, request: Request) -> JupiterGuestUseCaseSession:
        """Build the session."""
        # extract auth token from the "Authorization" header,
        auth_token_ext_str = _extract_auth_token_ext(request)
        app_component = _extract_component_from_frontdoor(request)

        return JupiterGuestUseCaseSession(
            app_component,
            auth_token_ext_str,
        )


class JupiterLoggedInMutationCommand(
    Generic[_JupiterLoggedInMutationUseCaseT, _UseCaseResultT],
    LoggedInMutationCommand[_JupiterLoggedInMutationUseCaseT, JupiterGlobalProperties, JupiterLoggedInUseCaseSession, JupiterLoggedInMutationUseCaseContext, _UseCaseResultT],  # type: ignore
):
    """A logged in mutation command tailore to Jupiter."""

    def _build_session(self, request: Request) -> JupiterLoggedInUseCaseSession:
        """Build the session."""
        # extract auth token from the "Authorization" header,
        auth_token_ext_str = _extract_auth_token_ext(request)
        if auth_token_ext_str is None:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        app_component = _extract_component_from_frontdoor(request)

        return JupiterLoggedInUseCaseSession(
            app_component,
            auth_token_ext_str,
        )


class JupiterLoggedInReadonlyCommand(
    Generic[_JupiterLoggedInReadonlyUseCaseT, _UseCaseResultT],
    LoggedInReadonlyCommand[_JupiterLoggedInReadonlyUseCaseT, JupiterGlobalProperties, JupiterLoggedInUseCaseSession, JupiterLoggedInReadonlyUseCaseContext, _UseCaseResultT],  # type: ignore
):
    """A logged in readonly command tailore to Jupiter."""

    def _build_session(self, request: Request) -> JupiterLoggedInUseCaseSession:
        """Build the session."""
        # extract auth token from the "Authorization" header,
        auth_token_ext_str = _extract_auth_token_ext(request)
        if auth_token_ext_str is None:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        app_component = _extract_component_from_frontdoor(request)

        return JupiterLoggedInUseCaseSession(
            app_component,
            auth_token_ext_str,
        )


class JupiterExceptionHandler(
    Generic[_ExceptionT],
    WebApiExceptionHandler[JupiterGlobalProperties, _ExceptionT],
    abc.ABC,
):
    """A Jupiter exception handler."""


class JupiterWebApiApp(
    WebApiApp[JupiterPorts, JupiterGlobalProperties, JupiterComponentProperties],
):
    """A Jupiter web api app."""

    @property
    def api_description(self) -> str:
        """The description of the app."""
        return self._global_properties.description

    @property
    def api_version(self) -> str:
        """The version of the app."""
        return str(self._global_properties.version)

    @property
    def host(self) -> str:
        """The host of the app."""
        return self._global_properties.host

    @property
    def port(self) -> int:
        """The port of the app."""
        return self._global_properties.port

    @property
    def is_live(self) -> bool:
        """Whether the app is live."""
        return self._global_properties.env.is_live

    def add_headers_to_response(self, response: Response) -> None:
        """Add the headers to the response."""
        response.headers[ENV_HEADER] = self._global_properties.env.value
        response.headers[HOSTING_HEADER] = self._global_properties.hosting.value
        response.headers[VERSION_HEADER] = self.api_version


def _extract_auth_token_ext(request: Request) -> AuthTokenExt | None:
    """Extract the auth token ext from the request."""
    authorization_header = request.headers.get("Authorization")
    if authorization_header is None:
        return None
    scheme, _, param = authorization_header.partition(" ")
    if scheme.lower() != "bearer":
        return None
    return _AUTH_TOKEN_EXT_DECODER.decode(param)


def _extract_component_from_frontdoor(request: Request) -> JupiterComponentProperties:
    """Extract the app component from the frontdoor."""
    frontdoor_raw = request.headers.get(FRONTDOOR_HEADER)
    app_client_version = AppVersion("0.0.1")
    app_shell = AppShell.BROWSER
    app_platform = AppPlatform.DESKTOP_MACOS
    app_distribution = AppDistribution.WEB
    if frontdoor_raw is not None:
        bits = frontdoor_raw.split(":")
        if len(bits) == 4:
            app_client_version = _APP_VERSION_DECODER.decode(bits[0])
            app_shell = _APP_SHELL_DECODER.decode(bits[1])
            app_platform = _APP_PLATFORM_DECODER.decode(bits[2])
            app_distribution = _APP_DISTRIBUTION_DECODER.decode(bits[3])
    return JupiterComponentProperties.for_app(
        core=AppCore.WEBUI,
        the_shell=app_shell,
        platform=app_platform,
        distribution=app_distribution,
        version=app_client_version,
    )
