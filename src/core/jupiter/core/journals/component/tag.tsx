import { JournalSource } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { journalSourceName } from "#/core/journals/source";

interface Props {
  source: JournalSource;
}

export function JournalSourceTag({ source }: Props) {
  const tagName = journalSourceName(source);
  const tagClass = sourceToClass(source);
  return <SlimChip label={tagName} color={tagClass} />;
}

function sourceToClass(source: JournalSource): "info" | "warning" {
  switch (source) {
    case JournalSource.TODO:
      return "info";
    case JournalSource.GENERATED:
      return "warning";
  }
}
