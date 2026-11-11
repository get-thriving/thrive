import {
  Group as GroupIcon,
  History as HistoryIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import { Fragment, useContext, useEffect, useRef } from "react";
import type { JSX } from "react";
import { createPortal } from "react-dom";
import { z } from "zod";
import type {
  AccessStatus,
  EntityId,
  NamedEntityTag,
  PublishEntity,
  UserLight,
} from "@jupiter/webapi-client";

import { AccessPanel } from "#/core/common/sub/access/components/access-panel";
import { PublishPanel } from "#/core/common/sub/publish/components/publish-panel";
import { EntityMutationHistoryPanel } from "#/core/infra/component/layout/entity-mutation-history-panel";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useSectionFilters } from "#/core/infra/component/use-section-filter";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { strataSplitKey } from "#/core/infra/strata/strata-columns-with-splits";
import type { UnitSize } from "#/core/infra/strata/layout";
import {
  STRATA_PANEL_VIEWS,
  type StrataPanelView,
} from "#/core/infra/strata/strata-panel-view";
import {
  strataPanelViewId,
  strataPanelViewsPanelId,
  type StrataPanelViewHome,
} from "#/core/infra/strata/strata-panel-view-id";
import { strataPanelViewsToggle } from "#/core/infra/strata/strata-panel-views-toggle";

const FILTERS = z.object({
  split: z.array(z.string()).default([]),
});

const TITLES: Record<StrataPanelView, string> = {
  history: "History",
  publish: "Publish",
  access: "Access",
};

// Every view is M: a column beside the panel it is about.
const VIEW_SIZE: UnitSize = 2;

interface EntityViewsConfig {
  /** Where the panel is on the open path, which says which views are its. */
  home: StrataPanelViewHome;
  /** The buttons' ids start with it: `leaf` gives `leaf-entity-publish`. */
  idPrefix: string;
  /** Key of the route column the panel is in; null until it is laid out. */
  parentKey: string | null;
  entityType?: NamedEntityTag;
  entityRefId?: EntityId;
  inputsEnabled: boolean;
  /** Whether the panel offers the history of the entity. */
  history: boolean;
  publishable?: boolean;
  publishEntity?: PublishEntity;
  accessable?: boolean;
  accessOwner?: UserLight;
  accessStatus?: AccessStatus | null;
  /** Where the panel closes to; the access view needs it, and is not offered without. */
  returnLocation?: string;
  forgetReturnLocation?: string;
}

interface EntityViews {
  /** The buttons that open and close the views; null if there are none. */
  buttons: JSX.Element | null;
  /** The open views, each where it belongs: in a column, or in the panel. */
  bodies: JSX.Element;
  /** Whether a view stands in place of the panel's content. */
  replacesContent: boolean;
  /** Whether the panel offers any view at all. */
  any: boolean;
}

/**
 * The views of an entity a panel can show beside its content: what published
 * it, who has access, and its history (ADR 0021). Each is a column of its own
 * while there is room, a split like a section's, so the entity stays in view
 * next to it. Without room, and on a phone, it stands in place of the panel's
 * content as it always did. Which are open is kept in the URL, as the splits
 * of sections are, so it survives a reload and a link.
 *
 * Returns the buttons for the panel's header, the views to put in its content,
 * and whether the content is replaced.
 */
