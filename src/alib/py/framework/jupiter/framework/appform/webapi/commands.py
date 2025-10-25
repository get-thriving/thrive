"""Commands for the webapi app."""

import abc
import types
from typing import (
    Any,
    Final,
    Generic,
    Mapping,
    TypeVar,
    cast,
    get_args,
)

import inflection
from fastapi import FastAPI, Request
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.realm.realm import RealmCodecRegistry, WebRealm
from jupiter.framework.use_case import (
    BackgroundMutationUseCase,
    EmptySession,
    GuestMutationContext,
    GuestMutationUseCase,
    GuestReadonlyContext,
    GuestReadonlyUseCase,
    GuestSession,
    LoggedInMutationContext,
    LoggedInMutationUseCase,
    LoggedInReadonlyContext,
    LoggedInReadonlyUseCase,
    LoggedInSession,
    UseCase,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase

_UseCaseT = TypeVar("_UseCaseT", bound=UseCase[Any, Any, Any, Any, Any, Any, Any])
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_GuestSessionT = TypeVar("_GuestSessionT", bound=GuestSession)
_GuestMutationContextT = TypeVar("_GuestMutationContextT", bound=GuestMutationContext)
_GuestMutationUseCaseT = TypeVar(
    "_GuestMutationUseCaseT",
    bound=GuestMutationUseCase[Any, Any, Any, Any, Any, Any, Any],
)
_GuestReadonlyContextT = TypeVar("_GuestReadonlyContextT", bound=GuestReadonlyContext)
_GuestReadonlyUseCaseT = TypeVar(
    "_GuestReadonlyUseCaseT",
    bound=GuestReadonlyUseCase[Any, Any, Any, Any, Any, Any, Any],
)
_LoggedInSessionT = TypeVar("_LoggedInSessionT", bound=LoggedInSession)
_LoggedInMutationContextT = TypeVar(
    "_LoggedInMutationContextT", bound=LoggedInMutationContext
)
_LoggedInMutationUseCaseT = TypeVar(
    "_LoggedInMutationUseCaseT",
    bound=LoggedInMutationUseCase[Any, Any, Any, Any, Any, Any, Any],
)
_LoggedInReadonlyContextT = TypeVar(
    "_LoggedInReadonlyContextT", bound=LoggedInReadonlyContext
)
_LoggedInReadonlyUseCaseT = TypeVar(
    "_LoggedInReadonlyUseCaseT",
    bound=LoggedInReadonlyUseCase[Any, Any, Any, Any, Any, Any, Any],
)
_BackgroundMutationUseCaseT = TypeVar(
    "_BackgroundMutationUseCaseT",
    bound=BackgroundMutationUseCase[Any, Any, Any, Any, Any],
)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=UseCaseResultBase | None)

_STANDARD_RESPONSES: dict[int | str, dict[str, Any]] = {
    410: {
        "description": "Workspace Or User Not Found",
        "content": {"application/json": {}},
    },
    406: {"description": "Feature Not Available", "content": {"application/json": {}}},
    422: {"description": "Validation Error", "content": {"application/json": {}}},
}

_STANDARD_CONFIG: Mapping[str, Any] = {
    "responses": _STANDARD_RESPONSES,
    "response_model_exclude_defaults": True,
}


class Command:
    """The base class for all commands."""


