from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.difficulty import Difficulty
from ..models.eisen import Eisen
from ..models.recurring_task_period import RecurringTaskPeriod
from ..models.schedulability import Schedulability
from ..types import UNSET, Unset

T = TypeVar("T", bound="PersonCreateArgs")


@_attrs_define
class PersonCreateArgs:
    """Person create args..

    Attributes:
        name (str): The name of a contact.
        catch_up_period (None | RecurringTaskPeriod | Unset):
        catch_up_eisen (Eisen | None | Unset):
        catch_up_difficulty (Difficulty | None | Unset):
        catch_up_actionable_from_day (int | None | Unset):
        catch_up_actionable_from_month (int | None | Unset):
        catch_up_due_at_day (int | None | Unset):
        catch_up_due_at_month (int | None | Unset):
        schedulability (None | Schedulability | Unset):
        scheduling_event_duration_mins (int | None | Unset):
        scheduling_event_count (int | None | Unset):
        circle_ref_ids (list[str] | None | Unset):
    """

    name: str
    catch_up_period: None | RecurringTaskPeriod | Unset = UNSET
    catch_up_eisen: Eisen | None | Unset = UNSET
    catch_up_difficulty: Difficulty | None | Unset = UNSET
    catch_up_actionable_from_day: int | None | Unset = UNSET
    catch_up_actionable_from_month: int | None | Unset = UNSET
    catch_up_due_at_day: int | None | Unset = UNSET
    catch_up_due_at_month: int | None | Unset = UNSET
    schedulability: None | Schedulability | Unset = UNSET
    scheduling_event_duration_mins: int | None | Unset = UNSET
    scheduling_event_count: int | None | Unset = UNSET
    circle_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        name = self.name

        catch_up_period: None | str | Unset
        if isinstance(self.catch_up_period, Unset):
            catch_up_period = UNSET
        elif isinstance(self.catch_up_period, RecurringTaskPeriod):
            catch_up_period = self.catch_up_period.value
        else:
            catch_up_period = self.catch_up_period

        catch_up_eisen: None | str | Unset
        if isinstance(self.catch_up_eisen, Unset):
            catch_up_eisen = UNSET
        elif isinstance(self.catch_up_eisen, Eisen):
            catch_up_eisen = self.catch_up_eisen.value
        else:
            catch_up_eisen = self.catch_up_eisen

        catch_up_difficulty: None | str | Unset
        if isinstance(self.catch_up_difficulty, Unset):
            catch_up_difficulty = UNSET
        elif isinstance(self.catch_up_difficulty, Difficulty):
            catch_up_difficulty = self.catch_up_difficulty.value
        else:
            catch_up_difficulty = self.catch_up_difficulty

        catch_up_actionable_from_day: int | None | Unset
        if isinstance(self.catch_up_actionable_from_day, Unset):
            catch_up_actionable_from_day = UNSET
        else:
            catch_up_actionable_from_day = self.catch_up_actionable_from_day

        catch_up_actionable_from_month: int | None | Unset
        if isinstance(self.catch_up_actionable_from_month, Unset):
            catch_up_actionable_from_month = UNSET
        else:
            catch_up_actionable_from_month = self.catch_up_actionable_from_month

        catch_up_due_at_day: int | None | Unset
        if isinstance(self.catch_up_due_at_day, Unset):
            catch_up_due_at_day = UNSET
        else:
            catch_up_due_at_day = self.catch_up_due_at_day

        catch_up_due_at_month: int | None | Unset
        if isinstance(self.catch_up_due_at_month, Unset):
            catch_up_due_at_month = UNSET
        else:
            catch_up_due_at_month = self.catch_up_due_at_month

        schedulability: None | str | Unset
        if isinstance(self.schedulability, Unset):
            schedulability = UNSET
        elif isinstance(self.schedulability, Schedulability):
            schedulability = self.schedulability.value
        else:
            schedulability = self.schedulability

        scheduling_event_duration_mins: int | None | Unset
        if isinstance(self.scheduling_event_duration_mins, Unset):
            scheduling_event_duration_mins = UNSET
        else:
            scheduling_event_duration_mins = self.scheduling_event_duration_mins

        scheduling_event_count: int | None | Unset
        if isinstance(self.scheduling_event_count, Unset):
            scheduling_event_count = UNSET
        else:
            scheduling_event_count = self.scheduling_event_count

        circle_ref_ids: list[str] | None | Unset
        if isinstance(self.circle_ref_ids, Unset):
            circle_ref_ids = UNSET
        elif isinstance(self.circle_ref_ids, list):
            circle_ref_ids = self.circle_ref_ids

        else:
            circle_ref_ids = self.circle_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
            }
        )
        if catch_up_period is not UNSET:
            field_dict["catch_up_period"] = catch_up_period
        if catch_up_eisen is not UNSET:
            field_dict["catch_up_eisen"] = catch_up_eisen
        if catch_up_difficulty is not UNSET:
            field_dict["catch_up_difficulty"] = catch_up_difficulty
        if catch_up_actionable_from_day is not UNSET:
            field_dict["catch_up_actionable_from_day"] = catch_up_actionable_from_day
        if catch_up_actionable_from_month is not UNSET:
            field_dict["catch_up_actionable_from_month"] = catch_up_actionable_from_month
        if catch_up_due_at_day is not UNSET:
            field_dict["catch_up_due_at_day"] = catch_up_due_at_day
        if catch_up_due_at_month is not UNSET:
            field_dict["catch_up_due_at_month"] = catch_up_due_at_month
        if schedulability is not UNSET:
            field_dict["schedulability"] = schedulability
        if scheduling_event_duration_mins is not UNSET:
            field_dict["scheduling_event_duration_mins"] = scheduling_event_duration_mins
        if scheduling_event_count is not UNSET:
            field_dict["scheduling_event_count"] = scheduling_event_count
        if circle_ref_ids is not UNSET:
            field_dict["circle_ref_ids"] = circle_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        name = d.pop("name")

        def _parse_catch_up_period(data: object) -> None | RecurringTaskPeriod | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                catch_up_period_type_0 = RecurringTaskPeriod(data)

                return catch_up_period_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | RecurringTaskPeriod | Unset, data)

        catch_up_period = _parse_catch_up_period(d.pop("catch_up_period", UNSET))

        def _parse_catch_up_eisen(data: object) -> Eisen | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                catch_up_eisen_type_0 = Eisen(data)

                return catch_up_eisen_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Eisen | None | Unset, data)

        catch_up_eisen = _parse_catch_up_eisen(d.pop("catch_up_eisen", UNSET))

        def _parse_catch_up_difficulty(data: object) -> Difficulty | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                catch_up_difficulty_type_0 = Difficulty(data)

                return catch_up_difficulty_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Difficulty | None | Unset, data)

        catch_up_difficulty = _parse_catch_up_difficulty(d.pop("catch_up_difficulty", UNSET))

        def _parse_catch_up_actionable_from_day(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        catch_up_actionable_from_day = _parse_catch_up_actionable_from_day(d.pop("catch_up_actionable_from_day", UNSET))

        def _parse_catch_up_actionable_from_month(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        catch_up_actionable_from_month = _parse_catch_up_actionable_from_month(
            d.pop("catch_up_actionable_from_month", UNSET)
        )

        def _parse_catch_up_due_at_day(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        catch_up_due_at_day = _parse_catch_up_due_at_day(d.pop("catch_up_due_at_day", UNSET))

        def _parse_catch_up_due_at_month(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        catch_up_due_at_month = _parse_catch_up_due_at_month(d.pop("catch_up_due_at_month", UNSET))

        def _parse_schedulability(data: object) -> None | Schedulability | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                schedulability_type_0 = Schedulability(data)

                return schedulability_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Schedulability | Unset, data)

        schedulability = _parse_schedulability(d.pop("schedulability", UNSET))

        def _parse_scheduling_event_duration_mins(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        scheduling_event_duration_mins = _parse_scheduling_event_duration_mins(
            d.pop("scheduling_event_duration_mins", UNSET)
        )

        def _parse_scheduling_event_count(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        scheduling_event_count = _parse_scheduling_event_count(d.pop("scheduling_event_count", UNSET))

        def _parse_circle_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                circle_ref_ids_type_0 = cast(list[str], data)

                return circle_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        circle_ref_ids = _parse_circle_ref_ids(d.pop("circle_ref_ids", UNSET))

        person_create_args = cls(
            name=name,
            catch_up_period=catch_up_period,
            catch_up_eisen=catch_up_eisen,
            catch_up_difficulty=catch_up_difficulty,
            catch_up_actionable_from_day=catch_up_actionable_from_day,
            catch_up_actionable_from_month=catch_up_actionable_from_month,
            catch_up_due_at_day=catch_up_due_at_day,
            catch_up_due_at_month=catch_up_due_at_month,
            schedulability=schedulability,
            scheduling_event_duration_mins=scheduling_event_duration_mins,
            scheduling_event_count=scheduling_event_count,
            circle_ref_ids=circle_ref_ids,
        )

        person_create_args.additional_properties = d
        return person_create_args

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
