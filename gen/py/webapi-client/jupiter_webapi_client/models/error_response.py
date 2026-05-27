from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define

if TYPE_CHECKING:
    from ..models.error_detail_item import ErrorDetailItem


T = TypeVar("T", bound="ErrorResponse")


@_attrs_define
class ErrorResponse:
    """
    Attributes:
        reason (str):
        detail (list[ErrorDetailItem] | str):
    """

    reason: str
    detail: list[ErrorDetailItem] | str

    def to_dict(self) -> dict[str, Any]:
        reason = self.reason

        detail: list[dict[str, Any]] | str
        if isinstance(self.detail, list):
            detail = []
            for detail_type_1_item_data in self.detail:
                detail_type_1_item = detail_type_1_item_data.to_dict()
                detail.append(detail_type_1_item)

        else:
            detail = self.detail

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "reason": reason,
                "detail": detail,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.error_detail_item import ErrorDetailItem

        d = dict(src_dict)
        reason = d.pop("reason")

        def _parse_detail(data: object) -> list[ErrorDetailItem] | str:
            try:
                if not isinstance(data, list):
                    raise TypeError()
                detail_type_1 = []
                _detail_type_1 = data
                for detail_type_1_item_data in _detail_type_1:
                    detail_type_1_item = ErrorDetailItem.from_dict(detail_type_1_item_data)

                    detail_type_1.append(detail_type_1_item)

                return detail_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[ErrorDetailItem] | str, data)

        detail = _parse_detail(d.pop("detail"))

        error_response = cls(
            reason=reason,
            detail=detail,
        )

        return error_response
