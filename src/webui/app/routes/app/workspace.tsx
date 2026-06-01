import {
  type Contact,
  DocsHelpSubject,
  type Tag,
  UserFeature,
} from "@jupiter/webapi-client";
import { Settings } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PolicyIcon from "@mui/icons-material/Policy";
import SecurityIcon from "@mui/icons-material/Security";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Form, Link, useOutlet } from "@remix-run/react";
import { AnimatePresence, useAnimate } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { isUserFeatureAvailable } from "@jupiter/core/users/root";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import {
  ScoreSnackbarManager,
  useScoreActionSingleton,
} from "@jupiter/core/gamification/component/score-snackbar-manager";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { WorkspaceContainer } from "@jupiter/core/infra/component/layout/workspace-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { ReleaseUpdateWidget } from "@jupiter/core/infra/component/release-update-widget";
import { SearchWidget } from "@jupiter/core/search/components/search-widget";
import Sidebar from "@jupiter/core/infra/component/sidebar";
import { Title } from "@jupiter/core/infra/component/title";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { TopLevelInfoProvider } from "@jupiter/core/infra/component/top-level-info-provider";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";
import editorJsTweaks from "~/styles/editorjs-tweaks.css";

const WorkspaceAppBarTrailing = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flexShrink: 0,
  marginLeft: "auto",
  [theme.breakpoints.up("sm")]: {
    marginLeft: 0,
  },
}));

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: editorJsTweaks },
];

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.application.loadTopLevelInfo({});

  if (!response.user) {
    return redirect("/app/lifecycle/init/local/create-user");
  }
  if (!response.user.verified) {
    return redirect("/app/lifecycle/init/verification/start");
  }
  if (!response.workspace) {
    return redirect(
      `/app/lifecycle/init/create-workspace?userId=${response.user.ref_id}`,
    );
  }

  const progressReporterTokenResponse =
    await apiClient.application.loadProgressReporterToken({});
  const allTagsResponse = await apiClient.tags.tagFind({
    allow_archived: false,
  });
  const allContactsResponse = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  return json({
    userFeatureFlagControls: response.user_feature_flag_controls,
    workspaceFeatureFlagControls: response.workspace_feature_flag_controls,
    user: response.user,
    userScoreOverview: response.user_score_overview,
    workspace: response.workspace,
    allTags: allTagsResponse.tags as Array<Tag>,
    allContacts: allContactsResponse.contacts as Array<Contact>,
    progressReporterToken:
      progressReporterTokenResponse.progress_reporter_token_ext,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextUrl }) => {
  return nextUrl.searchParams.has("invalidateTopLevel");
};

