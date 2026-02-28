"""The app, part of the framework."""

import abc
import dataclasses
import types
import typing
from collections.abc import Iterator
from datetime import date, datetime
from itertools import groupby
from json import JSONDecodeError
from typing import (
    Annotated,
    Any,
    Final,
    ForwardRef,
    Generic,
    TypeVar,
    cast,
    get_args,
    get_origin,
)

import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.openapi.utils import get_openapi
from fastapi.routing import APIRoute
from fastapi.security import OAuth2PasswordRequestForm
from jupiter.framework.appform.appform import AppForm
from jupiter.framework.appform.webapi.commands import (
    Command,
    CronCommand,
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
    UseCaseCommand,
)
from jupiter.framework.appform.webapi.exception import WebApiExceptionHandler
from jupiter.framework.appform.webapi.exceptions import (
    EntityAlreadyExistsHandler,
    EntityNotFoundHandler,
    ExpiredAuthTokenHandler,
    InputValidationHandler,
    InvalidAuthTokenHandler,
    JSONDecodeHandler,
    MultiInputValidationHandler,
    RealmDecodingHandler,
    UnavailableForComponentHandler,
    UnavailableForContextHandler,
    UnavailableGloballyHandler,
)
from jupiter.framework.auth.auth_token import (
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework.component_properties import (
    ComponentProperties,
    UnavailableForComponentError,
)
from jupiter.framework.entity import Entity, ParentLink
from jupiter.framework.errors import InputValidationError, MultiInputValidationError
from jupiter.framework.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework.mutation_inovcation.recorder import (
    MutationInvocationRecorder,
)
from jupiter.framework.openapi import OPENAPI_ERROR_RESPONSES
from jupiter.framework.optional import normalize_optional
from jupiter.framework.ports import Ports
from jupiter.framework.primitive import Primitive
from jupiter.framework.progress_reporter.reporters.noop import (
    NoOpProgressReporterFactory,
)
from jupiter.framework.progress_reporter.reporters.websocket import (
    WebsocketProgressReporterFactory,
)
from jupiter.framework.realm.realm import (
    DomainThing,
    RealmCodecRegistry,
    RealmDecodingError,
    WebRealm,
)
from jupiter.framework.record import Record
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from jupiter.framework.time_provider import (
    CronRunTimeProvider,
    PerRequestTimeProvider,
)
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    BackgroundMutationUseCase,
    ContextBase,
    GuestMutationUseCase,
    GuestReadonlyUseCase,
    LoggedInMutationUseCase,
    LoggedInReadonlyUseCase,
    SessionBase,
    UnavailableForContextError,
    UseCase,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework.utils.utils import (
    find_all_modules,
    is_primitive_type,
    is_thing_ish_type,
)
from jupiter.framework.value import (
    AtomicValue,
    CompositeValue,
    EnumValue,
    SecretValue,
)
from pendulum.date import Date
from pendulum.datetime import DateTime
from starlette import status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)
_WebApiAppFormT = TypeVar("_WebApiAppFormT", bound="WebApiAppForm[Any, Any, Any, Any]")


