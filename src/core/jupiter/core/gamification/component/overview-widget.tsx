import { WidgetProps } from "#/core/home/component/common";
import { ScoreOverview } from "#/core/gamification/component/score-overview";
import { StandardDivider } from "#/core/infra/component/standard-divider";

export function GamificationOverviewWidget(props: WidgetProps) {
  const gamification = props.gamificationOverview!;

  return (
    <>
      <StandardDivider title="Your Scores" size="large" />
      <ScoreOverview scoreOverview={gamification} />
    </>
  );
}
