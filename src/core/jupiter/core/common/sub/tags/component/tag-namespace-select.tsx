import { TagNamespace } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import { tagNamespaceName } from "#/core/common/sub/tags/namespace";

interface TagNamespaceOption {
  namespace: TagNamespace;
  label: string;
}

interface TagNamespaceSelectProps {
  name: string;
  label?: string;
  defaultValue: TagNamespace;
  inputsEnabled: boolean;
  disabled?: boolean;
}

function namespaceToOption(namespace: TagNamespace): TagNamespaceOption {
  return { namespace, label: tagNamespaceName(namespace) };
}

export function TagNamespaceSelect(props: TagNamespaceSelectProps) {
  const allOptions = useMemo(
    () => Object.values(TagNamespace).map((ns) => namespaceToOption(ns)),
    [],
  );

  const [selected, setSelected] = useState<TagNamespaceOption>(() =>
    namespaceToOption(props.defaultValue),
  );

  useEffect(() => {
    setSelected(namespaceToOption(props.defaultValue));
  }, [props.defaultValue]);

  return (
    <>
      <Autocomplete
        autoHighlight
        disableClearable
        id={props.name}
        options={allOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        sx={autocompleteSingleLineSx}
        value={selected}
        onChange={(_, v) => {
          if (v === null) {
            return;
          }
          setSelected(v);
        }}
        isOptionEqualToValue={(o, v) => o.namespace === v.namespace}
        renderOption={(props, option) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...restProps } = props;
          return (
            <li {...restProps} key={key}>
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label={props.label ?? "Namespace"} />
        )}
      />
      <input name={props.name} type="hidden" value={selected.namespace} />
    </>
  );
}
