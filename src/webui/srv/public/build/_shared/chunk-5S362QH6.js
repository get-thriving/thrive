import {
  noteBlockToPlainText
} from "/build/_shared/chunk-542UTXAG.js";
import {
  Box_default,
  Button_default,
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
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/life_plan/sub/visions/components/snippet.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function VisionSnippet({ vision, note }) {
  const content = note?.content ?? [];
  const extracted = extractSnippetFromNoteContent(content);
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      id: `vision-snippet-${vision?.ref_id ?? "empty"}`,
      sx: {
        border: (theme) => `2px dotted ${theme.palette.divider}`,
        borderRadius: "4px",
        padding: "0.4rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        justifyContent: "space-between"
      },
      children: [
        /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body2", sx: { minWidth: 0 }, children: [
          extracted.kind === "text" && /* @__PURE__ */ jsxDEV(Fragment, { children: truncateToSingleLine(extracted.text) }, void 0, false, {
            fileName: "../core/jupiter/core/life_plan/sub/visions/components/snippet.tsx",
            lineNumber: 46,
            columnNumber: 11
          }, this),
          extracted.kind === "warning" && /* @__PURE__ */ jsxDEV(Fragment, { children: truncateToSingleLine(extracted.message) }, void 0, false, {
            fileName: "../core/jupiter/core/life_plan/sub/visions/components/snippet.tsx",
            lineNumber: 49,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/life_plan/sub/visions/components/snippet.tsx",
          lineNumber: 44,
          columnNumber: 7
        }, this),
        (extracted.kind === "warning" || extracted.showCreateDraftCta) && /* @__PURE__ */ jsxDEV(
          Button_default,
          {
            size: "small",
            variant: "contained",
            component: Link,
            to: "/app/workspace/life-plan/visions/new-draft",
            sx: { flexShrink: 0 },
            children: "Create Vision"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/life_plan/sub/visions/components/snippet.tsx",
            lineNumber: 54,
            columnNumber: 9
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/life_plan/sub/visions/components/snippet.tsx",
      lineNumber: 32,
      columnNumber: 5
    },
    this
  );
}
function extractSnippetFromNoteContent(content) {
  if (!content || content.length === 0) {
    return {
      kind: "warning",
      message: "You need to create a vision first.",
      showCreateDraftCta: true
    };
  }
  const first = content[0];
  switch (first.kind) {
    case import_webapi_client.ParagraphBlock.kind.PARAGRAPH:
    case import_webapi_client.HeadingBlock.kind.HEADING:
    case import_webapi_client.QuoteBlock.kind.QUOTE:
      return {
        kind: "text",
        text: stripHtml(noteBlockToPlainText(first)),
        showCreateDraftCta: false
      };
    case import_webapi_client.BulletedListBlock.kind.BULLETED_LIST: {
      const firstItemText = first.items?.[0]?.text;
      return {
        kind: firstItemText ? "text" : "warning",
        ...firstItemText ? { text: stripHtml(firstItemText) } : { message: "This vision starts with an empty list." },
        showCreateDraftCta: !firstItemText
      };
    }
    case import_webapi_client.NumberedListBlock.kind.NUMBERED_LIST: {
      const firstItemText = first.items?.[0]?.text;
      return {
        kind: firstItemText ? "text" : "warning",
        ...firstItemText ? { text: stripHtml(firstItemText) } : { message: "This vision starts with an empty list." },
        showCreateDraftCta: !firstItemText
      };
    }
    case import_webapi_client.ChecklistBlock.kind.CHECKLIST: {
      const firstItemText = first.items?.[0]?.text;
      return {
        kind: firstItemText ? "text" : "warning",
        ...firstItemText ? { text: stripHtml(firstItemText) } : { message: "This vision starts with an empty checklist." },
        showCreateDraftCta: !firstItemText
      };
    }
    case import_webapi_client.TableBlock.kind.TABLE:
      return unsupportedStart("a table");
    case import_webapi_client.CodeBlock.kind.CODE:
      return unsupportedStart("a code block");
    case import_webapi_client.DividerBlock.kind.DIVIDER:
      return unsupportedStart("a divider");
    case import_webapi_client.LinkBlock.kind.LINK:
      return unsupportedStart("a link");
    case import_webapi_client.EntityReferenceBlock.kind.ENTITY_REFERENCE:
      return unsupportedStart("an entity reference");
    default:
      return {
        kind: "warning",
        message: "This vision starts with an unsupported element.",
        showCreateDraftCta: true
      };
  }
}
function unsupportedStart(what) {
  return {
    kind: "warning",
    message: `A vision can't start with ${what}.`,
    showCreateDraftCta: true
  };
}
function stripHtml(text) {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
function truncateToSingleLine(text) {
  return text.replace(/\s+/g, " ").trim();
}

export {
  VisionSnippet
};
//# sourceMappingURL=/build/_shared/chunk-5S362QH6.js.map
