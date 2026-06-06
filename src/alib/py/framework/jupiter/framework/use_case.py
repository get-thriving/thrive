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

from jupiter.framework.auth.auth_token import (
    AuthToken,
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.component_properties import (
    ComponentProperties,
    UnavailableForComponentError,
)
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
)
from jupiter.framework.mutation_inovcation.recorder import (
    MutationInvocationRecorder,
)
from jupiter.framework.ports import DomainPorts, Ports
from jupiter.framework.progress_reporter.reporter import (
    ProgressReporter,
    ProgressReporterFactory,
)
from jupiter.framework.realm.realm import (
    EventStoreRealm,
    RealmCodecRegistry,
    RealmThing,
)
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
)
from jupiter.framework.time_provider import TimeProvider
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework.value import EnumValue

_PortsT = TypeVar("_PortsT", bound=Ports)
_DomainPortsT = TypeVar("_DomainPortsT", bound=DomainPorts)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)
_SessionT = TypeVar("_SessionT", bound="SessionBase")
_ContextT = TypeVar("_ContextT", bound="ContextBase")
_MutationContextT = TypeVar("_MutationContextT", bound="MutationContext")
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
    abc.ABC,
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
):
    """A generic use case."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
    ) -> None:
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


@dataclass(frozen=True)
class MutationContext(ContextBase):
    """The application use case context for mutation interactions."""

    domain_context: DomainContext

    @property
    def trace_id(self) -> TraceId:
        """The trace id of the context."""
        return self.domain_context.trace_id

    @property
    def mutation_id(self) -> MutationId:
        """The mutation id of the context."""
        return self.domain_context.mutation_id


class MutationUseCase(
    UseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _MutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _MutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
):
    """A command which does some sort of mutation."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _concept_registry: Final[ConceptRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _progress_reporter_factory: ProgressReporterFactory

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._concept_registry = concept_registry
        self._invocation_recorder = invocation_recorder
        self._progress_reporter_factory = progress_reporter_factory

    async def execute(
        self,
        session: _SessionT,
        args: _UseCaseArgsT,
    ) -> tuple[_MutationContextT, _UseCaseResultT]:
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
                trace_id=context.domain_context.trace_id,
                mutation_id=context.domain_context.mutation_id,
                context_str=context.as_str(),
                source=context.domain_context.event_source,
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
            trace_id=context.trace_id,
            mutation_id=context.mutation_id,
            context_str=context.as_str(),
            source=context.domain_context.event_source,
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
        context: _MutationContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""


class ReadonlyUseCase(
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
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _SessionT,
        _ContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
):
    """A command which only does reads."""

    _realm_codec_registry: Final[RealmCodecRegistry]
    _concept_registry: Final[ConceptRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._realm_codec_registry = realm_codec_registry
        self._concept_registry = concept_registry
        self._invocation_recorder = invocation_recorder

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
    trace_id: TraceId
    auth_token_ext: AuthTokenExt | None


_GuestSessionT = TypeVar("_GuestSessionT", bound=GuestSession)


@dataclass(frozen=True)
class GuestContext(EmptyContext):
    """The applicatin context to use for guest-OK interactions."""

    auth_token: AuthToken | None


@dataclass(frozen=True)
class GuestMutationContext(GuestContext, MutationContext):
    """The applicatin context to use for guest-OK interactions."""


_GuestMutationContextT = TypeVar("_GuestMutationContextT", bound=GuestMutationContext)


class GuestMutationUseCase(
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
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _GuestSessionT,
        _GuestMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
):
    """A command which does some sort of mutation for the app, but does not assume a logged-in user."""

    _auth_token_stamper: Final[AuthTokenStamper]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
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
            concept_registry,
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

        domain_context = DomainContext.build_with_no_context_str(
            session.component_properties,
            session.trace_id,
            self._time_provider.get_current_time(),
        )

        context = await self._construct_context(auth_token, domain_context)
        domain_context._set_context_str("guest")
        return context

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken | None, domain_context: DomainContext
    ) -> _GuestMutationContextT:
        """Build a context here."""


@dataclass(frozen=True)
class GuestReadonlyContext(GuestContext):
    """The applicatin context to use for guest-OK interactions."""


_GuestReadonlyContextT = TypeVar("_GuestReadonlyContextT", bound=GuestReadonlyContext)


class GuestReadonlyUseCase(
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
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _GuestSessionT,
        _GuestReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
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
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(
            ports,
            global_properties,
            realm_codec_registry,
            concept_registry,
            invocation_recorder,
        )
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
    trace_id: TraceId
    auth_token_ext: AuthTokenExt


_LoggedInSessionT = TypeVar("_LoggedInSessionT", bound=LoggedInSession)


@dataclass(frozen=True)
class LoggedInContext(ContextBase, abc.ABC):
    """The application use case context for logged-in-OK interactions."""

    auth_token: AuthToken


@dataclass(frozen=True)
class LoggedInMutationContext(LoggedInContext, MutationContext):
    """The application use case context for logged-in-OK interactions."""


_LoggedInMutationContextT = TypeVar(
    "_LoggedInMutationContextT", bound=LoggedInMutationContext
)


class LoggedInMutationUseCase(
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
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
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
        concept_registry: ConceptRegistry,
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
            concept_registry,
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

        domain_context = DomainContext.build_with_no_context_str(
            session.component_properties,
            session.trace_id,
            self._time_provider.get_current_time(),
        )

        context = await self._construct_context(auth_token, domain_context)
        domain_context._set_context_str(context.as_str())

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
        await self._perform_pre_mutation_work(progress_reporter, context, args)
        result = await self._perform_mutation(progress_reporter, context, args)
        await self._perform_post_mutation_work(progress_reporter, context)
        return result

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken, domain_context: DomainContext
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

    async def _perform_pre_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
        args: _UseCaseArgsT,
    ) -> None:
        """Perform some work before the mutation starts."""

    async def _perform_post_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: _LoggedInMutationContextT,
    ) -> None:
        """Perform some work after the mutation is done."""


