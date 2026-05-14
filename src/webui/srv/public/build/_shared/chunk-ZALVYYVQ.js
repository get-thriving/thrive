import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  isNoErrorSomeData
} from "/build/_shared/chunk-MF4Q6G6N.js";
import {
  require_buffer_polyfill
} from "/build/_shared/chunk-FUGZILJZ.js";
import {
  Box_default,
  TextField_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
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

// ../core/jupiter/core/docs/component/editor.tsx
var import_buffer_polyfill = __toESM(require_buffer_polyfill(), 1);
var import_react3 = __toESM(require_react(), 1);

// ../core/jupiter/core/infra/component/use-idempotency.ts
var import_react = __toESM(require_react(), 1);
function useIdempotencyKey(storageKey) {
  const [key, setKey] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    let k = window.sessionStorage.getItem(storageKey);
    if (!k) {
      k = crypto.randomUUID();
      window.sessionStorage.setItem(storageKey, k);
    }
    setKey(k);
  }, [storageKey]);
  const clear = () => window.sessionStorage.removeItem(storageKey);
  return { key, clear };
}

// ../core/jupiter/core/docs/component/editor.tsx
var BlockEditor = (0, import_react3.lazy)(
  () => import("/build/_shared/block-editor-YIFMEPBT.js").then((module) => ({
    default: module.default
  }))
);
function DocEditor({
  initialDoc,
  initialNote,
  inputsEnabled,
  rightOfName,
  parentDirRefId
}) {
  const cardActionFetcher = useFetcher();
  const [dataModified, setDataModified] = (0, import_react3.useState)(false);
  const [isActing, setIsActing] = (0, import_react3.useState)(false);
  const [shouldAct, setShouldAct] = (0, import_react3.useState)(false);
  const [docId, setDocId] = (0, import_react3.useState)(initialDoc ? initialDoc.ref_id : null);
  const [noteId, setNoteId] = (0, import_react3.useState)(initialNote ? initialNote.ref_id : null);
  const [noteName, setNoteName] = (0, import_react3.useState)(
    initialDoc ? initialDoc.name : ""
  );
  const [noteContent, setNoteContent] = (0, import_react3.useState)(
    initialNote ? initialNote.content : []
  );
  const { key, clear } = useIdempotencyKey("idempotency/doc-editor");
  const act = (0, import_react3.useCallback)(() => {
    setIsActing(true);
    const base64Content = import_buffer_polyfill.Buffer.from(
      JSON.stringify(noteContent),
      "utf-8"
    ).toString("base64");
    if (docId && noteId) {
      cardActionFetcher.submit(
        {
          docId,
          noteId,
          name: noteName || "Untitled",
          content: base64Content
        },
        {
          method: "post",
          action: "/app/workspace/docs/update-action"
        }
      );
    } else {
      cardActionFetcher.submit(
        {
          idempotencyKey: key,
          name: noteName || "Untitled",
          parentDirRefId,
          content: base64Content
        },
        {
          method: "post",
          action: "/app/workspace/docs/create-action"
        }
      );
    }
    setDataModified(false);
  }, [
    cardActionFetcher,
    docId,
    noteContent,
    noteId,
    noteName,
    key,
    parentDirRefId
  ]);
  (0, import_react3.useEffect)(() => {
    if (dataModified) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [dataModified, docId, noteId, noteName, noteContent, isActing, act]);
  (0, import_react3.useEffect)(() => {
    if (cardActionFetcher.formAction?.endsWith("/create-action") && cardActionFetcher.data && isNoErrorSomeData(cardActionFetcher.data)) {
      setDocId(cardActionFetcher.data?.data.new_doc.ref_id);
      setNoteId(cardActionFetcher.data?.data.new_note.ref_id);
      clear();
    }
    if (cardActionFetcher.state === "idle" && cardActionFetcher.data !== null) {
      setIsActing(false);
      if (shouldAct) {
        act();
        setShouldAct(false);
      }
    }
  }, [cardActionFetcher, act, shouldAct, clear]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: cardActionFetcher.data }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 136,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", gap: 2, alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxDEV(
        TextField_default,
        {
          sx: { flexGrow: 1 },
          label: "Name",
          name: "name",
          variant: "standard",
          InputProps: {
            readOnly: !inputsEnabled
          },
          defaultValue: noteName,
          onChange: (e) => {
            setDataModified(true);
            setNoteName(e.target.value);
          }
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/docs/component/editor.tsx",
          lineNumber: 139,
          columnNumber: 9
        },
        this
      ),
      rightOfName
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 138,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(FieldError, { actionResult: cardActionFetcher.data, fieldName: "/name" }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 155,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(FieldError, { actionResult: cardActionFetcher.data, fieldName: "/content" }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 156,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(ClientOnly, { fallback: /* @__PURE__ */ jsxDEV("div", { children: "Loading... " }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 158,
      columnNumber: 29
    }, this), children: () => /* @__PURE__ */ jsxDEV(import_react3.Suspense, { fallback: /* @__PURE__ */ jsxDEV("div", { children: "Loading..." }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 160,
      columnNumber: 31
    }, this), children: /* @__PURE__ */ jsxDEV(
      BlockEditor,
      {
        editorSlug: `doc-editor-${docId}-${noteId}`,
        autofocus: true,
        initialContent: noteContent,
        inputsEnabled,
        dataTestId: "docs-doc-block-editor",
        onChange: (c) => {
          setDataModified(true);
          setNoteContent(c);
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/docs/component/editor.tsx",
        lineNumber: 161,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 160,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/docs/component/editor.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/docs/component/editor.tsx",
    lineNumber: 135,
    columnNumber: 5
  }, this);
}

export {
  DocEditor
};
//# sourceMappingURL=/build/_shared/chunk-ZALVYYVQ.js.map
