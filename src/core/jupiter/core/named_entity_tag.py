"""A tag for all the known entities."""

from jupiter.framework.entity import AboveGroundEntity
from jupiter.framework.value import EnumValue, enum_value


@enum_value
class NamedEntityTag(EnumValue):
    """A tag for all known entities."""

    OTHER = "Other"

    SCORE_LOG_ENTRY = "ScoreLogEntry"  # ScoreLogEntry.__name__

    HOME_TAB = "HomeTab"  # HomeTab.__name__
    HOME_WIDGET = "HomeWidget"  # HomeWidget.__name__
    TODO_TASK = "TodoTask"  # TodoTask.__name__
    WORKING_MEM = "WorkingMem"  # WorkingMem.__name__
    TIME_PLAN = "TimePlan"  # TimePlan.__name__
    TIME_PLAN_ACTIVITY = "TimePlanActivity"  # TimePlanActivity.__name__
    SCHEDULE_STREAM = "ScheduleStream"  # ScheduleStream.__name__
    SCHEDULE_EXPORT = "ScheduleExport"  # ScheduleExport.__name__
    SCHEDULE_EVENT_IN_DAY = "ScheduleEventInDay"  # ScheduleEventInDay.__name__
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = (
        "ScheduleEventFullDays"  # ScheduleEventFullDays.__name__
    )
    SCHEDULE_EXTERNAL_SYNC_LOG = (
        "ScheduleExternalSyncLog"  # ScheduleExternalSyncLog.__name__
    )
    HABIT = "Habit"  # Habit.__name__
    CHORE = "Chore"  # Chore.__name__
    BIG_PLAN = "BigPlan"  # BigPlan.__name__
    BIG_PLAN_MILESTONE = "BigPlanMilestone"  # BigPlanMilestone.__name__
    DOC = "Doc"  # Doc.__name__
    JOURNAL = "Journal"  # Journal.__name__
    CHAPTER = "Chapter"  # Chapter.__name__
    GOAL = "Goal"  # Goal.__name__
    MILESTONE = "Milestone"  # Milestone.__name__
    VISION = "Vision"  # Vision.__name__
    VACATION = "Vacation"  # Vacation.__name__
    ASPECT = "Aspect"  # Aspect.__name__
    SMART_LIST = "SmartList"  # SmartList.__name__
    SMART_LIST_ITEM = "SmartListItem"  # SmartListItem.__name__
    METRIC = "Metric"  # Metric.__name__
    METRIC_ENTRY = "MetricEntry"  # MetricEntry.__name__
    PERSON = "Person"  # Person.__name__
    OCCASION = "Occasion"  # Occasion.__name__
    CIRCLE = "Circle"  # Circle.__name__
    SLACK_TASK = "SlackTask"  # SlackTask.__name__
    EMAIL_TASK = "EmailTask"  # EmailTask.__name__

    @staticmethod
    def from_inbox_task() -> "NamedEntityTag":
        """Construct a tag from an inbox task."""
        return NamedEntityTag.OTHER

    @staticmethod
    def from_entity(entity: AboveGroundEntity) -> "NamedEntityTag":
        """Construct a tag from an entity."""
        return NamedEntityTag(entity.__class__.__name__)

    @staticmethod
    def is_valid(entity_type: str) -> bool:
        """Check if a entity type is a valid tag."""
        try:
            NamedEntityTag(entity_type)
            return True
        except ValueError:
            return False

    def __str__(self) -> str:
        """Get the string representation of the tag."""
        return self.value
