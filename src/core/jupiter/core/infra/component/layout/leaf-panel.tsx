import {
  ArrowBack as ArrowBackIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  Group as GroupIcon,
  History as HistoryIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
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
} from "@mui/material";
import { Form, useNavigate } from "react-router";
import type { PropsWithChildren } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  EntityId,
  NamedEntityTag,
  type AccessStatus,
  type PublishEntity,
  type UserLight,
} from "@jupiter/webapi-client";

import {
  IntentInterceptorProvider,
  interceptIntentSubmit,
} from "#/core/infra/component/intent-interceptor";
import type { IntentHandlers } from "#/core/infra/component/intent-interceptor";
import { PublishPanel } from "#/core/common/sub/publish/components/publish-panel";
import { AccessPanel } from "#/core/common/sub/access/components/access-panel";
import {
  restoreScrollPosition,
  saveScrollPosition,
} from "#/core/infra/scroll-restoration";
import { StrataSectionStack } from "#/core/infra/component/strata-section-stack";
import { ColumnHeader } from "#/core/infra/component/layout/column-header";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import { EntityMutationHistoryPanel } from "#/core/infra/component/layout/entity-mutation-history-panel";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface LeafPanelProps {
  isLeaflet?: boolean;
  showArchiveButton?: boolean;
  showArchiveAndRemoveButton?: boolean;
  entityType?: NamedEntityTag;
  entityRefId?: EntityId;
  fakeKey: string;
  inputsEnabled: boolean;
  entityNotEditable?: boolean;
  entityArchived?: boolean;
  /**
   * Where the "close this panel" control goes. Left out where the panel has no
   * parent to return to - a published page is the whole content, reached from
   * a shared link - and then that control isn't shown at all.
   */
  returnLocation?: string;
  /** Overrides ``returnLocation`` for AccessPanel Forget only. */
  forgetReturnLocation?: string;
  publishable?: boolean;
  publishEntity?: PublishEntity;
  accessable?: boolean;
  accessOwner?: UserLight;
  accessStatus?: AccessStatus | null;
  disabled?: boolean;
  /** Form intents the panel's content handles itself, instead of submitting. */
  intentHandlers?: IntentHandlers;
  /**
   * The panel id (ADR 0014) for the sections in it, which makes them a stack:
   * they can be collapsed, and split out into columns. Left out where the
   * panel has no sections to stack, or does it itself.
   */
  sectionsPanelId?: string;
}

const NO_INTENT_HANDLERS: IntentHandlers = {};

export function LeafPanel(props: PropsWithChildren<LeafPanelProps>) {
  const children = (
    <IntentInterceptorProvider
      handlers={props.intentHandlers ?? NO_INTENT_HANDLERS}
    >
      {props.sectionsPanelId === undefined ? (
        props.children
      ) : (
        <StrataSectionStack panelId={props.sectionsPanelId}>
          {props.children}
        </StrataSectionStack>
      )}
    </IntentInterceptorProvider>
  );
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigate();
  // Closing a panel goes back to whatever is under it filtered as it was.
  const preserveFilters = useSectionFiltersPreserver();
  const containerRef = useRef<HTMLDivElement>(null);
  const column = useStrataColumn(
    props.isLeaflet ? DisplayType.LEAFLET : DisplayType.LEAF,
  );
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showAccess, setShowAccess] = useState(false);

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
  const showArchiveButNotRemove =
    props.showArchiveButton && !props.showArchiveAndRemoveButton;

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    const theRef = containerRef.current;

    if (props.fakeKey.endsWith("/new")) {
      return;
    }

    function handleScrollSpecial() {
      saveScrollPosition(theRef, props.fakeKey);
    }

    restoreScrollPosition(theRef, props.fakeKey);
    theRef.addEventListener("scroll", handleScrollSpecial);

    return () => {
      theRef.removeEventListener("scroll", handleScrollSpecial);
    };
  }, [containerRef, props.fakeKey]);

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

  const showControls = !props.disabled;
  const showingAlternateView = showHistory || showPublish || showAccess;

  const body = (
    <>
      {showControls && (
        <Form
          method="post"
          onSubmit={(event) =>
            interceptIntentSubmit(
              event,
              props.intentHandlers ?? NO_INTENT_HANDLERS,
            )
          }
        >
          <ColumnHeader
            id="leaf-panel-controls"
            label={props.isLeaflet ? "side detail" : "detail"}
          >
            <ButtonGroup size="small">
              <IconButton onClick={handleScrollTop}>
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton onClick={handleScrollBottom}>
                <ArrowDownwardIcon />
              </IconButton>
              {props.returnLocation !== undefined && (
                <IconButton
                  data-strata-close
                  onClick={() =>
                    navigation(preserveFilters(props.returnLocation as string))
                  }
                >
                  <KeyboardDoubleArrowRightIcon />
                </IconButton>
              )}
              <IconButton onClick={() => navigation(-1)}>
                <ArrowBackIcon />
              </IconButton>
            </ButtonGroup>

            {(hasHistory || hasPublish || hasAccess) && (
              <Box sx={{ marginLeft: "auto", display: "flex" }}>
                {hasPublish && (
                  <IconButton
                    id="leaf-entity-publish"
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
                    id="leaf-entity-access"
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

            {(props.showArchiveButton || props.showArchiveAndRemoveButton) && (
              <>
                <IconButton
                  id="leaf-entity-archive"
                  sx={
                    !hasHistory && !hasPublish && !hasAccess
                      ? { marginLeft: "auto" }
                      : undefined
                  }
                  disabled={
                    props.entityNotEditable ||
                    (!props.entityArchived && !props.inputsEnabled) ||
                    (props.entityArchived && showArchiveButNotRemove)
                  }
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
                      id="leaf-entity-archive-confirm"
                      sx={{ marginLeft: "auto" }}
                      disabled={
                        props.entityNotEditable ||
                        (!props.entityArchived && !props.inputsEnabled)
                      }
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
          </ColumnHeader>
        </Form>
      )}

      <div id="leaf-panel-content" ref={containerRef}>
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
                inputsEnabled={props.inputsEnabled}
                publishEntity={props.publishEntity ?? null}
                accessStatus={props.accessStatus}
              />
            </Stack>
            <Box sx={{ height: "4rem" }}></Box>
          </>
        )}

        {showAccess && hasAccess && props.returnLocation !== undefined && (
          <>
            <Stack spacing={2}>
              <AccessPanel
                entityType={props.entityType!}
                entityRefId={props.entityRefId!}
                topLevelInfo={topLevelInfo}
                inputsEnabled={props.inputsEnabled}
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
          <Stack spacing={2}>{children}</Stack>
          <Box sx={{ height: "4rem" }}></Box>
        </Box>
      </div>
    </>
  );

  return (
    <StrataColumnFrame
      id={props.isLeaflet ? "leaflet-panel" : "leaf-panel"}
      key={props.fakeKey}
      column={column.column}
      label={props.isLeaflet ? "side detail" : "detail"}
      onFocus={column.focus}
      fallbackLeft={column.offsetLeft}
      animate={column.animate}
    >
      {body}
    </StrataColumnFrame>
  );
}
