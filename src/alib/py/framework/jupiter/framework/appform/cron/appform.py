"""Cron-style application form: a single background mutation use case."""

import asyncio
import logging
import signal
import types
from collections.abc import Iterator
from json import JSONDecodeError
from typing import Any, Final, Generic, TypeVar, get_args, get_origin

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from jupiter.framework.appform.appform import AppForm
from jupiter.framework.appform.cron.commands import CronMutationCommand
from jupiter.framework.appform.cron.exception import CronExceptionHandler
from jupiter.framework.appform.cron.exceptions import (
    EntityAlreadyExistsHandler,
    EntityNotFoundHandler,
    ExpiredAuthTokenHandler,
    InputValidationHandler,
    InvalidAuthTokenHandler,
    JSONDecodeHandler,
    MultiInputValidationHandler,
    RealmDecodingHandler,
    UnavailableForComponentHandler,
    UnavailableForContextHandler,
    UnavailableGloballyHandler,
)
from jupiter.framework.appform.cron.execution_mode import CronExecutionMode
from jupiter.framework.appform.cron.trigger import cron_trigger_from_crontab
from jupiter.framework.auth.auth_token import (
    ExpiredAuthTokenError,
    InvalidAuthTokenError,
)
from jupiter.framework.component_properties import (
    ComponentProperties,
    UnavailableForComponentError,
)
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.errors import InputValidationError, MultiInputValidationError
from jupiter.framework.global_properties import (
    GlobalProperties,
    UnavailableGloballyError,
)
from jupiter.framework.mutation_inovcation.recorder import MutationInvocationRecorder
from jupiter.framework.ports import Ports
from jupiter.framework.progress_reporter.reporters.noop import (
    NoOpProgressReporterFactory,
)
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmDecodingError
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
)
from jupiter.framework.time_provider import CronRunTimeProvider
from jupiter.framework.use_case import (
    BackgroundMutationUseCase,
    UnavailableForContextError,
)
from jupiter.framework.utils.utils import find_all_modules

LOGGER = logging.getLogger(__name__)

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)
_CronT = TypeVar("_CronT", bound="Cron[Any, Any, Any, Any]")
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)
_CronExceptionHandlerT = TypeVar(
    "_CronExceptionHandlerT",
    bound=CronExceptionHandler[Any, Any, Exception],  # type: ignore[explicit-any]
)


