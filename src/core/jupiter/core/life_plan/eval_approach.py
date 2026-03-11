"""The approach to generate life plan eval tasks."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class LifePlanEvalApproach(EnumValue):
    """The approach to generate life plan eval tasks."""

    TASK = "task"
    NONE = "none"

    @property
    def should_do_nothing(self) -> bool:
        """Whether to do nothing."""
        return self == LifePlanEvalApproach.NONE

    @property
    def should_generate_an_eval_task(self) -> bool:
        """Whether to generate an eval task."""
        return self == LifePlanEvalApproach.TASK

    @property
    def should_not_generate_an_eval_task(self) -> bool:
        """Whether to not generate an eval task."""
        return self == LifePlanEvalApproach.NONE
