import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Autocomplete_default,
  Box_default,
  Checkbox_default,
  TextField_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  useFetcher
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx
var import_react2 = __toESM(require_react(), 1);
function ContactsEditor({
  name,
  allContacts,
  defaultValue,
  inputsEnabled,
  owner,
  label,
  aloneOnLine = false
}) {
  const cardActionFetcher = useFetcher();
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const allContactsAsOptions = (0, import_react2.useMemo)(
    () => allContacts.map((contact) => contact.name),
    [allContacts]
  );
  const contactsByRefId = (0, import_react2.useMemo)(() => {
    const result = {};
    for (const contact of allContacts) {
      result[contact.ref_id] = contact;
    }
    return result;
  }, [allContacts]);
  const initialDefaultValue = (0, import_react2.useMemo)(() => {
    return defaultValue.map((cid) => contactsByRefId[cid]?.name).filter((c) => Boolean(c));
  }, [defaultValue, contactsByRefId]);
  const [contactsHiddenValue, setContactsHiddenValue] = (0, import_react2.useState)(
    initialDefaultValue.join(",")
  );
  const [dataModified, setDataModified] = (0, import_react2.useState)(false);
  const [shouldAct, setShouldAct] = (0, import_react2.useState)(false);
  const [isActing, setIsActing] = (0, import_react2.useState)(false);
  const [hasActed, setHasActed] = (0, import_react2.useState)(false);
  const act = (0, import_react2.useCallback)(() => {
    setIsActing(true);
    cardActionFetcher.submit(
      {
        owner,
        contacts: contactsHiddenValue
      },
      {
        method: "post",
        action: "/app/workspace/core/contacts/upsert-contacts"
      }
    );
    setDataModified(false);
  }, [cardActionFetcher, owner, contactsHiddenValue]);
  (0, import_react2.useEffect)(() => {
    if (dataModified) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [act, dataModified, isActing]);
  (0, import_react2.useEffect)(() => {
    if (isActing && cardActionFetcher.state === "idle" && cardActionFetcher.data) {
      setIsActing(false);
      if (shouldAct) {
        act();
        setShouldAct(false);
      } else {
        setHasActed(true);
        setTimeout(() => {
          setHasActed(false);
        }, 1e3);
      }
    }
  }, [act, isActing, cardActionFetcher, shouldAct]);
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: { position: "relative" }, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: cardActionFetcher.data }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
      lineNumber: 114,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      FieldError,
      {
        actionResult: cardActionFetcher.data,
        fieldName: "/contact_names"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
        lineNumber: 115,
        columnNumber: 7
      },
      this
    ),
    isActing && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: "0rem",
          right: "0rem",
          color: theme.palette.text.disabled,
          zIndex: 1
        },
        children: "Saving..."
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
        lineNumber: 120,
        columnNumber: 9
      },
      this
    ),
    hasActed && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        sx: {
          position: "absolute",
          top: "0rem",
          right: "0rem",
          color: theme.palette.text.disabled,
          zIndex: 1
        },
        children: "Saved!"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
        lineNumber: 133,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        disablePortal: true,
        multiple: true,
        limitTags: 2,
        filterSelectedOptions: true,
        freeSolo: true,
        onChange: (_event, newValue) => {
          setContactsHiddenValue(newValue.join(","));
          setDataModified(true);
        },
        options: allContactsAsOptions,
        readOnly: !inputsEnabled,
        disableCloseOnSelect: true,
        defaultValue: initialDefaultValue,
        renderOption: (props, option, { selected }) => /* @__PURE__ */ jsxDEV("li", { ...props, children: [
          /* @__PURE__ */ jsxDEV(
            Checkbox_default,
            {
              style: { marginRight: 8, padding: 0 },
              checked: selected,
              tabIndex: -1,
              disableRipple: true
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
              lineNumber: 161,
              columnNumber: 13
            },
            this
          ),
          option
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
          lineNumber: 160,
          columnNumber: 11
        }, this),
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: label ?? "Contacts" }, void 0, false, {
          fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        sx: {
          maxWidth: aloneOnLine ? "100%" : "14rem",
          minWidth: isBigScreen ? "8rem" : "4rem",
          "& .MuiAutocomplete-inputRoot": {
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
            alignItems: "center",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          },
          "& .MuiAutocomplete-tag": {
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis"
          },
          "& .MuiAutocomplete-input": {
            minWidth: 60,
            flexGrow: 1
          }
        }
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
        lineNumber: 145,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name, type: "hidden", value: contactsHiddenValue }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
      lineNumber: 197,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-editor.tsx",
    lineNumber: 113,
    columnNumber: 5
  }, this);
}

export {
  ContactsEditor
};
//# sourceMappingURL=/build/_shared/chunk-VGTT4RYC.js.map
