import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, Outlet } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, "");
  if (pathname === "/app/workspace/apps/chores") {
    return redirect(`/app/workspace/apps/chores/chores${url.search}`);
  }
  return {};
}

// This only ever redirects the bare app path, so that's the one time it needs
// asking again - not whenever the query string of a page under it changes.
export const shouldRevalidate: ShouldRevalidateFunction = ({ nextUrl }) =>
  nextUrl.pathname.replace(/\/$/, "") === "/app/workspace/apps/chores";

export default function ChoresLayout() {
  return <Outlet />;
}
