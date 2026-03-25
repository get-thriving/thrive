"""The workspace where everything happens."""

import abc
from collections.abc import Iterable

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.tasks.domain import TaskDomain
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.docs.collection import DocCollection
from jupiter.core.features import (
    WorkspaceFeature,
    WorkspaceFeatureFlags,
    WorkspaceFeatureFlagsControls,
)
from jupiter.core.gc.log import GCLog
from jupiter.core.gen.log import GenLog
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.home.config import HomeConfig
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.root import PRM
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.smart_lists.collection import (
    SmartListCollection,
)
from jupiter.core.stats.log import StatsLog
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
from jupiter.core.workspaces.name import WorkspaceName
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsOne,
    IsRefId,
    RootEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityNotFoundError,
    RootEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


@entity
class Workspace(RootEntity):
    """The workspace where everything happens."""

    name: WorkspaceName
    feature_flags: WorkspaceFeatureFlags

    inbox_task_collection = ContainsOne(InboxTaskCollection, workspace_ref_id=IsRefId())
    home_config = ContainsOne(HomeConfig, workspace_ref_id=IsRefId())
    working_mem_collection = ContainsOne(
        WorkingMemCollection, workspace_ref_id=IsRefId()
    )
    time_plan_domain = ContainsOne(TimePlanDomain, workspace_ref_id=IsRefId())
    schedule = ContainsOne(ScheduleDomain, workspace_ref_id=IsRefId())
    habit_collection = ContainsOne(HabitCollection, workspace_ref_id=IsRefId())
    chore_collection = ContainsOne(ChoreCollection, workspace_ref_id=IsRefId())
    big_plan_collection = ContainsOne(BigPlanCollection, workspace_ref_id=IsRefId())
    journal_collection = ContainsOne(JournalCollection, workspace_ref_id=IsRefId())
    doc_collection = ContainsOne(DocCollection, workspace_ref_id=IsRefId())
    vacation_collection = ContainsOne(VacationCollection, workspace_ref_id=IsRefId())
    life_plan = ContainsOne(LifePlan, workspace_ref_id=IsRefId())
    smart_list_collection = ContainsOne(SmartListCollection, workspace_ref_id=IsRefId())
    metric_collection = ContainsOne(MetricCollection, workspace_ref_id=IsRefId())
    prm = ContainsOne(PRM, workspace_ref_id=IsRefId())

    task_domain = ContainsOne(TaskDomain, workspace_ref_id=IsRefId())
    note_collection = ContainsOne(NoteCollection, workspace_ref_id=IsRefId())
    time_event_domain = ContainsOne(TimeEventDomain, workspace_ref_id=IsRefId())
    tag_domain = ContainsOne(TagDomain, workspace_ref_id=IsRefId())
    contact_domain = ContainsOne(ContactDomain, workspace_ref_id=IsRefId())

    gc_log = ContainsOne(GCLog, workspace_ref_id=IsRefId())
    gen_log = ContainsOne(GenLog, workspace_ref_id=IsRefId())
    stats_log = ContainsOne(StatsLog, workspace_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_workspace(
        ctx: MutationContext,
        name: WorkspaceName,
        feature_flag_controls: WorkspaceFeatureFlagsControls,
        feature_flags: WorkspaceFeatureFlags,
    ) -> "Workspace":
        """Create a new workspace."""
        return Workspace._create(
            ctx,
            name=name,
            feature_flags=feature_flag_controls.validate_and_complete(
                feature_flags_delta=feature_flags, current_feature_flags={}
            ),
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[WorkspaceName],
    ) -> "Workspace":
        """Update properties of the workspace."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )

    @update_entity_action
    def change_feature_flags(
        self,
        ctx: MutationContext,
        feature_flag_controls: WorkspaceFeatureFlagsControls,
        feature_flags: WorkspaceFeatureFlags,
    ) -> "Workspace":
        """Change the feature settings for this workspace."""
        return self._new_version(
            ctx,
            feature_flags=feature_flag_controls.validate_and_complete(
                feature_flags_delta=feature_flags,
                current_feature_flags=self.feature_flags,
            ),
        )

    def is_feature_available(self, feature: WorkspaceFeature) -> bool:
        """Check if a feature is available in this workspace."""
        return self.feature_flags[feature]

    def infer_entity_tags_for_enabled_features(
        self, filter_entity_tags: Iterable[NamedEntityTag] | None = None
    ) -> list[NamedEntityTag]:
        """Filter and complete a set of entity tags according to the enabled features."""
        # Keep in sync with ts:webui:interEntityTagsForEnabledFeatures
        all_entity_tags = filter_entity_tags or [s for s in NamedEntityTag]
        inferred_entity_tags: list[NamedEntityTag] = []
        for entity_tag in all_entity_tags:
            if entity_tag is NamedEntityTag.INBOX_TASK:
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.WORKING_MEM and self.is_feature_available(
                WorkspaceFeature.WORKING_MEM
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.TIME_PLAN and self.is_feature_available(
                WorkspaceFeature.TIME_PLANS
            ):
                inferred_entity_tags.append(entity_tag)
            elif (
                entity_tag is NamedEntityTag.TIME_PLAN_ACTIVITY
                and self.is_feature_available(WorkspaceFeature.TIME_PLANS)
            ):
                inferred_entity_tags.append(entity_tag)
            elif (
                entity_tag is NamedEntityTag.SCHEDULE_STREAM
                and self.is_feature_available(WorkspaceFeature.SCHEDULE)
            ):
                inferred_entity_tags.append(entity_tag)
            elif (
                entity_tag is NamedEntityTag.SCHEDULE_EVENT_IN_DAY
                and self.is_feature_available(WorkspaceFeature.SCHEDULE)
            ):
                inferred_entity_tags.append(entity_tag)
            elif (
                entity_tag is NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK
                and self.is_feature_available(WorkspaceFeature.SCHEDULE)
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.HABIT and self.is_feature_available(
                WorkspaceFeature.HABITS
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.CHORE and self.is_feature_available(
                WorkspaceFeature.CHORES
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.BIG_PLAN and self.is_feature_available(
                WorkspaceFeature.BIG_PLANS
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.JOURNAL and self.is_feature_available(
                WorkspaceFeature.JOURNALS
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.DOC and self.is_feature_available(
                WorkspaceFeature.DOCS
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.VACATION and self.is_feature_available(
                WorkspaceFeature.VACATIONS
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.PROJECT and self.is_feature_available(
                WorkspaceFeature.LIFE_PLAN
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.CHAPTER and self.is_feature_available(
                WorkspaceFeature.LIFE_PLAN
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.GOAL and self.is_feature_available(
                WorkspaceFeature.LIFE_PLAN
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.VISION and self.is_feature_available(
                WorkspaceFeature.LIFE_PLAN
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.SMART_LIST and self.is_feature_available(
                WorkspaceFeature.SMART_LISTS
            ):
                inferred_entity_tags.append(entity_tag)
            elif (
                entity_tag is NamedEntityTag.SMART_LIST_ITEM
                and self.is_feature_available(WorkspaceFeature.SMART_LISTS)
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.METRIC and self.is_feature_available(
                WorkspaceFeature.METRICS
            ):
                inferred_entity_tags.append(entity_tag)
            elif (
                entity_tag is NamedEntityTag.METRIC_ENTRY
                and self.is_feature_available(WorkspaceFeature.METRICS)
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.PERSON and self.is_feature_available(
                WorkspaceFeature.PRM
            ):
                inferred_entity_tags.append(entity_tag)
            elif entity_tag is NamedEntityTag.CIRCLE and self.is_feature_available(
                WorkspaceFeature.PRM
            ):
                inferred_entity_tags.append(entity_tag)
        return inferred_entity_tags

    def infer_sources_for_enabled_features(
        self, filter_sources: Iterable[InboxTaskSource] | None = None
    ) -> list[InboxTaskSource]:
        """Filter and complete a set of sources according to the enabled features."""
        # Keep in sync with ts:webui:inferSourcesForEnabledFeatures
        all_sources = filter_sources or [s for s in InboxTaskSource]
        inferred_sources: list[InboxTaskSource] = []
        for source in all_sources:
            if source is InboxTaskSource.USER:
                inferred_sources.append(source)
            elif (
                source is InboxTaskSource.WORKING_MEM_CLEANUP
                and self.is_feature_available(WorkspaceFeature.WORKING_MEM)
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.TIME_PLAN and self.is_feature_available(
                WorkspaceFeature.TIME_PLANS
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.JOURNAL and self.is_feature_available(
                WorkspaceFeature.JOURNALS
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.HABIT and self.is_feature_available(
                WorkspaceFeature.HABITS
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.CHORE and self.is_feature_available(
                WorkspaceFeature.CHORES
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.BIG_PLAN and self.is_feature_available(
                WorkspaceFeature.BIG_PLANS
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.JOURNAL and self.is_feature_available(
                WorkspaceFeature.JOURNALS
            ):
                inferred_sources.append(source)
            elif source is InboxTaskSource.METRIC and self.is_feature_available(
                WorkspaceFeature.METRICS
            ):
                inferred_sources.append(source)
            elif (
                source is InboxTaskSource.PERSON_OCCASION
                and self.is_feature_available(WorkspaceFeature.PRM)
            ):
                inferred_sources.append(source)
            elif (
                source is InboxTaskSource.PERSON_CATCH_UP
                and self.is_feature_available(WorkspaceFeature.PRM)
            ):
                inferred_sources.append(source)
        return inferred_sources


class WorkspaceNotFoundError(EntityNotFoundError):
    """Error raised when a workspace is not found."""


class WorkspaceRepository(RootEntityRepository[Workspace], abc.ABC):
    """A repository for workspaces."""
