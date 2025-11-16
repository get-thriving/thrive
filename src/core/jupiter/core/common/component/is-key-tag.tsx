import { SlimChip } from "~/infra/component/chips";

interface IsKeyTagProps {
  isKey: boolean;
}

export function IsKeyTag({ isKey }: IsKeyTagProps) {
  if (!isKey) return null;

  return <SlimChip label="🔑" color="default" />;
}
