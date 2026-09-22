"""Scheduling constraints and hints for the work an entity generates."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.value import CompositeValue, EnumValue, enum_value, value

MIN_SCHEDULING_EVENT_DURATION_MINS = 1
MAX_SCHEDULING_EVENT_DURATION_MINS = 24 * 60  # 24 hours
MIN_SCHEDULING_EVENT_COUNT = 1
MAX_SCHEDULING_EVENT_COUNT = 100

# What something schedulable gets when it doesn't say otherwise. Anything
# schedulable takes up real time, so it always has a duration and at least one
# event - there is no "no hint" state to fall back from. The duration follows
# the difficulty of the work when there is one, and a medium one otherwise.
DEFAULT_SCHEDULING_EVENT_DURATION_MINS = Difficulty.MEDIUM.default_event_duration_mins
DEFAULT_SCHEDULING_EVENT_COUNT = 1


def default_event_duration_mins(difficulty: Difficulty | None) -> int:
    """How long one event is assumed to take, going by difficulty."""
    if difficulty is None:
        return DEFAULT_SCHEDULING_EVENT_DURATION_MINS
    return difficulty.default_event_duration_mins


@enum_value
class Schedulability(EnumValue):
    """Whether the work an entity generates can be placed in the calendar."""

    SCHEDULABLE = "schedulable"
    NOT_SCHEDULABLE = "not-schedulable"


@value
class SchedulingParams(CompositeValue):
    """Parameters for scheduling the work an entity generates."""

    schedulability: Schedulability
    event_duration_mins: int | None
    event_count: int | None

    def _validate(self) -> None:
        if self.schedulability is Schedulability.NOT_SCHEDULABLE:
            if self.event_duration_mins is not None:
                raise InputValidationError(
                    "An event duration cannot be set for something that is not schedulable",
                )
            if self.event_count is not None:
                raise InputValidationError(
                    "An event count cannot be set for something that is not schedulable",
                )
            return

        if self.event_duration_mins is None:
            raise InputValidationError(
                "An event duration is required for something that is schedulable",
            )
        if self.event_duration_mins < MIN_SCHEDULING_EVENT_DURATION_MINS:
            raise InputValidationError(
                f"The event duration must be at least {MIN_SCHEDULING_EVENT_DURATION_MINS} minute",
            )
        if self.event_duration_mins > MAX_SCHEDULING_EVENT_DURATION_MINS:
            raise InputValidationError(
                f"The event duration must be at most {MAX_SCHEDULING_EVENT_DURATION_MINS // 60} hours",
            )

        if self.event_count is None:
            raise InputValidationError(
                "An event count is required for something that is schedulable",
            )
        if self.event_count < MIN_SCHEDULING_EVENT_COUNT:
            raise InputValidationError(
                f"The event count must be at least {MIN_SCHEDULING_EVENT_COUNT}",
            )
        if self.event_count > MAX_SCHEDULING_EVENT_COUNT:
            raise InputValidationError(
                f"The event count must be at most {MAX_SCHEDULING_EVENT_COUNT}",
            )

    @staticmethod
    def default() -> "SchedulingParams":
        """Build the params used when nothing particular was asked for."""
        return SchedulingParams.default_for(None)

    @staticmethod
    def default_for(difficulty: Difficulty | None) -> "SchedulingParams":
        """Build the params for work of a given difficulty."""
        return SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=default_event_duration_mins(difficulty),
            event_count=DEFAULT_SCHEDULING_EVENT_COUNT,
        )

    @staticmethod
    def not_schedulable() -> "SchedulingParams":
        """Build the params for something that shouldn't be scheduled at all."""
        return SchedulingParams(
            schedulability=Schedulability.NOT_SCHEDULABLE,
            event_duration_mins=None,
            event_count=None,
        )

    @property
    def is_schedulable(self) -> bool:
        """Whether this can be placed in the calendar at all."""
        return self.schedulability is Schedulability.SCHEDULABLE

    @property
    def the_event_count(self) -> int:
        """How many events are needed; none at all when it can't be scheduled."""
        if not self.is_schedulable:
            return 0
        return self.event_count or DEFAULT_SCHEDULING_EVENT_COUNT

    @property
    def the_event_duration_mins(self) -> int:
        """How long one event should be; zero when it can't be scheduled."""
        if not self.is_schedulable:
            return 0
        return self.event_duration_mins or DEFAULT_SCHEDULING_EVENT_DURATION_MINS

    @property
    def total_duration_mins(self) -> int:
        """How much time is required in total, over all the events needed."""
        return self.the_event_duration_mins * self.the_event_count


def build_scheduling_params(
    schedulability: Schedulability | None,
    event_duration_mins: int | None,
    event_count: int | None,
    difficulty: Difficulty | None = None,
) -> SchedulingParams:
    """Build params out of the flat fields a create command carries.

    A command that leaves the duration out gets one derived from the difficulty
    of the work, one that leaves the count out gets a single event, and one that
    isn't schedulable drops both, so a form that keeps submitting them doesn't
    turn into a validation error.
    """
    if schedulability is None or schedulability is Schedulability.SCHEDULABLE:
        return SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=event_duration_mins
            or default_event_duration_mins(difficulty),
            event_count=event_count or DEFAULT_SCHEDULING_EVENT_COUNT,
        )
    return SchedulingParams.not_schedulable()


def build_scheduling_params_update(
    current: SchedulingParams,
    schedulability: UpdateAction[Schedulability],
    event_duration_mins: UpdateAction[int | None],
    event_count: UpdateAction[int | None],
    difficulty: Difficulty | None = None,
) -> UpdateAction[SchedulingParams]:
    """Fold the flat fields an update command carries into one update action."""
    if not (
        schedulability.should_change
        or event_duration_mins.should_change
        or event_count.should_change
    ):
        return UpdateAction.do_nothing()

    the_schedulability = schedulability.or_else(current.schedulability)
    if the_schedulability is Schedulability.NOT_SCHEDULABLE:
        return UpdateAction.change_to(SchedulingParams.not_schedulable())

    # Coming back from not schedulable there is nothing stored to keep, so the
    # defaults stand in for whatever the command didn't say.
    return UpdateAction.change_to(
        SchedulingParams(
            schedulability=the_schedulability,
            event_duration_mins=event_duration_mins.or_else(current.event_duration_mins)
            or default_event_duration_mins(difficulty),
            event_count=event_count.or_else(current.event_count)
            or DEFAULT_SCHEDULING_EVENT_COUNT,
        )
    )
