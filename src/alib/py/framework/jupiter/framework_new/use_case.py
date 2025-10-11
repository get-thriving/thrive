"""Framework level elements for use cases."""

import abc
import enum
import logging
from collections.abc import Callable, Iterable
from contextlib import AbstractAsyncContextManager
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
from jupiter.framework_new.base.entity_id import BAD_REF_ID, EntityId
from jupiter.framework_new.base.timestamp import Timestamp
from jupiter.framework_new.component_properties import (
    ComponentProperties,
    UnavailableForComponentError,
)
from jupiter.framework_new.context import DomainContext
from jupiter.framework_new.entity import CrownEntity
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework_new.mutation_invocation_result import MutationUseCaseInvocationRecord, MutationUseCaseInvocationRecorder
from jupiter.framework_new.ports import DomainPorts, Ports
from jupiter.framework_new.realm import EventStoreRealm, RealmCodecRegistry, RealmThing
from jupiter.framework_new.repository import (
    DomainUnitOfWork,
)
from jupiter.framework_new.time_provider import TimeProvider
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework_new.use_case_storage_engine import UseCaseStorageEngine
from jupiter.framework_new.value import EnumValue

LOGGER = logging.getLogger(__name__)


class UseCaseSessionBase:
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


class UseCaseContextBase(abc.ABC):
    """Info about a particular invocation of a use case."""

    @abc.abstractmethod
    def allows(
        self, only_for: list[EnumValue | list[EnumValue]] | None
    ) -> EnumValue | None:
        """Whether this particular context allows for a given filter."""

    @property
    @abc.abstractmethod
    def user_ref_id(self) -> EntityId:
        """The owner user id."""

    @property
    @abc.abstractmethod
    def workspace_ref_id(self) -> EntityId:
        """The owner workspace id."""


PortsT = TypeVar("PortsT", bound=Ports)
DomainPortsT = TypeVar("DomainPortsT", bound=DomainPorts)
GlobalPropertiesT = TypeVar("GlobalPropertiesT", bound=GlobalProperties)
ComponentPropertiesT = TypeVar("ComponentPropertiesT", bound=ComponentProperties)
UseCaseSessionT = TypeVar("UseCaseSessionT", bound=UseCaseSessionBase)
UseCaseContextT = TypeVar("UseCaseContextT", bound=UseCaseContextBase)
UseCaseArgsT = TypeVar("UseCaseArgsT", bound=UseCaseArgsBase)
UseCaseResultT = TypeVar("UseCaseResultT", bound=Union[None, UseCaseResultBase])


class ProgressReporter(abc.ABC):
    """A reporter to the user in real-time on modifications to entities."""

    @abc.abstractmethod
    def section(self, title: str) -> AbstractAsyncContextManager[None]:
        """Start a section or subsection."""

    @abc.abstractmethod
    async def mark_created(self, entity: CrownEntity) -> None:
        """Mark a particular entity as created."""

    @abc.abstractmethod
    async def mark_updated(self, entity: CrownEntity) -> None:
        """Mark a particular entity as updated."""

    @abc.abstractmethod
    async def mark_removed(self, entity: CrownEntity) -> None:
        """Mark a particular entity as removed."""

    @property
    @abc.abstractmethod
    def created_entities(self) -> Iterable[CrownEntity]:
        """The set of entities that were created while this progress reporter was active."""

    @property
    @abc.abstractmethod
    def updated_entities(self) -> Iterable[CrownEntity]:
        """The set of entities that were updated while this progress reporter was active."""

    @property
    @abc.abstractmethod
    def removed_entities(self) -> Iterable[CrownEntity]:
        """The set of entities that were removed while this progress reporter was active."""


class ProgressReporterFactory(Generic[UseCaseContextT], abc.ABC):
    """A factory for progress reporters."""

    @abc.abstractmethod
    def new_reporter(self, context: UseCaseContextT) -> ProgressReporter:
        """Build a progress reporter for a given context."""


class UseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        UseCaseSessionT,
        UseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A generic use case."""

    _ports: PortsT
    _global_properties: GlobalPropertiesT

    def __init__(self, ports: PortsT, global_properties: GlobalPropertiesT) -> None:
        """Create the use case."""
        self._ports = ports
        self._global_properties = global_properties

    @property
    def is_allowed_globally(self) -> bool:
        """Wether this use case's invocation is permitted globally."""
        return True

    def is_allowed_for_component(self, session: UseCaseSessionT) -> bool:
        """Whether this use case's invocation is permitted under in the component."""
        return True

    @abc.abstractmethod
    async def execute(
        self,
        session: UseCaseSessionT,
        args: UseCaseArgsT,
    ) -> tuple[UseCaseContextT, UseCaseResultT]:
        """Execute the command's action."""

    @abc.abstractmethod
    async def _build_context(self, session: UseCaseSessionT) -> UseCaseContextT:
        """Construct the context for the use case."""


@dataclass(frozen=True)
class EmptySession(UseCaseSessionBase):
    """An empty session."""


@dataclass(frozen=True)
class EmptyContext(UseCaseContextBase):
    """An empty context."""

    def allows(
        self, only_for: list[EnumValue | list[EnumValue]] | None
    ) -> EnumValue | None:
        """Does the particular context allow an use case invocation."""
        return None

    @property
    def user_ref_id(self) -> EntityId:
        """The user context."""
        return BAD_REF_ID

    @property
    def workspace_ref_id(self) -> EntityId:
        """The owner root entity id."""
        return BAD_REF_ID


class MutationUseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        UseCaseSessionT,
        UseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    UseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        UseCaseSessionT,
        UseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _invocation_recorder: Final[MutationUseCaseInvocationRecorder]
    _progress_reporter_factory: ProgressReporterFactory[UseCaseContextT]

    def __init__(
        self,
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationUseCaseInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory[UseCaseContextT],
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._invocation_recorder = invocation_recorder
        self._progress_reporter_factory = progress_reporter_factory

    async def execute(
        self,
        session: UseCaseSessionT,
        args: UseCaseArgsT,
    ) -> tuple[UseCaseContextT, UseCaseResultT]:
        """Execute the command's action."""
        LOGGER.info(
            "Invoking mutation command %s with args %s",
            self.__class__.__name__,
            args,
        )
        context = await self._build_context(session)
        progress_reporter = self._progress_reporter_factory.new_reporter(context)

        try:
            result = await self._execute(progress_reporter, context, args)
        except InputValidationError:
            raise
        except Exception as err:
            raw_args = cast(Mapping[str, RealmThing], self._realm_codec_registry.db_encode(args, EventStoreRealm))
            invocation_record = MutationUseCaseInvocationRecord.build_failure(
                user_ref_id=context.user_ref_id,
                workspace_ref_id=context.workspace_ref_id,
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

        user_ref_id = context.user_ref_id
        workspace_ref_id = context.workspace_ref_id
        if self.__class__.__name__ == "InitUseCase":
            # HACK HACK HACK HACK!
            # We're dealing with an init result, so we need to do some adjustments
            # to the context owner
            user_ref_id = result.new_user.ref_id  # type: ignore
            workspace_ref_id = result.new_workspace.ref_id  # type: ignore

        raw_args = cast(Mapping[str, RealmThing], self._realm_codec_registry.db_encode(args, EventStoreRealm))
        invocation_record = MutationUseCaseInvocationRecord.build_success(
            user_ref_id=user_ref_id,
            workspace_ref_id=workspace_ref_id,
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
        context: UseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""


class ReadonlyUseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        UseCaseSessionT,
        UseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    UseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        UseCaseSessionT,
        UseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which only does reads."""

    _realm_codec_registry: Final[RealmCodecRegistry]

    def __init__(
        self,
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        realm_codec_registry: RealmCodecRegistry,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties)
        self._realm_codec_registry = realm_codec_registry

    async def execute(
        self,
        session: UseCaseSessionT,
        args: UseCaseArgsT,
    ) -> tuple[UseCaseContextT, UseCaseResultT]:
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
        context: UseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""


@dataclass(frozen=True)
class AppGuestUseCaseSession(EmptySession):
    """The application use case session."""

    component_properties: ComponentProperties
    auth_token_ext: AuthTokenExt | None


GuestUseCaseSessionT = TypeVar("GuestUseCaseSessionT", bound=AppGuestUseCaseSession)


@dataclass(frozen=True)
class AppGuestUseCaseContext(EmptyContext):
    """The applicatin context to use for guest-OK interactions."""

    auth_token: AuthToken | None


@dataclass(frozen=True)
class AppGuestMutationUseCaseContext(AppGuestUseCaseContext):
    """The applicatin context to use for guest-OK interactions."""

    domain_context: DomainContext


GuestMutationUseCaseContextT = TypeVar(
    "GuestMutationUseCaseContextT", bound=AppGuestMutationUseCaseContext
)


class AppGuestMutationUseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        GuestUseCaseSessionT,
        GuestMutationUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    MutationUseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        GuestUseCaseSessionT,
        GuestMutationUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app, but does not assume a logged-in user."""

    _auth_token_stamper: Final[AuthTokenStamper]

    def __init__(
        self,
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationUseCaseInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory[
            GuestMutationUseCaseContextT
        ],
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
        self, session: GuestUseCaseSessionT
    ) -> GuestMutationUseCaseContextT:
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

        domain_context = DomainContext.build(
            session.component_properties,
            self._time_provider.get_current_time(),
        )

        return await self._construct_context(auth_token, domain_context)

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken | None, domain_context: DomainContext
    ) -> GuestMutationUseCaseContextT:
        """Build a context here."""


@dataclass(frozen=True)
class AppGuestReadonlyUseCaseContext(AppGuestUseCaseContext):
    """The applicatin context to use for guest-OK interactions."""


GuestReadonlyUseCaseContextT = TypeVar(
    "GuestReadonlyUseCaseContextT", bound=AppGuestReadonlyUseCaseContext
)


class AppGuestReadonlyUseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        GuestUseCaseSessionT,
        GuestReadonlyUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    ReadonlyUseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        GuestUseCaseSessionT,
        GuestReadonlyUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A query which does not mutate anything, and does not assume a logged-in user."""

    _time_provider: Final[TimeProvider]
    _auth_token_stamper: Final[AuthTokenStamper]

    def __init__(
        self,
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties, realm_codec_registry)
        self._time_provider = time_provider
        self._auth_token_stamper = auth_token_stamper

    async def _build_context(
        self, session: GuestUseCaseSessionT
    ) -> GuestReadonlyUseCaseContextT:
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
    ) -> GuestReadonlyUseCaseContextT:
        """Build a context here."""


@dataclass(frozen=True)
class AppLoggedInUseCaseSession(UseCaseSessionBase):
    """The application use case session for logged-in-OK interactions."""

    component_properties: ComponentProperties
    auth_token_ext: AuthTokenExt


LoggedInUseCaseSessionT = TypeVar(
    "LoggedInUseCaseSessionT", bound=AppLoggedInUseCaseSession
)


@dataclass(frozen=True)
class AppLoggedInUseCaseContext(UseCaseContextBase, abc.ABC):
    """The application use case context for logged-in-OK interactions."""

    auth_token: AuthToken


@dataclass(frozen=True)
class AppLoggedInMutationUseCaseContext(AppLoggedInUseCaseContext):
    """The application use case context for logged-in-OK interactions."""

    domain_context: DomainContext


LoggedInMutationUseCaseContextT = TypeVar(
    "LoggedInMutationUseCaseContextT", bound=AppLoggedInMutationUseCaseContext
)


class AppLoggedInMutationUseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInMutationUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    MutationUseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInMutationUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app, and assumes a logged-in user."""

    _auth_token_stamper: Final[AuthTokenStamper]
    _use_case_storage_engine: Final[UseCaseStorageEngine]

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

    def is_allowed_for_component(self, session: AppLoggedInUseCaseSession) -> bool:
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
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationUseCaseInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory[
            LoggedInMutationUseCaseContextT
        ],
        auth_token_stamper: AuthTokenStamper,
        use_case_storage_engine: UseCaseStorageEngine,
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
        self._use_case_storage_engine = use_case_storage_engine

    async def _build_context(
        self, session: LoggedInUseCaseSessionT
    ) -> LoggedInMutationUseCaseContextT:
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

        domain_context = DomainContext.build(
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
        context: LoggedInMutationUseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""
        result = await self._perform_mutation(progress_reporter, context, args)
        await self._perform_post_mutation_work(progress_reporter, context)
        return result

    @abc.abstractmethod
    async def _construct_context(
        self, auth_token: AuthToken, domain_context: DomainContext
    ) -> LoggedInMutationUseCaseContextT:
        """Build a context here."""

    @abc.abstractmethod
    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: LoggedInMutationUseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""

    async def _perform_post_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: LoggedInMutationUseCaseContextT,
    ) -> None:
        """Perform some work after the mutation is done."""


class AppTransactionalLoggedInMutationUseCase(
    Generic[
        DomainPortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInMutationUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    AppLoggedInMutationUseCase[
        DomainPortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInMutationUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app transactionally, and assumes a logged-in user."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: LoggedInMutationUseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
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
        context: LoggedInMutationUseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: LoggedInMutationUseCaseContextT,
        args: UseCaseArgsT,
        results: UseCaseResultT,
    ) -> None:
        """Execute the command's action."""


@dataclass(frozen=True)
class AppLoggedInReadonlyUseCaseContext(AppLoggedInUseCaseContext):
    """The application use case context for logged-in-OK interactions."""


LoggedInReadonlyUseCaseContextT = TypeVar(
    "LoggedInReadonlyUseCaseContextT", bound=AppLoggedInReadonlyUseCaseContext
)


class AppLoggedInReadonlyUseCase(
    Generic[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInReadonlyUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    ReadonlyUseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInReadonlyUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
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

    def is_allowed_for_component(self, session: AppLoggedInUseCaseSession) -> bool:
        """Whather the command is allowed for this component."""
        return session.component_properties.allows(
            self.get_only_for_component(), self.get_excluded_component()
        )

    def __init__(
        self,
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        auth_token_stamper: AuthTokenStamper,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties, realm_codec_registry)
        self._time_provider = time_provider
        self._auth_token_stamper = auth_token_stamper

    async def _build_context(
        self, session: LoggedInUseCaseSessionT
    ) -> LoggedInReadonlyUseCaseContextT:
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
    ) -> LoggedInReadonlyUseCaseContextT:
        """Build a context here."""


class AppTransactionalLoggedInReadOnlyUseCase(
    Generic[
        DomainPortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInReadonlyUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    AppLoggedInReadonlyUseCase[
        DomainPortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        LoggedInUseCaseSessionT,
        LoggedInReadonlyUseCaseContextT,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of transactional read in the app, and assumes a logged-in user."""

    async def _execute(
        self,
        context: LoggedInReadonlyUseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            return await self._perform_transactional_read(uow, context, args)

    @abc.abstractmethod
    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: LoggedInReadonlyUseCaseContextT,
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""


class SysBackgroundMutationUseCase(
    Generic[
        PortsT, GlobalPropertiesT, ComponentPropertiesT, UseCaseArgsT, UseCaseResultT
    ],
    UseCase[
        PortsT,
        GlobalPropertiesT,
        ComponentPropertiesT,
        EmptySession,
        EmptyContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app in the background."""

    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _progress_reporter_factory: ProgressReporterFactory[EmptyContext]

    def __init__(
        self,
        ports: PortsT,
        global_properties: GlobalPropertiesT,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        progress_reporter_factory: ProgressReporterFactory[EmptyContext],
    ) -> None:
        """Constructor."""
        super().__init__(self._ports, self._global_properties)
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._progress_reporter_factory = progress_reporter_factory

    async def _build_context(self, session: EmptySession) -> EmptyContext:
        """Construct the context for the use case."""
        return EmptyContext()

    async def execute(
        self,
        session: EmptySession,
        args: UseCaseArgsT,
    ) -> tuple[EmptyContext, UseCaseResultT]:
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
        args: UseCaseArgsT,
    ) -> UseCaseResultT:
        """Execute the command's action."""


_MutationUseCaseT = TypeVar("_MutationUseCaseT", bound=AppLoggedInMutationUseCase[Any, Any, Any, Any, Any, Any, Any])  # type: ignore


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


_ReadonlyUseCaseT = TypeVar("_ReadonlyUseCaseT", bound=AppLoggedInReadonlyUseCase[Any, Any, Any, Any, Any, Any, Any])  # type: ignore


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
