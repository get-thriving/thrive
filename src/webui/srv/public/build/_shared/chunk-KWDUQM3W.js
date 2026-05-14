import {
  inboxTaskStatusIcon,
  inboxTaskStatusName
} from "/build/_shared/chunk-4TWETDNJ.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/common/sub/inbox_tasks/component/status-big-tag.tsx
function InboxTaskStatusBigTag(props) {
  const isBigScreen = useBigScreen();
  const tagName = inboxTaskStatusName(props.status);
  const theme = useTheme();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "5px",
        padding: "0.5rem",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: "100%"
      },
      children: isBigScreen ? tagName : inboxTaskStatusIcon(props.status)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/status-big-tag.tsx",
      lineNumber: 20,
      columnNumber: 5
    },
    this
  );
}

export {
  InboxTaskStatusBigTag
};
//# sourceMappingURL=/build/_shared/chunk-KWDUQM3W.js.map
