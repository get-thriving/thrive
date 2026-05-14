import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  require_buffer_polyfill
} from "/build/_shared/chunk-FUGZILJZ.js";
import {
  Box_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  useFetcher
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/infra/component/entity-note-editor.tsx
var import_buffer_polyfill = __toESM(require_buffer_polyfill(), 1);
var import_react2 = __toESM(require_react(), 1);
var BlockEditor = (0, import_react2.lazy)(
  () => import("/build/_shared/block-editor-YIFMEPBT.js").then((module) => ({
    default: module.default
  }))
);
function EntityNoteEditor({
  initialNote,
  inputsEnabled
}) {
  const cardActionFetcher = useFetcher();
  const theme = useTheme();
  const [dataModified, setDataModified] = (0, import_react2.useState)(false);
  const [shouldAct, setShouldAct] = (0, import_react2.useState)(false);
  const [isActing, setIsActing] = (0, import_react2.useState)(false);
  const [hasActed, setHasActed] = (0, import_react2.useState)(false);
  const [noteContent, setNoteContent] = (0, import_react2.useState)(
    initialNote.content
  );
  const act = (0, import_react2.useCallback)(() => {
    setIsActing(true);
    const base64Content = import_buffer_polyfill.Buffer.from(
      JSON.stringify(noteContent),
      "utf-8"
    ).toString("base64");
    cardActionFetcher.submit(
      {
        id: initialNote.ref_id,
        content: base64Content
      },
      {
        method: "post",
        action: "/app/workspace/core/notes/update"
      }
    );
    setDataModified(false);
  }, [cardActionFetcher, initialNote.ref_id, noteContent]);
  (0, import_react2.useEffect)(() => {
    if (dataModified) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [act, dataModified, isActing, noteContent]);
  (0, import_react2.useEffect)(() => {
    if (isActing && cardActionFetcher.state === "idle" && cardActionFetcher.data !== null) {
      setIsActing(false);
      if (shouldAct) {
        act();
        setShouldAct(false);
      } else {
        setHasActed(true);
        setTimeout(() => {
          setHasActed(false);
        }, 1e3);
      }
    }
  }, [act, isActing, cardActionFetcher, shouldAct]);
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: { position: "relative" }, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: cardActionFetcher.data }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 92,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(FieldError, { actionResult: cardActionFetcher.data, fieldName: "/content" }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 93,
      columnNumber: 7
    }, this),
    isActing && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: "0rem",
          right: "0rem",
          color: theme.palette.text.disabled
        },
        children: "Saving..."
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
        lineNumber: 95,
        columnNumber: 9
      },
      this
    ),
    hasActed && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: "0rem",
          right: "0rem",
          color: theme.palette.text.disabled
        },
        children: "Saved!"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
        lineNumber: 107,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(ClientOnly, { fallback: /* @__PURE__ */ jsxDEV("div", { children: "Loading... " }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 119,
      columnNumber: 29
    }, this), children: () => /* @__PURE__ */ jsxDEV(import_react2.Suspense, { fallback: /* @__PURE__ */ jsxDEV("div", { children: "Loading..." }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 121,
      columnNumber: 31
    }, this), children: /* @__PURE__ */ jsxDEV(Box_default, { id: "entity-block-editor", children: /* @__PURE__ */ jsxDEV(
      BlockEditor,
      {
        editorSlug: `entity-note-editor-${initialNote.ref_id}`,
        autofocus: false,
        initialContent: noteContent,
        inputsEnabled: inputsEnabled && !initialNote.archived,
        onChange: (c) => {
          setDataModified(true);
          setNoteContent(c);
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
        lineNumber: 123,
        columnNumber: 15
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 122,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 121,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/entity-note-editor.tsx",
    lineNumber: 91,
    columnNumber: 5
  }, this);
}

export {
  EntityNoteEditor
};
//# sourceMappingURL=/build/_shared/chunk-PDFSPG4I.js.map
