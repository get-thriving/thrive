import {
  VisibilityOff_default,
  Visibility_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  IconButton_default,
  InputAdornment_default,
  OutlinedInput_default
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

// ../core/jupiter/core/auth/component/password.tsx
var import_react = __toESM(require_react(), 1);
function Password(props) {
  const [showPassword, setShowPassword] = (0, import_react.useState)(false);
  function handleClickShowPassword() {
    setShowPassword((show) => !show);
  }
  function handleMouseDownPassword(event) {
    event.preventDefault();
  }
  function handleMouseUpPassword(event) {
    event.preventDefault();
  }
  return /* @__PURE__ */ jsxDEV(
    OutlinedInput_default,
    {
      id: props.name,
      label: props.label,
      type: showPassword ? "text" : "password",
      autoComplete: props.autoComplete,
      name: props.name,
      readOnly: !props.inputsEnabled,
      endAdornment: /* @__PURE__ */ jsxDEV(InputAdornment_default, { position: "end", children: /* @__PURE__ */ jsxDEV(
        IconButton_default,
        {
          "aria-label": showPassword ? "hide the password" : "display the password",
          onClick: handleClickShowPassword,
          onMouseDown: handleMouseDownPassword,
          onMouseUp: handleMouseUpPassword,
          edge: "end",
          children: showPassword ? /* @__PURE__ */ jsxDEV(VisibilityOff_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/auth/component/password.tsx",
            lineNumber: 46,
            columnNumber: 29
          }, this) : /* @__PURE__ */ jsxDEV(Visibility_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/auth/component/password.tsx",
            lineNumber: 46,
            columnNumber: 49
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/auth/component/password.tsx",
          lineNumber: 37,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "../core/jupiter/core/auth/component/password.tsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      defaultValue: ""
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/auth/component/password.tsx",
      lineNumber: 28,
      columnNumber: 5
    },
    this
  );
}

export {
  Password
};
//# sourceMappingURL=/build/_shared/chunk-TAFZP6GZ.js.map
