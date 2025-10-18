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
from jupiter.framework_new.app.cli.app import CliApp
from jupiter.framework_new.app.cli.commands import (
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
)
from jupiter.framework_new.app.cli.exception import CliExceptionHandler
from jupiter.framework_new.app.cli.session_storage import SessionInfo
from jupiter.framework_new.use_case_io import UseCaseResultBase

JupiterGuestMutationUseCaseT = TypeVar(  # type: ignore
    "JupiterGuestMutationUseCaseT", bound=JupiterGuestMutationUseCase[Any, Any]
)
JupiterGuestReadonlyUseCaseT = TypeVar(  # type: ignore
    "JupiterGuestReadonlyUseCaseT", bound=JupiterGuestReadonlyUseCase[Any, Any]
)
JupiterLoggedInMutationUseCaseT = TypeVar(  # type: ignore
    "JupiterLoggedInMutationUseCaseT", bound=JupiterLoggedInMutationUseCase[Any, Any]
)
JupiterLoggedInReadonlyUseCaseT = TypeVar(  # type: ignore
    "JupiterLoggedInReadonlyUseCaseT", bound=JupiterLoggedInReadonlyUseCase[Any, Any]
)
UseCaseResultT = TypeVar("UseCaseResultT", bound=Union[None, UseCaseResultBase])
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class JupiterGuestMutationCommand(
    Generic[JupiterGuestMutationUseCaseT, UseCaseResultT],
    GuestMutationCommand[JupiterGuestMutationUseCaseT, JupiterGlobalProperties, JupiterGuestSession, JupiterGuestMutationContext, UseCaseResultT],  # type: ignore
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
    Generic[JupiterGuestReadonlyUseCaseT, UseCaseResultT],
    GuestReadonlyCommand[JupiterGuestReadonlyUseCaseT, JupiterGlobalProperties, JupiterGuestSession, JupiterGuestReadonlyContext, UseCaseResultT],  # type: ignore
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
    Generic[JupiterLoggedInMutationUseCaseT, UseCaseResultT],
    LoggedInMutationCommand[JupiterLoggedInMutationUseCaseT, JupiterGlobalProperties, JupiterLoggedInSession, JupiterLoggedInMutationContext, UseCaseResultT],  # type: ignore
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
    Generic[JupiterLoggedInReadonlyUseCaseT, UseCaseResultT],
    LoggedInReadonlyCommand[JupiterLoggedInReadonlyUseCaseT, JupiterGlobalProperties, JupiterLoggedInSession, JupiterLoggedInReadonlyContext, UseCaseResultT],  # type: ignore
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
