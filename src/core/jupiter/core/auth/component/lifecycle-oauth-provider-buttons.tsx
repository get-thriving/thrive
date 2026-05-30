import { Apple as AppleIcon, Google as GoogleIcon } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { JupiterAuthProvider } from "@jupiter/webapi-client";
import { Link } from "@remix-run/react";
import { useContext } from "react";

import { GlobalPropertiesContext } from "#/core/config-client";

const GOOGLE_PREPARE_LINK = "/app/lifecycle/init/google/prepare";

export function LifecycleOAuthProviderButtons() {
  const globalProperties = useContext(GlobalPropertiesContext);

  if (
    globalProperties.authProvider !== JupiterAuthProvider.LOCAL_GOOGLE_APPLE
  ) {
    return null;
  }

  return (
    <Stack spacing={1} width="100%" direction="row">
      <Button
        component={Link}
        to={GOOGLE_PREPARE_LINK}
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
      >
        Google
      </Button>
      <Button variant="outlined" fullWidth disabled startIcon={<AppleIcon />}>
        Apple
      </Button>
    </Stack>
  );
}
