"""Configuration for the CLI part of the app."""

import abc
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Generic, TypeVar, Union, cast

import dotenv
from jupiter.core.app import AppCore, AppDistribution, AppPlatform, AppShell
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
from jupiter.framework.appform.cli.appform import CliAppForm
from jupiter.framework.appform.cli.commands import (
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
)
from jupiter.framework.appform.cli.exception import CliExceptionHandler
from jupiter.framework.appform.cli.session_storage import SessionInfo
from jupiter.framework.service_properties import ServiceProperties
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


@dataclass(frozen=True)
class JupiterCliProperties(ServiceProperties):
    """Properties of the Jupiter CLI."""

    docs_url: str
    docs_init_workspace_url: str
    session_info_path: Path
    sqlite_db_url: str
    alembic_ini_path: Path
    alembic_migrations_path: Path
    auth_token_secret: str


def build_cli_properties() -> JupiterCliProperties:
    """Build the CLI properties from the environment."""

    def find_up_the_dir_tree(partial_path: Union[str, Path]) -> Path:
        last_here = None
        right_here = Path(os.path.relpath(__file__)).parent
        while True:
            if last_here == right_here:
                raise Exception(f"Critical error - missing config file {partial_path}")
            config_file = right_here / partial_path
            if config_file.exists():
                return config_file
            last_here = right_here
            right_here = right_here.parent

    service_config_path = find_up_the_dir_tree("Config.project")
    dotenv.load_dotenv(dotenv_path=service_config_path, verbose=True)

    docs_url = cast(str, os.getenv("DOCS_URL"))
    docs_init_workspace_url = cast(str, os.getenv("DOCS_INIT_WORKSPACE_URL"))
    session_info_path = Path(cast(str, os.getenv("SESSION_INFO_PATH")))
    sqlite_db_url = cast(str, os.getenv("SQLITE_DB_URL"))
    alembic_ini_path = Path(cast(str, os.getenv("ALEMBIC_INI_PATH")))
    alembic_migrations_path = Path(cast(str, os.getenv("ALEMBIC_MIGRATIONS_PATH")))
    auth_token_secret = cast(str, os.getenv("AUTH_TOKEN_SECRET"))

    return JupiterCliProperties(
        docs_url=docs_url,
        docs_init_workspace_url=docs_init_workspace_url,
        session_info_path=session_info_path,
        sqlite_db_url=sqlite_db_url,
        alembic_ini_path=alembic_ini_path,
        alembic_migrations_path=alembic_migrations_path,
        auth_token_secret=auth_token_secret,
    )


class JupiterGuestMutationCommand( 
    GuestMutationCommand[ # type: ignore
        _JupiterGuestMutationUseCaseT,
        JupiterGlobalProperties,
        JupiterCliProperties,
        JupiterGuestSession,
        JupiterGuestMutationContext,
        _UseCaseResultT,
    ],
    Generic[_JupiterGuestMutationUseCaseT, _UseCaseResultT],
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
    GuestReadonlyCommand[ # type: ignore
        _JupiterGuestReadonlyUseCaseT,
        JupiterGlobalProperties,
        JupiterCliProperties,
        JupiterGuestSession,
        JupiterGuestReadonlyContext,
        _UseCaseResultT,
    ],
    Generic[_JupiterGuestReadonlyUseCaseT, _UseCaseResultT],
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
    LoggedInMutationCommand[ # type: ignore
        _JupiterLoggedInMutationUseCaseT,
        JupiterGlobalProperties,
        JupiterCliProperties,
        JupiterLoggedInSession,
        JupiterLoggedInMutationContext,
        _UseCaseResultT,
    ],
    Generic[_JupiterLoggedInMutationUseCaseT, _UseCaseResultT],
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
    LoggedInReadonlyCommand[ # type: ignore
        _JupiterLoggedInReadonlyUseCaseT,
        JupiterGlobalProperties,
        JupiterCliProperties,
        JupiterLoggedInSession,
        JupiterLoggedInReadonlyContext,
        _UseCaseResultT,
    ],
    Generic[_JupiterLoggedInReadonlyUseCaseT, _UseCaseResultT],
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
    CliExceptionHandler[JupiterGlobalProperties, JupiterCliProperties, _ExceptionT],
    abc.ABC,
    Generic[_ExceptionT],
):
    """A Jupiter exception handler."""


class JupiterCliAppForm(
    CliAppForm[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterCliProperties,
        JupiterComponentProperties,
    ]
):
    """A jupiter CLI app form."""

    @property
    def help_description(self) -> str:
        """The help description for the CLI app."""
        return self._global_properties.description

    @property
    def help_version(self) -> str:
        """The version of the CLI app."""
        return (
            f"{self._global_properties.description} {self._global_properties.version}"
        )
