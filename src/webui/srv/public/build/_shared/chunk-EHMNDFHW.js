import {
  aDateToDate,
  dateToAdate,
  strToADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  CalendarMonth_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  ButtonGroup_default,
  Button_default,
  DialogActions_default,
  DialogContent_default,
  DialogTitle_default,
  Dialog_default,
  IconButton_default,
  OutlinedInput_default,
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

// ../core/jupiter/core/common/suggested-date.ts
function getSuggestedDatesForInboxTaskActionableDate(today, bigPlan, timePlan) {
  const todayDate = aDateToDate(today);
  const suggestedDates = [
    {
      date: today,
      label: "Today"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 7 }).startOf("week")),
      label: "Start of the next week"
    },
    {
      date: dateToAdate(todayDate.plus({ months: 1 }).startOf("month")),
      label: "Start of the next month"
    }
  ];
  if (bigPlan && bigPlan.actionable_date) {
    suggestedDates.push({
      date: bigPlan.actionable_date,
      label: "Parent big plan actionable date"
    });
  }
  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date"
    });
  }
  return suggestedDates;
}
function getSuggestedDatesForInboxTaskDueDate(today, bigPlan, timePlan) {
  const todayDate = aDateToDate(today);
  const suggestedDates = [
    {
      date: today,
      label: "Today"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("week")),
      label: "End of the week"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("month")),
      label: "End of the month"
    }
  ];
  if (bigPlan && bigPlan.due_date) {
    suggestedDates.push({
      date: bigPlan.due_date,
      label: "Parent big plan due date"
    });
  }
  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date"
    });
  }
  return suggestedDates;
}
function getSuggestedDatesForTodoTaskActionableDate(today, timePlan, chapters) {
  const todayDate = aDateToDate(today);
  const suggestedDates = [
    {
      date: today,
      label: "Today"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 7 }).startOf("week")),
      label: "Start of the next week"
    },
    {
      date: dateToAdate(todayDate.plus({ months: 1 }).startOf("month")),
      label: "Start of the next month"
    }
  ];
  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.start_date,
        label: `Start of chapter "${chapter.name}"`
      });
    }
  }
  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date"
    });
  }
  return suggestedDates;
}
function getSuggestedDatesForTodoTaskDueDate(today, timePlan, chapters) {
  const todayDate = aDateToDate(today);
  const suggestedDates = [
    {
      date: today,
      label: "Today"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("week")),
      label: "End of the week"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("month")),
      label: "End of the month"
    }
  ];
  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.end_date,
        label: `End of chapter "${chapter.name}"`
      });
    }
  }
  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date"
    });
  }
  return suggestedDates;
}
function getSuggestedDatesForBigPlanActionableDate(today, timePlan, chapters) {
  const todayDate = aDateToDate(today);
  const suggestedDates = [
    {
      date: dateToAdate(todayDate.startOf("year")),
      label: "Start of the year"
    },
    {
      date: dateToAdate(todayDate.startOf("quarter")),
      label: "Start of the quarter"
    },
    {
      date: dateToAdate(todayDate.startOf("month")),
      label: "Start of the month"
    },
    {
      date: today,
      label: "Today"
    },
    {
      date: dateToAdate(todayDate.plus({ months: 1 }).startOf("month")),
      label: "Start of the next month"
    },
    {
      date: dateToAdate(todayDate.plus({ months: 3 }).startOf("quarter")),
      label: "Start of the next quarter"
    }
  ];
  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.start_date,
        label: `Start of chapter "${chapter.name}"`
      });
    }
  }
  if (timePlan) {
    suggestedDates.push({
      date: timePlan.start_date,
      label: "Associated time plan start date"
    });
  }
  return suggestedDates;
}
function getSuggestedDatesForBigPlanDueDate(today, timePlan, chapters) {
  const todayDate = aDateToDate(today);
  const suggestedDates = [
    {
      date: today,
      label: "Today"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("month")),
      label: "End of the month"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("quarter")),
      label: "End of the quarter"
    },
    {
      date: dateToAdate(todayDate.plus({ days: 1 }).endOf("year")),
      label: "End of the year"
    }
  ];
  if (chapters) {
    for (const chapter of chapters) {
      suggestedDates.push({
        date: chapter.end_date,
        label: `End of chapter "${chapter.name}"`
      });
    }
  }
  if (timePlan) {
    suggestedDates.push({
      date: timePlan.end_date,
      label: "Associated time plan end date"
    });
  }
  return suggestedDates;
}
function getSuggestedDatesForBigPlanMilestoneDate(today) {
  return getSuggestedDatesForBigPlanDueDate(today, null);
}

