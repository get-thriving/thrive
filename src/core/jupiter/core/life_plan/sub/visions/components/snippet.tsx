import type { Note, Vision } from "@jupiter/webapi-client";
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
import { Box, Button, Typography } from "@mui/material";
import { Link } from "@remix-run/react";

import type { OneOfNoteContentBlock } from "#/core/common/sub/notes/root";

export interface VisionSnippetProps {
  vision: Vision;
  note: Note;
}

export function VisionSnippet({ vision, note }: VisionSnippetProps) {
  const content = (note.content ?? []) as Array<OneOfNoteContentBlock>;

  const extracted = extractSnippetFromNoteContent(content);

  return (
    <Box
      id={`vision-snippet-${vision.ref_id}`}
      sx={{
        border: (theme) => `2px dotted ${theme.palette.primary.main}`,
        borderRadius: "4px",
        padding: "0.4rem",
        marginBottom: "1rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2" sx={{ minWidth: 0 }}>
        <Typography component="span" fontWeight="bold">
          Life Vision:{" "}
        </Typography>
        {extracted.kind === "text" && (
          <>{truncateToSingleLine(extracted.text)}</>
        )}
        {extracted.kind === "warning" && (
          <>{truncateToSingleLine(extracted.message)}</>
        )}
      </Typography>

      {(extracted.kind === "warning" || extracted.showCreateDraftCta) && (
        <Button
          size="small"
          variant="contained"
          component={Link}
          to="/app/workspace/life-plan/visions/new-draft"
          sx={{ flexShrink: 0 }}
        >
          Create new draft
        </Button>
      )}
    </Box>
  );
}

type Extraction =
  | { kind: "text"; text: string; showCreateDraftCta: boolean }
  | { kind: "warning"; message: string; showCreateDraftCta: boolean };

function extractSnippetFromNoteContent(
  content: Array<OneOfNoteContentBlock>,
): Extraction {
  if (!content || content.length === 0) {
    return {
      kind: "warning",
      message: "You need some content for this vision.",
      showCreateDraftCta: true,
    };
  }

  const first = content[0];

  switch (first.kind) {
    case ParagraphBlock.kind.PARAGRAPH:
      return {
        kind: "text",
        text: stripHtml(first.text ?? ""),
        showCreateDraftCta: false,
      };

    case HeadingBlock.kind.HEADING:
      return {
        kind: "text",
        text: stripHtml(first.text ?? ""),
        showCreateDraftCta: false,
      };

    case QuoteBlock.kind.QUOTE:
      return {
        kind: "text",
        text: stripHtml(first.text ?? ""),
        showCreateDraftCta: false,
      };

    case BulletedListBlock.kind.BULLETED_LIST: {
      const firstItemText = first.items?.[0]?.text;
      return {
        kind: firstItemText ? "text" : "warning",
        ...(firstItemText
          ? { text: stripHtml(firstItemText) }
          : { message: "This vision starts with an empty list." }),
        showCreateDraftCta: !firstItemText,
      } as Extraction;
    }

    case NumberedListBlock.kind.NUMBERED_LIST: {
      const firstItemText = first.items?.[0]?.text;
      return {
        kind: firstItemText ? "text" : "warning",
        ...(firstItemText
          ? { text: stripHtml(firstItemText) }
          : { message: "This vision starts with an empty list." }),
        showCreateDraftCta: !firstItemText,
      } as Extraction;
    }

    case ChecklistBlock.kind.CHECKLIST: {
      const firstItemText = first.items?.[0]?.text;
      return {
        kind: firstItemText ? "text" : "warning",
        ...(firstItemText
          ? { text: stripHtml(firstItemText) }
          : { message: "This vision starts with an empty checklist." }),
        showCreateDraftCta: !firstItemText,
      } as Extraction;
    }

    case TableBlock.kind.TABLE:
      return unsupportedStart("a table");
    case CodeBlock.kind.CODE:
      return unsupportedStart("a code block");
    case DividerBlock.kind.DIVIDER:
      return unsupportedStart("a divider");
    case LinkBlock.kind.LINK:
      return unsupportedStart("a link");
    case EntityReferenceBlock.kind.ENTITY_REFERENCE:
      return unsupportedStart("an entity reference");

    default:
      return {
        kind: "warning",
        message: "This vision starts with an unsupported element.",
        showCreateDraftCta: true,
      };
  }
}

function unsupportedStart(what: string): Extraction {
  return {
    kind: "warning",
    message: `A vision can't start with ${what}.`,
    showCreateDraftCta: true,
  };
}

function stripHtml(text: string): string {
  // EditorJS often stores text as HTML fragments.
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateToSingleLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
