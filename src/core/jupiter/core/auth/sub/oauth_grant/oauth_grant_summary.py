"""Summary of an OAuth grant, safe for web display."""

from jupiter.core.auth.sub.oauth_grant.client_id import OAuthClientId
from jupiter.core.auth.sub.oauth_grant.oauth_grant_status import OAuthGrantStatus
from jupiter.core.common.system_url import SystemUrl
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.value import CompositeValue, value


@value
class OAuthGrantSummary(CompositeValue):
    """Summary of an OAuth grant, safe for web display."""

    ref_id: EntityId
    client_id: OAuthClientId
    redirect_uri: SystemUrl
    status: OAuthGrantStatus
    created_time: Timestamp
    refresh_issued_time: Timestamp | None
    expires_time: Timestamp | None
    archived: bool
