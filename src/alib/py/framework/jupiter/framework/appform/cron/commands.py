"""Commands for the cron app form (background mutations only)."""

from typing import (
    Any,
    Final,
    Generic,
    TypeVar,
    cast,
    get_args,
)

from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.use_case import (
    BackgroundMutationUseCase,
    EmptySession,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase

_BackgroundMutationUseCaseT = TypeVar(  # type: ignore[explicit-any]
    "_BackgroundMutationUseCaseT",
    bound=BackgroundMutationUseCase[Any, Any, Any, Any, Any],  # type: ignore[explicit-any]
)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_UseCaseResultT = TypeVar("_UseCaseResultT", bound=UseCaseResultBase | None)


class CronMutationCommand(
    Generic[
        _BackgroundMutationUseCaseT,
        _GlobalPropertiesT,
        _ServicePropertiesT,
        _UseCaseResultT,
    ],
):
    """Runs a single background mutation use case (no HTTP route)."""

    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT
    _realm_codec_registry: Final[RealmCodecRegistry]
    _args_type: Final[type[UseCaseArgsBase]]
    _use_case: _BackgroundMutationUseCaseT  # type: ignore[explicit-any]

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        realm_codec_registry: RealmCodecRegistry,
        use_case: _BackgroundMutationUseCaseT,  # type: ignore[explicit-any]
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._service_properties = service_properties
        self._realm_codec_registry = realm_codec_registry
        self._args_type = self._infer_args_class(use_case)
        self._use_case = use_case

    @staticmethod
    def _infer_args_class(
        use_case: _BackgroundMutationUseCaseT,  # type: ignore[explicit-any]
    ) -> type[UseCaseArgsBase]:
        use_case_type = use_case.__class__
        if not hasattr(use_case_type, "__orig_bases__"):
            raise Exception("No args class found")
        for base in use_case_type.__orig_bases__:  # type: ignore
            args = get_args(base)
            if len(args) > 0:
                return cast(type[UseCaseArgsBase], args[0])
        raise Exception("No args class found")

    async def execute(self) -> None:
        """Execute the background mutation once."""
        await self._use_case.execute(EmptySession(), self._args_type())
