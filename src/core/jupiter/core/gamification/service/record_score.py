"""A service that records scores for various actions."""

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.timeline import infer_timeline
from jupiter.core.gamification.score_log import ScoreLog
from jupiter.core.gamification.score_log_entry import ScoreLogEntry
from jupiter.core.gamification.score_period_best import (
    ScorePeriodBest,
    ScorePeriodBestRepository,
)
from jupiter.core.gamification.score_stats import (
    ScoreStats,
    ScoreStatsRepository,
)
from jupiter.core.gamification.user_score_overview import (
    UserScoreOverview,
)
from jupiter.core.users.root import User
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityAlreadyExistsError,
)
from jupiter.framework.value import CompositeValue, value


@value
class RecordScoreResult(CompositeValue):
    """The result of the score recording."""

    latest_task_score: int
    has_lucky_puppy_bonus: bool | None
    score_overview: UserScoreOverview


class RecordScoreService:
    """A service that records scores for various actions."""

    async def record_task(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        user: User,
        task: InboxTask | BigPlan,
    ) -> RecordScoreResult | None:
        """Record a task score."""
        if not task.status.is_completed:
            return None

        # Record the accomplishment of the task in the score log.

        score_log = await uow.get_for(ScoreLog).load_by_parent(user.ref_id)

        if isinstance(task, InboxTask):
            new_score_log_entry = ScoreLogEntry.new_from_inbox_task(
                ctx,
                score_log.ref_id,
                task,
            )
        else:
            new_score_log_entry = ScoreLogEntry.new_from_big_plan(
                ctx,
                score_log.ref_id,
                task,
            )

        try:
            await uow.get_for(ScoreLogEntry).create(new_score_log_entry)
        except EntityAlreadyExistsError:
            # The score log entry already exists. This entity has already been marked as done
            # or not done, and we won't do it again!
            return None

        # Update statistics at write time. All periods are read in one query,
        # merged in memory, and written back in one query, instead of a
        # read-then-write round trip per period.

        stats_periods: list[RecurringTaskPeriod | None] = [
            RecurringTaskPeriod.DAILY,
            RecurringTaskPeriod.WEEKLY,
            RecurringTaskPeriod.MONTHLY,
            RecurringTaskPeriod.QUARTERLY,
            RecurringTaskPeriod.YEARLY,
            None,
        ]
        stats_keys = [
            (score_log.ref_id, period, infer_timeline(period, ctx.action_timestamp))
            for period in stats_periods
        ]
        existing_stats_by_key = {
            existing.key: existing
            for existing in await uow.get(ScoreStatsRepository).find_all_for_keys(
                stats_keys
            )
        }

        stats_by_period: dict[RecurringTaskPeriod | None, ScoreStats] = {}
        for period, key in zip(stats_periods, stats_keys, strict=False):
            existing_stats = existing_stats_by_key.get(key)
            if existing_stats is None:
                stats_by_period[period] = ScoreStats.new_score_stats(
                    ctx, score_log.ref_id, period, key[2]
                ).merge_score(ctx, new_score_log_entry)
            else:
                stats_by_period[period] = existing_stats.merge_score(
                    ctx, new_score_log_entry
                )

        await uow.get(ScoreStatsRepository).upsert_all(list(stats_by_period.values()))

        # Update high scores at write time, with the same batched read/write.

        best_specs: list[tuple[RecurringTaskPeriod | None, RecurringTaskPeriod]] = [
            (RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.DAILY),
            (RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.WEEKLY),
            (RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.MONTHLY),
            (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.DAILY),
            (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.WEEKLY),
            (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.MONTHLY),
            (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.QUARTERLY),
            (None, RecurringTaskPeriod.DAILY),
            (None, RecurringTaskPeriod.WEEKLY),
            (None, RecurringTaskPeriod.MONTHLY),
            (None, RecurringTaskPeriod.QUARTERLY),
            (None, RecurringTaskPeriod.YEARLY),
        ]
        best_keys = [
            (
                score_log.ref_id,
                period,
                infer_timeline(period, ctx.action_timestamp),
                sub_period,
            )
            for period, sub_period in best_specs
        ]
        existing_best_by_key = {
            existing.key: existing
            for existing in await uow.get(ScorePeriodBestRepository).find_all_for_keys(
                best_keys
            )
        }

        best_by_spec: dict[
            tuple[RecurringTaskPeriod | None, RecurringTaskPeriod], ScorePeriodBest
        ] = {}
        for (period, sub_period), best_key in zip(best_specs, best_keys, strict=False):
            existing_best = existing_best_by_key.get(best_key)
            sub_period_stats = stats_by_period[sub_period]
            if existing_best is None:
                best_by_spec[(period, sub_period)] = (
                    ScorePeriodBest.new_score_period_best(
                        ctx, score_log.ref_id, period, best_key[2], sub_period
                    ).update_to_max(ctx, sub_period_stats)
                )
            else:
                best_by_spec[(period, sub_period)] = existing_best.update_to_max(
                    ctx, sub_period_stats
                )

        await uow.get(ScorePeriodBestRepository).upsert_all(list(best_by_spec.values()))

        return RecordScoreResult(
            latest_task_score=new_score_log_entry.score,
            has_lucky_puppy_bonus=new_score_log_entry.has_lucky_puppy_bonus,
            score_overview=UserScoreOverview(
                daily_score=stats_by_period[RecurringTaskPeriod.DAILY].to_user_score(),
                weekly_score=stats_by_period[
                    RecurringTaskPeriod.WEEKLY
                ].to_user_score(),
                monthly_score=stats_by_period[
                    RecurringTaskPeriod.MONTHLY
                ].to_user_score(),
                quarterly_score=stats_by_period[
                    RecurringTaskPeriod.QUARTERLY
                ].to_user_score(),
                yearly_score=stats_by_period[
                    RecurringTaskPeriod.YEARLY
                ].to_user_score(),
                lifetime_score=stats_by_period[None].to_user_score(),
                best_quarterly_daily_score=best_by_spec[
                    (RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.DAILY)
                ].to_user_score(),
                best_quarterly_weekly_score=best_by_spec[
                    (RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.WEEKLY)
                ].to_user_score(),
                best_quarterly_monthly_score=best_by_spec[
                    (RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.MONTHLY)
                ].to_user_score(),
                best_yearly_daily_score=best_by_spec[
                    (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.DAILY)
                ].to_user_score(),
                best_yearly_weekly_score=best_by_spec[
                    (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.WEEKLY)
                ].to_user_score(),
                best_yearly_monthly_score=best_by_spec[
                    (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.MONTHLY)
                ].to_user_score(),
                best_yearly_quarterly_score=best_by_spec[
                    (RecurringTaskPeriod.YEARLY, RecurringTaskPeriod.QUARTERLY)
                ].to_user_score(),
                best_lifetime_daily_score=best_by_spec[
                    (None, RecurringTaskPeriod.DAILY)
                ].to_user_score(),
                best_lifetime_weekly_score=best_by_spec[
                    (None, RecurringTaskPeriod.WEEKLY)
                ].to_user_score(),
                best_lifetime_monthly_score=best_by_spec[
                    (None, RecurringTaskPeriod.MONTHLY)
                ].to_user_score(),
                best_lifetime_quarterly_score=best_by_spec[
                    (None, RecurringTaskPeriod.QUARTERLY)
                ].to_user_score(),
                best_lifetime_yearly_score=best_by_spec[
                    (None, RecurringTaskPeriod.YEARLY)
                ].to_user_score(),
            ),
        )
