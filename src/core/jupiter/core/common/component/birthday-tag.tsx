import type { Birthday } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

interface BirthdayTagProps {
  birthday: Birthday;
  label?: string;
}

export function BirthdayTag({ birthday, label }: BirthdayTagProps) {
  const finalLabel = label ?? "Birthday";
  return (
    <Typography component={"span"}>
      {finalLabel} is on {birthday}
    </Typography>
  );
}
