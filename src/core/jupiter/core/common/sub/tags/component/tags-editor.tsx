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
import { useCallback, useEffect, useMemo, useState } from "react";

import { FieldError, GlobalError } from "#/core/infra/component/errors";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface Props {
  name: string;
  allTags: Array<Tag>;
  defaultValue: Array<EntityId>;
  inputsEnabled: boolean;
  /** Canonical std entity link for the entity whose tags are edited. */
  owner: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

export function TagsEditor({
  name,
  allTags,
  defaultValue,
  inputsEnabled,
  owner,
  label,
  aloneOnLine = false,
}: Props) {
  const cardActionFetcher = useFetcher<SomeErrorNoData>();
  const theme = useTheme();
  const isBigScreen = useBigScreen();

  const allTagsAsOptions = useMemo(
    () => allTags.map((tag) => tag.name),
    [allTags],
  );

  const tagsByRefId: { [tag: string]: Tag } = useMemo(() => {
    const result: { [tag: string]: Tag } = {};
    for (const tag of allTags) {
      result[tag.ref_id] = tag;
    }
    return result;
  }, [allTags]);

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
    if (dataModified) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [act, dataModified, isActing]);

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
        onChange={(event, newValue) => {
          setTagsHiddenValue(newValue.join(","));
          setDataModified(true);
        }}
        options={allTagsAsOptions}
        readOnly={!inputsEnabled}
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
