import { useContext } from "react";

import {
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface PanelNewActionProps {
  /** The kind of the panel: it is part of the id of the button. */
  kind: "trunk" | "branch";
  /** Where the new item is made. */
  link: string;
  disabled?: boolean;
}

/**
 * The controls of a panel that has nothing but a way to make an item: a `New`
 * button in its header. There is no `+` by default (ADR 0021), so a panel with
 * other controls puts its own `New` first among them, and one with none uses
 * this.
 */
export function PanelNewAction(props: PanelNewActionProps) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  return (
    <SectionActions
      id={`${props.kind}-actions`}
      topLevelInfo={topLevelInfo}
      inputsEnabled={true}
      actions={[
        NavSingle({
          id: `${props.kind}-new-leaf-entity`,
          text: "New",
          link: props.link,
          disabled: props.disabled,
        }),
      ]}
    />
  );
}
