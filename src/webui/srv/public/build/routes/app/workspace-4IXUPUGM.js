import {
  SCORE_ACTION_COOKIE_SCHEMA
} from "/build/_shared/chunk-BXLFAMEM.js";
import {
  isUserFeatureAvailable
} from "/build/_shared/chunk-LJCXIXWH.js";
import {
  TimeDiffTag
} from "/build/_shared/chunk-YNGTC4PW.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityStack2
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityFakeLink,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  DateTime,
  makeRootErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  motion,
  useAnimate
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  isNoErrorSomeData
} from "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  CommunityLink,
  SmartAppBar,
  Title
} from "/build/_shared/chunk-UVXGDSKE.js";
import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
import {
  inferEntityTagsForEnabledFeatures,
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  AccountCircle_default,
  Close_default,
  Logout_default,
  Menu_default as Menu_default2,
  Policy_default,
  Search_default,
  Security_default,
  Settings_default,
  SmartToy_default,
  SportsEsports_default,
  Tune_default,
  VpnKey_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  useSnackbar
} from "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Autocomplete_default,
  Avatar_default,
  Badge_default,
  Box_default,
  Button_default,
  CardActions_default,
  CardContent_default,
  Card_default,
  Checkbox_default,
  Chip_default,
  Collapse_default,
  Dialog_default,
  Divider_default,
  FormControlLabel_default,
  FormControl_default,
  IconButton_default,
  InputAdornment_default,
  InputLabel_default,
  LinearProgress_default,
  ListItemButton_default,
  ListItemIcon_default,
  ListItemText_default,
  ListItem_default,
  List_default,
  MenuItem_default,
  Menu_default,
  OutlinedInput_default,
  Select_default,
  Stack_default,
  Switch_default,
  TextField_default,
  ToggleButtonGroup_default,
  ToggleButton_default,
  Toolbar_default,
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  GlobalPropertiesContext,
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  SCORE_ACTION_COOKIE_NAME
} from "/build/_shared/chunk-VB6MSCNJ.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  Link,
  useFetcher,
  useOutlet
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace.tsx
var import_webapi_client6 = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react12 = __toESM(require_react());

