"""Service for checking that the entities a widget's properties point at are usable."""

from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.home.sub.widget.properties.key_habits_streaks import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter.core.home.sub.widget.properties.one_of import OneOfHomeWidgetProperties
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


class CheckHomeWidgetPropertiesReferencesService:
    """Check that the entities a widget's properties point at are usable.

    A widget only displays the entities it points at, so the user needs to be
    able to read them. Writing to them is not required, which is why a habit
    that was shared with the user as read only can still go on their home page.
    """

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
        properties: OneOfHomeWidgetProperties,
    ) -> None:
        """Raise if the properties point at an entity the user cannot show."""
        if isinstance(properties, KeyHabitsStreaksHomeWidgetProperties):
            await self._check_habits(uow, user_ref_id, properties.habit_ref_ids)

    async def _check_habits(
        self,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
        habit_ref_ids: list[EntityId],
    ) -> None:
        if not habit_ref_ids:
            return

        await CheckForAclService().do_it_for_many(
            uow, Habit, habit_ref_ids, user_ref_id, AccessLevel.READER
        )

        # The access check also lets archived habits through, but those never
        # show up on the home page, so refuse to add them.
        active_habits = await uow.get_for(Habit).find_all_generic(
            parent_ref_id=None,
            allow_archived=False,
            ref_id=habit_ref_ids,
        )
        active_ref_ids = {habit.ref_id for habit in active_habits}
        for habit_ref_id in habit_ref_ids:
            if habit_ref_id not in active_ref_ids:
                raise InputValidationError(f"Habit {habit_ref_id} is archived")
