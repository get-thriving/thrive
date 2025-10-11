"""Cli app commands and infra."""

import abc
import dataclasses
import types
import typing
from argparse import ArgumentParser, Namespace
from datetime import date, datetime
from typing import Any, Final, Generic, TypeVar, Union, cast, get_args, get_origin

import inflection
from jupiter.framework_new.app.cli.session_storage import SessionInfo, SessionStorage
from jupiter.framework_new.global_properties import GlobalProperties
from jupiter.framework_new.primitive import Primitive
from jupiter.framework_new.realm import CliRealm, RealmCodecRegistry
from jupiter.framework_new.thing import Thing
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    AppGuestMutationUseCase,
    AppGuestMutationUseCaseContext,
    AppGuestReadonlyUseCase,
    AppGuestReadonlyUseCaseContext,
    AppGuestUseCaseSession,
    AppLoggedInMutationUseCase,
    AppLoggedInMutationUseCaseContext,
    AppLoggedInReadonlyUseCase,
    AppLoggedInReadonlyUseCaseContext,
    AppLoggedInUseCaseSession,
    UseCase,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework_new.value import (
    AtomicValue,
    CompositeValue,
    EnumValue,
    SecretValue,
)
from pendulum.date import Date
from pendulum.datetime import DateTime
from rich.console import Console
from rich.text import Text

_UseCaseT = TypeVar(
    "_UseCaseT", bound=UseCase[Any, Any, Any, Any, Any, Any, Any]
)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_AppGuestUseCaseSessionT = TypeVar(
    "_AppGuestUseCaseSessionT", bound=AppGuestUseCaseSession
)
_AppLoggedInUseCaseSessionT = TypeVar(
    "_AppLoggedInUseCaseSessionT", bound=AppLoggedInUseCaseSession
)
_GuestMutationUseCaseContextT = TypeVar(
    "_GuestMutationUseCaseContextT", bound=AppGuestMutationUseCaseContext
)
_GuestReadonlyUseCaseContextT = TypeVar(
    "_GuestReadonlyUseCaseContextT", bound=AppGuestReadonlyUseCaseContext
)
_LoggedInMutationUseCaseContextT = TypeVar(
    "_LoggedInMutationUseCaseContextT", bound=AppLoggedInMutationUseCaseContext
)
_LoggedInReadonlyUseCaseContextT = TypeVar(
    "_LoggedInReadonlyUseCaseContextT", bound=AppLoggedInReadonlyUseCaseContext
)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=Union[None, UseCaseResultBase])