// ../core/jupiter/core/infra/component/date-input-with-suggestions.tsx
var import_react = __toESM(require_react(), 1);
function DateInputWithSuggestions(props) {
  const [date, setDate] = (0, import_react.useState)(
    props.value || props.defaultValue || void 0
  );
  const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setDate(props.value || props.defaultValue || void 0);
  }, [props.value, props.defaultValue]);
  const handleSuggestedDateClick = (suggestedDate) => {
    setDate(suggestedDate.date);
    props.onChange?.(suggestedDate.date);
    setIsDialogOpen(false);
  };
  return /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 1, alignItems: "center", children: [
    /* @__PURE__ */ jsxDEV(
      OutlinedInput_default,
      {
        type: "date",
        label: props.label,
        readOnly: !props.inputsEnabled,
        disabled: !props.inputsEnabled,
        name: props.name,
        notched: true,
        value: date || "",
        onChange: (e) => {
          const newDate = strToADate(e.target.value);
          setDate(newDate);
          props.onChange?.(newDate);
        },
        sx: { flexGrow: 1 }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
        lineNumber: 47,
        columnNumber: 7
      },
      this
    ),
    props.suggestedDates && props.suggestedDates.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(
        IconButton_default,
        {
          onClick: () => setIsDialogOpen(true),
          disabled: !props.inputsEnabled,
          size: "small",
          children: /* @__PURE__ */ jsxDEV(CalendarMonth_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
            lineNumber: 69,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
          lineNumber: 64,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Dialog_default,
        {
          open: isDialogOpen,
          onClose: () => setIsDialogOpen(false),
          maxWidth: "xs",
          fullWidth: true,
          disablePortal: true,
          children: [
            /* @__PURE__ */ jsxDEV(DialogTitle_default, { children: "Suggested Dates" }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
              lineNumber: 78,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(DialogContent_default, { children: /* @__PURE__ */ jsxDEV(ButtonGroup_default, { orientation: "vertical", fullWidth: true, sx: { mt: 1 }, children: props.suggestedDates.map((suggestedDate) => /* @__PURE__ */ jsxDEV(
              Button_default,
              {
                onClick: () => handleSuggestedDateClick(suggestedDate),
                variant: date === suggestedDate.date ? "contained" : "outlined",
                children: suggestedDate.label
              },
              suggestedDate.label,
              false,
              {
                fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
                lineNumber: 82,
                columnNumber: 19
              },
              this
            )) }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
              lineNumber: 80,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
              lineNumber: 79,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(DialogActions_default, { children: /* @__PURE__ */ jsxDEV(Button_default, { onClick: () => setIsDialogOpen(false), children: "Close" }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
              lineNumber: 95,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
              lineNumber: 94,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
          lineNumber: 71,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
      lineNumber: 63,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/date-input-with-suggestions.tsx",
    lineNumber: 46,
    columnNumber: 5
  }, this);
}

export {
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate,
  getSuggestedDatesForTodoTaskActionableDate,
  getSuggestedDatesForTodoTaskDueDate,
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate,
  getSuggestedDatesForBigPlanMilestoneDate,
  DateInputWithSuggestions
};
//# sourceMappingURL=/build/_shared/chunk-EHMNDFHW.js.map
