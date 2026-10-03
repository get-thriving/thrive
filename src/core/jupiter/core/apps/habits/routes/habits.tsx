import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, Outlet } from "react-router";

export async function loader({ url }: LoaderFunctionArgs) {
  const pathname = url.pathname.replace(/\/$/, "");
  if (pathname === "/app/workspace/apps/habits") {
    return redirect(`/app/workspace/apps/habits/habits${url.search}`);
  }
  return {};
}

// This only ever redirects the bare app path, so that's the one time it needs
// asking again - not whenever the query string of a page under it changes.
export const shouldRevalidate: ShouldRevalidateFunction = ({ nextUrl }) =>
  nextUrl.pathname.replace(/\/$/, "") === "/app/workspace/apps/habits";

export default function HabitsLayout() {
  return <Outlet />;
}
