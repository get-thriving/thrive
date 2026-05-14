import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";

// app/rendering/standard-should-revalidate.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/rendering/standard-should-revalidate.ts"
  );
  import.meta.hot.lastModified = "1777278937211.2007";
}
var basicShouldRevalidate = ({
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formMethod,
  nextUrl
}) => {
  if (formAction === "/app/workspace/core/inbox-tasks/update-status-and-eisen") {
    return false;
  }
  if (formAction === "/app/workspace/core/notes/update") {
    return false;
  }
  if (currentUrl.pathname === nextUrl.pathname && onlyDifferenceIsInTimeEventParamsSource(
    formMethod || "GET",
    currentUrl,
    nextUrl
  )) {
    return false;
  }
  return defaultShouldRevalidate;
};
var standardShouldRevalidate = ({
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formMethod,
  nextUrl
}) => {
  if (formAction === "/app/workspace/core/inbox-tasks/update-status-and-eisen") {
    return false;
  }
  if (formAction === "/app/workspace/docs/update-action") {
    return false;
  }
  if (formAction === "/app/workspace/core/notes/update") {
    return false;
  }
  if (currentUrl.pathname === nextUrl.pathname && onlyDifferenceIsInTimeEventParamsSource(
    formMethod || "GET",
    currentUrl,
    nextUrl
  )) {
    return false;
  }
  return defaultShouldRevalidate;
};
function onlyDifferenceIsInTimeEventParamsSource(formMethod, currentUrl, nextUrl) {
  if (formMethod !== "GET") {
    return false;
  }
  const currentKeys = Array.from(currentUrl.searchParams.keys());
  const nextKeys = Array.from(nextUrl.searchParams.keys());
  if (currentKeys.length === 0 && nextKeys.length === 0) {
    return false;
  }
  for (const key of currentKeys) {
    if (key === "sourceStartDate" || key === "sourceStartTimeInDay" || key === "sourceDurationMins") {
      continue;
    }
    if (currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key)) {
      return false;
    }
  }
  for (const key of nextKeys) {
    if (key === "sourceStartDate" || key === "sourceStartTimeInDay" || key === "sourceDurationMins") {
      continue;
    }
    if (currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key)) {
      return false;
    }
  }
  return true;
}

export {
  basicShouldRevalidate,
  standardShouldRevalidate
};
//# sourceMappingURL=/build/_shared/chunk-ZL2FGMVX.js.map