class TransactionalLoggedInMutationUseCase(
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
    Generic[
        _DomainPortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
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
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
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
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(
            ports,
            global_properties,
            realm_codec_registry,
            concept_registry,
            invocation_recorder,
        )
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
    Generic[
        _DomainPortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _LoggedInSessionT,
        _LoggedInReadonlyContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
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


@dataclass(frozen=True)
class BackgroundMutationContext(MutationContext):
    """The application use case context for background mutations."""


_BackgroundMutationContextT = TypeVar(
    "_BackgroundMutationContextT", bound=BackgroundMutationContext
)


class BackgroundMutationUseCase(
    UseCase[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        EmptySession,
        _BackgroundMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ComponentPropertiesT,
        _BackgroundMutationContextT,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
):
    """A command which does some sort of mutation for the app in the background."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _concept_registry: Final[ConceptRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _progress_reporter_factory: ProgressReporterFactory

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._concept_registry = concept_registry
        self._invocation_recorder = invocation_recorder
        self._progress_reporter_factory = progress_reporter_factory

    async def _build_context(
        self, session: EmptySession
    ) -> _BackgroundMutationContextT:
        """Construct the context for the use case."""
        domain_context = await self._build_domain_context(session)
        return await self._construct_context(domain_context)

    @abc.abstractmethod
    async def _build_domain_context(self, session: EmptySession) -> DomainContext:
        """Build the domain context shared by this background mutation."""

    @abc.abstractmethod
    async def _construct_context(
        self, domain_context: DomainContext
    ) -> _BackgroundMutationContextT:
        """Build a context here."""

    async def execute(
        self,
        session: EmptySession,
        args: _UseCaseArgsT,
    ) -> tuple[_BackgroundMutationContextT, _UseCaseResultT]:
        """Execute the command's action."""
        LOGGER.info(
            "Invoking background mutation command %s with args %s",
            self.__class__.__name__,
            args,
        )
        context = await self._build_context(session)

        try:
            result = await self._execute(context, args)
        except InputValidationError:
            raise
        except Exception as err:
            raw_args = cast(
                Mapping[str, RealmThing],
                self._realm_codec_registry.db_encode(args, EventStoreRealm),
            )
            invocation_record = MutationInvocationRecord.build_failure(
                trace_id=context.domain_context.trace_id,
                mutation_id=context.domain_context.mutation_id,
                context_str=context.as_str(),
                source=context.domain_context.event_source,
                timestamp=self._time_provider.get_current_time(),
                name=self.__class__.__name__,
                args=raw_args,
                error=err,
            )
            try:
                await self._invocation_recorder.record(invocation_record)
            except Exception as record_err:  # noqa: BLE001
                LOGGER.critical("Error writing invocation record", exc_info=record_err)
            raise

        raw_args = cast(
            Mapping[str, RealmThing],
            self._realm_codec_registry.db_encode(args, EventStoreRealm),
        )
        invocation_record = MutationInvocationRecord.build_success(
            trace_id=context.trace_id,
            mutation_id=context.mutation_id,
            context_str=context.as_str(),
            source=context.domain_context.event_source,
            timestamp=self._time_provider.get_current_time(),
            name=self.__class__.__name__,
            args=raw_args,
        )
        await self._invocation_recorder.record(invocation_record)
        return context, result

    @abc.abstractmethod
    async def _execute(
        self,
        context: _BackgroundMutationContextT,
        args: _UseCaseArgsT,
    ) -> _UseCaseResultT:
        """Execute the command's action."""

    @staticmethod
    def get_background_mutation_crontab() -> str:
        """Cron schedule string for the WebAPI job runner (see ``background_mutation_use_case``)."""
        return "0 * * * *"


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


_BackgroundMutationUseCaseT = TypeVar("_BackgroundMutationUseCaseT", bound=BackgroundMutationUseCase[Any, Any, Any, Any, Any, Any])  # type: ignore


def background_mutation_use_case(  # type: ignore
    crontab: str,
) -> Callable[[type[_BackgroundMutationUseCaseT]], type[_BackgroundMutationUseCaseT]]:
    """Attach a schedule for background mutation use cases run by the WebAPI scheduler.

    ``crontab`` is either five fields ``minute hour day month day_of_week`` (for
    ``CronTrigger.from_crontab``) or six fields ``second minute hour day month day_of_week``.
    """

    def decorator(  # type: ignore[explicit-any]
        cls: type[_BackgroundMutationUseCaseT],
    ) -> type[_BackgroundMutationUseCaseT]:
        schedule = crontab

        def get_background_mutation_crontab() -> str:
            return schedule

        cls.get_background_mutation_crontab = staticmethod(  # type: ignore[method-assign]
            get_background_mutation_crontab
        )
        return cls

    return decorator