class WebApiAppForm(
    AppForm[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
    Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
):
    """A Web based API application."""

    _request_time_provider: Final[PerRequestTimeProvider]
    _cron_time_provider: Final[CronRunTimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _progress_reporter_factory: Final[WebsocketProgressReporterFactory]
    _auth_token_stamper: Final[AuthTokenStamper]
    _fast_app: Final[FastAPI]
    _scheduler: Final[AsyncIOScheduler]
    _guest_mutation_command_ctor: type[GuestMutationCommand]  # type: ignore[type-arg]
    _guest_readoly_command_ctor: type[GuestReadonlyCommand]  # type: ignore[type-arg]
    _logged_in_mutation_command_ctor: type[LoggedInMutationCommand]  # type: ignore[type-arg]
    _logged_in_readonly_command_ctor: type[LoggedInReadonlyCommand]  # type: ignore[type-arg]
    _commands: Final[dict[str, Command]]
    _use_case_commands: Final[
        dict[
            type[
                UseCase[
                    Ports,
                    GlobalProperties,
                    ComponentProperties,
                    SessionBase,
                    ContextBase,
                    UseCaseArgsBase,
                    UseCaseResultBase | None,
                ]
            ],
            Command,
        ]
    ]
    _exception_handlers: Final[
        dict[
            type[Exception],
            WebApiExceptionHandler[GlobalProperties, ServiceProperties, Any],
        ]
    ]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        request_time_provider: PerRequestTimeProvider,
        cron_time_provider: CronRunTimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: WebsocketProgressReporterFactory,
        auth_token_stamper: AuthTokenStamper,
        guest_mutation_command_ctor: type[GuestMutationCommand],  # type: ignore[type-arg]
        guest_readonly_command_ctor: type[GuestReadonlyCommand],  # type: ignore[type-arg]
        logged_in_mutation_command_ctor: type[LoggedInMutationCommand],  # type: ignore[type-arg]
        logged_in_readonly_command_ctor: type[LoggedInReadonlyCommand],  # type: ignore[type-arg]
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties, service_properties)
        self._request_time_provider = request_time_provider
        self._cron_time_provider = cron_time_provider
        self._realm_codec_registry = realm_codec_registry
        self._invocation_recorder = invocation_recorder
        self._progress_reporter_factory = progress_reporter_factory
        self._auth_token_stamper = auth_token_stamper
        self._guest_mutation_command_ctor = guest_mutation_command_ctor
        self._guest_readonly_command_ctor = guest_readonly_command_ctor
        self._logged_in_mutation_command_ctor = logged_in_mutation_command_ctor
        self._logged_in_readonly_command_ctor = logged_in_readonly_command_ctor
        self._fast_app = FastAPI(
            title=self.api_description,
            version=self.api_version,
            generate_unique_id_function=self._custom_generate_unique_id,
            openapi_url=self.openapi_json_route if not self.is_live else None,
            docs_url=self.openapi_docs_route if not self.is_live else None,
            redoc_url=self.openapi_redoc_route if not self.is_live else None,
        )
        self._fast_app.openapi = self._custom_openapi  # type: ignore[method-assign]
        self._scheduler = AsyncIOScheduler()
        self._commands = {}
        self._use_case_commands = {}
        self._exception_handlers = {}

    @classmethod
    def build_from_module_root(
        cls: type[_WebApiAppFormT],
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        request_time_provider: PerRequestTimeProvider,
        cron_run_time_provider: CronRunTimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: WebsocketProgressReporterFactory,
        auth_token_stamper: AuthTokenStamper,
        config_root: types.ModuleType,
        *module_root: types.ModuleType,
    ) -> "_WebApiAppFormT":
        """Build the app from the module root."""

        def extract_specific_command(the_module: types.ModuleType, clazz: type) -> type:  # type: ignore[type-arg]
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (isinstance(obj, type) and issubclass(origin_obj or obj, clazz)):
                    continue

                if obj.__module__ != the_module.__name__:
                    # This is an import, and not a definition!
                    continue

                if not hasattr(obj, "__parameters__") or not hasattr(
                    obj.__parameters__, "__len__"
                ):
                    continue

                if len(obj.__parameters__) == 0:  # type: ignore
                    # This should still be a generic type
                    continue

                return obj

            raise Exception(f"Could not find {clazz.__name__} in {the_module.__name__}")

        def extract_use_case(
            the_module: types.ModuleType,
        ) -> Iterator[
            type[
                UseCase[
                    Ports,
                    GlobalProperties,
                    ComponentProperties,
                    SessionBase,
                    ContextBase,
                    UseCaseArgsBase,
                    UseCaseResultBase | None,
                ]
            ]
        ]:
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (
                    isinstance(obj, type) and issubclass(origin_obj or obj, UseCase)
                ):
                    continue

                if obj.__module__ != the_module.__name__:
                    # This is an import, and not a definition!
                    continue

                if not hasattr(obj, "__parameters__") or not hasattr(
                    obj.__parameters__, "__len__"
                ):
                    continue

                if len(obj.__parameters__) > 0:  # type: ignore
                    # This is not a concret type and we can move on
                    continue

                yield obj

        def extract_exception_handler(
            the_module: types.ModuleType,
        ) -> Iterator[
            tuple[
                type[Exception],
                type[
                    WebApiExceptionHandler[
                        GlobalProperties, ServiceProperties, Exception
                    ]
                ],
            ]
        ]:
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (
                    isinstance(obj, type)
                    and issubclass(origin_obj or obj, WebApiExceptionHandler)
                    and obj is not WebApiExceptionHandler
                ):
                    continue

                if obj.__module__ != the_module.__name__:
                    # This is an import, and not a definition!
                    continue

                if not hasattr(obj, "__parameters__") or not hasattr(
                    obj.__parameters__, "__len__"
                ):
                    continue

                if len(obj.__parameters__) > 0:  # type: ignore
                    # This is not a concret type and we can move on
                    continue

                exception_type = get_args(obj.__orig_bases__[0])[0]  # type: ignore

                yield exception_type, obj

        app = cls(
            ports=ports,
            global_properties=global_properties,
            service_properties=service_properties,
            request_time_provider=request_time_provider,
            cron_time_provider=cron_run_time_provider,
            realm_codec_registry=realm_codec_registry,
            invocation_recorder=invocation_recorder,
            progress_reporter_factory=progress_reporter_factory,
            auth_token_stamper=auth_token_stamper,
            guest_mutation_command_ctor=extract_specific_command(
                config_root, GuestMutationCommand
            ),
            guest_readonly_command_ctor=extract_specific_command(
                config_root, GuestReadonlyCommand
            ),
            logged_in_mutation_command_ctor=extract_specific_command(
                config_root, LoggedInMutationCommand
            ),
            logged_in_readonly_command_ctor=extract_specific_command(
                config_root, LoggedInReadonlyCommand
            ),
        )

        @app._fast_app.get(app.healthz_route, status_code=status.HTTP_200_OK)
        async def healthz() -> None:
            """Health check endpoint."""
            return None

        @app._fast_app.post(app.simple_login_route, status_code=status.HTTP_200_OK)
        async def simple_login(
            form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        ) -> dict[str, str]:
            """Simple login endpoint."""
            email_address_raw = form_data.username
            password_raw = form_data.password
            return await app.simple_login(email_address_raw, password_raw)

        for mr in module_root:
            for m in find_all_modules(mr):
                for use_case_type in extract_use_case(m):
                    if use_case_type in app._use_case_commands:
                        continue
                    app._add_use_case_type(use_case_type, mr)

        cron_idx = 0
        for use_case, command in app._use_case_commands.items():
            if isinstance(command, CronCommand):
                app._scheduler.add_job(
                    command.execute,
                    id=use_case.__name__,
                    name=use_case.__name__,
                    trigger="cron",
                    day="*",
                    hour=min(23, cron_idx),
                )
                cron_idx += 1
            elif isinstance(command, UseCaseCommand):
                command.attach_route(app._fast_app)
            else:
                raise Exception(f"Unknown command type {command}")

        app._add_exception_handler(
            UnavailableGloballyError, UnavailableGloballyHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            UnavailableForComponentError, UnavailableForComponentHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            UnavailableForContextError, UnavailableForContextHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            EntityNotFoundError, EntityNotFoundHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            EntityAlreadyExistsError, EntityAlreadyExistsHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            ExpiredAuthTokenError, ExpiredAuthTokenHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            InvalidAuthTokenError, InvalidAuthTokenHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(JSONDecodeError, JSONDecodeHandler).attach_handler(
            app._fast_app
        )
        app._add_exception_handler(
            InputValidationError, InputValidationHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            MultiInputValidationError, MultiInputValidationHandler
        ).attach_handler(app._fast_app)
        app._add_exception_handler(
            RealmDecodingError, RealmDecodingHandler
        ).attach_handler(app._fast_app)

        for mr in module_root:
            for m in find_all_modules(mr):
                for exception_type, exception_handler in extract_exception_handler(m):
                    if exception_type in app._exception_handlers:
                        continue
                    handler = app._add_exception_handler(
                        exception_type, exception_handler
                    )
                    handler.attach_handler(app._fast_app)

        return app

    async def run(self, argv: list[str]) -> None:
        """Run the Web API app form."""
        self._scheduler.start()

        self._fast_app.add_middleware(
            BaseHTTPMiddleware, dispatch=self._time_provider_middleware
        )
        self._fast_app.add_middleware(
            BaseHTTPMiddleware, dispatch=self._setting_middleware
        )

        config = uvicorn.Config(
            self._fast_app,
            host=self.host,
            port=self.port,
            log_config=None,
            log_level="info",
        )
        server = uvicorn.Server(config)
        await server.serve()

    @property
    @abc.abstractmethod
    def api_description(self) -> str:
        """The description of the app."""

    @property
    @abc.abstractmethod
    def api_version(self) -> str:
        """The version of the app."""

    @property
    @abc.abstractmethod
    def host(self) -> str:
        """The host of the app."""

    @property
    @abc.abstractmethod
    def port(self) -> int:
        """The port of the app."""

    @property
    @abc.abstractmethod
    def is_live(self) -> bool:
        """Whether the app is live."""

    @property
    def healthz_route(self) -> str:
        """The healthz route of the app."""
        return "/healthz"

    @property
    def simple_login_route(self) -> str:
        """The healthz route of the app."""
        return "/simple-login"

    @property
    def openapi_json_route(self) -> str:
        """The openapi json route of the app."""
        return "/openapi.json"

    @property
    def openapi_docs_route(self) -> str:
        """The openapi docs route of the app."""
        return "/docs"

    @property
    def openapi_redoc_route(self) -> str:
        """The openapi redoc route of the app."""
        return "/redoc"

    def add_headers_to_response(self, response: Response) -> None:
        """Add the headers to the response."""

    async def simple_login(
        self, email_address_raw: str, password_raw: str
    ) -> dict[str, str]:
        """Simple login endpoint."""
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Not implemented",
        )

    def _custom_generate_unique_id(self, route: APIRoute) -> str:
        """Generate a OpenAPI unique id from just the route name."""
        return f"{route.name}"

    async def _time_provider_middleware(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        """Middleware to provide the time provider."""
        self._request_time_provider.set_request_time()
        return await call_next(request)

    async def _setting_middleware(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        """Middleware to provide the version."""
        response: Response = await call_next(request)
        self.add_headers_to_response(response)  # mutate in place
        return response

    def _add_use_case_type(
        self,
        use_case_type: type[
            UseCase[
                Ports,
                GlobalProperties,
                ComponentProperties,
                SessionBase,
                ContextBase,
                UseCaseArgsBase,
                UseCaseResultBase | None,
            ]
        ],
        root_module: types.ModuleType,
    ) -> None:
        if use_case_type in self._use_case_commands:
            raise Exception(f"Use case type {use_case_type} already added")
        if issubclass(use_case_type, GuestMutationUseCase):
            use_case = use_case_type(  # type: ignore
                time_provider=self._request_time_provider,
                realm_codec_registry=self._realm_codec_registry,
                invocation_recorder=self._invocation_recorder,
                progress_reporter_factory=NoOpProgressReporterFactory(),
                global_properties=self._global_properties,
                auth_token_stamper=self._auth_token_stamper,
                ports=self._ports,
            )
            if not use_case.is_allowed_globally:
                return

            self._use_case_commands[use_case_type] = self._guest_mutation_command_ctor(
                global_properties=self._global_properties,
                service_properties=self._service_properties,
                realm_codec_registry=self._realm_codec_registry,
                use_case=use_case,
                root_module=root_module,
            )
        elif issubclass(use_case_type, GuestReadonlyUseCase):
            use_case = use_case_type(  # type: ignore
                global_properties=self._global_properties,
                time_provider=self._request_time_provider,
                realm_codec_registry=self._realm_codec_registry,
                auth_token_stamper=self._auth_token_stamper,
                ports=self._ports,
            )
            if not use_case.is_allowed_globally:
                return

            self._use_case_commands[use_case_type] = self._guest_readonly_command_ctor(
                global_properties=self._global_properties,
                service_properties=self._service_properties,
                realm_codec_registry=self._realm_codec_registry,
                use_case=use_case,
                root_module=root_module,
            )
        elif issubclass(use_case_type, LoggedInMutationUseCase):
            use_case = use_case_type(  # type: ignore
                global_properties=self._global_properties,
                time_provider=self._request_time_provider,
                realm_codec_registry=self._realm_codec_registry,
                invocation_recorder=self._invocation_recorder,
                progress_reporter_factory=self._progress_reporter_factory,
                auth_token_stamper=self._auth_token_stamper,
                ports=self._ports,
            )

            if not use_case.is_allowed_globally:
                return

            self._use_case_commands[use_case_type] = (
                self._logged_in_mutation_command_ctor(
                    global_properties=self._global_properties,
                    service_properties=self._service_properties,
                    realm_codec_registry=self._realm_codec_registry,
                    use_case=use_case,
                    root_module=root_module,
                )
            )
        elif issubclass(use_case_type, LoggedInReadonlyUseCase):
            use_case = use_case_type(  # type: ignore
                global_properties=self._global_properties,
                time_provider=self._request_time_provider,
                realm_codec_registry=self._realm_codec_registry,
                auth_token_stamper=self._auth_token_stamper,
                ports=self._ports,
            )

            if not use_case.is_allowed_globally:
                return

            self._use_case_commands[use_case_type] = (
                self._logged_in_readonly_command_ctor(
                    global_properties=self._global_properties,
                    service_properties=self._service_properties,
                    realm_codec_registry=self._realm_codec_registry,
                    use_case=use_case,
                    root_module=root_module,
                )
            )
        elif issubclass(use_case_type, BackgroundMutationUseCase):
            use_case = use_case_type(  # type: ignore
                ports=self._ports,
                global_properties=self._global_properties,
                time_provider=self._cron_time_provider,
                realm_codec_registry=self._realm_codec_registry,
                progress_reporter_factory=NoOpProgressReporterFactory(),
            )

            if not use_case.is_allowed_globally:
                return

            self._use_case_commands[use_case_type] = CronCommand(
                global_properties=self._global_properties,
                service_properties=self._service_properties,
                realm_codec_registry=self._realm_codec_registry,
                use_case=use_case,
                root_module=root_module,
            )
        else:
            pass
            # raise Exception(f"Unsupported use case type {use_case_type}")

    def _add_exception_handler(
        self,
        exception_type: type[_ExceptionT],
        exception_handler: type[
            WebApiExceptionHandler[GlobalProperties, ServiceProperties, _ExceptionT]
        ],
    ) -> WebApiExceptionHandler[GlobalProperties, ServiceProperties, _ExceptionT]:
        if exception_type in self._exception_handlers:
            raise Exception(f"Exception type {exception_type} already added")
        handler = exception_handler(
            self._global_properties, self._service_properties, exception_type
        )
        self._exception_handlers[exception_type] = handler
        return handler

    def _custom_openapi(self) -> dict[str, Any]:  # type: ignore
        def build_field_name(
            field: dataclasses.Field[DomainThing],
            field_type: type[DomainThing] | ForwardRef | str | type[ParentLink],
        ) -> str:
            if field_type is ParentLink:
                return f"{field.name}_ref_id"
            else:
                return field.name

        def build_primitive_type(primitive_type: type[Primitive]) -> str:
            if primitive_type is type(None):
                return "null"
            elif primitive_type is bool:
                return "boolean"
            elif primitive_type is int:
                return "integer"
            elif primitive_type is float:
                return "number"
            elif primitive_type is str:
                return "string"
            elif primitive_type is date:
                return "string"
            elif primitive_type is datetime:
                return "string"
            elif primitive_type is Date:
                return "string"
            elif primitive_type is DateTime:
                return "string"
            else:
                raise Exception(f"Invalid primitive type {primitive_type}")

        def build_composite_field(
            field: dataclasses.Field[DomainThing],
            field_type: type[DomainThing] | ForwardRef | str | type[ParentLink],
        ) -> dict[str, Any]:
            if isinstance(field_type, typing._GenericAlias) and field_type.__name__ == "Literal":  # type: ignore
                return {
                    "title": field.name.capitalize(),
                    "enum": field_type.__args__,
                    "type": "string",
                }
            elif isinstance(field_type, ForwardRef):
                raise Exception(
                    f"Invalid forward ref field {field.name} of type {field_type}"
                )
            elif isinstance(field_type, str):
                return {"$ref": f"#/components/schemas/{field_type}"}
            elif field_type is ParentLink:
                return {"title": f"{field.name.capitalize()} RefId", "type": "string"}
            elif is_primitive_type(field_type):
                return {
                    "title": field.name.capitalize(),
                    "type": build_primitive_type(field_type),
                }
            elif is_thing_ish_type(field_type):
                return {"$ref": f"#/components/schemas/{field_type.__name__}"}
            elif (field_type_origin := get_origin(field_type)) is not None:
                if field_type_origin is typing.Union or (
                    isinstance(field_type_origin, type)
                    and issubclass(field_type_origin, types.UnionType)
                ):
                    # field_type_no, is_optional = normalize_optional(field_type)
                    # if is_optional:
                    #     return build_composite_field(field, field_type_no)

                    field_args = cast(
                        list[type[DomainThing] | ForwardRef | str], get_args(field_type)
                    )
                    return {
                        "anyOf": [build_composite_field(field, fa) for fa in field_args]
                    }
                elif field_type_origin is UpdateAction:
                    update_action_type = cast(
                        type[DomainThing] | ForwardRef | str, get_args(field_type)[0]
                    )
                    return {
                        "title": field.name.capitalize(),
                        "type": "object",
                        "required": ["should_change"],
                        "properties": {
                            "should_change": {
                                "title": "Should Change",
                                "type": "boolean",
                            },
                            "value": build_composite_field(field, update_action_type),
                        },
                    }
                elif field_type_origin is list:
                    list_item_type = cast(
                        type[DomainThing] | ForwardRef | str, get_args(field_type)[0]
                    )
                    return {
                        "type": "array",
                        "items": build_composite_field(field, list_item_type),
                    }
                elif field_type_origin is set:
                    list_item_type = cast(
                        type[DomainThing] | ForwardRef | str, get_args(field_type)[0]
                    )
                    return {
                        "type": "array",
                        "items": build_composite_field(field, list_item_type),
                    }
                elif field_type_origin is dict:
                    dict_value_type = cast(
                        type[DomainThing] | ForwardRef | str, get_args(field_type)[1]
                    )
                    return {
                        "type": "object",
                        "additionalProperties": build_composite_field(
                            field, dict_value_type
                        ),
                    }
                else:
                    raise Exception(f"Invalid field {field.name} of type {field_type}")
            else:
                raise Exception(f"Invalid field {field.name} of type {field_type}")

        def build_enum_value_schema(enum_value_type: type[EnumValue]) -> dict[str, Any]:
            return {
                "title": enum_value_type.__name__,
                "description": enum_value_type.__doc__,
                "enum": enum_value_type.get_all_values(),
            }

        def build_atomic_value_schema(
            atomic_value_type: type[AtomicValue[Primitive]],
        ) -> dict[str, Any]:
            return {
                "title": atomic_value_type.__name__,
                "description": atomic_value_type.__doc__,
                "type": build_primitive_type(atomic_value_type.base_type_hack()),
            }

        def build_composite_schema(
            composite_value_type: type[
                CompositeValue | Entity | Record | UseCaseArgsBase | UseCaseResultBase
            ],
        ) -> dict[str, Any]:
            required = [
                build_field_name(f, f.type)
                for f in dataclasses.fields(composite_value_type)
                if f.name != "events"
                and not normalize_optional(cast(type[object], f.type))[1]
            ]
            result: dict[str, None | str | list[str] | dict[str, Any]] = {
                "title": composite_value_type.__name__,
                "description": composite_value_type.__doc__,
                "type": "object",
                "properties": {
                    build_field_name(f, f.type): build_composite_field(f, f.type)
                    for f in dataclasses.fields(composite_value_type)
                    if f.name != "events"
                },
            }
            if len(required) > 0:
                result["required"] = required
            return result

        def build_secret_value_schema(
            secret_value_type: type[SecretValue],
        ) -> dict[str, Any]:
            return {
                "title": secret_value_type.__name__,
                "description": secret_value_type.__doc__,
                "type": "string",
            }

        if self._fast_app.openapi_schema:
            return self._fast_app.openapi_schema

        openapi_schema = get_openapi(
            title=self.api_description,
            version=self.api_version,
            routes=self._fast_app.routes,
            description=self.api_description,
        )

        # Generate all components

        openapi_schema["components"] = {}

        openapi_schema["components"]["securitySchemes"] = {
            "OAuth2PasswordBearer": {
                "type": "oauth2",
                "flows": {
                    "password": {"tokenUrl": self.simple_login_route, "scopes": {}},
                },
            },
            # "Bearer": {
            #     "type": "http",
            #     "scheme": "bearer",
            #     "bearerFormat": "JWT"
            # }
        }

        schemas: dict[str, Any] = {}

        for enum_value_type in self._realm_codec_registry.get_all_registered_types(
            EnumValue, WebRealm
        ):
            schemas[enum_value_type.__name__] = build_enum_value_schema(enum_value_type)

        for atomic_value_type in self._realm_codec_registry.get_all_registered_types(AtomicValue, WebRealm):  # type: ignore[type-abstract]
            schemas[atomic_value_type.__name__] = build_atomic_value_schema(
                atomic_value_type
            )

        for composite_value_type in self._realm_codec_registry.get_all_registered_types(
            CompositeValue, WebRealm
        ):
            schemas[composite_value_type.__name__] = build_composite_schema(
                composite_value_type
            )

        for secret_value_type in self._realm_codec_registry.get_all_registered_types(
            SecretValue, WebRealm
        ):
            schemas[secret_value_type.__name__] = build_secret_value_schema(
                secret_value_type
            )

        for entity_type in self._realm_codec_registry.get_all_registered_types(
            Entity, WebRealm
        ):
            schemas[entity_type.__name__] = build_composite_schema(entity_type)

        for record_type in self._realm_codec_registry.get_all_registered_types(
            Record, WebRealm
        ):
            schemas[record_type.__name__] = build_composite_schema(record_type)

        for use_case_args_type in self._realm_codec_registry.get_all_registered_types(
            UseCaseArgsBase, WebRealm
        ):
            schemas[use_case_args_type.__name__] = build_composite_schema(
                use_case_args_type
            )

        for use_case_result_type in self._realm_codec_registry.get_all_registered_types(
            UseCaseResultBase, WebRealm
        ):
            schemas[use_case_result_type.__name__] = build_composite_schema(
                use_case_result_type
            )

        openapi_schema["components"]["schemas"] = schemas

        # Link api with components

        for _use_case, command in self._use_case_commands.items():
            if not (
                isinstance(command, UseCaseCommand)
                and not isinstance(command, CronCommand)
            ):
                continue

            paths_object: dict[str, Any] = {}

            paths_object["summary"] = command._build_description()
            paths_object["operationId"] = command._build_operation_id()
            paths_object["tags"] = [command._build_tag]

            if isinstance(command, (GuestMutationCommand, GuestReadonlyCommand)):
                paths_object["security"] = []
            elif isinstance(
                command, (LoggedInMutationCommand, LoggedInReadonlyCommand)
            ):
                paths_object["security"] = [{"OAuth2PasswordBearer": []}]
            else:
                raise Exception(f"Unsupported command type {type(command)}")

            paths_object["requestBody"] = {
                "description": "The input data",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": f"#/components/schemas/{command._args_type.__name__}"
                        }
                    }
                },
            }

            paths_object["responses"] = {}

            if command._result_type is not type(None):
                paths_object["responses"]["200"] = {
                    "description": "Successful response",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": f"#/components/schemas/{command._result_type.__name__}"
                            }
                        }
                    },
                }
            else:
                paths_object["responses"]["200"] = {
                    "description": "Successful response / Empty body",
                }

            all_handlers_by_status_code = groupby(
                sorted(
                    self._exception_handlers.values(),
                    key=lambda handler: handler.get_status_code(),
                ),
                key=lambda handler: handler.get_status_code(),
            )

            for status_code, handlers in all_handlers_by_status_code:
                all_exceptions = ", ".join(
                    [handler._exception_type.__name__ for handler in handlers]
                )
                paths_object["responses"][str(status_code)] = {
                    "description": f"Error response for {all_exceptions}",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                        }
                    },
                }

            openapi_schema["paths"][f"/{command._build_http_name()}"][
                "post"
            ] = paths_object

        openapi_schema["components"]["schemas"].update(OPENAPI_ERROR_RESPONSES)

        del openapi_schema["paths"][self.healthz_route]
        del openapi_schema["paths"][self.simple_login_route]

        self._fast_app.openapi_schema = openapi_schema
        return self._fast_app.openapi_schema
