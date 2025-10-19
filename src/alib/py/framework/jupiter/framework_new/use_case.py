"""Framework level elements for use cases."""

import abc
import logging
from collections.abc import Callable
from dataclasses import dataclass
from typing import (
    Any,
    Final,
    Generic,
    Mapping,
    TypeVar,
    Union,
    cast,
)

from jupiter.framework_new.auth.auth_token import (
    AuthToken,
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework_new.auth.auth_token_ext import AuthTokenExt
from jupiter.framework_new.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework_new.component_properties import (
    ComponentProperties,
    UnavailableForComponentError,
)
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework_new.mutation_inovcation.record import (
    MutationInvocationRecord,
    MutationInvocationRecorder,
)
from jupiter.framework_new.ports import DomainPorts, Ports
from jupiter.framework_new.progress_reporter import (
    ProgressReporter,
    ProgressReporterFactory,
)
from jupiter.framework_new.realm.realm import (
    EventStoreRealm,
    RealmCodecRegistry,
    RealmThing,
)
from jupiter.framework_new.repository import (
    DomainUnitOfWork,
)
from jupiter.framework_new.time_provider import TimeProvider
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework_new.value import EnumValue

_PortsT = TypeVar("_PortsT", bound=Ports)
_DomainPortsT = TypeVar("_DomainPortsT", bound=DomainPorts)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)
_SessionT = TypeVar("_SessionT", bound="SessionBase")
_ContextT = TypeVar("_ContextT", bound="ContextBase")
_UseCaseArgsT = TypeVar("_UseCaseArgsT", bound=UseCaseArgsBase)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=Union[None, UseCaseResultBase])

LOGGER = logging.getLogger(__name__)


class SessionBase:
    """The base class for use case sessions."""


class UnavailableForContextError(Exception):
    """Exception raised when the user context blocks a certain action."""

    _error_str: Final[str]

    def __init__(self, feature_or_str: EnumValue | str):
        """Constructor."""
        super().__init__()
        self._error_str = (
            (f"Feature {feature_or_str.value} is not available")
            if isinstance(feature_or_str, EnumValue)
            else feature_or_str
        )

    def __str__(self) -> str:
        """Form a string representation here."""
        return self._error_str


class ContextBase(abc.ABC):
    """Info about a particular invocation of a use case."""

    @abc.abstractmethod
    def as_str(self) -> str:
        """The string representation of this context."""

    @abc.abstractmethod
    def allows(
        self, only_for: list[EnumValue | list[EnumValue]] | None
    ) -> EnumValue | None:
        """Whether this particular context allows for a given filter."""


class UseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A generic use case."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT

    def __init__(self, ports: _PortsT, global_properties: _GlobalPropertiesT) -> None:
        """Create the use case."""
        self._ports = ports
        self._global_properties = global_properties

    @property
    def is_allowed_globally(self) -> bool:
        """Wether this use case's invocation is permitted globally."""
        return True

    def is_allowed_for_component(self, session: _SessionT) -> bool:
        """Whether this use case's invocation is permitted under in the component."""
        return True

    @abc.abstractmethod
    async def execute(
        self,
        session: _SessionT,
        args: _UseCaseArgsT,
    ) -> tuple[_ContextT, _UseCaseResultT]:
        """Execute the command's action."""

    @abc.abstractmethod
    async def _build_context(self, session: _SessionT) -> _ContextT:
        """Construct the context for the use case."""


@dataclass(frozen=True)
class EmptySession(SessionBase):
    """An empty session."""


@dataclass(frozen=True)
class EmptyContext(ContextBase):
    """An empty context."""

    def as_str(self) -> str:
        """The string representation of the context."""
        return "empty"

    def allows(
        self, only_for: list[EnumValue | list[EnumValue]] | None
    ) -> EnumValue | None:
        """Does the particular context allow an use case invocation."""
        return None


class MutationUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    UseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _progress_reporter_factory: ProgressReporterFactory

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._invocation_recorder = invocation_recorder
        self._progress_reporter_factory = progress_reporter_factory

    async def execute(
        self,
        session: _SessionT,
        args: _UseCaseArgsT,
    ) -> tuple[_ContextT, _UseCaseResultT]:
        """Execute the command's action."""
        LOGGER.info(
            "Invoking mutation command %s with args %s",
            self.__class__.__name__,
            args,
        )
        context = await self._build_context(session)
        progress_reporter = self._progress_reporter_factory.new_reporter(
            context.as_str()
        )

        try:
            result = await self._execute(progress_reporter, context, args)
        except InputValidationError:
            raise
        except Exception as err:
            raw_args = cast(
                Mapping[str, RealmThing],
                self._realm_codec_registry.db_encode(args, EventStoreRealm),
            )
            invocation_record = MutationInvocationRecord.build_failure(
                context_str=context.as_str(),
                timestamp=self._time_provider.get_current_time(),
                name=self.__class__.__name__,
                args=raw_args,
                error=err,
            )
            try:
                await self._invocation_recorder.record(invocation_record)
            except Exception as err:  # noqa: BLE001
                LOGGER.critical("Error writing invocation record", exc_info=err)
            raise

        raw_args = cast(
            Mapping[str, RealmThing],
            self._realm_codec_registry.db_encode(args, EventStoreRealm),
        )
        invocation_record = MutationInvocationRecord.build_success(
            context_str=context.as_str(),
            timestamp=self._time_provider.get_current_time(),
            name=self.__class__.__name__,
            args=raw_args,
        )
        await self._invocation_recorder.record(invocation_record)
        return context, result

    @abc.abstractmethod
    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: _ContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""


class ReadonlyUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    UseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which only does reads."""

    _realm_codec_registry: Final[RealmCodecRegistry]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        realm_codec_registry: RealmCodecRegistry,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._realm_codec_registry = realm_codec_registry

    async def execute(
        self,
        session: _SessionT,
        args: _UseCaseArgsT,
    ) -> tuple[_ContextT, _UseCaseResultT]:
        """Execute the command's action."""
        LOGGER.info(
            "Invoking readonly command %s with args %s",
            self.__class__.__name__,
            args,
        )
        context = await self._build_context(session)
        result = await self._execute(context, args)
        return context, result

    @abc.abstractmethod
    async def _execute(
        self,
        context: _ContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""


@dataclass(frozen=True)
class GuestSession(EmptySession):
    """The application use case session."""

    component_properties: ComponentProperties
    auth_token_ext: AuthTokenExt | None


_GuestSessionT = TypeVar("_GuestSessionT", bound=GuestSession)


@dataclass(frozen=True)
class GuestContext(EmptyContext):
    """The applicatin context to use for guest-OK interactions."""

    auth_token: AuthToken | None


@dataclass(frozen=True)
class GuestMutationContext(GuestContext):
    """The applicatin context to use for guest-OK interactions."""

    domain_context: MutationContext


_GuestMutationContextT = TypeVar("_GuestMutationContextT", bound=GuestMutationContext)


class GuestMutationUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _GuestSessionT,
        _GuestMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    MutationUseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _GuestSessionT,
        _GuestMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app, but does not assume a logged-in user."""

    _auth_token_stamper: Final[AuthTokenStamper]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(
            ports,
            global_properties,
            time_provider,
            realm_codec_registry,
            invocation_recorder,
            progress_reporter_factory,
        )
        self._auth_token_stamper = auth_token_stamper

    async def _build_context(self, session: _GuestSessionT) -> _GuestMutationContextT:
        """Construct the context for the use case."""
        try:
            auth_token = (
                self._auth_token_stamper.verify_auth_token_general(
                    session.auth_token_ext
                )
                if session.auth_token_ext
                else None
            )
        except (InvalidAuthTokenError, ExpiredAuthTokenError):
            auth_token = None

        domain_context = MutationContext.build(
            session.component_properties,
            self._time_provider.get_current_time(),
        )

        return await self._construct_context(auth_token, domain_context)

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken | None, domain_context: MutationContext
    ) -> _GuestMutationContextT:
        """Build a context here."""


@dataclass(frozen=True)
class GuestReadonlyContext(GuestContext):
    """The applicatin context to use for guest-OK interactions."""


_GuestReadonlyContextT = TypeVar("_GuestReadonlyContextT", bound=GuestReadonlyContext)


class GuestReadonlyUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _GuestSessionT,
        _GuestReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    ReadonlyUseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _GuestSessionT,
        _GuestReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A query which does not mutate anything, and does not assume a logged-in user."""

    _time_provider: Final[TimeProvider]
    _auth_token_stamper: Final[AuthTokenStamper]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties, realm_codec_registry)
        self._time_provider = time_provider
        self._auth_token_stamper = auth_token_stamper

    async def _build_context(self, session: _GuestSessionT) -> _GuestReadonlyContextT:
        """Construct the context for the use case."""
        try:
            auth_token = (
                self._auth_token_stamper.verify_auth_token_general(
                    session.auth_token_ext
                )
                if session.auth_token_ext
                else None
            )
        except (InvalidAuthTokenError, ExpiredAuthTokenError):
            auth_token = None

        return await self._construct_context(auth_token)

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken | None
    ) -> _GuestReadonlyContextT:
        """Build a context here."""


