import { SlimChip } from "#/core/infra/component/chips";

interface IsKeyTagProps {
  isKey: boolean;
  /** Outlined, for where chips are many. */
  outlined?: boolean;
}

export function IsKeyTag({ isKey, outlined }: IsKeyTagProps) {
  if (!isKey) return null;

  return (
    <SlimChip
      label="🔑"
      color="default"
      variant={outlined ? "outlined" : "filled"}
      sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
    />
  );
}
