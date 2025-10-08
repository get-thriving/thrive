"""Configuration for the Jupiter app."""


import os
from dataclasses import dataclass
from pathlib import Path
from typing import Union, cast

import dotenv
from jupiter.core.domain.app import AppVersion
from jupiter.core.domain.env import Env
from jupiter.core.domain.hosting import Hosting
from jupiter.framework_new.global_properties import GlobalProperties
from jupiter.framework_new.secure import secure_fn
from jupiter.framework_new.value import EnumValue
from jupiter.core.domain.app import (
    AppComponent,
    AppCore,
    AppDistribution,
    AppPlatform,
    AppShell,
    AppVersion,
)
from jupiter.framework_new.component_properties import ComponentProperties
from jupiter.framework_new.value import EnumValue


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
