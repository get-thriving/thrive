import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  DifficultySelect,
  EisenhowerSelect
} from "/build/_shared/chunk-T6GSSEVE.js";
import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";
import {
  FieldError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  Checkbox_default,
  FormControlLabel_default,
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  MenuItem_default,
  OutlinedInput_default,
  Select_default,
  Stack_default,
  ToggleButtonGroup_default,
  ToggleButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
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

// ../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);
var import_react2 = __toESM(require_react(), 1);

// ../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/common/recurring-task-skip-rule.ts
var import_webapi_client = __toESM(require_dist(), 1);
function skipRuleTypeName(skipRuleType, isBigScreen = true) {
  switch (skipRuleType) {
    case "none" /* NONE */:
      return isBigScreen ? "None" : "\u{1F6AB}";
    case "even" /* EVEN */:
      return "Even";
    case "odd" /* ODD */:
      return "Odd";
    case "every" /* EVERY */:
      return `Every`;
    case "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */:
      return isBigScreen ? `In Week` : "Wk";
    case "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */:
      return isBigScreen ? `In Month` : "Mnth";
    case "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */:
      return isBigScreen ? `In Year` : "Yr";
    case "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */:
      return `Custom`;
    case "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */:
      return `Custom`;
  }
}
function isCompatibleWithPeriod(skipRuleType, period) {
  const dailyTypes = [
    "none" /* NONE */,
    "even" /* EVEN */,
    "odd" /* ODD */,
    "every" /* EVERY */,
    "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */,
    "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */
  ];
  const weeklyTypes = [
    "none" /* NONE */,
    "even" /* EVEN */,
    "odd" /* ODD */,
    "every" /* EVERY */,
    "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */
  ];
  const monthlyTypes = [
    "none" /* NONE */,
    "even" /* EVEN */,
    "odd" /* ODD */,
    "every" /* EVERY */,
    "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */
  ];
  const quarterlyTypes = [
    "none" /* NONE */,
    "even" /* EVEN */,
    "odd" /* ODD */,
    "every" /* EVERY */,
    "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */
  ];
  const defaultTypes = [
    "none" /* NONE */,
    "even" /* EVEN */,
    "odd" /* ODD */,
    "every" /* EVERY */
  ];
  switch (period) {
    case import_webapi_client.RecurringTaskPeriod.DAILY:
      return dailyTypes.includes(skipRuleType);
    case import_webapi_client.RecurringTaskPeriod.WEEKLY:
      return weeklyTypes.includes(skipRuleType);
    case import_webapi_client.RecurringTaskPeriod.MONTHLY:
      return monthlyTypes.includes(skipRuleType);
    case import_webapi_client.RecurringTaskPeriod.QUARTERLY:
      return quarterlyTypes.includes(skipRuleType);
    default:
      return defaultTypes.includes(skipRuleType);
  }
}
function parseSkipRule(skipRule) {
  if (!skipRule) {
    return { type: "none" /* NONE */ };
  }
  const parts = skipRule.split(" ");
  const type = parts[0];
  switch (type) {
    case "even" /* EVEN */:
      return { type: "even" /* EVEN */ };
    case "odd" /* ODD */:
      return { type: "odd" /* ODD */ };
    case "every" /* EVERY */:
      return {
        type: "every" /* EVERY */,
        n: parseInt(parts[1]),
        k: parseInt(parts[2])
      };
    case "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */:
      return {
        type: "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */,
        daysRelWeek: parts.slice(1).map((d) => parseInt(d))
      };
    case "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */:
      return {
        type: "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */,
        daysRelMonth: parts.slice(1).map((d) => parseInt(d))
      };
    case "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */:
      return {
        type: "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */,
        weeks: parts.slice(1).map((w) => parseInt(w))
      };
    case "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */:
      return {
        type: "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */,
        months: parts.slice(1).map((m) => parseInt(m))
      };
    case "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */:
      return {
        type: "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */,
        quarters: parts.slice(1).map((q) => parseInt(q))
      };
    default:
      throw new Error(`Unknown skip rule type: ${type}`);
  }
}
function assembleSkipRule(skipRule) {
  switch (skipRule.type) {
    case "none" /* NONE */:
      return "";
    case "even" /* EVEN */:
      return "even" /* EVEN */;
    case "odd" /* ODD */:
      return "odd" /* ODD */;
    case "every" /* EVERY */:
      return `${"every" /* EVERY */} ${skipRule.n} ${skipRule.k}`;
    case "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */: {
      const details = skipRule.daysRelWeek.join(" ");
      return `${"custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */} ${details}`;
    }
    case "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */: {
      const details = skipRule.daysRelMonth.join(" ");
      return `${"custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */} ${details}`;
    }
    case "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */: {
      const details = skipRule.weeks.join(" ");
      return `${"custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */} ${details}`;
    }
    case "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */: {
      const details = skipRule.months.join(" ");
      return `${"custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */} ${details}`;
    }
    case "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */: {
      const details = skipRule.quarters.join(" ");
      return `${"custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */} ${details}`;
    }
  }
}

