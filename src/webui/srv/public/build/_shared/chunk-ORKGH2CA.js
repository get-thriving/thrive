import {
  BirthYearSelect
} from "/build/_shared/chunk-6KSNNK5R.js";
import {
  sortMilestonesNaturally
} from "/build/_shared/chunk-YDXQ3444.js";
import {
  partialDateEncode,
  partialDateExtract
} from "/build/_shared/chunk-WCBSHJX3.js";
import {
  autocompleteSingleLineSx
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  useLeafPanelExpansionState
} from "/build/_shared/chunk-LT7567PB.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Autocomplete_default,
  FormControl_default,
  InputLabel_default,
  MenuItem_default,
  Select_default,
  Stack_default,
  TextField_default,
  ToggleButtonGroup_default,
  ToggleButton_default,
  jsx
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

// ../core/jupiter/core/life_plan/component/partial-date-select.tsx
var import_react3 = __toESM(require_react(), 1);

// ../core/jupiter/core/life_plan/sub/milestones/components/select.tsx
var import_react = __toESM(require_react(), 1);
function MilestoneSelect(props) {
  const allMilestonesByRefId = (0, import_react.useMemo)(
    () => new Map(props.allMilestones.map((m) => [m.ref_id, m])),
    [props.allMilestones]
  );
  const sortedMilestones = (0, import_react.useMemo)(
    () => sortMilestonesNaturally(props.allMilestones),
    [props.allMilestones]
  );
  const allMilestonesAsOptions = (0, import_react.useMemo)(
    () => sortedMilestones.map((milestone) => ({
      milestone_ref_id: milestone.ref_id,
      label: milestone.name,
      bigName: fullMilestoneName(milestone)
    })),
    [sortedMilestones]
  );
  function selectedMilestoneToOption() {
    const selectedMilestoneRefId = props.value || props.defaultValue;
    if (!selectedMilestoneRefId) {
      return void 0;
    }
    const milestone = allMilestonesByRefId.get(selectedMilestoneRefId);
    if (!milestone) {
      return void 0;
    }
    return {
      milestone_ref_id: selectedMilestoneRefId,
      label: milestone.name,
      bigName: fullMilestoneName(milestone)
    };
  }
  const [selectedMilestone, setSelectedMilestone] = (0, import_react.useState)(selectedMilestoneToOption());
  (0, import_react.useEffect)(() => {
    const selectedMilestoneRefId = props.value || props.defaultValue;
    if (!selectedMilestoneRefId) {
      setSelectedMilestone(void 0);
      return;
    }
    const milestone = allMilestonesByRefId.get(selectedMilestoneRefId);
    if (!milestone) {
      setSelectedMilestone(void 0);
      return;
    }
    setSelectedMilestone({
      milestone_ref_id: selectedMilestoneRefId,
      label: milestone.name,
      bigName: fullMilestoneName(milestone)
    });
  }, [
    props.value,
    props.defaultValue,
    props.allMilestones,
    allMilestonesByRefId,
    sortedMilestones
  ]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        disableClearable: true,
        autoHighlight: true,
        id: props.name,
        options: allMilestonesAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled,
        sx: autocompleteSingleLineSx,
        value: selectedMilestone,
        onChange: (_, v) => {
          setSelectedMilestone(v);
          if (props.onChange) {
            props.onChange(v.milestone_ref_id);
          }
        },
        isOptionEqualToValue: (o, v) => o.milestone_ref_id === v.milestone_ref_id,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/life_plan/sub/milestones/components/select.tsx",
          lineNumber: 122,
          columnNumber: 34
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/milestones/components/select.tsx",
        lineNumber: 96,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedMilestone?.milestone_ref_id ?? ""
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/milestones/components/select.tsx",
        lineNumber: 125,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/milestones/components/select.tsx",
    lineNumber: 95,
    columnNumber: 5
  }, this);
}
function fullMilestoneName(milestone) {
  const formattedDate = aDateToDate(milestone.date).setLocale("en-gb").toLocaleString();
  return `${formattedDate} ${milestone.name}`;
}

