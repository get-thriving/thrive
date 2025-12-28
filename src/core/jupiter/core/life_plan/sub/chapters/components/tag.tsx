import type { Chapter, ChapterSummary } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  chapter: Chapter | ChapterSummary;
}

export function ChapterTag(props: Props) {
  return <SlimChip label={`📖 ${props.chapter.name}`} color="info" />;
}