class UseCaseCommand(Generic[_GlobalPropertiesT, _UseCaseT], Command, abc.ABC):
    """A command that is a use case."""

    _global_properties: _GlobalPropertiesT
    _realm_codec_registry: Final[RealmCodecRegistry]
    _args_type: Final[type[UseCaseArgsBase]]
    _result_type: Final[type[UseCaseResultBase | None]]
    _use_case: _UseCaseT
    _root_module: Final[types.ModuleType]

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        realm_codec_registry: RealmCodecRegistry,
        use_case: _UseCaseT,
        root_module: types.ModuleType,
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._realm_codec_registry = realm_codec_registry
        self._args_type = self._infer_args_class(use_case)
        self._result_type = self._infer_result_class(use_case)
        self._use_case = use_case
        self._root_module = root_module

    @staticmethod
    def _infer_args_class(use_case: _UseCaseT) -> type[UseCaseArgsBase]:
        use_case_type = use_case.__class__
        if not hasattr(use_case_type, "__orig_bases__"):
            raise Exception("No args class found")
        for base in use_case_type.__orig_bases__:  # type: ignore
            args = get_args(base)
            if len(args) > 0:
                return cast(type[UseCaseArgsBase], args[0])
        raise Exception("No args class found")

    @staticmethod
    def _infer_result_class(use_case: _UseCaseT) -> type[UseCaseResultBase | None]:
        use_case_type = use_case.__class__
        if not hasattr(use_case_type, "__orig_bases__"):
            raise Exception("No result class found")
        for base in use_case_type.__orig_bases__:  # type: ignore
            args = get_args(base)
            if len(args) > 1:
                return cast(type[UseCaseResultBase | None], args[1])
        raise Exception("No result class found")

    def _build_http_name(self) -> str:
        return inflection.dasherize(
            inflection.underscore(self._use_case.__class__.__name__)
        ).replace("-use-case", "")

    def _build_api_name(self) -> str:
        return self._use_case.__class__.__name__.replace("UseCase", "")

    def _build_description(self) -> str:
        return self._use_case.__doc__ or ""

    def _build_tag(self) -> str:
        some_modules = self._use_case.__module__[
            len(self._root_module.__name__) + 1 :
        ].split(".")
        if len(some_modules) == 1:
            the_one_module = some_modules[0]
        else:
            the_one_module = some_modules[-2]
        the_one_tag = inflection.dasherize(the_one_module)
        return the_one_tag

    @abc.abstractmethod
    def attach_route(self, app: FastAPI) -> None:
        """Attach the route to the app."""


class GuestMutationCommand(
    Generic[
        _GuestMutationUseCaseT,
        _GlobalPropertiesT,
        _GuestSessionT,
        _GuestMutationContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _GuestMutationUseCaseT],
    abc.ABC,
):
    """Base class for commands which do not require authentication."""

    def attach_route(self, app: FastAPI) -> None:
        """Attach the route to the app."""

        @app.post(
            f"/{self._build_http_name()}",
            name=self._build_api_name(),
            summary=self._build_description(),
            description=self._build_description(),
            tags=[self._build_tag()],
            **_STANDARD_CONFIG,
        )
        async def do_it(request: Request):  # type: ignore[no-untyped-def]
            session = self._build_session(request)
            args_decoder = self._realm_codec_registry.get_decoder(
                self._args_type, WebRealm
            )

            decoded_args_json = await request.json()
            decoded_args = args_decoder.decode(decoded_args_json)
            result = cast(
                _UseCaseResultT,
                (await self._use_case.execute(session, decoded_args))[1],
            )
            result_encoder = self._realm_codec_registry.get_encoder(
                self._result_type, WebRealm
            )
            encoded_result = result_encoder.encode(result)
            return encoded_result

    @abc.abstractmethod
    def _build_session(self, request: Request) -> _GuestSessionT:
        """Build the session."""


