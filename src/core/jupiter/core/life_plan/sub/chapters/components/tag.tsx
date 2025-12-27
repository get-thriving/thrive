import type { Chapter } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  chapter: Chapter;
}

export function ChapterTag(props: Props) {
  return <SlimChip label={`📖 ${props.chapter.name}`} color="info" />;
}
