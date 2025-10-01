"""Framework level elements for use cases."""

import abc
import enum
import logging
from collections.abc import Iterable
from contextlib import AbstractAsyncContextManager
from dataclasses import dataclass
from typing import (
    Final,
    Generic,
    TypeVar,
    Union,
)

from jupiter.framework_new.base.entity_id import BAD_REF_ID, EntityId
from jupiter.framework_new.base.timestamp import Timestamp
from jupiter.framework_new.component_properties import ComponentProperties
from jupiter.framework_new.entity import CrownEntity
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.global_properties import GlobalProperties
from jupiter.framework_new.ports import Ports
from jupiter.framework_new.realm import RealmCodecRegistry
from jupiter.framework_new.time_provider import TimeProvider
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase
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
GlobalPropertiesT = TypeVar("GlobalPropertiesT", bound=GlobalProperties)
ComponentPropertiesT = TypeVar("ComponentPropertiesT", bound=ComponentProperties)
UseCaseSessionT = TypeVar("UseCaseSessionT", bound=UseCaseSessionBase)
UseCaseContextT = TypeVar("UseCaseContextT", bound=UseCaseContextBase)
UseCaseArgsT = TypeVar("UseCaseArgsT", bound=UseCaseArgsBase)
UseCaseResultT = TypeVar("UseCaseResultT", bound=Union[None, UseCaseResultBase])


@enum.unique
class MutationUseCaseInvocationResult(enum.Enum):
    """The result of a mutation use case invocation."""

    SUCCESS = "success"
    FAILURE = "failure"


@dataclass(frozen=True)
class MutationUseCaseInvocationRecord(Generic[UseCaseArgsT]):
    """The record of a mutation use case invocation."""

    user_ref_id: EntityId
    workspace_ref_id: EntityId
    timestamp: Timestamp
    name: str
    args: UseCaseArgsT
    result: MutationUseCaseInvocationResult
    error_str: str | None

    @staticmethod
    def build_success(
        user_ref_id: EntityId,
        workspace_ref_id: EntityId,
        timestamp: Timestamp,
        name: str,
        args: UseCaseArgsT,
    ) -> "MutationUseCaseInvocationRecord[UseCaseArgsT]":
        """Build a success case for an invocation."""
        return MutationUseCaseInvocationRecord(
            user_ref_id=user_ref_id,
            workspace_ref_id=workspace_ref_id,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationUseCaseInvocationResult.SUCCESS,
            error_str=None,
        )

    @staticmethod
    def build_failure(
        user_ref_id: EntityId,
        workspace_ref_id: EntityId,
        timestamp: Timestamp,
        name: str,
        args: UseCaseArgsT,
        error: Exception,
    ) -> "MutationUseCaseInvocationRecord[UseCaseArgsT]":
        """Build a success case for an invocation."""
        return MutationUseCaseInvocationRecord(
            user_ref_id=user_ref_id,
            workspace_ref_id=workspace_ref_id,
            timestamp=timestamp,
            name=name,
            args=args,
            result=MutationUseCaseInvocationResult.FAILURE,
            error_str=str(error),
        )


class MutationUseCaseInvocationRecorder(abc.ABC):
    """A special type of recorder for mutation use cases which records the outcome of a particular use case."""

    @abc.abstractmethod
    async def record(
        self,
        invocation_record: MutationUseCaseInvocationRecord[UseCaseArgsT],
    ) -> None:
        """Record the invocation of the use case."""


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
            invocation_record = MutationUseCaseInvocationRecord.build_failure(
                user_ref_id=context.user_ref_id,
                workspace_ref_id=context.workspace_ref_id,
                timestamp=self._time_provider.get_current_time(),
                name=self.__class__.__name__,
                args=args,
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

        invocation_record = MutationUseCaseInvocationRecord.build_success(
            user_ref_id=user_ref_id,
            workspace_ref_id=workspace_ref_id,
            timestamp=self._time_provider.get_current_time(),
            name=self.__class__.__name__,
            args=args,
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
