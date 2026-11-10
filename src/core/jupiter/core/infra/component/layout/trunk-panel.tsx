import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import { Link, useLocation } from "react-router";
import type { JSX, PropsWithChildren } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import type {
  EntityId,
  NamedEntityTag,
  UserLight,
  AccessStatus,
  PublishEntity,
} from "@jupiter/webapi-client";

import { PublishPanel } from "#/core/common/sub/publish/components/publish-panel";
import { AccessPanel } from "#/core/common/sub/access/components/access-panel";
import { extractTrunkFromPath } from "#/core/infra/routes";
import {
  restoreScrollPosition,
  saveScrollPosition,
} from "#/core/infra/scroll-restoration";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import { DisplayType } from "#/core/infra/component/use-nested-entities";

interface TrunkPanelProps {
  createLocation?: string;
  actions?: JSX.Element;
  returnLocation: string;
  /** Overrides ``returnLocation`` for AccessPanel Forget only. */
  forgetReturnLocation?: string;
  entityType?: NamedEntityTag;
  entityRefId?: EntityId;
  inputsEnabled?: boolean;
  publishable?: boolean;
  publishEntity?: PublishEntity;
  accessable?: boolean;
  accessOwner?: UserLight;
  accessStatus?: AccessStatus | null;
}

export function TrunkPanel(props: PropsWithChildren<TrunkPanelProps>) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const topLevelInfo = useContext(TopLevelInfoContext);
  const [showPublish, setShowPublish] = useState(false);
  const [showAccess, setShowAccess] = useState(false);
  const preserveFilters = useSectionFiltersPreserver();
  const column = useStrataColumn(DisplayType.TRUNK);

  const showingAlternateView = showPublish || showAccess;
  const hasPublish =
    props.publishable === true &&
    props.entityType !== undefined &&
    props.entityRefId !== undefined;
  const hasAccess =
    props.accessable === true &&
    props.entityType !== undefined &&
    props.entityRefId !== undefined;

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    const theRef = containerRef.current;

    function handleScrollSpecial() {
      saveScrollPosition(theRef, extractTrunkFromPath(location.pathname));
    }

    restoreScrollPosition(theRef, extractTrunkFromPath(location.pathname));
    theRef.addEventListener("scroll", handleScrollSpecial);

    return () => {
      theRef.removeEventListener("scroll", handleScrollSpecial);
    };
  }, [containerRef, location]);

  function handleScrollTop() {
    containerRef.current?.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }

  function handleScrollBottom() {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTo({
      left: 0,
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  const body = (
    <>
      <TrunkPanelControls id="trunk-panel-controls">
        <TrunkPanelControlsInner>
          <ButtonGroup size="small">
            <IconButton onClick={handleScrollTop}>
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton onClick={handleScrollBottom}>
              <ArrowDownwardIcon />
            </IconButton>
          </ButtonGroup>

          {props.createLocation && (
            <Button
              id="trunk-new-leaf-entity"
              variant="contained"
              to={preserveFilters(props.createLocation)}
              component={Link}
            >
              <AddIcon />
            </Button>
          )}

          {props.actions}

          {(hasPublish || hasAccess) && (
            <Box sx={{ marginLeft: "auto", display: "flex" }}>
              {hasPublish && (
                <IconButton
                  id="trunk-entity-publish"
                  onClick={() => {
                    setShowAccess(false);
                    setShowPublish((p) => !p);
                  }}
                >
                  <PublicIcon color={showPublish ? "primary" : undefined} />
                </IconButton>
              )}
              {hasAccess && (
                <IconButton
                  id="trunk-entity-access"
                  onClick={() => {
                    setShowPublish(false);
                    setShowAccess((a) => !a);
                  }}
                >
                  <GroupIcon color={showAccess ? "primary" : undefined} />
                </IconButton>
              )}
            </Box>
          )}

          <IconButton
            sx={{
              marginLeft: hasPublish || hasAccess ? undefined : "auto",
            }}
          >
            <Link data-strata-close to={props.returnLocation}>
              <CloseIcon />
            </Link>
          </IconButton>
        </TrunkPanelControlsInner>
      </TrunkPanelControls>

      <div id="trunk-panel-content" ref={containerRef}>
        {showPublish && hasPublish && (
          <>
            <Stack spacing={2}>
              <PublishPanel
                entityType={props.entityType!}
                entityRefId={props.entityRefId!}
                topLevelInfo={topLevelInfo}
                inputsEnabled={props.inputsEnabled ?? false}
                publishEntity={props.publishEntity ?? null}
                accessStatus={props.accessStatus}
              />
            </Stack>
            <Box sx={{ height: "4rem" }}></Box>
          </>
        )}

        {showAccess && hasAccess && (
          <>
            <Stack spacing={2}>
              <AccessPanel
                entityType={props.entityType!}
                entityRefId={props.entityRefId!}
                topLevelInfo={topLevelInfo}
                inputsEnabled={props.inputsEnabled ?? false}
                returnLocation={props.returnLocation}
                forgetReturnLocation={props.forgetReturnLocation}
                owner={props.accessOwner}
                accessStatus={props.accessStatus}
              />
            </Stack>
            <Box sx={{ height: "4rem" }}></Box>
          </>
        )}

        <Box
          sx={{ display: showingAlternateView ? "none" : undefined }}
          aria-hidden={showingAlternateView}
        >
          <Stack spacing={2}>{props.children}</Stack>
        </Box>
      </div>
    </>
  );

  return (
    <StrataColumnFrame
      id="trunk-panel"
      key={extractTrunkFromPath(location.pathname)}
      column={column.column}
      label="list"
      onFocus={column.focus}
      fallbackLeft={column.offsetLeft}
      animate={column.animate}
    >
      {body}
    </StrataColumnFrame>
  );
}

// The column frame sizes and colours the controls bar; this is its layout.
const TrunkPanelControls = styled("div")(() => ({}));

const TrunkPanelControlsInner = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
}));
