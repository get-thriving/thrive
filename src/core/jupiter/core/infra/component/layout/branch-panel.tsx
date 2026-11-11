import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
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
} from "@mui/material";
import { Form, Link, useLocation } from "react-router";
import {
  type JSX,
  type PropsWithChildren,
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

import { extractBranchFromPath } from "#/core/infra/routes";
import {
  restoreScrollPosition,
  saveScrollPosition,
} from "#/core/infra/scroll-restoration";
import { StrataSectionStack } from "#/core/infra/component/strata-section-stack";
import { ColumnHeader } from "#/core/infra/component/layout/column-header";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { useEntityViews } from "#/core/infra/component/layout/use-entity-views";

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
  /**
   * The panel id (ADR 0014) for the sections in it, which makes them a stack:
   * they can be collapsed, and split out into columns.
   */
  sectionsPanelId?: string;
}

export function BranchPanel(props: PropsWithChildren<BranchPanelProps>) {
  const location = useLocation();
  const column = useStrataColumn(DisplayType.BRANCH);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const preserveFilters = useSectionFiltersPreserver();
  // What was published, who has access and the history: columns beside this
  // one, or in its place when there is no room.
  const views = useEntityViews({
    home: "branch",
    idPrefix: "branch",
    parentKey: column.column?.key ?? null,
    entityType: props.entityType,
    entityRefId: props.entityRefId,
    inputsEnabled: props.inputsEnabled ?? false,
    history: true,
    publishable: props.publishable,
    publishEntity: props.publishEntity,
    accessable: props.accessable,
    accessOwner: props.accessOwner,
    accessStatus: props.accessStatus,
    returnLocation: props.returnLocation,
  });

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
        <ColumnHeader id="branch-panel-controls" label="detail">
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
              disabled={props.inputsEnabled === false || !!props.entityArchived}
            >
              <AddIcon />
            </Button>
          )}

          {props.actions}

          {views.buttons}

          {props.showArchiveAndRemoveButton && (
            <>
              <IconButton
                id="branch-entity-archive"
                sx={!views.any ? { marginLeft: "auto" } : undefined}
                disabled={!props.entityArchived && !props.inputsEnabled}
                type="button"
                onClick={() => setShowArchiveDialog(true)}
              >
                {props.entityArchived ? <DeleteForeverIcon /> : <DeleteIcon />}
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
                  {props.entityArchived ? " This action cannot be undone." : ""}
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
                !props.showArchiveAndRemoveButton && !views.any
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
        </ColumnHeader>
      </Form>

      <div id="branch-panel-content" ref={containerRef}>
        {views.bodies}

        <Box
          sx={{ display: views.replacesContent ? "none" : undefined }}
          aria-hidden={views.replacesContent}
        >
          <Stack spacing={2}>
            {props.sectionsPanelId === undefined ? (
              props.children
            ) : (
              <StrataSectionStack panelId={props.sectionsPanelId}>
                {props.children}
              </StrataSectionStack>
            )}
          </Stack>
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
