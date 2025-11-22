import { ApiError, SyncTarget, DocsHelpSubject } from "@jupiter/webapi-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import TuneIcon from "@mui/icons-material/Tune";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  SectionActions,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { getIntent } from "~/logic/intent";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("generate-first-note") }),
]);

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.workingMem.workingMemLoadCurrent({});
  return json({
    entry: response.entry,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  const { intent } = getIntent<undefined>(form.intent);

  try {
    switch (intent) {
      case "generate-first-note": {
        await apiClient.gen.genDo({
          gen_even_if_not_modified: false,
          gen_targets: [SyncTarget.WORKING_MEM],
        });

        return redirect("/app/workspace/working-mem");
      }

      default:
        throw new Error(`Unknown intent: ${intent}`);
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

export default function WorkingMem() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const navigation = useNavigation();
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <TrunkPanel
      key={"working-mem"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="working-mem-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavSingle({
              text: "Settings",
              link: "/app/workspace/working-mem/settings",
              icon: <TuneIcon />,
            }),
            NavSingle({
              text: "Archive",
              link: "/app/workspace/working-mem/archive",
              icon: <ArchiveIcon />,
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeafToo}
      >
        <ToolPanel>
          {loaderData.entry && (
            <SectionCard title="Working Mem">
              <EntityNoteEditor
                initialNote={loaderData.entry.note}
                inputsEnabled={inputsEnabled}
              />
            </SectionCard>
          )}

          {!loaderData.entry && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no working mems to show. You can create a new working mem."
              newEntityAction="generate-first-note"
              helpSubject={DocsHelpSubject.WORKING_MEM}
            />
          )}
        </ToolPanel>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the working mem! Please try again!`,
});
