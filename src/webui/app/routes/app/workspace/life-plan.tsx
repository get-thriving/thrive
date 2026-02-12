import {
  ApiError,
  Chapter,
  LifePlan,
  Goal,
  Milestone,
  MilestoneSummary,
} from "@jupiter/webapi-client";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, lighten, useTheme } from "@mui/material/styles";
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
import HistoryIcon from "@mui/icons-material/History";
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
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  NavMultipleCompact,
  NavMultipleSpread,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import AddIcon from "@mui/icons-material/Add";
import {
  TopLevelInfo,
  TopLevelInfoContext,
} from "@jupiter/core/infra/top-level-context";
import TuneIcon from "@mui/icons-material/Tune";
import { Fragment, useContext, useState } from "react";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { isMilestonePartialDate, midDate } from "#/core/life_plan/partial-date";
import { DateTime } from "luxon";
import { sortChaptersNaturally } from "#/core/life_plan/sub/chapters/root";
import { aDateToDate } from "#/core/common/adate";
import { sortMilestonesNaturally } from "#/core/life_plan/sub/milestones/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import { VisionSnippet } from "#/core/life_plan/sub/visions/components/snippet";

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
  const activeVision = await apiClient.lifePlan.visionLoadActive({});
  const projectsResponse = await apiClient.lifePlan.projectFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
  });
  const chaptersResponse = await apiClient.lifePlan.chapterFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
  });
  const goalsResponse = await apiClient.lifePlan.goalFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
  });
  const milestonesResponse = await apiClient.lifePlan.milestoneFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
  });
  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
    activeVision: activeVision.vision,
    activeVisionNote: activeVision.note,
    projects: projectsResponse.entries,
    chapters: chaptersResponse.entries,
    goals: goalsResponse.entries,
    milestones: milestonesResponse.entries,
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
  const theme = useTheme();
  const topLevelInfo = useContext<TopLevelInfo>(TopLevelInfoContext);
  const today = aDateToDate(topLevelInfo.today);
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();
  const actionData = useActionData<typeof action>();
  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const inputsEnabled = navigation.state === "idle";
  const [hoveredMilestoneRefId, setHoveredMilestoneRefId] = useState<
    string | null
  >(null);

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
  const allGoalsByProjectRefId = new Map<string, Goal[]>();
  for (const entry of loaderData.goals) {
    if (!allGoalsByProjectRefId.has(entry.goal.project_ref_id)) {
      allGoalsByProjectRefId.set(entry.goal.project_ref_id, []);
    }
    allGoalsByProjectRefId.get(entry.goal.project_ref_id)!.push(entry.goal);
  }
  const sortedMilestones = sortMilestonesNaturally(
    loaderData.milestones.map((entry) => entry.milestone),
  );
  const { totalRows, milestonePositions } = computeMilestonePositions(
    loaderData.lifePlan,
    sortedMilestones,
  );
  const todayMiddle = computeTodayMiddle(loaderData.lifePlan, today);

  const yearMarkers = Array.from({ length: 10 }, (_, idx) => {
    return {
      year: loaderData.lifePlan.birth_year + idx * 10,
      left: idx * 10,
      age: idx * 10,
    };
  });

  const maxIndent = Math.max(
    ...sortedProjects.map((project) =>
      computeProjectDistanceFromRoot(project, allProjectsByRefId),
    ),
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
                  text: "New Vision",
                  link: `/app/workspace/life-plan/visions/new-draft`,
                  icon: <AddIcon />,
                }),
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
                NavSingle({
                  text: "New Goal",
                  link: `/app/workspace/life-plan/goals/new`,
                  icon: <AddIcon />,
                }),
                NavSingle({
                  text: "New Milestone",
                  link: `/app/workspace/life-plan/milestones/new`,
                  icon: <AddIcon />,
                }),
              ],
            }),
            NavMultipleCompact({
              navs: [
                NavSingle({
                  text: "",
                  link: `/app/workspace/life-plan/settings`,
                  icon: <TuneIcon />,
                }),
                NavSingle({
                  text: "Vision History",
                  link: `/app/workspace/life-plan/visions`,
                  icon: <TuneIcon />,
                }),
                NavSingle({
                  text: "Projects",
                  link: `/app/workspace/life-plan/projects`,
                  icon: <TuneIcon />,
                }),
                NavSingle({
                  text: "Chapters",
                  link: `/app/workspace/life-plan/chapters`,
                  icon: <TuneIcon />,
                }),
                NavSingle({
                  text: "Goals",
                  link: `/app/workspace/life-plan/goals`,
                  icon: <TuneIcon />,
                }),
                NavSingle({
                  text: "Milestones",
                  link: `/app/workspace/life-plan/milestones`,
                  icon: <TuneIcon />,
                }),
                NavSingle({
                  text: "History of Work",
                  link: `/app/workspace/life-plan/history-of-work`,
                  icon: <HistoryIcon />,
                }),
              ],
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock
        shouldHide={shouldShowALeaf || shouldShowALeaflet}
        branchForceHide={shouldShowABranch}
      >
        <GlobalError actionResult={actionData} />
        <EntityStack>
          <Form method="post" style={{ position: "relative" }}>
            <SectionLabeled label="Vision">
              <VisionSnippet
                vision={loaderData.activeVision ?? undefined}
                note={loaderData.activeVisionNote ?? undefined}
              />
            </SectionLabeled>

            {isBigScreen && (
              <SectionLabeled label="Milestones">
                <>
                  <Box
                    sx={{
                      border: (theme) => `2px dotted ${theme.palette.divider}`,
                      borderRadius: "4px",
                      position: "relative",
                      paddingLeft: "0.5rem",
                      height: `${0.25 + totalRows * 1.25 + 1}rem`,
                      minHeight: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {sortedMilestones.length == 0 && (
                      <>
                        <Typography variant="body2">
                          You need to create some milestones
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          component={Link}
                          to="/app/workspace/life-plan/milestones/new"
                          sx={{ flexShrink: 0 }}
                        >
                          Create New Milestone
                        </Button>
                      </>
                    )}

                    {sortedMilestones.map((milestone) => {
                      const isHighlighted =
                        hoveredMilestoneRefId === milestone.ref_id;
                      return (
                        <Tooltip
                          key={`milestone-${milestone.ref_id}`}
                          title={milestone.name}
                          placement="top"
                        >
                          <MilestoneTimelineLink
                            to={`/app/workspace/life-plan/milestones/${milestone.ref_id}`}
                            indent={maxIndent}
                            left={
                              milestonePositions.get(milestone.ref_id)!.left
                            }
                            width={
                              milestonePositions.get(milestone.ref_id)!.width
                            }
                            top={milestonePositions.get(milestone.ref_id)!.top}
                            highlighted={isHighlighted}
                            onMouseEnter={() =>
                              setHoveredMilestoneRefId(milestone.ref_id)
                            }
                            onMouseLeave={() => setHoveredMilestoneRefId(null)}
                          >
                            {milestone.name}
                          </MilestoneTimelineLink>
                        </Tooltip>
                      );
                    })}
                  </Box>

                  <Box
                    sx={{
                      marginLeft: `${maxIndent}rem`,
                      position: "relative",
                      height: "1.5rem",
                    }}
                  >
                    {yearMarkers.map((yearMarker) => {
                      return (
                        <YearMarker
                          key={`year-marker-${yearMarker.year}`}
                          left={yearMarker.left}
                          top={0.25}
                        >
                          {yearMarker.year}
                          {yearMarker.age > 0 ? ` (${yearMarker.age}s)` : ""}
                        </YearMarker>
                      );
                    })}
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      marginLeft: `${maxIndent}rem`,
                      width: `calc(100% - ${maxIndent}rem)`,
                      height: "-webkit-fill-available",
                    }}
                  >
                    <Tooltip title="Today" placement="top">
                      <TodayVertical middle={todayMiddle} top={0} blur={0} />
                    </Tooltip>
                    {sortedMilestones.map((milestone) => {
                      const isHighlighted =
                        hoveredMilestoneRefId === milestone.ref_id;
                      return (
                        <Tooltip
                          key={`milestone-tooltip-${milestone.ref_id}`}
                          title={`${milestone.name} on ${milestone.date}`}
                          placement="top"
                        >
                          <MilestoneVertical
                            middle={
                              milestonePositions.get(milestone.ref_id)!.middle
                            }
                            top={0}
                            blur={computeFutureBlurForPoint(
                              milestonePositions.get(milestone.ref_id)!.middle,
                              todayMiddle,
                              loaderData.lifePlan.max_age,
                            )}
                            highlighted={isHighlighted}
                            onMouseEnter={() =>
                              setHoveredMilestoneRefId(milestone.ref_id)
                            }
                            onMouseLeave={() => setHoveredMilestoneRefId(null)}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                </>
              </SectionLabeled>
            )}

            <SectionLabeled label="Projects, Chapters, and Goals">
              <>
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
                  const goals =
                    allGoalsByProjectRefId.get(project.ref_id) ?? [];
                  const sortedChapters = sortChaptersNaturally(
                    lifePlanBirthdayDate(loaderData.lifePlan),
                    today,
                    chapters,
                    sortedMilestones,
                    sortedProjects,
                  );
                  const { totalRows, chapterPositions } =
                    computeChapterPositions(
                      today,
                      loaderData.lifePlan,
                      sortedChapters,
                      sortedMilestones,
                    );

                  return (
                    <EntityCard
                      entityId={`project-${project.ref_id}`}
                      key={`project-${project.ref_id}`}
                      indent={indent}
                    >
                      <Stack direction="column">
                        <Stack direction="row">
                          <EntityLink
                            to={`/app/workspace/life-plan/projects/${project.ref_id}`}
                          >
                            <EntityNameComponent name={`⭐ ${project.name}`} />
                          </EntityLink>

                          {isRootProject(project) ||
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
                          )}
                        </Stack>

                        {sortedChapters.length > 0 && (
                          <>
                            <Divider />
                            <Box
                              sx={{
                                marginLeft: `${maxIndent - indent}rem`,
                                position: "relative",
                                height: `${0.25 + totalRows * 2.25}rem`,
                              }}
                            >
                              {sortedChapters.map((chapter) => {
                                const position = chapterPositions.get(
                                  chapter.ref_id,
                                )!;
                                const { fadeStart, fadeEnd } =
                                  computeFutureFuzzinessForInterval(
                                    position.left,
                                    position.left + position.width,
                                    todayMiddle,
                                    loaderData.lifePlan.max_age,
                                  );
                                const chapterTextColor = lighten(
                                  theme.palette.info.dark,
                                  fadeStart,
                                );
                                return (
                                  <Fragment key={`chapter-${chapter.ref_id}`}>
                                    {isMilestonePartialDate(
                                      chapter.start_date,
                                    ) && (
                                      <ChapterMilestoneLink
                                        left={position.left}
                                        top={position.top}
                                      />
                                    )}
                                    <Tooltip
                                      title={chapter.name}
                                      placement="top"
                                    >
                                      <ChapterTimelineLink
                                        to={`/app/workspace/life-plan/chapters/${chapter.ref_id}`}
                                        left={position.left}
                                        width={position.width}
                                        top={position.top}
                                        indent={0}
                                        fadestart={fadeStart}
                                        fadeend={fadeEnd}
                                      >
                                        <EntityNameComponent
                                          name={`📖 ${chapter.name}`}
                                          color={chapterTextColor}
                                        />
                                      </ChapterTimelineLink>
                                    </Tooltip>
                                    {isMilestonePartialDate(
                                      chapter.end_date,
                                    ) && (
                                      <ChapterMilestoneLink
                                        left={position.left + position.width}
                                        top={position.top}
                                      />
                                    )}
                                  </Fragment>
                                );
                              })}
                            </Box>
                          </>
                        )}

                        {goals.length > 0 && (
                          <>
                            <Divider />
                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              flexWrap="wrap"
                              sx={{
                                paddingTop: "0.5rem",
                                paddingBottom: "0.5rem",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                              }}
                            >
                              {buildGoalForest(goals).map((node) =>
                                renderGoalRoot(node),
                              )}
                            </Stack>
                          </>
                        )}
                      </Stack>
                    </EntityCard>
                  );
                })}
              </>
            </SectionLabeled>
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

interface TimelineLinkProps {
  left: number;
  width: number;
  top: number;
  indent: number;
}

interface ChapterTimelineLinkProps extends TimelineLinkProps {
  fadestart: number;
  fadeend: number;
}

const ChapterTimelineLink = styled(Link)<ChapterTimelineLinkProps>(
  ({ theme, left, width, top, fadestart: fadeStart, fadeend: fadeEnd }) => ({
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
    background: `linear-gradient(90deg, ${lighten(
      theme.palette.action.hover,
      fadeStart,
    )} 0%, ${lighten(theme.palette.action.hover, fadeEnd)} 100%)`,
    borderRadius: "0.25rem",
    border: `1px solid transparent`,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      padding: "1px",
      background: `linear-gradient(90deg, ${lighten(
        theme.palette.divider,
        fadeStart,
      )} 0%, ${lighten(theme.palette.divider, fadeEnd)} 100%)`,
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      pointerEvents: "none",
    },
  }),
);

interface ChapterMilestoneLinkProps {
  left: number;
  top: number;
}

const ChapterMilestoneLink = styled("div")<ChapterMilestoneLinkProps>(
  ({ theme, left, top }) => ({
    position: "absolute",
    textDecoration: "none",
    left: `${left * 100}%`,
    top: `${top + 0.8}rem`,
    width: "0.4rem",
    height: "0.4rem",
    backgroundColor: theme.palette.error.light,
    zIndex: theme.zIndex.appBar,
    borderRadius: "0.15rem",
  }),
);

const MilestoneTimelineLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "highlighted",
})<TimelineLinkProps & { highlighted?: boolean }>(
  ({ theme, left, width, top, indent, highlighted }) => ({
    position: "absolute",
    textDecoration: "none",
    color: theme.palette.info.dark,
    ":visited": {
      color: theme.palette.info.dark,
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    lineHeight: "1rem",
    textAlign: "center",
    left: `calc(${indent}rem + ${left * 100}%)`,
    width: `${width * 100}%`,
    height: "1rem",
    top: `${top}rem`,
    marginLeft: "0.25rem",
    marginRight: "0.25rem",
    marginBottom: "0.25rem",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "0.1rem",
    backgroundColor: highlighted
      ? alpha(theme.palette.info.main, 0.12)
      : "transparent",
    borderColor: highlighted ? theme.palette.info.main : theme.palette.divider,
    "&:hover": {
      borderColor: theme.palette.info.main,
      backgroundColor: alpha(theme.palette.info.main, 0.12),
      color: theme.palette.info.main,
    },
  }),
);

interface MilestoneVerticalProps {
  middle: number;
  top: number;
  blur: number;
}

const MilestoneVertical = styled("div", {
  shouldForwardProp: (prop) => prop !== "highlighted",
})<MilestoneVerticalProps & { highlighted?: boolean }>(({
  theme,
  middle,
  top,
  blur,
  highlighted,
}) => {
  const dimColor = alpha(theme.palette.info.main, 0.1);
  return {
    position: "absolute",
    left: `${middle * 100}%`,
    top: `${top}rem`,
    width: "2px",
    height: "100%",
    zIndex: theme.zIndex.appBar,
    transform: "scaleY(1.05)",
    filter: `blur(${blur}px)`,
    cursor: "pointer",
    backgroundColor: highlighted ? theme.palette.info.main : "transparent",
    backgroundImage: highlighted
      ? "none"
      : `repeating-linear-gradient(to bottom, ${dimColor} 0, ${dimColor} 8px, transparent 8px, transparent 14px)`,
    "&:hover": {
      backgroundColor: theme.palette.info.main,
      backgroundImage: "none",
    },
  };
});

const TodayVertical = styled("div")<MilestoneVerticalProps>(
  ({ theme, middle, top, blur }) => ({
    position: "absolute",
    left: `${middle * 100}%`,
    top: `${top}rem`,
    width: "2px",
    height: "100%",
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.info.main,
    filter: `blur(${blur}px)`,
  }),
);

interface YearMarkerProps {
  left: number;
  top: number;
}

const YearMarker = styled("div")<YearMarkerProps>(({ theme, left, top }) => ({
  position: "absolute",
  left: `${left}%`,
  top: `${top}rem`,
  lineHeigh: "1rem",
  height: "1rem",
  textAlign: "center",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));

const SectionLabel = styled("div")(({ theme }) => ({
  width: "1.5rem",
  maxWidth: "1.5rem",
  minHeight: "3rem",
  display: "flex",
  alignItems: "center",
  paddingBottom: "0.25rem",
  justifyContent: "flex-end",
  borderRadius: "0.25rem",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  letterSpacing: "0.05rem",
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  transform: "rotate(180deg)",
  userSelect: "none",
}));

function SectionLabeled(props: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "stretch", gap: 1, width: "100%" }}>
      <SectionLabel>{props.label}</SectionLabel>
      <Box sx={{ flex: 1, minWidth: 0 }}>{props.children}</Box>
    </Box>
  );
}

