from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.note import Note
    from ..models.publish_entity import PublishEntity
    from ..models.working_mem import WorkingMem


T = TypeVar("T", bound="WorkingMemLoadCurrentEntry")


@_attrs_define
class WorkingMemLoadCurrentEntry:
    """Working mem load current entry.

    Attributes:
        working_mem (WorkingMem): An entry in the working_mem.txt system.
        note (Note): A note in the notebook.
        publish_entity (None | PublishEntity | Unset):
    """

    working_mem: WorkingMem
    note: Note
    publish_entity: None | PublishEntity | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.publish_entity import PublishEntity

        working_mem = self.working_mem.to_dict()

        note = self.note.to_dict()

        publish_entity: dict[str, Any] | None | Unset
        if isinstance(self.publish_entity, Unset):
            publish_entity = UNSET
        elif isinstance(self.publish_entity, PublishEntity):
            publish_entity = self.publish_entity.to_dict()
        else:
            publish_entity = self.publish_entity

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "working_mem": working_mem,
                "note": note,
            }
        )
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.note import Note
        from ..models.publish_entity import PublishEntity
        from ..models.working_mem import WorkingMem

        d = dict(src_dict)
        working_mem = WorkingMem.from_dict(d.pop("working_mem"))

        note = Note.from_dict(d.pop("note"))

        def _parse_publish_entity(data: object) -> None | PublishEntity | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                publish_entity_type_0 = PublishEntity.from_dict(data)

                return publish_entity_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | PublishEntity | Unset, data)

        publish_entity = _parse_publish_entity(d.pop("publish_entity", UNSET))

        working_mem_load_current_entry = cls(
            working_mem=working_mem,
            note=note,
            publish_entity=publish_entity,
        )

        working_mem_load_current_entry.additional_properties = d
        return working_mem_load_current_entry

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
