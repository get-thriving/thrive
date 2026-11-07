"""Web UI settings for a user."""

from jupiter.core.users.sub.web_ui_settings.ui_style import UiStyle
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


@entity("User")
class WebUiSettings(StubEntity):
    """Web UI settings for a user."""

    user: ParentLink
    use_night_mode: bool
    ui_style: UiStyle
    use_expanded_rail: bool

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
            ui_style=UiStyle.CLASSIC,
            use_expanded_rail=False,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        use_night_mode: UpdateAction[bool],
        ui_style: UpdateAction[UiStyle],
        use_expanded_rail: UpdateAction[bool],
    ) -> "WebUiSettings":
        """Update the web UI settings."""
        return self._new_version(
            ctx,
            use_night_mode=use_night_mode.or_else(self.use_night_mode),
            ui_style=ui_style.or_else(self.ui_style),
            use_expanded_rail=use_expanded_rail.or_else(self.use_expanded_rail),
        )
