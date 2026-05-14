// ../../node_modules/http-status-codes/build/es/status-codes.js
var StatusCodes;
(function(StatusCodes2) {
  StatusCodes2[StatusCodes2["CONTINUE"] = 100] = "CONTINUE";
  StatusCodes2[StatusCodes2["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
  StatusCodes2[StatusCodes2["PROCESSING"] = 102] = "PROCESSING";
  StatusCodes2[StatusCodes2["EARLY_HINTS"] = 103] = "EARLY_HINTS";
  StatusCodes2[StatusCodes2["OK"] = 200] = "OK";
  StatusCodes2[StatusCodes2["CREATED"] = 201] = "CREATED";
  StatusCodes2[StatusCodes2["ACCEPTED"] = 202] = "ACCEPTED";
  StatusCodes2[StatusCodes2["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
  StatusCodes2[StatusCodes2["NO_CONTENT"] = 204] = "NO_CONTENT";
  StatusCodes2[StatusCodes2["RESET_CONTENT"] = 205] = "RESET_CONTENT";
  StatusCodes2[StatusCodes2["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
  StatusCodes2[StatusCodes2["MULTI_STATUS"] = 207] = "MULTI_STATUS";
  StatusCodes2[StatusCodes2["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
  StatusCodes2[StatusCodes2["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
  StatusCodes2[StatusCodes2["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
  StatusCodes2[StatusCodes2["SEE_OTHER"] = 303] = "SEE_OTHER";
  StatusCodes2[StatusCodes2["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
  StatusCodes2[StatusCodes2["USE_PROXY"] = 305] = "USE_PROXY";
  StatusCodes2[StatusCodes2["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
  StatusCodes2[StatusCodes2["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
  StatusCodes2[StatusCodes2["BAD_REQUEST"] = 400] = "BAD_REQUEST";
  StatusCodes2[StatusCodes2["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
  StatusCodes2[StatusCodes2["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
  StatusCodes2[StatusCodes2["FORBIDDEN"] = 403] = "FORBIDDEN";
  StatusCodes2[StatusCodes2["NOT_FOUND"] = 404] = "NOT_FOUND";
  StatusCodes2[StatusCodes2["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
  StatusCodes2[StatusCodes2["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
  StatusCodes2[StatusCodes2["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
  StatusCodes2[StatusCodes2["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
  StatusCodes2[StatusCodes2["CONFLICT"] = 409] = "CONFLICT";
  StatusCodes2[StatusCodes2["GONE"] = 410] = "GONE";
  StatusCodes2[StatusCodes2["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
  StatusCodes2[StatusCodes2["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
  StatusCodes2[StatusCodes2["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
  StatusCodes2[StatusCodes2["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
  StatusCodes2[StatusCodes2["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
  StatusCodes2[StatusCodes2["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
  StatusCodes2[StatusCodes2["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
  StatusCodes2[StatusCodes2["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
  StatusCodes2[StatusCodes2["INSUFFICIENT_SPACE_ON_RESOURCE"] = 419] = "INSUFFICIENT_SPACE_ON_RESOURCE";
  StatusCodes2[StatusCodes2["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
  StatusCodes2[StatusCodes2["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
  StatusCodes2[StatusCodes2["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
  StatusCodes2[StatusCodes2["LOCKED"] = 423] = "LOCKED";
  StatusCodes2[StatusCodes2["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
  StatusCodes2[StatusCodes2["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
  StatusCodes2[StatusCodes2["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
  StatusCodes2[StatusCodes2["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
  StatusCodes2[StatusCodes2["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
  StatusCodes2[StatusCodes2["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
  StatusCodes2[StatusCodes2["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
  StatusCodes2[StatusCodes2["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
  StatusCodes2[StatusCodes2["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
  StatusCodes2[StatusCodes2["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
  StatusCodes2[StatusCodes2["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
  StatusCodes2[StatusCodes2["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
  StatusCodes2[StatusCodes2["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
  StatusCodes2[StatusCodes2["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
})(StatusCodes || (StatusCodes = {}));

// ../../node_modules/http-status-codes/build/es/legacy.js
var ACCEPTED = 202;
var BAD_GATEWAY = 502;
var BAD_REQUEST = 400;
var CONFLICT = 409;
var CONTINUE = 100;
var CREATED = 201;
var EXPECTATION_FAILED = 417;
var FORBIDDEN = 403;
var GATEWAY_TIMEOUT = 504;
var GONE = 410;
var HTTP_VERSION_NOT_SUPPORTED = 505;
var IM_A_TEAPOT = 418;
var INSUFFICIENT_SPACE_ON_RESOURCE = 419;
var INSUFFICIENT_STORAGE = 507;
var INTERNAL_SERVER_ERROR = 500;
var LENGTH_REQUIRED = 411;
var LOCKED = 423;
var METHOD_FAILURE = 420;
var METHOD_NOT_ALLOWED = 405;
var MOVED_PERMANENTLY = 301;
var MOVED_TEMPORARILY = 302;
var MULTI_STATUS = 207;
var MULTIPLE_CHOICES = 300;
var NETWORK_AUTHENTICATION_REQUIRED = 511;
var NO_CONTENT = 204;
var NON_AUTHORITATIVE_INFORMATION = 203;
var NOT_ACCEPTABLE = 406;
var NOT_FOUND = 404;
var NOT_IMPLEMENTED = 501;
var NOT_MODIFIED = 304;
var OK = 200;
var PARTIAL_CONTENT = 206;
var PAYMENT_REQUIRED = 402;
var PERMANENT_REDIRECT = 308;
var PRECONDITION_FAILED = 412;
var PRECONDITION_REQUIRED = 428;
var PROCESSING = 102;
var PROXY_AUTHENTICATION_REQUIRED = 407;
var REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
var REQUEST_TIMEOUT = 408;
var REQUEST_TOO_LONG = 413;
var REQUEST_URI_TOO_LONG = 414;
var REQUESTED_RANGE_NOT_SATISFIABLE = 416;
var RESET_CONTENT = 205;
var SEE_OTHER = 303;
var SERVICE_UNAVAILABLE = 503;
var SWITCHING_PROTOCOLS = 101;
var TEMPORARY_REDIRECT = 307;
var TOO_MANY_REQUESTS = 429;
var UNAUTHORIZED = 401;
var UNPROCESSABLE_ENTITY = 422;
var UNSUPPORTED_MEDIA_TYPE = 415;
var USE_PROXY = 305;
var legacy_default = {
  ACCEPTED,
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  CONTINUE,
  CREATED,
  EXPECTATION_FAILED,
  FORBIDDEN,
  GATEWAY_TIMEOUT,
  GONE,
  HTTP_VERSION_NOT_SUPPORTED,
  IM_A_TEAPOT,
  INSUFFICIENT_SPACE_ON_RESOURCE,
  INSUFFICIENT_STORAGE,
  INTERNAL_SERVER_ERROR,
  LENGTH_REQUIRED,
  LOCKED,
  METHOD_FAILURE,
  METHOD_NOT_ALLOWED,
  MOVED_PERMANENTLY,
  MOVED_TEMPORARILY,
  MULTI_STATUS,
  MULTIPLE_CHOICES,
  NETWORK_AUTHENTICATION_REQUIRED,
  NO_CONTENT,
  NON_AUTHORITATIVE_INFORMATION,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  NOT_IMPLEMENTED,
  NOT_MODIFIED,
  OK,
  PARTIAL_CONTENT,
  PAYMENT_REQUIRED,
  PERMANENT_REDIRECT,
  PRECONDITION_FAILED,
  PRECONDITION_REQUIRED,
  PROCESSING,
  PROXY_AUTHENTICATION_REQUIRED,
  REQUEST_HEADER_FIELDS_TOO_LARGE,
  REQUEST_TIMEOUT,
  REQUEST_TOO_LONG,
  REQUEST_URI_TOO_LONG,
  REQUESTED_RANGE_NOT_SATISFIABLE,
  RESET_CONTENT,
  SEE_OTHER,
  SERVICE_UNAVAILABLE,
  SWITCHING_PROTOCOLS,
  TEMPORARY_REDIRECT,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  UNSUPPORTED_MEDIA_TYPE,
  USE_PROXY
};

// ../../node_modules/http-status-codes/build/es/utils.js
var statusCodeToReasonPhrase = {
  "202": "Accepted",
  "502": "Bad Gateway",
  "400": "Bad Request",
  "409": "Conflict",
  "100": "Continue",
  "201": "Created",
  "417": "Expectation Failed",
  "424": "Failed Dependency",
  "403": "Forbidden",
  "504": "Gateway Timeout",
  "410": "Gone",
  "505": "HTTP Version Not Supported",
  "418": "I'm a teapot",
  "419": "Insufficient Space on Resource",
  "507": "Insufficient Storage",
  "500": "Internal Server Error",
  "411": "Length Required",
  "423": "Locked",
  "420": "Method Failure",
  "405": "Method Not Allowed",
  "301": "Moved Permanently",
  "302": "Moved Temporarily",
  "207": "Multi-Status",
  "300": "Multiple Choices",
  "511": "Network Authentication Required",
  "204": "No Content",
  "203": "Non Authoritative Information",
  "406": "Not Acceptable",
  "404": "Not Found",
  "501": "Not Implemented",
  "304": "Not Modified",
  "200": "OK",
  "206": "Partial Content",
  "402": "Payment Required",
  "308": "Permanent Redirect",
  "412": "Precondition Failed",
  "428": "Precondition Required",
  "102": "Processing",
  "103": "Early Hints",
  "426": "Upgrade Required",
  "407": "Proxy Authentication Required",
  "431": "Request Header Fields Too Large",
  "408": "Request Timeout",
  "413": "Request Entity Too Large",
  "414": "Request-URI Too Long",
  "416": "Requested Range Not Satisfiable",
  "205": "Reset Content",
  "303": "See Other",
  "503": "Service Unavailable",
  "101": "Switching Protocols",
  "307": "Temporary Redirect",
  "429": "Too Many Requests",
  "401": "Unauthorized",
  "451": "Unavailable For Legal Reasons",
  "422": "Unprocessable Entity",
  "415": "Unsupported Media Type",
  "305": "Use Proxy",
  "421": "Misdirected Request"
};
var reasonPhraseToStatusCode = {
  "Accepted": 202,
  "Bad Gateway": 502,
  "Bad Request": 400,
  "Conflict": 409,
  "Continue": 100,
  "Created": 201,
  "Expectation Failed": 417,
  "Failed Dependency": 424,
  "Forbidden": 403,
  "Gateway Timeout": 504,
  "Gone": 410,
  "HTTP Version Not Supported": 505,
  "I'm a teapot": 418,
  "Insufficient Space on Resource": 419,
  "Insufficient Storage": 507,
  "Internal Server Error": 500,
  "Length Required": 411,
  "Locked": 423,
  "Method Failure": 420,
  "Method Not Allowed": 405,
  "Moved Permanently": 301,
  "Moved Temporarily": 302,
  "Multi-Status": 207,
  "Multiple Choices": 300,
  "Network Authentication Required": 511,
  "No Content": 204,
  "Non Authoritative Information": 203,
  "Not Acceptable": 406,
  "Not Found": 404,
  "Not Implemented": 501,
  "Not Modified": 304,
  "OK": 200,
  "Partial Content": 206,
  "Payment Required": 402,
  "Permanent Redirect": 308,
  "Precondition Failed": 412,
  "Precondition Required": 428,
  "Processing": 102,
  "Early Hints": 103,
  "Upgrade Required": 426,
  "Proxy Authentication Required": 407,
  "Request Header Fields Too Large": 431,
  "Request Timeout": 408,
  "Request Entity Too Large": 413,
  "Request-URI Too Long": 414,
  "Requested Range Not Satisfiable": 416,
  "Reset Content": 205,
  "See Other": 303,
  "Service Unavailable": 503,
  "Switching Protocols": 101,
  "Temporary Redirect": 307,
  "Too Many Requests": 429,
  "Unauthorized": 401,
  "Unavailable For Legal Reasons": 451,
  "Unprocessable Entity": 422,
  "Unsupported Media Type": 415,
  "Use Proxy": 305,
  "Misdirected Request": 421
};

// ../../node_modules/http-status-codes/build/es/utils-functions.js
function getReasonPhrase(statusCode) {
  var result = statusCodeToReasonPhrase[statusCode.toString()];
  if (!result) {
    throw new Error("Status code does not exist: " + statusCode);
  }
  return result;
}
function getStatusCode(reasonPhrase) {
  var result = reasonPhraseToStatusCode[reasonPhrase];
  if (!result) {
    throw new Error("Reason phrase does not exist: " + reasonPhrase);
  }
  return result;
}
var getStatusText = getReasonPhrase;

// ../../node_modules/http-status-codes/build/es/index.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var es_default = __assign(__assign({}, legacy_default), {
  getStatusCode,
  getStatusText
});

export {
  StatusCodes
};
//# sourceMappingURL=/build/_shared/chunk-XZXYTCEJ.js.map
