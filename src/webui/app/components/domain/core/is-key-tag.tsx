import { SlimChip } from "@jupiter/core/jupiter/core/infra/components/chips";

interface IsKeyTagProps {
  isKey: boolean;
}

export function IsKeyTag({ isKey }: IsKeyTagProps) {
  if (!isKey) return null;

  return <SlimChip label="🔑" color="default" />;
}
