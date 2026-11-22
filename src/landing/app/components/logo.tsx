import { strataColors } from "@jupiter/core/infra/component/strata-tokens";

/** The three bars of the Thrive mark. */
export function Logo(props: { size: number }) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 22 22"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="2"
        width="20"
        height="4"
        rx="1"
        style={{ fill: strataColors.amber }}
      />
      <rect
        x="4"
        y="9"
        width="17"
        height="4"
        rx="1"
        style={{ fill: strataColors.textMuted }}
      />
      <rect
        x="7"
        y="16"
        width="14"
        height="4"
        rx="1"
        style={{ fill: strataColors.disabled }}
      />
    </svg>
  );
}
