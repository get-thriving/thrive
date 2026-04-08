"""An inbox task."""

import abc
import textwrap
from collections.abc import Iterable
from typing import ClassVar

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.inbox_tasks.name import InboxTaskName
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.prm.sub.person.sub.occasion.kind import OccasionKind
from jupiter.core.push_integrations.extra_info import (
    PushGenerationExtraInfo,
)
from jupiter.core.push_integrations.sub.email.user_name import (
    EmailUserName,
)
from jupiter.core.push_integrations.sub.slack.channel_name import (
    SlackChannelName,
)
from jupiter.core.push_integrations.sub.slack.user_name import (
    SlackUserName,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


class CannotModifyGeneratedTaskError(Exception):
    """Exception raised when you're trying to modify a generated task."""

    field: str

    def __init__(self, field: str) -> None:
        """Constructor."""
        super().__init__(f"Cannot modify generated inbox task field {field}")
        self.field = field


@entity("InboxTaskCollection")
class InboxTask(LeafSupportEntity):
    """An inbox task."""

    inbox_task_collection: ParentLink
    namespace: InboxTaskNamespace
    name: InboxTaskName
    status: InboxTaskStatus
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_date: ADate | None
    due_date: ADate | None
    notes: str | None
    source_entity_ref_id: EntityId
    recurring_timeline: str | None
    recurring_repeat_index: int | None
    recurring_gen_right_now: (
        Timestamp | None
    )  # Time for which this inbox task was generated
    working_time: Timestamp | None
    completed_time: Timestamp | None

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_todo(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        todo_ref_id: EntityId,
        name: InboxTaskName,
        status: InboxTaskStatus,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
    ) -> "InboxTask":
        """Create an inbox task associated with a todo task."""
        InboxTask._check_actionable_and_due_dates(actionable_date, due_date)
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.TODO_TASK,
            name=name,
            status=status,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=todo_ref_id,
            notes=None,
            recurring_timeline=None,
            recurring_repeat_index=None,
            recurring_gen_right_now=None,
            working_time=ctx.action_timestamp if status.is_working_or_more else None,
            completed_time=ctx.action_timestamp if status.is_completed else None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_big_plan(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        status: InboxTaskStatus,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        big_plan_ref_id: EntityId,
        big_plan_actionable_date: ADate | None,
        big_plan_due_date: ADate | None,
    ) -> "InboxTask":
        """Create an inbox task associated with a big plan."""
        InboxTask._check_actionable_and_due_dates(actionable_date, due_date)

        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.BIG_PLAN,
            name=name,
            status=status,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date or big_plan_actionable_date,
            due_date=due_date or big_plan_due_date,
            source_entity_ref_id=big_plan_ref_id,
            notes=None,
            recurring_timeline=None,
            recurring_repeat_index=None,
            recurring_gen_right_now=None,
            working_time=ctx.action_timestamp if status.is_working_or_more else None,
            completed_time=ctx.action_timestamp if status.is_completed else None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_working_mem_cleanup(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        due_date: ADate | None,
        working_mem_collection_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.WORKING_MEM_CLEANUP,
            name=name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=Eisen.IMPORTANT,
            difficulty=Difficulty.EASY,
            actionable_date=None,
            due_date=due_date,
            source_entity_ref_id=working_mem_collection_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_time_plan(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        time_plan_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.TIME_PLAN,
            name=name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=time_plan_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_habit(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        habit_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_repeat_index: int,
        recurring_task_gen_right_now: Timestamp,
        repeats_in_period_count: int | None,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.HABIT,
            name=InboxTask._build_name_for_habit(
                name, recurring_task_repeat_index, repeats_in_period_count
            ),
            status=InboxTaskStatus.NOT_STARTED,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=habit_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=recurring_task_repeat_index,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_chore(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        chore_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.CHORE,
            name=name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=chore_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_journal(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        journal_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.JOURNAL,
            name=name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=journal_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_metric_collection(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        metric_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.METRIC,
            name=InboxTask._build_name_for_collection_task(name),
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=metric_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_person_catch_up(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        eisen: Eisen,
        difficulty: Difficulty,
        recurring_task_gen_right_now: Timestamp,
        actionable_date: ADate | None,
        due_date: ADate | None,
        person_ref_id: EntityId,
        recurring_task_timeline: str,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.PERSON_CATCH_UP,
            name=InboxTask._build_name_for_catch_up_task(name),
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=person_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_person_occasion(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        due_date: ADate,
        occasion_kind: OccasionKind,
        occasion_person_name: ContactName,
        occasion_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
        preparation_days_cnt: int,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.PERSON_OCCASION,
            name=InboxTask._build_name_for_occasion_task(
                name, occasion_kind, occasion_person_name
            ),
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=Eisen.IMPORTANT,
            difficulty=Difficulty.EASY,
            actionable_date=due_date.subtract_days(preparation_days_cnt),
            due_date=due_date,
            source_entity_ref_id=occasion_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_slack_task(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        slack_task_ref_id: EntityId,
        user: SlackUserName,
        channel: SlackChannelName | None,
        message: str,
        generation_extra_info: PushGenerationExtraInfo,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.SLACK_TASK,
            name=InboxTask._build_name_for_slack_task(
                user,
                channel,
                generation_extra_info,
            ),
            status=generation_extra_info.status or InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=generation_extra_info.eisen,
            difficulty=generation_extra_info.difficulty,
            actionable_date=generation_extra_info.actionable_date,
            due_date=generation_extra_info.due_date,
            source_entity_ref_id=slack_task_ref_id,
            notes=InboxTask._build_notes_for_slack_task(user, channel, message),
            recurring_timeline=None,
            recurring_repeat_index=None,
            recurring_gen_right_now=None,
            working_time=None,
            completed_time=None,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_email_task(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        email_task_ref_id: EntityId,
        from_address: EmailAddress,
        from_name: EmailUserName,
        to_address: EmailAddress,
        subject: str,
        body: str,
        generation_extra_info: PushGenerationExtraInfo,
    ) -> "InboxTask":
        """Create an inbox task."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.EMAIL_TASK,
            name=InboxTask._build_name_for_email_task(
                from_address,
                from_name,
                to_address,
                generation_extra_info,
            ),
            status=generation_extra_info.status or InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=generation_extra_info.eisen,
            difficulty=generation_extra_info.difficulty,
            actionable_date=generation_extra_info.actionable_date,
            due_date=generation_extra_info.due_date,
            source_entity_ref_id=email_task_ref_id,
            notes=InboxTask._build_notes_for_email_task(
                from_address,
                from_name,
                to_address,
                subject,
                body,
            ),
            recurring_timeline=None,
            recurring_repeat_index=None,
            recurring_gen_right_now=None,
            working_time=None,
            completed_time=None,
        )

    @update_entity_action
    def update_link_to_todo(
        self,
        ctx: DomainContext,
        todo_ref_id: EntityId,
        name: UpdateAction[InboxTaskName],
        status: UpdateAction[InboxTaskStatus],
        is_key: UpdateAction[bool],
        actionable_date: UpdateAction[ADate | None],
        due_date: UpdateAction[ADate | None],
        eisen: UpdateAction[Eisen],
        difficulty: UpdateAction[Difficulty],
    ) -> "InboxTask":
        """Update all the info associated with a todo task."""
        if self.namespace is not InboxTaskNamespace.TODO_TASK:
            raise InputValidationError(
                f"Cannot associate a task which is not a user task '{self.name}'"
            )
        if self.source_entity_ref_id != todo_ref_id:
            raise InputValidationError(
                f"Cannot reassociate a task which is not with the todo task '{self.name}'"
            )

        the_name = name.or_else(self.name)

        the_status = self.status
        the_working_time = self.working_time
        the_completed_time = self.completed_time
        if status.should_change:
            if (
                not self.status.is_working_or_more
                and status.just_the_value.is_working_or_more
            ):
                the_working_time = ctx.action_timestamp
            elif (
                self.status.is_working_or_more
                and not status.just_the_value.is_working_or_more
            ):
                the_working_time = None

            if not self.status.is_completed and status.just_the_value.is_completed:
                the_completed_time = ctx.action_timestamp
            elif self.status.is_completed and not status.just_the_value.is_completed:
                the_completed_time = None

            the_status = status.just_the_value

        the_is_key = is_key.or_else(self.is_key)

        if actionable_date.should_change or due_date.should_change:
            the_actionable_date = actionable_date.or_else(self.actionable_date)
            the_due_date = due_date.or_else(self.due_date)
            InboxTask._check_actionable_and_due_dates(the_actionable_date, the_due_date)
        else:
            the_actionable_date = self.actionable_date
            the_due_date = self.due_date

        the_eisen = eisen.or_else(self.eisen)
        the_difficulty = difficulty.or_else(self.difficulty)

        return self._new_version(
            ctx,
            name=the_name,
            status=the_status,
            is_key=the_is_key,
            actionable_date=the_actionable_date,
            due_date=the_due_date,
            working_time=the_working_time,
            completed_time=the_completed_time,
            eisen=the_eisen,
            difficulty=the_difficulty,
        )

    @update_entity_action
    def update_link_to_big_plan(
        self,
        ctx: DomainContext,
        big_plan_ref_id: EntityId,
        name: UpdateAction[InboxTaskName],
        status: UpdateAction[InboxTaskStatus],
        is_key: UpdateAction[bool],
        actionable_date: UpdateAction[ADate | None],
        due_date: UpdateAction[ADate | None],
        eisen: UpdateAction[Eisen],
        difficulty: UpdateAction[Difficulty],
    ) -> "InboxTask":
        """Update all the info associated with a big plan."""
        if self.namespace is not InboxTaskNamespace.BIG_PLAN:
            raise InputValidationError(
                f"Cannot reassociate a task which isn't a big plan one '{self.name}'",
            )

        the_name = name.or_else(self.name)

        the_status = self.status
        the_working_time = self.working_time
        the_completed_time = self.completed_time
        if status.should_change:

            if (
                not self.status.is_working_or_more
                and status.just_the_value.is_working_or_more
            ):
                the_working_time = ctx.action_timestamp
            elif (
                self.status.is_working_or_more
                and not status.just_the_value.is_working_or_more
            ):
                the_working_time = None

            if not self.status.is_completed and status.just_the_value.is_completed:
                the_completed_time = ctx.action_timestamp
            elif self.status.is_completed and not status.just_the_value.is_completed:
                the_completed_time = None

            the_status = status.just_the_value

        the_is_key = is_key.or_else(self.is_key)

        if actionable_date.should_change or due_date.should_change:
            the_actionable_date = actionable_date.or_else(self.actionable_date)
            the_due_date = due_date.or_else(self.due_date)
            InboxTask._check_actionable_and_due_dates(the_actionable_date, the_due_date)
        else:
            the_actionable_date = self.actionable_date
            the_due_date = self.due_date

        the_eisen = eisen.or_else(self.eisen)
        the_difficulty = difficulty.or_else(self.difficulty)

        return self._new_version(
            ctx,
            name=the_name,
            namespace=InboxTaskNamespace.BIG_PLAN,
            status=the_status,
            source_entity_ref_id=big_plan_ref_id,
            is_key=the_is_key,
            actionable_date=the_actionable_date,
            due_date=the_due_date,
            working_time=the_working_time,
            completed_time=the_completed_time,
            eisen=the_eisen,
            difficulty=the_difficulty,
        )

    @update_entity_action
    def update_link_to_working_mem_cleanup(
        self,
        ctx: DomainContext,
        name: InboxTaskName,
        due_date: ADate | None,
        recurring_timeline: str,
    ) -> "InboxTask":
        """Update all the info associated with a working memory cleanup."""
        if self.namespace is not InboxTaskNamespace.WORKING_MEM_CLEANUP:
            raise Exception(
                f"Cannot associate a task which is not for a working memory cleanup '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=name,
            due_date=due_date,
            recurring_timeline=recurring_timeline,
        )

    @update_entity_action
    def update_link_to_time_plan(
        self,
        ctx: DomainContext,
        eisen: Eisen,
        difficulty: Difficulty,
        due_date: ADate,
    ) -> "InboxTask":
        """Update all the info associated with a time plan."""
        if self.namespace is not InboxTaskNamespace.TIME_PLAN:
            raise Exception(
                f"Cannot associate a task which is not a time plan for '{self.name}'",
            )
        return self._new_version(
            ctx,
            eisen=eisen,
            difficulty=difficulty,
            due_date=due_date,
        )

    @update_entity_action
    def update_link_to_habit(
        self,
        ctx: DomainContext,
        name: InboxTaskName,
        timeline: str,
        repeat_index: int,
        repeats_in_period_count: int | None,
        is_key: bool,
        actionable_date: ADate | None,
        due_date: ADate,
        eisen: Eisen,
        difficulty: Difficulty,
    ) -> "InboxTask":
        """Update all the info associated with a habit."""
        if self.namespace is not InboxTaskNamespace.HABIT:
            raise Exception(
                f"Cannot associate a task which is not a habit for '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=InboxTask._build_name_for_habit(
                name, repeat_index, repeats_in_period_count
            ),
            is_key=is_key,
            actionable_date=actionable_date,
            due_date=due_date,
            eisen=eisen,
            difficulty=difficulty,
            recurring_timeline=timeline,
            recurring_repeat_index=repeat_index,
        )

    @update_entity_action
    def update_link_to_chore(
        self,
        ctx: DomainContext,
        name: InboxTaskName,
        timeline: str,
        is_key: bool,
        actionable_date: ADate | None,
        due_date: ADate,
        eisen: Eisen,
        difficulty: Difficulty,
    ) -> "InboxTask":
        """Update all the info associated with a chore."""
        if self.namespace is not InboxTaskNamespace.CHORE:
            raise Exception(
                f"Cannot associate a task which is not a chore for '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=name,
            is_key=is_key,
            actionable_date=actionable_date,
            due_date=due_date,
            eisen=eisen,
            difficulty=difficulty,
            recurring_timeline=timeline,
        )

    @update_entity_action
    def update_link_to_journal(
        self,
        ctx: DomainContext,
        eisen: Eisen,
        difficulty: Difficulty,
        due_date: ADate,
    ) -> "InboxTask":
        """Update all the info associated with a journal."""
        if self.namespace is not InboxTaskNamespace.JOURNAL:
            raise Exception(
                f"Cannot associate a task which is not a journal for '{self.name}'",
            )
        return self._new_version(
            ctx,
            eisen=eisen,
            difficulty=difficulty,
            due_date=due_date,
        )

    @staticmethod
    @create_entity_action
    def new_inbox_task_for_life_plan_eval(
        ctx: DomainContext,
        inbox_task_collection_ref_id: EntityId,
        name: InboxTaskName,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        life_plan_ref_id: EntityId,
        recurring_task_timeline: str,
        recurring_task_gen_right_now: Timestamp,
    ) -> "InboxTask":
        """Create an inbox task for a life plan eval."""
        return InboxTask._create(
            ctx,
            inbox_task_collection=ParentLink(inbox_task_collection_ref_id),
            namespace=InboxTaskNamespace.LIFE_PLAN_EVAL,
            name=name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=False,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            source_entity_ref_id=life_plan_ref_id,
            notes=None,
            recurring_timeline=recurring_task_timeline,
            recurring_repeat_index=None,
            recurring_gen_right_now=recurring_task_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @update_entity_action
    def update_link_to_life_plan_eval(
        self,
        ctx: DomainContext,
        eisen: Eisen,
        difficulty: Difficulty,
        due_date: ADate,
    ) -> "InboxTask":
        """Update all the info associated with a life plan eval."""
        if self.namespace is not InboxTaskNamespace.LIFE_PLAN_EVAL:
            raise Exception(
                f"Cannot associate a task which is not a life plan eval for '{self.name}'",
            )
        return self._new_version(
            ctx,
            eisen=eisen,
            difficulty=difficulty,
            due_date=due_date,
        )

    @update_entity_action
    def update_link_to_metric(
        self,
        ctx: DomainContext,
        name: InboxTaskName,
        recurring_timeline: str,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_time: ADate,
    ) -> "InboxTask":
        """Update all the info associated with a metric."""
        if self.namespace is not InboxTaskNamespace.METRIC:
            raise Exception(
                f"Cannot associate a task which is not for a metric '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=self._build_name_for_collection_task(name),
            actionable_date=actionable_date,
            due_date=due_time,
            eisen=eisen,
            difficulty=difficulty,
            recurring_timeline=recurring_timeline,
        )

    @update_entity_action
    def update_link_to_person_catch_up(
        self,
        ctx: DomainContext,
        name: InboxTaskName,
        recurring_timeline: str,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_time: ADate,
    ) -> "InboxTask":
        """Update all the info associated with a person."""
        if self.namespace is not InboxTaskNamespace.PERSON_CATCH_UP:
            raise Exception(
                f"Cannot associate a task which is not for a person catch up'{self.name}'",
            )
        return self._new_version(
            ctx,
            name=self._build_name_for_catch_up_task(name),
            actionable_date=actionable_date,
            due_date=due_time,
            eisen=eisen,
            difficulty=difficulty,
            recurring_timeline=recurring_timeline,
        )

    @update_entity_action
    def update_link_to_person_occasion(
        self,
        ctx: DomainContext,
        name: InboxTaskName,
        occasion_kind: OccasionKind,
        occasion_person_name: ContactName,
        recurring_timeline: str,
        preparation_days_cnt: int,
        due_time: ADate,
    ) -> "InboxTask":
        """Update all the info associated with a person occasion."""
        if self.namespace is not InboxTaskNamespace.PERSON_OCCASION:
            raise Exception(
                f"Cannot associate a task which is not for a person occasion '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=self._build_name_for_occasion_task(
                name, occasion_kind, occasion_person_name
            ),
            actionable_date=due_time.subtract_days(preparation_days_cnt),
            due_date=due_time,
            recurring_timeline=recurring_timeline,
        )

    @update_entity_action
    def update_link_to_slack_task(
        self,
        ctx: DomainContext,
        user: SlackUserName,
        channel: SlackChannelName | None,
        message: str,
        generation_extra_info: PushGenerationExtraInfo,
    ) -> "InboxTask":
        """Update all the info associated with a person."""
        if self.namespace is not InboxTaskNamespace.SLACK_TASK:
            raise Exception(
                f"Cannot update a task which is not a Slack one '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=self._build_name_for_slack_task(user, channel, generation_extra_info),
            eisen=generation_extra_info.eisen,
            difficulty=generation_extra_info.difficulty,
            actionable_date=generation_extra_info.actionable_date,
            due_date=generation_extra_info.due_date,
            notes=InboxTask._build_notes_for_slack_task(user, channel, message),
        )

    @update_entity_action
    def update_link_to_email_task(
        self,
        ctx: DomainContext,
        from_address: EmailAddress,
        from_name: EmailUserName,
        to_address: EmailAddress,
        subject: str,
        body: str,
        generation_extra_info: PushGenerationExtraInfo,
    ) -> "InboxTask":
        """Update all the info associated with a person."""
        if self.namespace is not InboxTaskNamespace.EMAIL_TASK:
            raise Exception(
                f"Cannot update a task which is not a email one '{self.name}'",
            )
        return self._new_version(
            ctx,
            name=self._build_name_for_email_task(
                from_address,
                from_name,
                to_address,
                generation_extra_info,
            ),
            eisen=generation_extra_info.eisen,
            difficulty=generation_extra_info.difficulty,
            actionable_date=generation_extra_info.actionable_date,
            due_date=generation_extra_info.due_date,
            notes=InboxTask._build_notes_for_email_task(
                from_address,
                from_name,
                to_address,
                subject,
                body,
            ),
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[InboxTaskName],
        status: UpdateAction[InboxTaskStatus],
        is_key: UpdateAction[bool],
        actionable_date: UpdateAction[ADate | None],
        due_date: UpdateAction[ADate | None],
        eisen: UpdateAction[Eisen],
        difficulty: UpdateAction[Difficulty],
    ) -> "InboxTask":
        """Update the inbox task generic properties (not the source)."""
        if name.should_change:
            if not self.namespace.allow_user_changes:
                raise CannotModifyGeneratedTaskError("name")
            the_name = name.just_the_value
        else:
            the_name = self.name

        the_status = self.status
        the_working_time = self.working_time
        the_completed_time = self.completed_time
        if status.should_change:
            if (
                not self.status.is_working_or_more
                and status.just_the_value.is_working_or_more
            ):
                the_working_time = ctx.action_timestamp
            elif (
                self.status.is_working_or_more
                and not status.just_the_value.is_working_or_more
            ):
                the_working_time = None

            if not self.status.is_completed and status.just_the_value.is_completed:
                the_completed_time = ctx.action_timestamp
            elif self.status.is_completed and not status.just_the_value.is_completed:
                the_completed_time = None

            the_status = status.just_the_value

        if is_key.should_change:
            if not self.namespace.allow_user_changes:
                raise CannotModifyGeneratedTaskError("is key")
            the_is_key = is_key.just_the_value
        else:
            the_is_key = self.is_key

        if actionable_date.should_change or due_date.should_change:
            the_actionable_date = actionable_date.or_else(self.actionable_date)
            the_due_date = due_date.or_else(self.due_date)
            InboxTask._check_actionable_and_due_dates(the_actionable_date, the_due_date)
        else:
            the_actionable_date = self.actionable_date
            the_due_date = self.due_date

        if eisen.should_change:
            if not self.namespace.allow_user_changes:
                raise CannotModifyGeneratedTaskError("eisen")
            the_eisen = eisen.just_the_value
        else:
            the_eisen = self.eisen

        if difficulty.should_change:
            if not self.namespace.allow_user_changes:
                raise CannotModifyGeneratedTaskError("difficulty")
            the_difficulty = difficulty.just_the_value
        else:
            the_difficulty = self.difficulty

        return self._new_version(
            ctx,
            name=the_name,
            status=the_status,
            is_key=the_is_key,
            actionable_date=the_actionable_date,
            due_date=the_due_date,
            working_time=the_working_time,
            completed_time=the_completed_time,
            eisen=the_eisen,
            difficulty=the_difficulty,
        )

    @update_entity_action
    def change_due_date_via_time_plan(
        self,
        ctx: DomainContext,
        due_date: ADate,
    ) -> "InboxTask":
        """Update the inbox task."""
        if not self.allow_user_changes:
            raise CannotModifyGeneratedTaskError("name")

        actionable_date = self.actionable_date
        if actionable_date is not None and actionable_date > due_date:
            actionable_date = None

        self._check_actionable_and_due_dates(actionable_date, due_date)

        return self._new_version(
            ctx, actionable_date=actionable_date, due_date=due_date
        )

    @property
    def allow_user_changes(self) -> bool:
        """Allow user changes for an inbox task."""
        return self.namespace.allow_user_changes

    @property
    def can_be_archived_or_removed_independently(self) -> bool:
        """Whether this task can be archived/removed directly."""
        if self.namespace is InboxTaskNamespace.TODO_TASK:
            return False
        return True

    @property
    def is_working(self) -> bool:
        """Whether this task is being worked on or not."""
        return self.status.is_working

    @property
    def is_working_or_more(self) -> bool:
        """Whether this task is being worked on or not."""
        return self.status.is_working_or_more

    @property
    def is_completed(self) -> bool:
        """Whether this task is complete or not."""
        return self.status.is_completed

    @staticmethod
    def _build_name_for_working_mem_cleanup(
        recurring_task_timeline: str,
    ) -> InboxTaskName:
        return InboxTaskName(f"Clean up working memory for [{recurring_task_timeline}]")

    @staticmethod
    def _build_name_for_time_plan(
        period: RecurringTaskPeriod,
        recurring_task_timeline: str,
    ) -> InboxTaskName:
        return InboxTaskName(
            f"Make {period.value} plan for [{recurring_task_timeline}]"
        )

    @staticmethod
    def _build_name_for_habit(
        name: InboxTaskName,
        repeat_index: int,
        repeats_in_period_count: int | None,
    ) -> InboxTaskName:
        if repeats_in_period_count is not None and repeats_in_period_count > 1:
            return InboxTaskName(f"{name} [{repeat_index + 1}]")
        else:
            return name

    @staticmethod
    def _build_name_for_collection_task(name: InboxTaskName) -> InboxTaskName:
        return InboxTaskName(f"Collect value for metric {name}")

    @staticmethod
    def _build_name_for_catch_up_task(name: InboxTaskName) -> InboxTaskName:
        return InboxTaskName(f"Catch up with {name}")

    @staticmethod
    def _build_name_for_occasion_task(
        name: InboxTaskName,
        occasion_kind: OccasionKind,
        occasion_person_name: ContactName,
    ) -> InboxTaskName:
        match occasion_kind:
            case OccasionKind.BIRTHDAY:
                return InboxTaskName(f"Wish {occasion_person_name}'s on their {name}")
            case OccasionKind.ANNIVERSARY:
                return InboxTaskName(
                    f"Wish {occasion_person_name}'s on their anniversary for {name}"
                )
            case OccasionKind.HOLIDAY:
                return InboxTaskName(
                    f"Wish {occasion_person_name}'s for {name} holidays"
                )
            case OccasionKind.OTHER:
                return InboxTaskName(f"Wish {occasion_person_name}'s on their {name}")

    @staticmethod
    def _build_name_for_slack_task(
        user: SlackUserName,
        channel: SlackChannelName | None,
        generation_extra_info: PushGenerationExtraInfo,
    ) -> InboxTaskName:
        if generation_extra_info.name is not None:
            return generation_extra_info.name
        if channel is not None:
            return InboxTaskName(f"Respond to {user} on {channel}")
        return InboxTaskName(f"Respond to {user}'s DM")

    @staticmethod
    def _build_name_for_email_task(
        from_address: EmailAddress,
        from_name: EmailUserName,
        to_address: EmailAddress,
        generation_extra_info: PushGenerationExtraInfo,
    ) -> InboxTaskName:
        if generation_extra_info.name is not None:
            return generation_extra_info.name
        return InboxTaskName(
            f"Respond to {from_name}'s <{from_address}> message sent to {to_address}",
        )

    @staticmethod
    def _build_notes_for_slack_task(
        user: SlackUserName,
        channel: SlackChannelName | None,
        message: str,
    ) -> str:
        message = textwrap.dedent(
            f"""
            **user**: {user}
            **channel**: {str(channel) if channel else "DM"}
            **message**: {message}
            """,
        ).strip()
        return message

    @staticmethod
    def _build_notes_for_email_task(
        from_address: EmailAddress,
        from_name: EmailUserName,
        to_address: EmailAddress,
        subject: str,
        body: str,
    ) -> str:
        message = textwrap.dedent(
            f"""
            **from**: {from_name} <{from_address}>
            **to**: {to_address}
            **subject**: {subject}
            **body**: {body}""",
        ).strip()
        return message

    @staticmethod
    def _check_actionable_and_due_dates(
        actionable_date: ADate | None,
        due_date: ADate | None,
    ) -> None:
        if actionable_date is None or due_date is None:
            return

        if actionable_date > due_date:
            raise InputValidationError(
                f"The actionable date {actionable_date} should be before the due date {due_date}",
            )


class InboxTaskRepository(LeafEntityRepository[InboxTask], abc.ABC):
    """A repository of inbox tasks."""

    PAGE_SIZE: ClassVar[int] = 10

    @abc.abstractmethod
    async def count_all_for_source(
        self,
        parent_ref_id: EntityId,
        namespace: InboxTaskNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> int:
        """Count all inbox tasks for a source."""

    @abc.abstractmethod
    async def find_all_for_source_created_desc(
        self,
        parent_ref_id: EntityId,
        namespace: InboxTaskNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        retrieve_offset: int | None = None,
        retrieve_limit: int | None = None,
    ) -> list[InboxTask]:
        """Find all inbox tasks for a source."""

    @abc.abstractmethod
    async def find_modified_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
        filter_sources: Iterable[InboxTaskNamespace] | None = None,
        filter_last_modified_time_start: ADate | None = None,
        filter_last_modified_time_end: ADate | None = None,
    ) -> list[InboxTask]:
        """Find all inbox tasks."""

    @abc.abstractmethod
    async def find_completed_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        filter_start_completed_date: ADate,
        filter_end_completed_date: ADate,
        filter_include_sources: Iterable[InboxTaskNamespace],
        filter_exclude_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[InboxTask]:
        """Find all completed inbox tasks in a time range."""
