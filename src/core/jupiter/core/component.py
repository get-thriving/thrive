"""A client facing application."""

from dataclasses import dataclass

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
