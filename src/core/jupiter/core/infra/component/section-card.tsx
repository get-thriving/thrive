import { Box, Stack } from "@mui/material";
import { Form } from "react-router";
import { useContext, useId } from "react";
import type { JSX, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { StrataBarContext } from "#/core/infra/component/layout/strata-bar-context";
import { useStrataColumnKey } from "#/core/infra/component/layout/strata-column-key-context";
import { useStrataHeaderSlot } from "#/core/infra/component/layout/strata-header-slot";
import { useInterceptedSubmit } from "#/core/infra/component/intent-interceptor";
import { SectionHeader } from "#/core/infra/component/section-header";
import { strataColors } from "#/core/infra/component/strata-tokens";
import { StrataHeaderLendContext } from "#/core/infra/component/strata-header-lend-context";
import { StrataSectionFormContext } from "#/core/infra/component/strata-section-form-context";

export enum ActionsPosition {
  ABOVE,
  BELOW,
}

interface SectionCardProps {
  id?: string;
  title: string;
  actions?: JSX.Element;
  actionsPosition?: ActionsPosition;
  method?: "get" | "post";
  /** The id of its form, for a button drawn apart from it to submit it. */
  formId?: string;
  /**
   * Leave out for a card that is not the first of its page's content, which
   * keeps its own header: only the first one hands its title and controls to
   * the header of the column (ADR 0021).
   */
  lends?: boolean;
}

/**
 * One card of a page that is not a stack of sections: a header like a column's
 * (`SectionHeader`) over a body. The first card of the content of a column is
 * the column's header, as the first section of a stack is: it has no row of its
 * own, and its actions are drawn among the controls of the column's header.
 */
export function SectionCard(props: PropsWithChildren<SectionCardProps>) {
  const actionsPosition = props.actionsPosition ?? ActionsPosition.ABOVE;
  const handleSubmit = useInterceptedSubmit();
  const generatedId = useId();
  const formId = props.formId ?? `section-card-${generatedId}`;
  const columnKey = useStrataColumnKey();
  const lends = useContext(StrataHeaderLendContext) && props.lends !== false;
  const slot = useStrataHeaderSlot(lends ? columnKey : null);
  const lent =
    lends &&
    slot !== null &&
    actionsPosition === ActionsPosition.ABOVE &&
    props.actions !== undefined
      ? createPortal(
          <StrataBarContext.Provider value={slot.bar}>
            <StrataSectionFormContext.Provider value={formId}>
              {props.actions}
            </StrataSectionFormContext.Provider>
          </StrataBarContext.Provider>,
          slot.element,
        )
      : null;

  return (
    <Box
      id={props.id}
      sx={{
        // As wide as the column, edge to edge, with a line on top, like a
        // section of a stack (`StrataSection`); the first one sits right under
        // the column's own line and has none. `&&&` beats the `Stack` the cards
        // may be in, which sets their margins to nothing.
        "&&&": { marginLeft: "-0.5rem", marginRight: "-0.5rem" },
        position: "relative",
        borderBottom: 1,
        borderColor: "divider",
        pb: 1,
        "&::before": {
          content: '""',
          position: "absolute",
          // Over the line under the section above, so the two are one 1px
          // line, half the thickness of a column's, and not a 2px one. A
          // string, as a bare 1 would be all of the height.
          top: -1,
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: strataColors.lineStrong,
          pointerEvents: "none",
        },
        "&:first-child::before": { display: "none" },
      }}
    >
      <Form id={formId} method={props.method ?? "post"} onSubmit={handleSubmit}>
        <SectionHeader
          bodyId={`${formId}-body`}
          title={props.title}
          hideTitle={lends}
          actions={
            actionsPosition === ActionsPosition.ABOVE && !lends
              ? props.actions
              : undefined
          }
        />
        <Box
          id={`${formId}-body`}
          sx={{ px: "0.75rem", pt: lends ? 0.25 : 1.75 }}
        >
          <Stack spacing={1.25}>{props.children}</Stack>
        </Box>
        {actionsPosition === ActionsPosition.BELOW && (
          <Box sx={{ px: "0.75rem", pt: 1 }}>{props.actions}</Box>
        )}
      </Form>
      {lent}
    </Box>
  );
}
