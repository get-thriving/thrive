import {
  type Contact,
  DocsHelpSubject,
  type Tag,
  UiStyle,
  UserFeature,
} from "@jupiter/webapi-client";
import { Settings } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import SearchIcon from "@mui/icons-material/Search";
import PolicyIcon from "@mui/icons-material/Policy";
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
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { Link, useOutlet } from "react-router";
import { AnimatePresence, useAnimate } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { isUserFeatureAvailable } from "@jupiter/core/users/root";
import { CollaborationLink } from "@jupiter/core/infra/component/collaboration-link";
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
import { SearchWidget } from "@jupiter/core/common/search/components/search-widget";
import Sidebar from "@jupiter/core/infra/component/sidebar";
import { StrataColumnsShell } from "@jupiter/core/infra/component/layout/strata-columns-shell";
import { StrataRail } from "@jupiter/core/infra/component/shell/strata-rail";
import { StrataDrawer } from "@jupiter/core/infra/component/shell/strata-drawer";
import { StrataPhoneLead } from "@jupiter/core/infra/component/shell/strata-phone-lead";
import { default as DiscordIcon } from "@jupiter/core/infra/component/discord-icon";
import { ServiceLinksContext } from "@jupiter/core/infra/service-links-context";
import { StrataCommandBar } from "@jupiter/core/infra/component/shell/strata-command-bar";
import { StrataBreadcrumb } from "@jupiter/core/infra/component/shell/strata-breadcrumb";
import { strataSize } from "@jupiter/core/infra/component/strata-tokens";
import { useExpandedRail } from "@jupiter/core/infra/component/use-expanded-rail";
import { useUiStyle } from "@jupiter/core/infra/component/use-ui-style";
import { Title } from "@jupiter/core/infra/component/title";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { TopLevelInfoProvider } from "@jupiter/core/infra/component/top-level-info-provider";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

import { redirectForLifecycleState } from "~/routes/app/lifecycle/lifecycle-redirects.server";
import editorJsTweaks from "~/styles/editorjs-tweaks.css?url";

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

  if (!response.user || !response.user.verified || !response.workspace) {
    return redirectForLifecycleState(response);
  }

  const [
    progressReporterTokenResponse,
    allTagsResponse,
    allContactsResponse,
    summariesResponse,
  ] = await Promise.all([
    apiClient.application.loadProgressReporterToken({}),
    apiClient.tags.tagFind({
      allow_archived: false,
    }),
    apiClient.contacts.contactFind({
      allow_archived: false,
    }),
    apiClient.application.getSummaries({}),
  ]);

  return {
    userFeatureFlagControls: response.user_feature_flag_controls,
    workspaceFeatureFlagControls: response.workspace_feature_flag_controls,
    user: response.user,
    userAvatarUrl: response.user_avatar_url ?? undefined,
    userLinkedAuthMethods: response.user_linked_auth_methods,
    userScoreOverview: response.user_score_overview,
    workspace: response.workspace,
    allTags: allTagsResponse.tags as Array<Tag>,
    allContacts: allContactsResponse.contacts as Array<Contact>,
    progressReporterToken:
      progressReporterTokenResponse.progress_reporter_token_ext,
    collaborationCount:
      summariesResponse.access_invites.length +
      summariesResponse.access_requests.length,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  nextUrl,
  formAction,
}) => {
  if (nextUrl.searchParams.has("invalidateTopLevel")) {
    return true;
  }
  // Refresh the collaboration badge after invite/request actions.
  return (
    (formAction?.includes("/core/collaboration") ||
      formAction?.includes("/core/access")) ??
    false
  );
};

