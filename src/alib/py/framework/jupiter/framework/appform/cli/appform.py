"""CLI app."""

import abc
import argparse
import itertools
import types
from collections.abc import Iterator
from typing import Any, Final, Generic, TypeVar, get_args, get_origin

from jupiter.framework.appform.appform import AppForm
from jupiter.framework.appform.cli.commands import (
    Command,
    GuestMutationCommand,
    GuestReadonlyCommand,
    LoggedInMutationCommand,
    LoggedInReadonlyCommand,
    TestHelperCommand,
    UseCaseCommand,
)
from jupiter.framework.appform.cli.exception import CliExceptionHandler
from jupiter.framework.appform.cli.exceptions import (
    ConnectionPrepareHandler,
    EntityAlreadyExistsHandler,
    EntityNotFoundHandler,
    ExpiredAuthTokenHandler,
    InputValidationHandler,
    InvalidAuthTokenHandler,
    MultiInputValidationHandler,
    RealmDecodingHandler,
    SessionInfoNotFoundHandler,
    UnavailableForComponentHandler,
    UnavailableForContextHandler,
    UnavailableGloballyHandler,
)
from jupiter.framework.appform.cli.session_storage import (
    SessionInfoNotFoundError,
    SessionStorage,
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
from jupiter.framework.errors import InputValidationError, MultiInputValidationError
from jupiter.framework.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework.mutation_inovcation.recorder import (
    MutationInvocationRecorder,
)
from jupiter.framework.ports import Ports
from jupiter.framework.progress_reporter.reporter import ProgressReporterFactory
from jupiter.framework.progress_reporter.reporters.noop import (
    NoOpProgressReporterFactory,
)
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmDecodingError
from jupiter.framework.storage.connection import ConnectionPrepareError
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from jupiter.framework.time_provider import TimeProvider
from jupiter.framework.use_case import (
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
from jupiter.framework.utils import find_all_modules
from rich.console import Console
from rich.panel import Panel

_UseCaseT = TypeVar("_UseCaseT", bound=UseCase[Any, Any, Any, Any, Any, Any, Any])
_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)
_CliAppFormT = TypeVar("_CliAppFormT", bound="CliAppForm[Any, Any, Any]")  # type: ignore


class CliAppForm(
    Generic[_PortsT, _GlobalPropertiesT, _ComponentPropertiesT],
    AppForm[_PortsT, _GlobalPropertiesT, _ComponentPropertiesT],
):
    """A CLI application form."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _progress_reporter_factory: Final[ProgressReporterFactory]
    _auth_token_stamper: Final[AuthTokenStamper]
    _console: Final[Console]
    _session_storage: Final[SessionStorage]
    _guest_mutation_command_ctor: type[GuestMutationCommand]  # type: ignore[type-arg]
    _guest_readoly_command_ctor: type[GuestReadonlyCommand]  # type: ignore[type-arg]
    _logged_in_mutation_command_ctor: type[LoggedInMutationCommand]  # type: ignore[type-arg]
    _logged_in_readonly_command_ctor: type[LoggedInReadonlyCommand]  # type: ignore[type-arg]
    _commands: dict[str, Command]
    _use_case_commands: dict[
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
    _exception_handlers: dict[
        type[Exception], CliExceptionHandler[GlobalProperties, Any]
    ]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
        auth_token_stamper: AuthTokenStamper,
        console: Console,
        session_storage: SessionStorage,
        guest_mutation_command_ctor: type[GuestMutationCommand],  # type: ignore[type-arg]
        guest_readonly_command_ctor: type[GuestReadonlyCommand],  # type: ignore[type-arg]
        logged_in_mutation_command_ctor: type[LoggedInMutationCommand],  # type: ignore[type-arg]
        logged_in_readonly_command_ctor: type[LoggedInReadonlyCommand],  # type: ignore[type-arg]
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._invocation_recorder = invocation_recorder
        self._progress_reporter_factory = progress_reporter_factory
        self._auth_token_stamper = auth_token_stamper
        self._console = console
        self._session_storage = session_storage
        self._guest_mutation_command_ctor = guest_mutation_command_ctor
        self._guest_readoly_command_ctor = guest_readonly_command_ctor
        self._logged_in_mutation_command_ctor = logged_in_mutation_command_ctor
        self._logged_in_readonly_command_ctor = logged_in_readonly_command_ctor
        self._commands = {}
        self._use_case_commands = {}
        self._exception_handlers = {}

    @classmethod
    def build_from_module_root(
        cls: type[_CliAppFormT],
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
        auth_token_stamper: AuthTokenStamper,
        console: Console,
        session_storage: SessionStorage,
        config_root: types.ModuleType,
        *module_root: types.ModuleType,
    ) -> "_CliAppFormT":
        """Build a CLI app from the module root."""

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

        def extract_use_case_command(
            the_module: types.ModuleType,
        ) -> Iterator[
            tuple[
                type[
                    UseCaseCommand[
                        GlobalProperties,
                        UseCase[
                            Ports,
                            GlobalProperties,
                            ComponentProperties,
                            SessionBase,
                            ContextBase,
                            UseCaseArgsBase,
                            UseCaseResultBase | None,
                        ],
                    ]
                ],
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
            ]
        ]:
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (
                    isinstance(obj, type)
                    and issubclass(origin_obj or obj, UseCaseCommand)
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

                use_case_type = get_args(obj.__orig_bases__[0])[0]  # type: ignore

                yield obj, use_case_type

        def extract_command(the_module: types.ModuleType) -> Iterator[type[Command]]:
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (
                    isinstance(obj, type)
                    and issubclass(origin_obj or obj, Command)
                    and not issubclass(origin_obj or obj, UseCaseCommand)
                ):
                    continue

                if obj is Command or obj is TestHelperCommand:
                    continue

                if obj.__module__ != the_module.__name__:
                    # This is an import, and not a definition!
                    continue

                yield obj

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
                type[Exception], type[CliExceptionHandler[GlobalProperties, Exception]]
            ]
        ]:
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (
                    isinstance(obj, type)
                    and issubclass(origin_obj or obj, CliExceptionHandler)
                    and obj is not CliExceptionHandler
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

        cli_app = cls(
            ports=ports,
            global_properties=global_properties,
            time_provider=time_provider,
            realm_codec_registry=realm_codec_registry,
            invocation_recorder=invocation_recorder,
            progress_reporter_factory=progress_reporter_factory,
            auth_token_stamper=auth_token_stamper,
            console=console,
            session_storage=session_storage,
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

        all_modules = find_all_modules(*module_root)

        for m in all_modules:
            for use_case_command_type, use_case_type in extract_use_case_command(m):
                cli_app._add_use_case_command(use_case_command_type, use_case_type)

        for m in all_modules:
            for command_type in extract_command(m):
                cli_app._add_command(command_type)

        for m in all_modules:
            for use_case_type in extract_use_case(m):
                if use_case_type in cli_app._use_case_commands:
                    continue
                cli_app._add_use_case_type(use_case_type)

        cli_app._add_exception_handler(
            UnavailableGloballyError, UnavailableGloballyHandler
        )
        cli_app._add_exception_handler(
            UnavailableForComponentError, UnavailableForComponentHandler
        )
        cli_app._add_exception_handler(
            UnavailableForContextError, UnavailableForContextHandler
        )
        cli_app._add_exception_handler(EntityNotFoundError, EntityNotFoundHandler)
        cli_app._add_exception_handler(
            EntityAlreadyExistsError, EntityAlreadyExistsHandler
        )
        cli_app._add_exception_handler(ExpiredAuthTokenError, ExpiredAuthTokenHandler)
        cli_app._add_exception_handler(InvalidAuthTokenError, InvalidAuthTokenHandler)
        cli_app._add_exception_handler(RealmDecodingError, RealmDecodingHandler)
        cli_app._add_exception_handler(InputValidationError, InputValidationHandler)
        cli_app._add_exception_handler(
            MultiInputValidationError, MultiInputValidationHandler
        )
        cli_app._add_exception_handler(
            SessionInfoNotFoundError, SessionInfoNotFoundHandler
        )
        cli_app._add_exception_handler(ConnectionPrepareError, ConnectionPrepareHandler)

        for m in find_all_modules(*module_root):
            for exception_type, exception_handler in extract_exception_handler(m):
                cli_app._add_exception_handler(exception_type, exception_handler)

        return cli_app

    def _add_use_case_command(
        self,
        use_case_command_type: type[UseCaseCommand[GlobalProperties, _UseCaseT]],
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
    ) -> None:
        if use_case_type in self._use_case_commands:
            raise Exception(
                f"Use case command type {use_case_command_type} already added"
            )
        if issubclass(use_case_type, GuestMutationUseCase):
            self._use_case_commands[use_case_type] = use_case_command_type(
                global_properties=self._global_properties,
                realm_codec_registry=self._realm_codec_registry,
                session_storage=self._session_storage,
                use_case=use_case_type(  # type: ignore
                    time_provider=self._time_provider,
                    realm_codec_registry=self._realm_codec_registry,
                    invocation_recorder=self._invocation_recorder,
                    progress_reporter_factory=NoOpProgressReporterFactory(),
                    global_properties=self._global_properties,
                    auth_token_stamper=self._auth_token_stamper,
                    ports=self._ports,
                ),
            )
        elif issubclass(use_case_type, GuestReadonlyUseCase):
            self._use_case_commands[use_case_type] = use_case_command_type(
                global_properties=self._global_properties,
                realm_codec_registry=self._realm_codec_registry,
                session_storage=self._session_storage,
                use_case=use_case_type(  # type: ignore
                    global_properties=self._global_properties,
                    time_provider=self._time_provider,
                    realm_codec_registry=self._realm_codec_registry,
                    auth_token_stamper=self._auth_token_stamper,
                    ports=self._ports,
                ),
            )
        elif issubclass(use_case_type, LoggedInMutationUseCase):
            self._use_case_commands[use_case_type] = use_case_command_type(
                global_properties=self._global_properties,
                realm_codec_registry=self._realm_codec_registry,
                session_storage=self._session_storage,
                use_case=use_case_type(  # type: ignore
                    time_provider=self._time_provider,
                    realm_codec_registry=self._realm_codec_registry,
                    invocation_recorder=self._invocation_recorder,
                    progress_reporter_factory=self._progress_reporter_factory,
                    global_properties=self._global_properties,
                    auth_token_stamper=self._auth_token_stamper,
                    ports=self._ports,
                ),
            )
        elif issubclass(use_case_type, LoggedInReadonlyUseCase):
            self._use_case_commands[use_case_type] = use_case_command_type(
                global_properties=self._global_properties,
                realm_codec_registry=self._realm_codec_registry,
                session_storage=self._session_storage,
                use_case=use_case_type(  # type: ignore
                    global_properties=self._global_properties,
                    time_provider=self._time_provider,
                    realm_codec_registry=self._realm_codec_registry,
                    auth_token_stamper=self._auth_token_stamper,
                    ports=self._ports,
                ),
            )
        else:
            pass

    def _add_command(self, command_type: type[Command]) -> None:
        command = command_type(
            session_storage=self._session_storage,
        )
        if command.name() in self._commands:
            raise Exception(f"Command type {command} already added")
        self._commands[command.name()] = command

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
    ) -> None:
        if use_case_type in self._use_case_commands:
            raise Exception(f"Use case type {use_case_type} already added")
        if issubclass(use_case_type, GuestMutationUseCase):
            self._use_case_commands[use_case_type] = self._guest_mutation_command_ctor(
                global_properties=self._global_properties,
                realm_codec_registry=self._realm_codec_registry,
                session_storage=self._session_storage,
                use_case=use_case_type(
                    ports=self._ports,
                    global_properties=self._global_properties,
                    time_provider=self._time_provider,
                    realm_codec_registry=self._realm_codec_registry,
                    invocation_recorder=self._invocation_recorder,
                    progress_reporter_factory=NoOpProgressReporterFactory(),
                    auth_token_stamper=self._auth_token_stamper,
                ),
            )
        elif issubclass(use_case_type, GuestReadonlyUseCase):
            self._use_case_commands[use_case_type] = self._guest_readoly_command_ctor(
                global_properties=self._global_properties,
                realm_codec_registry=self._realm_codec_registry,
                session_storage=self._session_storage,
                use_case=use_case_type(
                    ports=self._ports,
                    global_properties=self._global_properties,
                    time_provider=self._time_provider,
                    realm_codec_registry=self._realm_codec_registry,
                    auth_token_stamper=self._auth_token_stamper,
                ),
            )
        elif issubclass(use_case_type, LoggedInMutationUseCase):
            self._use_case_commands[use_case_type] = (
                self._logged_in_mutation_command_ctor(
                    global_properties=self._global_properties,
                    realm_codec_registry=self._realm_codec_registry,
                    session_storage=self._session_storage,
                    use_case=use_case_type(
                        ports=self._ports,
                        global_properties=self._global_properties,
                        time_provider=self._time_provider,
                        realm_codec_registry=self._realm_codec_registry,
                        invocation_recorder=self._invocation_recorder,
                        progress_reporter_factory=self._progress_reporter_factory,
                        auth_token_stamper=self._auth_token_stamper,
                    ),
                )
            )
        elif issubclass(use_case_type, LoggedInReadonlyUseCase):
            self._use_case_commands[use_case_type] = (
                self._logged_in_readonly_command_ctor(
                    global_properties=self._global_properties,
                    realm_codec_registry=self._realm_codec_registry,
                    session_storage=self._session_storage,
                    use_case=use_case_type(
                        ports=self._ports,
                        global_properties=self._global_properties,
                        time_provider=self._time_provider,
                        realm_codec_registry=self._realm_codec_registry,
                        auth_token_stamper=self._auth_token_stamper,
                    ),
                )
            )
        else:
            pass
            # raise Exception(f"Unsupported use case type {use_case_type}")

    def _add_exception_handler(
        self,
        exception_type: type[_ExceptionT],
        exception_handler: type[CliExceptionHandler[GlobalProperties, _ExceptionT]],
    ) -> CliExceptionHandler[GlobalProperties, _ExceptionT]:
        if exception_type in self._exception_handlers:
            raise Exception(
                f"Exception type {exception_type} already has an exception handler"
            )
        self._exception_handlers[exception_type] = exception_handler(
            self._global_properties
        )
        return self._exception_handlers[exception_type]

    async def run(self, argv: list[str]) -> None:
        """Run the CLI app form."""
        parser = argparse.ArgumentParser(description=self.help_description)
        parser.add_argument(
            "--version",
            dest="just_show_version",
            action="store_const",
            default=False,
            const=True,
            help="Show the version of the application",
        )

        subparsers = parser.add_subparsers(
            dest="subparser_name",
            help="Sub-command help",
            metavar="{command}",
        )

        for command in itertools.chain(
            self._commands.values(), self._use_case_commands.values()
        ):
            if not command.is_allowed_globally:
                continue

            if not command.is_allowed_for_component:
                continue

            if command.should_appear_in_global_help:
                command_parser = subparsers.add_parser(
                    command.name(),
                    help=command.description(),
                    description=command.description(),
                )
            else:
                command_parser = subparsers.add_parser(
                    command.name(),
                    description=command.description(),
                )
            command.build_parser(command_parser)

        args = parser.parse_args(argv[1:])

        if args.just_show_version:
            print(self.help_version)
            return

        for command in itertools.chain(
            self._commands.values(), self._use_case_commands.values()
        ):
            if args.subparser_name != command.name():
                continue

            with self._progress_reporter_factory.envelope(
                name=command.name(),
                add_prologue_and_epilogue=command.should_have_streaming_progress_report,
            ):
                try:
                    await command.run(self._console, args)
                except Exception as e:
                    if type(e) not in self._exception_handlers:
                        raise

                    self._exception_handlers[type(e)].handle(self._console, e)

            command_postscript = command.get_postscript()
            if command_postscript is not None:
                postscript_panel = Panel(
                    command_postscript, title="PS.", title_align="left"
                )
                self._console.print(postscript_panel)

            break

    @property
    @abc.abstractmethod
    def help_description(self) -> str:
        """The description for the cli app."""

    @property
    @abc.abstractmethod
    def help_version(self) -> str:
        """The version of the cli app."""
