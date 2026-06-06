"""Configuration for the Jupiter app."""

import abc
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Generic, TypeVar, Union, cast

import dotenv
from jupiter.core.app import (
    AppComponent,
    AppCore,
    AppDistribution,
    AppPlatform,
    AppShell,
    AppVersion,
)
from jupiter.core.auth.sub.email_verification.email_sender import EmailSender
from jupiter.core.auth.sub.google.oauth_client import GoogleOauthClient
from jupiter.core.backend_blend import (
    JupiterAuthProvider,
    JupiterCrmBackend,
    JupiterEmailVerificationStrategy,
    JupiterTelemetry,
)
from jupiter.core.crm.crm import CRM
from jupiter.core.crm.indexing_storage_engine import CRMIndexingStorageEngine
from jupiter.core.env import Env
from jupiter.core.features import UserFeature, WorkspaceFeature
from jupiter.core.hosting import Hosting
from jupiter.core.instance import Instance
from jupiter.core.search.domain import SearchDomain
from jupiter.core.search.indexing_storage_engine import SearchIndexingStorageEngine
from jupiter.core.search.mutation_log_record import SearchMutationLogRecord
from jupiter.core.search.storage_engine import SearchStorageEngine
from jupiter.core.universe import Universe
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLinkRepository,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.auth.auth_token import AuthToken
from jupiter.framework.base.entity_id import (
    BAD_REF_ID,
    EntityId,
    EntityIdDatabaseDecoder,
)
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.component_properties import ComponentProperties
from jupiter.framework.context import DomainContext
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import DomainPorts
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.use_case import (
    BackgroundMutationContext,
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
    TransactionalLoggedInMutationUseCase,
    TransactionalLoggedInReadOnlyUseCase,
    background_mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework.value import EnumValue

_UseCaseArgsT = TypeVar("_UseCaseArgsT", bound=UseCaseArgsBase)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=Union[None, UseCaseResultBase])

_ENTITY_ID_DECODER = EntityIdDatabaseDecoder()


@dataclass(frozen=True)
class JupiterPorts(DomainPorts):
    """The ports for the Jupiter app."""

    domain_storage_engine: DomainStorageEngine
    search_storage_engine: SearchStorageEngine
    search_indexing_storage_engine: SearchIndexingStorageEngine
    crm_indexing_storage_engine: CRMIndexingStorageEngine
    crm: CRM
    email_sender: EmailSender
    google_oauth_client: GoogleOauthClient | None = None


@dataclass(frozen=True)
class JupiterGlobalProperties(GlobalProperties):
    """UseCase-level properties."""

    public_name: str
    description: str
    universe: Universe
    env: Env
    instance: Instance
    version: AppVersion
    auth_provider: JupiterAuthProvider
    email_verification_strategy: JupiterEmailVerificationStrategy
    telemetry: JupiterTelemetry
    crm_backend: JupiterCrmBackend

    def allows(
        self, only_for: list[EnumValue] | None, excluded: list[EnumValue] | None
    ) -> bool:
        """Whether this global properties allows for a given filter."""
        if only_for is not None:
            for filter_val in only_for:
                if isinstance(filter_val, Env):
                    return self.env == filter_val
                elif isinstance(filter_val, Hosting):
                    return self.universe.hosting == filter_val
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
        if excluded is not None:
            for filter_val in excluded:
                if isinstance(filter_val, Env):
                    return self.env != filter_val
                elif isinstance(filter_val, Hosting):
                    return self.universe.hosting != filter_val
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
        return True


def load_config_project_env(config_project_path: Path) -> None:
    """Load Config.project and optional Config.project.secret from the same directory."""
    dotenv.load_dotenv(dotenv_path=config_project_path, verbose=True)
    config_project_secrets_path = config_project_path.with_name("Config.project.secret")
    if config_project_secrets_path.exists():
        dotenv.load_dotenv(
            dotenv_path=config_project_secrets_path, verbose=True, override=True
        )


