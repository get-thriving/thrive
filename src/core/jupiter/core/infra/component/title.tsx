import { Hosting } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import { useContext } from "react";

import { GlobalPropertiesContext } from "#/core/config-client";
import { getHosting } from "#/core/universe";

interface TitleProps {
  hideOnSmallScreen?: boolean;
}

export function Title(props: TitleProps) {
  const globalProperties = useContext(GlobalPropertiesContext);

  let name = "";
  if (getHosting(globalProperties.universe) === Hosting.HOSTED_GLOBAL) {
    name = globalProperties.title;
  } else if (getHosting(globalProperties.universe) === Hosting.SELF_HOSTED) {
    name = `${globalProperties.title} - ${globalProperties.instance}`;
  } else {
    name = globalProperties.title;
  }

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
