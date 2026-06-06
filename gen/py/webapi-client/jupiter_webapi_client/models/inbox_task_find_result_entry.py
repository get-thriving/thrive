from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.project import Project
    from ..models.chore import Chore
    from ..models.contact import Contact
    from ..models.email_task import EmailTask
    from ..models.habit import Habit
    from ..models.inbox_task import InboxTask
    from ..models.journal import Journal
    from ..models.metric import Metric
    from ..models.occasion import Occasion
    from ..models.person import Person
    from ..models.slack_task import SlackTask
    from ..models.time_plan import TimePlan
    from ..models.todo_task import TodoTask
    from ..models.working_mem_collection import WorkingMemCollection


T = TypeVar("T", bound="InboxTaskFindResultEntry")


@_attrs_define
class InboxTaskFindResultEntry:
    """A single entry in the load all inbox tasks response.

    Attributes:
        inbox_task (InboxTask): An inbox task.
        working_mem_collection (None | Unset | WorkingMemCollection):
        time_plan (None | TimePlan | Unset):
        habit (Habit | None | Unset):
        chore (Chore | None | Unset):
        project (Project | None | Unset):
        journal (Journal | None | Unset):
        metric (Metric | None | Unset):
        person (None | Person | Unset):
        contact (Contact | None | Unset):
        occasion (None | Occasion | Unset):
        slack_task (None | SlackTask | Unset):
        email_task (EmailTask | None | Unset):
        todo_task (None | TodoTask | Unset):
    """

    inbox_task: InboxTask
    working_mem_collection: None | Unset | WorkingMemCollection = UNSET
    time_plan: None | TimePlan | Unset = UNSET
    habit: Habit | None | Unset = UNSET
    chore: Chore | None | Unset = UNSET
    project: Project | None | Unset = UNSET
    journal: Journal | None | Unset = UNSET
    metric: Metric | None | Unset = UNSET
    person: None | Person | Unset = UNSET
    contact: Contact | None | Unset = UNSET
    occasion: None | Occasion | Unset = UNSET
    slack_task: None | SlackTask | Unset = UNSET
    email_task: EmailTask | None | Unset = UNSET
    todo_task: None | TodoTask | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.project import Project
        from ..models.chore import Chore
        from ..models.contact import Contact
        from ..models.email_task import EmailTask
        from ..models.habit import Habit
        from ..models.journal import Journal
        from ..models.metric import Metric
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.slack_task import SlackTask
        from ..models.time_plan import TimePlan
        from ..models.todo_task import TodoTask
        from ..models.working_mem_collection import WorkingMemCollection

        inbox_task = self.inbox_task.to_dict()

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

        project: dict[str, Any] | None | Unset
        if isinstance(self.project, Unset):
            project = UNSET
        elif isinstance(self.project, Project):
            project = self.project.to_dict()
        else:
            project = self.project

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

        contact: dict[str, Any] | None | Unset
        if isinstance(self.contact, Unset):
            contact = UNSET
        elif isinstance(self.contact, Contact):
            contact = self.contact.to_dict()
        else:
            contact = self.contact

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

        todo_task: dict[str, Any] | None | Unset
        if isinstance(self.todo_task, Unset):
            todo_task = UNSET
        elif isinstance(self.todo_task, TodoTask):
            todo_task = self.todo_task.to_dict()
        else:
            todo_task = self.todo_task

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "inbox_task": inbox_task,
            }
        )
        if working_mem_collection is not UNSET:
            field_dict["working_mem_collection"] = working_mem_collection
        if time_plan is not UNSET:
            field_dict["time_plan"] = time_plan
        if habit is not UNSET:
            field_dict["habit"] = habit
        if chore is not UNSET:
            field_dict["chore"] = chore
        if project is not UNSET:
            field_dict["project"] = project
        if journal is not UNSET:
            field_dict["journal"] = journal
        if metric is not UNSET:
            field_dict["metric"] = metric
        if person is not UNSET:
            field_dict["person"] = person
        if contact is not UNSET:
            field_dict["contact"] = contact
        if occasion is not UNSET:
            field_dict["occasion"] = occasion
        if slack_task is not UNSET:
            field_dict["slack_task"] = slack_task
        if email_task is not UNSET:
            field_dict["email_task"] = email_task
        if todo_task is not UNSET:
            field_dict["todo_task"] = todo_task

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.project import Project
        from ..models.chore import Chore
        from ..models.contact import Contact
        from ..models.email_task import EmailTask
        from ..models.habit import Habit
        from ..models.inbox_task import InboxTask
        from ..models.journal import Journal
        from ..models.metric import Metric
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.slack_task import SlackTask
        from ..models.time_plan import TimePlan
        from ..models.todo_task import TodoTask
        from ..models.working_mem_collection import WorkingMemCollection

        d = dict(src_dict)
        inbox_task = InboxTask.from_dict(d.pop("inbox_task"))

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

        def _parse_project(data: object) -> Project | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                project_type_0 = Project.from_dict(data)

                return project_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Project | None | Unset, data)

        project = _parse_project(d.pop("project", UNSET))

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

        def _parse_contact(data: object) -> Contact | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                contact_type_0 = Contact.from_dict(data)

                return contact_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Contact | None | Unset, data)

        contact = _parse_contact(d.pop("contact", UNSET))

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

        def _parse_todo_task(data: object) -> None | TodoTask | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                todo_task_type_0 = TodoTask.from_dict(data)

                return todo_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | TodoTask | Unset, data)

        todo_task = _parse_todo_task(d.pop("todo_task", UNSET))

        inbox_task_find_result_entry = cls(
            inbox_task=inbox_task,
            working_mem_collection=working_mem_collection,
            time_plan=time_plan,
            habit=habit,
            chore=chore,
            project=project,
            journal=journal,
            metric=metric,
            person=person,
            contact=contact,
            occasion=occasion,
            slack_task=slack_task,
            email_task=email_task,
            todo_task=todo_task,
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
