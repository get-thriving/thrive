from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.workspace_feature import WorkspaceFeature

T = TypeVar("T", bound="InitCreateWorkspaceArgs")


@_attrs_define
class InitCreateWorkspaceArgs:
    """Init create workspace use case arguments.

    Attributes:
        user_id (str): A generic entity id.
        timezone (str): A timezone in this domain.
        birthday (str): The birthday of a person.
        birth_year (int): The birth year of a person.
        name (str): The workspace name.
        first_schedule_stream_name (str): The name of a schedule stream.
        root_aspect_name (str): The aspect name.
        feature_flags (list[WorkspaceFeature]):
    """

    user_id: str
    timezone: str
    birthday: str
    birth_year: int
    name: str
    first_schedule_stream_name: str
    root_aspect_name: str
    feature_flags: list[WorkspaceFeature]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        user_id = self.user_id

        timezone = self.timezone

        birthday = self.birthday

        birth_year = self.birth_year

        name = self.name

        first_schedule_stream_name = self.first_schedule_stream_name

        root_aspect_name = self.root_aspect_name

        feature_flags = []
        for feature_flags_item_data in self.feature_flags:
            feature_flags_item = feature_flags_item_data.value
            feature_flags.append(feature_flags_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "user_id": user_id,
                "timezone": timezone,
                "birthday": birthday,
                "birth_year": birth_year,
                "name": name,
                "first_schedule_stream_name": first_schedule_stream_name,
                "root_aspect_name": root_aspect_name,
                "feature_flags": feature_flags,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        user_id = d.pop("user_id")

        timezone = d.pop("timezone")

        birthday = d.pop("birthday")

        birth_year = d.pop("birth_year")

        name = d.pop("name")

        first_schedule_stream_name = d.pop("first_schedule_stream_name")

        root_aspect_name = d.pop("root_aspect_name")

        feature_flags = []
        _feature_flags = d.pop("feature_flags")
        for feature_flags_item_data in _feature_flags:
            feature_flags_item = WorkspaceFeature(feature_flags_item_data)

            feature_flags.append(feature_flags_item)

        init_create_workspace_args = cls(
            user_id=user_id,
            timezone=timezone,
            birthday=birthday,
            birth_year=birth_year,
            name=name,
            first_schedule_stream_name=first_schedule_stream_name,
            root_aspect_name=root_aspect_name,
            feature_flags=feature_flags,
        )

        init_create_workspace_args.additional_properties = d
        return init_create_workspace_args

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