class GuestReadonlyCommand(
    Generic[
        _GuestReadonlyUseCaseT,
        _GlobalPropertiesT,
        _GuestSessionT,
        _GuestReadonlyContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _GuestReadonlyUseCaseT],
    abc.ABC,
):
    """Base class for commands which just read and present data."""

    def attach_route(self, app: FastAPI) -> None:
        """Attach the route to the app."""

        @app.post(
            f"/{self._build_http_name()}",
            name=self._build_api_name(),
            summary=self._build_description(),
            description=self._build_description(),
            tags=[self._build_tag()],
            **_STANDARD_CONFIG,
        )
        async def do_it(request: Request):  # type: ignore[no-untyped-def]
            session = self._build_session(request)
            args_decoder = self._realm_codec_registry.get_decoder(
                self._args_type, WebRealm
            )
            decoded_args_json = await request.json()
            decoded_args = args_decoder.decode(decoded_args_json)
            result = cast(
                _UseCaseResultT,
                (await self._use_case.execute(session, decoded_args))[1],
            )
            result_encoder = self._realm_codec_registry.get_encoder(
                self._result_type, WebRealm
            )
            encoded_result = result_encoder.encode(result)
            return encoded_result

    @abc.abstractmethod
    def _build_session(self, request: Request) -> _GuestSessionT:
        """Build the session."""


class LoggedInMutationCommand(
    Generic[
        _LoggedInMutationUseCaseT,
        _GlobalPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _LoggedInMutationUseCaseT],
    abc.ABC,
):
    """Base class for commands which require authentication."""

    def attach_route(self, app: FastAPI) -> None:
        """Attach the route to the app."""

        @app.post(
            f"/{self._build_http_name()}",
            name=self._build_api_name(),
            summary=self._build_description(),
            description=self._build_description(),
            tags=[self._build_tag()],
            **_STANDARD_CONFIG,
        )
        async def do_it(request: Request):  # type: ignore[no-untyped-def]
            session = self._build_session(request)
            args_decoder = self._realm_codec_registry.get_decoder(
                self._args_type, WebRealm
            )

            decoded_args_json = await request.json()
            decoded_args = args_decoder.decode(decoded_args_json)
            result = cast(
                _UseCaseResultT,
                (await self._use_case.execute(session, decoded_args))[1],
            )
            result_encoder = self._realm_codec_registry.get_encoder(
                self._result_type, WebRealm
            )
            encoded_result = result_encoder.encode(result)
            return encoded_result

    @abc.abstractmethod
    def _build_session(self, request: Request) -> _LoggedInSessionT:
        """Build the session."""


class LoggedInReadonlyCommand(
    Generic[
        _LoggedInReadonlyUseCaseT,
        _GlobalPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _LoggedInReadonlyUseCaseT],
    abc.ABC,
):
    """Base class for commands which just read and present data."""

    def attach_route(self, app: FastAPI) -> None:
        """Attach the route to the app."""

        @app.post(
            f"/{self._build_http_name()}",
            name=self._build_api_name(),
            summary=self._build_description(),
            description=self._build_description(),
            tags=[self._build_tag()],
            **_STANDARD_CONFIG,
        )
        async def do_it(request: Request):  # type: ignore[no-untyped-def]
            session = self._build_session(request)
            args_decoder = self._realm_codec_registry.get_decoder(
                self._args_type, WebRealm
            )

            decoded_args_json = await request.json()
            decoded_args = args_decoder.decode(decoded_args_json)
            result = cast(
                _UseCaseResultT,
                (await self._use_case.execute(session, decoded_args))[1],
            )
            result_encoder = self._realm_codec_registry.get_encoder(
                self._result_type, WebRealm
            )
            encoded_result = result_encoder.encode(result)
            return encoded_result

    @abc.abstractmethod
    def _build_session(self, request: Request) -> _LoggedInSessionT:
        """Build the session."""


class CronCommand(
    Generic[_BackgroundMutationUseCaseT, _GlobalPropertiesT, _UseCaseResultT],
    UseCaseCommand[_GlobalPropertiesT, _BackgroundMutationUseCaseT],
    abc.ABC,
):
    """Base class for commands which just read and present data."""

    async def execute(self) -> None:
        """Execute the command."""
        await self._use_case.execute(EmptySession(), self._args_type())

    def attach_route(self, app: FastAPI) -> None:
        """Attach the route to the app."""
        raise Exception("Cron commands should not be attached to the app.")