export function useEntityViews(config: EntityViewsConfig): EntityViews {
  const { home, parentKey, entityType, entityRefId } = config;
  const columns = useContext(StrataColumnsContext);
  const topLevelInfo = useContext(TopLevelInfoContext);
  const [filters, setFilters] = useSectionFilters(
    strataPanelViewsPanelId(home),
    FILTERS,
  );

  const hasEntity = entityType !== undefined && entityRefId !== undefined;
  const available = STRATA_PANEL_VIEWS.filter((view) => {
    if (!hasEntity) {
      return false;
    }
    switch (view) {
      case "history":
        return config.history;
      case "publish":
        return config.publishable === true;
      case "access":
        return (
          config.accessable === true && config.returnLocation !== undefined
        );
    }
  });
  const availableKey = available.join("|");
  const open = available.filter((view) =>
    filters.split.includes(strataPanelViewId(home, view)),
  );

  // Columns exist on a screen with room, once the panel has been placed.
  const phone = columns?.phone ?? false;
  const canSplit = columns !== null && !phone && parentKey !== null;

  function setOpen(view: StrataPanelView, on: boolean) {
    const id = strataPanelViewId(home, view);
    if (on === filters.split.includes(id)) {
      return;
    }
    setFilters({ split: strataPanelViewsToggle(filters.split, id, phone) });
    // The view's column takes the focus; closing it gives the focus back to
    // the panel.
    if (columns !== null && canSplit && parentKey !== null) {
      columns.focusColumn(on ? strataSplitKey(id) : parentKey);
    }
  }

  // Offer the views as columns while the panel is on screen. The control of the
  // column calls the latest `setOpen`, not the one of the render it left.
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;
  const registerSplit = columns?.registerSplit;
  useEffect(() => {
    if (registerSplit === undefined || parentKey === null || phone) {
      return;
    }
    const views = (
      availableKey === "" ? [] : availableKey.split("|")
    ) as StrataPanelView[];
    const undo = views.map((view) =>
      registerSplit(
        {
          id: strataPanelViewId(home, view),
          parentKey,
          title: TITLES[view],
          size: VIEW_SIZE,
          view: true,
        },
        () => setOpenRef.current(view, false),
      ),
    );
    return () => {
      for (const forget of undo) {
        forget();
      }
    };
  }, [registerSplit, parentKey, phone, availableKey, home]);

  // A view asked for is a column once the layout has made room for it, and
  // until then, or if it never does, it stands in the panel.
  function inColumn(view: StrataPanelView): boolean {
    const id = strataPanelViewId(home, view);
    return columns?.splits.find((split) => split.id === id)?.state === "active";
  }
  const replacesContent = open.some((view) => !inColumn(view));

  function contentOf(view: StrataPanelView): JSX.Element | null {
    if (entityType === undefined || entityRefId === undefined) {
      return null;
    }
    switch (view) {
      case "history":
        return (
          <EntityMutationHistoryPanel
            entityType={entityType}
            entityRefId={entityRefId}
          />
        );
      case "publish":
        return (
          <>
            <Stack spacing={2}>
              <PublishPanel
                entityType={entityType}
                entityRefId={entityRefId}
                topLevelInfo={topLevelInfo}
                inputsEnabled={config.inputsEnabled}
                publishEntity={config.publishEntity ?? null}
                accessStatus={config.accessStatus}
              />
            </Stack>
            <Box sx={{ height: "4rem" }}></Box>
          </>
        );
      case "access":
        if (config.returnLocation === undefined) {
          return null;
        }
        return (
          <>
            <Stack spacing={2}>
              <AccessPanel
                entityType={entityType}
                entityRefId={entityRefId}
                topLevelInfo={topLevelInfo}
                inputsEnabled={config.inputsEnabled}
                returnLocation={config.returnLocation}
                forgetReturnLocation={config.forgetReturnLocation}
                owner={config.accessOwner}
                accessStatus={config.accessStatus}
              />
            </Stack>
            <Box sx={{ height: "4rem" }}></Box>
          </>
        );
    }
  }

  const bodies = (
    <>
      {open.map((view) => {
        const content = contentOf(view);
        if (!inColumn(view)) {
          return <Fragment key={view}>{content}</Fragment>;
        }
        // The column is there but its host not yet, for a moment: nothing is
        // drawn, rather than drawn in the panel and moved a moment later.
        const host = columns?.splitHost(strataPanelViewId(home, view)) ?? null;
        return (
          <Fragment key={view}>
            {host !== null && createPortal(content, host)}
          </Fragment>
        );
      })}
    </>
  );

  const buttons =
    available.length === 0 ? null : (
      <Box sx={{ marginLeft: "auto", display: "flex" }}>
        {available.map((view) => {
          const isOpen = open.includes(view);
          const color = isOpen ? "primary" : undefined;
          return (
            <IconButton
              key={view}
              id={`${config.idPrefix}-entity-${view}`}
              aria-label={TITLES[view]}
              title={TITLES[view]}
              aria-pressed={isOpen}
              onClick={() => setOpen(view, !isOpen)}
            >
              {view === "publish" && <PublicIcon color={color} />}
              {view === "access" && <GroupIcon color={color} />}
              {view === "history" && <HistoryIcon color={color} />}
            </IconButton>
          );
        })}
      </Box>
    );

  return {
    buttons,
    bodies,
    replacesContent,
    any: available.length > 0,
  };
}
