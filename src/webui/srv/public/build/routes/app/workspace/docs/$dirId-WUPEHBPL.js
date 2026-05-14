import {
  isDirRoot
} from "/build/_shared/chunk-RDEY3YL3.js";
import {
  DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
  noteContentPreviewPlainText
} from "/build/_shared/chunk-542UTXAG.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  EntityNameOneLineComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  TimeDiffTag
} from "/build/_shared/chunk-YNGTC4PW.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  CreateNewFolder_default,
  Settings_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  Box_default,
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import {
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet
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

// app/routes/app/workspace/docs/$dirId.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/docs/$dirId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/docs/$dirId.tsx"
  );
  import.meta.hot.lastModified = "1777810170520.7354";
}
var ParamsSchema = external_exports.object({
  dirId: external_exports.string()
});
var DocsSortOrder = /* @__PURE__ */ function(DocsSortOrder2) {
  DocsSortOrder2["CREATED_ASC"] = "created_asc";
  DocsSortOrder2["CREATED_DESC"] = "created_desc";
  DocsSortOrder2["MODIFIED_ASC"] = "modified_asc";
  DocsSortOrder2["MODIFIED_DESC"] = "modified_desc";
  DocsSortOrder2["NAME_ASC"] = "name_asc";
  DocsSortOrder2["NAME_DESC"] = "name_desc";
  return DocsSortOrder2;
}(DocsSortOrder || {});
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function DocsInFolder() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const compactDocCardLayout = !isBigScreen;
  const {
    dirLoad
  } = loaderData;
  const dirId = dirLoad.dir.ref_id;
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [sortOrder, setSortOrder] = (0, import_react2.useState)(DocsSortOrder.MODIFIED_DESC);
  const filteredSubdirs = selectedTagsRefId.length === 0 ? dirLoad.subdirs : dirLoad.subdirs.filter((entry) => entry.tags.some((tag) => selectedTagsRefId.includes(tag.ref_id)));
  const filteredEntries = selectedTagsRefId.length === 0 ? dirLoad.entries : dirLoad.entries.filter((entry) => entry.tags.some((tag) => selectedTagsRefId.includes(tag.ref_id)));
  const sortedFilteredSubdirs = (0, import_react2.useMemo)(() => sortSubdirEntries(filteredSubdirs, sortOrder), [filteredSubdirs, sortOrder]);
  const sortedFilteredEntries = (0, import_react2.useMemo)(() => sortDocEntries(filteredEntries, sortOrder), [filteredEntries, sortOrder]);
  const showParentLink = !isDirRoot(dirLoad.dir);
  const parentHref = dirLoad.dir.parent_dir_ref_id !== void 0 && dirLoad.dir.parent_dir_ref_id !== null ? `/app/workspace/docs/${dirLoad.dir.parent_dir_ref_id}` : "/app/workspace/docs";
  const listIsEmpty = sortedFilteredSubdirs.length === 0 && sortedFilteredEntries.length === 0;
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: `/app/workspace/docs/${dirId}/doc/new`, returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "docs-actions", topLevelInfo, inputsEnabled: true, actions: [NavSingle({
    id: "docs-new-folder",
    text: "New Folder",
    link: `/app/workspace/docs/${dirId}/new`,
    icon: /* @__PURE__ */ jsxDEV(CreateNewFolder_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId.tsx",
      lineNumber: 121,
      columnNumber: 11
    }, this)
  }), ...!isDirRoot(dirLoad.dir) ? [NavSingle({
    id: "docs-folder-settings",
    text: "Settings",
    link: `/app/workspace/docs/${dirId}/settings`,
    icon: /* @__PURE__ */ jsxDEV(Settings_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId.tsx",
      lineNumber: 126,
      columnNumber: 11
    }, this)
  })] : [], FilterFewOptionsCompact("Sort", sortOrder, [{
    value: DocsSortOrder.CREATED_ASC,
    text: "Creation date (oldest first)"
  }, {
    value: DocsSortOrder.CREATED_DESC,
    text: "Creation date (newest first)"
  }, {
    value: DocsSortOrder.MODIFIED_ASC,
    text: "Last modified (oldest first)"
  }, {
    value: DocsSortOrder.MODIFIED_DESC,
    text: "Last modified (newest first)"
  }, {
    value: DocsSortOrder.NAME_ASC,
    text: "Name (A\u2013Z)"
  }, {
    value: DocsSortOrder.NAME_DESC,
    text: "Name (Z\u2013A)"
  }], setSortOrder), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/docs/$dirId.tsx",
    lineNumber: 117,
    columnNumber: 145
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: [
      listIsEmpty && !showParentLink && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no folders or docs to show here. Use the + button for a new doc or New Folder in the actions bar.", newEntityLocations: `/app/workspace/docs/${dirId}/doc/new`, helpSubject: import_webapi_client.DocsHelpSubject.DOCS }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId.tsx",
        lineNumber: 150,
        columnNumber: 44
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: [
        showParentLink && /* @__PURE__ */ jsxDEV(EntityCard, { entityId: "docs-parent", children: /* @__PURE__ */ jsxDEV(EntityLink, { to: parentHref, singleLine: true, children: /* @__PURE__ */ jsxDEV(DocCardRoot, { children: /* @__PURE__ */ jsxDEV(DocCardTitleRow, { children: /* @__PURE__ */ jsxDEV(DocCardTitleSlot, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", component: "span", children: ".." }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId.tsx",
          lineNumber: 158,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId.tsx",
          lineNumber: 157,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId.tsx",
          lineNumber: 156,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId.tsx",
          lineNumber: 155,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/docs/$dirId.tsx",
          lineNumber: 154,
          columnNumber: 15
        }, this) }, "docs-parent", false, {
          fileName: "app/routes/app/workspace/docs/$dirId.tsx",
          lineNumber: 153,
          columnNumber: 30
        }, this),
        sortedFilteredSubdirs.map((entry) => {
          const rowTags = entry.tags;
          return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `dir-${entry.dir.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/docs/${entry.dir.ref_id}`, singleLine: true, children: /* @__PURE__ */ jsxDEV(DocCardRoot, { children: [
            /* @__PURE__ */ jsxDEV(DocCardTitleRow, { children: [
              /* @__PURE__ */ jsxDEV(DocCardTitleSlot, { children: /* @__PURE__ */ jsxDEV(DocCardTitleTextWrap, { children: /* @__PURE__ */ jsxDEV(DirTitleWithFolderGlyph, { children: [
                /* @__PURE__ */ jsxDEV(DirFolderGlyph, { "aria-hidden": true, children: "\u{1F4C1}" }, void 0, false, {
                  fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                  lineNumber: 175,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: entry.dir.name }, void 0, false, {
                  fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                  lineNumber: 176,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 174,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 173,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 172,
                columnNumber: 23
              }, this),
              !compactDocCardLayout && rowTags.map((tag) => /* @__PURE__ */ jsxDEV(DocCardTitleAffix, { children: /* @__PURE__ */ jsxDEV(TagTag, { tag }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 181,
                columnNumber: 29
              }, this) }, tag.ref_id, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 180,
                columnNumber: 68
              }, this)),
              /* @__PURE__ */ jsxDEV(DocCardTitleAffix, { children: /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "Last modified", collectionTime: entry.dir.last_modified_time, compact: compactDocCardLayout }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 184,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 183,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 171,
              columnNumber: 21
            }, this),
            compactDocCardLayout && rowTags.length > 0 && /* @__PURE__ */ jsxDEV(DocCardTagsRow, { children: rowTags.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 188,
              columnNumber: 45
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 187,
              columnNumber: 68
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/docs/$dirId.tsx",
            lineNumber: 170,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/docs/$dirId.tsx",
            lineNumber: 169,
            columnNumber: 17
          }, this) }, `dir-${entry.dir.ref_id}`, false, {
            fileName: "app/routes/app/workspace/docs/$dirId.tsx",
            lineNumber: 168,
            columnNumber: 18
          }, this);
        }),
        sortedFilteredEntries.map((entry) => {
          const preview = noteContentPreviewPlainText(entry.note, DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS);
          const rowTags = entry.tags;
          return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `doc-${entry.doc.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/docs/${dirId}/doc/${entry.doc.ref_id}`, singleLine: true, children: /* @__PURE__ */ jsxDEV(DocCardRoot, { children: [
            /* @__PURE__ */ jsxDEV(DocCardTitleRow, { children: [
              /* @__PURE__ */ jsxDEV(DocCardTitleSlot, { children: /* @__PURE__ */ jsxDEV(DocCardTitleTextWrap, { children: /* @__PURE__ */ jsxDEV(EntityNameOneLineComponent, { name: entry.doc.name }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 203,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 202,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 201,
                columnNumber: 23
              }, this),
              !compactDocCardLayout && rowTags.map((tag) => /* @__PURE__ */ jsxDEV(DocCardTitleAffix, { children: /* @__PURE__ */ jsxDEV(TagTag, { tag }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 207,
                columnNumber: 29
              }, this) }, tag.ref_id, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 206,
                columnNumber: 68
              }, this)),
              /* @__PURE__ */ jsxDEV(DocCardTitleAffix, { children: /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "Last modified", collectionTime: entry.doc.last_modified_time, compact: compactDocCardLayout }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 210,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "app/routes/app/workspace/docs/$dirId.tsx",
                lineNumber: 209,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 200,
              columnNumber: 21
            }, this),
            compactDocCardLayout && rowTags.length > 0 && /* @__PURE__ */ jsxDEV(DocCardTagsRow, { children: rowTags.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 214,
              columnNumber: 45
            }, this)) }, void 0, false, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 213,
              columnNumber: 68
            }, this),
            preview && /* @__PURE__ */ jsxDEV(DocCardPreview, { variant: "body2", children: preview }, void 0, false, {
              fileName: "app/routes/app/workspace/docs/$dirId.tsx",
              lineNumber: 216,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/docs/$dirId.tsx",
            lineNumber: 199,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/docs/$dirId.tsx",
            lineNumber: 198,
            columnNumber: 17
          }, this) }, `doc-${entry.doc.ref_id}`, false, {
            fileName: "app/routes/app/workspace/docs/$dirId.tsx",
            lineNumber: 197,
            columnNumber: 18
          }, this);
        })
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/docs/$dirId.tsx",
        lineNumber: 152,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/docs/$dirId.tsx",
      lineNumber: 149,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId.tsx",
      lineNumber: 224,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId.tsx",
      lineNumber: 223,
      columnNumber: 7
    }, this)
  ] }, `docs-dir-${dirId}`, true, {
    fileName: "app/routes/app/workspace/docs/$dirId.tsx",
    lineNumber: 117,
    columnNumber: 10
  }, this);
}
_s(DocsInFolder, "r5J3c24cGIpG4J0OUwDYnbef+NE=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf, useBigScreen];
});
_c = DocsInFolder;
var DocCardRoot = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 0,
  maxWidth: "100%",
  width: "100%",
  gap: theme.spacing(0.75)
}));
_c2 = DocCardRoot;
var DocCardTitleRow = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: theme.spacing(0.5),
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden"
}));
_c3 = DocCardTitleRow;
var DocCardTitleSlot = styled_default(Box_default)({
  flex: "1 1 0%",
  flexBasis: 0,
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden"
});
_c4 = DocCardTitleSlot;
var DocCardTitleTextWrap = styled_default(Box_default)({
  display: "block",
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  "& .MuiTypography-root": {
    width: "100%"
  }
});
_c5 = DocCardTitleTextWrap;
var DirTitleWithFolderGlyph = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(0.5),
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  "& .MuiTypography-root": {
    width: "100%"
  }
}));
_c6 = DirTitleWithFolderGlyph;
var DirFolderGlyph = styled_default(Box_default)({
  flexShrink: 0,
  lineHeight: 1
});
_c7 = DirFolderGlyph;
var DocCardTitleAffix = styled_default(Box_default)({
  flexShrink: 0
});
_c8 = DocCardTitleAffix;
var DocCardTagsRow = styled_default(Box_default)(({
  theme
}) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(0.5),
  width: "100%"
}));
_c9 = DocCardTagsRow;
var DocCardPreview = styled_default(Typography_default)(({
  theme
}) => ({
  fontSize: "0.8rem",
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  width: "100%",
  color: theme.palette.text.secondary
}));
_c0 = DocCardPreview;
function sortDocEntries(entries, order) {
  const sorted = [...entries];
  const byCreatedAsc = (a, b) => a.doc.created_time.localeCompare(b.doc.created_time);
  const byModifiedAsc = (a, b) => a.doc.last_modified_time.localeCompare(b.doc.last_modified_time);
  const byNameAsc = (a, b) => a.doc.name.localeCompare(b.doc.name);
  switch (order) {
    case DocsSortOrder.CREATED_ASC:
      sorted.sort(byCreatedAsc);
      break;
    case DocsSortOrder.CREATED_DESC:
      sorted.sort((a, b) => byCreatedAsc(b, a));
      break;
    case DocsSortOrder.MODIFIED_ASC:
      sorted.sort(byModifiedAsc);
      break;
    case DocsSortOrder.MODIFIED_DESC:
      sorted.sort((a, b) => byModifiedAsc(b, a));
      break;
    case DocsSortOrder.NAME_ASC:
      sorted.sort(byNameAsc);
      break;
    case DocsSortOrder.NAME_DESC:
      sorted.sort((a, b) => byNameAsc(b, a));
      break;
  }
  return sorted;
}
function sortSubdirEntries(entries, order) {
  const sorted = [...entries];
  const byCreatedAsc = (a, b) => a.dir.created_time.localeCompare(b.dir.created_time);
  const byModifiedAsc = (a, b) => a.dir.last_modified_time.localeCompare(b.dir.last_modified_time);
  const byNameAsc = (a, b) => a.dir.name.localeCompare(b.dir.name);
  switch (order) {
    case DocsSortOrder.CREATED_ASC:
      sorted.sort(byCreatedAsc);
      break;
    case DocsSortOrder.CREATED_DESC:
      sorted.sort((a, b) => byCreatedAsc(b, a));
      break;
    case DocsSortOrder.MODIFIED_ASC:
      sorted.sort(byModifiedAsc);
      break;
    case DocsSortOrder.MODIFIED_DESC:
      sorted.sort((a, b) => byModifiedAsc(b, a));
      break;
    case DocsSortOrder.NAME_ASC:
      sorted.sort(byNameAsc);
      break;
    case DocsSortOrder.NAME_DESC:
      sorted.sort((a, b) => byNameAsc(b, a));
      break;
  }
  return sorted;
}
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the docs! Please try again!`
});
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
var _c7;
var _c8;
var _c9;
var _c0;
$RefreshReg$(_c, "DocsInFolder");
$RefreshReg$(_c2, "DocCardRoot");
$RefreshReg$(_c3, "DocCardTitleRow");
$RefreshReg$(_c4, "DocCardTitleSlot");
$RefreshReg$(_c5, "DocCardTitleTextWrap");
$RefreshReg$(_c6, "DirTitleWithFolderGlyph");
$RefreshReg$(_c7, "DirFolderGlyph");
$RefreshReg$(_c8, "DocCardTitleAffix");
$RefreshReg$(_c9, "DocCardTagsRow");
$RefreshReg$(_c0, "DocCardPreview");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  DocsInFolder as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/docs/$dirId-WUPEHBPL.js.map
