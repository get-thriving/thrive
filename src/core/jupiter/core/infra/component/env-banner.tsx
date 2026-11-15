import { GlobalStyles, styled } from "@mui/material";
import { Env } from "@jupiter/webapi-client";

interface EnvBannerProps {
  env: Env;
}

export function EnvBanner({ env }: EnvBannerProps) {
  switch (env) {
    case Env.PRODUCTION:
      return null;
    case Env.STAGING:
      return (
        <EnvBannerSection>
          <EnvBannerHeight />
          <div>You are running a staging build</div>
        </EnvBannerSection>
      );
    case Env.LOCAL:
      return (
        <EnvBannerSection>
          <EnvBannerHeight />
          <div>You are running a local build</div>
        </EnvBannerSection>
      );
  }
}

/**
 * How tall the banner is, for what else sits along the bottom of the window
 * (the Strata columns and their footer) to stay clear of it.
 */
const ENV_BANNER_HEIGHT = "1.75rem";

function EnvBannerHeight() {
  return (
    <GlobalStyles
      styles={{ ":root": { "--env-banner-height": ENV_BANNER_HEIGHT } }}
    />
  );
}

const EnvBannerSection = styled("section")`
  z-index: 99999;
  position: fixed;
  bottom: 0vh;
  width: 100%;
  height: ${ENV_BANNER_HEIGHT};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: #ffe08a;
`;
