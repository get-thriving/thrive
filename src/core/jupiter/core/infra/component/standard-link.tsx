import { Link, LinkProps } from "@remix-run/react";
import { styled } from "@mui/material";
import { ComponentPropsWithoutRef } from "react";

interface StyledLinkProps {
  light?: string;
  inline?: string;
  singleline?: string;
}

type StandardLinkComponent = React.ComponentType<StyledLinkProps & LinkProps & { children: React.ReactNode }>;

export const StandardLink: StandardLinkComponent = styled(Link)<StyledLinkProps>(
  ({ theme, light, singleline, inline }) => ({
    textDecoration: "none",
    width: inline === "true" ? undefined : "100%",
    color:
      light === "true"
        ? theme.palette.info.contrastText
        : theme.palette.info.dark,
    ":visited": {
      color:
        light === "true"
          ? theme.palette.info.contrastText
          : theme.palette.info.dark,
    },
    display: "flex",
    gap: "0.5rem",
    flexGrow: inline === "true" ? undefined : "1",
    flexWrap: singleline === "true" ? undefined : "wrap",
    padding: inline === "true" ? undefined : "16px",
    alignItems: "center",
    WebkitTapHighlightColor: "transparent",
  }),
);

type FakeLinkComponent = React.ComponentType<StyledLinkProps & ComponentPropsWithoutRef<"span"> & { children: React.ReactNode }>;

export const FakeLink: FakeLinkComponent = styled("span")<StyledLinkProps>(
  ({ theme, inline, singleline, light }) => ({
    textDecoration: "none",
    width: "100%",
    color:
      light === "true"
        ? theme.palette.info.contrastText
        : theme.palette.info.dark,
    ":visited": {
      color:
        light === "true"
          ? theme.palette.info.contrastText
          : theme.palette.info.dark,
    },
    display: "flex",
    gap: "0.5rem",
    flexWrap: singleline === "true" ? undefined : "wrap",
    padding: inline === "true" ? undefined : "16px",
    alignItems: "center",
    WebkitTapHighlightColor: "transparent",
  }),
);