// @secureFn
export default function Workspace() {
  const outlet = useOutlet();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const isBigScreen = useBigScreen();
  const [showSidebar, setShowSidebar] = useState(isBigScreen);
  const scoreAction = useScoreActionSingleton();
  const globalProperties = useContext(GlobalPropertiesContext);

  const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const accountMenuOpen = Boolean(accountMenuAnchorEl);
  const handleAccountMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const [badgeRef, animateBadge] = useAnimate();

  useEffect(() => {
    if (!scoreAction) return;
    animateBadge(badgeRef.current, { scale: 1.2 }, { duration: 0.15 }).then(
      () => {
        animateBadge(badgeRef.current, { scale: 1 }, { duration: 0.15 });
      },
    );
  }, [animateBadge, badgeRef, scoreAction]);

  // Checkout https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  // for reasoning.
  function updateOurOwnVh() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    updateOurOwnVh();
    // We listen to the resize event
    window.addEventListener("resize", updateOurOwnVh);
    return () => {
      window.removeEventListener("resize", updateOurOwnVh);
    };
  }, []);

  return (
    <TopLevelInfoProvider
      user={loaderData.user}
      workspace={loaderData.workspace}
      userFeatureFlagControls={loaderData.userFeatureFlagControls}
      workspaceFeatureFlagControls={loaderData.workspaceFeatureFlagControls}
      userScoreOverview={loaderData.userScoreOverview}
    >
      <WorkspaceContainer>
        <SmartAppBar>
          <IconButton
            id="show-sidebar"
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setShowSidebar((s) => !s)}
          >
            <MenuIcon />
          </IconButton>

          <Title hideOnSmallScreen />

          <WorkspaceAppBarTrailing>
            <SearchWidget
              allTags={loaderData.allTags}
              allContacts={loaderData.allContacts}
            />

            {/* <ProgressReporter token={loaderData.progressReporterToken} /> */}

            <CommunityLink />

            <DocsHelp
              size="medium"
              subject={DocsHelpSubject.ROOT}
              theId="docs-help"
            />

            <IconButton
              id="account-menu"
              onClick={handleAccountMenuClick}
              size="large"
              color="inherit"
            >
              <Badge
                ref={badgeRef}
                badgeContent={
                  scoreAction
                    ? scoreAction.daily_total_score
                    : loaderData.userScoreOverview?.daily_score.total_score
                }
                color="success"
              >
                <Avatar
                  sx={{ width: "1.75rem", height: "1.75rem" }}
                  alt={loaderData.user.name}
                  src={loaderData.user.avatar}
                />
              </Badge>
            </IconButton>
          </WorkspaceAppBarTrailing>

          <Menu
            id="basic-menu"
            anchorEl={accountMenuAnchorEl}
            open={accountMenuOpen}
            onClose={handleAccountMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {isUserFeatureAvailable(
              loaderData.user,
              UserFeature.GAMIFICATION,
            ) && (
              <MenuItem
                to="/app/workspace/gamification"
                component={Link}
                onClick={handleAccountMenuClose}
              >
                <ListItemIcon>
                  <SportsEsportsIcon />
                </ListItemIcon>
                <ListItemText>
                  Today:{" "}
                  {scoreAction
                    ? scoreAction.daily_total_score
                    : loaderData.userScoreOverview?.daily_score.total_score}
                  <Divider orientation="vertical" flexItem />
                  Week:{" "}
                  {scoreAction
                    ? scoreAction.weekly_total_score
                    : loaderData.userScoreOverview?.weekly_score.total_score}
                </ListItemText>
                <Divider />
              </MenuItem>
            )}
            <MenuItem
              id="account"
              to="/app/workspace/account"
              component={Link}
              onClick={handleAccountMenuClose}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>Account</ListItemText>
            </MenuItem>
            <MenuItem
              id="manage-api"
              to="/app/workspace/manage-api"
              component={Link}
              onClick={handleAccountMenuClose}
            >
              <ListItemIcon>
                <VpnKeyIcon />
              </ListItemIcon>
              <ListItemText>Manage API</ListItemText>
            </MenuItem>
            <MenuItem
              id="manage-mcp"
              to="/app/workspace/manage-mcp"
              component={Link}
              onClick={handleAccountMenuClose}
            >
              <ListItemIcon>
                <SmartToyIcon />
              </ListItemIcon>
              <ListItemText>Manage MCP</ListItemText>
            </MenuItem>
            <MenuItem
              id="security"
              to="/app/workspace/security"
              component={Link}
              onClick={handleAccountMenuClose}
            >
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText>Security</ListItemText>
            </MenuItem>
            <MenuItem
              id="settings"
              to="/app/workspace/settings"
              component={Link}
              onClick={handleAccountMenuClose}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              component={"a"}
              href={globalProperties.termsOfServiceUrl}
              target="_blank"
            >
              <ListItemIcon>
                <PolicyIcon />
              </ListItemIcon>
              <ListItemText>Terms of Service</ListItemText>
            </MenuItem>
            <MenuItem
              component={"a"}
              href={globalProperties.privacyPolicyUrl}
              target="_blank"
            >
              <ListItemIcon>
                <PolicyIcon />
              </ListItemIcon>
              <ListItemText>Privacy Policy</ListItemText>
            </MenuItem>
            <Divider />
            <Form method="post" action="/app/lifecycle/logout">
              <MenuItem id="logout" type="submit" component="button">
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Form>
          </Menu>
        </SmartAppBar>

        <Sidebar
          showSidebar={showSidebar}
          onClickForNavigation={() => {
            if (isBigScreen) return;
            setShowSidebar(false);
          }}
        />

        <AnimatePresence mode="wait" initial={false}>
          {outlet}
        </AnimatePresence>

        <ScoreSnackbarManager scoreAction={scoreAction} />
        <ReleaseUpdateWidget />
      </WorkspaceContainer>
    </TopLevelInfoProvider>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the workspace! Please try again!`,
});
