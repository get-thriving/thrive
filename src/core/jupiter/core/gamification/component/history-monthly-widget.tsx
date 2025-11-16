import { WidgetProps } from "~/home/component/common";
import { ScoreHistory } from "~/gamification/component/score-history";

export function GamificationHistoryMonthlyWidget(props: WidgetProps) {
  const gamification = props.gamificationHistory!;

  return (
    <ScoreHistory
      scoreHistory={{
        daily_scores: [],
        weekly_scores: [],
        monthly_scores: gamification.monthly_scores,
        quarterly_scores: [],
      }}
    />
  );
}
