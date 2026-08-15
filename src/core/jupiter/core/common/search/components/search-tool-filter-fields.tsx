import { NamedEntityTag } from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
} from "@mui/material";

import { EntityTagSelect } from "#/core/common/component/named-entity-tag-select";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

export interface SearchToolFilterFieldsProps {
  topLevelInfo: TopLevelInfo;
  isBigScreen: boolean;
  inputsEnabled: boolean;
  actionResult: ActionResult<unknown> | undefined;
  searchLimit: string | undefined;
  setSearchLimit: (v: string | undefined) => void;
  searchIncludeArchived: boolean;
  setSearchIncludeArchived: (v: boolean) => void;
  searchFilterEntityTags: NamedEntityTag[];
  setSearchFilterEntityTags: (v: NamedEntityTag[]) => void;
  searchFilterCreatedTimeAfter: string | undefined;
  setSearchFilterCreatedTimeAfter: (v: string | undefined) => void;
  searchFilterCreatedTimeBefore: string | undefined;
  setSearchFilterCreatedTimeBefore: (v: string | undefined) => void;
  searchFilterLastModifiedTimeAfter: string | undefined;
  setSearchFilterLastModifiedTimeAfter: (v: string | undefined) => void;
  searchFilterLastModifiedTimeBefore: string | undefined;
  setSearchFilterLastModifiedTimeBefore: (v: string | undefined) => void;
  searchFilterArchivedTimeAfter: string | undefined;
  setSearchFilterArchivedTimeAfter: (v: string | undefined) => void;
  searchFilterArchivedTimeBefore: string | undefined;
  setSearchFilterArchivedTimeBefore: (v: string | undefined) => void;
}

export function SearchToolFilterFields(props: SearchToolFilterFieldsProps) {
  return (
    <Stack useFlexGap spacing={2}>
      <Stack
        useFlexGap
        sx={{ alignItems: "center" }}
        direction={props.isBigScreen ? "row" : "column"}
        spacing={2}
      >
        <FormControl fullWidth>
          <InputLabel id="limit">Limit</InputLabel>
          <OutlinedInput
            label="Limit"
            name="limit"
            type="number"
            readOnly={!props.inputsEnabled}
            value={props.searchLimit}
            onChange={(e) => props.setSearchLimit(e.target.value)}
          />
          <FieldError actionResult={props.actionResult} fieldName="/limit" />
        </FormControl>

        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                name="includeArchived"
                readOnly={!props.inputsEnabled}
                checked={props.searchIncludeArchived}
                onChange={(e) =>
                  props.setSearchIncludeArchived(e.target.checked)
                }
              />
            }
            label="Include Archived"
          />
          <FieldError
            actionResult={props.actionResult}
            fieldName="/include_archived"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="filterEntityTags">Filter Entities</InputLabel>
          <EntityTagSelect
            topLevelInfo={props.topLevelInfo}
            labelId="filterEntityTags"
            label="Filter Entities"
            name="filterEntityTags"
            readOnly={!props.inputsEnabled}
            value={props.searchFilterEntityTags}
            onChange={(e) => props.setSearchFilterEntityTags(e)}
          />
          <FieldError
            actionResult={props.actionResult}
            fieldName="/filter_entity_tags"
          />
        </FormControl>
      </Stack>

      <FieldError actionResult={props.actionResult} fieldName="/offset" />

      <Stack
        spacing={2}
        useFlexGap
        direction={props.isBigScreen ? "row" : "column"}
      >
        <Stack spacing={2} useFlexGap sx={{ flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="filterCreatedTimeAfter" shrink>
              Created After
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Created After"
              value={props.searchFilterCreatedTimeAfter}
              onChange={(e) =>
                props.setSearchFilterCreatedTimeAfter(e.target.value)
              }
              name="filterCreatedTimeAfter"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
            />

            <FieldError
              actionResult={props.actionResult}
              fieldName="/filter_created_time_after"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filterCreatedTimeBefore" shrink>
              Created Before
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Created Before"
              value={props.searchFilterCreatedTimeBefore}
              onChange={(e) =>
                props.setSearchFilterCreatedTimeBefore(e.target.value)
              }
              name="filterCreatedTimeBefore"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
            />

            <FieldError
              actionResult={props.actionResult}
              fieldName="/filter_created_time_before"
            />
          </FormControl>
        </Stack>

        <Stack spacing={2} useFlexGap sx={{ flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="filterLastModifiedTimeAfter" shrink>
              Last Modified After
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Last Modified After"
              value={props.searchFilterLastModifiedTimeAfter}
              onChange={(e) =>
                props.setSearchFilterLastModifiedTimeAfter(e.target.value)
              }
              name="filterLastModifiedTimeAfter"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
            />

            <FieldError
              actionResult={props.actionResult}
              fieldName="/filter_last_modified_time_after"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filterLastModifiedTimeBefore" shrink>
              Last Modified Before
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Last Modified Before"
              value={props.searchFilterLastModifiedTimeBefore}
              onChange={(e) =>
                props.setSearchFilterLastModifiedTimeBefore(e.target.value)
              }
              name="filterLastModifiedTimeBefore"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
            />

            <FieldError
              actionResult={props.actionResult}
              fieldName="/filter_last_modified_time_before"
            />
          </FormControl>
        </Stack>

        <Stack spacing={2} useFlexGap sx={{ flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="filterArchivedTimeAfter" shrink>
              Archived After
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Archived After"
              value={props.searchFilterArchivedTimeAfter}
              onChange={(e) =>
                props.setSearchFilterArchivedTimeAfter(e.target.value)
              }
              name="filterArchivedTimeAfter"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
            />

            <FieldError
              actionResult={props.actionResult}
              fieldName="/filter_archived_time_after"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filterArchivedTimeBefore" shrink>
              Archived Before
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="Archived Before"
              value={props.searchFilterArchivedTimeBefore}
              onChange={(e) =>
                props.setSearchFilterArchivedTimeBefore(e.target.value)
              }
              name="filterArchivedTimeBefore"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
            />

            <FieldError
              actionResult={props.actionResult}
              fieldName="/filter_archived_time_before"
            />
          </FormControl>
        </Stack>
      </Stack>
    </Stack>
  );
}
