import type { LoaderFunctionArgs } from "react-router";
import { redirect, Outlet } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, "");
  if (pathname === "/app/workspace/apps/chores") {
    return redirect(`/app/workspace/apps/chores/chores${url.search}`);
  }
  return {};
}

export default function ChoresLayout() {
  return <Outlet />;
}
