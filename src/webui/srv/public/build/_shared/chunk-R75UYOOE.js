import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";

// app/logic/navigation.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/logic/navigation.ts"
  );
  import.meta.hot.lastModified = "1777278937211.0364";
}
function newURLParams(query, key, value, ...rest) {
  const newQuery = new URLSearchParams(query.toString());
  newQuery.set(key, value);
  for (let i = 0; i < rest.length; i += 2) {
    newQuery.set(rest[i], rest[i + 1]);
  }
  return newQuery;
}

export {
  newURLParams
};
//# sourceMappingURL=/build/_shared/chunk-R75UYOOE.js.map
