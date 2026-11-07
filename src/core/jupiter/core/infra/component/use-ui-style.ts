import { UiStyle } from "@jupiter/webapi-client";
import { useRouteLoaderData } from "react-router";

/**
 * The user's UI style (ADR 0019), from the root loader. Classic when there is
 * no root data, e.g. in tests and outside the workspace.
 */
export function useUiStyle(): UiStyle {
  const rootData = useRouteLoaderData("root") as
    { uiStyle?: UiStyle } | undefined;
  return rootData?.uiStyle ?? UiStyle.CLASSIC;
}
