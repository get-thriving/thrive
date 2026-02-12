from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.big_plan import BigPlan
    from ..models.chapter import Chapter
    from ..models.chore import Chore
    from ..models.email_task import EmailTask
    from ..models.goal import Goal
    from ..models.habit import Habit
    from ..models.inbox_task import InboxTask
    from ..models.journal import Journal
    from ..models.metric import Metric
    from ..models.note import Note
    from ..models.occasion import Occasion
    from ..models.person import Person
    from ..models.project import Project
    from ..models.slack_task import SlackTask
    from ..models.tag import Tag
    from ..models.time_event_in_day_block import TimeEventInDayBlock
    from ..models.time_plan import TimePlan
    from ..models.working_mem_collection import WorkingMemCollection


T = TypeVar("T", bound="InboxTaskFindResultEntry")


@_attrs_define
class InboxTaskFindResultEntry:
    """A single entry in the load all inbox tasks response.

    Attributes:
        inbox_task (InboxTask): An inbox task.
        tags (list[Tag]):
        project (Project): The project.
        note (None | Note | Unset):
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        time_event_blocks (list[TimeEventInDayBlock] | None | Unset):
        working_mem_collection (None | Unset | WorkingMemCollection):
        time_plan (None | TimePlan | Unset):
        habit (Habit | None | Unset):
        chore (Chore | None | Unset):
        big_plan (BigPlan | None | Unset):
        journal (Journal | None | Unset):
        metric (Metric | None | Unset):
        person (None | Person | Unset):
        occasion (None | Occasion | Unset):
        slack_task (None | SlackTask | Unset):
        email_task (EmailTask | None | Unset):
    """

    inbox_task: InboxTask
    tags: list[Tag]
    project: Project
    note: None | Note | Unset = UNSET
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    time_event_blocks: list[TimeEventInDayBlock] | None | Unset = UNSET
    working_mem_collection: None | Unset | WorkingMemCollection = UNSET
    time_plan: None | TimePlan | Unset = UNSET
    habit: Habit | None | Unset = UNSET
    chore: Chore | None | Unset = UNSET
    big_plan: BigPlan | None | Unset = UNSET
    journal: Journal | None | Unset = UNSET
    metric: Metric | None | Unset = UNSET
    person: None | Person | Unset = UNSET
    occasion: None | Occasion | Unset = UNSET
    slack_task: None | SlackTask | Unset = UNSET
    email_task: EmailTask | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.big_plan import BigPlan
        from ..models.chapter import Chapter
        from ..models.chore import Chore
        from ..models.email_task import EmailTask
        from ..models.goal import Goal
        from ..models.habit import Habit
        from ..models.journal import Journal
        from ..models.metric import Metric
        from ..models.note import Note
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.slack_task import SlackTask
        from ..models.time_plan import TimePlan
        from ..models.working_mem_collection import WorkingMemCollection

        inbox_task = self.inbox_task.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        project = self.project.to_dict()

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        chapter: dict[str, Any] | None | Unset
        if isinstance(self.chapter, Unset):
            chapter = UNSET
        elif isinstance(self.chapter, Chapter):
            chapter = self.chapter.to_dict()
        else:
            chapter = self.chapter

        goal: dict[str, Any] | None | Unset
        if isinstance(self.goal, Unset):
            goal = UNSET
        elif isinstance(self.goal, Goal):
            goal = self.goal.to_dict()
        else:
            goal = self.goal

        time_event_blocks: list[dict[str, Any]] | None | Unset
        if isinstance(self.time_event_blocks, Unset):
            time_event_blocks = UNSET
        elif isinstance(self.time_event_blocks, list):
            time_event_blocks = []
            for time_event_blocks_type_0_item_data in self.time_event_blocks:
                time_event_blocks_type_0_item = time_event_blocks_type_0_item_data.to_dict()
                time_event_blocks.append(time_event_blocks_type_0_item)

        else:
            time_event_blocks = self.time_event_blocks

        working_mem_collection: dict[str, Any] | None | Unset
        if isinstance(self.working_mem_collection, Unset):
            working_mem_collection = UNSET
        elif isinstance(self.working_mem_collection, WorkingMemCollection):
            working_mem_collection = self.working_mem_collection.to_dict()
        else:
            working_mem_collection = self.working_mem_collection

        time_plan: dict[str, Any] | None | Unset
        if isinstance(self.time_plan, Unset):
            time_plan = UNSET
        elif isinstance(self.time_plan, TimePlan):
            time_plan = self.time_plan.to_dict()
        else:
            time_plan = self.time_plan

        habit: dict[str, Any] | None | Unset
        if isinstance(self.habit, Unset):
            habit = UNSET
        elif isinstance(self.habit, Habit):
            habit = self.habit.to_dict()
        else:
            habit = self.habit

        chore: dict[str, Any] | None | Unset
        if isinstance(self.chore, Unset):
            chore = UNSET
        elif isinstance(self.chore, Chore):
            chore = self.chore.to_dict()
        else:
            chore = self.chore

        big_plan: dict[str, Any] | None | Unset
        if isinstance(self.big_plan, Unset):
            big_plan = UNSET
        elif isinstance(self.big_plan, BigPlan):
            big_plan = self.big_plan.to_dict()
        else:
            big_plan = self.big_plan

        journal: dict[str, Any] | None | Unset
        if isinstance(self.journal, Unset):
            journal = UNSET
        elif isinstance(self.journal, Journal):
            journal = self.journal.to_dict()
        else:
            journal = self.journal

        metric: dict[str, Any] | None | Unset
        if isinstance(self.metric, Unset):
            metric = UNSET
        elif isinstance(self.metric, Metric):
            metric = self.metric.to_dict()
        else:
            metric = self.metric

        person: dict[str, Any] | None | Unset
        if isinstance(self.person, Unset):
            person = UNSET
        elif isinstance(self.person, Person):
            person = self.person.to_dict()
        else:
            person = self.person

        occasion: dict[str, Any] | None | Unset
        if isinstance(self.occasion, Unset):
            occasion = UNSET
        elif isinstance(self.occasion, Occasion):
            occasion = self.occasion.to_dict()
        else:
            occasion = self.occasion

        slack_task: dict[str, Any] | None | Unset
        if isinstance(self.slack_task, Unset):
            slack_task = UNSET
        elif isinstance(self.slack_task, SlackTask):
            slack_task = self.slack_task.to_dict()
        else:
            slack_task = self.slack_task

        email_task: dict[str, Any] | None | Unset
        if isinstance(self.email_task, Unset):
            email_task = UNSET
        elif isinstance(self.email_task, EmailTask):
            email_task = self.email_task.to_dict()
        else:
            email_task = self.email_task

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "inbox_task": inbox_task,
                "tags": tags,
                "project": project,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if chapter is not UNSET:
            field_dict["chapter"] = chapter
        if goal is not UNSET:
            field_dict["goal"] = goal
        if time_event_blocks is not UNSET:
            field_dict["time_event_blocks"] = time_event_blocks
        if working_mem_collection is not UNSET:
            field_dict["working_mem_collection"] = working_mem_collection
        if time_plan is not UNSET:
            field_dict["time_plan"] = time_plan
        if habit is not UNSET:
            field_dict["habit"] = habit
        if chore is not UNSET:
            field_dict["chore"] = chore
        if big_plan is not UNSET:
            field_dict["big_plan"] = big_plan
        if journal is not UNSET:
            field_dict["journal"] = journal
        if metric is not UNSET:
            field_dict["metric"] = metric
        if person is not UNSET:
            field_dict["person"] = person
        if occasion is not UNSET:
            field_dict["occasion"] = occasion
        if slack_task is not UNSET:
            field_dict["slack_task"] = slack_task
        if email_task is not UNSET:
            field_dict["email_task"] = email_task

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.big_plan import BigPlan
        from ..models.chapter import Chapter
        from ..models.chore import Chore
        from ..models.email_task import EmailTask
        from ..models.goal import Goal
        from ..models.habit import Habit
        from ..models.inbox_task import InboxTask
        from ..models.journal import Journal
        from ..models.metric import Metric
        from ..models.note import Note
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.project import Project
        from ..models.slack_task import SlackTask
        from ..models.tag import Tag
        from ..models.time_event_in_day_block import TimeEventInDayBlock
        from ..models.time_plan import TimePlan
        from ..models.working_mem_collection import WorkingMemCollection

        d = dict(src_dict)
        inbox_task = InboxTask.from_dict(d.pop("inbox_task"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        project = Project.from_dict(d.pop("project"))

        def _parse_note(data: object) -> None | Note | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                note_type_0 = Note.from_dict(data)

                return note_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Note | Unset, data)

        note = _parse_note(d.pop("note", UNSET))

        def _parse_chapter(data: object) -> Chapter | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                chapter_type_0 = Chapter.from_dict(data)

                return chapter_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Chapter | None | Unset, data)

        chapter = _parse_chapter(d.pop("chapter", UNSET))

        def _parse_goal(data: object) -> Goal | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                goal_type_0 = Goal.from_dict(data)

                return goal_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Goal | None | Unset, data)

        goal = _parse_goal(d.pop("goal", UNSET))

        def _parse_time_event_blocks(data: object) -> list[TimeEventInDayBlock] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                time_event_blocks_type_0 = []
                _time_event_blocks_type_0 = data
                for time_event_blocks_type_0_item_data in _time_event_blocks_type_0:
                    time_event_blocks_type_0_item = TimeEventInDayBlock.from_dict(time_event_blocks_type_0_item_data)

                    time_event_blocks_type_0.append(time_event_blocks_type_0_item)

                return time_event_blocks_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[TimeEventInDayBlock] | None | Unset, data)

        time_event_blocks = _parse_time_event_blocks(d.pop("time_event_blocks", UNSET))

        def _parse_working_mem_collection(data: object) -> None | Unset | WorkingMemCollection:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                working_mem_collection_type_0 = WorkingMemCollection.from_dict(data)

                return working_mem_collection_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Unset | WorkingMemCollection, data)

        working_mem_collection = _parse_working_mem_collection(d.pop("working_mem_collection", UNSET))

        def _parse_time_plan(data: object) -> None | TimePlan | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                time_plan_type_0 = TimePlan.from_dict(data)

                return time_plan_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | TimePlan | Unset, data)

        time_plan = _parse_time_plan(d.pop("time_plan", UNSET))

        def _parse_habit(data: object) -> Habit | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                habit_type_0 = Habit.from_dict(data)

                return habit_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Habit | None | Unset, data)

        habit = _parse_habit(d.pop("habit", UNSET))

        def _parse_chore(data: object) -> Chore | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                chore_type_0 = Chore.from_dict(data)

                return chore_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Chore | None | Unset, data)

        chore = _parse_chore(d.pop("chore", UNSET))

        def _parse_big_plan(data: object) -> BigPlan | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                big_plan_type_0 = BigPlan.from_dict(data)

                return big_plan_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(BigPlan | None | Unset, data)

        big_plan = _parse_big_plan(d.pop("big_plan", UNSET))

        def _parse_journal(data: object) -> Journal | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                journal_type_0 = Journal.from_dict(data)

                return journal_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Journal | None | Unset, data)

        journal = _parse_journal(d.pop("journal", UNSET))

        def _parse_metric(data: object) -> Metric | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                metric_type_0 = Metric.from_dict(data)

                return metric_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Metric | None | Unset, data)

        metric = _parse_metric(d.pop("metric", UNSET))

        def _parse_person(data: object) -> None | Person | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                person_type_0 = Person.from_dict(data)

                return person_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Person | Unset, data)

        person = _parse_person(d.pop("person", UNSET))

        def _parse_occasion(data: object) -> None | Occasion | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                occasion_type_0 = Occasion.from_dict(data)

                return occasion_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Occasion | Unset, data)

        occasion = _parse_occasion(d.pop("occasion", UNSET))

        def _parse_slack_task(data: object) -> None | SlackTask | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                slack_task_type_0 = SlackTask.from_dict(data)

                return slack_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | SlackTask | Unset, data)

        slack_task = _parse_slack_task(d.pop("slack_task", UNSET))

        def _parse_email_task(data: object) -> EmailTask | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                email_task_type_0 = EmailTask.from_dict(data)

                return email_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(EmailTask | None | Unset, data)

        email_task = _parse_email_task(d.pop("email_task", UNSET))

        inbox_task_find_result_entry = cls(
            inbox_task=inbox_task,
            tags=tags,
            project=project,
            note=note,
            chapter=chapter,
            goal=goal,
            time_event_blocks=time_event_blocks,
            working_mem_collection=working_mem_collection,
            time_plan=time_plan,
            habit=habit,
            chore=chore,
            big_plan=big_plan,
            journal=journal,
            metric=metric,
            person=person,
            occasion=occasion,
            slack_task=slack_task,
            email_task=email_task,
        )

        inbox_task_find_result_entry.additional_properties = d
        return inbox_task_find_result_entry

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
