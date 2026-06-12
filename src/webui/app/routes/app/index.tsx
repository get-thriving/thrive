import { Button, ButtonGroup } from "@mui/material";
import { Link, type ShouldRevalidateFunction } from "@remix-run/react";
import { useContext } from "react";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";

import { ServicePropertiesContext } from "~/logic/config";

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Index() {
  const serviceProperties = useContext(ServicePropertiesContext);

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />
        <Title />

        <CommunityLink />

        <DocsHelp
          size="medium"
          subject={DocsHelpSubject.ROOT}
          theId="docs-help"
        />
      </SmartAppBar>

      <LifecyclePanel>
        <ButtonGroup>
          <Button variant="contained" to="/app/workspace" component={Link}>
            Go To The Workspace
          </Button>
          <Button
            variant="outlined"
            href={serviceProperties.docsUrl}
            component={"a"}
          >
            Go To The Docs
          </Button>
        </ButtonGroup>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}
