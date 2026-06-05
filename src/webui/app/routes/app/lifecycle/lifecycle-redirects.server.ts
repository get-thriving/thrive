import type { LoadTopLevelInfoResult } from "@jupiter/webapi-client";
import { redirect } from "@remix-run/node";

export function emailVerificationVerifyUrl(userId: string): string {
  return `/app/lifecycle/email-verification/verify?userId=${userId}`;
}

export function createWorkspaceUrl(userId: string): string {
  return `/app/lifecycle/init/create-workspace?userId=${userId}`;
}

export function redirectForLifecycleState(
  result: LoadTopLevelInfoResult,
): Response {
  if (!result.user) {
    return redirect("/app/lifecycle/init/local/create-user");
  }
  if (!result.user.verified) {
    return redirect(emailVerificationVerifyUrl(result.user.ref_id));
  }
  if (result.workspace) {
    return redirect("/app/workspace");
  }
  return redirect(createWorkspaceUrl(result.user.ref_id));
}

export function redirectForEmailVerificationPage(
  result: LoadTopLevelInfoResult,
  userId: string,
): Response | null {
  if (!result.user) {
    return redirect("/app/lifecycle/init/local/create-user");
  }
  if (result.user.ref_id !== userId) {
    return redirectForLifecycleState(result);
  }
  if (result.user.verified) {
    if (result.workspace) {
      return redirect("/app/workspace");
    }
    return redirect(createWorkspaceUrl(result.user.ref_id));
  }
  return null;
}