// ../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx
function skipRuleToEditingInfo(period, skipRule) {
  if (!isCompatibleWithPeriod(skipRule.type, period)) {
    return {
      theType: "none" /* NONE */,
      n: "3",
      k: "0",
      daysRelWeek: [1],
      daysRelMonth: [1],
      weeks: [1],
      months: [1],
      quarters: [1]
    };
  }
  return {
    theType: skipRule.type,
    n: "n" in skipRule ? skipRule.n.toString() : "3",
    k: "k" in skipRule ? skipRule.k.toString() : "0",
    daysRelWeek: "daysRelWeek" in skipRule ? skipRule.daysRelWeek : [1],
    daysRelMonth: "daysRelMonth" in skipRule ? skipRule.daysRelMonth : [1],
    weeks: "weeks" in skipRule ? skipRule.weeks : [1],
    months: "months" in skipRule ? skipRule.months : [1],
    quarters: "quarters" in skipRule ? skipRule.quarters : [1]
  };
}
function editingInfoToSkipRule(editingInfo) {
  switch (editingInfo.theType) {
    case "none" /* NONE */:
      return { type: "none" /* NONE */ };
    case "even" /* EVEN */:
      return { type: "even" /* EVEN */ };
    case "odd" /* ODD */:
      return { type: "odd" /* ODD */ };
    case "every" /* EVERY */: {
      const realN = parseInt(editingInfo.n);
      const realK = parseInt(editingInfo.k);
      if (isNaN(realN) || isNaN(realK)) {
        return { type: "every" /* EVERY */, n: -1, k: -1 };
      }
      return { type: "every" /* EVERY */, n: realN, k: realK };
    }
    case "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */:
      return {
        type: "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */,
        daysRelWeek: editingInfo.daysRelWeek
      };
    case "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */:
      return {
        type: "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */,
        daysRelMonth: editingInfo.daysRelMonth
      };
    case "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */:
      return {
        type: "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */,
        weeks: editingInfo.weeks
      };
    case "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */:
      return {
        type: "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */,
        months: editingInfo.months
      };
    case "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */:
      return {
        type: "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */,
        quarters: editingInfo.quarters
      };
  }
}
function RecurringTaskSkipRuleBlock(props) {
  const isBigScreen = useBigScreen();
  const [editingInfo, setEditingInfo] = (0, import_react.useState)(
    skipRuleToEditingInfo(props.period, parseSkipRule(props.skipRule))
  );
  (0, import_react.useEffect)(() => {
    setEditingInfo(
      skipRuleToEditingInfo(props.period, parseSkipRule(props.skipRule))
    );
  }, [props.skipRule, props.period]);
  function handleNewSkipRule(event, newSkipRuleType) {
    if (newSkipRuleType === null) {
      return;
    }
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      theType: newSkipRuleType
    }));
  }
  function handleChangeEveryNewN(newN) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      n: newN
    }));
  }
  function handleChangeEveryNewK(newK) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      k: newK
    }));
  }
  function handleChangeCustomDailyRelWeekly(day, include) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      daysRelWeek: include ? [...oldEditingInfo.daysRelWeek, day] : oldEditingInfo.daysRelWeek.filter((d) => d !== day)
    }));
  }
  function handleChangeCustomDailyRelMonthly(day, include) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      daysRelMonth: include ? [...oldEditingInfo.daysRelMonth, day] : oldEditingInfo.daysRelMonth.filter((d) => d !== day)
    }));
  }
  function handleChangeCustomWeeklyRelYearly(week, include) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      weeks: include ? [...oldEditingInfo.weeks, week] : oldEditingInfo.weeks.filter((w) => w !== week)
    }));
  }
  function handleChangeCustomMonthlyRelYearly(month, include) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      months: include ? [...oldEditingInfo.months, month] : oldEditingInfo.months.filter((m) => m !== month)
    }));
  }
  function handleChangeCustomQuarterlyRelYearly(quarter, include) {
    setEditingInfo((oldEditingInfo) => ({
      ...oldEditingInfo,
      quarters: include ? [...oldEditingInfo.quarters, quarter] : oldEditingInfo.quarters.filter((q) => q !== quarter)
    }));
  }
  const everyBlock = /* @__PURE__ */ jsxDEV(Fragment, { children: editingInfo.theType === "every" /* EVERY */ && /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
    /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { children: "Every N" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 212,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(
        OutlinedInput_default,
        {
          label: "Every N",
          readOnly: !props.inputsEnabled,
          value: editingInfo.n,
          onChange: (event) => handleChangeEveryNewN(event.target.value)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 213,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 211,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { children: "Shift by K" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 221,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(
        OutlinedInput_default,
        {
          label: "Shift by K",
          readOnly: !props.inputsEnabled,
          value: editingInfo.k || "",
          onChange: (event) => handleChangeEveryNewK(event.target.value)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 222,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 220,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 210,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 208,
    columnNumber: 5
  }, this);
  const customDailyRelWeeklyBlock = /* @__PURE__ */ jsxDEV(Fragment, { children: editingInfo.theType === "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */ && /* @__PURE__ */ jsxDEV(
    Stack_default,
    {
      useFlexGap: true,
      direction: "row",
      sx: { justifyContent: "space-around" },
      children: [
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 244,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(1),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(1, checked),
            label: isBigScreen ? "Mon" : "M"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 242,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 253,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(2),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(2, checked),
            label: isBigScreen ? "Tue" : "T"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 251,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 262,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(3),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(3, checked),
            label: isBigScreen ? "Wed" : "W"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 260,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 271,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(4),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(4, checked),
            label: isBigScreen ? "Thu" : "T"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 269,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 280,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(5),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(5, checked),
            label: isBigScreen ? "Fri" : "F"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 278,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 289,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(6),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(6, checked),
            label: isBigScreen ? "Sat" : "S"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 287,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FormControlLabel_default,
          {
            sx: { marginRight: isBigScreen ? "8px" : "2px" },
            control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
              lineNumber: 298,
              columnNumber: 22
            }, this),
            checked: editingInfo.daysRelWeek.includes(7),
            onChange: (event, checked) => handleChangeCustomDailyRelWeekly(7, checked),
            label: isBigScreen ? "Sun" : "S"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 296,
            columnNumber: 11
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 237,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 235,
    columnNumber: 5
  }, this);
  const customDailyRelMonthlyBlock = /* @__PURE__ */ jsxDEV(Fragment, { children: editingInfo.theType === "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */ && /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      },
      children: [...Array(31).keys()].map((day) => /* @__PURE__ */ jsxDEV(
        FormControlLabel_default,
        {
          control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 323,
            columnNumber: 24
          }, this),
          checked: editingInfo.daysRelMonth.includes(day + 1),
          onChange: (event, checked) => handleChangeCustomDailyRelMonthly(day + 1, checked),
          label: day + 1
        },
        day,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 321,
          columnNumber: 13
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 313,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 311,
    columnNumber: 5
  }, this);
  const customWeeklyRelYearlyBlock = /* @__PURE__ */ jsxDEV(Fragment, { children: editingInfo.theType === "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */ && /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      },
      children: [...Array(52).keys()].map((week) => /* @__PURE__ */ jsxDEV(
        FormControlLabel_default,
        {
          control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 349,
            columnNumber: 24
          }, this),
          checked: editingInfo.weeks.includes(week + 1),
          onChange: (event, checked) => handleChangeCustomWeeklyRelYearly(week + 1, checked),
          label: week + 1
        },
        week,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 347,
          columnNumber: 13
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 339,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 337,
    columnNumber: 5
  }, this);
  const customMonthlyRelYearlyBlock = /* @__PURE__ */ jsxDEV(Fragment, { children: editingInfo.theType === "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */ && /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      },
      children: [...Array(12).keys()].map((month) => /* @__PURE__ */ jsxDEV(
        FormControlLabel_default,
        {
          control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 375,
            columnNumber: 24
          }, this),
          checked: editingInfo.months.includes(month + 1),
          onChange: (event, checked) => handleChangeCustomMonthlyRelYearly(month + 1, checked),
          label: DateTime.local().set({ month: month + 1 }).toFormat("LLL")
        },
        month,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 373,
          columnNumber: 13
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 365,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 363,
    columnNumber: 5
  }, this);
  const customQuarterlyRelYearlyBlock = /* @__PURE__ */ jsxDEV(Fragment, { children: editingInfo.theType === "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */ && /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      },
      children: [...Array(4).keys()].map((quarter) => /* @__PURE__ */ jsxDEV(
        FormControlLabel_default,
        {
          control: /* @__PURE__ */ jsxDEV(Checkbox_default, { size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 403,
            columnNumber: 24
          }, this),
          checked: editingInfo.quarters.includes(quarter + 1),
          onChange: (event, checked) => handleChangeCustomQuarterlyRelYearly(quarter + 1, checked),
          label: `Q${quarter + 1}`
        },
        quarter,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 401,
          columnNumber: 13
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
      lineNumber: 393,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
    lineNumber: 391,
    columnNumber: 5
  }, this);
  switch (props.period) {
    case import_webapi_client2.RecurringTaskPeriod.DAILY:
      return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Skip Rule" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 420,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          ToggleButtonGroup_default,
          {
            value: editingInfo.theType,
            exclusive: true,
            fullWidth: true,
            onChange: handleNewSkipRule,
            children: [
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "none" /* NONE */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("none" /* NONE */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 427,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "even" /* EVEN */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("even" /* EVEN */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 434,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "odd" /* ODD */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("odd" /* ODD */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 441,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "every" /* EVERY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("every" /* EVERY */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 448,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName(
                    "custom_daily_rel_weekly" /* CUSTOM_DAILY_REL_WEEKLY */,
                    isBigScreen
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 455,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName(
                    "custom_daily_rel_monthly" /* CUSTOM_DAILY_REL_MONTHLY */,
                    isBigScreen
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 465,
                  columnNumber: 13
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 421,
            columnNumber: 11
          },
          this
        ),
        everyBlock,
        customDailyRelWeeklyBlock,
        customDailyRelMonthlyBlock,
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "hidden",
            name: props.name,
            value: assembleSkipRule(editingInfoToSkipRule(editingInfo))
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 479,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 419,
        columnNumber: 9
      }, this);
    case import_webapi_client2.RecurringTaskPeriod.WEEKLY:
      return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Skip Rule" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 489,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          ToggleButtonGroup_default,
          {
            value: editingInfo.theType,
            exclusive: true,
            fullWidth: true,
            onChange: handleNewSkipRule,
            children: [
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "none" /* NONE */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("none" /* NONE */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 496,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "even" /* EVEN */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("even" /* EVEN */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 503,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "odd" /* ODD */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("odd" /* ODD */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 510,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "every" /* EVERY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("every" /* EVERY */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 517,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName(
                    "custom_weekly_rel_yearly" /* CUSTOM_WEEKLY_REL_YEARLY */,
                    isBigScreen
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 524,
                  columnNumber: 13
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 490,
            columnNumber: 11
          },
          this
        ),
        everyBlock,
        customWeeklyRelYearlyBlock,
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "hidden",
            name: props.name,
            value: assembleSkipRule(editingInfoToSkipRule(editingInfo))
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 537,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 488,
        columnNumber: 9
      }, this);
    case import_webapi_client2.RecurringTaskPeriod.MONTHLY:
      return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Skip Rule" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 547,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          ToggleButtonGroup_default,
          {
            value: editingInfo.theType,
            exclusive: true,
            fullWidth: true,
            onChange: handleNewSkipRule,
            children: [
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "none" /* NONE */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("none" /* NONE */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 554,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "even" /* EVEN */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("even" /* EVEN */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 561,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "odd" /* ODD */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("odd" /* ODD */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 568,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "every" /* EVERY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("every" /* EVERY */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 575,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName(
                    "custom_monthly_rel_yearly" /* CUSTOM_MONTHLY_REL_YEARLY */,
                    isBigScreen
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 582,
                  columnNumber: 13
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 548,
            columnNumber: 11
          },
          this
        ),
        everyBlock,
        customMonthlyRelYearlyBlock,
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "hidden",
            name: props.name,
            value: assembleSkipRule(editingInfoToSkipRule(editingInfo))
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 595,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 546,
        columnNumber: 9
      }, this);
    case import_webapi_client2.RecurringTaskPeriod.QUARTERLY:
      return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Skip Rule" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 605,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          ToggleButtonGroup_default,
          {
            value: editingInfo.theType,
            exclusive: true,
            fullWidth: true,
            onChange: handleNewSkipRule,
            children: [
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "none" /* NONE */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("none" /* NONE */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 612,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "even" /* EVEN */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("even" /* EVEN */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 619,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "odd" /* ODD */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("odd" /* ODD */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 626,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "every" /* EVERY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("every" /* EVERY */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 633,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName(
                    "custom_quarterly_rel_yearly" /* CUSTOM_QUARTERLY_REL_YEARLY */,
                    isBigScreen
                  )
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 640,
                  columnNumber: 13
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 606,
            columnNumber: 11
          },
          this
        ),
        everyBlock,
        customQuarterlyRelYearlyBlock,
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "hidden",
            name: props.name,
            value: assembleSkipRule(editingInfoToSkipRule(editingInfo))
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 653,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 604,
        columnNumber: 9
      }, this);
    case import_webapi_client2.RecurringTaskPeriod.YEARLY:
      return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Skip Rule" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
          lineNumber: 663,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          ToggleButtonGroup_default,
          {
            value: editingInfo.theType,
            exclusive: true,
            fullWidth: true,
            onChange: handleNewSkipRule,
            children: [
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "none" /* NONE */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("none" /* NONE */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 670,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "even" /* EVEN */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("even" /* EVEN */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 677,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "odd" /* ODD */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("odd" /* ODD */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 684,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                ToggleButton_default,
                {
                  size: "small",
                  value: "every" /* EVERY */,
                  disabled: !props.inputsEnabled,
                  children: skipRuleTypeName("every" /* EVERY */, isBigScreen)
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
                  lineNumber: 691,
                  columnNumber: 13
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 664,
            columnNumber: 11
          },
          this
        ),
        everyBlock,
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "hidden",
            name: props.name,
            value: assembleSkipRule(editingInfoToSkipRule(editingInfo))
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
            lineNumber: 700,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-skip-rule-block.tsx",
        lineNumber: 662,
        columnNumber: 9
      }, this);
  }
}

// ../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx
function RecurringTaskGenParamsBlock(props) {
  const isBigScreen = useBigScreen();
  const [period, setPeriod] = (0, import_react2.useState)(props.period);
  (0, import_react2.useEffect)(() => {
    setPeriod(props.period);
  }, [props.period]);
  const [showParams, setShowParams] = (0, import_react2.useState)(
    !(props.allowNonePeriod === true && props.period === "none")
  );
  (0, import_react2.useEffect)(() => {
    setShowParams(!(props.allowNonePeriod === true && props.period === "none"));
  }, [props.allowNonePeriod, props.period]);
  function handleChangePeriod(event, newPeriod) {
    if (newPeriod === null) {
      return;
    }
    if (newPeriod === "none") {
      setShowParams(false);
    } else {
      setShowParams(true);
    }
    setPeriod(newPeriod);
    if (props.onChangePeriod) {
      props.onChangePeriod(newPeriod);
    }
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "period", children: "Period" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        ToggleButtonGroup_default,
        {
          value: period,
          exclusive: true,
          fullWidth: true,
          onChange: handleChangePeriod,
          size: "small",
          children: [
            props.allowNonePeriod && /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "none", disabled: !props.inputsEnabled, children: "None" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 90,
              columnNumber: 13
            }, this),
            Object.values(import_webapi_client3.RecurringTaskPeriod).map((s) => /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: s, disabled: !props.inputsEnabled, children: periodName(s, isBigScreen) }, s, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 95,
              columnNumber: 13
            }, this))
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 82,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "hidden",
          name: constructFieldName(props.namePrefix, "period"),
          value: period
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 100,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          actionResult: props.actionData,
          fieldName: constructFieldErrorName(props.fieldsPrefix, "status")
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 105,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this),
    showParams && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "eisen", children: "Eisenhower" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 114,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          EisenhowerSelect,
          {
            name: constructFieldName(props.namePrefix, "eisen"),
            defaultValue: props.eisen || import_webapi_client3.Eisen.REGULAR,
            inputsEnabled: props.inputsEnabled
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 115,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            actionResult: props.actionData,
            fieldName: constructFieldErrorName(props.fieldsPrefix, "eisen")
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 120,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 113,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "difficulty", children: "Difficulty" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 127,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          DifficultySelect,
          {
            name: constructFieldName(props.namePrefix, "difficulty"),
            defaultValue: props.difficulty || import_webapi_client3.Difficulty.EASY,
            inputsEnabled: props.inputsEnabled
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 128,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            actionResult: props.actionData,
            fieldName: constructFieldErrorName(
              props.fieldsPrefix,
              "difficulty"
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 133,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 126,
        columnNumber: 11
      }, this),
      period === import_webapi_client3.RecurringTaskPeriod.DAILY && /* @__PURE__ */ jsxDEV(Fragment, { children: " " }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 142,
        columnNumber: 52
      }, this),
      period === import_webapi_client3.RecurringTaskPeriod.WEEKLY && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableFromDay", children: "Actionable From Day [Optional]" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 148,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              label: "Actionable From Day",
              name: constructFieldName(
                props.namePrefix,
                "actionableFromDay"
              ),
              readOnly: !props.inputsEnabled,
              defaultValue: props.actionableFromDay || "",
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 160,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 1, children: "1" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 161,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 2, children: "2" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 162,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 3, children: "3" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 163,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 4, children: "4" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 164,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 5, children: "5" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 165,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 6, children: "6" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 166,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 7, children: "7" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 167,
                  columnNumber: 21
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 151,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FieldError,
            {
              actionResult: props.actionData,
              fieldName: constructFieldErrorName(
                props.fieldsPrefix,
                "actionable_from_day"
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 169,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 147,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueAtDay", children: "Due At Day [Optional]" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 179,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              label: "Due At Day",
              name: constructFieldName(props.namePrefix, "dueAtDay"),
              readOnly: !props.inputsEnabled,
              defaultValue: props.dueAtDay || "",
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 186,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 1, children: "1" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 187,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 2, children: "2" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 188,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 3, children: "3" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 189,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 4, children: "4" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 190,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 5, children: "5" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 191,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 6, children: "6" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 192,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 7, children: "7" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 193,
                  columnNumber: 21
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 180,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FieldError,
            {
              actionResult: props.actionData,
              fieldName: constructFieldErrorName(
                props.fieldsPrefix,
                "due_at_day"
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 195,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 178,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 146,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 145,
        columnNumber: 13
      }, this),
      period === import_webapi_client3.RecurringTaskPeriod.MONTHLY && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableFromDay", children: "Actionable From Day [Optional]" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 211,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              label: "Actionable From Day",
              name: constructFieldName(
                props.namePrefix,
                "actionableFromDay"
              ),
              readOnly: !props.inputsEnabled,
              defaultValue: props.actionableFromDay || "",
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 223,
                  columnNumber: 21
                }, this),
                Array.from({ length: 31 }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i + 1, children: i + 1 }, i + 1, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 225,
                  columnNumber: 23
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 214,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FieldError,
            {
              actionResult: props.actionData,
              fieldName: constructFieldErrorName(
                props.fieldsPrefix,
                "actionable_from_day"
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 230,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 210,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueAtDay", children: "Due At Day [Optional]" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 240,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              label: "Due At Day",
              name: constructFieldName(props.namePrefix, "dueAtDay"),
              readOnly: !props.inputsEnabled,
              defaultValue: props.dueAtDay || "",
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 247,
                  columnNumber: 21
                }, this),
                Array.from({ length: 31 }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i + 1, children: i + 1 }, i + 1, false, {
                  fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                  lineNumber: 249,
                  columnNumber: 23
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 241,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FieldError,
            {
              actionResult: props.actionData,
              fieldName: constructFieldErrorName(
                props.fieldsPrefix,
                "due_at_day"
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 254,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 239,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 209,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 208,
        columnNumber: 13
      }, this),
      period === import_webapi_client3.RecurringTaskPeriod.QUARTERLY && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableFromDay", children: "Actionable From Day [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 270,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Actionable From Day",
                name: constructFieldName(
                  props.namePrefix,
                  "actionableFromDay"
                ),
                readOnly: !props.inputsEnabled,
                defaultValue: props.actionableFromDay || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 282,
                    columnNumber: 21
                  }, this),
                  Array.from({ length: 31 }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i + 1, children: i + 1 }, i + 1, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 284,
                    columnNumber: 23
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 273,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "actionable_from_day"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 289,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 269,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableFromMonth", children: "Actionable From Month [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 299,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Actionable From Month",
                name: constructFieldName(
                  props.namePrefix,
                  "actionableFromMonth"
                ),
                readOnly: !props.inputsEnabled,
                defaultValue: props.actionableFromMonth || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 311,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 1, children: "1 : Jan / Apr / Jul / Oct" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 312,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 2, children: "2 : Feb / May / Aug / Nov" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 313,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 3, children: "3 : Mar / Jun / Sep / Dec" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 314,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 302,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "actionable_from_month"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 316,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 298,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 268,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueAtDay", children: "Due At Day [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 328,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Due At Day",
                name: constructFieldName(props.namePrefix, "dueAtDay"),
                readOnly: !props.inputsEnabled,
                defaultValue: props.dueAtDay || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 335,
                    columnNumber: 21
                  }, this),
                  Array.from({ length: 31 }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i + 1, children: i + 1 }, i + 1, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 337,
                    columnNumber: 23
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 329,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "due_at_day"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 342,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 327,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueAtMonth", children: "Due At Month [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 352,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Due At Month",
                name: constructFieldName(props.namePrefix, "dueAtMonth"),
                readOnly: !props.inputsEnabled,
                defaultValue: props.dueAtMonth || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 361,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 1, children: "1 : Jan / Apr / Jul / Oct" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 362,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 2, children: "2 : Feb / May / Aug / Nov" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 363,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 3, children: "3 : Mar / Jun / Sep / Dec" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 364,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 355,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "due_at_month"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 366,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 351,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 326,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 267,
        columnNumber: 13
      }, this),
      period === import_webapi_client3.RecurringTaskPeriod.YEARLY && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableFromDay", children: "Actionable From Day [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 382,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Actionable From Day",
                name: constructFieldName(
                  props.namePrefix,
                  "actionableFromDay"
                ),
                readOnly: !props.inputsEnabled,
                defaultValue: props.actionableFromDay || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 394,
                    columnNumber: 21
                  }, this),
                  Array.from({ length: 31 }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i + 1, children: i + 1 }, i + 1, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 396,
                    columnNumber: 23
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 385,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "actionable_from_day"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 401,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 381,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "actionableFromMonth", children: "Actionable From Month [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 411,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Actionable From Month",
                name: constructFieldName(
                  props.namePrefix,
                  "actionableFromMonth"
                ),
                readOnly: !props.inputsEnabled,
                defaultValue: props.actionableFromMonth || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 423,
                    columnNumber: 21
                  }, this),
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                  ].map((month, index) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: index + 1, children: month }, index + 1, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 438,
                    columnNumber: 23
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 414,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "actionable_from_month"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 443,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 410,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 380,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueAtDay", children: "Due At Day [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 455,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Due At Day",
                name: constructFieldName(props.namePrefix, "dueAtDay"),
                readOnly: !props.inputsEnabled,
                defaultValue: props.dueAtDay || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 462,
                    columnNumber: 21
                  }, this),
                  Array.from({ length: 31 }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i + 1, children: i + 1 }, i + 1, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 464,
                    columnNumber: 23
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 456,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "due_at_day"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 469,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 454,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "dueAtMonth", children: "Due At Month [Optional]" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
              lineNumber: 479,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              Select_default,
              {
                label: "Due At Month",
                name: constructFieldName(props.namePrefix, "dueAtMonth"),
                readOnly: !props.inputsEnabled,
                defaultValue: props.dueAtMonth || "",
                children: [
                  /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "", children: "N/A" }, void 0, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 488,
                    columnNumber: 21
                  }, this),
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                  ].map((month, index) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: index + 1, children: month }, index + 1, false, {
                    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                    lineNumber: 503,
                    columnNumber: 23
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 482,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionData,
                fieldName: constructFieldErrorName(
                  props.fieldsPrefix,
                  "due_at_month"
                )
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
                lineNumber: 508,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 478,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
          lineNumber: 453,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 379,
        columnNumber: 13
      }, this),
      props.allowSkipRule && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(
          RecurringTaskSkipRuleBlock,
          {
            inputsEnabled: props.inputsEnabled,
            name: constructFieldName(props.namePrefix, "skipRule"),
            period,
            skipRule: props.skipRule
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 523,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            actionResult: props.actionData,
            fieldName: constructFieldErrorName(
              props.fieldsPrefix,
              "skip_rule"
            )
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
            lineNumber: 529,
            columnNumber: 17
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 522,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
        lineNumber: 521,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
      lineNumber: 112,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/recurring-task-gen-params-block.tsx",
    lineNumber: 79,
    columnNumber: 5
  }, this);
}
function constructFieldName(namePrefix, fieldName) {
  if (!namePrefix) {
    return fieldName;
  }
  return `${namePrefix}${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
}
function constructFieldErrorName(fieldsPrefix, fieldName) {
  if (!fieldsPrefix) {
    return `/${fieldName}`;
  }
  return `/${fieldsPrefix}_${fieldName}`;
}

export {
  RecurringTaskGenParamsBlock
};
//# sourceMappingURL=/build/_shared/chunk-WKUBLS6Z.js.map
