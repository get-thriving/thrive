import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parseQuery } from "zodix";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";

const QuerySchema = z.object({
  returnTo: z.string(),
});

export const handle = {
  displayType: DisplayType.ROOT,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const params = parseQuery(request, QuerySchema);
  const returnTo = Buffer.from(params.returnTo, "base64").toString("utf-8");
  return json({
    returnTo: returnTo,
  });
}

export default function RenderFix() {
  const loaderData = useLoaderData<typeof loader>();

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
          title="Oops"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="render-fix"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={true}
              actions={[
                NavSingle({
                  text: "Return",
                  link: loaderData.returnTo,
                }),
              ]}
            />
          }
        >
          <Typography>
            There seems to have been some application error.
          </Typography>

          <Typography>
            We&apos;ve recovered. Press the button below to return!
          </Typography>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}