@dataclass(frozen=True)
class LoggedInSession(SessionBase):
    """The application use case session for logged-in-OK interactions."""

    component_properties: ComponentProperties
    auth_token_ext: AuthTokenExt


_LoggedInSessionT = TypeVar("_LoggedInSessionT", bound=LoggedInSession)


@dataclass(frozen=True)
class LoggedInContext(ContextBase, abc.ABC):
    """The application use case context for logged-in-OK interactions."""

    auth_token: AuthToken


@dataclass(frozen=True)
class LoggedInMutationContext(LoggedInContext):
    """The application use case context for logged-in-OK interactions."""

    domain_context: MutationContext


_LoggedInMutationContextT = TypeVar(
    "_LoggedInMutationContextT", bound=LoggedInMutationContext
)


class LoggedInMutationUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    MutationUseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app, and assumes a logged-in user."""

    _auth_token_stamper: Final[AuthTokenStamper]

    @staticmethod
    def get_only_for_use_case_context() -> list[EnumValue | list[EnumValue]] | None:
        """The feature the use case is scope to."""
        return None

    @staticmethod
    def get_only_for_component() -> list[EnumValue] | None:
        """The components the commandis available in."""
        return None

    @staticmethod
    def get_excluded_component() -> list[EnumValue] | None:
        """The component properties the command is excluded from."""
        return None

    def is_allowed_for_component(self, session: LoggedInSession) -> bool:
        """Whather the command is allowed for this component."""
        return session.component_properties.allows(
            self.get_only_for_component(), self.get_excluded_component()
        )

    @staticmethod
    def get_only_for_globally() -> list[EnumValue] | None:
        """The global properties the command is available in."""
        return None

    @staticmethod
    def get_excluded_globally() -> list[EnumValue] | None:
        """The global properties the command is excluded from."""
        return None

    @property
    def is_allowed_globally(self) -> bool:
        """Whether this command is allowed with the current global properties."""
        return self._global_properties.allows(
            self.get_only_for_globally(), self.get_excluded_globally()
        )

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(
            ports,
            global_properties,
            time_provider,
            realm_codec_registry,
            invocation_recorder,
            progress_reporter_factory,
        )
        self._auth_token_stamper = auth_token_stamper

    async def _build_context(
        self, session: _LoggedInSessionT
    ) -> _LoggedInMutationContextT:
        if not self.is_allowed_globally:
            raise UnavailableGloballyError(
                "This action is not available in this environment"
            )

        if not self.is_allowed_for_component(session):
            raise UnavailableForComponentError(
                f"This action is not available in component {session.component_properties.as_event_source()}"
            )

        auth_token = self._auth_token_stamper.verify_auth_token_general(
            session.auth_token_ext
        )

        domain_context = MutationContext.build(
            session.component_properties,
            self._time_provider.get_current_time(),
        )

        context = await self._construct_context(auth_token, domain_context)

        if feature := context.allows(self.get_only_for_use_case_context()):
            raise UnavailableForContextError(feature)

        return context

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""
        result = await self._perform_mutation(progress_reporter, context, args)
        await self._perform_post_mutation_work(progress_reporter, context)
        return result

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken, domain_context: MutationContext
    ) -> _LoggedInMutationContextT:
        """Build a context here."""

    @abc.abstractmethod
    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""

    async def _perform_post_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
    ) -> None:
        """Perform some work after the mutation is done."""


class TransactionalLoggedInMutationUseCase(
    Generic[
        _DomainPortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    LoggedInMutationUseCase[
        _DomainPortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app transactionally, and assumes a logged-in user."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            result = await self._perform_transactional_mutation(
                uow, progress_reporter, context, args
            )
        await self._perform_post_transactional_mutation_work(
            progress_reporter, context, args, result
        )
        return result

    @abc.abstractmethod
    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
        args: _UseCaseArgsT,
        results: _UseCaseResultT,
    ) -> None:
        """Execute the command's action."""