class Command(abc.ABC):
    """The base class for command."""

    _postscript: Text | None
    _session_storage: Final[SessionStorage]

    def __init__(self, session_storage: SessionStorage) -> None:
        """Constructor."""
        self._postscript = None
        self._session_storage = session_storage

    @abc.abstractmethod
    def name(self) -> str:
        """The name of the command."""

    @abc.abstractmethod
    def description(self) -> str:
        """The description of the command."""

    @abc.abstractmethod
    def build_parser(self, parser: ArgumentParser) -> None:
        """Construct a argparse parser for the command."""

    @abc.abstractmethod
    async def run(
        self,
        console: Console,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""

    @property
    def is_allowed_globally(self) -> bool:
        """Is this command allowed for a particular environment."""
        return True

    @property
    def should_appear_in_global_help(self) -> bool:
        """Should the command appear in the global help info or not."""
        return True

    @property
    def should_have_streaming_progress_report(self) -> bool:
        """Whether the main script should have a streaming progress reporter."""
        return True

    def mark_postscript(self, postscript: Text) -> None:
        """Mark some postscript for the command."""
        self._postscript = postscript

    def get_postscript(self) -> Text | None:
        """Get some postscript for the command."""
        return self._postscript


class UseCaseCommand(Generic[_GlobalPropertiesT, _UseCaseT], Command, abc.ABC):
    """Base class for commands based on use cases."""

    _global_properties: _GlobalPropertiesT
    _realm_codec_registry: Final[RealmCodecRegistry]
    _args_type: Final[type[UseCaseArgsBase]]
    _use_case: _UseCaseT

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        realm_codec_registry: RealmCodecRegistry,
        session_storage: SessionStorage,
        use_case: _UseCaseT,
    ) -> None:
        """Constructor."""
        super().__init__(session_storage)
        self._global_properties = global_properties
        self._realm_codec_registry = realm_codec_registry
        self._args_type = self._infer_args_class(use_case)
        self._use_case = use_case

    def name(self) -> str:
        """The name of the command."""
        return inflection.dasherize(
            inflection.underscore(self._use_case.__class__.__name__)
        ).replace("-use-case", "")

    def description(self) -> str:
        """The description of the command."""
        return self._use_case.__doc__ or ""

    def build_parser(self, parser: ArgumentParser) -> None:
        """Construct a argparse parser for the command."""
        self._build_parser_for_use_case_args(self._args_type, parser)

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
    def _build_parser_for_use_case_args(
        args_type: type[UseCaseArgsBase], parser: ArgumentParser
    ) -> None:
        def field_name_to_arg_name(field_name: str) -> str:
            return inflection.dasherize(field_name)

        def extract_field_type(
            field_type: type[Primitive | object],
        ) -> tuple[type[object], bool]:
            field_type_origin = get_origin(field_type)
            if field_type_origin is None:
                return field_type, False

            if field_type_origin is typing.Union or (
                isinstance(field_type_origin, type)
                and issubclass(field_type_origin, types.UnionType)
            ):
                field_args = get_args(field_type)
                if len(field_args) == 2 and (
                    field_args[0] is type(None) and field_args[1] is not type(None)
                ):
                    return field_args[1], True
                elif len(field_args) == 2 and (
                    field_args[1] is type(None) and field_args[0] is not type(None)
                ):
                    return field_args[0], True
                else:
                    raise Exception("Not implemented - union")
            else:
                return field_type, False

        def add_bool_field(
            field: dataclasses.Field[Thing],
        ) -> None:
            bool_field = parser.add_mutually_exclusive_group()
            bool_field.add_argument(
                f"--{field_name_to_arg_name(field.name)}",
                dest=field.name,
                default=(
                    field.default if field.default is not dataclasses.MISSING else False
                ),
                action="store_true",
                help=field.metadata.get("help", ""),
            )
            bool_field.add_argument(
                f"--no-{field_name_to_arg_name(field.name)}",
                dest=field.name,
                default=(
                    field.default if field.default is not dataclasses.MISSING else False
                ),
                action="store_false",
                help=field.metadata.get("help", ""),
            )

        def add_update_bool_field(
            field: dataclasses.Field[Thing],
        ) -> None:
            bool_field = parser.add_mutually_exclusive_group()
            bool_field.add_argument(
                f"--{field_name_to_arg_name(field.name)}",
                dest=field.name,
                default=None,
                action="store_true",
                help=field.metadata.get("help", ""),
            )
            bool_field.add_argument(
                f"--no-{field_name_to_arg_name(field.name)}",
                dest=field.name,
                default=None,
                action="store_false",
                help=field.metadata.get("help", ""),
            )

        def add_field(
            field: dataclasses.Field[Thing],
            field_type: type[int | float | str | date | datetime | Date | DateTime],
            field_optional: bool,
        ) -> None:
            if not field_optional:
                parser.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=True,
                    type=field_type if field_type in (int, float) else str,
                    help=field.metadata.get("help", ""),
                )
            else:
                a_field = parser.add_mutually_exclusive_group()
                a_field.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=False,
                    type=field_type if field_type in (int, float) else str,
                    default=(
                        field.default
                        if field.default is not dataclasses.MISSING
                        else None
                    ),
                    help=field.metadata.get("help", ""),
                )
                a_field.add_argument(
                    f"--no-{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=False,
                    action="store_const",
                    const=None,
                    help=field.metadata.get("help", ""),
                )

        def add_update_field(
            field: dataclasses.Field[Thing],
            field_type: type[int | float | str | date | datetime | Date | DateTime],
            field_optional: bool,
        ) -> None:
            if not field_optional:
                parser.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=False,
                    default=None,
                    type=field_type if field_type in (int, float) else str,
                    help=field.metadata.get("help", ""),
                )
            else:
                a_field = parser.add_mutually_exclusive_group()
                a_field.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=False,
                    type=field_type if field_type in (int, float) else str,
                    default=None,
                    help=field.metadata.get("help", ""),
                )
                a_field.add_argument(
                    f"--clear-{field_name_to_arg_name(field.name)}",
                    dest=f"clear_{field.name}",
                    required=False,
                    action="store_const",
                    const=True,
                    help=field.metadata.get("help", ""),
                )

        def add_field_list(
            field: dataclasses.Field[Thing],
            field_type: type[int | float | str | date | datetime | Date | DateTime],
            field_optional: bool,
        ) -> None:
            parser.add_argument(
                f"--{field_name_to_arg_name(field.name)}",
                dest=field.name,
                action="append",
                required=not field_optional,
                type=field_type if field_type in (int, float) else str,
                default=None,
                help=field.metadata.get("help", ""),
            )

        def add_enum_field(
            field: dataclasses.Field[Thing],
            field_type: type[EnumValue],
            field_optional: bool,
        ) -> None:
            parser.add_argument(
                f"--{field_name_to_arg_name(field.name)}",
                dest=field.name,
                required=not field_optional,
                choices=field_type.get_all_values(),
                help=field.metadata.get("help", ""),
            )

        def add_update_enum_field(
            field: dataclasses.Field[Thing],
            field_type: type[EnumValue],
            field_optional: bool,
        ) -> None:
            if not field_optional:
                parser.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=False,
                    default=None,
                    choices=field_type.get_all_values(),
                    help=field.metadata.get("help", ""),
                )
            else:
                a_field = parser.add_mutually_exclusive_group()
                a_field.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    required=False,
                    choices=field_type.get_all_values(),
                    default=None,
                    help=field.metadata.get("help", ""),
                )
                a_field.add_argument(
                    f"--clear-{field_name_to_arg_name(field.name)}",
                    dest=f"clear_{field.name}",
                    required=False,
                    action="store_const",
                    const=True,
                    help=field.metadata.get("help", ""),
                )

        def add_enum_field_list(
            field: dataclasses.Field[Thing],
            field_type: type[EnumValue],
            field_optional: bool,
        ) -> None:
            parser.add_argument(
                f"--{field_name_to_arg_name(field.name)}",
                dest=field.name,
                action="append",
                required=not field_optional,
                default=None,
                choices=field_type.get_all_values(),
                help=field.metadata.get("help", ""),
            )

        def add_update_field_list(
            field: dataclasses.Field[Thing],
            field_type: type[int | float | str | date | datetime | Date | DateTime],
            field_optional: bool,
        ) -> None:
            if not field_optional:
                parser.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    action="append",
                    required=False,
                    default=None,
                    type=field_type if field_type in (int, float) else str,
                    help=field.metadata.get("help", ""),
                )
            else:
                a_field = parser.add_mutually_exclusive_group()
                a_field.add_argument(
                    f"--{field_name_to_arg_name(field.name)}",
                    dest=field.name,
                    action="append",
                    required=False,
                    type=field_type if field_type in (int, float) else str,
                    default=None,
                    help=field.metadata.get("help", ""),
                )
                a_field.add_argument(
                    f"--clear-{field_name_to_arg_name(field.name)}",
                    dest=f"clear_{field.name}",
                    required=False,
                    action="store_const",
                    const=True,
                    help=field.metadata.get("help", ""),
                )

        def process_one_concept(a_thing: type[UseCaseArgsBase]) -> None:
            all_fields = dataclasses.fields(a_thing)

            for field in all_fields:
                field_type, field_optional = extract_field_type(
                    cast(type[object], field.type)
                )

                if field_type is bool:
                    add_bool_field(field)
                elif isinstance(field_type, type) and issubclass(
                    field_type, (int, float, str, date, datetime, Date, DateTime)
                ):
                    add_field(field, field_type, field_optional)
                elif (
                    isinstance(field_type, type)
                    and get_origin(field_type) is None
                    and issubclass(field_type, AtomicValue)
                ):
                    basic_field_type = field_type.base_type_hack()
                    if basic_field_type is bool:
                        add_bool_field(field)
                    elif issubclass(
                        basic_field_type,
                        (int, float, str, date, datetime, Date, DateTime),
                    ):
                        add_field(field, basic_field_type, field_optional)
                    else:
                        raise Exception(
                            f"Unsupported field type {field_type}+{basic_field_type} for {args_type.__name__}:{field.name}"
                        )
                elif (
                    isinstance(field_type, type)
                    and get_origin(field_type) is None
                    and issubclass(field_type, CompositeValue)
                ):
                    raise Exception(
                        f"Unsupported fiedl type {field_type}+{basic_field_type} for {args_type.__name__}:{field.name}"
                    )
                elif (
                    isinstance(field_type, type)
                    and get_origin(field_type) is None
                    and issubclass(field_type, EnumValue)
                ):
                    add_enum_field(field, field_type, field_optional)
                elif (
                    isinstance(field_type, type)
                    and get_origin(field_type) is None
                    and issubclass(field_type, SecretValue)
                ):
                    add_field(field, str, field_optional)
                elif get_origin(field_type) is not None:
                    origin_field_type = get_origin(field_type)
                    if origin_field_type is UpdateAction:
                        update_field = get_args(field_type)[0]
                        update_field_type, update_field_optional = extract_field_type(
                            update_field
                        )

                        if update_field_type is bool:
                            add_update_bool_field(field)
                        elif (
                            isinstance(update_field_type, type)
                            and get_origin(update_field_type) is None
                            and issubclass(
                                update_field_type,
                                (int, float, str, date, datetime, Date, DateTime),
                            )
                        ):
                            add_update_field(
                                field, update_field_type, update_field_optional
                            )
                        elif (
                            isinstance(update_field_type, type)
                            and get_origin(update_field_type) is None
                            and issubclass(update_field_type, AtomicValue)
                        ):
                            basic_update_field_type = update_field_type.base_type_hack()
                            if basic_update_field_type is bool:
                                add_bool_field(field)
                            elif issubclass(
                                basic_update_field_type,
                                (int, float, str, date, datetime, Date, DateTime),
                            ):
                                add_update_field(
                                    field,
                                    basic_update_field_type,
                                    update_field_optional,
                                )
                            else:
                                raise Exception(
                                    f"Unsupported field type {field_type}+{basic_field_type} for {args_type.__name__}:{field.name}"
                                )
                        elif (
                            isinstance(update_field_type, type)
                            and get_origin(update_field_type) is None
                            and issubclass(update_field_type, EnumValue)
                        ):
                            add_update_enum_field(
                                field, update_field_type, update_field_optional
                            )
                        elif get_origin(update_field_type) is not None:
                            origin_update_field_type = get_origin(update_field_type)
                            if origin_update_field_type in (list, set):
                                update_field_list_item = get_args(update_field_type)[0]
                                (
                                    update_field_list_item_type,
                                    update_field_list_item_optional,
                                ) = extract_field_type(update_field_list_item)
                                if (
                                    isinstance(update_field_list_item_type, type)
                                    and get_origin(update_field_list_item_type) is None
                                    and issubclass(
                                        update_field_list_item_type,
                                        (
                                            int,
                                            float,
                                            str,
                                            date,
                                            datetime,
                                            Date,
                                            DateTime,
                                        ),
                                    )
                                ):
                                    add_update_field_list(
                                        field,
                                        update_field_list_item_type,
                                        update_field_list_item_optional,
                                    )
                                elif (
                                    isinstance(update_field_list_item_type, type)
                                    and get_origin(update_field_list_item_type) is None
                                    and issubclass(
                                        update_field_list_item_type, AtomicValue
                                    )
                                ):
                                    basic_field_item_type_type = (
                                        update_field_list_item_type.base_type_hack()
                                    )
                                    if issubclass(
                                        basic_field_item_type_type,
                                        (
                                            int,
                                            float,
                                            str,
                                            date,
                                            datetime,
                                            Date,
                                            DateTime,
                                        ),
                                    ):
                                        add_update_field_list(
                                            field,
                                            basic_field_item_type_type,
                                            update_field_list_item_optional,
                                        )
                                    else:
                                        raise Exception(
                                            f"Unsupported field type {field_type}+{basic_field_type} for {args_type.__name__}:{field.name}"
                                        )
                                else:
                                    raise Exception(
                                        f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                                    )
                            else:
                                raise Exception(
                                    f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                                )
                        else:
                            raise Exception(
                                f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                            )
                    elif origin_field_type in (list, set):
                        list_item_type = get_args(field_type)[0]
                        if list_item_type in (
                            int,
                            float,
                            str,
                            date,
                            datetime,
                            Date,
                            DateTime,
                        ):
                            add_field_list(field, list_item_type, field_optional)
                        elif (
                            isinstance(list_item_type, type)
                            and get_origin(list_item_type) is None
                            and issubclass(list_item_type, AtomicValue)
                        ):
                            basic_field_type = list_item_type.base_type_hack()
                            if issubclass(
                                basic_field_type,
                                (int, float, str, date, datetime, Date, DateTime),
                            ):
                                add_field_list(field, basic_field_type, field_optional)
                            else:
                                raise Exception(
                                    f"Unsupported field type {field_type}+{basic_field_type} for {args_type.__name__}:{field.name}"
                                )
                        elif (
                            isinstance(list_item_type, type)
                            and get_origin(list_item_type) is None
                            and issubclass(list_item_type, EnumValue)
                        ):
                            add_enum_field_list(field, list_item_type, field_optional)
                        else:
                            raise Exception(
                                f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                            )
                    elif origin_field_type == dict:
                        raise Exception(
                            f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                        )
                    else:
                        raise Exception(
                            f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                        )
                else:
                    raise Exception(
                        f"Unsupported field type {field_type} for {args_type.__name__}:{field.name}"
                    )

        process_one_concept(args_type)


