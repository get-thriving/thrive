"""Even features are expressed here."""

from collections.abc import Iterable

from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import CompositeValue, EnumValue, enum_value, value


@enum_value
class FeatureControl(EnumValue):
    """The level of control allowed for a particular feature."""

    # Feature can't be turned off by the user
    ALWAYS_ON = "always-on"
    # Feature can't be turned on by the user because we're having tech issues
    ALWAYS_OFF_TECH = "always-off-tech"
    # Feature can't be turned on by the user because it doesn't make sense in the hosting mode
    ALWAYS_OFF_HOSTING = "always-off-hosting"
    # Feature can be set by the user
    USER = "user"

    @property
    def standard_flag(self) -> bool:
        """The standard value for a feature flag controlled by this feature control."""
        return self == FeatureControl.ALWAYS_ON

    def check(self, property_name: str, property_value: bool) -> bool:
        """Verify if the property can be set."""
        if self == FeatureControl.ALWAYS_ON:
            if property_value is False:
                raise InputValidationError(
                    f"Cannot disable {property_name} because it should always be on"
                )
        elif (
            self == FeatureControl.ALWAYS_OFF_TECH
            or self == FeatureControl.ALWAYS_OFF_HOSTING
        ):
            if property_value is True:
                raise InputValidationError(
                    f"Cannot enable {property_name} because this environment doesn't support it"
                )

        return property_value


@enum_value
class UserFeature(EnumValue):
    """A particular feature of a jupiter user."""

    GAMIFICATION = "gamification"


UserFeatureFlags = dict[UserFeature, bool]


@value
class UserFeatureFlagsControls(CompositeValue):
    """Feature settings controls for the user."""

    controls: dict[UserFeature, FeatureControl]

    def standard_flag_for(self, feature: UserFeature) -> bool:
        """Get the standard flag for a feature."""
        return self.controls[feature].standard_flag

    def validate_and_complete(
        self,
        feature_flags_delta: UserFeatureFlags,
        current_feature_flags: UserFeatureFlags,
    ) -> UserFeatureFlags:
        """Validates a set of feature flags and also provides a complete set."""
        checked_feature_flags: UserFeatureFlags = {}

        for feature, control in self.controls.items():
            if feature in feature_flags_delta:
                checked_feature_flags[feature] = control.check(
                    feature.value, feature_flags_delta[feature]
                )
            elif feature in current_feature_flags:
                checked_feature_flags[feature] = current_feature_flags[feature]
            else:
                checked_feature_flags[feature] = control.standard_flag

        return checked_feature_flags


@enum_value
class WorkspaceFeature(EnumValue):
    """A particular feature of a jupiter workspace."""

    TODO_TASK = "todo-task"
    WORKING_MEM = "working-mem"
    TIME_PLANS = "time-plans"
    SCHEDULE = "schedule"
    HABITS = "habits"
    CHORES = "chores"
    PROJECTS = "projects"
    JOURNALS = "journals"
    DOCS = "docs"
    VACATIONS = "vacations"
    LIFE_PLAN = "life-plan"
    SMART_LISTS = "smart-lists"
    METRICS = "metrics"
    PRM = "prm"
    SLACK_TASKS = "slack-tasks"
    EMAIL_TASKS = "email-tasks"


WorkspaceFeatureFlags = dict[WorkspaceFeature, bool]


@value
class WorkspaceFeatureFlagsControls(CompositeValue):
    """Feature settings controls for the workspace."""

    controls: dict[WorkspaceFeature, FeatureControl]

    def standard_flag_for(self, feature: WorkspaceFeature) -> bool:
        """Get the standard flag for a feature."""
        return self.controls[feature].standard_flag

    def validate_and_complete(
        self,
        feature_flags_delta: WorkspaceFeatureFlags,
        current_feature_flags: WorkspaceFeatureFlags,
    ) -> WorkspaceFeatureFlags:
        """Validates a set of feature flags and also provides a complete set."""
        checked_feature_flags: WorkspaceFeatureFlags = {}

        for feature, control in self.controls.items():
            if feature in feature_flags_delta:
                checked_feature_flags[feature] = control.check(
                    feature.value, feature_flags_delta[feature]
                )
            elif feature in current_feature_flags:
                checked_feature_flags[feature] = current_feature_flags[feature]
            else:
                checked_feature_flags[feature] = control.standard_flag

        return checked_feature_flags


