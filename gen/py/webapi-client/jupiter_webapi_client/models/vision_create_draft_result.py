from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.note import Note
    from ..models.vision import Vision


T = TypeVar("T", bound="VisionCreateDraftResult")


@_attrs_define
class VisionCreateDraftResult:
    """VisionCreateDraft result.

    Attributes:
        vision (Vision): A vision in a life plan.
        note (Note): A note in the notebook.
    """

    vision: Vision
    note: Note
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        vision = self.vision.to_dict()

        note = self.note.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "vision": vision,
                "note": note,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.note import Note
        from ..models.vision import Vision

        d = dict(src_dict)
        vision = Vision.from_dict(d.pop("vision"))

        note = Note.from_dict(d.pop("note"))

        vision_create_draft_result = cls(
            vision=vision,
            note=note,
        )

        vision_create_draft_result.additional_properties = d
        return vision_create_draft_result

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
