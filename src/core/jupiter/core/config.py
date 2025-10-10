"""Configuration for the Jupiter app."""

import abc
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Generic, TypeVar, Union, cast

import dotenv
from jupiter.core.domain.app import (
    AppComponent,
    AppCore,
    AppDistribution,
    AppPlatform,
    AppShell,
    AppVersion,
)
from jupiter.core.domain.concept.user.user import User
from jupiter.core.domain.concept.user_workspace_link.user_workspace_link import (
    UserWorkspaceLinkRepository,
)
from jupiter.core.domain.concept.workspaces.workspace import Workspace
from jupiter.core.domain.crm import CRM
from jupiter.core.domain.env import Env
from jupiter.core.domain.features import UserFeature, WorkspaceFeature
from jupiter.core.domain.hosting import Hosting
from jupiter.core.domain.storage_engine import SearchStorageEngine
from jupiter.core.use_cases.infra.use_cases import (
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
    AppTransactionalLoggedInMutationUseCase,
    AppTransactionalLoggedInReadOnlyUseCase,
    SysBackgroundMutationUseCase,
)
from jupiter.framework_new.auth.auth_token import AuthToken
from jupiter.framework_new.auth.auth_token_ext import AuthTokenExt
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.component_properties import ComponentProperties
from jupiter.framework_new.context import DomainContext
from jupiter.framework_new.global_properties import GlobalProperties
from jupiter.framework_new.ports import DomainPorts
from jupiter.framework_new.repository import DomainStorageEngine
from jupiter.framework_new.secure import secure_fn
from jupiter.framework_new.use_case import ProgressReporter
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework_new.value import EnumValue

UseCaseArgsT = TypeVar("UseCaseArgsT", bound=UseCaseArgsBase)
UseCaseResultT = TypeVar("UseCaseResultT", bound=Union[None, UseCaseResultBase])


@dataclass(frozen=True)
class JupiterPorts(DomainPorts):
    """The ports for the Jupiter app."""

    domain_storage_engine: DomainStorageEngine
    search_storage_engine: SearchStorageEngine
    crm: CRM


@dataclass(frozen=True)
class JupiterGlobalProperties(GlobalProperties):
    """UseCase-level properties."""

    env: Env
    hosting: Hosting
    description: str
    host: str
    port: int
    version: AppVersion
    docs_init_workspace_url: str
    session_info_path: Path
    sqlite_db_url: str
    alembic_ini_path: Path
    alembic_migrations_path: Path
    auth_token_secret: str
    wix_api_key: str
    wix_account_id: str
    wix_site_id: str

    @property
    def sync_sqlite_db_url(self) -> str:
        """A safe sync version of the Sqlite DB url."""
        # Bit of implicit knowledge here.
        return self.sqlite_db_url.replace("sqlite+aiosqlite", "sqlite+pysqlite")

    def allows(
        self, only_for: list[EnumValue] | None, excluded: list[EnumValue] | None
    ) -> bool:
        """Whether this global properties allows for a given filter."""
        if only_for is not None:
            for filter_val in only_for:
                if isinstance(filter_val, Env):
                    return self.env == filter_val
                elif isinstance(filter_val, Hosting):
                    return self.hosting == filter_val
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
        if excluded is not None:
            for filter_val in excluded:
                if isinstance(filter_val, Env):
                    return self.env != filter_val
                elif isinstance(filter_val, Hosting):
                    return self.hosting != filter_val
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
        return True