function computeChapterPositions(
  today: DateTime,
  lifePlan: LifePlan,
  chapters: Chapter[],
  milestones: MilestoneSummary[],
): {
  totalRows: number;
  chapterPositions: Map<string, { left: number; top: number; width: number }>;
} {
  const chapterPositions = new Map<
    string,
    { left: number; top: number; width: number }
  >();
  const birthdayDate = lifePlanBirthdayDate(lifePlan);

  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + lifePlan.max_age,
    month: 12,
    day: 31,
  });

  const maxWidth = maxDate.diff(birthdayDate, "days").days;

  function computeForOne(chapter: Chapter): {
    left: number;
    width: number;
    right: number;
  } {
    const startDate = DateTime.max(
      birthdayDate,
      midDate(chapter.start_date, birthdayDate, today, milestones),
    );
    const endDate = midDate(chapter.end_date, birthdayDate, today, milestones);
    const left = Math.max(
      0,
      startDate.diff(birthdayDate, "days").days / maxWidth,
    );
    const width = Math.max(
      0.05,
      endDate.diff(startDate, "days").days / maxWidth,
    );
    const right = Math.min(1, left + width);
    return { left, width, right };
  }

  // We pack chapters into rows based on their position on the 0..1 life timeline,
  // not on their dates directly. This behaves much better for tiny-width elements.
  const rows: Array<number> = [];
  let rowIdx = -1;

  for (const chapter of chapters) {
    const chapterPosition = computeForOne(chapter);
    let usefulRowIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (chapterPosition.left >= rows[i]) {
        usefulRowIdx = i;
        break;
      }
    }

    if (usefulRowIdx === -1) {
      rowIdx++;
      rows[rowIdx] = chapterPosition.right;
      usefulRowIdx = rowIdx;
    } else {
      rows[usefulRowIdx] = chapterPosition.right;
    }

    chapterPositions.set(chapter.ref_id, {
      left: chapterPosition.left,
      top: 0.25 + usefulRowIdx * 2.25,
      width: chapterPosition.width,
    });
  }

  return { totalRows: rowIdx + 1, chapterPositions: chapterPositions };
}

