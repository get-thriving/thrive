import { ApiError, Chapter, LifePlan } from "@jupiter/webapi-client";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Divider, IconButton, Stack, styled } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useNavigation,
} from "@remix-run/react";
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
import {
  NavMultipleSpread,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import AddIcon from "@mui/icons-material/Add";
import {
  TopLevelInfo,
  TopLevelInfoContext,
} from "@jupiter/core/infra/top-level-context";
import { useContext } from "react";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { midDate } from "#/core/life_plan/partial-date";
import { DateTime } from "luxon";
import { sortChaptersNaturally } from "#/core/life_plan/sub/chapters/root";

import { getIntent, makeIntent } from "~/logic/intent";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateFormSchema = z.object({
  intent: z.string(),
});

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
  });
  const projectsResponse = await apiClient.lifePlan.projectFind({
    allow_archived: false,
    include_notes: false,
  });
  const chaptersResponse = await apiClient.lifePlan.chapterFind({
    allow_archived: false,
    include_notes: false,
  });
  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
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

export default function LifePlanView() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext<TopLevelInfo>(TopLevelInfoContext);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const inputsEnabled = navigation.state === "idle";

  const sortedProjects = sortProjectsByTreeOrder(
    loaderData.projects.map((entry) => entry.project),
  );
  const allProjectsByRefId = new Map(
    loaderData.projects.map((entry) => [entry.project.ref_id, entry.project]),
  );
  const allChaptersByProjectRefId = new Map<string, Chapter[]>();
  for (const entry of loaderData.chapters) {
    if (!allChaptersByProjectRefId.has(entry.chapter.project_ref_id)) {
      allChaptersByProjectRefId.set(entry.chapter.project_ref_id, []);
    }
    allChaptersByProjectRefId
      .get(entry.chapter.project_ref_id)!
      .push(entry.chapter);
  }

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
            }),
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

              const chapters =
                allChaptersByProjectRefId.get(project.ref_id) ?? [];
              const sortedChapters = sortChaptersNaturally(
                lifePlanBirthdayDate(loaderData.lifePlan),
                chapters,
              );
              const chapterPositions = computeChapterPosition(
                loaderData.lifePlan,
                sortedChapters,
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
                  <Stack direction="column">
                    <EntityLink
                      to={`/app/workspace/life-plan/projects/${project.ref_id}`}
                    >
                      <EntityNameComponent name={project.name} />
                    </EntityLink>

                    {sortedChapters && (
                      <>
                        <Divider />
                        <Box
                          sx={{
                            position: "relative",
                            height: `${0.25 + sortedChapters.length * 2.25}rem`,
                          }}
                        >
                          {sortedChapters.map((chapter) => {
                            const position = chapterPositions.get(
                              chapter.ref_id,
                            )!;
                            return (
                              <ChapterTimelineLink
                                key={`chapter-${chapter.ref_id}`}
                                to={`/app/workspace/life-plan/chapters/${chapter.ref_id}`}
                                left={position.left}
                                width={position.width}
                                top={position.top}
                              >
                                <EntityNameComponent name={chapter.name} />
                              </ChapterTimelineLink>
                            );
                          })}
                        </Box>
                      </>
                    )}
                  </Stack>
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

const ChapterTimelineLink = styled(Link)<{
  left: number;
  width: number;
  top: number;
}>(({ theme, left, width, top }) => ({
  position: "absolute",
  textDecoration: "none",
  color: theme.palette.info.dark,
  ":visited": {
    color: theme.palette.info.dark,
  },
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  paddingLeft: "0.5rem",
  left: `${left * 100}%`,
  width: `${width * 100}%`,
  height: "2rem",
  top: `${top}rem`,
  marginLeft: "0.25rem",
  marginRight: "0.25rem",
  marginBottom: "0.25rem",
  backgroundColor: theme.palette.action.hover,
  borderRadius: "0.25rem",
  border: `1px solid ${theme.palette.divider}`,
}));

function computeChapterPosition(
  lifePlan: LifePlan,
  chapters: Chapter[],
): Map<string, { left: number; top: number; width: number }> {
  const chapterPositions = new Map<
    string,
    { left: number; top: number; width: number }
  >();
  const birthdayDate = lifePlanBirthdayDate(lifePlan);

  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + 100,
    month: 12,
    day: 31,
  });

  const maxWidth = maxDate.diff(birthdayDate, "days").days;

  function computerChapterPosition(chapter: Chapter): {
    left: number;
    width: number;
  } {
    const startDate = midDate(birthdayDate, chapter.start_date);
    const endDate = midDate(birthdayDate, chapter.end_date);
    const left = Math.max(
      0,
      startDate.diff(birthdayDate, "days").days / maxWidth,
    );
    const width = Math.max(
      0.05,
      endDate.diff(startDate, "days").days / maxWidth,
    );
    return { left, width };
  }

  for (const [idx, chapter] of chapters.entries()) {
    const chapterPosition = computerChapterPosition(chapter);
    chapterPositions.set(chapter.ref_id, {
      left: chapterPosition.left,
      top: 0.25 + idx * 2.25,
      width: chapterPosition.width,
    });
  }

  return chapterPositions;
}
