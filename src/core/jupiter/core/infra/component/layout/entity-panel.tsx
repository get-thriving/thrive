import { Box, Stack } from "@mui/material";
import { Form, useLocation, useSearchParams } from "react-router";
import {
  type JSX,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AccessStatus,
  EntityId,
  NamedEntityTag,
  PublishEntity,
  UserLight,
} from "@jupiter/webapi-client";

import {
  IntentInterceptorProvider,
  interceptIntentSubmit,
} from "#/core/infra/component/intent-interceptor";
import type { IntentHandlers } from "#/core/infra/component/intent-interceptor";
import {
  extractBranchFromPath,
  extractTrunkFromPath,
} from "#/core/infra/routes";
import { saveNavPosition } from "#/core/infra/nav-restoration";
import {
  strataMarkNavPosition,
  strataNavPositionOf,
} from "#/core/infra/component/layout/strata-nav-position";
import { STRATA_NAV_KEY_ATTRIBUTE } from "#/core/infra/component/layout/strata-scroll-column";
import {
  restoreScrollPosition,
  saveScrollPosition,
} from "#/core/infra/scroll-restoration";
import { StrataHeaderLendContext } from "#/core/infra/component/strata-header-lend-context";
import { StrataSectionStack } from "#/core/infra/component/strata-section-stack";
import { ColumnHeader } from "#/core/infra/component/layout/column-header";
import { entityArchiveEntries } from "#/core/infra/component/layout/entity-archive-entries";
import { EntityArchiveDialog } from "#/core/infra/component/layout/entity-archive-dialog";
import { createAnotherNonce } from "#/core/infra/create-and-another";
import { strataEnterName } from "#/core/infra/component/layout/strata-enter-name";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { useStrataColumnItemKeys } from "#/core/infra/component/layout/use-strata-column-item-keys";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import { useEntityViews } from "#/core/infra/component/layout/use-entity-views";
import { useRouteLabel } from "#/core/infra/component/layout/use-route-label";
import { useStrataPosition } from "#/core/infra/component/layout/use-strata-position";
import { RAIL_DESTINATIONS } from "#/core/infra/component/shell/rail-destinations";
import { strataEntityTitle } from "#/core/infra/strata/strata-entity-title";
import { strataTrunkTitle } from "#/core/infra/strata/strata-trunk-title";

interface EntityPanelCommonProps {
  /**
   * Overrides the title, which is the kind of the entity and its number, or for
   * what is not an entity the name its route has.
   */
  title?: string;
  showArchiveButton?: boolean;
  showArchiveAndRemoveButton?: boolean;
  entityType?: NamedEntityTag;
  entityRefId?: EntityId;
  entityNotEditable?: boolean;
  entityArchived?: boolean;
  /** Overrides ``returnLocation`` for AccessPanel Forget only. */
  forgetReturnLocation?: string;
  publishable?: boolean;
  publishEntity?: PublishEntity;
  accessable?: boolean;
  accessOwner?: UserLight;
  accessStatus?: AccessStatus | null;
  /**
   * The panel id (ADR 0014) for the sections in it, which makes them a stack:
   * they can be collapsed, and split out into columns. Left out where the
   * panel has no sections to stack, or does it itself.
   */
  sectionsPanelId?: string;
}

/** An entity or a page that makes one: it has a form, and nothing else is a list. */
interface EntityPanelLeafProps {
  /** A leaflet is the side detail of a leaf. */
  kind: "leaf" | "leaflet";
  /** Keeps the panel's scroll as it was, and remounts it for another entity. */
  fakeKey: string;
  inputsEnabled: boolean;
  /**
   * Where the "close this panel" control goes. Left out where the panel has no
   * parent to return to - a published page is the whole content, reached from
   * a shared link - and then that control isn't shown at all.
   */
  returnLocation?: string;
  disabled?: boolean;
  /** Form intents the panel's content handles itself, instead of submitting. */
  intentHandlers?: IntentHandlers;
  /**
   * Changes whenever the form of a page that makes an entity is built anew
   * without the page changing, as "Create & Another" does for the intents
   * above: the focus goes to the name again.
   */
  freshFormKey?: number;
  /**
   * Controls in the header, such as a button to the entity's settings, small
   * and folded when there is no room. What submits a form of the body names it
   * (`ActionSingle`'s `form`), as the header is a form of its own.
   */
  actions?: JSX.Element;
}