function computeMilestonePositions(
  lifePlan: LifePlan,
  milestones: Milestone[],
): {
  totalRows: number;
  milestonePositions: Map<
    string,
    { left: number; middle: number; top: number; width: number }
  >;
} {
  const milestonePositions = new Map<
    string,
    { left: number; middle: number; top: number; width: number }
  >();
  const birthdayDate = lifePlanBirthdayDate(lifePlan);
  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + lifePlan.max_age,
    month: 12,
    day: 31,
  });
  const maxWidth = maxDate.diff(birthdayDate, "days").days;

  function computeForOne(milestone: Milestone): {
    left: number;
    width: number;
    middle: number;
  } {
    const middle =
      aDateToDate(milestone.date).diff(birthdayDate, "days").days / maxWidth;
    const left = Math.max(0, middle - 0.075 / 2);
    const width = Math.max(0.075 / 2, 0.075);
    return {
      left: left,
      width: width,
      middle: middle,
    };
  }

  const rows: Array<number> = [];
  let rowIdx = -1;

  for (const milestone of milestones) {
    const milestonePosition = computeForOne(milestone);
    let usefulRowIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (milestonePosition.left >= rows[i]) {
        usefulRowIdx = i;
        break;
      }
    }

    if (usefulRowIdx === -1) {
      rowIdx++;
      rows[rowIdx] = milestonePosition.left + milestonePosition.width;
      usefulRowIdx = rowIdx;
    } else {
      rows[usefulRowIdx] = milestonePosition.left + milestonePosition.width;
    }

    milestonePositions.set(milestone.ref_id, {
      left: milestonePosition.left,
      middle: milestonePosition.middle,
      top: 0.25 + usefulRowIdx * 1.25,
      width: milestonePosition.width,
    });
  }
  return { totalRows: rowIdx + 1, milestonePositions: milestonePositions };
}

