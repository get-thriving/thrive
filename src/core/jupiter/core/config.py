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
from jupiter.core.application.crm import CRM
from jupiter.core.env import Env
from jupiter.core.features import UserFeature, WorkspaceFeature
from jupiter.core.hosting import Hosting
from jupiter.core.instance import Instance
from jupiter.core.search.storage_engine import SearchStorageEngine
from jupiter.core.universe import Universe
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLinkRepository,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.auth.auth_token import AuthToken
from jupiter.framework.component_properties import ComponentProperties
from jupiter.framework.context import MutationContext
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import DomainPorts
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.use_case import (
    BackgroundMutationUseCase,
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
)
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase
from jupiter.framework.value import EnumValue

_UseCaseArgsT = TypeVar("_UseCaseArgsT", bound=UseCaseArgsBase)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=Union[None, UseCaseResultBase])


@dataclass(frozen=True)
class JupiterPorts(DomainPorts):
    """The ports for the Jupiter app."""

    domain_storage_engine: DomainStorageEngine
    search_storage_engine: SearchStorageEngine
    crm: CRM


@dataclass(frozen=True)
class JupiterGlobalProperties(GlobalProperties):
    """UseCase-level properties."""

    public_name: str
    description: str
    universe: Universe
    env: Env
    instance: Instance
    version: AppVersion

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

    return JupiterGlobalProperties(
        public_name=public_name,
        universe=universe,
        env=env,
        instance=instance,
        description=description,
        version=version,
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
                if isinstance(filter_val, AppComponent) and self._component == filter_val:
                    return True
                elif self._core is not None and isinstance(filter_val, AppCore) and self._core == filter_val:
                    return True
                elif self._the_shell is not None and isinstance(filter_val, AppShell) and self._the_shell == filter_val:
                    return True
                elif self._platform is not None and isinstance(filter_val, AppPlatform) and self._platform == filter_val:
                    return True
                elif self._distribution is not None and isinstance(filter_val, AppDistribution) and self._distribution == filter_val:
                    return True
                elif not (isinstance(filter_val, AppComponent) or isinstance(filter_val, AppCore) or isinstance(filter_val, AppShell) or isinstance(filter_val, AppPlatform) or isinstance(filter_val, AppDistribution)):
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
                elif self._distribution is not None and isinstance(filter_val, AppDistribution):
                    if self._distribution == filter_val:
                        return False
                else:
                    raise Exception(f"Invalid filter type: {type(filter_val)}")
            else:
                return True
        return True

    def as_event_source(self) -> str:
        """The event source of the app."""
        if self._component == AppComponent.APP:
            return f"{self._component}:{self._core}:{self._the_shell}:{self._platform}:{self._distribution}@{self._version}"
        else:
            return f"{self._component}@{self._version}"


@dataclass(frozen=True)
class JupiterGuestSession(GuestSession):
    """A Jupiter specific guest use case session."""


@dataclass(frozen=True)
class JupiterLoggedInSession(LoggedInSession):
    """A Jupiter specific logged in use case session."""


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
class JupiterLoggedInReadonlyContext(LoggedInReadonlyContext):
    """A Jupiter specigic logged in readonly use case context."""

    user: User
    workspace: Workspace

    def as_str(self) -> str:
        """The string representation of the context."""
        return f"user:{self.user.ref_id}+workspace:{self.workspace.ref_id}"

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
        self, auth_token: AuthToken | None, domain_context: MutationContext
    ) -> JupiterGuestMutationContext:
        return JupiterGuestMutationContext(auth_token, domain_context)


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
        self, auth_token: AuthToken, domain_context: MutationContext
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

    async def _perform_post_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
    ) -> None:
        """Perform some work after the mutation is done."""
        # Register all entities that were created/changed/removed with the search index.
        async with self._ports.search_storage_engine.get_unit_of_work() as uow:
            for created_entity in progress_reporter.created_entities:
                await uow.search_repository.upsert(
                    context.workspace.ref_id, created_entity
                )

            for updated_entity in progress_reporter.updated_entities:
                await uow.search_repository.upsert(
                    context.workspace.ref_id, updated_entity
                )

            for removed_entity in progress_reporter.removed_entities:
                await uow.search_repository.remove(
                    context.workspace.ref_id, removed_entity
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


class JupiterBackgroundMutationUseCase(
    BackgroundMutationUseCase[
        JupiterPorts,
        JupiterGlobalProperties,
        JupiterComponentProperties,
        _UseCaseArgsT,
        _UseCaseResultT,
    ],
    abc.ABC,
    Generic[_UseCaseArgsT, _UseCaseResultT],
):
    """A Jupiter command which does some sort of mutation for the app in the background."""
