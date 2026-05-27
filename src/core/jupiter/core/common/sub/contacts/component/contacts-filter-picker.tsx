import type { Contact, EntityId } from "@jupiter/webapi-client";
import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { useBigScreen } from "#/core/infra/component/use-big-screen";

export interface ContactsFilterPickerProps {
  allContacts: Array<Contact>;
  value: Array<EntityId>;
  onChange: (next: Array<EntityId>) => void;
  inputsEnabled: boolean;
  label?: ReactNode;
  aloneOnLine?: boolean;
  size?: "small" | "medium";
}

/** Multiselect contact names → ref ids for local filter state (no persistence). */
export function ContactsFilterPicker({
  allContacts,
  value,
  onChange,
  inputsEnabled,
  label,
  aloneOnLine = false,
  size = "medium",
}: ContactsFilterPickerProps) {
  const isBigScreen = useBigScreen();

  const allContactsAsOptions = useMemo(
    () => allContacts.map((contact) => contact.name),
    [allContacts],
  );

  const contactsByRefId = useMemo(() => {
    const result: Record<string, Contact> = {};
    for (const contact of allContacts) {
      result[contact.ref_id] = contact;
    }
    return result;
  }, [allContacts]);

  const selectedNames = useMemo(
    () =>
      value
        .map((cid) => contactsByRefId[cid]?.name)
        .filter((c): c is string => Boolean(c)),
    [contactsByRefId, value],
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Autocomplete
        disablePortal
        multiple
        limitTags={2}
        filterSelectedOptions
        freeSolo={false}
        options={allContactsAsOptions}
        readOnly={!inputsEnabled}
        disableCloseOnSelect
        value={selectedNames}
        onChange={(_event, newNames: string[]) => {
          const next = newNames
            .map((n) => allContacts.find((c) => c.name === n)?.ref_id)
            .filter((id): id is EntityId => Boolean(id));
          onChange(next);
        }}
        renderOption={(liProps, option, { selected }) => (
          <li {...liProps}>
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
          <TextField {...params} label={label ?? "Contacts"} size={size} />
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
    </Box>
  );
}