/** What a list has, which an entity that is one and the first column share. */
interface EntityPanelListProps {
  inputsEnabled?: boolean;
  /** How many items the list holds after its filters. */
  count?: number;
  /** Controls in the header, such as the list's filters, small and folded when there is no room. */
  actions?: JSX.Element;
  returnLocation: string;
}

/** An entity that is also a list of others, with a way to make one. */
interface EntityPanelBranchProps extends EntityPanelListProps {
  kind: "branch";
}

/**
 * The first column of an app, a list (the habits, the metrics): it is always
 * there, so it has no way to close it, and it is not an entity, so it has no
 * place in a list, no history, no archiving and no stack of sections. Its title
 * is the place on the rail, unless it says one.
 */
interface EntityPanelTrunkProps extends EntityPanelListProps {
  kind: "trunk";
}

export type EntityPanelProps = EntityPanelCommonProps &
  (EntityPanelLeafProps | EntityPanelBranchProps | EntityPanelTrunkProps);

const NO_INTENT_HANDLERS: IntentHandlers = {};

const DISPLAY_TYPES = {
  trunk: DisplayType.TRUNK,
  branch: DisplayType.BRANCH,
  leaf: DisplayType.LEAF,
  leaflet: DisplayType.LEAFLET,
} as const;

/**
 * A column of a route (ADR 0021): the header with its title, chips, views,
 * position and `⋯` menu, over the content, with the archive dialog and the
 * sections stack. A `branch` is an entity that is also a list (a count and
 * controls in the header, its own way to create an item among them); a `leaf` and a `leaflet`, which is its side
 * detail, are the entity or the page that creates one, and may handle form
 * intents themselves; a `trunk` is the list that starts an app, with none of
 * what is of an entity. The ids of the parts keep the kind
 * (`leaf-panel-content`, `branch-new-leaf-entity`), which the tests find them
 * by.
 */
