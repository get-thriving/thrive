import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { z } from "zod";
import { parseQuery } from "zodix";
import { PUBLISHED_ROUTE_PREFIX } from "@jupiter/core/common/sub/publish/published-share-url";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { Logo } from "@jupiter/core/infra/component/logo";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";
import { decodeRenderFixReturnTo } from "@jupiter/core/infra/render-fix-return-to";

const QuerySchema = z.object({
  returnTo: z.string(),
});

// This page has to work when the rest of the site doesn't, so it sits outside
// the publish shell: that layout loads top level info from the WebApi, and a
// recovery page shouldn't need the API to be answering.
export async function loader({ request }: LoaderFunctionArgs) {
  const params = parseQuery(request, QuerySchema);
  const returnTo = decodeRenderFixReturnTo(params.returnTo);

  // What was encoded is the path the browser showed, basename and all, but the
  // link below is a router link, which puts the basename back on itself.
  const withoutBasename = returnTo.startsWith(`${PUBLISHED_ROUTE_PREFIX}/`)
    ? returnTo.slice(PUBLISHED_ROUTE_PREFIX.length)
    : returnTo;

  return {
    returnTo: withoutBasename,
  };
}

export default function RenderFix() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />
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
