import type { Contact } from "@jupiter/webapi-client";
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

import type { SomeErrorNoData } from "#/core/infra/action-result";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface Props {
  name: string;
  allContacts: Array<Contact>;
  defaultValue: Array<string>;
  inputsEnabled: boolean;
  /** Wire-form owner link ``{theType}:std:{refId}`` (see ``EntityLink``). */
  owner: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

export function ContactsEditor({
  name,
  allContacts,
  defaultValue,
  inputsEnabled,
  owner,
  label,
  aloneOnLine = false,
}: Props) {
  const cardActionFetcher = useFetcher<SomeErrorNoData>();
  const theme = useTheme();
  const isBigScreen = useBigScreen();

  const allContactsAsOptions = useMemo(
    () => allContacts.map((contact) => contact.name),
    [allContacts],
  );

  const contactsByRefId: { [contact: string]: Contact } = useMemo(() => {
    const result: { [contact: string]: Contact } = {};
    for (const contact of allContacts) {
      result[contact.ref_id] = contact;
    }
    return result;
  }, [allContacts]);

  const initialDefaultValue = useMemo(() => {
    return defaultValue
      .map((cid) => contactsByRefId[cid]?.name)
      .filter((c): c is string => Boolean(c));
  }, [defaultValue, contactsByRefId]);

  const [contactsHiddenValue, setContactsHiddenValue] = useState(
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
        contacts: contactsHiddenValue,
      },
      {
        method: "post",
        action: "/app/workspace/core/contacts/upsert-contacts",
      },
    );
    setDataModified(false);
  }, [cardActionFetcher, owner, contactsHiddenValue]);

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
        fieldName="/contact_names"
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
          setContactsHiddenValue(newValue.join(","));
          setDataModified(true);
        }}
        options={allContactsAsOptions}
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
          <TextField {...params} label={label ?? "Contacts"} />
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
      <input name={name} type="hidden" value={contactsHiddenValue} />
    </Box>
  );
}
