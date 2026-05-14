import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/difficulty.ts
var import_webapi_client = __toESM(require_dist(), 1);
function difficultyName(difficulty) {
  switch (difficulty) {
    case import_webapi_client.Difficulty.EASY:
      return "Easy";
    case import_webapi_client.Difficulty.MEDIUM:
      return "Medium";
    case import_webapi_client.Difficulty.HARD:
      return "Hard";
  }
}
var DIFFICULTY_MAP = {
  [import_webapi_client.Difficulty.EASY]: 0,
  [import_webapi_client.Difficulty.MEDIUM]: 1,
  [import_webapi_client.Difficulty.HARD]: 2
};
function compareDifficulty(difficulty1, difficulty2) {
  return DIFFICULTY_MAP[difficulty1] - DIFFICULTY_MAP[difficulty2];
}

// ../core/jupiter/core/common/eisen.ts
var import_webapi_client2 = __toESM(require_dist(), 1);
function eisenIcon(eisen) {
  switch (eisen) {
    case import_webapi_client2.Eisen.REGULAR:
      return "\u2733\uFE0F";
    case import_webapi_client2.Eisen.IMPORTANT:
      return "\u{1F6CE}\uFE0F";
    case import_webapi_client2.Eisen.URGENT:
      return "\u{1F525}";
    case import_webapi_client2.Eisen.IMPORTANT_AND_URGENT:
      return "\u26A1";
  }
}
function eisenName(eisen, isSmallScreen) {
  switch (eisen) {
    case import_webapi_client2.Eisen.REGULAR:
      return "Regular";
    case import_webapi_client2.Eisen.IMPORTANT:
      if (isSmallScreen) {
        return "Imp.";
      }
      return "Important";
    case import_webapi_client2.Eisen.URGENT:
      return "Urgent";
    case import_webapi_client2.Eisen.IMPORTANT_AND_URGENT:
      return "Imp. & Urgent";
  }
}
var EISEN_MAP = {
  [import_webapi_client2.Eisen.REGULAR]: 0,
  [import_webapi_client2.Eisen.IMPORTANT]: 1,
  [import_webapi_client2.Eisen.URGENT]: 2,
  [import_webapi_client2.Eisen.IMPORTANT_AND_URGENT]: 3
};
function compareEisen(eisen1, eisen2) {
  return EISEN_MAP[eisen1] - EISEN_MAP[eisen2];
}

export {
  difficultyName,
  compareDifficulty,
  eisenIcon,
  eisenName,
  compareEisen
};
//# sourceMappingURL=/build/_shared/chunk-NLPUBZ3T.js.map
