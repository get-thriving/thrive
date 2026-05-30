import { DocsHelpSubject } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import {
  ActionsExpansion,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";

export default function UserAlreadyExists() {
  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />
        <Title />

        <CommunityLink />

        <DocsHelp size="medium" subject={DocsHelpSubject.ROOT} />
      </SmartAppBar>

      <LifecyclePanel>
        <SectionCard
          title="Account Unavailable"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="user-already-exists"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={true}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                NavSingle({
                  text: "Start a New Workspace",
                  link: "/app/lifecycle/init/local/create-user",
                  highlight: true,
                }),
                NavSingle({
                  text: "Login",
                  link: "/app/lifecycle/login/local/login",
                }),
              ]}
            />
          }
        >
          <Typography variant="body1">
            The user exists but has been archived. Contact support to reactivate
            it.
          </Typography>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading this page! Please try again!`,
});
