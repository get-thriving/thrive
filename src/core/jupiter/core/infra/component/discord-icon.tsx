import type { SVGProps } from "react";

import { DISCORD_LOGO_PATH } from "#/core/infra/component/discord-logo-path";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" {...props}>
    <g data-name="\u56FE\u5C42 2">
      <g data-name="Discord Logos">
        <path
          d={DISCORD_LOGO_PATH}
          data-name="Discord Logo - Large - White"
          style={{
            fill: "currentColor",
          }}
        />
      </g>
    </g>
  </svg>
);
export default SvgComponent;
