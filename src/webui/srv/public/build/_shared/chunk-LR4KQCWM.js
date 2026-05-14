import {
  birthdayFromParts,
  extractBirthday
} from "/build/_shared/chunk-IRHCW4HP.js";
import {
  FormControl_default,
  InputLabel_default,
  MenuItem_default,
  Select_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/birthday-select.tsx
var import_react = __toESM(require_react(), 1);
var NONE_BIRTHDAY = "N/A";
var SAFE_DEFAULT_BIRTHDAY_PARTS = {
  day: 12,
  month: 9
};
function ordinal(day) {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}
function dayFromInitialValue(initialValue, allowNoneBirthday) {
  if (initialValue === null || initialValue === void 0) {
    return allowNoneBirthday ? NONE_BIRTHDAY : `${SAFE_DEFAULT_BIRTHDAY_PARTS.day}`;
  }
  const extracted = extractBirthday(initialValue);
  return `${extracted.day}`;
}
function monthFromInitialValue(initialValue, allowNoneBirthday) {
  if (initialValue === null || initialValue === void 0) {
    return allowNoneBirthday ? NONE_BIRTHDAY : `${SAFE_DEFAULT_BIRTHDAY_PARTS.month}`;
  }
  const extracted = extractBirthday(initialValue);
  return `${extracted.month}`;
}
function BirthdaySelect(props) {
  const allowNoneBirthday = props.allowNoneBirthday ?? true;
  const [birthdayDay, setBirthdayDay] = (0, import_react.useState)(
    dayFromInitialValue(props.initialValue, allowNoneBirthday)
  );
  const [birthdayMonth, setBirthdayMonth] = (0, import_react.useState)(
    monthFromInitialValue(props.initialValue, allowNoneBirthday)
  );
  (0, import_react.useEffect)(() => {
    setBirthdayDay(dayFromInitialValue(props.initialValue, allowNoneBirthday));
  }, [props.initialValue, allowNoneBirthday]);
  (0, import_react.useEffect)(() => {
    setBirthdayMonth(
      monthFromInitialValue(props.initialValue, allowNoneBirthday)
    );
  }, [props.initialValue, allowNoneBirthday]);
  const dayLabelId = `${props.name}-birthdayDay`;
  const monthLabelId = `${props.name}-birthdayMonth`;
  function handleDayChange(event) {
    if (!allowNoneBirthday && event.target.value === NONE_BIRTHDAY) {
      return;
    }
    setBirthdayDay(event.target.value);
  }
  function handleMonthChange(event) {
    if (!allowNoneBirthday && event.target.value === NONE_BIRTHDAY) {
      return;
    }
    setBirthdayMonth(event.target.value);
  }
  const encodedBirthdayValue = (0, import_react.useMemo)(() => {
    if (birthdayDay === NONE_BIRTHDAY || birthdayMonth === NONE_BIRTHDAY) {
      return "";
    }
    return birthdayFromParts(
      parseInt(birthdayDay, 10),
      parseInt(birthdayMonth, 10)
    );
  }, [birthdayDay, birthdayMonth]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", sx: { width: "100%" }, children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: dayLabelId, htmlFor: dayLabelId, children: "Birthday Day" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          Select_default,
          {
            labelId: dayLabelId,
            readOnly: !props.inputsEnabled,
            value: birthdayDay,
            label: "Birthday Day",
            onChange: handleDayChange,
            children: [
              allowNoneBirthday && /* @__PURE__ */ jsxDEV(MenuItem_default, { value: NONE_BIRTHDAY, children: "N/A" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 132,
                columnNumber: 15
              }, this),
              Array.from({ length: 31 }, (_, i) => i + 1).map((day) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: `${day}`, children: ordinal(day) }, day, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 135,
                columnNumber: 15
              }, this))
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
            lineNumber: 124,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
        lineNumber: 120,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: monthLabelId, htmlFor: monthLabelId, children: "Birthday Month" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
          lineNumber: 143,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          Select_default,
          {
            labelId: monthLabelId,
            readOnly: !props.inputsEnabled,
            value: birthdayMonth,
            label: "Birthday Month",
            onChange: handleMonthChange,
            children: [
              allowNoneBirthday && /* @__PURE__ */ jsxDEV(MenuItem_default, { value: NONE_BIRTHDAY, children: "N/A" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 154,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "1", children: "January" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 156,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "2", children: "February" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 157,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "3", children: "March" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 158,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "4", children: "April" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 159,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "5", children: "May" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 160,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "6", children: "June" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 161,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "7", children: "July" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 162,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "8", children: "August" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 163,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "9", children: "September" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 164,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "10", children: "October" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 165,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "11", children: "November" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 166,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "12", children: "December" }, void 0, false, {
                fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
                lineNumber: 167,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
            lineNumber: 146,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: encodedBirthdayValue }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
      lineNumber: 171,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/birthday-select.tsx",
    lineNumber: 118,
    columnNumber: 5
  }, this);
}

export {
  BirthdaySelect
};
//# sourceMappingURL=/build/_shared/chunk-LR4KQCWM.js.map
