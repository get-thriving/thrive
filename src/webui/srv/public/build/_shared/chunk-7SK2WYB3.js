import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";

// app/logic/intent.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/logic/intent.ts"
  );
  import.meta.hot.lastModified = "1775685113109.3196";
}
function makeIntent(intent, args) {
  if (args !== void 0) {
    return `${intent}:${JSON.stringify(args)}`;
  } else {
    return intent;
  }
}

export {
  makeIntent
};
//# sourceMappingURL=/build/_shared/chunk-7SK2WYB3.js.map
