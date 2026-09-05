import type { UserLight } from "@jupiter/webapi-client";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete";
import { formatUserLightLabel } from "#/core/users/components/user-light-chip";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export type SearchForUserFn = (query: string) => Promise<UserLight[]>;

export interface SearchForUserWidgetProps {
  value: UserLight[];
  onChange: (next: UserLight[]) => void;
  searchUsers: SearchForUserFn;
  inputsEnabled: boolean;
  label?: ReactNode;
  aloneOnLine?: boolean;
  size?: "small" | "medium";
}

export function SearchForUserWidget({
  value,
  onChange,
  searchUsers,
  inputsEnabled,
  label,
  aloneOnLine = false,
  size = "medium",
}: SearchForUserWidgetProps) {
  const isBigScreen = useBigScreen();
  const searchUsersRef = useRef(searchUsers);
  searchUsersRef.current = searchUsers;

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<UserLight[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRequestIdRef = useRef(0);

  const selectedRefIds = useMemo(
    () => new Set(value.map((user) => user.ref_id)),
    [value],
  );

  useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    setLoading(true);

    const handle = window.setTimeout(() => {
      void searchUsersRef
        .current(trimmed)
        .then((users) => {
          if (searchRequestIdRef.current !== requestId) {
            return;
          }
          setOptions(users.filter((user) => !selectedRefIds.has(user.ref_id)));
          setLoading(false);
        })
        .catch(() => {
          if (searchRequestIdRef.current !== requestId) {
            return;
          }
          setOptions([]);
          setLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(handle);
    };
  }, [inputValue, selectedRefIds]);

  const getOptionLabel = useCallback(
    (option: UserLight) => formatUserLightLabel(option),
    [],
  );

  const isOptionEqualToValue = useCallback(
    (option: UserLight, selected: UserLight) =>
      option.ref_id === selected.ref_id,
    [],
  );

  const trimmedInput = inputValue.trim();
  const noOptionsText =
    trimmedInput.length < MIN_QUERY_LENGTH
      ? "Type at least 2 characters"
      : "No users found";

  return (
    <Box sx={{ position: "relative" }}>
      <Autocomplete
        multiple
        limitTags={2}
        filterSelectedOptions
        disableCloseOnSelect
        filterOptions={(matches) => matches}
        options={options}
        loading={loading}
        value={value}
        onChange={(_event, newValue, reason) => {
          onChange(newValue);
          if (reason === "selectOption") {
            setInputValue("");
          }
        }}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === "reset") {
            return;
          }
          setInputValue(newInputValue);
        }}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        readOnly={!inputsEnabled}
        disabled={!inputsEnabled}
        noOptionsText={noOptionsText}
        slotProps={{
          popper: {
            placement: "top-start",
            sx: { zIndex: (theme) => theme.zIndex.modal + 1 },
          },
        }}
        renderOption={(liProps, option, { selected }) => {
          const { key, ...optionProps } = liProps;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                style={{ marginRight: 8, padding: 0 }}
                checked={selected}
                tabIndex={-1}
                disableRipple
              />
              {formatUserLightLabel(option)}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ?? "Users"}
            size={size}
            autoComplete="off"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password",
              name: "jupiter-user-search",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{
          maxWidth: aloneOnLine ? "100%" : "14rem",
          minWidth: isBigScreen ? "8rem" : "4rem",
          ...autocompleteSingleLineSx,
        }}
      />
    </Box>
  );
}
