from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.aspect_summary import AspectSummary
    from ..models.big_plan_summary import BigPlanSummary
    from ..models.chapter_summary import ChapterSummary
    from ..models.chore_summary import ChoreSummary
    from ..models.goal_summary import GoalSummary
    from ..models.habit_summary import HabitSummary
    from ..models.inbox_task_summary import InboxTaskSummary
    from ..models.journal_summary import JournalSummary
    from ..models.life_plan import LifePlan
    from ..models.metric_summary import MetricSummary
    from ..models.milestone_summary import MilestoneSummary
    from ..models.person_summary import PersonSummary
    from ..models.schedule_stream_summary import ScheduleStreamSummary
    from ..models.smart_list_summary import SmartListSummary
    from ..models.user import User
    from ..models.vacation_summary import VacationSummary
    from ..models.vision import Vision
    from ..models.workspace import Workspace


T = TypeVar("T", bound="GetSummariesResult")


@_attrs_define
class GetSummariesResult:
    """Get summaries result.

    Attributes:
        user (None | Unset | User):
        workspace (None | Unset | Workspace):
        life_plan (LifePlan | None | Unset):
        active_vision (None | Unset | Vision):
        vacations (list[VacationSummary] | None | Unset):
        schedule_streams (list[ScheduleStreamSummary] | None | Unset):
        root_aspect (AspectSummary | None | Unset):
        aspects (list[AspectSummary] | None | Unset):
        chapters (list[ChapterSummary] | None | Unset):
        goals (list[GoalSummary] | None | Unset):
        milestones (list[MilestoneSummary] | None | Unset):
        inbox_tasks (list[InboxTaskSummary] | None | Unset):
        journals_last_year (list[JournalSummary] | None | Unset):
        habits (list[HabitSummary] | None | Unset):
        chores (list[ChoreSummary] | None | Unset):
        big_plans (list[BigPlanSummary] | None | Unset):
        smart_lists (list[SmartListSummary] | None | Unset):
        metrics (list[MetricSummary] | None | Unset):
        persons (list[PersonSummary] | None | Unset):
    """

    user: None | Unset | User = UNSET
    workspace: None | Unset | Workspace = UNSET
    life_plan: LifePlan | None | Unset = UNSET
    active_vision: None | Unset | Vision = UNSET
    vacations: list[VacationSummary] | None | Unset = UNSET
    schedule_streams: list[ScheduleStreamSummary] | None | Unset = UNSET
    root_aspect: AspectSummary | None | Unset = UNSET
    aspects: list[AspectSummary] | None | Unset = UNSET
    chapters: list[ChapterSummary] | None | Unset = UNSET
    goals: list[GoalSummary] | None | Unset = UNSET
    milestones: list[MilestoneSummary] | None | Unset = UNSET
    inbox_tasks: list[InboxTaskSummary] | None | Unset = UNSET
    journals_last_year: list[JournalSummary] | None | Unset = UNSET
    habits: list[HabitSummary] | None | Unset = UNSET
    chores: list[ChoreSummary] | None | Unset = UNSET
    big_plans: list[BigPlanSummary] | None | Unset = UNSET
    smart_lists: list[SmartListSummary] | None | Unset = UNSET
    metrics: list[MetricSummary] | None | Unset = UNSET
    persons: list[PersonSummary] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.aspect_summary import AspectSummary
        from ..models.life_plan import LifePlan
        from ..models.user import User
        from ..models.vision import Vision
        from ..models.workspace import Workspace

        user: dict[str, Any] | None | Unset
        if isinstance(self.user, Unset):
            user = UNSET
        elif isinstance(self.user, User):
            user = self.user.to_dict()
        else:
            user = self.user

        workspace: dict[str, Any] | None | Unset
        if isinstance(self.workspace, Unset):
            workspace = UNSET
        elif isinstance(self.workspace, Workspace):
            workspace = self.workspace.to_dict()
        else:
            workspace = self.workspace

        life_plan: dict[str, Any] | None | Unset
        if isinstance(self.life_plan, Unset):
            life_plan = UNSET
        elif isinstance(self.life_plan, LifePlan):
            life_plan = self.life_plan.to_dict()
        else:
            life_plan = self.life_plan

        active_vision: dict[str, Any] | None | Unset
        if isinstance(self.active_vision, Unset):
            active_vision = UNSET
        elif isinstance(self.active_vision, Vision):
            active_vision = self.active_vision.to_dict()
        else:
            active_vision = self.active_vision

        vacations: list[dict[str, Any]] | None | Unset
        if isinstance(self.vacations, Unset):
            vacations = UNSET
        elif isinstance(self.vacations, list):
            vacations = []
            for vacations_type_0_item_data in self.vacations:
                vacations_type_0_item = vacations_type_0_item_data.to_dict()
                vacations.append(vacations_type_0_item)

        else:
            vacations = self.vacations

        schedule_streams: list[dict[str, Any]] | None | Unset
        if isinstance(self.schedule_streams, Unset):
            schedule_streams = UNSET
        elif isinstance(self.schedule_streams, list):
            schedule_streams = []
            for schedule_streams_type_0_item_data in self.schedule_streams:
                schedule_streams_type_0_item = schedule_streams_type_0_item_data.to_dict()
                schedule_streams.append(schedule_streams_type_0_item)

        else:
            schedule_streams = self.schedule_streams

        root_aspect: dict[str, Any] | None | Unset
        if isinstance(self.root_aspect, Unset):
            root_aspect = UNSET
        elif isinstance(self.root_aspect, AspectSummary):
            root_aspect = self.root_aspect.to_dict()
        else:
            root_aspect = self.root_aspect

        aspects: list[dict[str, Any]] | None | Unset
        if isinstance(self.aspects, Unset):
            aspects = UNSET
        elif isinstance(self.aspects, list):
            aspects = []
            for aspects_type_0_item_data in self.aspects:
                aspects_type_0_item = aspects_type_0_item_data.to_dict()
                aspects.append(aspects_type_0_item)

        else:
            aspects = self.aspects

        chapters: list[dict[str, Any]] | None | Unset
        if isinstance(self.chapters, Unset):
            chapters = UNSET
        elif isinstance(self.chapters, list):
            chapters = []
            for chapters_type_0_item_data in self.chapters:
                chapters_type_0_item = chapters_type_0_item_data.to_dict()
                chapters.append(chapters_type_0_item)

        else:
            chapters = self.chapters

        goals: list[dict[str, Any]] | None | Unset
        if isinstance(self.goals, Unset):
            goals = UNSET
        elif isinstance(self.goals, list):
            goals = []
            for goals_type_0_item_data in self.goals:
                goals_type_0_item = goals_type_0_item_data.to_dict()
                goals.append(goals_type_0_item)

        else:
            goals = self.goals

        milestones: list[dict[str, Any]] | None | Unset
        if isinstance(self.milestones, Unset):
            milestones = UNSET
        elif isinstance(self.milestones, list):
            milestones = []
            for milestones_type_0_item_data in self.milestones:
                milestones_type_0_item = milestones_type_0_item_data.to_dict()
                milestones.append(milestones_type_0_item)

        else:
            milestones = self.milestones

        inbox_tasks: list[dict[str, Any]] | None | Unset
        if isinstance(self.inbox_tasks, Unset):
            inbox_tasks = UNSET
        elif isinstance(self.inbox_tasks, list):
            inbox_tasks = []
            for inbox_tasks_type_0_item_data in self.inbox_tasks:
                inbox_tasks_type_0_item = inbox_tasks_type_0_item_data.to_dict()
                inbox_tasks.append(inbox_tasks_type_0_item)

        else:
            inbox_tasks = self.inbox_tasks

        journals_last_year: list[dict[str, Any]] | None | Unset
        if isinstance(self.journals_last_year, Unset):
            journals_last_year = UNSET
        elif isinstance(self.journals_last_year, list):
            journals_last_year = []
            for journals_last_year_type_0_item_data in self.journals_last_year:
                journals_last_year_type_0_item = journals_last_year_type_0_item_data.to_dict()
                journals_last_year.append(journals_last_year_type_0_item)

        else:
            journals_last_year = self.journals_last_year

        habits: list[dict[str, Any]] | None | Unset
        if isinstance(self.habits, Unset):
            habits = UNSET
        elif isinstance(self.habits, list):
            habits = []
            for habits_type_0_item_data in self.habits:
                habits_type_0_item = habits_type_0_item_data.to_dict()
                habits.append(habits_type_0_item)

        else:
            habits = self.habits

        chores: list[dict[str, Any]] | None | Unset
        if isinstance(self.chores, Unset):
            chores = UNSET
        elif isinstance(self.chores, list):
            chores = []
            for chores_type_0_item_data in self.chores:
                chores_type_0_item = chores_type_0_item_data.to_dict()
                chores.append(chores_type_0_item)

        else:
            chores = self.chores

        big_plans: list[dict[str, Any]] | None | Unset
        if isinstance(self.big_plans, Unset):
            big_plans = UNSET
        elif isinstance(self.big_plans, list):
            big_plans = []
            for big_plans_type_0_item_data in self.big_plans:
                big_plans_type_0_item = big_plans_type_0_item_data.to_dict()
                big_plans.append(big_plans_type_0_item)

        else:
            big_plans = self.big_plans

        smart_lists: list[dict[str, Any]] | None | Unset
        if isinstance(self.smart_lists, Unset):
            smart_lists = UNSET
        elif isinstance(self.smart_lists, list):
            smart_lists = []
            for smart_lists_type_0_item_data in self.smart_lists:
                smart_lists_type_0_item = smart_lists_type_0_item_data.to_dict()
                smart_lists.append(smart_lists_type_0_item)

        else:
            smart_lists = self.smart_lists

        metrics: list[dict[str, Any]] | None | Unset
        if isinstance(self.metrics, Unset):
            metrics = UNSET
        elif isinstance(self.metrics, list):
            metrics = []
            for metrics_type_0_item_data in self.metrics:
                metrics_type_0_item = metrics_type_0_item_data.to_dict()
                metrics.append(metrics_type_0_item)

        else:
            metrics = self.metrics

        persons: list[dict[str, Any]] | None | Unset
        if isinstance(self.persons, Unset):
            persons = UNSET
        elif isinstance(self.persons, list):
            persons = []
            for persons_type_0_item_data in self.persons:
                persons_type_0_item = persons_type_0_item_data.to_dict()
                persons.append(persons_type_0_item)

        else:
            persons = self.persons

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if user is not UNSET:
            field_dict["user"] = user
        if workspace is not UNSET:
            field_dict["workspace"] = workspace
        if life_plan is not UNSET:
            field_dict["life_plan"] = life_plan
        if active_vision is not UNSET:
            field_dict["active_vision"] = active_vision
        if vacations is not UNSET:
            field_dict["vacations"] = vacations
        if schedule_streams is not UNSET:
            field_dict["schedule_streams"] = schedule_streams
        if root_aspect is not UNSET:
            field_dict["root_aspect"] = root_aspect
        if aspects is not UNSET:
            field_dict["aspects"] = aspects
        if chapters is not UNSET:
            field_dict["chapters"] = chapters
        if goals is not UNSET:
            field_dict["goals"] = goals
        if milestones is not UNSET:
            field_dict["milestones"] = milestones
        if inbox_tasks is not UNSET:
            field_dict["inbox_tasks"] = inbox_tasks
        if journals_last_year is not UNSET:
            field_dict["journals_last_year"] = journals_last_year
        if habits is not UNSET:
            field_dict["habits"] = habits
        if chores is not UNSET:
            field_dict["chores"] = chores
        if big_plans is not UNSET:
            field_dict["big_plans"] = big_plans
        if smart_lists is not UNSET:
            field_dict["smart_lists"] = smart_lists
        if metrics is not UNSET:
            field_dict["metrics"] = metrics
        if persons is not UNSET:
            field_dict["persons"] = persons

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect_summary import AspectSummary
        from ..models.big_plan_summary import BigPlanSummary
        from ..models.chapter_summary import ChapterSummary
        from ..models.chore_summary import ChoreSummary
        from ..models.goal_summary import GoalSummary
        from ..models.habit_summary import HabitSummary
        from ..models.inbox_task_summary import InboxTaskSummary
        from ..models.journal_summary import JournalSummary
        from ..models.life_plan import LifePlan
        from ..models.metric_summary import MetricSummary
        from ..models.milestone_summary import MilestoneSummary
        from ..models.person_summary import PersonSummary
        from ..models.schedule_stream_summary import ScheduleStreamSummary
        from ..models.smart_list_summary import SmartListSummary
        from ..models.user import User
        from ..models.vacation_summary import VacationSummary
        from ..models.vision import Vision
        from ..models.workspace import Workspace

        d = dict(src_dict)

        def _parse_user(data: object) -> None | Unset | User:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                user_type_0 = User.from_dict(data)

                return user_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Unset | User, data)

        user = _parse_user(d.pop("user", UNSET))

        def _parse_workspace(data: object) -> None | Unset | Workspace:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                workspace_type_0 = Workspace.from_dict(data)

                return workspace_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Unset | Workspace, data)

        workspace = _parse_workspace(d.pop("workspace", UNSET))

        def _parse_life_plan(data: object) -> LifePlan | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                life_plan_type_0 = LifePlan.from_dict(data)

                return life_plan_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(LifePlan | None | Unset, data)

        life_plan = _parse_life_plan(d.pop("life_plan", UNSET))

        def _parse_active_vision(data: object) -> None | Unset | Vision:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                active_vision_type_0 = Vision.from_dict(data)

                return active_vision_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Unset | Vision, data)

        active_vision = _parse_active_vision(d.pop("active_vision", UNSET))

        def _parse_vacations(data: object) -> list[VacationSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                vacations_type_0 = []
                _vacations_type_0 = data
                for vacations_type_0_item_data in _vacations_type_0:
                    vacations_type_0_item = VacationSummary.from_dict(vacations_type_0_item_data)

                    vacations_type_0.append(vacations_type_0_item)

                return vacations_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[VacationSummary] | None | Unset, data)

        vacations = _parse_vacations(d.pop("vacations", UNSET))

        def _parse_schedule_streams(data: object) -> list[ScheduleStreamSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                schedule_streams_type_0 = []
                _schedule_streams_type_0 = data
                for schedule_streams_type_0_item_data in _schedule_streams_type_0:
                    schedule_streams_type_0_item = ScheduleStreamSummary.from_dict(schedule_streams_type_0_item_data)

                    schedule_streams_type_0.append(schedule_streams_type_0_item)

                return schedule_streams_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[ScheduleStreamSummary] | None | Unset, data)

        schedule_streams = _parse_schedule_streams(d.pop("schedule_streams", UNSET))

        def _parse_root_aspect(data: object) -> AspectSummary | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                root_aspect_type_0 = AspectSummary.from_dict(data)

                return root_aspect_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(AspectSummary | None | Unset, data)

        root_aspect = _parse_root_aspect(d.pop("root_aspect", UNSET))

        def _parse_aspects(data: object) -> list[AspectSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                aspects_type_0 = []
                _aspects_type_0 = data
                for aspects_type_0_item_data in _aspects_type_0:
                    aspects_type_0_item = AspectSummary.from_dict(aspects_type_0_item_data)

                    aspects_type_0.append(aspects_type_0_item)

                return aspects_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[AspectSummary] | None | Unset, data)

        aspects = _parse_aspects(d.pop("aspects", UNSET))

        def _parse_chapters(data: object) -> list[ChapterSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                chapters_type_0 = []
                _chapters_type_0 = data
                for chapters_type_0_item_data in _chapters_type_0:
                    chapters_type_0_item = ChapterSummary.from_dict(chapters_type_0_item_data)

                    chapters_type_0.append(chapters_type_0_item)

                return chapters_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[ChapterSummary] | None | Unset, data)

        chapters = _parse_chapters(d.pop("chapters", UNSET))

        def _parse_goals(data: object) -> list[GoalSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                goals_type_0 = []
                _goals_type_0 = data
                for goals_type_0_item_data in _goals_type_0:
                    goals_type_0_item = GoalSummary.from_dict(goals_type_0_item_data)

                    goals_type_0.append(goals_type_0_item)

                return goals_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[GoalSummary] | None | Unset, data)

        goals = _parse_goals(d.pop("goals", UNSET))

        def _parse_milestones(data: object) -> list[MilestoneSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                milestones_type_0 = []
                _milestones_type_0 = data
                for milestones_type_0_item_data in _milestones_type_0:
                    milestones_type_0_item = MilestoneSummary.from_dict(milestones_type_0_item_data)

                    milestones_type_0.append(milestones_type_0_item)

                return milestones_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[MilestoneSummary] | None | Unset, data)

        milestones = _parse_milestones(d.pop("milestones", UNSET))

        def _parse_inbox_tasks(data: object) -> list[InboxTaskSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                inbox_tasks_type_0 = []
                _inbox_tasks_type_0 = data
                for inbox_tasks_type_0_item_data in _inbox_tasks_type_0:
                    inbox_tasks_type_0_item = InboxTaskSummary.from_dict(inbox_tasks_type_0_item_data)

                    inbox_tasks_type_0.append(inbox_tasks_type_0_item)

                return inbox_tasks_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[InboxTaskSummary] | None | Unset, data)

        inbox_tasks = _parse_inbox_tasks(d.pop("inbox_tasks", UNSET))

        def _parse_journals_last_year(data: object) -> list[JournalSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                journals_last_year_type_0 = []
                _journals_last_year_type_0 = data
                for journals_last_year_type_0_item_data in _journals_last_year_type_0:
                    journals_last_year_type_0_item = JournalSummary.from_dict(journals_last_year_type_0_item_data)

                    journals_last_year_type_0.append(journals_last_year_type_0_item)

                return journals_last_year_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[JournalSummary] | None | Unset, data)

        journals_last_year = _parse_journals_last_year(d.pop("journals_last_year", UNSET))

        def _parse_habits(data: object) -> list[HabitSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                habits_type_0 = []
                _habits_type_0 = data
                for habits_type_0_item_data in _habits_type_0:
                    habits_type_0_item = HabitSummary.from_dict(habits_type_0_item_data)

                    habits_type_0.append(habits_type_0_item)

                return habits_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[HabitSummary] | None | Unset, data)

        habits = _parse_habits(d.pop("habits", UNSET))

        def _parse_chores(data: object) -> list[ChoreSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                chores_type_0 = []
                _chores_type_0 = data
                for chores_type_0_item_data in _chores_type_0:
                    chores_type_0_item = ChoreSummary.from_dict(chores_type_0_item_data)

                    chores_type_0.append(chores_type_0_item)

                return chores_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[ChoreSummary] | None | Unset, data)

        chores = _parse_chores(d.pop("chores", UNSET))

        def _parse_big_plans(data: object) -> list[BigPlanSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                big_plans_type_0 = []
                _big_plans_type_0 = data
                for big_plans_type_0_item_data in _big_plans_type_0:
                    big_plans_type_0_item = BigPlanSummary.from_dict(big_plans_type_0_item_data)

                    big_plans_type_0.append(big_plans_type_0_item)

                return big_plans_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[BigPlanSummary] | None | Unset, data)

        big_plans = _parse_big_plans(d.pop("big_plans", UNSET))

        def _parse_smart_lists(data: object) -> list[SmartListSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                smart_lists_type_0 = []
                _smart_lists_type_0 = data
                for smart_lists_type_0_item_data in _smart_lists_type_0:
                    smart_lists_type_0_item = SmartListSummary.from_dict(smart_lists_type_0_item_data)

                    smart_lists_type_0.append(smart_lists_type_0_item)

                return smart_lists_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[SmartListSummary] | None | Unset, data)

        smart_lists = _parse_smart_lists(d.pop("smart_lists", UNSET))

        def _parse_metrics(data: object) -> list[MetricSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                metrics_type_0 = []
                _metrics_type_0 = data
                for metrics_type_0_item_data in _metrics_type_0:
                    metrics_type_0_item = MetricSummary.from_dict(metrics_type_0_item_data)

                    metrics_type_0.append(metrics_type_0_item)

                return metrics_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[MetricSummary] | None | Unset, data)

        metrics = _parse_metrics(d.pop("metrics", UNSET))

        def _parse_persons(data: object) -> list[PersonSummary] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                persons_type_0 = []
                _persons_type_0 = data
                for persons_type_0_item_data in _persons_type_0:
                    persons_type_0_item = PersonSummary.from_dict(persons_type_0_item_data)

                    persons_type_0.append(persons_type_0_item)

                return persons_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[PersonSummary] | None | Unset, data)

        persons = _parse_persons(d.pop("persons", UNSET))

        get_summaries_result = cls(
            user=user,
            workspace=workspace,
            life_plan=life_plan,
            active_vision=active_vision,
            vacations=vacations,
            schedule_streams=schedule_streams,
            root_aspect=root_aspect,
            aspects=aspects,
            chapters=chapters,
            goals=goals,
            milestones=milestones,
            inbox_tasks=inbox_tasks,
            journals_last_year=journals_last_year,
            habits=habits,
            chores=chores,
            big_plans=big_plans,
            smart_lists=smart_lists,
            metrics=metrics,
            persons=persons,
        )

        get_summaries_result.additional_properties = d
        return get_summaries_result

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
