import type { EntityId, Tag } from "@jupiter/webapi-client";
import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  useTheme,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import type { ReactNode } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { entityOwnedByCurrentUser } from "#/core/common/sub/access/access-level";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface Props {
  name: string;
  allTags: Array<Tag>;
  /** Tags already linked to the entity (may belong to another workspace). */
  linkedTags?: Array<Tag>;
  defaultValue: Array<EntityId>;
  inputsEnabled: boolean;
  /** Owner of the entity whose tags are edited; blocks edit when shared. */
  entityOwnerRefId?: string;
  /** Canonical std entity link for the entity whose tags are edited. */
  owner: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

export function TagsEditor({
  name,
  allTags,
  linkedTags = [],
  defaultValue,
  inputsEnabled,
  entityOwnerRefId,
  owner,
  label,
  aloneOnLine = false,
}: Props) {
  const cardActionFetcher = useFetcher<SomeErrorNoData>();
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const editable =
    inputsEnabled &&
    entityOwnedByCurrentUser(entityOwnerRefId, topLevelInfo.user.ref_id);

  const knownTags = useMemo(() => {
    const byRefId = new Map<string, Tag>();
    for (const tag of allTags) {
      byRefId.set(tag.ref_id, tag);
    }
    for (const tag of linkedTags) {
      byRefId.set(tag.ref_id, tag);
    }
    return Array.from(byRefId.values());
  }, [allTags, linkedTags]);

  const allTagsAsOptions = useMemo(
    () => knownTags.map((tag) => tag.name),
    [knownTags],
  );

  const tagsByRefId: { [tag: string]: Tag } = useMemo(() => {
    const result: { [tag: string]: Tag } = {};
    for (const tag of knownTags) {
      result[tag.ref_id] = tag;
    }
    return result;
  }, [knownTags]);

  const initialDefaultValue = useMemo(() => {
    return defaultValue
      .map((tid) => tagsByRefId[tid]?.name)
      .filter((t): t is string => Boolean(t));
  }, [defaultValue, tagsByRefId]);

  const [tagsHiddenValue, setTagsHiddenValue] = useState(
    initialDefaultValue.join(","),
  );
  const [dataModified, setDataModified] = useState(false);
  const [shouldAct, setShouldAct] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [hasActed, setHasActed] = useState(false);

  const act = useCallback(() => {
    setIsActing(true);
    cardActionFetcher.submit(
      {
        owner,
        tags: tagsHiddenValue,
      },
      {
        method: "post",
        action: "/app/workspace/core/tags/upsert-tags",
      },
    );
    setDataModified(false);
  }, [cardActionFetcher, owner, tagsHiddenValue]);

  useEffect(() => {
    if (dataModified && editable) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [act, dataModified, editable, isActing]);

  useEffect(() => {
    if (
      isActing &&
      cardActionFetcher.state === "idle" &&
      cardActionFetcher.data
    ) {
      setIsActing(false);
      if (shouldAct) {
        act();
        setShouldAct(false);
      } else {
        setHasActed(true);
        setTimeout(() => {
          setHasActed(false);
        }, 1000);
      }
    }
  }, [act, isActing, cardActionFetcher, shouldAct]);

  return (
    <Box sx={{ position: "relative" }}>
      <GlobalError actionResult={cardActionFetcher.data} />
      <FieldError
        actionResult={cardActionFetcher.data}
        fieldName="/tag_names"
      />
      {isActing && (
        <Box
          sx={{
            position: "absolute",
            top: "0rem",
            right: "0rem",
            color: theme.palette.text.disabled,
            zIndex: 1,
          }}
        >
          Saving...
        </Box>
      )}
      {hasActed && (
        <Box
          sx={{
            position: "absolute",
            top: "0rem",
            right: "0rem",
            color: theme.palette.text.disabled,
            zIndex: 1,
          }}
        >
          Saved!
        </Box>
      )}
      <Autocomplete
        disablePortal
        multiple
        limitTags={2}
        filterSelectedOptions
        freeSolo
        onChange={(_event, newValue) => {
          if (!editable) {
            return;
          }
          setTagsHiddenValue(newValue.join(","));
          setDataModified(true);
        }}
        options={allTagsAsOptions}
        readOnly={!editable}
        disableCloseOnSelect
        defaultValue={initialDefaultValue}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              style={{ marginRight: 8, padding: 0 }}
              checked={selected}
              tabIndex={-1}
              disableRipple
            />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label={label ?? "Tags"} />
        )}
        sx={{
          maxWidth: aloneOnLine ? "100%" : "14rem",
          minWidth: isBigScreen ? "8rem" : "4rem",
          "& .MuiAutocomplete-inputRoot": {
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
            alignItems: "center",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },

          "& .MuiAutocomplete-tag": {
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
          },

          "& .MuiAutocomplete-input": {
            minWidth: 60,
            flexGrow: 1,
          },
        }}
      />
      <input name={name} type="hidden" value={tagsHiddenValue} />
    </Box>
  );
}
