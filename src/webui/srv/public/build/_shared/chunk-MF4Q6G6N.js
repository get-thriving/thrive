import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";

// ../core/jupiter/core/infra/action-result.ts
function isNoErrorSomeData(action) {
  return action.theType === "no-error-some-data";
}
function aFieldError(fieldName, error) {
  return {
    theType: "some-error-no-data",
    globalError: null,
    fieldErrors: {
      [fieldName]: error
    }
  };
}
function getFieldError(uiErrorInfo, fieldPrefix) {
  if (uiErrorInfo === void 0) {
    return void 0;
  }
  for (const [key, message] of Object.entries(uiErrorInfo.fieldErrors)) {
    if (key.startsWith(fieldPrefix)) {
      return message;
    }
  }
  return void 0;
}
var ValidationErrorSchema = external_exports.object({
  detail: external_exports.array(
    external_exports.object({
      loc: external_exports.array(external_exports.string().or(external_exports.number())),
      msg: external_exports.string()
    })
  )
});

export {
  isNoErrorSomeData,
  aFieldError,
  getFieldError
};
//# sourceMappingURL=/build/_shared/chunk-MF4Q6G6N.js.map
