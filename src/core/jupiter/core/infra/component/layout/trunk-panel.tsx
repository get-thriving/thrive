import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import { Link, useLocation } from "react-router";
import type { JSX, PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import type {
  EntityId,
  NamedEntityTag,
  UserLight,
  AccessStatus,
  PublishEntity,
} from "@jupiter/webapi-client";

import { extractTrunkFromPath } from "#/core/infra/routes";
import {
  restoreScrollPosition,
  saveScrollPosition,
} from "#/core/infra/scroll-restoration";
import { ColumnHeader } from "#/core/infra/component/layout/column-header";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { useStrataColumnItemKeys } from "#/core/infra/component/layout/use-strata-column-item-keys";
import { useEntityViews } from "#/core/infra/component/layout/use-entity-views";
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
  const preserveFilters = useSectionFiltersPreserver();
  const column = useStrataColumn(DisplayType.TRUNK);
  // What was published and who has access: columns beside this one, or in its
  // place when there is no room. A trunk has no history of its own.
  const views = useEntityViews({
    home: "trunk",
    idPrefix: "trunk",
    parentKey: column.column?.key ?? null,
    entityType: props.entityType,
    entityRefId: props.entityRefId,
    inputsEnabled: props.inputsEnabled ?? false,
    history: false,
    publishable: props.publishable,
    publishEntity: props.publishEntity,
    accessable: props.accessable,
    accessOwner: props.accessOwner,
    accessStatus: props.accessStatus,
    returnLocation: props.returnLocation,
    forgetReturnLocation: props.forgetReturnLocation,
  });

  // The list of a trunk is the column's own, with no sections: `e`, `j`, `k`
  // and `↵` go through its items.
  useStrataColumnItemKeys(containerRef);

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
      <ColumnHeader id="trunk-panel-controls" label="list">
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

        {views.buttons}

        <IconButton
          sx={{
            marginLeft: views.any ? undefined : "auto",
          }}
        >
          <Link data-strata-close to={props.returnLocation}>
            <CloseIcon />
          </Link>
        </IconButton>
      </ColumnHeader>

      <div id="trunk-panel-content" ref={containerRef}>
        {views.bodies}

        <Box
          sx={{ display: views.replacesContent ? "none" : undefined }}
          aria-hidden={views.replacesContent}
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