// ../../node_modules/js-cookie/dist/js.cookie.mjs
function assign(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target;
}
var defaultConverter = {
  read: function(value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function(value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }
};
function init(converter, defaultAttributes) {
  function set(name, value, attributes) {
    if (typeof document === "undefined") {
      return;
    }
    attributes = assign({}, defaultAttributes, attributes);
    if (typeof attributes.expires === "number") {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }
    name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
    var stringifiedAttributes = "";
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue;
      }
      stringifiedAttributes += "; " + attributeName;
      if (attributes[attributeName] === true) {
        continue;
      }
      stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
    }
    return document.cookie = name + "=" + converter.write(value, name) + stringifiedAttributes;
  }
  function get(name) {
    if (typeof document === "undefined" || arguments.length && !name) {
      return;
    }
    var cookies = document.cookie ? document.cookie.split("; ") : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split("=");
      var value = parts.slice(1).join("=");
      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);
        if (name === found) {
          break;
        }
      } catch (e) {
      }
    }
    return name ? jar[name] : jar;
  }
  return Object.create(
    {
      set,
      get,
      remove: function(name, attributes) {
        set(
          name,
          "",
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function(attributes) {
        return init(this.converter, assign({}, this.attributes, attributes));
      },
      withConverter: function(converter2) {
        return init(assign({}, this.converter, converter2), this.attributes);
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  );
}
var api = init(defaultConverter, { path: "/" });

// ../core/jupiter/core/gamification/component/score-snackbar-manager.tsx
var import_react = __toESM(require_react(), 1);
function formatScoreUpdate(result, isBigScreen) {
  let resultStr = "";
  const pointsStr = Math.abs(result.latest_task_score) === 1 ? "point" : "points";
  if (result.latest_task_score > 0) {
    resultStr += `\u2B50 Great! You scored ${result.latest_task_score} ${pointsStr}!`;
  } else {
    resultStr += `\u{1F63F} Snap! You lost ${Math.abs(
      result.latest_task_score
    )} ${pointsStr}!`;
  }
  if (result.has_lucky_puppy_bonus) {
    resultStr += " You got a \u{1F436}lucky puppy\u{1F436} bonus! ";
  }
  if (isBigScreen) {
    resultStr += ` Which brings your total for today to ${result.daily_total_score} and for this week to ${result.weekly_total_score}.`;
  }
  return resultStr;
}
function useScoreActionSingleton() {
  const [scoreAction, setScoreAction] = (0, import_react.useState)(
    void 0
  );
  (0, import_react.useEffect)(() => {
    const interval = setInterval(() => {
      const scoreActionStr = api.get(SCORE_ACTION_COOKIE_NAME);
      if (scoreActionStr === void 0) {
        return;
      }
      const scoreAction2 = SCORE_ACTION_COOKIE_SCHEMA.parse(
        JSON.parse(atob(scoreActionStr))
      );
      setScoreAction(scoreAction2);
      api.remove(SCORE_ACTION_COOKIE_NAME);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return scoreAction;
}
function ScoreSnackbarManager({
  scoreAction
}) {
  const { enqueueSnackbar } = useSnackbar();
  const isBigScreen = useBigScreen();
  (0, import_react.useEffect)(() => {
    if (scoreAction !== void 0) {
      enqueueSnackbar(formatScoreUpdate(scoreAction, isBigScreen), {
        key: "gamification",
        autoHideDuration: 3e3,
        hideIconVariant: true,
        variant: scoreAction.latest_task_score > 0 ? "success" : "warning"
      });
    }
  }, [enqueueSnackbar, isBigScreen, scoreAction]);
  return null;
}

// ../core/jupiter/core/infra/component/layout/workspace-container.tsx
function WorkspaceContainer(props) {
  return /* @__PURE__ */ jsxDEV(Stack_default, { children: props.children }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/layout/workspace-container.tsx",
    lineNumber: 5,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/infra/component/release-update-widget.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react3 = __toESM(require_react(), 1);
var REFRESH_INTERVAL_MS = 5 * 60 * 1e3;
function ReleaseUpdateWidget() {
  const releaseManifestFetcher = useFetcher();
  const globalProperties = (0, import_react3.useContext)(GlobalPropertiesContext);
  const serviceProperties = (0, import_react3.useContext)(ServicePropertiesContext);
  const [dismiss, setDismiss] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    const intervalId = setInterval(() => {
      releaseManifestFetcher.load("/release-manifest");
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [releaseManifestFetcher]);
  if (dismiss) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
      lineNumber: 42,
      columnNumber: 12
    }, this);
  }
  if (releaseManifestFetcher.data === void 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
      lineNumber: 46,
      columnNumber: 12
    }, this);
  }
  if (releaseManifestFetcher.data.ok === false || !releaseManifestFetcher.data.res) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
      lineNumber: 53,
      columnNumber: 12
    }, this);
  }
  const releaseManifestResult = releaseManifestFetcher.data.res;
  if (releaseManifestResult.latestServerVersion !== serviceProperties.frontDoorInfo.clientVersion) {
    let action = false;
    switch (serviceProperties.frontDoorInfo.appShell) {
      case import_webapi_client.AppShell.BROWSER:
      case import_webapi_client.AppShell.PWA:
        break;
      case import_webapi_client.AppShell.DESKTOP_ELECTRON:
        switch (serviceProperties.frontDoorInfo.appDistribution) {
          case import_webapi_client.AppDistribution.MAC_WEB:
            if (releaseManifestResult.manifest[import_webapi_client.AppDistribution.MAC_WEB] === import_webapi_client.AppDistributionState.READY) {
              action = true;
            }
            break;
          case import_webapi_client.AppDistribution.MAC_STORE:
            if (releaseManifestResult.manifest[import_webapi_client.AppDistribution.MAC_STORE] === import_webapi_client.AppDistributionState.READY) {
              action = true;
            }
            break;
        }
        break;
      case import_webapi_client.AppShell.MOBILE_CAPACITOR:
        switch (serviceProperties.frontDoorInfo.appPlatform) {
          case import_webapi_client.AppPlatform.MOBILE_IOS:
          case import_webapi_client.AppPlatform.TABLET_IOS:
            if (releaseManifestResult.manifest[import_webapi_client.AppDistribution.APP_STORE] === import_webapi_client.AppDistributionState.READY) {
              action = true;
            }
            break;
          case import_webapi_client.AppPlatform.MOBILE_ANDROID:
          case import_webapi_client.AppPlatform.TABLET_ANDROID:
            if (releaseManifestResult.manifest[import_webapi_client.AppDistribution.GOOGLE_PLAY_STORE] === import_webapi_client.AppDistributionState.READY) {
              action = true;
            }
            break;
        }
        break;
    }
    if (action) {
      return /* @__PURE__ */ jsxDEV(StyledFloatingBox, { children: /* @__PURE__ */ jsxDEV(Card_default, { children: [
        /* @__PURE__ */ jsxDEV(CardContent_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: "There is a new app version available. Press update to download it!" }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
          lineNumber: 127,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
          lineNumber: 126,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(CardActions_default, { children: [
          /* @__PURE__ */ jsxDEV(
            Button_default,
            {
              variant: "contained",
              color: "primary",
              component: "a",
              target: "_blank",
              href: `/apps-latest-versions?distribution=${serviceProperties.frontDoorInfo.appDistribution}`,
              children: "Download"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
              lineNumber: 133,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Button_default,
            {
              variant: "outlined",
              color: "secondary",
              onClick: () => setDismiss(true),
              children: "Dismiss"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
              lineNumber: 142,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
        lineNumber: 125,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
        lineNumber: 124,
        columnNumber: 9
      }, this);
    }
  }
  if (releaseManifestResult.latestServerVersion !== globalProperties.version) {
    return /* @__PURE__ */ jsxDEV(StyledFloatingBox, { children: /* @__PURE__ */ jsxDEV(Card_default, { children: [
      /* @__PURE__ */ jsxDEV(CardContent_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: "There is an update available. Press update to trigger it!" }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
        lineNumber: 163,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
        lineNumber: 162,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(CardActions_default, { children: [
        /* @__PURE__ */ jsxDEV(
          Button_default,
          {
            variant: "contained",
            color: "primary",
            onClick: () => window.location.reload(),
            children: "Update"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
            lineNumber: 168,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          Button_default,
          {
            variant: "outlined",
            color: "secondary",
            onClick: () => setDismiss(true),
            children: "Dismiss"
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
            lineNumber: 175,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
        lineNumber: 167,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
      lineNumber: 161,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
      lineNumber: 160,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/release-update-widget.tsx",
    lineNumber: 189,
    columnNumber: 10
  }, this);
}
var StyledFloatingBox = styled_default(Box_default)({
  position: "fixed",
  bottom: 0,
  left: "calc(50% - 150px)",
  width: "300px",
  marginBottom: "1rem",
  padding: "1rem",
  borderRadius: "1rem"
});

// ../core/jupiter/core/search/components/search-widget.tsx
var import_react7 = __toESM(require_react(), 1);

// ../core/jupiter/core/common/sub/contacts/component/contacts-filter-picker.tsx
var import_react4 = __toESM(require_react(), 1);
function ContactsFilterPicker({
  allContacts,
  value,
  onChange,
  inputsEnabled,
  label,
  aloneOnLine = false,
  size = "medium"
}) {
  const isBigScreen = useBigScreen();
  const allContactsAsOptions = (0, import_react4.useMemo)(
    () => allContacts.map((contact) => contact.name),
    [allContacts]
  );
  const contactsByRefId = (0, import_react4.useMemo)(() => {
    const result = {};
    for (const contact of allContacts) {
      result[contact.ref_id] = contact;
    }
    return result;
  }, [allContacts]);
  const selectedNames = (0, import_react4.useMemo)(
    () => value.map((cid) => contactsByRefId[cid]?.name).filter((c) => Boolean(c)),
    [contactsByRefId, value]
  );
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: { position: "relative" }, children: /* @__PURE__ */ jsxDEV(
    Autocomplete_default,
    {
      disablePortal: true,
      multiple: true,
      limitTags: 2,
      filterSelectedOptions: true,
      freeSolo: false,
      options: allContactsAsOptions,
      readOnly: !inputsEnabled,
      disableCloseOnSelect: true,
      value: selectedNames,
      onChange: (_event, newNames) => {
        const next = newNames.map((n) => allContacts.find((c) => c.name === n)?.ref_id).filter((id) => Boolean(id));
        onChange(next);
      },
      renderOption: (liProps, option, { selected }) => /* @__PURE__ */ jsxDEV("li", { ...liProps, children: [
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
            fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-filter-picker.tsx",
            lineNumber: 71,
            columnNumber: 13
          },
          this
        ),
        option
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-filter-picker.tsx",
        lineNumber: 70,
        columnNumber: 11
      }, this),
      renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: label ?? "Contacts", size }, void 0, false, {
        fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-filter-picker.tsx",
        lineNumber: 81,
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
      fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-filter-picker.tsx",
      lineNumber: 53,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/contacts/component/contacts-filter-picker.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/common/sub/tags/component/tags-filter-picker.tsx
var import_react5 = __toESM(require_react(), 1);
function TagsFilterPicker({
  allTags,
  value,
  onChange,
  inputsEnabled,
  label,
  aloneOnLine = false,
  size = "medium"
}) {
  const isBigScreen = useBigScreen();
  const allTagsAsOptions = (0, import_react5.useMemo)(
    () => allTags.map((tag) => tag.name),
    [allTags]
  );
  const tagsByRefId = (0, import_react5.useMemo)(() => {
    const result = {};
    for (const tag of allTags) {
      result[tag.ref_id] = tag;
    }
    return result;
  }, [allTags]);
  const selectedNames = (0, import_react5.useMemo)(
    () => value.map((tid) => tagsByRefId[tid]?.name).filter((t) => Boolean(t)),
    [tagsByRefId, value]
  );
  return /* @__PURE__ */ jsxDEV(Box_default, { sx: { position: "relative" }, children: /* @__PURE__ */ jsxDEV(
    Autocomplete_default,
    {
      disablePortal: true,
      multiple: true,
      limitTags: 2,
      filterSelectedOptions: true,
      freeSolo: false,
      options: allTagsAsOptions,
      readOnly: !inputsEnabled,
      disableCloseOnSelect: true,
      value: selectedNames,
      onChange: (_event, newNames) => {
        const next = newNames.map((n) => allTags.find((t) => t.name === n)?.ref_id).filter((id) => Boolean(id));
        onChange(next);
      },
      renderOption: (liProps, option, { selected }) => /* @__PURE__ */ jsxDEV("li", { ...liProps, children: [
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
            fileName: "../core/jupiter/core/common/sub/tags/component/tags-filter-picker.tsx",
            lineNumber: 71,
            columnNumber: 13
          },
          this
        ),
        option
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/sub/tags/component/tags-filter-picker.tsx",
        lineNumber: 70,
        columnNumber: 11
      }, this),
      renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: label ?? "Tags", size }, void 0, false, {
        fileName: "../core/jupiter/core/common/sub/tags/component/tags-filter-picker.tsx",
        lineNumber: 81,
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
      fileName: "../core/jupiter/core/common/sub/tags/component/tags-filter-picker.tsx",
      lineNumber: 53,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/tags/component/tags-filter-picker.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/common/component/named-entity-tag-select.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);

// ../core/jupiter/core/named-entity-tag.ts
var import_webapi_client2 = __toESM(require_dist(), 1);
function entityTagName(entityTag) {
  switch (entityTag) {
    case import_webapi_client2.NamedEntityTag.OTHER:
      return "Other";
    case import_webapi_client2.NamedEntityTag.SCORE_LOG_ENTRY:
      return "Score Log Entry";
    case import_webapi_client2.NamedEntityTag.TODO_TASK:
      return "Todo Task";
    case import_webapi_client2.NamedEntityTag.HOME_TAB:
      return "Home Tab";
    case import_webapi_client2.NamedEntityTag.HOME_WIDGET:
      return "Home Widget";
    case import_webapi_client2.NamedEntityTag.WORKING_MEM:
      return "Working Mem";
    case import_webapi_client2.NamedEntityTag.TIME_PLAN:
      return "Time Plan";
    case import_webapi_client2.NamedEntityTag.TIME_PLAN_ACTIVITY:
      return "Time Plan Activity";
    case import_webapi_client2.NamedEntityTag.SCHEDULE_STREAM:
      return "Schedule Stream";
    case import_webapi_client2.NamedEntityTag.SCHEDULE_EXPORT:
      return "Schedule Export";
    case import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return "Schedule Event In Day";
    case import_webapi_client2.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return "Schedule Event Full Days";
    case import_webapi_client2.NamedEntityTag.SCHEDULE_EXTERNAL_SYNC_LOG:
      return "Schedule External Sync Log";
    case import_webapi_client2.NamedEntityTag.HABIT:
      return "Habit";
    case import_webapi_client2.NamedEntityTag.CHORE:
      return "Chore";
    case import_webapi_client2.NamedEntityTag.BIG_PLAN:
      return "Big Plan";
    case import_webapi_client2.NamedEntityTag.BIG_PLAN_MILESTONE:
      return "Big Plan Milestone";
    case import_webapi_client2.NamedEntityTag.JOURNAL:
      return "Journal";
    case import_webapi_client2.NamedEntityTag.CHAPTER:
      return "Chapter";
    case import_webapi_client2.NamedEntityTag.GOAL:
      return "Goal";
    case import_webapi_client2.NamedEntityTag.MILESTONE:
      return "Milestone";
    case import_webapi_client2.NamedEntityTag.VISION:
      return "Vision";
    case import_webapi_client2.NamedEntityTag.DOC:
      return "Doc";
    case import_webapi_client2.NamedEntityTag.DIR:
      return "Dir";
    case import_webapi_client2.NamedEntityTag.VACATION:
      return "Vacation";
    case import_webapi_client2.NamedEntityTag.ASPECT:
      return "Aspect";
    case import_webapi_client2.NamedEntityTag.SMART_LIST:
      return "Smart List";
    case import_webapi_client2.NamedEntityTag.SMART_LIST_ITEM:
      return "Smart List Item";
    case import_webapi_client2.NamedEntityTag.METRIC:
      return "Metric";
    case import_webapi_client2.NamedEntityTag.METRIC_ENTRY:
      return "Metric Entry";
    case import_webapi_client2.NamedEntityTag.PERSON:
      return "Person";
    case import_webapi_client2.NamedEntityTag.OCCASION:
      return "Occasion";
    case import_webapi_client2.NamedEntityTag.CIRCLE:
      return "Circle";
    case import_webapi_client2.NamedEntityTag.SLACK_TASK:
      return "Slack Task";
    case import_webapi_client2.NamedEntityTag.EMAIL_TASK:
      return "Email Task";
  }
}

// ../core/jupiter/core/common/component/named-entity-tag-select.tsx
function EntityTagSelect(props) {
  const allowedEntityTags = inferEntityTagsForEnabledFeatures(
    props.topLevelInfo.workspace,
    Object.values(import_webapi_client3.NamedEntityTag)
  );
  return /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      labelId: props.labelId,
      name: props.name,
      readOnly: props.readOnly,
      disabled: props.readOnly,
      multiple: true,
      defaultValue: props.defaultValue,
      value: props.value,
      onChange: (e) => {
        if (props.onChange === void 0) {
          return;
        }
        props.onChange(e.target.value);
      },
      renderValue: (selected) => /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexWrap: "wrap", gap: 0.5 }, children: selected.map((value) => /* @__PURE__ */ jsxDEV(Chip_default, { label: entityTagName(value) }, value, false, {
        fileName: "../core/jupiter/core/common/component/named-entity-tag-select.tsx",
        lineNumber: 44,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/named-entity-tag-select.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      label: props.label,
      children: allowedEntityTags.map((st) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: st, children: entityTagName(st) }, st, false, {
        fileName: "../core/jupiter/core/common/component/named-entity-tag-select.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/named-entity-tag-select.tsx",
      lineNumber: 26,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/search/components/search-tool-filter-fields.tsx
function SearchToolFilterFields(props) {
  return /* @__PURE__ */ jsxDEV(Stack_default, { useFlexGap: true, spacing: 2, children: [
    /* @__PURE__ */ jsxDEV(
      Stack_default,
      {
        useFlexGap: true,
        sx: { alignItems: "center" },
        direction: props.isBigScreen ? "row" : "column",
        spacing: 2,
        children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "limit", children: "Limit" }, void 0, false, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 51,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              OutlinedInput_default,
              {
                label: "Limit",
                name: "limit",
                type: "number",
                readOnly: !props.inputsEnabled,
                value: props.searchLimit,
                onChange: (e) => props.setSearchLimit(e.target.value)
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 52,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionResult, fieldName: "/limit" }, void 0, false, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 60,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
            lineNumber: 50,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(
              FormControlLabel_default,
              {
                control: /* @__PURE__ */ jsxDEV(
                  Switch_default,
                  {
                    name: "includeArchived",
                    readOnly: !props.inputsEnabled,
                    checked: props.searchIncludeArchived,
                    onChange: (e) => props.setSearchIncludeArchived(e.target.checked)
                  },
                  void 0,
                  false,
                  {
                    fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                    lineNumber: 66,
                    columnNumber: 15
                  },
                  this
                ),
                label: "Include Archived"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 64,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionResult,
                fieldName: "/include_archived"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 77,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
            lineNumber: 63,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterEntityTags", children: "Filter Entities" }, void 0, false, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 84,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              EntityTagSelect,
              {
                topLevelInfo: props.topLevelInfo,
                labelId: "filterEntityTags",
                label: "Filter Entities",
                name: "filterEntityTags",
                readOnly: !props.inputsEnabled,
                value: props.searchFilterEntityTags,
                onChange: (e) => props.setSearchFilterEntityTags(e)
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 85,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              FieldError,
              {
                actionResult: props.actionResult,
                fieldName: "/filter_entity_tags"
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 94,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
            lineNumber: 83,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
        lineNumber: 44,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(FieldError, { actionResult: props.actionResult, fieldName: "/offset" }, void 0, false, {
      fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Stack_default,
      {
        spacing: 2,
        useFlexGap: true,
        direction: props.isBigScreen ? "row" : "column",
        children: [
          /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, sx: { flexGrow: 1 }, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterCreatedTimeAfter", shrink: true, children: "Created After" }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 110,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  type: "date",
                  notched: true,
                  label: "Created After",
                  value: props.searchFilterCreatedTimeAfter,
                  onChange: (e) => props.setSearchFilterCreatedTimeAfter(e.target.value),
                  name: "filterCreatedTimeAfter",
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 113,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionResult,
                  fieldName: "/filter_created_time_after"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 126,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 109,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterCreatedTimeBefore", shrink: true, children: "Created Before" }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 133,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  type: "date",
                  notched: true,
                  label: "Created Before",
                  value: props.searchFilterCreatedTimeBefore,
                  onChange: (e) => props.setSearchFilterCreatedTimeBefore(e.target.value),
                  name: "filterCreatedTimeBefore",
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 136,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionResult,
                  fieldName: "/filter_created_time_before"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 149,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 132,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
            lineNumber: 108,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, sx: { flexGrow: 1 }, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterLastModifiedTimeAfter", shrink: true, children: "Last Modified After" }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 158,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  type: "date",
                  notched: true,
                  label: "Last Modified After",
                  value: props.searchFilterLastModifiedTimeAfter,
                  onChange: (e) => props.setSearchFilterLastModifiedTimeAfter(e.target.value),
                  name: "filterLastModifiedTimeAfter",
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 161,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionResult,
                  fieldName: "/filter_last_modified_time_after"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 174,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 157,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterLastModifiedTimeBefore", shrink: true, children: "Last Modified Before" }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 181,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  type: "date",
                  notched: true,
                  label: "Last Modified Before",
                  value: props.searchFilterLastModifiedTimeBefore,
                  onChange: (e) => props.setSearchFilterLastModifiedTimeBefore(e.target.value),
                  name: "filterLastModifiedTimeBefore",
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 184,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionResult,
                  fieldName: "/filter_last_modified_time_before"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 197,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 180,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
            lineNumber: 156,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, sx: { flexGrow: 1 }, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterArchivedTimeAfter", shrink: true, children: "Archived After" }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 206,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  type: "date",
                  notched: true,
                  label: "Archived After",
                  value: props.searchFilterArchivedTimeAfter,
                  onChange: (e) => props.setSearchFilterArchivedTimeAfter(e.target.value),
                  name: "filterArchivedTimeAfter",
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 209,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionResult,
                  fieldName: "/filter_archived_time_after"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 222,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 205,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "filterArchivedTimeBefore", shrink: true, children: "Archived Before" }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                lineNumber: 229,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                OutlinedInput_default,
                {
                  type: "date",
                  notched: true,
                  label: "Archived Before",
                  value: props.searchFilterArchivedTimeBefore,
                  onChange: (e) => props.setSearchFilterArchivedTimeBefore(e.target.value),
                  name: "filterArchivedTimeBefore",
                  readOnly: !props.inputsEnabled,
                  disabled: !props.inputsEnabled
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 232,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                FieldError,
                {
                  actionResult: props.actionResult,
                  fieldName: "/filter_archived_time_before"
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
                  lineNumber: 245,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
              lineNumber: 228,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
            lineNumber: 204,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
        lineNumber: 103,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/search/components/search-tool-filter-fields.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/common/component/search-link.tsx
var import_webapi_client4 = __toESM(require_dist(), 1);
function SearchMatchLink({
  match,
  today,
  hideModifiedTime,
  removed
}) {
  const summary = match.summary;
  const nameLine = match.name_snippet.length > 0 ? match.name_snippet : summary.name;
  const commonSequence = /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(MatchSnippet, { snippet: nameLine }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/search-link.tsx",
      lineNumber: 29,
      columnNumber: 7
    }, this),
    match.note_snippet.length > 0 && /* @__PURE__ */ jsxDEV(
      Box_default,
      {
        component: "div",
        sx: {
          typography: "body2",
          color: "text.secondary",
          mt: 0.5,
          pl: 0.25
        },
        children: /* @__PURE__ */ jsxDEV(MatchSnippet, { snippet: match.note_snippet }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 40,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 31,
        columnNumber: 9
      },
      this
    ),
    summary.archived && summary.archived_time && /* @__PURE__ */ jsxDEV(
      TimeDiffTag,
      {
        today,
        labelPrefix: "Archived",
        collectionTime: summary.archived_time
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 44,
        columnNumber: 9
      },
      this
    ),
    !summary.archived && summary.last_modified_time && !hideModifiedTime && /* @__PURE__ */ jsxDEV(
      TimeDiffTag,
      {
        today,
        labelPrefix: "Modified",
        collectionTime: summary.last_modified_time
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 51,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/search-link.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this);
  if (removed) {
    return /* @__PURE__ */ jsxDEV(EntityFakeLink, { children: [
      /* @__PURE__ */ jsxDEV(SlimChip, { label: "Removed Entity", color: "primary" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      commonSequence
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/search-link.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this);
  }
  if (summary.entity_tag === import_webapi_client4.NamedEntityTag.TODO_TASK) {
    return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/todos/${summary.ref_id}`, children: [
      /* @__PURE__ */ jsxDEV(SlimChip, { label: "Todo Task", color: "primary" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 72,
        columnNumber: 9
      }, this),
      commonSequence
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/search-link.tsx",
      lineNumber: 71,
      columnNumber: 7
    }, this);
  }
  switch (summary.entity_tag) {
    case import_webapi_client4.NamedEntityTag.SCORE_LOG_ENTRY:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: "/nowhere", block: true, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Score Log Entry", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 82,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.WORKING_MEM:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/working-mem`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Working Mem", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 89,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 88,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.TIME_PLAN:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/time-plans/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Time Plan", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 96,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.TIME_PLAN_ACTIVITY:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/time-plans/no-parent/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Time Plan Activity", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 105,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 102,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.SCHEDULE_STREAM:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/stream/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Stream", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 114,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 111,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.SCHEDULE_EXPORT:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/export/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Export", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 123,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 120,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/event-in-day/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Event In Day", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 132,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 129,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/event-full-days/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Event Full Days", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 141,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 138,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.SCHEDULE_EXTERNAL_SYNC_LOG:
      return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 146,
        columnNumber: 14
      }, this);
    case import_webapi_client4.NamedEntityTag.HABIT:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/habits/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Habit", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 150,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 149,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.CHORE:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/chores/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Chore", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 157,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 156,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.BIG_PLAN:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/big-plans/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Big Plan", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 164,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 163,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.JOURNAL:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/journals/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Journal", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 170,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.DIR:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/docs/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Folder", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 178,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 177,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.DOC:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/docs/no-parent/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Doc", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 185,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 184,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.VACATION:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/vacations/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Vacation", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 192,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 191,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.ASPECT:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/aspects/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Aspect", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 199,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 198,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.CHAPTER:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/chapters/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Chapter", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 205,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.GOAL:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/goals/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Goal", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 212,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.MILESTONE:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/life-plan/milestones/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Milestone", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 222,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 219,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.VISION:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/visions/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Vision", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 229,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 228,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.SMART_LIST:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/smart-lists/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Smart List", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 236,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 235,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.SMART_LIST_ITEM:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/smart-lists/no-parent/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Smart List Item", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 245,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 242,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.METRIC:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/metrics/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Metric", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 252,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 251,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.METRIC_ENTRY:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/metrics/no-parent/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Metric Entry", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 259,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 258,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.PERSON:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/prm/persons/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Persons", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 266,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 265,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.CIRCLE:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/prm/circles/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Circle", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 273,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 272,
        columnNumber: 9
      }, this);
    case import_webapi_client4.NamedEntityTag.SLACK_TASK:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/push-integrations/slack-tasks/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Slack Tasks", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 282,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 279,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client4.NamedEntityTag.EMAIL_TASK:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/push-integrations/email-tasks/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Email Tasks", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/search-link.tsx",
              lineNumber: 291,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/search-link.tsx",
          lineNumber: 288,
          columnNumber: 9
        },
        this
      );
  }
}
function MatchSnippet({ snippet }) {
  const matchSnippetArr = [];
  let currentStr = "";
  let bold = false;
  for (let i = 0; i < snippet.length; i++) {
    if (bold === false && snippet.startsWith("[found]", i)) {
      if (currentStr.length > 0) {
        matchSnippetArr.push({
          text: currentStr,
          bold: false
        });
      }
      i += 6;
      currentStr = "";
      bold = true;
    } else if (bold === true && snippet.startsWith("[/found]", i)) {
      if (currentStr.length > 0) {
        matchSnippetArr.push({
          text: currentStr,
          bold: true
        });
      }
      i += 7;
      currentStr = "";
      bold = false;
    } else {
      currentStr += snippet[i];
    }
  }
  if (currentStr.length > 0) {
    matchSnippetArr.push({
      text: currentStr,
      bold
    });
  }
  return /* @__PURE__ */ jsxDEV("div", { children: matchSnippetArr.map((item, idx) => {
    if (item.bold) {
      return /* @__PURE__ */ jsxDEV("strong", { children: item.text }, idx, false, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 344,
        columnNumber: 18
      }, this);
    } else {
      return /* @__PURE__ */ jsxDEV("span", { children: item.text }, idx, false, {
        fileName: "../core/jupiter/core/common/component/search-link.tsx",
        lineNumber: 346,
        columnNumber: 18
      }, this);
    }
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/search-link.tsx",
    lineNumber: 341,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/search/components/search-tool-results.tsx
function SearchToolResults(props) {
  const { total_match_count: totalMatchCount, matches } = props.result;
  const startIdx = props.resultOffset + 1;
  const endIdx = props.resultOffset + matches.length;
  const summaryLine = matches.length === 0 ? `No matches (${totalMatchCount} total).` : totalMatchCount > 0 ? `Showing ${startIdx}\u2013${endIdx} of ${totalMatchCount} matches` : `Showing ${matches.length} matches`;
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: { width: "100%" },
      onClickCapture: (e) => {
        if (props.onNavigateFromResult === void 0) {
          return;
        }
        const t = e.target;
        if (t?.closest("a[href]")) {
          props.onNavigateFromResult();
        }
      },
      children: /* @__PURE__ */ jsxDEV(EntityStack2, { children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 1, children: [
          /* @__PURE__ */ jsxDEV(Typography_default, { children: summaryLine }, void 0, false, {
            fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
            lineNumber: 52,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            SearchResultPages,
            {
              totalMatchCount,
              pageSize: props.pageSize,
              offset: props.resultOffset,
              onOffsetChange: props.onResultOffsetChange
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
              lineNumber: 53,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
          lineNumber: 51,
          columnNumber: 9
        }, this),
        matches.map((match) => {
          return /* @__PURE__ */ jsxDEV(
            EntityCard,
            {
              showAsArchived: match.summary.archived,
              children: /* @__PURE__ */ jsxDEV(SearchMatchLink, { today: props.topLevelInfo.today, match }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
                lineNumber: 66,
                columnNumber: 15
              }, this)
            },
            `${match.summary.entity_tag}:${match.summary.ref_id}`,
            false,
            {
              fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
              lineNumber: 62,
              columnNumber: 13
            },
            this
          );
        })
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
        lineNumber: 50,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
      lineNumber: 38,
      columnNumber: 5
    },
    this
  );
}
function SearchResultPages(props) {
  const pageSize = Math.max(1, props.pageSize);
  const pageCount = Math.max(1, Math.ceil(props.totalMatchCount / pageSize));
  if (pageCount <= 1) {
    return null;
  }
  const currentPage = Math.floor(props.offset / pageSize);
  const shouldShowPage = Array(pageCount).fill(false);
  shouldShowPage[0] = true;
  shouldShowPage[pageCount - 1] = true;
  if (currentPage - 3 >= 0)
    shouldShowPage[currentPage - 3] = true;
  if (currentPage - 2 >= 0)
    shouldShowPage[currentPage - 2] = true;
  if (currentPage - 1 >= 0)
    shouldShowPage[currentPage - 1] = true;
  shouldShowPage[currentPage] = true;
  if (currentPage + 1 < pageCount)
    shouldShowPage[currentPage + 1] = true;
  if (currentPage + 2 < pageCount)
    shouldShowPage[currentPage + 2] = true;
  if (currentPage + 3 < pageCount)
    shouldShowPage[currentPage + 3] = true;
  const buttons = [];
  for (let i = 0; i < pageCount; i++) {
    if (shouldShowPage[i]) {
      buttons.push(
        /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: i, children: i + 1 }, i + 1, false, {
          fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
          lineNumber: 104,
          columnNumber: 9
        }, this)
      );
    } else if (i > 0 && shouldShowPage[i - 1]) {
      buttons.push(
        /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: `ellipsis-${i}`, disabled: true, children: "\u2026" }, `ellipsis-${i}`, false, {
          fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
          lineNumber: 110,
          columnNumber: 9
        }, this)
      );
    }
  }
  return /* @__PURE__ */ jsxDEV(
    ToggleButtonGroup_default,
    {
      size: "small",
      exclusive: true,
      value: currentPage,
      onChange: (_, v) => {
        if (typeof v === "number") {
          props.onOffsetChange(v * pageSize);
        }
      },
      sx: { flexWrap: "wrap", alignSelf: "flex-start" },
      children: buttons
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/search/components/search-tool-results.tsx",
      lineNumber: 118,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/search/components/search-widget.tsx
var WORKSPACE_SEARCH_DEFAULT_LIMIT = 30;
var WORKSPACE_SEARCH_INSTANT_ROUTE = "/app/workspace/search-instant";
var SEARCH_INPUT_DEBOUNCE_MS = 300;
function SearchWidget({ allTags, allContacts }) {
  const topLevelInfo = (0, import_react7.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const searchFetcher = useFetcher();
  const searchInputRef = (0, import_react7.useRef)(null);
  const [open, setOpen] = (0, import_react7.useState)(false);
  const [filtersOpen, setFiltersOpen] = (0, import_react7.useState)(false);
  const [searchQuery, setSearchQuery] = (0, import_react7.useState)("");
  const [searchLimit, setSearchLimit] = (0, import_react7.useState)(void 0);
  const [searchOffset, setSearchOffset] = (0, import_react7.useState)(0);
  const [searchIncludeArchived, setSearchIncludeArchived] = (0, import_react7.useState)(false);
  const [searchFilterEntityTags, setSearchFilterEntityTags] = (0, import_react7.useState)([]);
  const [searchFilterTagRefIds, setSearchFilterTagRefIds] = (0, import_react7.useState)([]);
  const [searchFilterContactRefIds, setSearchFilterContactRefIds] = (0, import_react7.useState)([]);
  const [searchFilterCreatedTimeAfter, setSearchFilterCreatedTimeAfter] = (0, import_react7.useState)(void 0);
  const [searchFilterCreatedTimeBefore, setSearchFilterCreatedTimeBefore] = (0, import_react7.useState)(void 0);
  const [
    searchFilterLastModifiedTimeAfter,
    setSearchFilterLastModifiedTimeAfter
  ] = (0, import_react7.useState)(void 0);
  const [
    searchFilterLastModifiedTimeBefore,
    setSearchFilterLastModifiedTimeBefore
  ] = (0, import_react7.useState)(void 0);
  const [searchFilterArchivedTimeAfter, setSearchFilterArchivedTimeAfter] = (0, import_react7.useState)(void 0);
  const [searchFilterArchivedTimeBefore, setSearchFilterArchivedTimeBefore] = (0, import_react7.useState)(void 0);
  (0, import_react7.useEffect)(() => {
    if (!open) {
      return;
    }
    const handle = window.setTimeout(() => {
      searchFetcher.load(
        buildSearchInstantUrl({
          searchQuery,
          searchLimit,
          searchOffset,
          searchIncludeArchived,
          searchFilterEntityTags,
          searchFilterTagRefIds,
          searchFilterContactRefIds,
          searchFilterCreatedTimeAfter,
          searchFilterCreatedTimeBefore,
          searchFilterLastModifiedTimeAfter,
          searchFilterLastModifiedTimeBefore,
          searchFilterArchivedTimeAfter,
          searchFilterArchivedTimeBefore
        })
      );
    }, SEARCH_INPUT_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [
    open,
    searchQuery,
    searchLimit,
    searchOffset,
    searchIncludeArchived,
    searchFilterEntityTags,
    searchFilterTagRefIds,
    searchFilterContactRefIds,
    searchFilterCreatedTimeAfter,
    searchFilterCreatedTimeBefore,
    searchFilterLastModifiedTimeAfter,
    searchFilterLastModifiedTimeBefore,
    searchFilterArchivedTimeAfter,
    searchFilterArchivedTimeBefore
  ]);
  (0, import_react7.useEffect)(() => {
    if (!open) {
      return;
    }
    const id = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);
  const handleClose = () => {
    setOpen(false);
    setFiltersOpen(false);
    setSearchOffset(0);
  };
  const inputsEnabled = searchFetcher.state === "idle";
  const instantAction = searchFetcher.data;
  const limitAsked = instantAction !== void 0 && isNoErrorSomeData(instantAction) && instantAction.data.limit ? parseInt(instantAction.data.limit, 10) : WORKSPACE_SEARCH_DEFAULT_LIMIT;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      IconButton_default,
      {
        id: "open-instant-search",
        size: "large",
        color: "inherit",
        onClick: () => setOpen(true),
        "aria-label": "Open search",
        children: /* @__PURE__ */ jsxDEV(Search_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/search/components/search-widget.tsx",
          lineNumber: 187,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
        lineNumber: 180,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Dialog_default,
      {
        open,
        onClose: handleClose,
        fullWidth: true,
        maxWidth: false,
        slotProps: {
          paper: {
            elevation: 8,
            sx: {
              position: "fixed",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              m: { xs: "0.5rem", sm: "2rem" },
              width: {
                xs: "calc(100vw - 1rem)",
                sm: "min(56rem, calc(100vw - 4rem))"
              },
              height: {
                xs: "calc(100 * var(--vh, 1vh) - 1rem)",
                sm: "min(80vh, calc(100 * var(--vh, 1vh) - 4rem))"
              }
            }
          }
        },
        children: /* @__PURE__ */ jsxDEV(
          Box_default,
          {
            sx: {
              position: "relative",
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              flex: 1
            },
            children: [
              searchFetcher.state !== "idle" && /* @__PURE__ */ jsxDEV(
                LinearProgress_default,
                {
                  sx: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1
                  }
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                  lineNumber: 227,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                Stack_default,
                {
                  direction: { xs: "column", sm: "row" },
                  spacing: 1,
                  alignItems: { xs: "stretch", sm: "center" },
                  sx: { mb: 1 },
                  children: [
                    /* @__PURE__ */ jsxDEV(
                      TextField_default,
                      {
                        inputRef: searchInputRef,
                        fullWidth: true,
                        size: "small",
                        label: "Query",
                        placeholder: "Search\u2026",
                        value: searchQuery,
                        onChange: (e) => {
                          setSearchOffset(0);
                          setSearchQuery(e.target.value);
                        },
                        InputProps: {
                          startAdornment: /* @__PURE__ */ jsxDEV(InputAdornment_default, { position: "start", children: /* @__PURE__ */ jsxDEV(Search_default, { fontSize: "small", color: "action" }, void 0, false, {
                            fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                            lineNumber: 259,
                            columnNumber: 21
                          }, this) }, void 0, false, {
                            fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                            lineNumber: 258,
                            columnNumber: 19
                          }, this)
                        }
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                        lineNumber: 245,
                        columnNumber: 13
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      Box_default,
                      {
                        sx: {
                          minWidth: { sm: 180 },
                          maxWidth: { sm: 280 },
                          flex: "1 1 auto"
                        },
                        children: /* @__PURE__ */ jsxDEV(
                          TagsFilterPicker,
                          {
                            allTags,
                            value: searchFilterTagRefIds,
                            onChange: (next) => {
                              setSearchOffset(0);
                              setSearchFilterTagRefIds(next);
                            },
                            inputsEnabled,
                            label: "Tags",
                            size: "small"
                          },
                          void 0,
                          false,
                          {
                            fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                            lineNumber: 271,
                            columnNumber: 15
                          },
                          this
                        )
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                        lineNumber: 264,
                        columnNumber: 13
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      Box_default,
                      {
                        sx: {
                          minWidth: { sm: 180 },
                          maxWidth: { sm: 280 },
                          flex: "1 1 auto"
                        },
                        children: /* @__PURE__ */ jsxDEV(
                          ContactsFilterPicker,
                          {
                            allContacts,
                            value: searchFilterContactRefIds,
                            onChange: (next) => {
                              setSearchOffset(0);
                              setSearchFilterContactRefIds(next);
                            },
                            inputsEnabled,
                            label: "Contacts",
                            size: "small"
                          },
                          void 0,
                          false,
                          {
                            fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                            lineNumber: 290,
                            columnNumber: 15
                          },
                          this
                        )
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                        lineNumber: 283,
                        columnNumber: 13
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      IconButton_default,
                      {
                        id: "instant-search-filters",
                        "aria-label": "Search filters",
                        color: filtersOpen ? "primary" : "default",
                        onClick: () => setFiltersOpen((s) => !s),
                        children: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
                          fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                          lineNumber: 308,
                          columnNumber: 15
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                        lineNumber: 302,
                        columnNumber: 13
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      IconButton_default,
                      {
                        id: "instant-search-close",
                        "aria-label": "Close search",
                        onClick: handleClose,
                        children: /* @__PURE__ */ jsxDEV(Close_default, {}, void 0, false, {
                          fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                          lineNumber: 315,
                          columnNumber: 15
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                        lineNumber: 310,
                        columnNumber: 13
                      },
                      this
                    )
                  ]
                },
                void 0,
                true,
                {
                  fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                  lineNumber: 239,
                  columnNumber: 11
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: instantAction }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                lineNumber: 319,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV(Collapse_default, { in: filtersOpen, children: /* @__PURE__ */ jsxDEV(Box_default, { sx: { py: 1, maxHeight: "40vh", overflow: "auto" }, children: /* @__PURE__ */ jsxDEV(
                SearchToolFilterFields,
                {
                  topLevelInfo,
                  isBigScreen,
                  inputsEnabled,
                  actionResult: instantAction,
                  searchLimit,
                  setSearchLimit: (v) => {
                    setSearchOffset(0);
                    setSearchLimit(v);
                  },
                  searchIncludeArchived,
                  setSearchIncludeArchived: (v) => {
                    setSearchOffset(0);
                    setSearchIncludeArchived(v);
                  },
                  searchFilterEntityTags,
                  setSearchFilterEntityTags: (v) => {
                    setSearchOffset(0);
                    setSearchFilterEntityTags(v);
                  },
                  searchFilterCreatedTimeAfter,
                  setSearchFilterCreatedTimeAfter: (v) => {
                    setSearchOffset(0);
                    setSearchFilterCreatedTimeAfter(v);
                  },
                  searchFilterCreatedTimeBefore,
                  setSearchFilterCreatedTimeBefore: (v) => {
                    setSearchOffset(0);
                    setSearchFilterCreatedTimeBefore(v);
                  },
                  searchFilterLastModifiedTimeAfter,
                  setSearchFilterLastModifiedTimeAfter: (v) => {
                    setSearchOffset(0);
                    setSearchFilterLastModifiedTimeAfter(v);
                  },
                  searchFilterLastModifiedTimeBefore,
                  setSearchFilterLastModifiedTimeBefore: (v) => {
                    setSearchOffset(0);
                    setSearchFilterLastModifiedTimeBefore(v);
                  },
                  searchFilterArchivedTimeAfter,
                  setSearchFilterArchivedTimeAfter: (v) => {
                    setSearchOffset(0);
                    setSearchFilterArchivedTimeAfter(v);
                  },
                  searchFilterArchivedTimeBefore,
                  setSearchFilterArchivedTimeBefore: (v) => {
                    setSearchOffset(0);
                    setSearchFilterArchivedTimeBefore(v);
                  }
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                  lineNumber: 323,
                  columnNumber: 15
                },
                this
              ) }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                lineNumber: 322,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                lineNumber: 321,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV(Box_default, { sx: { flex: 1, minHeight: 0, overflow: "auto", pt: 1 }, children: instantAction !== void 0 && isNoErrorSomeData(instantAction) && instantAction.data.result && /* @__PURE__ */ jsxDEV(
                SearchToolResults,
                {
                  topLevelInfo,
                  result: instantAction.data.result,
                  pageSize: limitAsked,
                  resultOffset: searchOffset,
                  onResultOffsetChange: setSearchOffset,
                  onNavigateFromResult: handleClose
                },
                void 0,
                false,
                {
                  fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                  lineNumber: 385,
                  columnNumber: 17
                },
                this
              ) }, void 0, false, {
                fileName: "../core/jupiter/core/search/components/search-widget.tsx",
                lineNumber: 381,
                columnNumber: 11
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/search/components/search-widget.tsx",
            lineNumber: 216,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/search/components/search-widget.tsx",
        lineNumber: 190,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/search/components/search-widget.tsx",
    lineNumber: 179,
    columnNumber: 5
  }, this);
}
function buildSearchInstantUrl(state) {
  const params = new URLSearchParams();
  const q = state.searchQuery.trim();
  if (q !== "") {
    params.set("query", q);
  }
  if (state.searchLimit !== void 0 && state.searchLimit !== "") {
    params.set("limit", state.searchLimit);
  }
  if (state.searchOffset > 0) {
    params.set("offset", String(state.searchOffset));
  }
  if (state.searchIncludeArchived) {
    params.set("includeArchived", "on");
  }
  if (state.searchFilterEntityTags.length > 0) {
    params.set("filterEntityTags", state.searchFilterEntityTags.join(","));
  }
  if (state.searchFilterTagRefIds.length > 0) {
    params.set("filterTagRefIds", state.searchFilterTagRefIds.join(","));
  }
  if (state.searchFilterContactRefIds.length > 0) {
    params.set(
      "filterContactRefIds",
      state.searchFilterContactRefIds.join(",")
    );
  }
  if (state.searchFilterCreatedTimeAfter) {
    params.set("filterCreatedTimeAfter", state.searchFilterCreatedTimeAfter);
  }
  if (state.searchFilterCreatedTimeBefore) {
    params.set("filterCreatedTimeBefore", state.searchFilterCreatedTimeBefore);
  }
  if (state.searchFilterLastModifiedTimeAfter) {
    params.set(
      "filterLastModifiedTimeAfter",
      state.searchFilterLastModifiedTimeAfter
    );
  }
  if (state.searchFilterLastModifiedTimeBefore) {
    params.set(
      "filterLastModifiedTimeBefore",
      state.searchFilterLastModifiedTimeBefore
    );
  }
  if (state.searchFilterArchivedTimeAfter) {
    params.set("filterArchivedTimeAfter", state.searchFilterArchivedTimeAfter);
  }
  if (state.searchFilterArchivedTimeBefore) {
    params.set(
      "filterArchivedTimeBefore",
      state.searchFilterArchivedTimeBefore
    );
  }
  const qs = params.toString();
  return qs.length > 0 ? `${WORKSPACE_SEARCH_INSTANT_ROUTE}?${qs}` : WORKSPACE_SEARCH_INSTANT_ROUTE;
}

// ../core/jupiter/core/infra/component/sidebar.tsx
var import_react8 = __toESM(require_react(), 1);
var import_webapi_client5 = __toESM(require_dist(), 1);
var BIG_SCREEN_WIDTH = "240px";
var BIG_SCREEN_ANIMATION_START = "-240px";
var BIG_SCREEN_ANIMATION_END = "0px";
var SMALL_SCREEN_WIDTH = "100%";
var SMALL_SCREEN_ANIMATION_START = "-100vw";
var SMALL_SCREEN_ANIMATION_END = "0vw";
function Sidebar(props) {
  const topLevelInfo = (0, import_react8.useContext)(TopLevelInfoContext);
  function onClickNavigation() {
    if (!props.onClickForNavigation) {
      return;
    }
    props.onClickForNavigation();
  }
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(AnimatePresence, { children: props.showSidebar && /* @__PURE__ */ jsxDEV(
    StyledMotionDrawer,
    {
      initial: {
        x: isBigScreen ? BIG_SCREEN_ANIMATION_START : SMALL_SCREEN_ANIMATION_START
      },
      animate: {
        x: isBigScreen ? BIG_SCREEN_ANIMATION_END : SMALL_SCREEN_ANIMATION_END
      },
      exit: {
        x: isBigScreen ? BIG_SCREEN_ANIMATION_START : SMALL_SCREEN_ANIMATION_START
      },
      transition: { type: "spring", bounce: 0, duration: 0.2 },
      isBigScreen,
      children: [
        /* @__PURE__ */ jsxDEV(Toolbar_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(List_default, { children: [
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F3E0}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 76,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Home" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 77,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 71,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 70,
            columnNumber: 13
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.TODO_TASK
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/todos",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u2705" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 91,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Todos" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 92,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 86,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 85,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.WORKING_MEM
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/working-mem",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F9E0}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 107,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Working Mem" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 108,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 102,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 101,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.TIME_PLANS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/time-plans",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F3ED}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 123,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Time Plans" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 124,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 118,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 117,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.SCHEDULE
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/calendar",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4C5}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 139,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Calendar" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 140,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 134,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 133,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.HABITS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/habits",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4AA}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 155,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Habits" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 156,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 150,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 149,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.CHORES
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/chores",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u267B\uFE0F" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 171,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Chores" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 172,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 166,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 165,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.BIG_PLANS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/big-plans",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F30D}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 187,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Big Plans" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 188,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 182,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 181,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.JOURNALS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/journals",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4D3}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 203,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Journals" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 204,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 198,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 197,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.DOCS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/docs/root-redirect",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F5D2}\uFE0F" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 219,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Docs" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 220,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 214,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 213,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.VACATIONS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/vacations",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F334}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 235,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Vacations" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 236,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 230,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 229,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.LIFE_PLAN
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/life-plan",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4A1}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 251,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Life Plan" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 252,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 246,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 245,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.SMART_LISTS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/smart-lists",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F3DB}\uFE0F" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 267,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Smart Lists" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 268,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 262,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 261,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.METRICS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/metrics",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4C8}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 283,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Metrics" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 284,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 278,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 277,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.PRM
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/prm/persons",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F468}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 299,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "PRM" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 300,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 294,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 293,
            columnNumber: 15
          }, this),
          (isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.SLACK_TASKS
          ) || isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.EMAIL_TASKS
          )) && /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Push Integrations", size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 312,
            columnNumber: 21
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.SLACK_TASKS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/push-integrations/slack-tasks",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4AC}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 324,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Slack Tasks" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 325,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 319,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 318,
            columnNumber: 15
          }, this),
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            import_webapi_client5.WorkspaceFeature.EMAIL_TASKS
          ) && /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/push-integrations/email-tasks",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4E7}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 340,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Email Tasks" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 341,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 335,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 334,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Tools", size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 346,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/tools/report",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4CA}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 354,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Report" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 355,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 349,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 348,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/tools/pomodoro",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F96B}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 365,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Pomodoro Timer" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 366,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 360,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 359,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Core", size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 370,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/core/inbox-tasks",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4E5}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 378,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Inbox Tasks" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 379,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 373,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 372,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/core/tags",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F3F7}\uFE0F" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 389,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Tags" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 390,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 384,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 383,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/core/contacts",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F465}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 400,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Contacts" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 401,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 395,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 394,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/core/notes",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4DD}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 411,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Notes" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 412,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 406,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 405,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/mutation-history",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4DC}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 422,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Mutation History" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 423,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 417,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 416,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Process", size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 427,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/tools/gen",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F52E}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 435,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Generate Tasks" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 436,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 430,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 429,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/tools/gc",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F5D1}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 446,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Garbage Collect" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 447,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 441,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 440,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/tools/stats",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: "\u{1F4CA}" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 457,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "Compute Stats" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 458,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 452,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 451,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Explore", size: "small" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 462,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(ListItem_default, { disablePadding: true, children: /* @__PURE__ */ jsxDEV(
            ListItemButton_default,
            {
              to: "/app/workspace/settings",
              component: Link,
              onClick: onClickNavigation,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(Settings_default, {}, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 471,
                  columnNumber: 19
                }, this) }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 470,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(ListItemText_default, { primary: "More Features" }, void 0, false, {
                  fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
                  lineNumber: 473,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
              lineNumber: 465,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
            lineNumber: 464,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
      lineNumber: 49,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/sidebar.tsx",
    lineNumber: 47,
    columnNumber: 5
  }, this);
}
var StyledMotionDrawer = styled_default(motion.div)(
  ({ theme, isBigScreen }) => `
    position: fixed;
    top: 0px;
    width: ${isBigScreen ? BIG_SCREEN_WIDTH : SMALL_SCREEN_WIDTH};
    z-index: ${theme.zIndex.drawer};
    padding-top: env(safe-area-inset-top);
    height: 100%;
    overflow-x: auto;
    overflow-y: scroll;
    background-color: ${theme.palette.background.paper};
    border-right: 1px solid rgba(0, 0, 0, 0.12);

    &::-webkit-scrollbar {
      display: none;
    }
  `
);

// ../core/jupiter/core/infra/component/top-level-info-provider.tsx
var import_react10 = __toESM(require_react(), 1);
var REFRESH_TODAY_MS = 1e3;
function TopLevelInfoProvider(props) {
  const rightNow = DateTime.local({ zone: props.user.timezone });
  const [today, setToday] = (0, import_react10.useState)(rightNow.toISODate());
  (0, import_react10.useEffect)(() => {
    const timeout = setInterval(() => {
      const rightNow2 = DateTime.local({ zone: props.user.timezone });
      setToday(rightNow2.toISODate());
    }, REFRESH_TODAY_MS);
    return () => {
      clearInterval(timeout);
    };
  }, [props.user.timezone]);
  const topLevelInfo = {
    today,
    userFeatureFlagControls: props.userFeatureFlagControls,
    workspaceFeatureFlagControls: props.workspaceFeatureFlagControls,
    user: props.user,
    userScoreOverview: props.userScoreOverview,
    workspace: props.workspace
  };
  return /* @__PURE__ */ jsxDEV(TopLevelInfoContext.Provider, { value: topLevelInfo, children: props.children }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/top-level-info-provider.tsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
}

// app/routes/app/workspace.tsx
var import_api_clients = __toESM(require_api_clients());

// app/styles/editorjs-tweaks.css
var editorjs_tweaks_default = "/build/_assets/editorjs-tweaks-5WLB5D32.css";

// app/routes/app/workspace.tsx
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace.tsx"
  );
}
var WorkspaceAppBarTrailing = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flexShrink: 0,
  marginLeft: "auto",
  [theme.breakpoints.up("sm")]: {
    marginLeft: 0
  }
}));
_c = WorkspaceAppBarTrailing;
var links = () => [{
  rel: "stylesheet",
  href: editorjs_tweaks_default
}];
var shouldRevalidate = ({
  nextUrl
}) => {
  return nextUrl.searchParams.has("invalidateTopLevel");
};
function Workspace() {
  _s();
  const outlet = useOutlet();
  const loaderData = useLoaderDataSafeForAnimation();
  const isBigScreen = useBigScreen();
  const [showSidebar, setShowSidebar] = (0, import_react12.useState)(isBigScreen);
  const scoreAction = useScoreActionSingleton();
  const globalProperties = (0, import_react12.useContext)(GlobalPropertiesContext);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = (0, import_react12.useState)(null);
  const accountMenuOpen = Boolean(accountMenuAnchorEl);
  const handleAccountMenuClick = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };
  const [badgeRef, animateBadge] = useAnimate();
  (0, import_react12.useEffect)(() => {
    if (!scoreAction)
      return;
    animateBadge(badgeRef.current, {
      scale: 1.2
    }, {
      duration: 0.15
    }).then(() => {
      animateBadge(badgeRef.current, {
        scale: 1
      }, {
        duration: 0.15
      });
    });
  }, [animateBadge, badgeRef, scoreAction]);
  function updateOurOwnVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  (0, import_react12.useEffect)(() => {
    updateOurOwnVh();
    window.addEventListener("resize", updateOurOwnVh);
    return () => {
      window.removeEventListener("resize", updateOurOwnVh);
    };
  }, []);
  return /* @__PURE__ */ jsxDEV(TopLevelInfoProvider, { user: loaderData.user, workspace: loaderData.workspace, userFeatureFlagControls: loaderData.userFeatureFlagControls, workspaceFeatureFlagControls: loaderData.workspaceFeatureFlagControls, userScoreOverview: loaderData.userScoreOverview, children: /* @__PURE__ */ jsxDEV(WorkspaceContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(IconButton_default, { id: "show-sidebar", size: "large", edge: "start", color: "inherit", onClick: () => setShowSidebar((s) => !s), children: /* @__PURE__ */ jsxDEV(Menu_default2, {}, void 0, false, {
        fileName: "app/routes/app/workspace.tsx",
        lineNumber: 160,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace.tsx",
        lineNumber: 158,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Title, { hideOnSmallScreen: true }, void 0, false, {
        fileName: "app/routes/app/workspace.tsx",
        lineNumber: 163,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(WorkspaceAppBarTrailing, { children: [
        /* @__PURE__ */ jsxDEV(SearchWidget, { allTags: loaderData.allTags, allContacts: loaderData.allContacts }, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 166,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 171,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client6.DocsHelpSubject.ROOT, theId: "docs-help" }, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 173,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(IconButton_default, { id: "account-menu", onClick: handleAccountMenuClick, size: "large", color: "inherit", children: /* @__PURE__ */ jsxDEV(Badge_default, { ref: badgeRef, badgeContent: scoreAction ? scoreAction.daily_total_score : loaderData.userScoreOverview?.daily_score.total_score, color: "success", children: /* @__PURE__ */ jsxDEV(Avatar_default, { sx: {
          width: "1.75rem",
          height: "1.75rem"
        }, alt: loaderData.user.name, src: loaderData.user.avatar }, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 180,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 178,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 176,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace.tsx",
        lineNumber: 165,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Menu_default, { id: "basic-menu", anchorEl: accountMenuAnchorEl, open: accountMenuOpen, onClose: handleAccountMenuClose, MenuListProps: {
        "aria-labelledby": "basic-button"
      }, children: [
        isUserFeatureAvailable(loaderData.user, import_webapi_client6.UserFeature.GAMIFICATION) && /* @__PURE__ */ jsxDEV(MenuItem_default, { to: "/app/workspace/gamification", component: Link, onClick: handleAccountMenuClose, children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(SportsEsports_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 196,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 195,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: [
            "Today:",
            " ",
            scoreAction ? scoreAction.daily_total_score : loaderData.userScoreOverview?.daily_score.total_score,
            /* @__PURE__ */ jsxDEV(Divider_default, { orientation: "vertical", flexItem: true }, void 0, false, {
              fileName: "app/routes/app/workspace.tsx",
              lineNumber: 201,
              columnNumber: 19
            }, this),
            "Week:",
            " ",
            scoreAction ? scoreAction.weekly_total_score : loaderData.userScoreOverview?.weekly_score.total_score
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 198,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Divider_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 205,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 193,
          columnNumber: 83
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { id: "account", to: "/app/workspace/account", component: Link, onClick: handleAccountMenuClose, children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(AccountCircle_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 210,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 209,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Account" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 212,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { id: "manage-api", to: "/app/workspace/manage-api", component: Link, onClick: handleAccountMenuClose, children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(VpnKey_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 217,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 216,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Manage API" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 219,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 214,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { id: "manage-mcp", to: "/app/workspace/manage-mcp", component: Link, onClick: handleAccountMenuClose, children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(SmartToy_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 224,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 223,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Manage MCP" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 226,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 221,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { id: "security", to: "/app/workspace/security", component: Link, onClick: handleAccountMenuClose, children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(Security_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 231,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 230,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Security" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 233,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 228,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { id: "settings", to: "/app/workspace/settings", component: Link, onClick: handleAccountMenuClose, children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(Settings_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 238,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 237,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Settings" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 240,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 235,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Divider_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 242,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { component: "a", href: globalProperties.termsOfServiceUrl, target: "_blank", children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(Policy_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 246,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 245,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Terms of Service" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 248,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 243,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(MenuItem_default, { component: "a", href: globalProperties.privacyPolicyUrl, target: "_blank", children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(Policy_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 253,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 252,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Privacy Policy" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 255,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 250,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Divider_default, {}, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 257,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Form, { method: "post", action: "/app/logout", children: /* @__PURE__ */ jsxDEV(MenuItem_default, { id: "logout", type: "submit", component: "button", children: [
          /* @__PURE__ */ jsxDEV(ListItemIcon_default, { children: /* @__PURE__ */ jsxDEV(Logout_default, {}, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 261,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 260,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(ListItemText_default, { children: "Logout" }, void 0, false, {
            fileName: "app/routes/app/workspace.tsx",
            lineNumber: 263,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 259,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace.tsx",
          lineNumber: 258,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace.tsx",
        lineNumber: 189,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace.tsx",
      lineNumber: 157,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Sidebar, { showSidebar, onClickForNavigation: () => {
      if (isBigScreen)
        return;
      setShowSidebar(false);
    } }, void 0, false, {
      fileName: "app/routes/app/workspace.tsx",
      lineNumber: 269,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: outlet }, void 0, false, {
      fileName: "app/routes/app/workspace.tsx",
      lineNumber: 275,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(ScoreSnackbarManager, { scoreAction }, void 0, false, {
      fileName: "app/routes/app/workspace.tsx",
      lineNumber: 279,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(ReleaseUpdateWidget, {}, void 0, false, {
      fileName: "app/routes/app/workspace.tsx",
      lineNumber: 280,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace.tsx",
    lineNumber: 156,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace.tsx",
    lineNumber: 154,
    columnNumber: 10
  }, this);
}
_s(Workspace, "2g60putub/+l24wf2pVvLCoLwxc=", false, function() {
  return [useOutlet, useLoaderDataSafeForAnimation, useBigScreen, useScoreActionSingleton, useAnimate];
});
_c2 = Workspace;
var ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the workspace! Please try again!`
});
var _c;
var _c2;
$RefreshReg$(_c, "WorkspaceAppBarTrailing");
$RefreshReg$(_c2, "Workspace");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Workspace as default,
  links,
  shouldRevalidate
};
/*! Bundled license information:

js-cookie/dist/js.cookie.mjs:
  (*! js-cookie v3.0.5 | MIT *)
*/
//# sourceMappingURL=/build/routes/app/workspace-4IXUPUGM.js.map
