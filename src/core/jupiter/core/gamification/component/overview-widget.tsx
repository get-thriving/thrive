import { WidgetProps } from "~/home/component/common";
import { ScoreOverview } from "~/gamification/component/score-overview";
import { StandardDivider } from "~/infra/component/standard-divider";

export function GamificationOverviewWidget(props: WidgetProps) {
  const gamification = props.gamificationOverview!;

  return (
    <>
      <StandardDivider title="Your Scores" size="large" />
      <ScoreOverview scoreOverview={gamification} />
    </>
  );
}
