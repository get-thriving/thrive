import { Typography } from "@mui/material";
import { useContext } from "react";

import { GlobalPropertiesContext } from "#/core/config-client";
import { getPublicName } from "#/core/utils";

interface TitleProps {
  hideOnSmallScreen?: boolean;
}

export function Title(props: TitleProps) {
  const globalProperties = useContext(GlobalPropertiesContext);

  const name = getPublicName(globalProperties);

  return (
    <Typography
      noWrap
      variant="h6"
      component="div"
      sx={{
        flexGrow: 1,
        display: {
          xs: props.hideOnSmallScreen ? "none" : "block",
          sm: "block",
        },
      }}
    >
      {name}
    </Typography>
  );
}
