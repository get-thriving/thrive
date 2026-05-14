import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";

// ../core/jupiter/core/common/select-form.ts
function selectZod(zodEntity) {
  return external_exports.union([
    external_exports.undefined(),
    external_exports.string().length(0).transform(() => void 0),
    external_exports.string().transform((value) => {
      if (value.trim() === "") {
        return void 0;
      }
      return value.split(",").map((item) => item.trim());
    }).refine((value) => {
      if (value === void 0) {
        return void 0;
      }
      return external_exports.array(zodEntity).parse(value);
    })
  ]);
}

export {
  selectZod
};
//# sourceMappingURL=/build/_shared/chunk-HVVVLUYY.js.map
