"""Web UI settings for a user."""

from typing import TYPE_CHECKING

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction

if TYPE_CHECKING:
    from jupiter.core.users.root import User


@entity
class WebUiSettings(StubEntity):
    """Web UI settings for a user."""

    user: ParentLink["User"]
    use_night_mode: bool

    @staticmethod
    @create_entity_action
    def new_web_ui_settings(
        ctx: DomainContext,
        user_ref_id: EntityId,
    ) -> "WebUiSettings":
        """Create new web UI settings for a user."""
        return WebUiSettings._create(
            ctx,
            user=ParentLink(user_ref_id),
            use_night_mode=False,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        use_night_mode: UpdateAction[bool],
    ) -> "WebUiSettings":
        """Update the web UI settings."""
        return self._new_version(
            ctx,
            use_night_mode=use_night_mode.or_else(self.use_night_mode),
        )
