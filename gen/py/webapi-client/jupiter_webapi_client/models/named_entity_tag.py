from enum import Enum


class NamedEntityTag(str, Enum):
    BIGPLAN = "BigPlan"
    BIGPLANMILESTONE = "BigPlanMilestone"
    CHAPTER = "Chapter"
    CHORE = "Chore"
    CIRCLE = "Circle"
    DOC = "Doc"
    EMAILTASK = "EmailTask"
    GOAL = "Goal"
    HABIT = "Habit"
    HOMETAB = "HomeTab"
    HOMEWIDGET = "HomeWidget"
    INBOXTASK = "InboxTask"
    JOURNAL = "Journal"
    METRIC = "Metric"
    METRICENTRY = "MetricEntry"
    MILESTONE = "Milestone"
    PERSON = "Person"
    PROJECT = "Project"
    SCHEDULEEVENTFULLDAYS = "ScheduleEventFullDays"
    SCHEDULEEVENTINDAY = "ScheduleEventInDay"
    SCHEDULEEXTERNALSYNCLOG = "ScheduleExternalSyncLog"
    SCHEDULESTREAM = "ScheduleStream"
    SCORELOGENTRY = "ScoreLogEntry"
    SLACKTASK = "SlackTask"
    SMARTLIST = "SmartList"
    SMARTLISTITEM = "SmartListItem"
    SMARTLISTTAG = "SmartListTag"
    TIMEPLAN = "TimePlan"
    TIMEPLANACTIVITY = "TimePlanActivity"
    VACATION = "Vacation"
    VISION = "Vision"
    WORKINGMEM = "WorkingMem"

    def __str__(self) -> str:
        return str(self.value)
