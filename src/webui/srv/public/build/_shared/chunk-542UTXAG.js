import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/notes/note-content-plain-text.ts
var import_webapi_client = __toESM(require_dist(), 1);
var DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS = 200;
function flattenListItemToPlainText(item) {
  const parts = [];
  const t = item.text.trim();
  if (t) {
    parts.push(t);
  }
  for (const sub of item.items) {
    const s = flattenListItemToPlainText(sub).trim();
    if (s) {
      parts.push(s);
    }
  }
  return parts.join(" ");
}
function noteBlockToPlainText(block) {
  switch (block.kind) {
    case import_webapi_client.ParagraphBlock.kind.PARAGRAPH:
      return block.text;
    case import_webapi_client.HeadingBlock.kind.HEADING:
      return block.text;
    case import_webapi_client.QuoteBlock.kind.QUOTE:
      return block.text;
    case import_webapi_client.BulletedListBlock.kind.BULLETED_LIST:
    case import_webapi_client.NumberedListBlock.kind.NUMBERED_LIST: {
      const pieces = block.items.map((item) => flattenListItemToPlainText(item).trim()).filter(Boolean);
      return pieces.join(" ");
    }
    case import_webapi_client.ChecklistBlock.kind.CHECKLIST:
      return block.items.map((item) => item.text.trim()).filter(Boolean).join(" ");
    case import_webapi_client.TableBlock.kind.TABLE:
      return block.contents.map(
        (row) => row.map((cell) => cell.trim()).filter(Boolean).join(" ")
      ).filter(Boolean).join("\n");
    case import_webapi_client.CodeBlock.kind.CODE:
      return block.code;
    case import_webapi_client.DividerBlock.kind.DIVIDER:
      return "";
    case import_webapi_client.LinkBlock.kind.LINK:
      return String(block.url);
    case import_webapi_client.EntityReferenceBlock.kind.ENTITY_REFERENCE:
      return `${block.entity_tag} ${block.ref_id}`;
    default:
      return "";
  }
}
function noteContentPreviewPlainText(note, maxChars) {
  if (!note?.content?.length) {
    return null;
  }
  for (const block of note.content) {
    const raw = noteBlockToPlainText(block).trim().replace(/\s+/g, " ");
    if (raw) {
      if (raw.length <= maxChars) {
        return raw;
      }
      return `${raw.slice(0, maxChars - 1).trimEnd()}\u2026`;
    }
  }
  return null;
}

export {
  DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
  noteBlockToPlainText,
  noteContentPreviewPlainText
};
//# sourceMappingURL=/build/_shared/chunk-542UTXAG.js.map