function computeTodayMiddle(lifePlan: LifePlan, today: DateTime): number {
  const birthdayDate = lifePlanBirthdayDate(lifePlan);
  const maxDate = DateTime.fromObject({
    year: lifePlan.birth_year + lifePlan.max_age,
    month: 12,
    day: 31,
  });
  const maxWidth = maxDate.diff(birthdayDate, "days").days;
  if (maxWidth <= 0) {
    return 0;
  }
  return Math.min(
    1,
    Math.max(0, today.diff(birthdayDate, "days").days / maxWidth),
  );
}

const FUTURE_FUZZINESS_HORIZON_YEARS = 20;
const FUTURE_FUZZINESS_MIN_COLOR_STRENGTH = 0.3;

function computeFutureFuzzinessForInterval(
  left: number,
  right: number,
  todayMiddle: number,
  maxAge: number,
): { fadeStart: number; fadeEnd: number } {
  const futureFuzzinessHorizon = Math.min(
    1,
    FUTURE_FUZZINESS_HORIZON_YEARS / maxAge,
  );

  if (futureFuzzinessHorizon <= 0) {
    return { fadeStart: 0, fadeEnd: 0 };
  }

  const computeOne = (x: number) => {
    const distanceIntoFuture = x - todayMiddle;
    if (distanceIntoFuture <= 0) {
      return 0;
    }
    const normalized = Math.min(1, distanceIntoFuture / futureFuzzinessHorizon);
    // Interpret "minimum 30%" as minimum remaining "color strength" (how much of the
    // original color remains). So:
    // - At today: 100% strength -> 0% fade-to-white
    // - At horizon: 30% strength -> 70% fade-to-white
    return (1 - FUTURE_FUZZINESS_MIN_COLOR_STRENGTH) * normalized;
  };

  return {
    fadeStart: computeOne(left),
    fadeEnd: computeOne(right),
  };
}

