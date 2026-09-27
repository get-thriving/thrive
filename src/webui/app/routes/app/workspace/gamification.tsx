import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { ScoreHistory } from "@jupiter/core/gamification/component/score-history";
import { ScoreOverview } from "@jupiter/core/gamification/component/score-overview";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

export const handle = {
  displayType: DisplayType.TOOL,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const result = await apiClient.users.userLoad({});

  return {
    userScoreOverview: result.user_score_overview,
    userScoreHistory: result.user_score_history,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Gamification() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  return (
    <TrunkPanel key={"gamification"} returnLocation="/app/workspace">
      <ToolPanel>
        {loaderData.userScoreOverview && (
          <SectionCard title="💪 Scores Overview">
            <ScoreOverview scoreOverview={loaderData.userScoreOverview} />
          </SectionCard>
        )}
        {loaderData.userScoreHistory && (
          <SectionCard title="💪 Scores History">
            <ScoreHistory scoreHistory={loaderData.userScoreHistory} />
          </SectionCard>
        )}
      </ToolPanel>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () =>
    `There was an error displaying gamification information! Please try again!`,
});
