"""jupiter specific use cases classes."""

import abc
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any, Final, Generic, TypeVar, Union

from jupiter.core.domain.concept.user.user import User
from jupiter.core.domain.concept.user_workspace_link.user_workspace_link import (
    UserWorkspaceLinkRepository,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.core.domain.crm import CRM
from jupiter.core.domain.features import (
    UserFeature,
    WorkspaceFeature,
)
from jupiter.core.domain.storage_engine import (
    DomainStorageEngine,
    DomainUnitOfWork,
    SearchStorageEngine,
)
from jupiter.framework_new import use_case as uc
from jupiter.framework_new.auth.auth_token import (
    AuthToken,
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework_new.auth.auth_token_ext import AuthTokenExt
from jupiter.framework_new.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.component_properties import (
    ComponentProperties,
    UnavailableForComponentError,
)
from jupiter.framework_new.context import DomainContext
from jupiter.framework_new.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework_new.realm import RealmCodecRegistry
from jupiter.framework_new.time_provider import TimeProvider
from jupiter.framework_new.use_case import (
    EmptyContext,
    EmptySession,
    MutationUseCase,
    MutationUseCaseInvocationRecorder,
    ProgressReporter,
    ProgressReporterFactory,
    ReadonlyUseCase,
    UnavailableForContextError,
    UseCase,
    UseCaseContextBase,
    UseCaseSessionBase,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework_new.use_case_storage_engine import UseCaseStorageEngine
from jupiter.framework_new.value import EnumValue

UseCaseSession = TypeVar("UseCaseSession", bound=UseCaseSessionBase)
UseCaseContext = TypeVar("UseCaseContext", bound=UseCaseContextBase)
UseCaseArgs = TypeVar("UseCaseArgs", bound=UseCaseArgsBase)
UseCaseResult = TypeVar("UseCaseResult", bound=Union[None, UseCaseResultBase])


@dataclass(frozen=True)
class AppGuestUseCaseSession(EmptySession):
    """The application use case session."""

    component_properties: ComponentProperties
    auth_token_ext: AuthTokenExt | None

    @staticmethod
    def build(
        component_properties: ComponentProperties,
        auth_token_ext: AuthTokenExt | None,
    ) -> "AppGuestUseCaseSession":
        """Create a session for a given app particulars."""
        return AppGuestUseCaseSession(
            component_properties=component_properties,
            auth_token_ext=auth_token_ext,
        )


@dataclass(frozen=True)
class AppGuestUseCaseContext(EmptyContext):
    """The applicatin context to use for guest-OK interactions."""

    auth_token: AuthToken | None


@dataclass(frozen=True)
class AppGuestMutationUseCaseContext(AppGuestUseCaseContext):
    """The applicatin context to use for guest-OK interactions."""

    domain_context: DomainContext


class AppGuestMutationUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    MutationUseCase[
        AppGuestUseCaseSession,
        AppGuestMutationUseCaseContext,
        UseCaseArgs,
        UseCaseResult,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app, but does not assume a logged-in user."""

    _global_properties: Final[GlobalProperties]
    _auth_token_stamper: Final[AuthTokenStamper]
    _domain_storage_engine: Final[DomainStorageEngine]
    _search_storage_engine: Final[SearchStorageEngine]
    _crm: Final[CRM]

    def __init__(
        self,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationUseCaseInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory[
            AppGuestMutationUseCaseContext
        ],
        global_properties: GlobalProperties,
        auth_token_stamper: AuthTokenStamper,
        domain_storage_engine: DomainStorageEngine,
        search_storage_engine: SearchStorageEngine,
        crm: CRM,
    ) -> None:
        """Constructor."""
        super().__init__(
            time_provider,
            realm_codec_registry,
            invocation_recorder,
            progress_reporter_factory,
        )
        self._global_properties = global_properties
        self._auth_token_stamper = auth_token_stamper
        self._domain_storage_engine = domain_storage_engine
        self._search_storage_engine = search_storage_engine
        self._crm = crm

    async def _build_context(
        self, session: AppGuestUseCaseSession
    ) -> AppGuestMutationUseCaseContext:
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
        return AppGuestMutationUseCaseContext(
            auth_token=auth_token,
            domain_context=DomainContext.build(
                session.component_properties,
                self._time_provider.get_current_time(),
            ),
        )


@dataclass(frozen=True)
class AppGuestReadonlyUseCaseContext(AppGuestUseCaseContext):
    """The applicatin context to use for guest-OK interactions."""


class AppGuestReadonlyUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    ReadonlyUseCase[
        AppGuestUseCaseSession,
        AppGuestReadonlyUseCaseContext,
        UseCaseArgs,
        UseCaseResult,
    ],
    abc.ABC,
):
    """A query which does not mutate anything, and does not assume a logged-in user."""

    _global_properties: Final[GlobalProperties]
    _time_provider: Final[TimeProvider]
    _auth_token_stamper: Final[AuthTokenStamper]
    _domain_storage_engine: Final[DomainStorageEngine]
    _search_storage_engine: Final[SearchStorageEngine]

    def __init__(
        self,
        global_properties: GlobalProperties,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        auth_token_stamper: AuthTokenStamper,
        domain_storage_engine: DomainStorageEngine,
        search_storage_engine: SearchStorageEngine,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry)
        self._global_properties = global_properties
        self._time_provider = time_provider
        self._auth_token_stamper = auth_token_stamper
        self._domain_storage_engine = domain_storage_engine
        self._search_storage_engine = search_storage_engine

    async def _build_context(
        self, session: AppGuestUseCaseSession
    ) -> AppGuestReadonlyUseCaseContext:
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
        return AppGuestReadonlyUseCaseContext(auth_token=auth_token)


@dataclass(frozen=True)
class AppLoggedInUseCaseSession(UseCaseSessionBase):
    """The application use case session for logged-in-OK interactions."""

    component_properties: ComponentProperties
    auth_token_ext: AuthTokenExt

    @staticmethod
    def build(
        component_properties: ComponentProperties, auth_token_ext: AuthTokenExt
    ) -> "AppLoggedInUseCaseSession":
        """Create a session for a given app particulars."""
        return AppLoggedInUseCaseSession(
            component_properties=component_properties,
            auth_token_ext=auth_token_ext,
        )


@dataclass(frozen=True)
class AppLoggedInUseCaseContext(UseCaseContextBase):
    """The application use case context for logged-in-OK interactions."""

    user: User
    workspace: Workspace

    def allows(
        self, only_for: list[EnumValue | list[EnumValue]] | None
    ) -> EnumValue | None:
        """Does the particular context allow an use case invocation."""
        if only_for is not None:
            for filter_val in only_for:
                if isinstance(filter_val, UserFeature):
                    if not self.user.is_feature_available(filter_val):
                        return filter_val
                elif isinstance(filter_val, WorkspaceFeature):
                    if not self.workspace.is_feature_available(filter_val):
                        return filter_val
                elif isinstance(filter_val, list):
                    for feature in filter_val:
                        if isinstance(feature, UserFeature):
                            if not self.user.is_feature_available(feature):
                                return feature
                        elif isinstance(feature, WorkspaceFeature):
                            if not self.workspace.is_feature_available(feature):
                                return feature
                        else:
                            raise Exception(f"Invalid filter type: {type(filter_val)}")
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")

        return None

    @property
    def user_ref_id(self) -> EntityId:
        """The user id."""
        return self.user.ref_id

    @property
    def workspace_ref_id(self) -> EntityId:
        """The workspace id."""
        return self.workspace.ref_id


@dataclass(frozen=True)
class AppLoggedInMutationUseCaseContext(AppLoggedInUseCaseContext):
    """The application use case context for logged-in-OK interactions."""

    domain_context: DomainContext


class AppLoggedInMutationUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    MutationUseCase[
        AppLoggedInUseCaseSession,
        AppLoggedInMutationUseCaseContext,
        UseCaseArgs,
        UseCaseResult,
    ],
    abc.ABC,
):
    """A command which does some sort of mutation for the app, and assumes a logged-in user."""

    _global_properties: Final[GlobalProperties]
    _auth_token_stamper: Final[AuthTokenStamper]
    _domain_storage_engine: Final[DomainStorageEngine]
    _search_storage_engine: Final[SearchStorageEngine]
    _use_case_storage_engine: Final[UseCaseStorageEngine]
    _crm: Final[CRM]

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
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        invocation_recorder: MutationUseCaseInvocationRecorder,
        progress_reporter_factory: ProgressReporterFactory[
            AppLoggedInMutationUseCaseContext
        ],
        global_properties: GlobalProperties,
        auth_token_stamper: AuthTokenStamper,
        domain_storage_engine: DomainStorageEngine,
        search_storage_engine: SearchStorageEngine,
        use_case_storage_engine: UseCaseStorageEngine,
        crm: CRM,
    ) -> None:
        """Constructor."""
        super().__init__(
            time_provider,
            realm_codec_registry,
            invocation_recorder,
            progress_reporter_factory,
        )
        self._global_properties = global_properties
        self._auth_token_stamper = auth_token_stamper
        self._domain_storage_engine = domain_storage_engine
        self._search_storage_engine = search_storage_engine
        self._use_case_storage_engine = use_case_storage_engine
        self._crm = crm

    async def _build_context(
        self, session: AppLoggedInUseCaseSession
    ) -> AppLoggedInMutationUseCaseContext:
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

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(auth_token.user_ref_id)
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(auth_token.user_ref_id)
            workspace = await uow.get_for(Workspace).load_by_id(
                user_workspace_link.workspace_ref_id
            )

            context = AppLoggedInMutationUseCaseContext(
                user=user,
                workspace=workspace,
                domain_context=DomainContext.build(
                    session.component_properties,
                    self._time_provider.get_current_time(),
                ),
            )

            # TODO(horia141):params
            if feature := context.allows(self.get_only_for_use_case_context()):
                raise UnavailableForContextError(feature)

            return context

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""
        result = await self._perform_mutation(progress_reporter, context, args)

        # Register all entities that were created/changed/removed with the search index.
        async with self._search_storage_engine.get_unit_of_work() as uow:
            for created_entity in progress_reporter.created_entities:
                await uow.search_repository.upsert(
                    context.workspace_ref_id, created_entity
                )

            for updated_entity in progress_reporter.updated_entities:
                await uow.search_repository.upsert(
                    context.workspace_ref_id, updated_entity
                )

            for removed_entity in progress_reporter.removed_entities:
                await uow.search_repository.remove(
                    context.workspace_ref_id, removed_entity
                )

        return result

    @abc.abstractmethod
    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""


class AppTransactionalLoggedInMutationUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    AppLoggedInMutationUseCase[UseCaseArgs, UseCaseResult],
    abc.ABC,
):
    """A command which does some sort of mutation for the app transactionally, and assumes a logged-in user."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            result = await self._perform_transactional_mutation(
                uow, progress_reporter, context, args
            )
        await self._perform_post_mutation_work(progress_reporter, context, args, result)
        return result

    @abc.abstractmethod
    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""

    async def _perform_post_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: UseCaseArgs,
        results: UseCaseResult,
    ) -> None:
        """Execute the command's action."""


@dataclass(frozen=True)
class AppLoggedInReadonlyUseCaseContext(AppLoggedInUseCaseContext):
    """The application use case context for logged-in-OK interactions."""


class AppLoggedInReadonlyUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    ReadonlyUseCase[
        AppLoggedInUseCaseSession,
        AppLoggedInReadonlyUseCaseContext,
        UseCaseArgs,
        UseCaseResult,
    ],
    abc.ABC,
):
    """A command which does some sort of read in the app, and assumes a logged-in user."""

    _global_properties: Final[GlobalProperties]
    _time_provider: Final[TimeProvider]
    _auth_token_stamper: Final[AuthTokenStamper]
    _domain_storage_engine: Final[DomainStorageEngine]
    _search_storage_engine: Final[SearchStorageEngine]

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
        global_properties: GlobalProperties,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        auth_token_stamper: AuthTokenStamper,
        domain_storage_engine: DomainStorageEngine,
        search_storage_engine: SearchStorageEngine,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry)
        self._global_properties = global_properties
        self._time_provider = time_provider
        self._auth_token_stamper = auth_token_stamper
        self._domain_storage_engine = domain_storage_engine
        self._search_storage_engine = search_storage_engine

    async def _build_context(
        self, session: AppLoggedInUseCaseSession
    ) -> AppLoggedInReadonlyUseCaseContext:
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

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(auth_token.user_ref_id)
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(auth_token.user_ref_id)
            workspace = await uow.get_for(Workspace).load_by_id(
                user_workspace_link.workspace_ref_id
            )

            context = AppLoggedInReadonlyUseCaseContext(user=user, workspace=workspace)

            if feature := context.allows(self.get_only_for_use_case_context()):
                raise UnavailableForContextError(feature)

            return AppLoggedInReadonlyUseCaseContext(user=user, workspace=workspace)


class AppTransactionalLoggedInReadOnlyUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    AppLoggedInReadonlyUseCase[UseCaseArgs, UseCaseResult],
    abc.ABC,
):
    """A command which does some sort of transactional read in the app, and assumes a logged-in user."""

    async def _execute(
        self,
        context: AppLoggedInReadonlyUseCaseContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            return await self._perform_transactional_read(uow, context, args)

    @abc.abstractmethod
    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: AppLoggedInReadonlyUseCaseContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""


class SysBackgroundMutationUseCase(
    Generic[UseCaseArgs, UseCaseResult],
    UseCase[EmptySession, EmptyContext, UseCaseArgs, UseCaseResult],
    abc.ABC,
):
    """A command which does some sort of mutation for the app in the background."""

    _global_properties: Final[GlobalProperties]
    _time_provider: Final[TimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _progress_reporter_factory: ProgressReporterFactory[EmptyContext]
    _domain_storage_engine: Final[DomainStorageEngine]
    _search_storage_engine: Final[SearchStorageEngine]
    _crm: Final[CRM]

    def __init__(
        self,
        global_properties: GlobalProperties,
        time_provider: TimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        progress_reporter_factory: ProgressReporterFactory[EmptyContext],
        domain_storage_engine: DomainStorageEngine,
        search_storage_engine: SearchStorageEngine,
        crm: CRM,
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._time_provider = time_provider
        self._realm_codec_registry = realm_codec_registry
        self._progress_reporter_factory = progress_reporter_factory
        self._domain_storage_engine = domain_storage_engine
        self._search_storage_engine = search_storage_engine
        self._crm = crm

    async def _build_context(self, session: EmptySession) -> EmptyContext:
        """Construct the context for the use case."""
        return EmptyContext()

    async def execute(
        self,
        session: EmptySession,
        args: UseCaseArgs,
    ) -> tuple[EmptyContext, UseCaseResult]:
        """Execute the command's action."""
        # A hacky hack!
        uc.LOGGER.info(
            f"Invoking background mutation command {self.__class__.__name__} with args {args}",
        )
        context = await self._build_context(session)
        result = await self._execute(context, args)
        return context, result

    @abc.abstractmethod
    async def _execute(
        self,
        context: EmptyContext,
        args: UseCaseArgs,
    ) -> UseCaseResult:
        """Execute the command's action."""


_MutationUseCaseT = TypeVar("_MutationUseCaseT", bound=AppLoggedInMutationUseCase[Any, Any])  # type: ignore


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


_ReadonlyUseCaseT = TypeVar("_ReadonlyUseCaseT", bound=AppLoggedInReadonlyUseCase[Any, Any])  # type: ignore


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
