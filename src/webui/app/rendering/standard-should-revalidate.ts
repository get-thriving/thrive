import type { ShouldRevalidateFunction } from "@remix-run/react";
import { TIME_PLAN_GROUPING_PARAM } from "@jupiter/core/apps/time_plans/grouping";
import { TIME_PLAN_VIEW_PARAM } from "@jupiter/core/apps/time_plans/view-mode";

export const basicShouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formMethod,
  nextUrl,
}) => {
  if (
    formAction === "/app/workspace/core/inbox-tasks/update-status-and-eisen"
  ) {
    return false;
  }

  if (formAction === "/app/workspace/core/notes/update") {
    return false;
  }

  if (
    currentUrl.pathname === nextUrl.pathname &&
    onlyDifferenceIsInTimeEventParamsSource(
      formMethod || "GET",
      currentUrl,
      nextUrl,
    )
  ) {
    return false;
  }

  return defaultShouldRevalidate;
};

export const standardShouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formMethod,
  nextUrl,
}) => {
  if (
    formAction === "/app/workspace/core/inbox-tasks/update-status-and-eisen"
  ) {
    return false;
  }

  if (formAction === "/app/workspace/apps/docs/update-action") {
    return false;
  }

  if (formAction === "/app/workspace/core/notes/update") {
    return false;
  }

  if (
    currentUrl.pathname === nextUrl.pathname &&
    onlyDifferenceIsInTimeEventParamsSource(
      formMethod || "GET",
      currentUrl,
      nextUrl,
    )
  ) {
    return false;
  }

  return defaultShouldRevalidate;
};

// Which way a time plan is being looked at is written down in the URL, but
// it's nothing the loaders have an opinion about - switching between the
// views or groupings shouldn't cost a round trip to the server.
export function ignoringTimePlanViewChanges(
  inner: ShouldRevalidateFunction,
): ShouldRevalidateFunction {
  return (args) => {
    if (
      args.formMethod === undefined &&
      args.currentUrl.pathname === args.nextUrl.pathname &&
      onlyDifferenceIsTimePlanDisplay(args.currentUrl, args.nextUrl)
    ) {
      return false;
    }

    return inner(args);
  };
}

const TIME_PLAN_DISPLAY_PARAMS = new Set([
  TIME_PLAN_VIEW_PARAM,
  TIME_PLAN_GROUPING_PARAM,
]);

function onlyDifferenceIsTimePlanDisplay(
  currentUrl: URL,
  nextUrl: URL,
): boolean {
  const keys = new Set([
    ...currentUrl.searchParams.keys(),
    ...nextUrl.searchParams.keys(),
  ]);

  let sawADisplayChange = false;
  for (const key of keys) {
    if (
      currentUrl.searchParams.get(key) === nextUrl.searchParams.get(key) &&
      currentUrl.searchParams.getAll(key).length ===
        nextUrl.searchParams.getAll(key).length
    ) {
      continue;
    }

    if (!TIME_PLAN_DISPLAY_PARAMS.has(key)) {
      return false;
    }

    sawADisplayChange = true;
  }

  return sawADisplayChange;
}

function onlyDifferenceIsInTimeEventParamsSource(
  formMethod: string,
  currentUrl: URL,
  nextUrl: URL,
): boolean {
  if (formMethod !== "GET") {
    return false;
  }

  const currentKeys = Array.from(currentUrl.searchParams.keys());
  const nextKeys = Array.from(nextUrl.searchParams.keys());

  if (currentKeys.length === 0 && nextKeys.length === 0) {
    return false;
  }

  for (const key of currentKeys) {
    if (
      key === "sourceStartDate" ||
      key === "sourceStartTimeInDay" ||
      key === "sourceDurationMins"
    ) {
      continue;
    }

    if (currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key)) {
      return false;
    }
  }

  for (const key of nextKeys) {
    if (
      key === "sourceStartDate" ||
      key === "sourceStartTimeInDay" ||
      key === "sourceDurationMins"
    ) {
      continue;
    }

    if (currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key)) {
      return false;
    }
  }

  return true;
}
