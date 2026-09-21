from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.big_plan import BigPlan
    from ..models.big_plan_milestone import BigPlanMilestone
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock


T = TypeVar("T", bound="BigPlanMilestoneEntry")


@_attrs_define
class BigPlanMilestoneEntry:
    """Result entry.

    Attributes:
        big_plan_milestone (BigPlanMilestone): A milestone for tracking progress of a big plan.
        big_plan (BigPlan): A big plan.
        time_event (TimeEventFullDaysBlock): A full day block of time.
    """

    big_plan_milestone: BigPlanMilestone
    big_plan: BigPlan
    time_event: TimeEventFullDaysBlock
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        big_plan_milestone = self.big_plan_milestone.to_dict()

        big_plan = self.big_plan.to_dict()

        time_event = self.time_event.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "big_plan_milestone": big_plan_milestone,
                "big_plan": big_plan,
                "time_event": time_event,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.big_plan import BigPlan  # noqa: PLC0415
        from ..models.big_plan_milestone import BigPlanMilestone  # noqa: PLC0415
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock  # noqa: PLC0415

        d = dict(src_dict)
        big_plan_milestone = BigPlanMilestone.from_dict(d.pop("big_plan_milestone"))

        big_plan = BigPlan.from_dict(d.pop("big_plan"))

        time_event = TimeEventFullDaysBlock.from_dict(d.pop("time_event"))

        big_plan_milestone_entry = cls(
            big_plan_milestone=big_plan_milestone,
            big_plan=big_plan,
            time_event=time_event,
        )

        big_plan_milestone_entry.additional_properties = d
        return big_plan_milestone_entry

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
