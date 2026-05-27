"""Common OpenAPI schema definitions."""

from typing import Any

OPENAPI_ERROR_RESPONSES: dict[str, Any] = {  # type: ignore[explicit-any]
    "ErrorResponse": {
        "title": "ErrorResponse",
        "type": "object",
        "required": ["reason", "detail"],
        "properties": {
            "reason": {"type": "string"},
            "detail": {
                "oneOf": [
                    {"type": "string"},
                    {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ErrorDetailItem"},
                    },
                ]
            },
        },
        "additionalProperties": False,
    },
    "ErrorDetailItem": {
        "title": "ErrorDetailItem",
        "type": "object",
        "required": ["loc", "msg", "type"],
        "properties": {
            "loc": {"type": "array", "items": {"type": "string"}},
            "msg": {"type": "string"},
            "type": {"type": "string"},
        },
        "additionalProperties": False,
    },
}