function computeFutureBlurForPoint(
  middle: number,
  todayMiddle: number,
  maxAge: number,
): number {
  const futureFuzzinessHorizon = Math.min(
    1,
    FUTURE_FUZZINESS_HORIZON_YEARS / maxAge,
  );
  if (futureFuzzinessHorizon <= 0) {
    return 0;
  }

  const distanceIntoFuture = middle - todayMiddle;
  if (distanceIntoFuture <= 0) {
    return 0;
  }

  const normalized = Math.min(1, distanceIntoFuture / futureFuzzinessHorizon);
  return 2 * normalized;
}

type GoalNode = {
  goal: Goal;
  children: GoalNode[];
};

function buildGoalForest(goals: Goal[]): GoalNode[] {
  const sortedGoals = sortGoalsNaturally(goals);
  const nodesByRefId = new Map<string, GoalNode>();
  for (const goal of sortedGoals) {
    nodesByRefId.set(goal.ref_id, { goal, children: [] });
  }

  const roots: GoalNode[] = [];
  for (const goal of sortedGoals) {
    const node = nodesByRefId.get(goal.ref_id)!;
    const parentRefId = goal.parent_goal_ref_id ?? null;
    const parent = parentRefId ? nodesByRefId.get(parentRefId) : undefined;
    if (!parent || parentRefId === goal.ref_id) {
      roots.push(node);
      continue;
    }
    parent.children.push(node);
  }

  return roots;
}