// @secureFn
export default function Workspace() {
  const outlet = useOutlet();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const isBigScreen = useBigScreen();
  const [showSidebar, setShowSidebar] = useState(isBigScreen);
  // The phone's drawer starts closed whatever the first render took the screen
  // to be: a desktop browser is assumed wide until it is measured.
  const [showDrawer, setShowDrawer] = useState(false);
  // Strata replaces the drawer with an icon rail on big screens (ADR 0019),
  // and the panels lay themselves out as columns beside it.
  const theme = useTheme();
  // The wider rail is the user's choice, but it takes room the columns would
  // otherwise have, so it is only offered from the `lg` breakpoint up.
  const roomForExpandedRail = useMediaQuery(
    `(min-width: ${theme.breakpoints.values.lg}px)`,
  );
  const strata = useUiStyle() === UiStyle.STRATA;
  const showRail = strata && isBigScreen;
  // On a small screen Strata keeps one panel at a time, with its own top bar
  // and a drawer in place of the rail (ADR 0020).
  const strataPhone = strata && !isBigScreen;
  const [railExpandedPreference, toggleRailExpanded] = useExpandedRail();
  const railExpanded = railExpandedPreference && roomForExpandedRail;
  const railWidth = railExpanded ? strataSize.railExpanded : strataSize.rail;
  const [searchOpen, setSearchOpen] = useState(false);
  const scoreAction = useScoreActionSingleton();
  const globalProperties = useContext(GlobalPropertiesContext);
  const serviceLinks = useContext(ServiceLinksContext);

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
      userLinkedAuthMethods={loaderData.userLinkedAuthMethods}
      userScoreOverview={loaderData.userScoreOverview}
    >
      <WorkspaceContainer>
        <StrataColumnsShell
          enabled={strata}
          offsetLeft={showRail ? railWidth : 0}
          phone={strataPhone}
        >
          <SmartAppBar compact={strataPhone}>
            {strataPhone && (
              <StrataPhoneLead onOpenDrawer={() => setShowDrawer(true)} />
            )}
            {!showRail && !strataPhone && (
              <IconButton
                id="show-sidebar"
                size="large"
                edge="start"
                color="inherit"
                onClick={() => setShowSidebar((s) => !s)}
              >
                <MenuIcon />
              </IconButton>
            )}

            {showRail ? (
              <>
                <Box sx={{ width: "9rem", flexShrink: 0, display: "flex" }}>
                  <Title hideOnSmallScreen />
                </Box>
                <StrataCommandBar onOpen={() => setSearchOpen(true)} />
                <Box sx={{ flex: 1, minWidth: 0, display: "flex", ml: 2 }}>
                  <StrataBreadcrumb />
                </Box>
              </>
            ) : (
              !strataPhone && <Title hideOnSmallScreen />
            )}

            <WorkspaceAppBarTrailing>
              <SearchWidget
                allTags={loaderData.allTags}
                allContacts={loaderData.allContacts}
                {...(showRail || strataPhone
                  ? {
                      open: searchOpen,
                      onOpenChange: setSearchOpen,
                      hideTrigger: true,
                    }
                  : {})}
              />

              {/* <ProgressReporter token={loaderData.progressReporterToken} /> */}

              {strataPhone && (
                <IconButton
                  id="strata-phone-search"
                  size="large"
                  color="inherit"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <SearchIcon />
                </IconButton>
              )}

              {/* On a phone these three are in the account menu instead. */}
              {!strataPhone && (
                <>
                  <CollaborationLink count={loaderData.collaborationCount} />

                  <CommunityLink />

                  <DocsHelp
                    size="medium"
                    subject={DocsHelpSubject.ROOT}
                    theId="docs-help"
                  />
                </>
              )}

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
                    src={loaderData.userAvatarUrl}
                  />
                </Badge>
              </IconButton>
            </WorkspaceAppBarTrailing>

            <Menu
              id="basic-menu"
              anchorEl={accountMenuAnchorEl}
              open={accountMenuOpen}
              onClose={handleAccountMenuClose}
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
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
              {strataPhone && [
                <MenuItem
                  key="collaboration"
                  id="collaboration-link"
                  to="/app/workspace/core/collaboration"
                  component={Link}
                  onClick={handleAccountMenuClose}
                >
                  <ListItemIcon>
                    <Badge
                      badgeContent={loaderData.collaborationCount}
                      color="error"
                      max={99}
                    >
                      <HandshakeOutlinedIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText>Collaboration</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="community"
                  component={"a"}
                  href={globalProperties.communityUrl}
                  target="_blank"
                >
                  <ListItemIcon>
                    <DiscordIcon
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                  </ListItemIcon>
                  <ListItemText>Community</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="help"
                  id="docs-help"
                  component={"a"}
                  href={serviceLinks.docsUrl}
                  target="_blank"
                >
                  <ListItemIcon>
                    <HelpCenterIcon />
                  </ListItemIcon>
                  <ListItemText>Help</ListItemText>
                </MenuItem>,
                <Divider key="phone-links-divider" />,
              ]}
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
                id="access"
                to="/app/workspace/access"
                component={Link}
                onClick={handleAccountMenuClose}
              >
                <ListItemIcon>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText>Access</ListItemText>
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
              <MenuItem
                id="logout"
                component={Link}
                to="/app/lifecycle/logout"
                reloadDocument
                onClick={handleAccountMenuClose}
              >
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </SmartAppBar>

          {showRail && (
            <StrataRail
              expanded={railExpanded}
              canExpand={roomForExpandedRail}
              onToggleExpanded={toggleRailExpanded}
            />
          )}

          {strataPhone ? (
            <StrataDrawer
              open={showDrawer}
              onClose={() => setShowDrawer(false)}
            />
          ) : (
            <Sidebar
              showSidebar={showSidebar && !showRail}
              onClickForNavigation={() => {
                if (isBigScreen) return;
                setShowSidebar(false);
              }}
            />
          )}

          <AnimatePresence mode="wait" initial={false}>
            {outlet}
          </AnimatePresence>

          <ScoreSnackbarManager scoreAction={scoreAction} />
          <ReleaseUpdateWidget />
        </StrataColumnsShell>
      </WorkspaceContainer>
    </TopLevelInfoProvider>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the workspace! Please try again!`,
});