def build_global_properties() -> JupiterGlobalProperties:
    """Build the global properties from the environment."""

    def find_up_the_dir_tree(partial_path: Union[str, Path]) -> Path:
        last_here = None
        right_here = Path(os.path.relpath(__file__)).parent
        while True:
            if last_here == right_here:
                raise Exception(f"Critical error - missing config file {partial_path}")
            config_file = right_here / partial_path
            if config_file.exists():
                return config_file
            last_here = right_here
            right_here = right_here.parent

    global_config_path = find_up_the_dir_tree("Config.global")

    dotenv.load_dotenv(dotenv_path=global_config_path, verbose=True)

    public_name = cast(str, os.getenv("PUBLIC_NAME"))
    description = cast(str, os.getenv("DESCRIPTION"))
    universe = Universe(cast(str, os.getenv("UNIVERSE")))
    env = Env(cast(str, os.getenv("ENV")))
    if os.getenv("RENDER"):
        instance = Instance.new_or_generate(
            cast(str, os.getenv("INSTANCE")), cast(str, os.getenv("RENDER_GIT_BRANCH"))
        )
    else:
        instance = Instance(cast(str, os.getenv("INSTANCE")))
    version = AppVersion(cast(str, os.getenv("VERSION")))
    auth_provider = JupiterAuthProvider(cast(str, os.getenv("AUTH_PROVIDER", "local")))
    email_verification_strategy = JupiterEmailVerificationStrategy(
        cast(str, os.getenv("EMAIL_VERIFICATION_STRATEGY", "none"))
    )
    telemetry = JupiterTelemetry(cast(str, os.getenv("TELEMETRY", "local")))
    crm_backend = JupiterCrmBackend(cast(str, os.getenv("CRM", "noop")))

    return JupiterGlobalProperties(
        public_name=public_name,
        universe=universe,
        env=env,
        instance=instance,
        description=description,
        version=version,
        auth_provider=auth_provider,
        email_verification_strategy=email_verification_strategy,
        telemetry=telemetry,
        crm_backend=crm_backend,
    )


@dataclass(frozen=True)
class JupiterComponentProperties(ComponentProperties):
    """The particulars of the Jupiter app."""

    _component: AppComponent
    _core: AppCore | None
    _the_shell: AppShell | None
    _platform: AppPlatform | None
    _distribution: AppDistribution | None
    _version: AppVersion

    @staticmethod
    def for_app(
        core: AppCore,
        the_shell: AppShell,
        platform: AppPlatform,
        distribution: AppDistribution,
        version: AppVersion,
    ) -> "JupiterComponentProperties":
        """Create a Jupiter app particulars."""
        return JupiterComponentProperties(
            _component=AppComponent.app(),
            _core=core,
            _the_shell=the_shell,
            _platform=platform,
            _distribution=distribution,
            _version=version,
        )

    @staticmethod
    def for_cron(
        component: AppComponent,
        version: AppVersion,
    ) -> "JupiterComponentProperties":
        """Create a Jupiter app particulars."""
        if component.is_app():
            raise Exception("App component cannot be used for cron.")
        return JupiterComponentProperties(
            _component=component,
            _core=None,
            _the_shell=None,
            _platform=None,
            _distribution=None,
            _version=version,
        )

    def allows(
        self, only_for: list[EnumValue] | None, excluded: list[EnumValue] | None
    ) -> bool:
        """Whether this global properties allows for a given filter."""
        if only_for is not None:
            for filter_val in only_for:
                if (
                    isinstance(filter_val, AppComponent)
                    and self._component == filter_val
                ):
                    return True
                elif (
                    self._core is not None
                    and isinstance(filter_val, AppCore)
                    and self._core == filter_val
                ):
                    return True
                elif (
                    self._the_shell is not None
                    and isinstance(filter_val, AppShell)
                    and self._the_shell == filter_val
                ):
                    return True
                elif (
                    self._platform is not None
                    and isinstance(filter_val, AppPlatform)
                    and self._platform == filter_val
                ):
                    return True
                elif (
                    self._distribution is not None
                    and isinstance(filter_val, AppDistribution)
                    and self._distribution == filter_val
                ):
                    return True
                elif not (
                    isinstance(filter_val, AppComponent)
                    or isinstance(filter_val, AppCore)
                    or isinstance(filter_val, AppShell)
                    or isinstance(filter_val, AppPlatform)
                    or isinstance(filter_val, AppDistribution)
                ):
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
            else:
                return False
        if excluded is not None:
            for filter_val in excluded:
                if isinstance(filter_val, AppComponent):
                    if self._component == filter_val:
                        return False
                elif self._core is not None and isinstance(filter_val, AppCore):
                    if self._core == filter_val:
                        return False
                elif self._the_shell is not None and isinstance(filter_val, AppShell):
                    if self._the_shell == filter_val:
                        return False
                elif self._platform is not None and isinstance(filter_val, AppPlatform):
                    if self._platform == filter_val:
                        return False
                elif self._distribution is not None and isinstance(
                    filter_val, AppDistribution
                ):
                    if self._distribution == filter_val:
                        return False
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
            else:
                return True
        return True

    def as_event_source(self) -> str:
        """The event source of the app."""
        if self._component.is_app():
            return f"{self._component}:{self._core}:{self._the_shell}:{self._platform}:{self._distribution}@{self._version}"
        else:
            return f"{self._component}@{self._version}"


