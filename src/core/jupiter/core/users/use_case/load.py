"""The command for loading the current user."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.application.gamification.service.score_history_service import (
    ScoreHistoryService,
)
from jupiter.core.domain.application.gamification.service.score_overview_service import (
    ScoreOverviewService,
)
from jupiter.core.domain.application.gamification.user_score_history import (
    UserScoreHistory,
)
from jupiter.core.domain.application.gamification.user_score_overview import (
    UserScoreOverview,
)
from jupiter.core.domain.features import UserFeature
from jupiter.core.users.root import User
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class UserLoadArgs(UseCaseArgsBase):
    """User find args."""


@use_case_result
class UserLoadResult(UseCaseResultBase):
    """User find result."""

    user: User
    user_score_overview: UserScoreOverview | None
    user_score_history: UserScoreHistory | None


@readonly_use_case()
class UserLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[UserLoadArgs, UserLoadResult]
):
    """The command for loading the current user."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: UserLoadArgs,
    ) -> UserLoadResult:
        """Execute the command's action."""
        score_overview = None
        score_history = None
        if context.user.is_feature_available(UserFeature.GAMIFICATION):
            score_overview = await ScoreOverviewService().do_it(
                uow, context.user, self._time_provider.get_current_time()
            )
            score_history = await ScoreHistoryService().do_it(
                uow, context.user, self._time_provider.get_current_time()
            )
        return UserLoadResult(
            user=context.user,
            user_score_overview=score_overview,
            user_score_history=score_history,
        )