class Cron(
    AppForm[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
    Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
):
    """Runs one ``BackgroundMutationUseCase`` either once or on its declared schedule."""

    _cron_time_provider: Final[CronRunTimeProvider]
    _realm_codec_registry: Final[RealmCodecRegistry]
    _concept_registry: Final[ConceptRegistry]
    _invocation_recorder: Final[MutationInvocationRecorder]
    _use_case_type: type[BackgroundMutationUseCase[Any, Any, Any, Any, Any, Any]]
    _command: Final[CronMutationCommand[Any, Any, Any, Any]]
    _execution_mode: Final[CronExecutionMode]
    _exception_handlers: dict[
        type[Exception],
        CronExceptionHandler[GlobalProperties, ServiceProperties, Any],
    ]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        cron_time_provider: CronRunTimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        use_case_type: type[BackgroundMutationUseCase[Any, Any, Any, Any, Any, Any]],
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
        self._exception_handlers = {}

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

    @property
    def execution_mode(self) -> CronExecutionMode:
        """How this cron process runs (once and exit vs scheduled loop)."""
        return self._execution_mode

    @classmethod
    def build_from_module_root(
        cls: type[_CronT],
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        cron_time_provider: CronRunTimeProvider,
        realm_codec_registry: RealmCodecRegistry,
        concept_registry: ConceptRegistry,
        invocation_recorder: MutationInvocationRecorder,
        use_case_type: type[BackgroundMutationUseCase[Any, Any, Any, Any, Any, Any]],  # type: ignore[explicit-any]
        exception_handler_base: type[_CronExceptionHandlerT],
        execution_mode: CronExecutionMode,
        *module_root: types.ModuleType,
    ) -> _CronT:
        """Build the cron app form and register exception handlers from ``module_root``."""

        def extract_exception_handler(
            the_module: types.ModuleType,
        ) -> Iterator[
            tuple[
                type[Exception],
                type[
                    CronExceptionHandler[GlobalProperties, ServiceProperties, Exception]
                ],
            ]
        ]:
            for _name, obj in the_module.__dict__.items():
                origin_obj = get_origin(obj)
                if not (
                    isinstance(obj, type)
                    and issubclass(origin_obj or obj, exception_handler_base)
                    and obj is not exception_handler_base
                ):
                    continue

                if obj.__module__ != the_module.__name__:
                    continue

                if not hasattr(obj, "__parameters__") or not hasattr(
                    obj.__parameters__, "__len__"
                ):
                    continue

                if len(obj.__parameters__) > 0:  # type: ignore[attr-defined]
                    continue

                exception_type = get_args(obj.__orig_bases__[0])[0]  # type: ignore
                yield exception_type, obj

        cron_app = cls(
            ports,
            global_properties,
            service_properties,
            cron_time_provider,
            realm_codec_registry,
            concept_registry,
            invocation_recorder,
            use_case_type,
            execution_mode,
        )

        cron_app._register_builtin_exception_handlers()

        for module in find_all_modules(*module_root):
            for exception_type, exception_handler_type in extract_exception_handler(
                module
            ):
                if exception_type in cron_app._exception_handlers:
                    continue
                cron_app._add_exception_handler(exception_type, exception_handler_type)

        return cron_app

    def _add_exception_handler(
        self,
        exception_type: type[_ExceptionT],
        exception_handler: type[
            CronExceptionHandler[GlobalProperties, ServiceProperties, _ExceptionT]
        ],
    ) -> CronExceptionHandler[GlobalProperties, ServiceProperties, _ExceptionT]:
        """Register an exception handler."""
        if exception_type in self._exception_handlers:
            raise Exception(f"Exception handler for {exception_type} already added")
        handler = exception_handler(
            self._global_properties,
            self._service_properties,
            exception_type,
        )
        self._exception_handlers[exception_type] = handler
        return handler

    def _register_builtin_exception_handlers(self) -> None:
        """Register framework-level cron exception handlers."""
        self._add_exception_handler(
            UnavailableGloballyError, UnavailableGloballyHandler
        )
        self._add_exception_handler(
            UnavailableForComponentError, UnavailableForComponentHandler
        )
        self._add_exception_handler(
            UnavailableForContextError, UnavailableForContextHandler
        )
        self._add_exception_handler(EntityNotFoundError, EntityNotFoundHandler)
        self._add_exception_handler(
            EntityAlreadyExistsError, EntityAlreadyExistsHandler
        )
        self._add_exception_handler(ExpiredAuthTokenError, ExpiredAuthTokenHandler)
        self._add_exception_handler(InvalidAuthTokenError, InvalidAuthTokenHandler)
        self._add_exception_handler(JSONDecodeError, JSONDecodeHandler)
        self._add_exception_handler(InputValidationError, InputValidationHandler)
        self._add_exception_handler(
            MultiInputValidationError, MultiInputValidationHandler
        )
        self._add_exception_handler(RealmDecodingError, RealmDecodingHandler)

    async def _execute_command(self) -> None:
        """Run the background mutation, dispatching known exceptions to handlers."""
        try:
            await self._command.execute()
        except Exception as exception:
            handler = self._exception_handlers.get(type(exception))
            if handler is None:
                raise
            handler.handle(exception)

    async def run(self, argv: list[str]) -> None:
        """Run the configured background mutation once or on a schedule."""
        _ = argv
        match self._execution_mode:
            case CronExecutionMode.START_RUN_STOP:
                await self._execute_command()
            case CronExecutionMode.RUN_FOREVER:
                scheduler = AsyncIOScheduler()
                job_id = self._use_case_type.__name__
                crontab = self._use_case_type.get_background_mutation_crontab()  # type: ignore[attr-defined]
                scheduler.add_job(
                    self._execute_command,
                    id=job_id,
                    name=job_id,
                    trigger=cron_trigger_from_crontab(crontab),
                )
                scheduler.start()
                loop = asyncio.get_running_loop()
                background_tasks: set[asyncio.Task[None]] = set()

                def _run_job_on_sigusr1() -> None:
                    LOGGER.info(
                        "Received SIGUSR1; running scheduled job %s immediately",
                        job_id,
                    )
                    job = scheduler.get_job(job_id)
                    if job is None:
                        return
                    result = job.func()
                    if asyncio.iscoroutine(result):
                        task = loop.create_task(result)
                        background_tasks.add(task)
                        task.add_done_callback(background_tasks.discard)

                loop.add_signal_handler(signal.SIGUSR1, _run_job_on_sigusr1)
                try:
                    await asyncio.Event().wait()
                finally:
                    loop.remove_signal_handler(signal.SIGUSR1)
                    scheduler.shutdown(wait=False)
