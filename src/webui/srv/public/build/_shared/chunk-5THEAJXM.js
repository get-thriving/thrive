import {
  useLoaderData
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/rendering/use-loader-data-for-animation.ts
var import_react2 = __toESM(require_react());
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/rendering/use-loader-data-for-animation.ts"
  );
  import.meta.hot.lastModified = "1775685113110.4487";
}
function useLoaderDataSafeForAnimation() {
  const lastData = (0, import_react2.useRef)({});
  const data = useLoaderData() || lastData.current;
  (0, import_react2.useEffect)(() => {
    if (data)
      lastData.current = data;
  }, [data]);
  return data;
}

export {
  useLoaderDataSafeForAnimation
};
//# sourceMappingURL=/build/_shared/chunk-5THEAJXM.js.map
