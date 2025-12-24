import { ApiError } from "@jupiter/webapi-client";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IconButton } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Form, Outlet, useActionData, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import {
  computeProjectDistanceFromRoot,
  isRootProject,
  shiftProjectDownInListOfChildren,
  shiftProjectUpInListOfChildren,
  sortProjectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";

import { getIntent, makeIntent } from "~/logic/intent";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";
import { NavMultipleSpread, NavSingle, SectionActions } from "#/core/infra/component/section-actions";
import AddIcon from "@mui/icons-material/Add";
import { TopLevelInfo, TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { useContext } from "react";

const UpdateFormSchema = z.object({
  intent: z.string(),
});

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const projectsResponse = await apiClient.lifePlan.projectFind({
    allow_archived: false,
    include_notes: false,
  });
  const chaptersResponse = await apiClient.lifePlan.chapterFind({
    allow_archived: false,
    include_notes: false,
  });
  return json({
    projects: projectsResponse.entries,
    chapters: chaptersResponse.entries,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  const { intent, args } = getIntent<{
    refId: string;
    newOrderOfChildProjects: string[];
  }>(form.intent);

  try {
    switch (intent) {
      case "reorder": {
        if (!args?.refId || !args?.newOrderOfChildProjects) {
          throw new Error("Missing required arguments!");
        }

        await apiClient.lifePlan.projectReorderChildren({
          ref_id: args?.refId,
          new_order_of_child_projects: args?.newOrderOfChildProjects,
        });

        return redirect("/app/workspace/life-plan");
      }

      default: {
        throw new Error(`Unhandled intent: ${intent}`);
      }
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

export default function LifePlan() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext<TopLevelInfo>(TopLevelInfoContext);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const inputsEnabled = navigation.state === "idle";

  const sortedProjects = sortProjectsByTreeOrder(
    loaderData.projects.map((entry) => entry.project),
  );
  const sortedChapters = loaderData.chapters.map((entry) => entry.chapter);
  const allProjectsByRefId = new Map(
    loaderData.projects.map((entry) => [entry.project.ref_id, entry.project]),
  );
  const allChaptersByRefId = new Map(
    loaderData.chapters.map((entry) => [entry.chapter.ref_id, entry.chapter]),
  );

  return (
    <TrunkPanel
      key={"projects"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="life-plan"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavMultipleSpread({
              navs: [
                NavSingle({
                  text: "New Project",
                  link: `/app/workspace/life-plan/projects/new`,
                  icon: <AddIcon />,
                }),
                NavSingle({
                  text: "New Chapter",
                  link: `/app/workspace/life-plan/chapters/new`,
                  icon: <AddIcon />,
                }),
              ],
            })
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <GlobalError actionResult={actionData} />
        <EntityStack>
          <Form method="post">
            {sortedProjects.map((project) => {
              const parentProject = project.parent_project_ref_id
                ? allProjectsByRefId.get(project.parent_project_ref_id)
                : undefined;
              const indent = computeProjectDistanceFromRoot(
                project,
                allProjectsByRefId,
              );
              return (
                <EntityCard
                  entityId={`project-${project.ref_id}`}
                  key={`project-${project.ref_id}`}
                  indent={indent}
                  extraControls={
                    isRootProject(project) ||
                    parentProject === undefined ? undefined : (
                      <>
                        <IconButton
                          size="medium"
                          type="submit"
                          name="intent"
                          value={makeIntent("reorder", {
                            refId: parentProject.ref_id,
                            newOrderOfChildProjects:
                              shiftProjectUpInListOfChildren(
                                project,
                                parentProject.order_of_child_projects,
                              ),
                          })}
                        >
                          <ArrowUpwardIcon fontSize="medium" />
                        </IconButton>

                        <IconButton
                          size="medium"
                          type="submit"
                          name="intent"
                          value={makeIntent("reorder", {
                            refId: parentProject.ref_id,
                            newOrderOfChildProjects:
                              shiftProjectDownInListOfChildren(
                                project,
                                parentProject.order_of_child_projects,
                              ),
                          })}
                        >
                          <ArrowDownwardIcon fontSize="medium" />
                        </IconButton>
                      </>
                    )
                  }
                >
                  <EntityLink
                    to={`/app/workspace/life-plan/projects/${project.ref_id}`}
                  >
                    <EntityNameComponent name={project.name} />
                  </EntityLink>
                </EntityCard>
              );
            })}

            {sortedChapters.map((chapter) => {
              return (
                <EntityCard
                  entityId={`chapter-${chapter.ref_id}`}
                  key={`chapter-${chapter.ref_id}`}
                >
                  <EntityLink
                    to={`/app/workspace/life-plan/chapters/${chapter.ref_id}`}
                  >
                    <EntityNameComponent name={chapter.name} />
                  </EntityLink>
                </EntityCard>
              );
            })}
          </Form>
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the life plan! Please try again!`,
});
