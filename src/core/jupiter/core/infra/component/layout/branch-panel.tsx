import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  Group as GroupIcon,
  History as HistoryIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import { Form, Link, useLocation } from "react-router";
import {
  type JSX,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  EntityId,
  NamedEntityTag,
  UserLight,
  AccessStatus,
  PublishEntity,
} from "@jupiter/webapi-client";

import { PublishPanel } from "#/core/common/sub/publish/components/publish-panel";
import { AccessPanel } from "#/core/common/sub/access/components/access-panel";
import { extractBranchFromPath } from "#/core/infra/routes";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import {
  restoreScrollPosition,
  saveScrollPosition,
} from "#/core/infra/scroll-restoration";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { EntityMutationHistoryPanel } from "#/core/infra/component/layout/entity-mutation-history-panel";

interface BranchPanelProps {
  createLocation?: string;
  showArchiveAndRemoveButton?: boolean;
  entityType?: NamedEntityTag;
  entityRefId?: EntityId;
  inputsEnabled?: boolean;
  entityArchived?: boolean;
  actions?: JSX.Element;
  returnLocation: string;
  publishable?: boolean;
  publishEntity?: PublishEntity;
  accessable?: boolean;
  accessOwner?: UserLight;
  accessStatus?: AccessStatus | null;
}

export function BranchPanel(props: PropsWithChildren<BranchPanelProps>) {
  const location = useLocation();
  const column = useStrataColumn(DisplayType.BRANCH);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showAccess, setShowAccess] = useState(false);
  const preserveFilters = useSectionFiltersPreserver();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const showingAlternateView = showHistory || showPublish || showAccess;
  const hasHistory =
    props.entityType !== undefined && props.entityRefId !== undefined;
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
      saveScrollPosition(theRef, extractBranchFromPath(location.pathname));
    }

    restoreScrollPosition(theRef, extractBranchFromPath(location.pathname));
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
      <Form method="post">
        <BranchPanelControls id="branch-panel-controls">
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
                id="branch-new-leaf-entity"
                variant="contained"
                to={preserveFilters(props.createLocation)}
                component={Link}
                disabled={
                  props.inputsEnabled === false || !!props.entityArchived
                }
              >
                <AddIcon />
              </Button>
            )}

            {props.actions}

            {(hasHistory || hasPublish || hasAccess) && (
              <Box sx={{ marginLeft: "auto", display: "flex" }}>
                {hasPublish && (
                  <IconButton
                    id="branch-entity-publish"
                    onClick={() => {
                      setShowHistory(false);
                      setShowAccess(false);
                      setShowPublish((p) => !p);
                    }}
                  >
                    <PublicIcon color={showPublish ? "primary" : undefined} />
                  </IconButton>
                )}
                {hasAccess && (
                  <IconButton
                    id="branch-entity-access"
                    onClick={() => {
                      setShowHistory(false);
                      setShowPublish(false);
                      setShowAccess((a) => !a);
                    }}
                  >
                    <GroupIcon color={showAccess ? "primary" : undefined} />
                  </IconButton>
                )}
                {hasHistory && (
                  <IconButton
                    onClick={() => {
                      setShowPublish(false);
                      setShowAccess(false);
                      setShowHistory((h) => !h);
                    }}
                  >
                    <HistoryIcon color={showHistory ? "primary" : undefined} />
                  </IconButton>
                )}
              </Box>
            )}

            {props.showArchiveAndRemoveButton && (
              <>
                <IconButton
                  id="branch-entity-archive"
                  sx={
                    !hasHistory && !hasPublish && !hasAccess
                      ? { marginLeft: "auto" }
                      : undefined
                  }
                  disabled={!props.entityArchived && !props.inputsEnabled}
                  type="button"
                  onClick={() => setShowArchiveDialog(true)}
                >
                  {props.entityArchived ? (
                    <DeleteForeverIcon />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
                <Dialog
                  onClose={() => setShowArchiveDialog(false)}
                  open={showArchiveDialog}
                  disablePortal
                >
                  <DialogTitle>Careful!</DialogTitle>
                  <DialogContent>
                    Are you sure you want to{" "}
                    {props.entityArchived ? "remove" : "archive"} this entity?
                    {props.entityArchived
                      ? " This action cannot be undone."
                      : ""}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      id="branch-entity-archive-confirm"
                      sx={{ marginLeft: "auto" }}
                      disabled={!props.entityArchived && !props.inputsEnabled}
                      type="submit"
                      name="intent"
                      value={props.entityArchived ? "remove" : "archive"}
                    >
                      Yes
                    </Button>
                    <Button onClick={() => setShowArchiveDialog(false)}>
                      No
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}

            <IconButton
              sx={{
                marginLeft:
                  !props.showArchiveAndRemoveButton &&
                  !hasHistory &&
                  !hasPublish
                    ? "auto"
                    : undefined,
              }}
            >
              <Link
                data-strata-close
                style={{ display: "flex" }}
                to={preserveFilters(props.returnLocation)}
              >
                <CloseIcon />
              </Link>
            </IconButton>
          </TrunkPanelControlsInner>
        </BranchPanelControls>
      </Form>

      <div id="branch-panel-content" ref={containerRef}>
        {showHistory && hasHistory && (
          <EntityMutationHistoryPanel
            entityType={props.entityType!}
            entityRefId={props.entityRefId!}
          />
        )}

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
      id="branch-panel"
      key={extractBranchFromPath(location.pathname)}
      column={column.column}
      label="detail"
      onFocus={column.focus}
      fallbackLeft={column.offsetLeft}
      animate={column.animate}
    >
      {body}
    </StrataColumnFrame>
  );
}

// The column frame sizes and colours the controls bar; this is its layout.
const BranchPanelControls = styled("div")(() => ({}));

const TrunkPanelControlsInner = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
}));
