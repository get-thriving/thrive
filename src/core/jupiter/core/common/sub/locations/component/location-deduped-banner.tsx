import { Alert } from "@mui/material";

export function LocationDedupedBanner() {
  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      A nearby location with a similar name already existed, so that one was
      used instead of creating a duplicate.
    </Alert>
  );
}
