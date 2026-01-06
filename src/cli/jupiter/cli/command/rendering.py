"""Helpers for console rendering."""

from jupiter.core.app import AppComponent
from jupiter.core.big_plans.status import BigPlanStatus
from jupiter.core.common.birthday import Birthday
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.recurring_task_skip_rule import RecurringTaskSkipRule
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.core.common.timezone import Timezone
from jupiter.core.gamification.user_score_overview import (
    UserScore,
    UserScoreOverview,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.inbox_tasks.status import InboxTaskStatus
from jupiter.core.life_plan.sub.aspects.name import ProjectName
from jupiter.core.metrics.unit import MetricUnit
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.push_integrations.sub.email.user_name import (
    EmailUserName,
)
from jupiter.core.push_integrations.sub.slack.channel_name import (
    SlackChannelName,
)
from jupiter.core.push_integrations.sub.slack.user_name import (
    SlackUserName,
)
from jupiter.core.sync_target import SyncTarget
from jupiter.core.time_plans.source import TimePlanSource
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from rich.table import Table
from rich.text import Text
from rich.tree import Tree


def entity_id_to_rich_text(entity_id: EntityId) -> Text:
    """Transform an entity id into text."""
    return Text(f"#{entity_id}", style="blue bold")


def inbox_task_status_to_rich_text(
    status: InboxTaskStatus,
    archived: bool = False,
) -> Text:
    """Transform an inbox task status into text."""
    if archived:
        if status == InboxTaskStatus.DONE:
            return Text("☑️ ")
        else:
            return Text("🔲")

    if status == InboxTaskStatus.NOT_STARTED:
        return Text("🔧")
    elif status == InboxTaskStatus.NOT_STARTED_GEN:
        return Text("🔧")
    elif status == InboxTaskStatus.IN_PROGRESS:
        return Text("🚧")
    elif status == InboxTaskStatus.BLOCKED:
        return Text("⭕")
    elif status == InboxTaskStatus.NOT_DONE:
        return Text("⛔")
    elif status == InboxTaskStatus.DONE:
        return Text("✅")
    else:
        raise Exception("Serious error - unhandled enum case")


def big_plan_status_to_rich_text(status: BigPlanStatus, archived: bool) -> Text:
    """Transform a big plan status into text."""
    if archived:
        if status == BigPlanStatus.DONE:
            return Text("☑️ ")
        else:
            return Text("🔲")

    if status == BigPlanStatus.NOT_STARTED:
        return Text("🔧")
    elif status == BigPlanStatus.IN_PROGRESS:
        return Text("🚧")
    elif status == BigPlanStatus.BLOCKED:
        return Text("⭕")
    elif status == BigPlanStatus.NOT_DONE:
        return Text("⛔")
    elif status == BigPlanStatus.DONE:
        return Text("✅")
    else:
        raise Exception("Serious error - unhandled enum case")


def actionable_date_to_rich_text(actionable_date: ADate) -> Text:
    """Transform an actionable date into text."""
    return Text("From ").append(
        str(actionable_date),
        style="underline",
    )


def start_date_to_rich_text(start_date: ADate) -> Text:
    """Transform a due date into text."""
    return Text("Start at ").append(
        str(start_date),
        style="underline",
    )


def end_date_to_rich_text(end_date: ADate) -> Text:
    """Transform a due date into text."""
    return Text("End at ").append(str(end_date), style="underline")


def due_date_to_rich_text(due_date: ADate) -> Text:
    """Transform a due date into text."""
    return Text("Due at ").append(str(due_date), style="underline")


def date_with_label_to_rich_text(due_date: ADate, label: str) -> Text:
    """Transform a due date into text."""
    return Text(f"{label} ").append(str(due_date), style="blue underline")


def project_to_rich_text(project_name: ProjectName) -> Text:
    """Transform a project into text."""
    return Text("In Project ").append(str(project_name), style="underline")


def entity_tag_to_rich_text(entity_tag: NamedEntityTag) -> Text:
    """Transform a named entity tag into text."""
    return Text(entity_tag.value, style="blue italic")


def sync_target_to_rich_text(sync_target: SyncTarget) -> Text:
    """Transform a sync target tag into text."""
    return Text(sync_target.value, style="yellow italic")


def event_source_to_rich_text(source: AppComponent) -> Text:
    """Transform an event source into text."""
    return Text(source.value, style="red italic underline")


def entity_name_to_rich_text(name: EntityName) -> Text:
    """Transform an entity name into text."""
    return Text(str(name), style="green underline")


def parent_entity_name_to_rich_text(parent_name: EntityName) -> Text:
    """Transform a parent entity name into text."""
    return Text("From @").append(str(parent_name), style="underline italic")


def period_to_rich_text(period: RecurringTaskPeriod) -> Text:
    """Transform a period into text."""
    return Text(str(period.value).capitalize(), style="underline")


def eisen_to_rich_text(eisen: Eisen) -> Text:
    """Transform an eisenhower value into text."""
    return Text(str(eisen.value).capitalize(), style="underline green")


def person_birthday_to_rich_text(birthday: Birthday) -> Text:
    """Transform birthday into text."""
    return Text(f"Birthday on {birthday}", style="italic")


def metric_unit_to_rich_text(metric_unit: MetricUnit) -> Text:
    """Transform a metric unit into text."""
    return Text(str(metric_unit.value).capitalize(), style="italic")


def source_to_rich_text(source: InboxTaskSource) -> Text:
    """Transform a source value into text."""
    return Text(str(source.value).capitalize(), style="underline italic blue")


def difficulty_to_rich_text(difficulty: Difficulty) -> Text:
    """Transform a difficulty value into text."""
    return Text(str(difficulty.value).capitalize(), style="underline")


def skip_rule_to_rich_text(skip_rule: RecurringTaskSkipRule) -> Text:
    """Transform a skip rule to text."""
    return Text("Skip ").append(str(skip_rule))


def actionable_from_day_to_rich_text(
    actionable_from_day: RecurringTaskDueAtDay,
) -> Text:
    """Transform a actionable day to rich text."""
    return Text("From day ").append(str(actionable_from_day), style="underline")


def actionable_from_month_to_rich_text(
    actionable_from_month: RecurringTaskDueAtMonth,
) -> Text:
    """Transform a actionable month to rich text."""
    return Text("From month ").append(str(actionable_from_month), style="underline")


def due_at_day_to_rich_text(due_at_day: RecurringTaskDueAtDay) -> Text:
    """Transform a due day to rich text."""
    return Text("Due at day ").append(str(due_at_day), style="underline")


def due_at_month_to_rich_text(due_at_month: RecurringTaskDueAtMonth) -> Text:
    """Transform a due month to rich text."""
    return Text("Due at month ").append(str(due_at_month), style="underline")


def inbox_task_summary_to_rich_text(inbox_task: InboxTask) -> Text:
    """Transform a full inbox task to rich text."""
    text = inbox_task_status_to_rich_text(inbox_task.status, inbox_task.archived)
    text.append(" ")
    text.append(entity_id_to_rich_text(inbox_task.ref_id))
    text.append(f" {inbox_task.name}")

    if inbox_task.actionable_date is not None:
        text.append(" ")
        text.append(actionable_date_to_rich_text(inbox_task.actionable_date))

    if inbox_task.due_date is not None:
        text.append(" ")
        text.append(due_date_to_rich_text(inbox_task.due_date))

    if inbox_task.archived:
        text.stylize("grey62")

    return text


def slack_user_name_to_rich_text(user: SlackUserName) -> Text:
    """Transform a slack user name to rich text."""
    return Text("@").append(str(user), style="bold on white underline")


def slack_channel_name_to_rich_text(channel: SlackChannelName) -> Text:
    """Transform a slack channel name to rich text."""
    return Text("in #").append(str(channel), style="italic green")


def slack_task_message_to_rich_text(message: str) -> Text:
    """Transform a message to rich text."""
    text = Text("")
    message = " ".join(m.strip() for m in message.strip().split("\n"))
    if len(message) <= 100:
        text.append(" said 💬 ")
        text.append(message)
    else:
        text.append(" said 💬 ")
        text.append(message[0:98])
        text.append("...")
    return text


def email_user_name_to_rich_text(user: EmailUserName) -> Text:
    """Transform an email name to rich text."""
    return Text(str(user), style="bold on white underline")


def email_address_to_rich_text(address: EmailAddress) -> Text:
    """Transform an email address to rich text."""
    return Text(str(address), style="underline")


def email_task_subject_to_rich_text(subject: str) -> Text:
    """Transform a subject to rich text."""
    text = Text("")
    subject = " ".join(m.strip() for m in subject.strip().split("\n"))
    if len(subject) <= 100:
        text.append(" on 💬 ")
        text.append(subject)
    else:
        text.append(" on 💬 ")
        text.append(subject[0:98])
        text.append("...")
    return text


def timezone_to_rich_text(timezone: Timezone) -> Text:
    """Transform a timezone to rich text."""
    return Text(str(timezone), style="bold")


def user_score_to_rich(user_score: UserScore) -> Text:
    """Transform a user score to rich text."""
    text = Text(str(user_score.total_score))
    if user_score.inbox_task_cnt > 0:
        text.append(" 📥 ")
        text.append(str(user_score.inbox_task_cnt), style="italic")
    if user_score.big_plan_cnt > 0:
        text.append(" 🌍 ")
        text.append(str(user_score.big_plan_cnt), style="italic")
    return text


def user_score_overview_to_rich(score_overview: UserScoreOverview) -> Tree:
    """Gamification rendering."""
    gamification_tree = Tree("🎮 Gamification:")

    scores_table = Table(title="💪 Scores:", title_justify="left")
    scores_table.add_column("Period")
    scores_table.add_column("Current", width=16)
    scores_table.add_column("Best This Quarter", width=16)
    scores_table.add_column("Best This Year", width=16)
    scores_table.add_column("Best Ever", width=16)

    scores_table.add_row(
        "Daily",
        user_score_to_rich(score_overview.daily_score),
        user_score_to_rich(score_overview.best_quarterly_daily_score),
        user_score_to_rich(score_overview.best_yearly_daily_score),
        user_score_to_rich(score_overview.best_lifetime_daily_score),
    )
    scores_table.add_row(
        "Weekly",
        user_score_to_rich(score_overview.weekly_score),
        user_score_to_rich(score_overview.best_quarterly_weekly_score),
        user_score_to_rich(score_overview.best_yearly_weekly_score),
        user_score_to_rich(score_overview.best_lifetime_weekly_score),
    )
    scores_table.add_row(
        "Monthly",
        user_score_to_rich(score_overview.daily_score),
        user_score_to_rich(score_overview.best_quarterly_monthly_score),
        user_score_to_rich(score_overview.best_yearly_monthly_score),
        user_score_to_rich(score_overview.best_lifetime_monthly_score),
    )
    scores_table.add_row(
        "Quarterly",
        user_score_to_rich(score_overview.daily_score),
        "N/A",
        user_score_to_rich(score_overview.best_yearly_quarterly_score),
        user_score_to_rich(score_overview.best_lifetime_quarterly_score),
    )
    scores_table.add_row(
        "Yearly",
        user_score_to_rich(score_overview.daily_score),
        "N/A",
        "N/A",
        user_score_to_rich(score_overview.best_lifetime_yearly_score),
    )
    scores_table.add_row(
        "Lifetime",
        user_score_to_rich(score_overview.lifetime_score),
        "N/A",
        "N/A",
        "N/A",
    )

    gamification_tree.add(scores_table)

    return gamification_tree


def entity_summary_snippet_to_rich_text(snippet: str) -> Text:
    """Transform the snippet of text in an entity summary to text."""
    snippet_with_markup = snippet.replace("found", "bold underline blue")

    return Text.from_markup(snippet_with_markup)


def boolean_to_rich_text(value: bool, label: str) -> Text:
    """Transform a boolean to rich text."""
    if value:
        return Text(f"✅ {label}")
    else:
        return Text(f"⛔ {label}")


def time_plan_source_to_rich_text(value: TimePlanSource) -> Text:
    """Transform a time plan source to rich text."""
    return Text(str(value.value).capitalize(), style="gray")


def time_plan_activity_kind_to_rich_text(kind: TimePlanActivityKind) -> Text:
    """Transform a time plan kind to rich text."""
    return Text(str(kind.value).capitalize(), style="blue")


def time_plan_activity_feasability_to_rich_text(
    feasability: TimePlanActivityFeasability,
) -> Text:
    """Transform a time plan feasaibility to rich text."""
    return Text(str(feasability.value).capitalize(), style="red")


def time_in_day_to_rich_text(time_in_day: TimeInDay) -> Text:
    """Transform a time in day to rich text."""
    return Text(str(time_in_day), style="green")