@secure_fn
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
    project_config_path = find_up_the_dir_tree("Config.project")

    dotenv.load_dotenv(dotenv_path=global_config_path, verbose=True)
    dotenv.load_dotenv(dotenv_path=project_config_path, verbose=True)

    env = Env(cast(str, os.getenv("ENV")))
    hosting = Hosting(cast(str, os.getenv("HOSTING")))
    description = cast(str, os.getenv("DESCRIPTION"))
    host = cast(str, os.getenv("HOST"))
    port = int(cast(str, os.getenv("PORT")))
    version = AppVersion(cast(str, os.getenv("VERSION")))
    docs_init_workspace_url = cast(str, os.getenv("DOCS_INIT_WORKSPACE_URL"))
    session_info_path = Path(cast(str, os.getenv("SESSION_INFO_PATH")))
    sqlite_db_url = cast(str, os.getenv("SQLITE_DB_URL"))
    alembic_ini_path = Path(cast(str, os.getenv("ALEMBIC_INI_PATH")))
    alembic_migrations_path = Path(cast(str, os.getenv("ALEMBIC_MIGRATIONS_PATH")))
    auth_token_secret = cast(str, os.getenv("AUTH_TOKEN_SECRET"))
    wix_api_key = cast(str, os.getenv("WIX_API_KEY"))
    wix_account_id = cast(str, os.getenv("WIX_ACCOUNT_ID"))
    wix_site_id = cast(str, os.getenv("WIX_SITE_ID"))

    if not alembic_ini_path.is_absolute():
        alembic_ini_path = find_up_the_dir_tree(alembic_ini_path)
    if not alembic_migrations_path.is_absolute():
        alembic_migrations_path = find_up_the_dir_tree(alembic_migrations_path)

    return JupiterGlobalProperties(
        env=env,
        hosting=hosting,
        description=description,
        host=host,
        port=port,
        version=version,
        docs_init_workspace_url=docs_init_workspace_url,
        session_info_path=session_info_path,
        sqlite_db_url=sqlite_db_url,
        alembic_ini_path=alembic_ini_path,
        alembic_migrations_path=alembic_migrations_path,
        auth_token_secret=auth_token_secret,
        wix_api_key=wix_api_key,
        wix_account_id=wix_account_id,
        wix_site_id=wix_site_id,
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
            _component=AppComponent.APP,
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
        if component == AppComponent.APP:
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
                if isinstance(filter_val, AppComponent):
                    return self._component == filter_val
                elif self._core is not None and isinstance(filter_val, AppCore):
                    return self._core == filter_val
                elif self._the_shell is not None and isinstance(filter_val, AppShell):
                    return self._the_shell == filter_val
                elif self._platform is not None and isinstance(filter_val, AppPlatform):
                    return self._platform == filter_val
                elif self._distribution is not None and isinstance(
                    filter_val, AppDistribution
                ):
                    return self._distribution == filter_val
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
        if excluded is not None:
            for filter_val in excluded:
                if isinstance(filter_val, AppComponent):
                    return self._component != filter_val
                elif self._core is not None and isinstance(filter_val, AppCore):
                    return self._core != filter_val
                elif self._the_shell is not None and isinstance(filter_val, AppShell):
                    return self._the_shell != filter_val
                elif self._platform is not None and isinstance(filter_val, AppPlatform):
                    return self._platform != filter_val
                elif self._distribution is not None and isinstance(
                    filter_val, AppDistribution
                ):
                    return self._distribution != filter_val
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
        return True

    def as_event_source(self) -> str:
        """The event source of the app."""
        if self._component == AppComponent.APP:
            return f"{self._component}:{self._core}:{self._the_shell}:{self._platform}:{self._distribution}@{self._version}"
        else:
            return f"{self._component}@{self._version}"


@dataclass(frozen=True)
class JupiterGuestUseCaseSession(AppGuestUseCaseSession):
    """A Jupiter specific guest use case session."""

    @staticmethod
    def build(
        component_properties: JupiterComponentProperties,
        auth_token_ext: AuthTokenExt | None,
    ) -> "JupiterGuestUseCaseSession":
        """Create a session for a given app particulars."""
        return JupiterGuestUseCaseSession(
            component_properties=component_properties,
            auth_token_ext=auth_token_ext,
        )


@dataclass(frozen=True)
class JupiterLoggedInUseCaseSession(AppLoggedInUseCaseSession):
    """A Jupiter specific logged in use case session."""


@dataclass(frozen=True)
class JupiterGuestMutationUseCaseContext(AppGuestMutationUseCaseContext):
    """A Jupiter specific guest mutation use case context."""


@dataclass(frozen=True)
class JupiterGuestReadonlyUseCaseContext(AppGuestReadonlyUseCaseContext):
    """A Jupiter specific guest readonly use case context."""


@dataclass(frozen=True)
class JupiterLoggedInMutationUseCaseContext(AppLoggedInMutationUseCaseContext):
    """A Jupiter specigic logged in mutation use case context."""

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
class JupiterLoggedInReadonlyUseCaseContext(AppLoggedInReadonlyUseCaseContext):
    """A Jupiter specigic logged in readonly use case context."""

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


class JupiterGuestMutationUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    AppGuestMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterGuestUseCaseSession,
        JupiterGuestMutationUseCaseContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command that does some sort of mutation, but does not assume a logged in use."""

    async def _construct_context(
        self, auth_token: AuthToken | None, domain_context: DomainContext
    ) -> JupiterGuestMutationUseCaseContext:
        return JupiterGuestMutationUseCaseContext(auth_token, domain_context)


class JupiterGuestReadonlyUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    AppGuestReadonlyUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterGuestUseCaseSession,
        JupiterGuestReadonlyUseCaseContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command that does not mutate anything, and does not assume a logged in user."""

    async def _construct_context(
        self, auth_token: AuthToken | None
    ) -> JupiterGuestReadonlyUseCaseContext:
        return JupiterGuestReadonlyUseCaseContext(auth_token)


class JupiterLoggedInMutationUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    AppLoggedInMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInUseCaseSession,
        JupiterLoggedInMutationUseCaseContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command that does some sort of mutation, and assumes a logged-in user."""

    async def _construct_context(
        self, auth_token: AuthToken, domain_context: DomainContext
    ) -> JupiterLoggedInMutationUseCaseContext:
        """Build a context here."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(auth_token.user_ref_id)
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(auth_token.user_ref_id)
            workspace = await uow.get_for(Workspace).load_by_id(
                user_workspace_link.workspace_ref_id
            )

            return JupiterLoggedInMutationUseCaseContext(
                auth_token=auth_token,
                domain_context=domain_context,
                user=user,
                workspace=workspace,
            )

    async def _perform_post_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
    ) -> None:
        """Perform some work after the mutation is done."""
        # Register all entities that were created/changed/removed with the search index.
        async with self._ports.search_storage_engine.get_unit_of_work() as uow:
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


class JupiterTransactionalLoggedInMutationUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    JupiterLoggedInMutationUseCase[UseCaseArgsT, UseCaseResultT],
    AppTransactionalLoggedInMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInUseCaseSession,
        JupiterLoggedInMutationUseCaseContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command that does some sort of mutation transactionally, and assumes a logged-in user."""


class JupiterLoggedInReadonlyUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    AppLoggedInReadonlyUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInUseCaseSession,
        JupiterLoggedInReadonlyUseCaseContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command that does some sort of read in the app, and assumes a logged-in user."""

    async def _construct_context(
        self, auth_token: AuthToken
    ) -> JupiterLoggedInReadonlyUseCaseContext:
        """Build a context here."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(auth_token.user_ref_id)
            user_workspace_link = await uow.get(
                UserWorkspaceLinkRepository
            ).load_by_user(auth_token.user_ref_id)
            workspace = await uow.get_for(Workspace).load_by_id(
                user_workspace_link.workspace_ref_id
            )

            return JupiterLoggedInReadonlyUseCaseContext(
                auth_token=auth_token,
                user=user,
                workspace=workspace,
            )


class JupiterTransactionalLoggedInReadOnlyUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    JupiterLoggedInReadonlyUseCase[UseCaseArgsT, UseCaseResultT],
    AppTransactionalLoggedInReadOnlyUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        JupiterLoggedInUseCaseSession,
        JupiterLoggedInReadonlyUseCaseContext,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command that does some sort of read in the app transactionally, and assumes a logged-in user."""


class JupiterSysBackgroundMutationUseCase(
    Generic[UseCaseArgsT, UseCaseResultT],
    SysBackgroundMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        UseCaseArgsT,
        UseCaseResultT,
    ],
    abc.ABC,
):
    """A Jupiter command which does some sort of mutation for the app in the background."""
