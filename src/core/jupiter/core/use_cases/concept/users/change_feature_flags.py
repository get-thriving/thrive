"""Change the user feature flags."""

from typing import cast

from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.user.user import User
from jupiter.core.domain.features import UserFeature
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import (
    DomainUnitOfWork,
)
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class UserChangeFeatureFlagsArgs(UseCaseArgsBase):
    """UserChangeFeatureFlags args."""

    feature_flags: set[UserFeature]


@mutation_use_case()
class UserChangeFeatureFlagsUseCase(
    JupiterTransactionalLoggedInMutationUseCase[UserChangeFeatureFlagsArgs, None]
):
    """Usecase for changing the feature flags for the user."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: UserChangeFeatureFlagsArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        # TODO(horia141): params
        feature_flags_controls, _ = infer_feature_flag_controls(
            cast(JupiterGlobalProperties, self._global_properties)
        )
        user_feature_flags = {}
        for feature_flag in UserFeature:
            user_feature_flags[feature_flag] = feature_flag in args.feature_flags

        user = user.change_feature_flags(
            context.domain_context,
            feature_flag_controls=feature_flags_controls,
            feature_flags=user_feature_flags,
        )
        await uow.get_for(User).save(user)
