import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { logoutAndRedirectToLogin } from "~/routes/app/lifecycle/logout.server";

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  return logoutAndRedirectToLogin(request);
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  return logoutAndRedirectToLogin(request);
}
