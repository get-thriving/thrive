"""Configuration for the CLI part of the app."""

import abc
from typing import Any, Generic, TypeVar, Union

from jupiter.core.config import (
    JupiterComponentProperties,
    JupiterGlobalProperties,
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
    JupiterGuestSession,
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
    JupiterLoggedInSession,
    JupiterPorts,
)
from jupiter.core.domain.app import AppCore, AppDistribution, AppPlatform, AppShell
from jupiter.framework.appform.cli.app import CliApp
from jupiter.framework.appform.cli.commands import (
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
)
from jupiter.framework.appform.cli.exception import CliExceptionHandler
from jupiter.framework.appform.cli.session_storage import SessionInfo
from jupiter.framework.use_case_io import UseCaseResultBase

_JupiterGuestMutationUseCaseT = TypeVar(  # type: ignore
    "_JupiterGuestMutationUseCaseT", bound=JupiterGuestMutationUseCase[Any, Any]
)
_JupiterGuestReadonlyUseCaseT = TypeVar(  # type: ignore
    "_JupiterGuestReadonlyUseCaseT", bound=JupiterGuestReadonlyUseCase[Any, Any]
)
_JupiterLoggedInMutationUseCaseT = TypeVar(  # type: ignore
    "_JupiterLoggedInMutationUseCaseT", bound=JupiterLoggedInMutationUseCase[Any, Any]
)
_JupiterLoggedInReadonlyUseCaseT = TypeVar(  # type: ignore
    "_JupiterLoggedInReadonlyUseCaseT", bound=JupiterLoggedInReadonlyUseCase[Any, Any]
)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=Union[None, UseCaseResultBase])
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class JupiterGuestMutationCommand(
    Generic[_JupiterGuestMutationUseCaseT, _UseCaseResultT],
    GuestMutationCommand[_JupiterGuestMutationUseCaseT, JupiterGlobalProperties, JupiterGuestSession, JupiterGuestMutationContext, _UseCaseResultT],  # type: ignore
):
    """A guest mutation commmand tailore to Jupiter."""

    def _build_session(  # type: ignore
        self, session_info: SessionInfo | None
    ) -> JupiterGuestSession:
        return JupiterGuestSession(
            JupiterComponentProperties.for_app(
                core=AppCore.CLI,
                the_shell=AppShell.CLI,
                platform=AppPlatform.DESKTOP_MACOS,
                distribution=AppDistribution.MAC_WEB,
                version=self._global_properties.version,
            ),
            session_info.auth_token_ext if session_info else None,
        )


class JupiterGuestReadonlyCommand(
    Generic[_JupiterGuestReadonlyUseCaseT, _UseCaseResultT],
    GuestReadonlyCommand[_JupiterGuestReadonlyUseCaseT, JupiterGlobalProperties, JupiterGuestSession, JupiterGuestReadonlyContext, _UseCaseResultT],  # type: ignore
):
    """A guest mutation commmand tailore to Jupiter."""

    def _build_session(  # type: ignore
        self, session_info: SessionInfo | None
    ) -> JupiterGuestSession:
        return JupiterGuestSession(
            JupiterComponentProperties.for_app(
                core=AppCore.CLI,
                the_shell=AppShell.CLI,
                platform=AppPlatform.DESKTOP_MACOS,
                distribution=AppDistribution.MAC_WEB,
                version=self._global_properties.version,
            ),
            session_info.auth_token_ext if session_info else None,
        )


class JupiterLoggedInMutationCommand(
    Generic[_JupiterLoggedInMutationUseCaseT, _UseCaseResultT],
    LoggedInMutationCommand[_JupiterLoggedInMutationUseCaseT, JupiterGlobalProperties, JupiterLoggedInSession, JupiterLoggedInMutationContext, _UseCaseResultT],  # type: ignore
):
    """A logged in mutation commmand tailore to Jupiter."""

    def _build_session(  # type: ignore
        self, session_info: SessionInfo
    ) -> JupiterLoggedInSession:
        return JupiterLoggedInSession(
            JupiterComponentProperties.for_app(
                core=AppCore.CLI,
                the_shell=AppShell.CLI,
                platform=AppPlatform.DESKTOP_MACOS,
                distribution=AppDistribution.MAC_WEB,
                version=self._global_properties.version,
            ),
            session_info.auth_token_ext,
        )


class JupiterLoggedInReadonlyCommand(
    Generic[_JupiterLoggedInReadonlyUseCaseT, _UseCaseResultT],
    LoggedInReadonlyCommand[_JupiterLoggedInReadonlyUseCaseT, JupiterGlobalProperties, JupiterLoggedInSession, JupiterLoggedInReadonlyContext, _UseCaseResultT],  # type: ignore
):
    """A logged in mutation commmand tailore to Jupiter."""

    def _build_session(  # type: ignore
        self, session_info: SessionInfo
    ) -> JupiterLoggedInSession:
        return JupiterLoggedInSession(
            JupiterComponentProperties.for_app(
                core=AppCore.CLI,
                the_shell=AppShell.CLI,
                platform=AppPlatform.DESKTOP_MACOS,
                distribution=AppDistribution.MAC_WEB,
                version=self._global_properties.version,
            ),
            session_info.auth_token_ext,
        )


class JupiterExceptionHandler(
    Generic[_ExceptionT],
    CliExceptionHandler[JupiterGlobalProperties, _ExceptionT],
    abc.ABC,
):
    """A Jupiter exception handler."""


class JupiterCliApp(
    CliApp[JupiterPorts, JupiterGlobalProperties, JupiterComponentProperties]
):
    """A jupiter Cli."""

    @property
    def help_description(self) -> str:
        """The help description for the cli app."""
        return self._global_properties.description

    @property
    def help_version(self) -> str:
        """The version of the cli app."""
        return (
            f"{self._global_properties.description} {self._global_properties.version}"
        )
