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
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  entityLinkAutocompleteSx,
  entityLinkSelectRootSx,
  renderLimitedAutocompleteTags,
} from "#/core/common/component/autocomplete";
import { entityOwnedByCurrentUser } from "#/core/common/sub/access/access-level";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface Props {
  name: string;
  allContacts: Array<Contact>;
  /** Contacts already linked to the entity (may belong to another workspace). */
  linkedContacts?: Array<Contact>;
  defaultValue: Array<string>;
  inputsEnabled: boolean;
  /** Owner of the entity whose contacts are edited; blocks edit when shared. */
  entityOwnerRefId?: string;
  /** Wire-form owner link ``{theType}:std:{refId}`` (see ``EntityLink``). */
  owner: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

export function ContactsEditor({
  name,
  allContacts,
  linkedContacts = [],
  defaultValue,
  inputsEnabled,
  entityOwnerRefId,
  owner,
  label,
  aloneOnLine = false,
}: Props) {
  const cardActionFetcher = useFetcher<SomeErrorNoData>();
  const theme = useTheme();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const editable =
    inputsEnabled &&
    entityOwnedByCurrentUser(entityOwnerRefId, topLevelInfo.user.ref_id);

  const knownContacts = useMemo(() => {
    const byRefId = new Map<string, Contact>();
    for (const contact of allContacts) {
      byRefId.set(contact.ref_id, contact);
    }
    for (const contact of linkedContacts) {
      byRefId.set(contact.ref_id, contact);
    }
    return Array.from(byRefId.values());
  }, [allContacts, linkedContacts]);

  const allContactsAsOptions = useMemo(
    () => knownContacts.map((contact) => contact.name),
    [knownContacts],
  );

  const contactsByRefId: { [contact: string]: Contact } = useMemo(() => {
    const result: { [contact: string]: Contact } = {};
    for (const contact of knownContacts) {
      result[contact.ref_id] = contact;
    }
    return result;
  }, [knownContacts]);

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
    <Box sx={entityLinkSelectRootSx}>
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
        filterSelectedOptions
        freeSolo
        onChange={(_event, newValue) => {
          if (!editable) {
            return;
          }
          setContactsHiddenValue(newValue.join(","));
          setDataModified(true);
        }}
        options={allContactsAsOptions}
        readOnly={!editable}
        disableCloseOnSelect
        defaultValue={initialDefaultValue}
        renderTags={renderLimitedAutocompleteTags<string>()}
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
        sx={entityLinkAutocompleteSx(aloneOnLine)}
      />
      <input name={name} type="hidden" value={contactsHiddenValue} />
    </Box>
  );
}
