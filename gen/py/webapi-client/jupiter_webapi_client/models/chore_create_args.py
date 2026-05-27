from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.difficulty import Difficulty
from ..models.eisen import Eisen
from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

T = TypeVar("T", bound="ChoreCreateArgs")


@_attrs_define
class ChoreCreateArgs:
    """ChoreCreate args.

    Attributes:
        name (str): The chore name.
        period (RecurringTaskPeriod): A period for a particular task.
        is_key (bool):
        eisen (Eisen): The Eisenhower status of a particular task.
        difficulty (Difficulty): The difficulty of a particular task.
        must_do (bool):
        aspect_ref_id (None | str | Unset):
        chapter_ref_id (None | str | Unset):
        goal_ref_id (None | str | Unset):
        actionable_from_day (int | None | Unset):
        actionable_from_month (int | None | Unset):
        due_at_day (int | None | Unset):
        due_at_month (int | None | Unset):
        skip_rule (None | str | Unset):
        start_at_date (None | str | Unset):
        end_at_date (None | str | Unset):
    """

    name: str
    period: RecurringTaskPeriod
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    must_do: bool
    aspect_ref_id: None | str | Unset = UNSET
    chapter_ref_id: None | str | Unset = UNSET
    goal_ref_id: None | str | Unset = UNSET
    actionable_from_day: int | None | Unset = UNSET
    actionable_from_month: int | None | Unset = UNSET
    due_at_day: int | None | Unset = UNSET
    due_at_month: int | None | Unset = UNSET
    skip_rule: None | str | Unset = UNSET
    start_at_date: None | str | Unset = UNSET
    end_at_date: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        name = self.name

        period = self.period.value

        is_key = self.is_key

        eisen = self.eisen.value

        difficulty = self.difficulty.value

        must_do = self.must_do

        aspect_ref_id: None | str | Unset
        if isinstance(self.aspect_ref_id, Unset):
            aspect_ref_id = UNSET
        else:
            aspect_ref_id = self.aspect_ref_id

        chapter_ref_id: None | str | Unset
        if isinstance(self.chapter_ref_id, Unset):
            chapter_ref_id = UNSET
        else:
            chapter_ref_id = self.chapter_ref_id

        goal_ref_id: None | str | Unset
        if isinstance(self.goal_ref_id, Unset):
            goal_ref_id = UNSET
        else:
            goal_ref_id = self.goal_ref_id

        actionable_from_day: int | None | Unset
        if isinstance(self.actionable_from_day, Unset):
            actionable_from_day = UNSET
        else:
            actionable_from_day = self.actionable_from_day

        actionable_from_month: int | None | Unset
        if isinstance(self.actionable_from_month, Unset):
            actionable_from_month = UNSET
        else:
            actionable_from_month = self.actionable_from_month

        due_at_day: int | None | Unset
        if isinstance(self.due_at_day, Unset):
            due_at_day = UNSET
        else:
            due_at_day = self.due_at_day

        due_at_month: int | None | Unset
        if isinstance(self.due_at_month, Unset):
            due_at_month = UNSET
        else:
            due_at_month = self.due_at_month

        skip_rule: None | str | Unset
        if isinstance(self.skip_rule, Unset):
            skip_rule = UNSET
        else:
            skip_rule = self.skip_rule

        start_at_date: None | str | Unset
        if isinstance(self.start_at_date, Unset):
            start_at_date = UNSET
        else:
            start_at_date = self.start_at_date

        end_at_date: None | str | Unset
        if isinstance(self.end_at_date, Unset):
            end_at_date = UNSET
        else:
            end_at_date = self.end_at_date

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "period": period,
                "is_key": is_key,
                "eisen": eisen,
                "difficulty": difficulty,
                "must_do": must_do,
            }
        )
        if aspect_ref_id is not UNSET:
            field_dict["aspect_ref_id"] = aspect_ref_id
        if chapter_ref_id is not UNSET:
            field_dict["chapter_ref_id"] = chapter_ref_id
        if goal_ref_id is not UNSET:
            field_dict["goal_ref_id"] = goal_ref_id
        if actionable_from_day is not UNSET:
            field_dict["actionable_from_day"] = actionable_from_day
        if actionable_from_month is not UNSET:
            field_dict["actionable_from_month"] = actionable_from_month
        if due_at_day is not UNSET:
            field_dict["due_at_day"] = due_at_day
        if due_at_month is not UNSET:
            field_dict["due_at_month"] = due_at_month
        if skip_rule is not UNSET:
            field_dict["skip_rule"] = skip_rule
        if start_at_date is not UNSET:
            field_dict["start_at_date"] = start_at_date
        if end_at_date is not UNSET:
            field_dict["end_at_date"] = end_at_date

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        name = d.pop("name")

        period = RecurringTaskPeriod(d.pop("period"))

        is_key = d.pop("is_key")

        eisen = Eisen(d.pop("eisen"))

        difficulty = Difficulty(d.pop("difficulty"))

        must_do = d.pop("must_do")

        def _parse_aspect_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        aspect_ref_id = _parse_aspect_ref_id(d.pop("aspect_ref_id", UNSET))

        def _parse_chapter_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        chapter_ref_id = _parse_chapter_ref_id(d.pop("chapter_ref_id", UNSET))

        def _parse_goal_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        goal_ref_id = _parse_goal_ref_id(d.pop("goal_ref_id", UNSET))

        def _parse_actionable_from_day(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        actionable_from_day = _parse_actionable_from_day(d.pop("actionable_from_day", UNSET))

        def _parse_actionable_from_month(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        actionable_from_month = _parse_actionable_from_month(d.pop("actionable_from_month", UNSET))

        def _parse_due_at_day(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        due_at_day = _parse_due_at_day(d.pop("due_at_day", UNSET))

        def _parse_due_at_month(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        due_at_month = _parse_due_at_month(d.pop("due_at_month", UNSET))

        def _parse_skip_rule(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        skip_rule = _parse_skip_rule(d.pop("skip_rule", UNSET))

        def _parse_start_at_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        start_at_date = _parse_start_at_date(d.pop("start_at_date", UNSET))

        def _parse_end_at_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        end_at_date = _parse_end_at_date(d.pop("end_at_date", UNSET))

        chore_create_args = cls(
            name=name,
            period=period,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            must_do=must_do,
            aspect_ref_id=aspect_ref_id,
            chapter_ref_id=chapter_ref_id,
            goal_ref_id=goal_ref_id,
            actionable_from_day=actionable_from_day,
            actionable_from_month=actionable_from_month,
            due_at_day=due_at_day,
            due_at_month=due_at_month,
            skip_rule=skip_rule,
            start_at_date=start_at_date,
            end_at_date=end_at_date,
        )

        chore_create_args.additional_properties = d
        return chore_create_args

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
