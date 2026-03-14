"""Summary of an MCP key, safe for web display."""

from jupiter.core.mcp_key.name import MCPKeyName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.value import CompositeValue, value


@value
class MCPKeySummary(CompositeValue):
    """Summary of an MCP key, safe for web display."""

    ref_id: EntityId
    name: MCPKeyName
    last_four_digits: str
    archived: bool
