import type { Journal, JournalStats, Tag } from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  UserFeature,
  WorkspaceFeature,
} from "@jupiter/webapi-client";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { isUserFeatureAvailable } from "#/core/users/root";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { JournalSourceTag } from "#/core/journals/component/tag";
import { PeriodTag } from "#/core/common/component/period-tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";

export interface JournalShowOptions {
  showSource?: boolean;
  showPeriod?: boolean;
}

interface JournalCardProps {
  label?: string;
  topLevelInfo: TopLevelInfo;
  journal: Journal;
  journalStats?: JournalStats;
  tags?: Array<Tag>;
  showOptions: JournalShowOptions;
}

export function JournalCard(props: JournalCardProps) {
  const journal = props.journal;

  return (
    <EntityCard entityId={`journal-${journal.ref_id}`}>
      <EntityLink to={`/app/workspace/journals/${journal.ref_id}`}>
        <EntityNameComponent name={props.label ?? journal.name} />
        {props.showOptions.showSource && (
          <JournalSourceTag source={journal.source} />
        )}
        {props.showOptions.showPeriod && <PeriodTag period={journal.period} />}
        {props.tags?.map((tag) => (
          <TagTag key={tag.ref_id} tag={tag} />
        ))}
        {isUserFeatureAvailable(
          props.topLevelInfo.user,
          UserFeature.GAMIFICATION,
        ) &&
          props.journalStats && (
            <GamificationTag
              period={journal.period}
              journalStats={props.journalStats}
            />
          )}
        {props.journalStats &&
          props.journalStats.report.global_inbox_tasks_summary.done
            .total_cnt}{" "}
        tasks done
        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.BIG_PLANS,
        ) &&
          props.journalStats && (
            <>
              {" "}
              and {
                props.journalStats.report.global_big_plans_summary.done_cnt
              }{" "}
              big plans done
            </>
          )}
      </EntityLink>
    </EntityCard>
  );
}

interface GamificationTagProps {
  period: RecurringTaskPeriod;
  journalStats: JournalStats;
}

function GamificationTag({ period, journalStats }: GamificationTagProps) {
  if (!journalStats.report.user_score_overview) {
    return null;
  }

  const scoreOverview = journalStats.report.user_score_overview;

  switch (period) {
    case RecurringTaskPeriod.DAILY:
      return <>{scoreOverview.daily_score.total_score} points from </>;
    case RecurringTaskPeriod.WEEKLY:
      return <>{scoreOverview.weekly_score.total_score} points from </>;
    case RecurringTaskPeriod.MONTHLY:
      return <>{scoreOverview.monthly_score.total_score} points from </>;
    case RecurringTaskPeriod.QUARTERLY:
      return <>{scoreOverview.quarterly_score.total_score} points from </>;
    case RecurringTaskPeriod.YEARLY:
      return <>{scoreOverview.yearly_score.total_score} points from </>;
  }
}
