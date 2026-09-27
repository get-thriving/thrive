import type { LoaderFunctionArgs } from "react-router";
import { redirect, Outlet } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, "");
  if (pathname === "/app/workspace/apps/vacations") {
    return redirect("/app/workspace/apps/vacations/vacation");
  }
  return {};
}

export default function VacationsLayout() {
  return <Outlet />;
}
