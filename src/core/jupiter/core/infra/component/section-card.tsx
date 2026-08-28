import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  styled,
} from "@mui/material";
import { Form } from "@remix-run/react";
import type { PropsWithChildren } from "react";

import { CARD_INNER_CORNER_RADIUS } from "#/core/infra/component/theme";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

// What the section keeps between its own border and the cards inside it on a
// phone - just enough to read as a gap, with the rest of the width going to
// the cards.
const SMALL_SCREEN_TIGHT_PADDING = "4px";

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
  // For sections that are a list of cards: on a phone the section's own
  // padding is width those cards could be using, so it drops to almost
  // nothing there.
  tightContentOnSmallScreen?: boolean;
}

export function SectionCard(props: PropsWithChildren<SectionCardProps>) {
  const isBigScreen = useBigScreen();
  const actionsPosition = props.actionsPosition ?? ActionsPosition.ABOVE;
  const tightContent = props.tightContentOnSmallScreen === true && !isBigScreen;

  return (
    <StyledCard id={props.id}>
      <Form method={props.method ?? "post"}>
        <SectionHeader>
          <SectionHeaderContent>
            <SectionTitle label={props.title} />
          </SectionHeaderContent>
          {actionsPosition === ActionsPosition.ABOVE && props.actions}
        </SectionHeader>
        <CardContent
          sx={
            tightContent
              ? {
                  padding: SMALL_SCREEN_TIGHT_PADDING,
                  "&:last-child": {
                    paddingBottom: SMALL_SCREEN_TIGHT_PADDING,
                  },
                }
              : undefined
          }
        >
          <Stack spacing={2}>{props.children}</Stack>
        </CardContent>
        {actionsPosition === ActionsPosition.BELOW && (
          <CardActions>{props.actions}</CardActions>
        )}
      </Form>
    </StyledCard>
  );
}

const SectionHeader = styled("div")(() => ({
  display: "flex",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
  height: "3rem",
  width: "100%",
}));

const StyledCard = styled(Card)(() => ({
  position: "relative",
  overflow: "visible",
}));

const SectionHeaderContent = styled("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  minWidth: "0",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
  height: "3rem",
}));

const SectionTitle = styled(Chip)(() => ({
  position: "relative",
  top: "-0.05rem",
  fontSize: "1.5rem",
  fontVariant: "small-caps",
  height: "100%",
  left: "-0.05rem",
  paddingTop: "0.05rem",
  paddingBottom: "0.05rem",
  paddingRight: "2rem",
  paddingLeft: "0.5rem",
  borderRadius: "0px",
  borderTopLeftRadius: CARD_INNER_CORNER_RADIUS,
  borderBottomRightRadius: "4px",
}));
