"""Cron-style application form: a single background mutation use case."""

import asyncio
import enum
from typing import Any, Final, Generic, TypeVar

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from jupiter.framework.appform.appform import AppForm
from jupiter.framework.appform.cron.commands import CronMutationCommand
from jupiter.framework.appform.cron.trigger import cron_trigger_from_crontab
from jupiter.framework.component_properties import ComponentProperties
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.mutation_inovcation.recorder import MutationInvocationRecorder
from jupiter.framework.ports import Ports
from jupiter.framework.progress_reporter.reporters.noop import NoOpProgressReporterFactory
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.time_provider import CronRunTimeProvider
from jupiter.framework.use_case import BackgroundMutationUseCase

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)    


class CronExecutionMode(enum.Enum):
    """How the cron process runs after startup."""

    START_RUN_STOP = "start_run_stop"
    """Start, run the use case once, then exit."""

    RUN_FOREVER = "run_forever"
    """Start and keep running the use case on its crontab (same model as WebAPI)."""


class Cron(
    AppForm[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
    Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
):
    """Runs one ``BackgroundMutationUseCase`` either once or on its declared schedule."""

    _cron_time_provider: Final[CronRunTimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _concept_registry: Final[ConceptRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _use_case_type: type[BackgroundMutationUseCase[Any, Any, Any, Any, Any]]
    _command: Final[CronMutationCommand[Any, Any, Any, Any]]
    _execution_mode: Final[CronExecutionMode]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        cron_time_provider: CronRunTimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        use_case_type: type[BackgroundMutationUseCase[Any, Any, Any, Any, Any]],
        execution_mode: CronExecutionMode,
    ) -> None:
        """Constructor."""
        super().__init__(ports, global_properties, service_properties)
        self._cron_time_provider = cron_time_provider
        self._realm_codec_registry = realm_codec_registry
        self._concept_registry = concept_registry
        self._invocation_recorder = invocation_recorder
        self._use_case_type = use_case_type
        self._execution_mode = execution_mode

        use_case = use_case_type(  # type: ignore[call-arg]
            ports=self._ports,
            global_properties=self._global_properties,
            time_provider=self._cron_time_provider,
            realm_codec_registry=self._realm_codec_registry,
            concept_registry=self._concept_registry,
            invocation_recorder=self._invocation_recorder,
            progress_reporter_factory=NoOpProgressReporterFactory(),
        )
        if not use_case.is_allowed_globally:
            raise Exception(
                f"Background mutation {use_case_type.__name__} is not allowed globally"
            )

        self._command = CronMutationCommand(
            global_properties=self._global_properties,
            service_properties=self._service_properties,
            realm_codec_registry=self._realm_codec_registry,
            use_case=use_case,
        )

    async def run(self, argv: list[str]) -> None:
        """Run the configured background mutation once or on a schedule."""
        _ = argv
        match self._execution_mode:
            case CronExecutionMode.START_RUN_STOP:
                await self._command.execute()
            case CronExecutionMode.RUN_FOREVER:
                scheduler = AsyncIOScheduler()
                crontab = self._use_case_type.get_background_mutation_crontab()  # type: ignore[attr-defined]
                scheduler.add_job(
                    self._command.execute,
                    id=self._use_case_type.__name__,
                    name=self._use_case_type.__name__,
                    trigger=cron_trigger_from_crontab(crontab),
                )
                scheduler.start()
                try:
                    await asyncio.Event().wait()
                finally:
                    scheduler.shutdown(wait=False)
