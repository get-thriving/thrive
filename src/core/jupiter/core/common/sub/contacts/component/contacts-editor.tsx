import type { EntityId, Contact } from "@jupiter/webapi-client";
import { ContactNamespace } from "@jupiter/webapi-client";
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
  allContacts: Array<Contact>;
  defaultValue: Array<EntityId>;
  inputsEnabled: boolean;
  namespace: ContactNamespace;
  sourceEntityRefId: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

export function ContactsEditor({
  name,
  allContacts,
  defaultValue,
  inputsEnabled,
  namespace,
  sourceEntityRefId,
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
        namespace: namespace,
        sourceEntityRefId: sourceEntityRefId,
        contacts: contactsHiddenValue,
      },
      {
        method: "post",
        action: "/app/workspace/core/contacts/upsert-contacts",
      },
    );
    setDataModified(false);
  }, [cardActionFetcher, namespace, sourceEntityRefId, contactsHiddenValue]);

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
        setShouldAct(false);
        setDataModified(true);
      } else {
        setHasActed(true);
      }
    }
  }, [cardActionFetcher.state, cardActionFetcher.data, isActing, shouldAct]);

  useEffect(() => {
    setContactsHiddenValue(initialDefaultValue.join(","));
  }, [initialDefaultValue]);

  const tagOptions = useMemo(() => {
    const selected = contactsHiddenValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    return [...new Set([...selected, ...allContactsAsOptions])];
  }, [contactsHiddenValue, allContactsAsOptions]);

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
        fullWidth
        multiple
        options={tagOptions}
        value={contactsHiddenValue
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)}
        readOnly={!inputsEnabled}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label={label || "Contacts"}
            placeholder="Add contacts..."
          />
        )}
        onChange={(event, newValue) => {
          const value = (newValue as string[]).join(",");
          setContactsHiddenValue(value);
          setDataModified(true);
        }}
        sx={{
          ...(aloneOnLine
            ? {}
            : {
                backgroundColor: theme.palette.background.paper,
              }),
        }}
      />
      <input
        type="hidden"
        name={name}
        value={contactsHiddenValue}
      />
    </Box>
  );
}
