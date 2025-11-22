import {
  ApiError,
  EntityId,
  HomeTab,
  HomeTabTarget,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import { z } from "zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { parseForm } from "zodix";
import { StatusCodes } from "http-status-codes";
import {
  Form,
  Outlet,
  ShouldRevalidateFunction,
  useActionData,
} from "@remix-run/react";
import { IconButton, Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  shiftTabDownInListOfTabs,
  shiftTabUpInListOfTabs,
  sortTabsByOrder,
} from "@jupiter/core/home/sub/tab/root";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import EntityIconComponent from "@jupiter/core/infra/component/entity-icon";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";
import { getIntent, makeIntent } from "~/logic/intent";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.object({
  intent: z.string(),
});

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const homeConfigResponse = await apiClient.home.homeConfigLoad({});

  return json({
    homeConfig: homeConfigResponse.home_config,
    tabs: homeConfigResponse.tabs,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  const { intent, args } = getIntent<{
    refId: string;
    newOrderOfTabs: EntityId[];
  }>(form.intent);

  try {
    switch (intent) {
      case "reorder-big-screen-tab": {
        if (!args?.refId || !args?.newOrderOfTabs) {
          throw new Error("Missing required arguments!");
        }

        await apiClient.home.reorderTabs({
          target: HomeTabTarget.BIG_SCREEN,
          order_of_tabs: args.newOrderOfTabs,
        });

        return redirect("/app/workspace/home/settings");
      }
      case "reorder-small-screen-tab": {
        if (!args?.refId || !args?.newOrderOfTabs) {
          throw new Error("Missing required arguments!");
        }

        await apiClient.home.reorderTabs({
          target: HomeTabTarget.SMALL_SCREEN,
          order_of_tabs: args.newOrderOfTabs,
        });

        return redirect("/app/workspace/home/settings");
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function HomeSettings() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const bigScreenTabs = sortTabsByOrder(
    loaderData.tabs.filter((tab) => tab.target === HomeTabTarget.BIG_SCREEN),
    loaderData.homeConfig.order_of_tabs[HomeTabTarget.BIG_SCREEN],
  );
  const smallScreenTabs = sortTabsByOrder(
    loaderData.tabs.filter((tab) => tab.target === HomeTabTarget.SMALL_SCREEN),
    loaderData.homeConfig.order_of_tabs[HomeTabTarget.SMALL_SCREEN],
  );

  return (
    <TrunkPanel
      key={"home/settings"}
      returnLocation="/app/workspace"
      createLocation="/app/workspace/home/settings/tabs/new"
    >
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeafToo}
      >
        <GlobalError actionResult={actionData} />
        <Form method="post">
          <Stack spacing={2} useFlexGap>
            {loaderData.tabs.length === 0 && (
              <EntityNoNothingCard
                title="You Have To Start Somewhere"
                message="There are no tabs to show. You can create a new tab."
                newEntityLocations="/app/workspace/home/settings/tabs/new"
                helpSubject={DocsHelpSubject.HOME}
              />
            )}

            <TabList
              title="Big Screen Tabs"
              tabs={bigScreenTabs}
              target={HomeTabTarget.BIG_SCREEN}
              reorderIntent="reorder-big-screen-tab"
              homeConfigRefId={loaderData.homeConfig.ref_id}
              orderOfTabs={
                loaderData.homeConfig.order_of_tabs[HomeTabTarget.BIG_SCREEN]
              }
            />

            <TabList
              title="Small Screen Tabs"
              tabs={smallScreenTabs}
              target={HomeTabTarget.SMALL_SCREEN}
              reorderIntent="reorder-small-screen-tab"
              homeConfigRefId={loaderData.homeConfig.ref_id}
              orderOfTabs={
                loaderData.homeConfig.order_of_tabs[HomeTabTarget.SMALL_SCREEN]
              }
            />
          </Stack>
        </Form>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/home",
  ParamsSchema,
  {
    notFound: () => `Could not find the home settings!`,
    error: () =>
      `There was an error loading the home settings! Please try again!`,
  },
);

interface TabListProps {
  title: string;
  tabs: HomeTab[];
  target: HomeTabTarget;
  reorderIntent: string;
  homeConfigRefId: string;
  orderOfTabs: EntityId[];
}

function TabList(props: TabListProps) {
  if (props.tabs.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1} useFlexGap>
      <StandardDivider title={props.title} size="small" />
      {props.tabs.map((tab) => (
        <EntityCard
          entityId={`home-tab-${tab.ref_id}`}
          key={`home-tab-${tab.ref_id}`}
          indent={0}
          extraControls={
            <>
              <IconButton
                size="medium"
                type="submit"
                name="intent"
                value={makeIntent(props.reorderIntent, {
                  refId: props.homeConfigRefId,
                  newOrderOfTabs: shiftTabUpInListOfTabs(
                    tab,
                    props.orderOfTabs,
                  ),
                })}
              >
                <ArrowUpwardIcon fontSize="medium" />
              </IconButton>

              <IconButton
                size="medium"
                type="submit"
                name="intent"
                value={makeIntent(props.reorderIntent, {
                  refId: props.homeConfigRefId,
                  newOrderOfTabs: shiftTabDownInListOfTabs(
                    tab,
                    props.orderOfTabs,
                  ),
                })}
              >
                <ArrowDownwardIcon fontSize="medium" />
              </IconButton>
            </>
          }
        >
          <EntityLink to={`/app/workspace/home/settings/tabs/${tab.ref_id}`}>
            {tab.icon && <EntityIconComponent icon={tab.icon} />}
            <EntityNameComponent name={tab.name} />
          </EntityLink>
        </EntityCard>
      ))}
    </Stack>
  );
}
