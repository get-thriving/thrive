import {
  getFieldError
} from "/build/_shared/chunk-MF4Q6G6N.js";
import {
  useSnackbar
} from "/build/_shared/chunk-43PAR6MS.js";
import {
  Alert_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/infra/component/errors.tsx
var import_react = __toESM(require_react(), 1);
function GlobalError(props) {
  const { enqueueSnackbar } = useSnackbar();
  (0, import_react.useEffect)(() => {
    if (props.actionResult === void 0) {
      return;
    }
    if (props.actionResult.theType !== "some-error-no-data") {
      return;
    }
    if (props.actionResult.globalError === null) {
      return;
    }
    if (props.intent !== void 0 && props.actionResult.intent !== props.intent) {
      return;
    }
    enqueueSnackbar("The values supplied were invalid", {
      key: "errors",
      preventDuplicate: true,
      autoHideDuration: 6e3,
      variant: "error"
    });
  }, [enqueueSnackbar, props.actionResult, props.intent]);
  if (props.actionResult === void 0) {
    return null;
  }
  if (props.actionResult.theType !== "some-error-no-data") {
    return null;
  }
  if (props.actionResult.globalError === null) {
    return null;
  }
  if (props.intent !== void 0 && props.actionResult.intent !== props.intent) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(Alert_default, { severity: "error", children: props.actionResult.globalError }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/errors.tsx",
    lineNumber: 57,
    columnNumber: 10
  }, this);
}
function FieldError(props) {
  const { enqueueSnackbar } = useSnackbar();
  (0, import_react.useEffect)(() => {
    if (props.actionResult === void 0) {
      return;
    }
    if (props.actionResult.theType !== "some-error-no-data") {
      return;
    }
    const errorMsg2 = getFieldError(props.actionResult, props.fieldName);
    if (errorMsg2 === void 0) {
      return;
    }
    enqueueSnackbar("The values supplied were invalid", {
      key: "errors",
      preventDuplicate: true,
      autoHideDuration: 6e3,
      variant: "error"
    });
  }, [enqueueSnackbar, props.actionResult, props.fieldName]);
  if (props.actionResult === void 0) {
    return null;
  }
  if (props.actionResult.theType !== "some-error-no-data") {
    return null;
  }
  const errorMsg = getFieldError(props.actionResult, props.fieldName);
  if (errorMsg === void 0) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(Alert_default, { severity: "error", children: errorMsg }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/errors.tsx",
    lineNumber: 103,
    columnNumber: 10
  }, this);
}
function BetterFieldError(props) {
  if (props.actionResult === void 0) {
    return {};
  }
  if (props.actionResult.theType !== "some-error-no-data") {
    return {};
  }
  const errorMsg = getFieldError(props.actionResult, props.fieldName);
  if (errorMsg === void 0) {
    return {};
  }
  return {
    error: true,
    helperText: errorMsg
  };
}

export {
  GlobalError,
  FieldError,
  BetterFieldError
};
//# sourceMappingURL=/build/_shared/chunk-ETVCQIGU.js.map
