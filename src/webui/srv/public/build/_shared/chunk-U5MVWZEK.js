import {
  difficultyName,
  eisenName
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/difficulty-tag.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function DifficultyTag(props) {
  const tagName = difficultyName(props.difficulty);
  const tagClass = difficultyToClass(props.difficulty);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/difficulty-tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function difficultyToClass(difficulty) {
  switch (difficulty) {
    case import_webapi_client.Difficulty.EASY:
      return "default";
    case import_webapi_client.Difficulty.MEDIUM:
      return "warning";
    case import_webapi_client.Difficulty.HARD:
      return "error";
  }
}

// ../core/jupiter/core/common/component/eisen-tag.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
function EisenTag(props) {
  const tagName = eisenName(props.eisen);
  const tagClass = eisenToClass(props.eisen);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/eisen-tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function eisenToClass(eisen) {
  switch (eisen) {
    case import_webapi_client2.Eisen.REGULAR:
      return "default";
    case import_webapi_client2.Eisen.IMPORTANT:
      return "success";
    case import_webapi_client2.Eisen.URGENT:
      return "warning";
    case import_webapi_client2.Eisen.IMPORTANT_AND_URGENT:
      return "error";
  }
}

export {
  DifficultyTag,
  EisenTag
};
//# sourceMappingURL=/build/_shared/chunk-U5MVWZEK.js.map
