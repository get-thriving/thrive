"""Mapping from NamedEntityTag to the corresponding entity class."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.chores.root import Chore
from jupiter.core.docs.root import Doc
from jupiter.core.gamification.score_log_entry import ScoreLogEntry
from jupiter.core.habits.root import Habit
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.core.journals.root import Journal
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.core.schedule.sub.external_sync_log.root import ScheduleExternalSyncLog
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.todo.root import TodoTask
from jupiter.core.vacations.root import Vacation
from jupiter.framework.entity import CrownEntity

NAMED_ENTITY_TAG_TO_CLS: dict[NamedEntityTag, type[CrownEntity]] = {
    NamedEntityTag.SCORE_LOG_ENTRY: ScoreLogEntry,
    NamedEntityTag.HOME_TAB: HomeTab,
    NamedEntityTag.HOME_WIDGET: HomeWidget,
    NamedEntityTag.TODO_TASK: TodoTask,
    NamedEntityTag.TIME_PLAN: TimePlan,
    NamedEntityTag.TIME_PLAN_ACTIVITY: TimePlanActivity,
    NamedEntityTag.SCHEDULE_STREAM: ScheduleStream,
    NamedEntityTag.SCHEDULE_EXPORT: ScheduleExport,
    NamedEntityTag.SCHEDULE_EVENT_IN_DAY: ScheduleEventInDay,
    NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK: ScheduleEventFullDays,
    NamedEntityTag.SCHEDULE_EXTERNAL_SYNC_LOG: ScheduleExternalSyncLog,
    NamedEntityTag.HABIT: Habit,
    NamedEntityTag.CHORE: Chore,
    NamedEntityTag.BIG_PLAN: BigPlan,
    NamedEntityTag.BIG_PLAN_MILESTONE: BigPlanMilestone,
    NamedEntityTag.DOC: Doc,
    NamedEntityTag.JOURNAL: Journal,
    NamedEntityTag.CHAPTER: Chapter,
    NamedEntityTag.GOAL: Goal,
    NamedEntityTag.MILESTONE: Milestone,
    NamedEntityTag.VISION: Vision,
    NamedEntityTag.VACATION: Vacation,
    NamedEntityTag.ASPECT: Aspect,
    NamedEntityTag.SMART_LIST: SmartList,
    NamedEntityTag.SMART_LIST_ITEM: SmartListItem,
    NamedEntityTag.METRIC: Metric,
    NamedEntityTag.METRIC_ENTRY: MetricEntry,
    NamedEntityTag.PERSON: Person,
    NamedEntityTag.OCCASION: Occasion,
    NamedEntityTag.CIRCLE: Circle,
    NamedEntityTag.SLACK_TASK: SlackTask,
    NamedEntityTag.EMAIL_TASK: EmailTask,
}
