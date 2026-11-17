"""Web UI settings for a user."""

from jupiter.core.users.sub.web_ui_settings.color_scheme import ColorScheme
from jupiter.core.users.sub.web_ui_settings.default_key_bindings import (
    default_key_bindings,
)
from jupiter.core.users.sub.web_ui_settings.key_binding import KeyBinding
from jupiter.core.users.sub.web_ui_settings.keyboard_action import KeyboardAction
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


@entity("User")
class WebUiSettings(StubEntity):
    """Web UI settings for a user."""

    user: ParentLink
    color_scheme: ColorScheme
    use_expanded_rail: bool
    key_bindings: dict[KeyboardAction, KeyBinding]

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
            color_scheme=ColorScheme.SYSTEM,
            use_expanded_rail=False,
            key_bindings=default_key_bindings(),
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        color_scheme: UpdateAction[ColorScheme],
        use_expanded_rail: UpdateAction[bool],
        key_bindings: UpdateAction[dict[KeyboardAction, KeyBinding]],
    ) -> "WebUiSettings":
        """Update the web UI settings.

        The key bindings are given whole: one for every keyboard action, and no
        two actions on the same key.
        """
        final_key_bindings = key_bindings.or_else(self.key_bindings)
        if key_bindings.should_change:
            self._check_key_bindings(final_key_bindings)
        return self._new_version(
            ctx,
            color_scheme=color_scheme.or_else(self.color_scheme),
            use_expanded_rail=use_expanded_rail.or_else(self.use_expanded_rail),
            key_bindings=final_key_bindings,
        )

    @update_entity_action
    def reset_key_bindings(self, ctx: DomainContext) -> "WebUiSettings":
        """Put the keys back to what the web app starts with."""
        return self._new_version(ctx, key_bindings=default_key_bindings())

    @staticmethod
    def _check_key_bindings(key_bindings: dict[KeyboardAction, KeyBinding]) -> None:
        """Check that every action has a key, and that no key has two actions."""
        missing = [a for a in KeyboardAction if a not in key_bindings]
        if len(missing) > 0:
            raise InputValidationError(
                "There is no key for " + ", ".join(str(a) for a in missing)
            )
        taken: dict[KeyBinding, KeyboardAction] = {}
        for action in KeyboardAction:
            binding = key_bindings[action]
            if binding in taken:
                raise InputValidationError(
                    f"The key {binding} is on both {taken[binding]} and {action}"
                )
            taken[binding] = action