function renderGoalRoot(node: GoalNode): JSX.Element {
  return (
    <Box
      key={`goal-root-${node.goal.ref_id}`}
      sx={{
        flexBasis: "16rem",
        paddingRight: "0.5rem",
      }}
    >
      <EntityLink
        inline
        singleLine
        to={`/app/workspace/life-plan/goals/${node.goal.ref_id}`}
      >
        <EntityNameComponent name={`🎯 ${node.goal.name}`} />
      </EntityLink>
      {node.children.length > 0 && (
        <Box sx={{ paddingTop: "0.25rem" }}>
          {node.children.map((child) => renderGoalNode(child, 1))}
        </Box>
      )}
    </Box>
  );
}

function renderGoalNode(node: GoalNode, depth: number): JSX.Element {
  return (
    <Box
      key={`goal-${node.goal.ref_id}`}
      sx={{
        paddingLeft: `${depth * 1}rem`,
        paddingBottom: "0.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <EntityLink
        inline
        singleLine
        to={`/app/workspace/life-plan/goals/${node.goal.ref_id}`}
      >
        <EntityNameComponent name={`🎯 ${node.goal.name}`} />
      </EntityLink>
      {node.children.length > 0 &&
        node.children.map((child) => renderGoalNode(child, depth + 1))}
    </Box>
  );
}
