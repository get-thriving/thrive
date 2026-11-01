import type { BigPlan, EntityId } from "@jupiter/webapi-client";
import { Alert, Stack } from "@mui/material";
import { useMemo, useState } from "react";

import { BigPlanMultiSelect } from "#/core/apps/big_plans/component/multi-select";
import { ChosenEntitiesList } from "#/core/common/component/chosen-entities-list";

interface KeyBigPlansProgressPropertiesEditorProps {
  /** The form field the chosen big plans are submitted in, as a comma
   * separated list of ref ids. */
  name: string;
  allBigPlans: BigPlan[];
  defaultValue: EntityId[];
  inputsEnabled: boolean;
}

export function KeyBigPlansProgressPropertiesEditor(
  props: KeyBigPlansProgressPropertiesEditorProps,
) {
  const bigPlansByRefId = useMemo(
    () =>
      new Map(props.allBigPlans.map((bigPlan) => [bigPlan.ref_id, bigPlan])),
    [props.allBigPlans],
  );

  // Big plans that were archived, or are no longer shared with the user, cannot
  // be shown. They are left out of the list from the start, so saving drops
  // them for good.
  const [initialBigPlanRefIds] = useState(() =>
    props.defaultValue.filter((refId) => bigPlansByRefId.has(refId)),
  );
  const unavailableCount =
    props.defaultValue.length - initialBigPlanRefIds.length;

  const [bigPlanRefIds, setBigPlanRefIds] =
    useState<EntityId[]>(initialBigPlanRefIds);

  return (
    <Stack spacing={2}>
      <BigPlanMultiSelect
        name={props.name}
        label="Big plans to include"
        allBigPlans={props.allBigPlans}
        value={bigPlanRefIds}
        onChange={setBigPlanRefIds}
        inputsEnabled={props.inputsEnabled}
        disabled={!props.inputsEnabled}
      />

      {unavailableCount > 0 && (
        <Alert severity="info">
          {unavailableCount === 1
            ? "A big plan this widget included is archived or no longer available to you, so it is not listed."
            : `${unavailableCount} big plans this widget included are archived or no longer available to you, so they are not listed.`}{" "}
          Update the widget to remove them.
        </Alert>
      )}

      {/* The widget lays its big plans out by how pressing they are, so there
          is no order to set here. */}
      <ChosenEntitiesList
        entities={bigPlanRefIds.map((refId) => ({
          refId,
          name: String(bigPlansByRefId.get(refId)!.name),
        }))}
        onRemove={(refId) =>
          setBigPlanRefIds(bigPlanRefIds.filter((id) => id !== refId))
        }
        inputsEnabled={props.inputsEnabled}
        emptyMessage="No big plans chosen yet. The widget will stay empty until you add some."
      />
    </Stack>
  );
}