_GuestMutationCommandUseCaseT = TypeVar(
    "_GuestMutationCommandUseCaseT",
    bound=AppGuestMutationUseCase[Any, Any, Any, Any, Any, Any, Any],
)


class GuestMutationCommand(
    Generic[
        _GuestMutationCommandUseCaseT,
        _GlobalPropertiesT,
        _AppGuestUseCaseSessionT,
        _GuestMutationUseCaseContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _GuestMutationCommandUseCaseT],
    abc.ABC,
):
    """Base class for commands which do not require authentication."""

    async def run(
        self,
        console: Console,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        session_info = self._session_storage.load_optional()
        await self._run(console, session_info, args)

    async def _run(
        self,
        console: Console,
        session_info: SessionInfo | None,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        parsed_args = self._realm_codec_registry.get_decoder(
            self._args_type, CliRealm
        ).decode(vars(args))
        session = self._build_session(session_info)
        context, result = await self._use_case.execute(session, parsed_args)
        self._render_result(console, context, result)

    @abc.abstractmethod
    def _build_session(
        self, session_info: SessionInfo | None
    ) -> _AppGuestUseCaseSessionT:
        """Build a session."""

    def _render_result(
        self,
        console: Console,
        context: _GuestMutationUseCaseContextT,
        result: _UseCaseResultT,
    ) -> None:
        """Render the result."""


_GuestReadonlyCommandUseCaseT = TypeVar(
    "_GuestReadonlyCommandUseCaseT",
    bound=AppGuestReadonlyUseCase[Any, Any, Any, Any, Any, Any, Any],
)


class GuestReadonlyCommand(
    Generic[
        _GuestReadonlyCommandUseCaseT,
        _GlobalPropertiesT,
        _AppGuestUseCaseSessionT,
        _GuestReadonlyUseCaseContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _GuestReadonlyCommandUseCaseT],
    abc.ABC,
):
    """Base class for commands which just read and present data."""

    async def run(
        self,
        console: Console,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        session_info = self._session_storage.load_optional()
        await self._run(console, session_info, args)

    async def _run(
        self,
        console: Console,
        session_info: SessionInfo | None,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        parsed_args = self._realm_codec_registry.get_decoder(
            self._args_type, CliRealm
        ).decode(vars(args))
        session = self._build_session(session_info)
        context, result = await self._use_case.execute(session, parsed_args)
        self._render_result(console, context, result)

    @abc.abstractmethod
    def _build_session(
        self, session_info: SessionInfo | None
    ) -> _AppGuestUseCaseSessionT:
        """Build the context."""

    def _render_result(
        self,
        console: Console,
        context: _GuestReadonlyUseCaseContextT,
        result: _UseCaseResultT,
    ) -> None:
        """Render the result."""

    @property
    def should_have_streaming_progress_report(self) -> bool:
        """Whether the main script should have a streaming progress reporter."""
        return False


_LoggedInMutationCommandUseCaseT = TypeVar(
    "_LoggedInMutationCommandUseCaseT",
    bound=AppLoggedInMutationUseCase[Any, Any, Any, Any, Any, Any, Any],
)


class LoggedInMutationCommand(
    Generic[
        _LoggedInMutationCommandUseCaseT,
        _GlobalPropertiesT,
        _AppLoggedInUseCaseSessionT,
        _LoggedInMutationUseCaseContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _LoggedInMutationCommandUseCaseT],
    abc.ABC,
):
    """Base class for commands which require authentication."""

    async def run(
        self,
        console: Console,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        session_info = self._session_storage.load()
        await self._run(console, session_info, args)

    async def _run(
        self,
        console: Console,
        session_info: SessionInfo,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        parsed_args = self._realm_codec_registry.get_decoder(
            self._args_type, CliRealm
        ).decode(vars(args))
        session = self._build_session(session_info)
        context, result = await self._use_case.execute(session, parsed_args)
        self._render_result(console, context, result)

    @abc.abstractmethod
    def _build_session(self, session_info: SessionInfo) -> _AppLoggedInUseCaseSessionT:
        """Build a session."""

    def _render_result(
        self,
        console: Console,
        context: _LoggedInMutationUseCaseContextT,
        result: _UseCaseResultT,
    ) -> None:
        """Render the result."""

    @property
    def is_allowed_globally(self) -> bool:
        """Is this command allowed for a particular environment."""
        return self._use_case.is_allowed_globally


_LoggedInReadonlyCommandUseCaseT = TypeVar(
    "_LoggedInReadonlyCommandUseCaseT",
    bound=AppLoggedInReadonlyUseCase[Any, Any, Any, Any, Any, Any, Any],
)


class LoggedInReadonlyCommand(
    Generic[
        _LoggedInReadonlyCommandUseCaseT,
        _GlobalPropertiesT,
        _AppLoggedInUseCaseSessionT,
        _LoggedInReadonlyUseCaseContextT,
        _UseCaseResultT,
    ],
    UseCaseCommand[_GlobalPropertiesT, _LoggedInReadonlyCommandUseCaseT],
    abc.ABC,
):
    """Base class for commands which just read and present data."""

    async def run(
        self,
        console: Console,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        session_info = self._session_storage.load()
        await self._run(console, session_info, args)

    async def _run(
        self,
        console: Console,
        session_info: SessionInfo,
        args: Namespace,
    ) -> None:
        """Callback to execute when the command is invoked."""
        parsed_args = self._realm_codec_registry.get_decoder(
            self._args_type, CliRealm
        ).decode(vars(args))
        session = self._build_session(session_info)
        context, result = await self._use_case.execute(session, parsed_args)
        self._render_result(console, context, result)

    @abc.abstractmethod
    def _build_session(self, session_info: SessionInfo) -> _AppLoggedInUseCaseSessionT:
        """Build a session."""

    def _render_result(
        self,
        console: Console,
        context: _LoggedInReadonlyUseCaseContextT,
        result: _UseCaseResultT,
    ) -> None:
        """Render the result."""

    @property
    def is_allowed_globally(self) -> bool:
        """Is this command allowed for a particular environment."""
        return self._use_case.is_allowed_globally

    @property
    def should_have_streaming_progress_report(self) -> bool:
        """Whether the main script should have a streaming progress reporter."""
        return False


class TestHelperCommand(
    Generic[_GlobalPropertiesT, _UseCaseT],
    UseCaseCommand[_GlobalPropertiesT, _UseCaseT],
    abc.ABC,
):
    """Base class for commands used in tests."""

    @property
    def should_appear_in_global_help(self) -> bool:
        """Should the command appear in the global help info or not."""
        return False

    @property
    def should_have_streaming_progress_report(self) -> bool:
        """Whether the main script should have a streaming progress reporter."""
        return False
