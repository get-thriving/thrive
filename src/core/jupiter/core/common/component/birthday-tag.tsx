import type { Birthday } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

interface BirthdayTagProps {
  birthday: Birthday;
}

export function BirthdayTag({ birthday }: BirthdayTagProps) {
  return <Typography component={"span"}>Birthday is on {birthday}</Typography>;
}
