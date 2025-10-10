"""Configuration for the CLI part of the app."""

import abc
from typing import Any, Generic, TypeVar, Union

from jupiter.cli.command.command import (
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
)
from jupiter.core.config import (
    JupiterGuestMutationUseCase,
    JupiterGuestMutationUseCaseContext,
    JupiterGuestReadonlyUseCase,
    JupiterGuestReadonlyUseCaseContext,
    JupiterLoggedInMutationUseCase,
    JupiterLoggedInMutationUseCaseContext,
    JupiterLoggedInReadonlyUseCase,
    JupiterLoggedInReadonlyUseCaseContext,
)
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


class JupiterGuestMutationCommand(
    Generic[JupiterGuestMutationUseCaseT, UseCaseResultT],
    GuestMutationCommand[JupiterGuestMutationUseCaseT, JupiterGuestMutationUseCaseContext, UseCaseResultT],  # type: ignore
    abc.ABC,
):
    """A guest mutation commmand tailore to Jupiter."""


class JupiterGuestReadonlyCommand(
    Generic[JupiterGuestReadonlyUseCaseT, UseCaseResultT],
    GuestReadonlyCommand[JupiterGuestReadonlyUseCaseT, JupiterGuestReadonlyUseCaseContext, UseCaseResultT],  # type: ignore
    abc.ABC,
):
    """A guest mutation commmand tailore to Jupiter."""


class JupiterLoggedInMutationCommand(
    Generic[JupiterLoggedInMutationUseCaseT, UseCaseResultT],
    LoggedInMutationCommand[JupiterLoggedInMutationUseCaseT, JupiterLoggedInMutationUseCaseContext, UseCaseResultT],  # type: ignore
    abc.ABC,
):
    """A logged in mutation commmand tailore to Jupiter."""


class JupiterLoggedInReadonlyCommand(
    Generic[JupiterLoggedInReadonlyUseCaseT, UseCaseResultT],
    LoggedInReadonlyCommand[JupiterLoggedInReadonlyUseCaseT, JupiterLoggedInReadonlyUseCaseContext, UseCaseResultT],  # type: ignore
    abc.ABC,
):
    """A logged in mutation commmand tailore to Jupiter."""