FeatureScope = (
    Iterable[UserFeature]
    | UserFeature
    | Iterable[WorkspaceFeature]
    | WorkspaceFeature
    | None
)


BASIC_USER_FEATURE_FLAGS = {UserFeature.GAMIFICATION: True}
BASIC_USER_FEATURE_FLAGS_ARR = [
    f for f, v in BASIC_USER_FEATURE_FLAGS.items() if v is True
]


USER_FEATURE_FLAGS_CONTROLS = UserFeatureFlagsControls(
    {UserFeature.GAMIFICATION: FeatureControl.USER}
)


BASIC_WORKSPACE_FEATURE_FLAGS = {
    WorkspaceFeature.TODO_TASK: True,
    WorkspaceFeature.WORKING_MEM: False,
    WorkspaceFeature.TIME_PLANS: False,
    WorkspaceFeature.SCHEDULE: False,
    WorkspaceFeature.HABITS: True,
    WorkspaceFeature.CHORES: False,
    WorkspaceFeature.PROJECTS: False,
    WorkspaceFeature.JOURNALS: False,
    WorkspaceFeature.DOCS: True,
    WorkspaceFeature.VACATIONS: False,
    WorkspaceFeature.LIFE_PLAN: False,
    WorkspaceFeature.SMART_LISTS: False,
    WorkspaceFeature.METRICS: False,
    WorkspaceFeature.PRM: False,
    WorkspaceFeature.SLACK_TASKS: False,
    WorkspaceFeature.EMAIL_TASKS: False,
}
BASIC_WORKSPACE_FEATURE_FLAGS_ARR = [
    f for f, v in BASIC_WORKSPACE_FEATURE_FLAGS.items() if v is True
]


HOSTED_GLOBAL_WORKSPACE_FEATURE_FLAGS_CONTROLS = WorkspaceFeatureFlagsControls(
    {
        WorkspaceFeature.TODO_TASK: FeatureControl.USER,
        WorkspaceFeature.WORKING_MEM: FeatureControl.USER,
        WorkspaceFeature.TIME_PLANS: FeatureControl.USER,
        WorkspaceFeature.SCHEDULE: FeatureControl.USER,
        WorkspaceFeature.HABITS: FeatureControl.USER,
        WorkspaceFeature.CHORES: FeatureControl.USER,
        WorkspaceFeature.PROJECTS: FeatureControl.USER,
        WorkspaceFeature.JOURNALS: FeatureControl.USER,
        WorkspaceFeature.DOCS: FeatureControl.USER,
        WorkspaceFeature.VACATIONS: FeatureControl.USER,
        WorkspaceFeature.LIFE_PLAN: FeatureControl.USER,
        WorkspaceFeature.SMART_LISTS: FeatureControl.USER,
        WorkspaceFeature.METRICS: FeatureControl.USER,
        WorkspaceFeature.PRM: FeatureControl.USER,
        WorkspaceFeature.SLACK_TASKS: FeatureControl.ALWAYS_OFF_TECH,
        WorkspaceFeature.EMAIL_TASKS: FeatureControl.ALWAYS_OFF_TECH,
    }
)


LOCAL_WORKSPACE_FEATURE_FLAGS_CONTROLS = WorkspaceFeatureFlagsControls(
    {
        WorkspaceFeature.TODO_TASK: FeatureControl.USER,
        WorkspaceFeature.WORKING_MEM: FeatureControl.USER,
        WorkspaceFeature.TIME_PLANS: FeatureControl.USER,
        WorkspaceFeature.SCHEDULE: FeatureControl.USER,
        WorkspaceFeature.HABITS: FeatureControl.USER,
        WorkspaceFeature.CHORES: FeatureControl.USER,
        WorkspaceFeature.PROJECTS: FeatureControl.USER,
        WorkspaceFeature.JOURNALS: FeatureControl.USER,
        WorkspaceFeature.DOCS: FeatureControl.USER,
        WorkspaceFeature.VACATIONS: FeatureControl.USER,
        WorkspaceFeature.LIFE_PLAN: FeatureControl.USER,
        WorkspaceFeature.SMART_LISTS: FeatureControl.USER,
        WorkspaceFeature.METRICS: FeatureControl.USER,
        WorkspaceFeature.PRM: FeatureControl.USER,
        WorkspaceFeature.SLACK_TASKS: FeatureControl.ALWAYS_OFF_HOSTING,
        WorkspaceFeature.EMAIL_TASKS: FeatureControl.ALWAYS_OFF_HOSTING,
    }
)