export function EntityPanel(props: PropsWithChildren<EntityPanelProps>) {
  const location = useLocation();
  // Closing a panel goes back to whatever is under it filtered as it was.
  const preserveFilters = useSectionFiltersPreserver();
  const containerRef = useRef<HTMLDivElement>(null);
  const column = useStrataColumn(DISPLAY_TYPES[props.kind]);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const list = props.kind === "branch" || props.kind === "trunk" ? props : null;
  const leaf = props.kind === "branch" || props.kind === "trunk" ? null : props;
  const isLeaf = leaf !== null;
  const isTrunk = props.kind === "trunk";
  // What the ids of its parts start with.
  const prefix = isLeaf ? "leaf" : props.kind;
  const inputsEnabled = props.inputsEnabled ?? false;
  const intentHandlers = leaf?.intentHandlers ?? NO_INTENT_HANDLERS;
  // Scroll is kept for the panel, and it is remounted, by this.
  const scrollKey =
    leaf !== null
      ? leaf.fakeKey
      : isTrunk
        ? extractTrunkFromPath(location.pathname)
        : extractBranchFromPath(location.pathname);

  // What was published, who has access and the history: columns beside this
  // one, or in its place when there is no room.
  const views = useEntityViews({
    home: props.kind,
    idPrefix: prefix,
    parentKey: column.column?.key ?? null,
    entityType: props.entityType,
    entityRefId: props.entityRefId,
    inputsEnabled,
    // A first column is not an entity: it has no history of its own.
    history: !isTrunk,
    publishable: props.publishable,
    publishEntity: props.publishEntity,
    accessable: props.accessable,
    accessOwner: props.accessOwner,
    accessStatus: props.accessStatus,
    returnLocation: props.returnLocation,
    forgetReturnLocation: props.forgetReturnLocation,
  });

  // Its place among the items of the list before it, for the header, and `o`
  // and `p` to move along it while it has the focus.
  const position = useStrataPosition(
    isTrunk ? null : (column.column?.key ?? null),
    column.column !== null && (column.column.focused || column.column.alone),
  );

  // A panel whose header has controls of its own (the one that is a form, which
  // is not a first column's list) hands the first card of its content its row,
  // as the first section of a stack has it (ADR 0021).
  const showControls = leaf?.disabled !== true;
  const lendsToHeader = isTrunk || showControls;
  const lendsToCards = props.sectionsPanelId === undefined && lendsToHeader;

  const children = (
    <IntentInterceptorProvider handlers={intentHandlers}>
      {props.sectionsPanelId === undefined ? (
        <StrataHeaderLendContext.Provider value={lendsToCards}>
          {props.children}
        </StrataHeaderLendContext.Provider>
      ) : (
        <StrataSectionStack
          panelId={props.sectionsPanelId}
          lendsToHeader={lendsToHeader}
        >
          {props.children}
        </StrataSectionStack>
      )}
    </IntentInterceptorProvider>
  );

  // A panel that is a list, with no sections, has it as its own: `e`, `j`, `k`
  // and `↵` go through its items. One with a stack of sections leaves them to it.
  useStrataColumnItemKeys(containerRef);

  const canArchive = !!(
    props.showArchiveButton || props.showArchiveAndRemoveButton
  );
  const hasEntity =
    props.entityType !== undefined && props.entityRefId !== undefined;
  // What there is to archive is an entity, which a first column is not.
  const archivable = !isTrunk && (hasEntity || canArchive);

  // A panel folded to a spine, as the one before the focused one is on a
  // phone, is kept mounted and keeps its scroll, but the page can move it while
  // it is out of sight (what the column on top of it does to the page). What it
  // had before is what it goes back to, and what happens to it folded is not
  // kept.
  const folded = column.column?.state === "spine";
  const foldedRef = useRef(folded);
  foldedRef.current = folded;

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    const theRef = containerRef.current;

    // A page that makes an entity has no scroll worth keeping.
    if (isLeaf && scrollKey.endsWith("/new")) {
      return;
    }

    function handleScrollSpecial() {
      if (!foldedRef.current) {
        saveScrollPosition(theRef, scrollKey);
      }
    }

    // Where `j` and `k` had got to is kept with the scroll.
    function handleFocusIn() {
      if (foldedRef.current) {
        return;
      }
      const position = strataNavPositionOf(theRef);
      if (position !== null) {
        saveNavPosition(scrollKey, position);
        mark();
      }
    }

    // What `j` and `k` were last on stays drawn selected.
    function mark() {
      const column = theRef.closest<HTMLElement>("[data-strata-column]");
      if (column !== null) {
        strataMarkNavPosition(column);
      }
    }

    restoreScrollPosition(theRef, scrollKey);
    const frame = requestAnimationFrame(mark);
    theRef.addEventListener("scroll", handleScrollSpecial);
    theRef.addEventListener("focusin", handleFocusIn);

    return () => {
      cancelAnimationFrame(frame);
      theRef.removeEventListener("scroll", handleScrollSpecial);
      theRef.removeEventListener("focusin", handleFocusIn);
    };
  }, [containerRef, scrollKey, isLeaf]);

  // Coming back from a spine, the panel is where it was left.
  useEffect(() => {
    const theRef = containerRef.current;
    if (folded || theRef === null || (isLeaf && scrollKey.endsWith("/new"))) {
      return;
    }
    const frame = requestAnimationFrame(() =>
      restoreScrollPosition(theRef, scrollKey),
    );
    return () => cancelAnimationFrame(frame);
  }, [folded, scrollKey, isLeaf]);

  // A page that makes an entity starts in its name, ready to type; `Escape`
  // leaves the field for the column, as it does from any other. So does the
  // page "Create & Another" comes back to, which is a new one (its nonce moved
  // on), and the form that is built anew in place (`freshFormKey`). The menu
  // or the button that made the entity may hand the focus back to where it was
  // just after the form is up, so it is tried again a few times, for as long
  // as the focus is nowhere in particular, and once the inputs can be written
  // in, if they could not be.
  const [searchParams] = useSearchParams();
  const createAnother = createAnotherNonce(searchParams);
  const freshFormKey = leaf?.freshFormKey;
  const makesEntity =
    isLeaf &&
    (scrollKey.endsWith("/new") || /\/new(-[a-z-]+)?$/.test(location.pathname));
  const nameWaiting = useRef(false);
  useEffect(() => {
    const container = containerRef.current;
    if (!makesEntity || container === null) {
      return;
    }
    nameWaiting.current = !strataEnterName(container, false);
    const timers = [100, 250, 500].map((delay) =>
      window.setTimeout(() => {
        const active = document.activeElement;
        const typing =
          active instanceof HTMLElement &&
          active.closest("input, textarea, select") !== null &&
          active.closest("[data-strata-column]") !== null;
        if (!typing && strataEnterName(container, false)) {
          nameWaiting.current = false;
        }
      }, delay),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [makesEntity, scrollKey, createAnother, freshFormKey]);
  useEffect(() => {
    const container = containerRef.current;
    if (inputsEnabled && nameWaiting.current && container !== null) {
      nameWaiting.current = !strataEnterName(container, false);
    }
  }, [inputsEnabled]);

  // What is not an entity of its own is called what its route calls it.
  const routeLabel = useRouteLabel();
  const notEditable = !!props.entityNotEditable;

  const title =
    props.title ??
    (isTrunk
      ? strataTrunkTitle(location.pathname, RAIL_DESTINATIONS)
      : props.entityType !== undefined && props.entityRefId !== undefined
        ? strataEntityTitle(props.entityType, props.entityRefId)
        : (routeLabel ??
          (props.kind === "leaflet" ? "Side detail" : "Detail")));
  // History, Publish and Access, then archiving and deleting for good: always
  // there for an entity, and disabled where they do not apply.
  const menu = [
    ...views.entries,
    ...(archivable
      ? entityArchiveEntries({
          idPrefix: prefix,
          canArchive,
          canRemove: !!props.showArchiveAndRemoveButton,
          archived: !!props.entityArchived,
          notEditable,
          inputsEnabled,
          onSelect: () => setShowArchiveDialog(true),
        })
      : []),
  ];

  const header = (
    <ColumnHeader
      id={`${prefix}-panel-controls`}
      title={title}
      count={list?.count}
      position={position}
      chips={views.chips}
      controls={list?.actions ?? leaf?.actions}
      slot={lendsToHeader ? (column.column?.key ?? undefined) : undefined}
      views={views.buttons}
      menu={menu}
      close={
        isTrunk || props.returnLocation === undefined
          ? undefined
          : {
              to: preserveFilters(props.returnLocation),
              label: "Close",
              title: "Close",
            }
      }
    />
  );

  const body = (
    <>
      {isTrunk
        ? header
        : showControls && (
            <Form
              method="post"
              onSubmit={(event) => interceptIntentSubmit(event, intentHandlers)}
            >
              {header}
              {archivable && (
                <EntityArchiveDialog
                  open={showArchiveDialog}
                  onClose={() => setShowArchiveDialog(false)}
                  archived={!!props.entityArchived}
                  confirmDisabled={
                    notEditable || (!props.entityArchived && !inputsEnabled)
                  }
                  idPrefix={prefix}
                />
              )}
            </Form>
          )}

      <div
        id={`${prefix}-panel-content`}
        ref={containerRef}
        data-strata-scroll
        {...{ [STRATA_NAV_KEY_ATTRIBUTE]: scrollKey }}
      >
        {views.bodies}

        <Box
          sx={{ display: views.replacesContent ? "none" : undefined }}
          aria-hidden={views.replacesContent}
        >
          <Stack spacing={2}>{children}</Stack>
          {isLeaf && <Box sx={{ height: "4rem" }}></Box>}
        </Box>
      </div>
    </>
  );

  return (
    <StrataColumnFrame
      id={`${props.kind}-panel`}
      key={scrollKey}
      column={column.column}
      label={
        isTrunk ? "list" : props.kind === "leaflet" ? "side detail" : "detail"
      }
      onFocus={column.focus}
      fallbackLeft={column.offsetLeft}
      animate={column.animate}
    >
      {body}
    </StrataColumnFrame>
  );
}
