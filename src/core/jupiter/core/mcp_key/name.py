"""The name of an MCP key."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class MCPKeyName(EntityName):
    """The name of an MCP key."""