@dataclass(frozen=True)
class JupiterGuestSession(GuestSession):
    """A Jupiter specific guest use case session."""


@dataclass(frozen=True)
class JupiterLoggedInSession(LoggedInSession):
    """A Jupiter specific logged in use case session."""


_SYSTEM_CONTEXT_STR = "system"
_GUEST_CONTEXT_STR = "guest"
_SYSTEM_USER_REF_ID = EntityId("system")
_GUEST_USER_REF_ID = EntityId("guest")


def user_ref_id_from_mutation_context_str(context_str: str) -> EntityId:
    """Extract the acting user from a mutation context string.

    Background jobs record ``system``, guest flows record ``guest``, and
    logged-in mutations record ``user:{id}+workspace:{id}``.
    """
    if context_str == _SYSTEM_CONTEXT_STR:
        return _SYSTEM_USER_REF_ID
    if context_str == _GUEST_CONTEXT_STR:
        return _GUEST_USER_REF_ID
    return JupiterLoggedInReadonlyContext.unwrap_str(context_str)[0]


def is_real_user_ref_id(user_ref_id: EntityId) -> bool:
    """Whether the ref id refers to a persisted user rather than a sentinel."""
    return user_ref_id not in (_SYSTEM_USER_REF_ID, _GUEST_USER_REF_ID, BAD_REF_ID)


@dataclass(frozen=True)
class JupiterGuestMutationContext(GuestMutationContext):
    """A Jupiter specific guest mutation use case context."""

    def as_str(self) -> str:
        """The string representation of the context."""
        return "guest"


@dataclass(frozen=True)
class JupiterGuestReadonlyContext(GuestReadonlyContext):
    """A Jupiter specific guest readonly use case context."""

    def as_str(self) -> str:
        """The string representation of the context."""
        return "guest"


@dataclass(frozen=True)
class JupiterLoggedInMutationContext(LoggedInMutationContext):
    """A Jupiter specigic logged in mutation use case context."""

    user: User
    workspace: Workspace

    def as_str(self) -> str:
        """The string representation of the context."""
        return f"user:{self.user.ref_id}+workspace:{self.workspace.ref_id}"

    @staticmethod
    def unwrap_str(context_str: str) -> tuple[EntityId, EntityId]:
        """Unwrap the context string into a tuple of user and workspace IDs."""
        try:
            part_user, part_workspace = context_str.split("+")
            _, user_id = part_user.split(":")
            _, workspace_id = part_workspace.split(":")
            return _ENTITY_ID_DECODER.decode(user_id), _ENTITY_ID_DECODER.decode(
                workspace_id
            )
        except ValueError as e:
            raise Exception("Could not unwrap context str") from e

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


@dataclass(frozen=True)
class JupiterBackgroundMutationContext(BackgroundMutationContext):
    """A Jupiter specific background mutation use case context."""

    def as_str(self) -> str:
        """The string representation of the context."""
        return "system"

    def allows(
        self, only_for: list[EnumValue | list[EnumValue]] | None
    ) -> EnumValue | None:
        """Does the particular context allow an use case invocation."""
        return None


@dataclass(frozen=True)
class JupiterLoggedInReadonlyContext(LoggedInReadonlyContext):
    """A Jupiter specigic logged in readonly use case context."""

    user: User
    workspace: Workspace

    def as_str(self) -> str:
        """The string representation of the context."""
        return f"user:{self.user.ref_id}+workspace:{self.workspace.ref_id}"

    @staticmethod
    def unwrap_str(context_str: str) -> tuple[EntityId, EntityId]:
        """Unwrap the context string into a tuple of user and workspace IDs."""
        try:
            part_user, part_workspace = context_str.split("+")
            _, user_id = part_user.split(":")
            _, workspace_id = part_workspace.split(":")
            return _ENTITY_ID_DECODER.decode(user_id), _ENTITY_ID_DECODER.decode(
                workspace_id
            )
        except ValueError as e:
            raise Exception("Could not unwrap context str") from e

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


