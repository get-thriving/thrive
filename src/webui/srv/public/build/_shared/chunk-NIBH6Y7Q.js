import {
  isAllowedForWidgetConstraints,
  isWidgetDimensionKSized,
  widgetDimensionCols,
  widgetDimensionName,
  widgetDimensionRows,
  widgetTypeName
} from "/build/_shared/chunk-4ZSHFYIG.js";
import {
  constructFieldName
} from "/build/_shared/chunk-IYE5HYO4.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  Button_default,
  DialogActions_default,
  DialogContent_default,
  DialogTitle_default,
  Dialog_default,
  MenuItem_default,
  Select_default,
  Stack_default,
  TextField_default,
  Typography_default
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

// ../core/jupiter/core/home/component/widget-type-selector.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
function WidgetTypeSelector(props) {
  const [theType, setTheType] = (0, import_react.useState)(
    props.value || props.defaultValue || import_webapi_client.WidgetType.MOTD
  );
  (0, import_react.useEffect)(() => {
    setTheType(props.value || props.defaultValue || import_webapi_client.WidgetType.MOTD);
  }, [props.value, props.defaultValue]);
  const allowedTypes = Object.values(import_webapi_client.WidgetType).filter(
    (type) => props.widgetConstraints[type].allowed_dimensions[props.target].includes(
      props.widgetConstraints[type].allowed_dimensions[props.target][0]
    )
  );
  if (allowedTypes.length === 0) {
    return /* @__PURE__ */ jsxDEV(Typography_default, { children: "No types allowed for this widget type" }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/widget-type-selector.tsx",
      lineNumber: 43,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      name: props.name,
      value: theType,
      disabled: !props.inputsEnabled,
      fullWidth: true,
      onChange: (event) => {
        setTheType(event.target.value);
        props.onChange?.(event.target.value);
      },
      children: allowedTypes.map((type) => {
        const constraints = props.widgetConstraints[type];
        return /* @__PURE__ */ jsxDEV(
          MenuItem_default,
          {
            value: type,
            disabled: !isAllowedForWidgetConstraints(
              constraints,
              props.user,
              props.workspace
            ),
            children: widgetTypeName(type)
          },
          type,
          false,
          {
            fileName: "../core/jupiter/core/home/component/widget-type-selector.tsx",
            lineNumber: 62,
            columnNumber: 13
          },
          this
        );
      })
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/widget-type-selector.tsx",
      lineNumber: 48,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/home/component/widget-type-selector.tsx",
    lineNumber: 47,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/home/component/widget-dimension-selector.tsx
var import_react2 = __toESM(require_react(), 1);
function WidgetDimensionSelector(props) {
  const [theDimension, setTheDimension] = (0, import_react2.useState)(
    props.value || props.defaultValue || props.widgetConstraints[props.widgetType].allowed_dimensions[0]
  );
  const constraintForType = props.widgetConstraints[props.widgetType];
  (0, import_react2.useEffect)(() => {
    setTheDimension(
      props.value || props.defaultValue || props.widgetConstraints[props.widgetType].allowed_dimensions[0]
    );
  }, [
    props.value,
    props.defaultValue,
    props.widgetConstraints,
    props.widgetType
  ]);
  if (!constraintForType) {
    return /* @__PURE__ */ jsxDEV(Typography_default, { children: "No constraints for this widget type" }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/widget-dimension-selector.tsx",
      lineNumber: 45,
      columnNumber: 12
    }, this);
  }
  if (Object.keys(constraintForType.allowed_dimensions).length === 0) {
    return /* @__PURE__ */ jsxDEV(Typography_default, { children: "No dimensions allowed for this widget type" }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/widget-dimension-selector.tsx",
      lineNumber: 49,
      columnNumber: 12
    }, this);
  }
  const constraintForTarget = constraintForType.allowed_dimensions[props.target];
  if (!constraintForTarget) {
    return /* @__PURE__ */ jsxDEV(Typography_default, { children: "No dimensions allowed for this widget type" }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/widget-dimension-selector.tsx",
      lineNumber: 56,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      name: props.name,
      value: theDimension,
      disabled: !props.inputsEnabled,
      fullWidth: true,
      onChange: (event) => {
        setTheDimension(event.target.value);
        props.onChange?.(event.target.value);
      },
      children: constraintForTarget.map((dimension) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: dimension, children: widgetDimensionName(dimension) }, dimension, false, {
        fileName: "../core/jupiter/core/home/component/widget-dimension-selector.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/widget-dimension-selector.tsx",
      lineNumber: 61,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/home/component/widget-dimension-selector.tsx",
    lineNumber: 60,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/home/component/row-and-col-selector.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);
var import_react4 = __toESM(require_react(), 1);

// ../core/jupiter/core/home/component/widget-placement-quick-selector.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react3 = __toESM(require_react(), 1);
function WidgetPlacementQuickSelector(props) {
  const [open, setOpen] = (0, import_react3.useState)(false);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Button_default, { variant: "contained", color: "primary", onClick: () => setOpen(true), children: "Pick" }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Dialog_default, { open, onClose: () => setOpen(false), children: [
      /* @__PURE__ */ jsxDEV(DialogTitle_default, { children: "Pick a widget placement" }, void 0, false, {
        fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DialogContent_default, { children: /* @__PURE__ */ jsxDEV(
        TheWidgetPlacement,
        {
          target: props.target,
          homeTab: props.homeTab,
          widgets: props.widgets,
          onRowAndColChange: (row, col) => {
            props.onRowAndColChange(row, col);
            setOpen(false);
          },
          hightlightGeometry: props.hightlightGeometry
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
          lineNumber: 48,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DialogActions_default, { children: /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          color: "primary",
          onClick: () => setOpen(false),
          children: "Cancel"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
          lineNumber: 60,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
        lineNumber: 59,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
    lineNumber: 41,
    columnNumber: 5
  }, this);
}
function TheWidgetPlacement(props) {
  switch (props.target) {
    case import_webapi_client2.HomeTabTarget.BIG_SCREEN:
      return /* @__PURE__ */ jsxDEV(BigScreenWidgetPlacement, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
        lineNumber: 76,
        columnNumber: 14
      }, this);
    case import_webapi_client2.HomeTabTarget.SMALL_SCREEN:
      return /* @__PURE__ */ jsxDEV(SmallScreenWidgetPlacement, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
        lineNumber: 78,
        columnNumber: 14
      }, this);
  }
}
function BigScreenWidgetPlacement(props) {
  const widgetPlacement = props.homeTab.widget_placement;
  const widgetByRefId = new Map(props.widgets.map((w) => [w.ref_id, w]));
  const isBigScreen = useBigScreen();
  const maxCols = widgetPlacement.matrix.length;
  const maxRows = widgetPlacement.matrix[0].length;
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "grid",
        gridTemplateColumns: `repeat(${maxCols}, ${isBigScreen ? "8rem" : "1fr"})`,
        gridTemplateRows: `repeat(${maxRows}, 3rem)`,
        gridGap: "0.25rem",
        alignItems: "center",
        marginLeft: isBigScreen ? "auto" : void 0,
        marginRight: isBigScreen ? "auto" : void 0
      },
      children: Array.from({ length: maxRows }, (_, rowIndex) => {
        return /* @__PURE__ */ jsxDEV(import_react3.Fragment, { children: Array.from({ length: maxCols }, (_2, colIndex) => {
          const cell = widgetPlacement.matrix[colIndex][rowIndex];
          if (cell === null) {
            for (let i = 0; i < rowIndex; i++) {
              const prevWidgetId = widgetPlacement.matrix[colIndex][i];
              if (prevWidgetId !== null) {
                const prevWidget = widgetByRefId.get(prevWidgetId);
                if (prevWidget && isWidgetDimensionKSized(prevWidget.geometry.dimension)) {
                  return null;
                }
              }
            }
            return /* @__PURE__ */ jsxDEV(
              Box_default,
              {
                sx: {
                  display: "flex",
                  gridRowStart: rowIndex + 1,
                  gridColumnStart: colIndex + 1
                },
                children: /* @__PURE__ */ jsxDEV(
                  MoveWidgetButton,
                  {
                    row: rowIndex,
                    col: colIndex,
                    onClick: () => props.onRowAndColChange(rowIndex, colIndex)
                  },
                  `${rowIndex}-${colIndex}`,
                  false,
                  {
                    fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
                    lineNumber: 133,
                    columnNumber: 21
                  },
                  this
                )
              },
              `${rowIndex}-${colIndex}`,
              false,
              {
                fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
                lineNumber: 125,
                columnNumber: 19
              },
              this
            );
          }
          if (rowIndex > 0 && widgetPlacement.matrix[colIndex][rowIndex] === widgetPlacement.matrix[colIndex][rowIndex - 1]) {
            return null;
          }
          if (colIndex > 0 && widgetPlacement.matrix[colIndex][rowIndex] === widgetPlacement.matrix[colIndex - 1][rowIndex]) {
            return null;
          }
          const widget = widgetByRefId.get(cell);
          return /* @__PURE__ */ jsxDEV(
            Box_default,
            {
              sx: {
                display: "flex",
                gridRowStart: rowIndex + 1,
                gridRowEnd: rowIndex + 1 + widgetDimensionRows(widget.geometry.dimension),
                gridColumnStart: colIndex + 1,
                gridColumnEnd: colIndex + 1 + widgetDimensionCols(widget.geometry.dimension)
              },
              children: /* @__PURE__ */ jsxDEV(
                PlacedWidget,
                {
                  widget,
                  row: rowIndex,
                  col: colIndex
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
                  lineNumber: 183,
                  columnNumber: 19
                },
                this
              )
            },
            `${rowIndex}-${colIndex}`,
            false,
            {
              fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
              lineNumber: 167,
              columnNumber: 17
            },
            this
          );
        }) }, rowIndex, false, {
          fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
          lineNumber: 105,
          columnNumber: 11
        }, this);
      })
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
      lineNumber: 92,
      columnNumber: 5
    },
    this
  );
}
function SmallScreenWidgetPlacement(props) {
  const widgetPlacement = props.homeTab.widget_placement;
  const widgetByRefId = new Map(props.widgets.map((w) => [w.ref_id, w]));
  return /* @__PURE__ */ jsxDEV(
    Stack_default,
    {
      useFlexGap: true,
      direction: "column",
      sx: { alignItems: "center", gap: "0.25rem" },
      children: widgetPlacement.matrix.map((row, rowIndex) => {
        if (row === null) {
          for (let i = 0; i < rowIndex; i++) {
            const prevWidgetId = widgetPlacement.matrix[i];
            if (prevWidgetId !== null) {
              const prevWidget = widgetByRefId.get(prevWidgetId);
              if (prevWidget && isWidgetDimensionKSized(prevWidget.geometry.dimension)) {
                return null;
              }
            }
          }
          return /* @__PURE__ */ jsxDEV(
            MoveWidgetButton,
            {
              row: rowIndex,
              col: 0,
              onClick: () => props.onRowAndColChange(rowIndex, 0),
              highlightGeometry: props.hightlightGeometry
            },
            rowIndex,
            false,
            {
              fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
              lineNumber: 226,
              columnNumber: 13
            },
            this
          );
        }
        if (rowIndex > 0 && widgetPlacement.matrix[rowIndex] === widgetPlacement.matrix[rowIndex - 1]) {
          return null;
        }
        const widget = widgetByRefId.get(row);
        return /* @__PURE__ */ jsxDEV(
          PlacedWidget,
          {
            widget,
            row: rowIndex,
            col: 0,
            highlightGeometry: props.hightlightGeometry
          },
          rowIndex,
          false,
          {
            fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
            lineNumber: 249,
            columnNumber: 11
          },
          this
        );
      })
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
      lineNumber: 204,
      columnNumber: 5
    },
    this
  );
}
function MoveWidgetButton(props) {
  const shouldHighlight = props.highlightGeometry && props.highlightGeometry.row === props.row && props.highlightGeometry.col === props.col;
  return /* @__PURE__ */ jsxDEV(
    Button_default,
    {
      variant: "outlined",
      color: "primary",
      onClick: props.onClick,
      sx: {
        width: "8rem",
        height: "3rem",
        color: (theme) => shouldHighlight ? theme.palette.primary.contrastText : theme.palette.primary.main,
        backgroundColor: (theme) => shouldHighlight ? theme.palette.primary.light : "transparent"
      },
      children: "Move"
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
      lineNumber: 276,
      columnNumber: 5
    },
    this
  );
}
function PlacedWidget(props) {
  const heightInRem = widgetDimensionRows(props.widget.geometry.dimension) * 3;
  const widthInRem = widgetDimensionCols(props.widget.geometry.dimension) * 8;
  const isBigScreen = useBigScreen();
  const shouldHighlight = props.highlightGeometry && props.highlightGeometry.row === props.row && props.highlightGeometry.col === props.col;
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        fontSize: "0.64rem",
        width: "100%",
        minWidth: isBigScreen ? `${widthInRem}rem` : void 0,
        height: `${heightInRem}rem`,
        border: (theme) => `2px dotted ${theme.palette.primary.main}`,
        borderRadius: "4px",
        borderBottomLeftRadius: isWidgetDimensionKSized(
          props.widget.geometry.dimension
        ) ? 0 : "4px",
        borderBottomRightRadius: isWidgetDimensionKSized(
          props.widget.geometry.dimension
        ) ? 0 : "4px",
        borderBottom: (theme) => isWidgetDimensionKSized(props.widget.geometry.dimension) ? `4px dotted ${theme.palette.primary.main}` : `2px dotted ${theme.palette.primary.main}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: (theme) => shouldHighlight ? theme.palette.primary.contrastText : theme.palette.primary.main,
        backgroundColor: (theme) => shouldHighlight ? theme.palette.primary.light : "transparent"
      },
      children: widgetTypeName(props.widget.the_type)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/widget-placement-quick-selector.tsx",
      lineNumber: 313,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/home/component/row-and-col-selector.tsx
function RowAndColSelector(props) {
  const [row, setRow] = (0, import_react4.useState)(props.row);
  const [col, setCol] = (0, import_react4.useState)(props.col);
  (0, import_react4.useEffect)(() => {
    setRow(props.row);
    setCol(props.col);
  }, [props.row, props.col]);
  return /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", spacing: 2, children: [
    /* @__PURE__ */ jsxDEV(
      TextField_default,
      {
        label: "Row",
        type: "number",
        name: constructFieldName(props.namePrefix, "row"),
        value: row,
        onChange: (event) => {
          const newRow = parseInt(event.target.value, 10);
          if (isNaN(newRow)) {
            return;
          }
          setRow(newRow);
          props.onRowAndColChange?.(newRow, col);
        },
        disabled: !props.inputsEnabled,
        fullWidth: true,
        inputProps: { min: 0, readOnly: true }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/home/component/row-and-col-selector.tsx",
        lineNumber: 35,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      TextField_default,
      {
        label: "Column",
        type: "number",
        name: constructFieldName(props.namePrefix, "col"),
        value: col,
        onChange: (event) => {
          const newCol = parseInt(event.target.value, 10);
          if (isNaN(newCol)) {
            return;
          }
          setCol(newCol);
          props.onRowAndColChange?.(row, newCol);
        },
        disabled: !props.inputsEnabled,
        fullWidth: true,
        inputProps: {
          min: 0,
          readOnly: true
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/home/component/row-and-col-selector.tsx",
        lineNumber: 52,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      WidgetPlacementQuickSelector,
      {
        target: props.target,
        homeTab: props.homeTab,
        widgets: props.widgets,
        onRowAndColChange: (newRow, newCol) => {
          setRow(newRow);
          setCol(newCol);
          props.onRowAndColChange?.(newRow, newCol);
        },
        hightlightGeometry: {
          row: props.row,
          col: props.col,
          dimension: import_webapi_client3.WidgetDimension.DIM_1X1
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/home/component/row-and-col-selector.tsx",
        lineNumber: 72,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/home/component/row-and-col-selector.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}

export {
  WidgetTypeSelector,
  WidgetDimensionSelector,
  RowAndColSelector
};
//# sourceMappingURL=/build/_shared/chunk-NIBH6Y7Q.js.map
