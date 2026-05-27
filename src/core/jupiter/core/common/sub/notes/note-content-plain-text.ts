import type { ListItem, Note } from "@jupiter/webapi-client";
import {
  BulletedListBlock,
  ChecklistBlock,
  CodeBlock,
  DividerBlock,
  EntityReferenceBlock,
  HeadingBlock,
  LinkBlock,
  NumberedListBlock,
  ParagraphBlock,
  QuoteBlock,
  TableBlock,
} from "@jupiter/webapi-client";

/** Default max length for {@link noteContentPreviewPlainText}. */
export const DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS = 200;

export function flattenListItemToPlainText(item: ListItem): string {
  const parts: string[] = [];
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

export function noteBlockToPlainText(block: Note["content"][number]): string {
  switch (block.kind) {
    case ParagraphBlock.kind.PARAGRAPH:
      return block.text;
    case HeadingBlock.kind.HEADING:
      return block.text;
    case QuoteBlock.kind.QUOTE:
      return block.text;
    case BulletedListBlock.kind.BULLETED_LIST:
    case NumberedListBlock.kind.NUMBERED_LIST: {
      const pieces = block.items
        .map((item) => flattenListItemToPlainText(item).trim())
        .filter(Boolean);
      return pieces.join(" ");
    }
    case ChecklistBlock.kind.CHECKLIST:
      return block.items
        .map((item) => item.text.trim())
        .filter(Boolean)
        .join(" ");
    case TableBlock.kind.TABLE:
      return block.contents
        .map((row) =>
          row
            .map((cell) => cell.trim())
            .filter(Boolean)
            .join(" "),
        )
        .filter(Boolean)
        .join("\n");
    case CodeBlock.kind.CODE:
      return block.code;
    case DividerBlock.kind.DIVIDER:
      return "";
    case LinkBlock.kind.LINK:
      return String(block.url);
    case EntityReferenceBlock.kind.ENTITY_REFERENCE:
      return `${block.entity_tag} ${block.ref_id}`;
    default:
      return "";
  }
}

/**
 * Plain-text preview: first content block that yields non-empty text, normalized
 * whitespace, truncated to `maxChars` (with ellipsis). Mirrors backend flatten rules.
 */
export function noteContentPreviewPlainText(
  note: Note | null | undefined,
  maxChars: number,
): string | null {
  if (!note?.content?.length) {
    return null;
  }
  for (const block of note.content) {
    const raw = noteBlockToPlainText(block).trim().replace(/\s+/g, " ");
    if (raw) {
      if (raw.length <= maxChars) {
        return raw;
      }
      return `${raw.slice(0, maxChars - 1).trimEnd()}…`;
    }
  }
  return null;
}