class JupiterGuestMutationUseCase(
    GuestMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterGuestSession,
        JupiterGuestMutationContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command that does some sort of mutation, but does not assume a logged in use."""

    async def _construct_context(
        self, auth_token: AuthToken | None, domain_context: DomainContext
    ) -> JupiterGuestMutationContext:
        return JupiterGuestMutationContext(
            auth_token=auth_token, domain_context=domain_context
        )


class JupiterGuestReadonlyUseCase(
    GuestReadonlyUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterGuestSession,
        JupiterGuestReadonlyContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command that does not mutate anything, and does not assume a logged in user."""

    async def _construct_context(
        self, auth_token: AuthToken | None
    ) -> JupiterGuestReadonlyContext:
        return JupiterGuestReadonlyContext(auth_token)


class JupiterLoggedInMutationUseCase(
    LoggedInMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInSession,
        JupiterLoggedInMutationContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command that does some sort of mutation, and assumes a logged-in user."""

    async def _construct_context(
        self, auth_token: AuthToken, domain_context: DomainContext
    ) -> JupiterLoggedInMutationContext:
        """Build a context here."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(auth_token.user_ref_id)
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(auth_token.user_ref_id)
            workspace = await uow.get_for(Workspace).load_by_id(
                user_workspace_link.workspace_ref_id
            )

            return JupiterLoggedInMutationContext(
                auth_token=auth_token,
                domain_context=domain_context,
                user=user,
                workspace=workspace,
            )

    async def _perform_pre_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: _UseCaseArgsT,
    ) -> None:
        """Reserve deferred search indexing for this mutation before domain work runs."""
        _ = progress_reporter, args
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            search_domain = await uow.get_for(SearchDomain).load_by_parent(
                context.workspace.ref_id
            )
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            await iuow.search_mutation_log_record_repository.append_unindexed(
                SearchMutationLogRecord.new_unindexed(
                    ctx=context.domain_context,
                    search_domain_ref_id=search_domain.ref_id,
                    mutation_id=context.mutation_id,
                ),
            )


class JupiterTransactionalLoggedInMutationUseCase(
    JupiterLoggedInMutationUseCase[_UseCaseArgsT, _UseCaseResultT],
    TransactionalLoggedInMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInSession,
        JupiterLoggedInMutationContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command that does some sort of mutation transactionally, and assumes a logged-in user."""


class JupiterLoggedInReadonlyUseCase(
    LoggedInReadonlyUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInSession,
        JupiterLoggedInReadonlyContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command that does some sort of read in the app, and assumes a logged-in user."""

    async def _construct_context(
        self, auth_token: AuthToken
    ) -> JupiterLoggedInReadonlyContext:
        """Build a context here."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(auth_token.user_ref_id)
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(auth_token.user_ref_id)
            workspace = await uow.get_for(Workspace).load_by_id(
                user_workspace_link.workspace_ref_id
            )

            return JupiterLoggedInReadonlyContext(
                auth_token=auth_token,
                user=user,
                workspace=workspace,
            )


class JupiterTransactionalLoggedInReadOnlyUseCase(
    JupiterLoggedInReadonlyUseCase[_UseCaseArgsT, _UseCaseResultT],
    TransactionalLoggedInReadOnlyUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInSession,
        JupiterLoggedInReadonlyContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command that does some sort of read in the app transactionally, and assumes a logged-in user."""


@background_mutation_use_case("0 * * * *")
class JupiterBackgroundMutationUseCase(
    BackgroundMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterBackgroundMutationContext,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command which does some sort of mutation for the app in the background."""

    async def _construct_context(
        self, domain_context: DomainContext
    ) -> JupiterBackgroundMutationContext:
        return JupiterBackgroundMutationContext(domain_context=domain_context)

    async def _build_domain_context(self, session: EmptySession) -> DomainContext:
        """Build the domain context shared by this background mutation."""
        _ = session
        return DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.from_use_case_class_name(
                    self.__class__.__name__,
                ),
                version=self._global_properties.version,
            ),
            TraceId.new(),
            self._time_provider.get_current_time(),
        )
