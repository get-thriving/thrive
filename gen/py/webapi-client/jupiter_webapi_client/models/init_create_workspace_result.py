from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.workspace import Workspace


T = TypeVar("T", bound="InitCreateWorkspaceResult")


@_attrs_define
class InitCreateWorkspaceResult:
    """Init create workspace use case result.

    Attributes:
        new_workspace (Workspace): The workspace where everything happens.
        recovery_token (None | str | Unset):
    """

    new_workspace: Workspace
    recovery_token: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_workspace = self.new_workspace.to_dict()

        recovery_token: None | str | Unset
        if isinstance(self.recovery_token, Unset):
            recovery_token = UNSET
        else:
            recovery_token = self.recovery_token

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_workspace": new_workspace,
            }
        )
        if recovery_token is not UNSET:
            field_dict["recovery_token"] = recovery_token

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.workspace import Workspace

        d = dict(src_dict)
        new_workspace = Workspace.from_dict(d.pop("new_workspace"))

        def _parse_recovery_token(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        recovery_token = _parse_recovery_token(d.pop("recovery_token", UNSET))

        init_create_workspace_result = cls(
            new_workspace=new_workspace,
            recovery_token=recovery_token,
        )

        init_create_workspace_result.additional_properties = d
        return init_create_workspace_result

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
