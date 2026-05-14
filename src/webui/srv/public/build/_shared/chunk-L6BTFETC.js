import {
  getHosting
} from "/build/_shared/chunk-NLP5SXQ3.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/utils.ts
var import_webapi_client = __toESM(require_dist(), 1);
var STANDARD_WIDTHS = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0.2796875,
  0.2765625,
  0.3546875,
  0.5546875,
  0.5546875,
  0.8890625,
  0.665625,
  0.190625,
  0.3328125,
  0.3328125,
  0.3890625,
  0.5828125,
  0.2765625,
  0.3328125,
  0.2765625,
  0.3015625,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.2765625,
  0.2765625,
  0.584375,
  0.5828125,
  0.584375,
  0.5546875,
  1.0140625,
  0.665625,
  0.665625,
  0.721875,
  0.721875,
  0.665625,
  0.609375,
  0.7765625,
  0.721875,
  0.2765625,
  0.5,
  0.665625,
  0.5546875,
  0.8328125,
  0.721875,
  0.7765625,
  0.665625,
  0.7765625,
  0.721875,
  0.665625,
  0.609375,
  0.721875,
  0.665625,
  0.94375,
  0.665625,
  0.665625,
  0.609375,
  0.2765625,
  0.3546875,
  0.2765625,
  0.4765625,
  0.5546875,
  0.3328125,
  0.5546875,
  0.5546875,
  0.5,
  0.5546875,
  0.5546875,
  0.2765625,
  0.5546875,
  0.5546875,
  0.221875,
  0.240625,
  0.5,
  0.221875,
  0.8328125,
  0.5546875,
  0.5546875,
  0.5546875,
  0.5546875,
  0.3328125,
  0.5,
  0.2765625,
  0.5546875,
  0.5,
  0.721875,
  0.5,
  0.5,
  0.5,
  0.3546875,
  0.259375,
  0.353125,
  0.5890625
];
var AVERAGE_WIDTH = 0.5279276315789471;
function measureText(str, fontSize) {
  return Array.from(str).reduce(
    (acc, cur) => acc + (STANDARD_WIDTHS[cur.charCodeAt(0)] ?? AVERAGE_WIDTH),
    0
  ) * fontSize;
}
function getPublicName({
  publicName,
  universe,
  instance
}) {
  if (getHosting(universe) === import_webapi_client.Hosting.HOSTED_GLOBAL) {
    return publicName;
  } else if (getHosting(universe) === import_webapi_client.Hosting.SELF_HOSTED) {
    return `${publicName} - ${instance}`;
  } else {
    return publicName;
  }
}

export {
  measureText,
  getPublicName
};
//# sourceMappingURL=/build/_shared/chunk-L6BTFETC.js.map