// ../core/jupiter/core/life_plan/component/partial-date-select.tsx
var DEFAULT_YEAR_ABSOLUTE = 1990;
var DEFAULT_YEAR_RELATIVE = 20;
var DEFAULT_DECADE_RELATIVE = 20;
function PartialDateSelect(props) {
  const isBigScreen = useBigScreen();
  const partialDateExtracted = props.initialDate ? partialDateExtract(props.initialDate) : void 0;
  const [grossType, setGrossType] = (0, import_react3.useState)(partialDateExtracted?.grossType ?? "absolute");
  const [relativeType, setRelativeType] = (0, import_react3.useState)(
    partialDateExtracted?.relativeType ?? "year"
  );
  const [day, setDay] = (0, import_react3.useState)(
    partialDateExtracted?.day ?? "N/A"
  );
  const [month, setMonth] = (0, import_react3.useState)(
    partialDateExtracted?.month ?? "N/A"
  );
  const [yearAbsolute, setYearAbsolute] = (0, import_react3.useState)(
    partialDateExtracted && partialDateExtracted.grossType === "absolute" ? partialDateExtracted.year : DEFAULT_YEAR_ABSOLUTE
  );
  const [yearRelative, setYearRelative] = (0, import_react3.useState)(
    partialDateExtracted && partialDateExtracted.grossType === "relative" && partialDateExtracted.relativeType === "year" ? partialDateExtracted.year : DEFAULT_YEAR_RELATIVE
  );
  const [decadeRelative, setDecadeRelative] = (0, import_react3.useState)(
    partialDateExtracted && partialDateExtracted.grossType === "relative" && partialDateExtracted.relativeType === "decade" ? partialDateExtracted.year : DEFAULT_DECADE_RELATIVE
  );
  const [milestoneRefId, setMilestoneRefId] = (0, import_react3.useState)(
    partialDateExtracted?.milestoneRefId ?? void 0
  );
  const [partialDate, setPartialDate] = (0, import_react3.useState)(
    props.initialDate ?? ""
  );
  const leafPanelExpansionState = useLeafPanelExpansionState();
  const bigScreen = useBigScreen();
  const bigStuff = bigScreen && leafPanelExpansionState !== "small" /* SMALL */ && leafPanelExpansionState !== null;
  (0, import_react3.useEffect)(() => {
    setPartialDate(
      partialDateEncode(
        grossType === "present" || grossType === "start" || grossType === "end" ? {
          grossType,
          relativeType: void 0,
          year: "N/A",
          month: "N/A",
          day: "N/A",
          milestoneRefId: void 0
        } : {
          grossType,
          relativeType,
          year: grossType === "absolute" ? yearAbsolute : grossType === "relative" && relativeType === "year" ? yearRelative : decadeRelative,
          month,
          day,
          milestoneRefId
        }
      )
    );
  }, [
    grossType,
    relativeType,
    day,
    month,
    yearAbsolute,
    yearRelative,
    decadeRelative,
    milestoneRefId
  ]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Stack_default, { direction: bigStuff ? "row" : "column", useFlexGap: true, spacing: 1, children: [
      /* @__PURE__ */ jsxDEV(
        ToggleButtonGroup_default,
        {
          id: `${props.name}-baseType`,
          exclusive: true,
          fullWidth: true,
          value: grossType,
          onChange: (_, newGrossType) => newGrossType !== null && setGrossType(newGrossType),
          children: [
            /* @__PURE__ */ jsxDEV(
              ToggleButton_default,
              {
                value: "absolute",
                size: isBigScreen ? "medium" : "small",
                children: "Abs"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                lineNumber: 139,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              ToggleButton_default,
              {
                value: "relative",
                size: isBigScreen ? "medium" : "small",
                children: "Rel"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                lineNumber: 145,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              ToggleButton_default,
              {
                value: "milestone",
                size: isBigScreen ? "medium" : "small",
                children: "Milestone"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                lineNumber: 151,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "present", size: isBigScreen ? "medium" : "small", children: "Present" }, void 0, false, {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 157,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "start", size: isBigScreen ? "medium" : "small", children: "Start" }, void 0, false, {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 160,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "end", size: isBigScreen ? "medium" : "small", children: "End" }, void 0, false, {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 163,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 130,
          columnNumber: 9
        },
        this
      ),
      grossType === "absolute" && /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, sx: { width: "100%" }, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(
            InputLabel_default,
            {
              id: `${props.name}-Day`,
              htmlFor: `${props.name}-Day`,
              children: "Day"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 171,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              labelId: `${props.name}-Day`,
              fullWidth: true,
              name: `${props.name}-Day`,
              value: day.toString(),
              label: "Day",
              onChange: (event) => setDay(parseInt(event.target.value, 10)),
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "N/A", children: "N/A" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 185,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 1, children: "1st" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 186,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 2, children: "2nd" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 187,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 3, children: "3rd" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 188,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 4, children: "4th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 189,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 5, children: "5th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 190,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 6, children: "6th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 191,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 7, children: "7th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 192,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 8, children: "8th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 193,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 9, children: "9th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 194,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 10, children: "10th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 195,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 11, children: "11th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 196,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 12, children: "12th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 197,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 13, children: "13th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 198,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 14, children: "14th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 199,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 15, children: "15th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 200,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 16, children: "16th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 201,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 17, children: "17th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 202,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 18, children: "18th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 203,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 19, children: "19th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 204,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 20, children: "20th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 205,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 21, children: "21st" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 206,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 22, children: "22nd" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 207,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 23, children: "23rd" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 208,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 24, children: "24th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 209,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 25, children: "25th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 210,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 26, children: "26th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 211,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 27, children: "27th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 212,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 28, children: "28th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 213,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 29, children: "29th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 214,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 30, children: "30th" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 215,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 31, children: "31st" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 216,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 177,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 170,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(
            InputLabel_default,
            {
              id: `${props.name}-Month`,
              htmlFor: `${props.name}-Month`,
              children: "Month"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 220,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              labelId: `${props.name}-Month`,
              fullWidth: true,
              name: `${props.name}-Month`,
              value: month.toString(),
              label: "Month",
              onChange: (event) => setMonth(parseInt(event.target.value, 10)),
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "N/A", children: "N/A" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 234,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 1, children: "Jan" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 235,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 2, children: "Feb" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 236,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 3, children: "Mar" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 237,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 4, children: "Apr" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 238,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 5, children: "May" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 239,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 6, children: "Jun" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 240,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 7, children: "Jul" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 241,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 8, children: "Aug" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 242,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 9, children: "Sep" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 243,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 10, children: "Oct" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 244,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 11, children: "Nov" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 245,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 12, children: "Dec" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 246,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 226,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 219,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(
          BirthYearSelect,
          {
            name: `${props.name}-Year`,
            label: "Year",
            value: yearAbsolute,
            inputsEnabled: props.inputsEnabled,
            allowNoneBirthYear: false,
            onChange: (year) => setYearAbsolute(year)
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
            lineNumber: 250,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 249,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
        lineNumber: 169,
        columnNumber: 11
      }, this),
      grossType === "relative" && /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, sx: { width: "100%" }, children: [
        /* @__PURE__ */ jsxDEV(
          ToggleButtonGroup_default,
          {
            id: `${props.name}-relativeType`,
            exclusive: true,
            value: relativeType,
            onChange: (_, newRelativeType) => newRelativeType !== null && setRelativeType(newRelativeType),
            children: [
              /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "year", children: "Year" }, void 0, false, {
                fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                lineNumber: 272,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "decade", children: "Decade" }, void 0, false, {
                fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                lineNumber: 273,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
            lineNumber: 264,
            columnNumber: 13
          },
          this
        ),
        relativeType === "year" && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(
            InputLabel_default,
            {
              id: `${props.name}-Year`,
              htmlFor: `${props.name}-Year`,
              children: "Year"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 277,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              labelId: `${props.name}-Year`,
              fullWidth: true,
              name: `${props.name}-Year`,
              value: yearRelative.toString(),
              label: "Year",
              onChange: (event) => setYearRelative(parseInt(event.target.value, 10)),
              children: Array.from({ length: props.maxAge }, (_, i) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: i, children: i }, i, false, {
                fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                lineNumber: 294,
                columnNumber: 21
              }, this))
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 283,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 276,
          columnNumber: 15
        }, this),
        relativeType === "decade" && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(
            InputLabel_default,
            {
              id: `${props.name}-Decade`,
              htmlFor: `${props.name}-Decade`,
              children: "Decade"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 304,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Select_default,
            {
              labelId: `${props.name}-Decade`,
              fullWidth: true,
              name: `${props.name}-Decade`,
              value: decadeRelative.toString(),
              label: "Decade",
              onChange: (event) => setDecadeRelative(parseInt(event.target.value, 10)),
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem_default, { value: 0, children: "0s" }, void 0, false, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 320,
                  columnNumber: 19
                }, this),
                Array.from(
                  { length: props.maxAge / 10 },
                  (_, i) => i * 10
                ).map((decade) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: decade, children: [
                  decade,
                  "s"
                ] }, decade, true, {
                  fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
                  lineNumber: 325,
                  columnNumber: 21
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
              lineNumber: 310,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 303,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
        lineNumber: 263,
        columnNumber: 11
      }, this),
      grossType === "milestone" && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(
        MilestoneSelect,
        {
          name: `${props.name}-Milestone`,
          label: "Milestone",
          inputsEnabled: props.inputsEnabled,
          disabled: false,
          allMilestones: props.allMilestones,
          defaultValue: milestoneRefId,
          value: milestoneRefId,
          onChange: (milestoneRefId2) => setMilestoneRefId(milestoneRefId2)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
          lineNumber: 337,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
        lineNumber: 336,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: partialDate }, void 0, false, {
      fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
      lineNumber: 350,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/component/partial-date-select.tsx",
    lineNumber: 128,
    columnNumber: 5
  }, this);
}

export {
  PartialDateSelect
};
//# sourceMappingURL=/build/_shared/chunk-ORKGH2CA.js.map
