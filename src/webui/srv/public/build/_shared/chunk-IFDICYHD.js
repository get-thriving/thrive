import {
  InboxTaskCard
} from "/build/_shared/chunk-YVDLHOTH.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  AnimatePresence,
  motion
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  Stack_default,
  ToggleButtonGroup_default,
  ToggleButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link,
  useLocation,
  useSearchParams
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx
function InboxTaskStack(props) {
  const isEmpty = props.inboxTasks.length === 0;
  function handleMarkDone(it) {
    if (props.onCardMarkDone) {
      props.onCardMarkDone(it);
    }
  }
  function handleMarkNotDone(it) {
    if (props.onCardMarkNotDone) {
      props.onCardMarkNotDone(it);
    }
  }
  return /* @__PURE__ */ jsxDEV(AnimatePresence, { children: !isEmpty && /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, height: "0px" },
      transition: { duration: 1 },
      children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: [
        props.label && /* @__PURE__ */ jsxDEV(StandardDivider, { title: props.label, size: "large" }, void 0, false, {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
          lineNumber: 63,
          columnNumber: 15
        }, this),
        props.withPages && /* @__PURE__ */ jsxDEV(
          Pages,
          {
            retrieveOffsetParamName: props.withPages.retrieveOffsetParamName,
            totalCnt: props.withPages.totalCnt,
            pageSize: props.withPages.pageSize
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
            lineNumber: 67,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(AnimatePresence, { children: props.inboxTasks.map((it) => /* @__PURE__ */ jsxDEV(
          InboxTaskCard,
          {
            topLevelInfo: props.topLevelInfo,
            allowSwipe: true,
            showOptions: props.showOptions,
            inboxTask: it,
            optimisticState: props.optimisticUpdates?.[it.ref_id],
            parent: props.moreInfoByRefId?.[it.ref_id],
            linkResolver: props.cardLinkResolver,
            onMarkDone: handleMarkDone,
            onMarkNotDone: handleMarkNotDone
          },
          it.ref_id,
          false,
          {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
            lineNumber: 78,
            columnNumber: 17
          },
          this
        )) }, void 0, false, {
          fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
        lineNumber: 61,
        columnNumber: 11
      }, this)
    },
    props.label,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
      lineNumber: 54,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}
function Pages(props) {
  const pageCount = Math.ceil(props.totalCnt / props.pageSize);
  const [searchParams] = useSearchParams();
  const currentOffset = parseInt(
    searchParams.get(props.retrieveOffsetParamName) || "0"
  );
  const currentPage = Math.floor(currentOffset / props.pageSize);
  const location = useLocation();
  const shouldShowPage = Array(pageCount).fill(false);
  shouldShowPage[0] = true;
  shouldShowPage[pageCount - 1] = true;
  if (currentPage - 3 >= 0)
    shouldShowPage[currentPage - 3] = true;
  if (currentPage - 2 >= 0)
    shouldShowPage[currentPage - 2] = true;
  if (currentPage - 1 >= 0)
    shouldShowPage[currentPage - 1] = true;
  shouldShowPage[currentPage] = true;
  if (currentPage + 1 < pageCount)
    shouldShowPage[currentPage + 1] = true;
  if (currentPage + 2 < pageCount)
    shouldShowPage[currentPage + 2] = true;
  if (currentPage + 3 < pageCount)
    shouldShowPage[currentPage + 3] = true;
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 0; i < pageCount; i++) {
      if (shouldShowPage[i]) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set(
          props.retrieveOffsetParamName,
          (i * props.pageSize).toString()
        );
        buttons.push(
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              value: i,
              component: Link,
              to: {
                pathname: location.pathname,
                search: `?${newSearchParams.toString()}`
              },
              children: i + 1
            },
            i + 1,
            false,
            {
              fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
              lineNumber: 131,
              columnNumber: 11
            },
            this
          )
        );
      } else if (i > 0 && shouldShowPage[i - 1]) {
        buttons.push(
          /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "ellipsis", disabled: true, children: "..." }, `ellipsis-${i}`, false, {
            fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
            lineNumber: 145,
            columnNumber: 11
          }, this)
        );
      }
    }
    return buttons;
  };
  return /* @__PURE__ */ jsxDEV(
    ToggleButtonGroup_default,
    {
      size: "small",
      value: currentPage,
      exclusive: true,
      sx: { alignSelf: "center" },
      children: renderPageButtons()
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/stack.tsx",
      lineNumber: 155,
      columnNumber: 5
    },
    this
  );
}

export {
  InboxTaskStack
};
//# sourceMappingURL=/build/_shared/chunk-IFDICYHD.js.map