@dataclass(frozen=True)
class LoggedInReadonlyContext(LoggedInContext):
    """The application use case context for logged-in-OK interactions."""


_LoggedInReadonlyContextT = TypeVar(
    "_LoggedInReadonlyContextT", bound=LoggedInReadonlyContext
)


class LoggedInReadonlyUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    ReadonlyUseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of read in the app, and assumes a logged-in user."""

    _time_provider: Final[TimeProvider]
    _auth_token_stamper: Final[AuthTokenStamper]

    @staticmethod
    def get_only_for_use_case_context() -> list[EnumValue | list[EnumValue]] | None:
        """The feature the use case is scope to."""
        return None

    @staticmethod
    def get_only_for_globally() -> list[EnumValue] | None:
        """The global properties the command is available in."""
        return None

    @staticmethod
    def get_excluded_globally() -> list[EnumValue] | None:
        """The global properties the command is excluded from."""
        return None

    @property
    def is_allowed_globally(self) -> bool:
        """Whether this command is allowed with the current global properties."""
        return self._global_properties.allows(
            self.get_only_for_globally(), self.get_excluded_globally()
        )

    @staticmethod
    def get_only_for_component() -> list[EnumValue] | None:
        """The components the commandis available in."""
        return None

    @staticmethod
    def get_excluded_component() -> list[EnumValue] | None:
        """The component properties the command is excluded from."""
        return None

    def is_allowed_for_component(self, session: LoggedInSession) -> bool:
        """Whather the command is allowed for this component."""
        return session.component_properties.allows(
            self.get_only_for_component(), self.get_excluded_component()
        )

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties, realm_codec_registry)
        self._time_provider = time_provider
        self._auth_token_stamper = auth_token_stamper

    async def _build_context(
        self, session: _LoggedInSessionT
    ) -> _LoggedInReadonlyContextT:
        if not self.is_allowed_globally:
            raise UnavailableGloballyError(
                "This action is not available in this environment"
            )

        if not self.is_allowed_for_component(session):
            raise UnavailableForComponentError(
                f"This action is not available in component {session.component_properties.as_event_source()}"
            )

        auth_token = self._auth_token_stamper.verify_auth_token_general(
            session.auth_token_ext
        )

        context = await self._construct_context(auth_token)

        if feature := context.allows(self.get_only_for_use_case_context()):
            raise UnavailableForContextError(feature)

        return context

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken
    ) -> _LoggedInReadonlyContextT:
        """Build a context here."""


class TransactionalLoggedInReadOnlyUseCase(
    Generic[
        _DomainPortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    LoggedInReadonlyUseCase[
        _DomainPortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of transactional read in the app, and assumes a logged-in user."""

    async def _execute(
        self,
        context: _LoggedInReadonlyContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            return await self._perform_transactional_read(uow, context, args)

    @abc.abstractmethod
    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: _LoggedInReadonlyContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""


class BackgroundMutationUseCase(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    UseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        EmptySession,
        EmptyContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app in the background."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _progress_reporter_factory: ProgressReporterFactory

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        progress_reporter_factory: ProgressReporterFactory,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._progress_reporter_factory = progress_reporter_factory

    async def _build_context(self, session: EmptySession) -> EmptyContext:
        """Construct the context for the use case."""
        return EmptyContext()

    async def execute(
        self,
        session: EmptySession,
        args: _UseCaseArgsT,
    ) -> tuple[EmptyContext, _UseCaseResultT]:
        """Execute the command's action."""
        # A hacky hack!
        LOGGER.info(
            "Invoking background mutation command %s with args %s",
            self.__class__.__name__,
            args,
        )
        context = await self._build_context(session)
        result = await self._execute(context, args)
        return context, result

    @abc.abstractmethod
    async def _execute(
        self,
        context: EmptyContext,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""


_MutationUseCaseT = TypeVar("_MutationUseCaseT", bound=LoggedInMutationUseCase[Any, Any, Any, Any, Any, Any, Any])  # type: ignore


def mutation_use_case(  # type: ignore
    *only_for_use_case_context: EnumValue | list[EnumValue],
    only_for_component: list[EnumValue] | None = None,
    exclude_component: list[EnumValue] | None = None,
    only_for_globally: list[EnumValue] | None = None,
    exclude_globally: list[EnumValue] | None = None,
) -> Callable[[type[_MutationUseCaseT]], type[_MutationUseCaseT]]:
    """A decorator for use cases that scopes them to a feature."""

    def decorator(cls: type[_MutationUseCaseT]) -> type[_MutationUseCaseT]:  # type: ignore
        cls.get_only_for_use_case_context = lambda *args: only_for_use_case_context  # type: ignore
        cls.get_only_for_component = lambda *args: only_for_component  # type: ignore
        cls.get_excluded_component = lambda *args: exclude_component  # type: ignore
        cls.get_only_for_globally = lambda *args: only_for_globally  # type: ignore
        cls.get_excluded_globally = lambda *args: exclude_globally  # type: ignore
        return cls

    return decorator


_ReadonlyUseCaseT = TypeVar("_ReadonlyUseCaseT", bound=LoggedInReadonlyUseCase[Any, Any, Any, Any, Any, Any, Any])  # type: ignore


def readonly_use_case(  # type: ignore
    *only_for_use_case_context: EnumValue | list[EnumValue],
    only_for_component: list[EnumValue] | None = None,
    exclude_component: list[EnumValue] | None = None,
    only_for_globally: list[EnumValue] | None = None,
    exclude_globally: list[EnumValue] | None = None,
) -> Callable[[type[_ReadonlyUseCaseT]], type[_ReadonlyUseCaseT]]:
    """A decorator for use cases that scopes them to a feature."""

    def decorator(cls: type[_ReadonlyUseCaseT]) -> type[_ReadonlyUseCaseT]:  # type: ignore
        cls.get_only_for_use_case_context = lambda *args: only_for_use_case_context  # type: ignore
        cls.get_only_for_component = lambda *args: only_for_component  # type: ignore
        cls.get_excluded_component = lambda *args: exclude_component  # type: ignore
        cls.get_only_for_globally = lambda *args: only_for_globally  # type: ignore
        cls.get_excluded_globally = lambda *args: exclude_globally  # type: ignore
        return cls

    return decorator
