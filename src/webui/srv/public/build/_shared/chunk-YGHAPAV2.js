import {
  __commonJS
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../gen/ts/webapi-client/dist/core/BaseHttpRequest.js
var require_BaseHttpRequest = __commonJS({
  "../../gen/ts/webapi-client/dist/core/BaseHttpRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHttpRequest = void 0;
    var BaseHttpRequest = class {
      constructor(config) {
        this.config = config;
      }
    };
    exports.BaseHttpRequest = BaseHttpRequest;
  }
});

// ../../gen/ts/webapi-client/dist/core/ApiError.js
var require_ApiError = __commonJS({
  "../../gen/ts/webapi-client/dist/core/ApiError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiError = void 0;
    var ApiError = class extends Error {
      constructor(request, response, message) {
        super(message);
        this.name = "ApiError";
        this.url = response.url;
        this.status = response.status;
        this.statusText = response.statusText;
        this.body = response.body;
        this.request = request;
      }
    };
    exports.ApiError = ApiError;
  }
});

// ../../gen/ts/webapi-client/dist/core/CancelablePromise.js
var require_CancelablePromise = __commonJS({
  "../../gen/ts/webapi-client/dist/core/CancelablePromise.js"(exports) {
    "use strict";
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _CancelablePromise_isResolved;
    var _CancelablePromise_isRejected;
    var _CancelablePromise_isCancelled;
    var _CancelablePromise_cancelHandlers;
    var _CancelablePromise_promise;
    var _CancelablePromise_resolve;
    var _CancelablePromise_reject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CancelablePromise = exports.CancelError = void 0;
    var CancelError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "CancelError";
      }
      get isCancelled() {
        return true;
      }
    };
    exports.CancelError = CancelError;
    var CancelablePromise = class {
      constructor(executor) {
        _CancelablePromise_isResolved.set(this, void 0);
        _CancelablePromise_isRejected.set(this, void 0);
        _CancelablePromise_isCancelled.set(this, void 0);
        _CancelablePromise_cancelHandlers.set(this, void 0);
        _CancelablePromise_promise.set(this, void 0);
        _CancelablePromise_resolve.set(this, void 0);
        _CancelablePromise_reject.set(this, void 0);
        __classPrivateFieldSet(this, _CancelablePromise_isResolved, false, "f");
        __classPrivateFieldSet(this, _CancelablePromise_isRejected, false, "f");
        __classPrivateFieldSet(this, _CancelablePromise_isCancelled, false, "f");
        __classPrivateFieldSet(this, _CancelablePromise_cancelHandlers, [], "f");
        __classPrivateFieldSet(this, _CancelablePromise_promise, new Promise((resolve, reject) => {
          __classPrivateFieldSet(this, _CancelablePromise_resolve, resolve, "f");
          __classPrivateFieldSet(this, _CancelablePromise_reject, reject, "f");
          const onResolve = (value) => {
            if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
              return;
            }
            __classPrivateFieldSet(this, _CancelablePromise_isResolved, true, "f");
            if (__classPrivateFieldGet(this, _CancelablePromise_resolve, "f"))
              __classPrivateFieldGet(this, _CancelablePromise_resolve, "f").call(this, value);
          };
          const onReject = (reason) => {
            if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
              return;
            }
            __classPrivateFieldSet(this, _CancelablePromise_isRejected, true, "f");
            if (__classPrivateFieldGet(this, _CancelablePromise_reject, "f"))
              __classPrivateFieldGet(this, _CancelablePromise_reject, "f").call(this, reason);
          };
          const onCancel = (cancelHandler) => {
            if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
              return;
            }
            __classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f").push(cancelHandler);
          };
          Object.defineProperty(onCancel, "isResolved", {
            get: () => __classPrivateFieldGet(this, _CancelablePromise_isResolved, "f")
          });
          Object.defineProperty(onCancel, "isRejected", {
            get: () => __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f")
          });
          Object.defineProperty(onCancel, "isCancelled", {
            get: () => __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")
          });
          return executor(onResolve, onReject, onCancel);
        }), "f");
      }
      get [(_CancelablePromise_isResolved = /* @__PURE__ */ new WeakMap(), _CancelablePromise_isRejected = /* @__PURE__ */ new WeakMap(), _CancelablePromise_isCancelled = /* @__PURE__ */ new WeakMap(), _CancelablePromise_cancelHandlers = /* @__PURE__ */ new WeakMap(), _CancelablePromise_promise = /* @__PURE__ */ new WeakMap(), _CancelablePromise_resolve = /* @__PURE__ */ new WeakMap(), _CancelablePromise_reject = /* @__PURE__ */ new WeakMap(), Symbol.toStringTag)]() {
        return "Cancellable Promise";
      }
      then(onFulfilled, onRejected) {
        return __classPrivateFieldGet(this, _CancelablePromise_promise, "f").then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return __classPrivateFieldGet(this, _CancelablePromise_promise, "f").catch(onRejected);
      }
      finally(onFinally) {
        return __classPrivateFieldGet(this, _CancelablePromise_promise, "f").finally(onFinally);
      }
      cancel() {
        if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
          return;
        }
        __classPrivateFieldSet(this, _CancelablePromise_isCancelled, true, "f");
        if (__classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f").length) {
          try {
            for (const cancelHandler of __classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f")) {
              cancelHandler();
            }
          } catch (error) {
            console.warn("Cancellation threw an error", error);
            return;
          }
        }
        __classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f").length = 0;
        if (__classPrivateFieldGet(this, _CancelablePromise_reject, "f"))
          __classPrivateFieldGet(this, _CancelablePromise_reject, "f").call(this, new CancelError("Request aborted"));
      }
      get isCancelled() {
        return __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f");
      }
    };
    exports.CancelablePromise = CancelablePromise;
  }
});

// ../../gen/ts/webapi-client/dist/core/request.js
var require_request = __commonJS({
  "../../gen/ts/webapi-client/dist/core/request.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.request = exports.sendRequest = void 0;
    var ApiError_1 = require_ApiError();
    var CancelablePromise_1 = require_CancelablePromise();
    var isDefined = (value) => {
      return value !== void 0 && value !== null;
    };
    var isString = (value) => {
      return typeof value === "string";
    };
    var isStringWithValue = (value) => {
      return isString(value) && value !== "";
    };
    var isBlob = (value) => {
      return typeof value === "object" && typeof value.type === "string" && typeof value.stream === "function" && typeof value.arrayBuffer === "function" && typeof value.constructor === "function" && typeof value.constructor.name === "string" && /^(Blob|File)$/.test(value.constructor.name) && /^(Blob|File)$/.test(value[Symbol.toStringTag]);
    };
    var isFormData = (value) => {
      return value instanceof FormData;
    };
    var base64 = (str) => {
      try {
        return btoa(str);
      } catch (err) {
        return Buffer.from(str).toString("base64");
      }
    };
    var getQueryString = (params) => {
      const qs = [];
      const append = (key, value) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      };
      const process = (key, value) => {
        if (isDefined(value)) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              process(key, v);
            });
          } else if (typeof value === "object") {
            Object.entries(value).forEach(([k, v]) => {
              process(`${key}[${k}]`, v);
            });
          } else {
            append(key, value);
          }
        }
      };
      Object.entries(params).forEach(([key, value]) => {
        process(key, value);
      });
      if (qs.length > 0) {
        return `?${qs.join("&")}`;
      }
      return "";
    };
    var getUrl = (config, options) => {
      const encoder = config.ENCODE_PATH || encodeURI;
      const path = options.url.replace("{api-version}", config.VERSION).replace(/{(.*?)}/g, (substring, group) => {
        var _a;
        if ((_a = options.path) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(group)) {
          return encoder(String(options.path[group]));
        }
        return substring;
      });
      const url = `${config.BASE}${path}`;
      if (options.query) {
        return `${url}${getQueryString(options.query)}`;
      }
      return url;
    };
    var getFormData = (options) => {
      if (options.formData) {
        const formData = new FormData();
        const process = (key, value) => {
          if (isString(value) || isBlob(value)) {
            formData.append(key, value);
          } else {
            formData.append(key, JSON.stringify(value));
          }
        };
        Object.entries(options.formData).filter(([_, value]) => isDefined(value)).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => process(key, v));
          } else {
            process(key, value);
          }
        });
        return formData;
      }
      return void 0;
    };
    var resolve = (options, resolver) => __awaiter(void 0, void 0, void 0, function* () {
      if (typeof resolver === "function") {
        return resolver(options);
      }
      return resolver;
    });
    var getHeaders = (config, options) => __awaiter(void 0, void 0, void 0, function* () {
      const token = yield resolve(options, config.TOKEN);
      const username = yield resolve(options, config.USERNAME);
      const password = yield resolve(options, config.PASSWORD);
      const additionalHeaders = yield resolve(options, config.HEADERS);
      const headers = Object.entries(Object.assign(Object.assign({ Accept: "application/json" }, additionalHeaders), options.headers)).filter(([_, value]) => isDefined(value)).reduce((headers2, [key, value]) => Object.assign(Object.assign({}, headers2), { [key]: String(value) }), {});
      if (isStringWithValue(token)) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (isStringWithValue(username) && isStringWithValue(password)) {
        const credentials = base64(`${username}:${password}`);
        headers["Authorization"] = `Basic ${credentials}`;
      }
      if (options.body) {
        if (options.mediaType) {
          headers["Content-Type"] = options.mediaType;
        } else if (isBlob(options.body)) {
          headers["Content-Type"] = options.body.type || "application/octet-stream";
        } else if (isString(options.body)) {
          headers["Content-Type"] = "text/plain";
        } else if (!isFormData(options.body)) {
          headers["Content-Type"] = "application/json";
        }
      }
      return new Headers(headers);
    });
    var getRequestBody = (options) => {
      var _a;
      if (options.body) {
        if ((_a = options.mediaType) === null || _a === void 0 ? void 0 : _a.includes("/json")) {
          return JSON.stringify(options.body);
        } else if (isString(options.body) || isBlob(options.body) || isFormData(options.body)) {
          return options.body;
        } else {
          return JSON.stringify(options.body);
        }
      }
      return void 0;
    };
    var sendRequest = (config, options, url, body, formData, headers, onCancel) => __awaiter(void 0, void 0, void 0, function* () {
      const controller = new AbortController();
      const request2 = {
        headers,
        body: body !== null && body !== void 0 ? body : formData,
        method: options.method,
        signal: controller.signal
      };
      if (config.WITH_CREDENTIALS) {
        request2.credentials = config.CREDENTIALS;
      }
      onCancel(() => controller.abort());
      return yield fetch(url, request2);
    });
    exports.sendRequest = sendRequest;
    var getResponseHeader = (response, responseHeader) => {
      if (responseHeader) {
        const content = response.headers.get(responseHeader);
        if (isString(content)) {
          return content;
        }
      }
      return void 0;
    };
    var getResponseBody = (response) => __awaiter(void 0, void 0, void 0, function* () {
      if (response.status !== 204) {
        try {
          const contentType = response.headers.get("Content-Type");
          if (contentType) {
            const isJSON = contentType.toLowerCase().startsWith("application/json");
            if (isJSON) {
              return yield response.json();
            } else {
              return yield response.text();
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      return void 0;
    });
    var catchErrorCodes = (options, result) => {
      const errors = Object.assign({ 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 409: "Conflict", 500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable" }, options.errors);
      if (result.status === 426) {
        throw new Response("", { status: 426 });
      }
      const error = errors[result.status];
      if (error) {
        throw new ApiError_1.ApiError(options, result, error);
      }
      if (!result.ok) {
        throw new ApiError_1.ApiError(options, result, "Generic Error");
      }
    };
    var request = (config, options) => {
      return new CancelablePromise_1.CancelablePromise((resolve2, reject, onCancel) => __awaiter(void 0, void 0, void 0, function* () {
        try {
          const url = getUrl(config, options);
          const formData = getFormData(options);
          const body = getRequestBody(options);
          const headers = yield getHeaders(config, options);
          if (!onCancel.isCancelled) {
            const response = yield (0, exports.sendRequest)(config, options, url, body, formData, headers, onCancel);
            const responseBody = yield getResponseBody(response);
            const responseHeader = getResponseHeader(response, options.responseHeader);
            const result = {
              url,
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
              body: responseHeader !== null && responseHeader !== void 0 ? responseHeader : responseBody
            };
            catchErrorCodes(options, result);
            resolve2(result.body);
          }
        } catch (error) {
          reject(error);
        }
      }));
    };
    exports.request = request;
  }
});

// ../../gen/ts/webapi-client/dist/core/FetchHttpRequest.js
var require_FetchHttpRequest = __commonJS({
  "../../gen/ts/webapi-client/dist/core/FetchHttpRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FetchHttpRequest = void 0;
    var BaseHttpRequest_1 = require_BaseHttpRequest();
    var request_1 = require_request();
    var FetchHttpRequest = class extends BaseHttpRequest_1.BaseHttpRequest {
      constructor(config) {
        super(config);
      }
      /**
       * Request method
       * @param options The request options from the service
       * @returns CancelablePromise<T>
       * @throws ApiError
       */
      request(options) {
        return (0, request_1.request)(this.config, options);
      }
    };
    exports.FetchHttpRequest = FetchHttpRequest;
  }
});

// ../../gen/ts/webapi-client/dist/services/ApiKeyService.js
var require_ApiKeyService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/ApiKeyService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiKeyService = void 0;
    var ApiKeyService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving an API key.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      aPiKeyArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/api-key-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating an API key.
       * @param requestBody The input data
       * @returns APIKeyCreateResult Successful response
       * @throws ApiError
       */
      aPiKeyCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/api-key-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for exchanging an API key for an authentication token.
       * @param requestBody The input data
       * @returns APIKeyExchangeResult Successful response
       * @throws ApiError
       */
      aPiKeyExchange(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/api-key-exchange",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for finding API keys.
       * @param requestBody The input data
       * @returns APIKeyFindResult Successful response
       * @throws ApiError
       */
      aPiKeyFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/api-key-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading an API key.
       * @param requestBody The input data
       * @returns APIKeyLoadResult Successful response
       * @throws ApiError
       */
      aPiKeyLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/api-key-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating an API key.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      aPiKeyUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/api-key-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.ApiKeyService = ApiKeyService;
  }
});

// ../../gen/ts/webapi-client/dist/services/ApplicationService.js
var require_ApplicationService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/ApplicationService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApplicationService = void 0;
    var ApplicationService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Close account use case.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      closeAccount(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/close-account",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for retrieving summaries about entities.
       * @param requestBody The input data
       * @returns GetSummariesResult Successful response
       * @throws ApiError
       */
      getSummaries(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/get-summaries",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * UseCase for initialising the workspace.
       * @param requestBody The input data
       * @returns InitResult Successful response
       * @throws ApiError
       */
      init(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/init",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for retrieving summaries about entities.
       * @param requestBody The input data
       * @returns LoadProgressReporterTokenResult Successful response
       * @throws ApiError
       */
      loadProgressReporterToken(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/load-progress-reporter-token",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading a user and workspace if they exist and other data too.
       * @param requestBody The input data
       * @returns LoadTopLevelInfoResult Successful response
       * @throws ApiError
       */
      loadTopLevelInfo(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/load-top-level-info",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for logging in as a particular user.
       * @param requestBody The input data
       * @returns LoginResult Successful response
       * @throws ApiError
       */
      login(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/login",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case that doesn't do anything.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      noOp(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/no-op",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.ApplicationService = ApplicationService;
  }
});

// ../../gen/ts/webapi-client/dist/services/AuthService.js
var require_AuthService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/AuthService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthService = void 0;
    var AuthService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for changing a password.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      changePassword(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/change-password",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for reseting a password.
       * @param requestBody The input data
       * @returns ResetPasswordResult Successful response
       * @throws ApiError
       */
      resetPassword(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/reset-password",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.AuthService = AuthService;
  }
});

// ../../gen/ts/webapi-client/dist/services/BigPlansService.js
var require_BigPlansService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/BigPlansService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BigPlansService = void 0;
    var BigPlansService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a big plan milestone.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      bigPlanMilestoneArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-milestone-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a big plan milestone.
       * @param requestBody The input data
       * @returns BigPlanMilestoneCreateResult Successful response
       * @throws ApiError
       */
      bigPlanMilestoneCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-milestone-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for loading a particular big plan milestone.
       * @param requestBody The input data
       * @returns BigPlanMilestoneLoadResult Successful response
       * @throws ApiError
       */
      bigPlanMilestoneLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-milestone-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a big plan milestone.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      bigPlanMilestoneRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-milestone-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a big plan milestone.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      bigPlanMilestoneUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-milestone-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a big plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      bigPlanArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a big plan.
       * @param requestBody The input data
       * @returns BigPlanCreateResult Successful response
       * @throws ApiError
       */
      bigPlanCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating an inbox task for a big plan.
       * @param requestBody The input data
       * @returns BigPlanCreateInboxTaskResult Successful response
       * @throws ApiError
       */
      bigPlanCreateInboxTask(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-create-inbox-task",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding a big plan.
       * @param requestBody The input data
       * @returns BigPlanFindResult Successful response
       * @throws ApiError
       */
      bigPlanFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for loading a particular big plan.
       * @param requestBody The input data
       * @returns BigPlanLoadResult Successful response
       * @throws ApiError
       */
      bigPlanLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for refreshing stats for a big plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      bigPlanRefreshStats(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-refresh-stats",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a big plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      bigPlanRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a big plan.
       * @param requestBody The input data
       * @returns BigPlanUpdateResult Successful response
       * @throws ApiError
       */
      bigPlanUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/big-plan-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.BigPlansService = BigPlansService;
  }
});

// ../../gen/ts/webapi-client/dist/services/CalendarService.js
var require_CalendarService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/CalendarService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalendarService = void 0;
    var CalendarService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for loading all the calendar entities for a given date and period.
       * @param requestBody The input data
       * @returns CalendarLoadForDateAndPeriodResult Successful response
       * @throws ApiError
       */
      calendarLoadForDateAndPeriod(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/calendar-load-for-date-and-period",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.CalendarService = CalendarService;
  }
});

// ../../gen/ts/webapi-client/dist/services/ChoresService.js
var require_ChoresService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/ChoresService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChoresService = void 0;
    var ChoresService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a chore.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      choreArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a chore.
       * @param requestBody The input data
       * @returns ChoreCreateResult Successful response
       * @throws ApiError
       */
      choreCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding a chore.
       * @param requestBody The input data
       * @returns ChoreFindResult Successful response
       * @throws ApiError
       */
      choreFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular chore.
       * @param requestBody The input data
       * @returns ChoreLoadResult Successful response
       * @throws ApiError
       */
      choreLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating tasks associated with chores.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      choreRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a chore.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      choreRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for suspending a chore.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      choreSuspend(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-suspend",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for unsuspending a chore.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      choreUnsuspend(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-unsuspend",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a chore.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      choreUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chore-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.ChoresService = ChoresService;
  }
});

// ../../gen/ts/webapi-client/dist/services/ContactsService.js
var require_ContactsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/ContactsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContactsService = void 0;
    var ContactsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for archiving a contact.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      contactArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a contact.
       * @param requestBody The input data
       * @returns ContactCreateResult Successful response
       * @throws ApiError
       */
      contactCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for finding contacts.
       * @param requestBody The input data
       * @returns ContactFindResult Successful response
       * @throws ApiError
       */
      contactFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a contact.
       * @param requestBody The input data
       * @returns ContactLoadResult Successful response
       * @throws ApiError
       */
      contactLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a contact.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      contactRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a contact.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      contactUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for upserting a contact link.
       * @param requestBody The input data
       * @returns ContactLinkUpsertResult Successful response
       * @throws ApiError
       */
      contactLinkUpsert(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/contact-link-upsert",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.ContactsService = ContactsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/DocsService.js
var require_DocsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/DocsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DocsService = void 0;
    var DocsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for archiving a directory.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      dirArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/dir-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a directory.
       * @param requestBody The input data
       * @returns DirCreateResult Successful response
       * @throws ApiError
       */
      dirCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/dir-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load every directory in the workspace docs tree (optionally with tags).
       * @param requestBody The input data
       * @returns DirFindResult Successful response
       * @throws ApiError
       */
      dirFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/dir-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load a directory with docs (notes and tags always included) and child dirs.
       * @param requestBody The input data
       * @returns DirLoadResult Successful response
       * @throws ApiError
       */
      dirLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/dir-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a directory.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      dirRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/dir-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a directory.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      dirUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/dir-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a doc.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      docArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/doc-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a doc.
       * @param requestBody The input data
       * @returns DocCreateResult Successful response
       * @throws ApiError
       */
      docCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/doc-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for finding docs.
       * @param requestBody The input data
       * @returns DocFindResult Successful response
       * @throws ApiError
       */
      docFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/doc-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular doc.
       * @param requestBody The input data
       * @returns DocLoadResult Successful response
       * @throws ApiError
       */
      docLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/doc-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a doc.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      docRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/doc-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Update a doc use case.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      docUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/doc-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.DocsService = DocsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/GcService.js
var require_GcService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/GcService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GcService = void 0;
    var GcService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for doing a garbage collection run.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      gCDo(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/gc-do",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load previous runs of GC.
       * @param requestBody The input data
       * @returns GCLoadRunsResult Successful response
       * @throws ApiError
       */
      gCLoadRuns(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/gc-load-runs",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.GcService = GcService;
  }
});

// ../../gen/ts/webapi-client/dist/services/GenService.js
var require_GenService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/GenService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GenService = void 0;
    var GenService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for generating new tasks.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      genDo(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/gen-do",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load previous runs of task generation.
       * @param requestBody The input data
       * @returns GenLoadRunsResult Successful response
       * @throws ApiError
       */
      genLoadRuns(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/gen-load-runs",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.GenService = GenService;
  }
});

// ../../gen/ts/webapi-client/dist/services/HabitsService.js
var require_HabitsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/HabitsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HabitsService = void 0;
    var HabitsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a habit.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      habitArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a habit.
       * @param requestBody The input data
       * @returns HabitCreateResult Successful response
       * @throws ApiError
       */
      habitCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding a habit.
       * @param requestBody The input data
       * @returns HabitFindResult Successful response
       * @throws ApiError
       */
      habitFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular habit.
       * @param requestBody The input data
       * @returns HabitLoadResult Successful response
       * @throws ApiError
       */
      habitLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating tasks associated with habits.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      habitRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a habit.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      habitRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for suspending a habit.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      habitSuspend(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-suspend",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for unsuspending a habit.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      habitUnsuspend(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-unsuspend",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a habit.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      habitUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/habit-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.HabitsService = HabitsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/HomeService.js
var require_HomeService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/HomeService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HomeService = void 0;
    var HomeService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a home tab.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      homeTabArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-tab-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for creating a home tab.
       * @param requestBody The input data
       * @returns HomeTabCreateResult Successful response
       * @throws ApiError
       */
      homeTabCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-tab-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for loading a home tab.
       * @param requestBody The input data
       * @returns HomeTabLoadResult Successful response
       * @throws ApiError
       */
      homeTabLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-tab-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a home tab.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      homeTabRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-tab-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a home tab's properties.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      homeTabUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-tab-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for archiving a home widget.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      homeWidgetArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-widget-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for creating a home small screen widget.
       * @param requestBody The input data
       * @returns HomeWidgetCreateResult Successful response
       * @throws ApiError
       */
      homeWidgetCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-widget-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for loading a home widget.
       * @param requestBody The input data
       * @returns HomeWidgetLoadResult Successful response
       * @throws ApiError
       */
      homeWidgetLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-widget-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for moving a home widget.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      homeWidgetMoveAndResize(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-widget-move-and-resize",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for removing a home widget.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      homeWidgetRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-widget-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for loading the home config.
       * @param requestBody The input data
       * @returns HomeConfigLoadResult Successful response
       * @throws ApiError
       */
      homeConfigLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/home-config-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for reordering tabs in the home config.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      reorderTabs(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/reorder-tabs",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.HomeService = HomeService;
  }
});

// ../../gen/ts/webapi-client/dist/services/InboxTasksService.js
var require_InboxTasksService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/InboxTasksService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InboxTasksService = void 0;
    var InboxTasksService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a inbox task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      inboxTaskArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/inbox-task-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding a inbox task.
       * @param requestBody The input data
       * @returns InboxTaskFindResult Successful response
       * @throws ApiError
       */
      inboxTaskFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/inbox-task-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The use case for loading a particular inbox task.
       * @param requestBody The input data
       * @returns InboxTaskLoadResult Successful response
       * @throws ApiError
       */
      inboxTaskLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/inbox-task-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a inbox task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      inboxTaskRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/inbox-task-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a inbox task's generic properties.
       * @param requestBody The input data
       * @returns InboxTaskUpdateResult Successful response
       * @throws ApiError
       */
      inboxTaskUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/inbox-task-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.InboxTasksService = InboxTasksService;
  }
});

// ../../gen/ts/webapi-client/dist/services/InfraService.js
var require_InfraService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/InfraService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InfraService = void 0;
    var InfraService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for loading the history of mutations for an entity.
       * @param requestBody The input data
       * @returns GetEntityMutationHistoryResult Successful response
       * @throws ApiError
       */
      getEntityMutationHistory(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/get-entity-mutation-history",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading all entity events produced by a mutation.
       * @param requestBody The input data
       * @returns GetMutationEntityEventsResult Successful response
       * @throws ApiError
       */
      getMutationEntityEvents(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/get-mutation-entity-events",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading the history of mutation invocations for a user and workspace.
       * @param requestBody The input data
       * @returns GetMutationInvocationHistoryResult Successful response
       * @throws ApiError
       */
      getMutationInvocationHistory(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/get-mutation-invocation-history",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.InfraService = InfraService;
  }
});

// ../../gen/ts/webapi-client/dist/services/JournalsService.js
var require_JournalsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/JournalsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JournalsService = void 0;
    var JournalsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for archiving a journal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      journalArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Command for updating the time configuration of a journal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      journalChangeTimeConfig(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-change-time-config",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a journal.
       * @param requestBody The input data
       * @returns JournalCreateResult Successful response
       * @throws ApiError
       */
      journalCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding journals.
       * @param requestBody The input data
       * @returns JournalFindResult Successful response
       * @throws ApiError
       */
      journalFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading details about a journal.
       * @param requestBody The input data
       * @returns JournalLoadResult Successful response
       * @throws ApiError
       */
      journalLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading details about a journal.
       * @param requestBody The input data
       * @returns JournalLoadForDateAndPeriodResult Successful response
       * @throws ApiError
       */
      journalLoadForDateAndPeriod(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-load-for-date-and-period",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around journals.
       * @param requestBody The input data
       * @returns JournalLoadSettingsResult Successful response
       * @throws ApiError
       */
      journalLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for refreshing stats for a journal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      journalRefreshStats(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-refresh-stats",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating journals.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      journalRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a journal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      journalRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Command for updating the settings for journals in general.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      journalUpdateSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/journal-update-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.JournalsService = JournalsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/LifePlanService.js
var require_LifePlanService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/LifePlanService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LifePlanService = void 0;
    var LifePlanService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a aspect.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      aspectArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a aspect.
       * @param requestBody The input data
       * @returns AspectCreateResult Successful response
       * @throws ApiError
       */
      aspectCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding aspects.
       * @param requestBody The input data
       * @returns AspectFindResult Successful response
       * @throws ApiError
       */
      aspectFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular aspect.
       * @param requestBody The input data
       * @returns AspectLoadResult Successful response
       * @throws ApiError
       */
      aspectLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a aspect.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      aspectRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Reorder the children of a aspect.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      aspectReorderChildren(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-reorder-children",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a aspect.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      aspectUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/aspect-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a chapter.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      chapterArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chapter-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a chapter.
       * @param requestBody The input data
       * @returns ChapterCreateResult Successful response
       * @throws ApiError
       */
      chapterCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chapter-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding chapters.
       * @param requestBody The input data
       * @returns ChapterFindResult Successful response
       * @throws ApiError
       */
      chapterFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chapter-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular chapter.
       * @param requestBody The input data
       * @returns ChapterLoadResult Successful response
       * @throws ApiError
       */
      chapterLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chapter-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a chapter.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      chapterRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chapter-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a chapter.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      chapterUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/chapter-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a goal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      goalArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/goal-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a goal.
       * @param requestBody The input data
       * @returns GoalCreateResult Successful response
       * @throws ApiError
       */
      goalCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/goal-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding goals.
       * @param requestBody The input data
       * @returns GoalFindResult Successful response
       * @throws ApiError
       */
      goalFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/goal-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular goal.
       * @param requestBody The input data
       * @returns GoalLoadResult Successful response
       * @throws ApiError
       */
      goalLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/goal-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a goal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      goalRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/goal-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a goal.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      goalUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/goal-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a milestone.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      milestoneArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/milestone-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a milestone.
       * @param requestBody The input data
       * @returns MilestoneCreateResult Successful response
       * @throws ApiError
       */
      milestoneCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/milestone-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding milestones.
       * @param requestBody The input data
       * @returns MilestoneFindResult Successful response
       * @throws ApiError
       */
      milestoneFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/milestone-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular milestone.
       * @param requestBody The input data
       * @returns MilestoneLoadResult Successful response
       * @throws ApiError
       */
      milestoneLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/milestone-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a milestone.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      milestoneRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/milestone-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a milestone.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      milestoneUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/milestone-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a vision.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      visionArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating (or reusing) the draft vision.
       * @param requestBody The input data
       * @returns VisionCreateDraftResult Successful response
       * @throws ApiError
       */
      visionCreateDraft(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-create-draft",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for finding visions.
       * @param requestBody The input data
       * @returns VisionFindResult Successful response
       * @throws ApiError
       */
      visionFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular vision.
       * @param requestBody The input data
       * @returns VisionLoadResult Successful response
       * @throws ApiError
       */
      visionLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading the active vision (if any).
       * @param requestBody The input data
       * @returns VisionLoadActiveResult Successful response
       * @throws ApiError
       */
      visionLoadActive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-load-active",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for marking a draft vision as active.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      visionMarkDraftAsActive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-mark-draft-as-active",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a vision.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      visionRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vision-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the eval settings for a life plan.
       * @param requestBody The input data
       * @returns LifePlanLoadEvalSettingsResult Successful response
       * @throws ApiError
       */
      lifePlanLoadEvalSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/life-plan-load-eval-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating life plan eval tasks.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      lifePlanRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/life-plan-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a life plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      lifePlanUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/life-plan-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Command for updating the eval settings for a life plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      lifePlanUpdateEvalSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/life-plan-update-eval-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.LifePlanService = LifePlanService;
  }
});

// ../../gen/ts/webapi-client/dist/services/McpKeyService.js
var require_McpKeyService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/McpKeyService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.McpKeyService = void 0;
    var McpKeyService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving an MCP key.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      mCpKeyArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/mcp-key-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating an MCP key.
       * @param requestBody The input data
       * @returns MCPKeyCreateResult Successful response
       * @throws ApiError
       */
      mCpKeyCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/mcp-key-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for exchanging an MCP key for an authentication token.
       * @param requestBody The input data
       * @returns MCPKeyExchangeResult Successful response
       * @throws ApiError
       */
      mCpKeyExchange(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/mcp-key-exchange",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for finding MCP keys.
       * @param requestBody The input data
       * @returns MCPKeyFindResult Successful response
       * @throws ApiError
       */
      mCpKeyFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/mcp-key-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading an MCP key.
       * @param requestBody The input data
       * @returns MCPKeyLoadResult Successful response
       * @throws ApiError
       */
      mCpKeyLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/mcp-key-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating an MCP key.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      mCpKeyUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/mcp-key-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.McpKeyService = McpKeyService;
  }
});

// ../../gen/ts/webapi-client/dist/services/MetricsService.js
var require_MetricsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/MetricsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetricsService = void 0;
    var MetricsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a metric entry.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricEntryArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-entry-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a metric entry.
       * @param requestBody The input data
       * @returns MetricEntryCreateResult Successful response
       * @throws ApiError
       */
      metricEntryCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-entry-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a metric entry.
       * @param requestBody The input data
       * @returns MetricEntryLoadResult Successful response
       * @throws ApiError
       */
      metricEntryLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-entry-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a metric entry.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricEntryRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-entry-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a metric entry's properties.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricEntryUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-entry-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a metric.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a metric.
       * @param requestBody The input data
       * @returns MetricCreateResult Successful response
       * @throws ApiError
       */
      metricCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding metrics.
       * @param requestBody The input data
       * @returns MetricFindResult Successful response
       * @throws ApiError
       */
      metricFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a metric.
       * @param requestBody The input data
       * @returns MetricLoadResult Successful response
       * @throws ApiError
       */
      metricLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around metrics.
       * @param requestBody The input data
       * @returns MetricLoadSettingsResult Successful response
       * @throws ApiError
       */
      metricLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating tasks associated with metrics.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a metric.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a metric's properties.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      metricUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/metric-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.MetricsService = MetricsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/MotdService.js
var require_MotdService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/MotdService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MotdService = void 0;
    var MotdService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for getting a random Message of the Day.
       * @param requestBody The input data
       * @returns MOTDGetForTodayResult Successful response
       * @throws ApiError
       */
      mOtdGetForToday(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/motd-get-for-today",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.MotdService = MotdService;
  }
});

// ../../gen/ts/webapi-client/dist/services/NotesService.js
var require_NotesService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/NotesService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NotesService = void 0;
    var NotesService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for archiving a note.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      noteArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a note.
       * @param requestBody The input data
       * @returns NoteCreateResult Successful response
       * @throws ApiError
       */
      noteCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for finding notes.
       * @param requestBody The input data
       * @returns NoteFindResult Successful response
       * @throws ApiError
       */
      noteFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a note.
       * @param requestBody The input data
       * @returns NoteLoadResult Successful response
       * @throws ApiError
       */
      noteLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load workspace-scoped settings for the notes feature.
       * @param requestBody The input data
       * @returns NoteLoadSettingsResult Successful response
       * @throws ApiError
       */
      noteLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a note.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      noteRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Update a note use case.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      noteUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/note-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.NotesService = NotesService;
  }
});

// ../../gen/ts/webapi-client/dist/services/PrmService.js
var require_PrmService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/PrmService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PrmService = void 0;
    var PrmService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a circle.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      circleArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/circle-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a circle.
       * @param requestBody The input data
       * @returns CircleCreateResult Successful response
       * @throws ApiError
       */
      circleCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/circle-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding circles.
       * @param requestBody The input data
       * @returns CircleFindResult Successful response
       * @throws ApiError
       */
      circleFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/circle-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a circle.
       * @param requestBody The input data
       * @returns CircleLoadResult Successful response
       * @throws ApiError
       */
      circleLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/circle-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a circle.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      circleRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/circle-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a circle.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      circleUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/circle-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving an occasion.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      occasionArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/occasion-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating an occasion.
       * @param requestBody The input data
       * @returns OccasionCreateResult Successful response
       * @throws ApiError
       */
      occasionCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/occasion-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading an occasion.
       * @param requestBody The input data
       * @returns OccasionLoadResult Successful response
       * @throws ApiError
       */
      occasionLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/occasion-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing an occasion.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      occasionRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/occasion-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating an occasion.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      occasionUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/occasion-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a person.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      personArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a person.
       * @param requestBody The input data
       * @returns PersonCreateResult Successful response
       * @throws ApiError
       */
      personCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding the persons.
       * @param requestBody The input data
       * @returns PersonFindResult Successful response
       * @throws ApiError
       */
      personFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a person.
       * @param requestBody The input data
       * @returns PersonLoadResult Successful response
       * @throws ApiError
       */
      personLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating tasks associated with persons.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      personRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a person.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      personRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a person.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      personUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around persons.
       * @param requestBody The input data
       * @returns PersonLoadSettingsResult Successful response
       * @throws ApiError
       */
      personLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/person-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.PrmService = PrmService;
  }
});

// ../../gen/ts/webapi-client/dist/services/PushIntegrationsService.js
var require_PushIntegrationsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/PushIntegrationsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PushIntegrationsService = void 0;
    var PushIntegrationsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a email task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      emailTaskArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/email-task-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding a email task.
       * @param requestBody The input data
       * @returns EmailTaskFindResult Successful response
       * @throws ApiError
       */
      emailTaskFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/email-task-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular email task.
       * @param requestBody The input data
       * @returns EmailTaskLoadResult Successful response
       * @throws ApiError
       */
      emailTaskLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/email-task-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around email tasks.
       * @param requestBody The input data
       * @returns EmailTaskLoadSettingsResult Successful response
       * @throws ApiError
       */
      emailTaskLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/email-task-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a email task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      emailTaskRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/email-task-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a email task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      emailTaskUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/email-task-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a slack task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      slackTaskArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/slack-task-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding a slack task.
       * @param requestBody The input data
       * @returns SlackTaskFindResult Successful response
       * @throws ApiError
       */
      slackTaskFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/slack-task-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular slack task.
       * @param requestBody The input data
       * @returns SlackTaskLoadResult Successful response
       * @throws ApiError
       */
      slackTaskLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/slack-task-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around slack tasks.
       * @param requestBody The input data
       * @returns SlackTaskLoadSettingsResult Successful response
       * @throws ApiError
       */
      slackTaskLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/slack-task-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a slack task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      slackTaskRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/slack-task-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a slack task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      slackTaskUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/slack-task-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.PushIntegrationsService = PushIntegrationsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/ReportService.js
var require_ReportService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/ReportService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportService = void 0;
    var ReportService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for reporting on progress.
       * @param requestBody The input data
       * @returns ReportResult Successful response
       * @throws ApiError
       */
      report(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/report",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.ReportService = ReportService;
  }
});

// ../../gen/ts/webapi-client/dist/services/ScheduleService.js
var require_ScheduleService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/ScheduleService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScheduleService = void 0;
    var ScheduleService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for archiving a schedule full day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventFullDaysArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-full-days-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for changing the schedule stream of an event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventFullDaysChangeScheduleStream(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-full-days-change-schedule-stream",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a full day event in the schedule.
       * @param requestBody The input data
       * @returns ScheduleEventFullDaysCreateResult Successful response
       * @throws ApiError
       */
      scheduleEventFullDaysCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-full-days-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a schedule full days event.
       * @param requestBody The input data
       * @returns ScheduleEventFullDaysLoadResult Successful response
       * @throws ApiError
       */
      scheduleEventFullDaysLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-full-days-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a full day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventFullDaysRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-full-days-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a full day block in the schedule.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventFullDaysUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-full-days-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a schedule in day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventInDayArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-in-day-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for changing the schedule stream of an event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventInDayChangeScheduleStream(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-in-day-change-schedule-stream",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a schedule in day event.
       * @param requestBody The input data
       * @returns ScheduleEventInDayCreateResult Successful response
       * @throws ApiError
       */
      scheduleEventInDayCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-in-day-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a schedule in day event.
       * @param requestBody The input data
       * @returns ScheduleEventInDayLoadResult Successful response
       * @throws ApiError
       */
      scheduleEventInDayLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-in-day-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a schedule in day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventInDayRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-in-day-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a schedule in day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleEventInDayUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-event-in-day-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a schedule export.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleExportArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a schedule export.
       * @param requestBody The input data
       * @returns ScheduleExportCreateResult Successful response
       * @throws ApiError
       */
      scheduleExportCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Usecase for finding schedule exports.
       * @param requestBody The input data
       * @returns ScheduleExportFindResult Successful response
       * @throws ApiError
       */
      scheduleExportFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular schedule export.
       * @param requestBody The input data
       * @returns ScheduleExportLoadResult Successful response
       * @throws ApiError
       */
      scheduleExportLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load a schedule export and its stream events from an external id.
       * @param requestBody The input data
       * @returns ScheduleExportLoadByExternalIdResult Successful response
       * @throws ApiError
       */
      scheduleExportLoadByExternalId(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-load-by-external-id",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a schedule export.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleExportRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a schedule export.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleExportUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-export-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for doing a sync.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleExternalSyncDo(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-external-sync-do",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading external sync runs.
       * @param requestBody The input data
       * @returns ScheduleExternalSyncLoadRunsResult Successful response
       * @throws ApiError
       */
      scheduleExternalSyncLoadRuns(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-external-sync-load-runs",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a schedule stream.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleStreamArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a schedule stream from an external iCal.
       * @param requestBody The input data
       * @returns ScheduleStreamCreateForExternalIcalResult Successful response
       * @throws ApiError
       */
      scheduleStreamCreateForExternalIcal(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-create-for-external-ical",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a schedule stream.
       * @param requestBody The input data
       * @returns ScheduleStreamCreateForUserResult Successful response
       * @throws ApiError
       */
      scheduleStreamCreateForUser(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-create-for-user",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Usecase for finding schedule streams.
       * @param requestBody The input data
       * @returns ScheduleStreamFindResult Successful response
       * @throws ApiError
       */
      scheduleStreamFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular stream.
       * @param requestBody The input data
       * @returns ScheduleStreamLoadResult Successful response
       * @throws ApiError
       */
      scheduleStreamLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a schedule stream.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleStreamRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a schedule stream.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      scheduleStreamUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/schedule-stream-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.ScheduleService = ScheduleService;
  }
});

// ../../gen/ts/webapi-client/dist/services/SearchService.js
var require_SearchService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/SearchService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchService = void 0;
    var SearchService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for free form searching through jupiter.
       * @param requestBody The input data
       * @returns SearchResult Successful response
       * @throws ApiError
       */
      search(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/search",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.SearchService = SearchService;
  }
});

// ../../gen/ts/webapi-client/dist/services/SmartListsService.js
var require_SmartListsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/SmartListsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmartListsService = void 0;
    var SmartListsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a smart list item.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      smartListItemArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-item-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a smart list item.
       * @param requestBody The input data
       * @returns SmartListItemCreateResult Successful response
       * @throws ApiError
       */
      smartListItemCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-item-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a smart list item.
       * @param requestBody The input data
       * @returns SmartListItemLoadResult Successful response
       * @throws ApiError
       */
      smartListItemLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-item-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a smart list item.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      smartListItemRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-item-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a smart list item.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      smartListItemUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-item-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for archiving a smart list.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      smartListArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a smart list.
       * @param requestBody The input data
       * @returns SmartListCreateResult Successful response
       * @throws ApiError
       */
      smartListCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding smart lists.
       * @param requestBody The input data
       * @returns SmartListFindResult Successful response
       * @throws ApiError
       */
      smartListFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a smart list.
       * @param requestBody The input data
       * @returns SmartListLoadResult Successful response
       * @throws ApiError
       */
      smartListLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a smart list.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      smartListRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a smart list.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      smartListUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/smart-list-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.SmartListsService = SmartListsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/StatsService.js
var require_StatsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/StatsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatsService = void 0;
    var StatsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for computing stats.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      statsDo(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/stats-do",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load previous runs of stats computation.
       * @param requestBody The input data
       * @returns StatsLoadRunsResult Successful response
       * @throws ApiError
       */
      statsLoadRuns(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/stats-load-runs",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.StatsService = StatsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/TagsService.js
var require_TagsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/TagsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagsService = void 0;
    var TagsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for upserting a tag link.
       * @param requestBody The input data
       * @returns TagLinkUpsertResult Successful response
       * @throws ApiError
       */
      tagLinkUpsert(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-link-upsert",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a tag.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      tagArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a tag.
       * @param requestBody The input data
       * @returns TagCreateResult Successful response
       * @throws ApiError
       */
      tagCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for finding tags.
       * @param requestBody The input data
       * @returns TagFindResult Successful response
       * @throws ApiError
       */
      tagFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a tag.
       * @param requestBody The input data
       * @returns TagLoadResult Successful response
       * @throws ApiError
       */
      tagLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a tag.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      tagRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a tag.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      tagUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/tag-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.TagsService = TagsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/TestHelperService.js
var require_TestHelperService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/TestHelperService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestHelperService = void 0;
    var TestHelperService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for clearing all branch and leaf type entities.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      clearAll(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/clear-all",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removeing all branch and leaf type entities.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      removeAll(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/remove-all",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Apply one drain batch for ``unindexed`` search mutation log rows (``SearchMutationLogDrainDoAllUseCase``).
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      searchIndexBackfillTestHelper(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/search-index-backfill-test-helper",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Set a particular feature in the workspace.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      workspaceSetFeature(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/workspace-set-feature",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.TestHelperService = TestHelperService;
  }
});

// ../../gen/ts/webapi-client/dist/services/TimeEventsService.js
var require_TimeEventsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/TimeEventsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeEventsService = void 0;
    var TimeEventsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Load a full day block and associated data.
       * @param requestBody The input data
       * @returns TimeEventFullDaysBlockLoadResult Successful response
       * @throws ApiError
       */
      timeEventFullDaysBlockLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-full-days-block-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving the in day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timeEventInDayBlockArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a time event associated with a big plan.
       * @param requestBody The input data
       * @returns TimeEventInDayBlockCreateForBigPlanResult Successful response
       * @throws ApiError
       */
      timeEventInDayBlockCreateForBigPlan(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-create-for-big-plan",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a time event associated with a chore.
       * @param requestBody The input data
       * @returns TimeEventInDayBlockCreateForChoreResult Successful response
       * @throws ApiError
       */
      timeEventInDayBlockCreateForChore(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-create-for-chore",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a time event associated with a habit.
       * @param requestBody The input data
       * @returns TimeEventInDayBlockCreateForHabitResult Successful response
       * @throws ApiError
       */
      timeEventInDayBlockCreateForHabit(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-create-for-habit",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a time event associated with a time plan activity.
       * @param requestBody The input data
       * @returns TimeEventInDayBlockCreateForTimePlanActivityResult Successful response
       * @throws ApiError
       */
      timeEventInDayBlockCreateForTimePlanActivity(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-create-for-time-plan-activity",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a time event associated with a todo task.
       * @param requestBody The input data
       * @returns TimeEventInDayBlockCreateForTodoTaskResult Successful response
       * @throws ApiError
       */
      timeEventInDayBlockCreateForTodoTask(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-create-for-todo-task",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Load a in day block and associated data.
       * @param requestBody The input data
       * @returns TimeEventInDayBlockLoadResult Successful response
       * @throws ApiError
       */
      timeEventInDayBlockLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing the in day event.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timeEventInDayBlockRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for updating a time event in day.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timeEventInDayBlockUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-event-in-day-block-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.TimeEventsService = TimeEventsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/TimePlansService.js
var require_TimePlansService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/TimePlansService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePlansService = void 0;
    var TimePlansService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Use case for archiving a time plan activity.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanActivityArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-activity-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding time plan activities for a particular target.
       * @param requestBody The input data
       * @returns TimePlanActivityFindForTargetResult Successful response
       * @throws ApiError
       */
      timePlanActivityFindForTarget(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-activity-find-for-target",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a time plan activity activity.
       * @param requestBody The input data
       * @returns TimePlanActivityLoadResult Successful response
       * @throws ApiError
       */
      timePlanActivityLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-activity-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a time plan activity.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanActivityRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-activity-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a time plan activity.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanActivityUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-activity-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for archiving a time plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating activities starting from a big plan.
       * @param requestBody The input data
       * @returns TimePlanAssociateBigPlanWithPlanResult Successful response
       * @throws ApiError
       */
      timePlanAssociateBigPlanWithPlan(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-associate-big-plan-with-plan",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating activities starting from an inbox task.
       * @param requestBody The input data
       * @returns TimePlanAssociateInboxTaskWithPlanResult Successful response
       * @throws ApiError
       */
      timePlanAssociateInboxTaskWithPlan(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-associate-inbox-task-with-plan",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating activities starting from already existin activities.
       * @param requestBody The input data
       * @returns TimePlanAssociateWithActivitiesResult Successful response
       * @throws ApiError
       */
      timePlanAssociateWithActivities(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-associate-with-activities",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating activities starting from big plans.
       * @param requestBody The input data
       * @returns TimePlanAssociateWithBigPlansResult Successful response
       * @throws ApiError
       */
      timePlanAssociateWithBigPlans(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-associate-with-big-plans",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating activities starting from inbox tasks.
       * @param requestBody The input data
       * @returns TimePlanAssociateWithInboxTasksResult Successful response
       * @throws ApiError
       */
      timePlanAssociateWithInboxTasks(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-associate-with-inbox-tasks",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Command for updating the time configuration of a time_plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanChangeTimeConfig(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-change-time-config",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for creating a time plan.
       * @param requestBody The input data
       * @returns TimePlanCreateResult Successful response
       * @throws ApiError
       */
      timePlanCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding time plans.
       * @param requestBody The input data
       * @returns TimePlanFindResult Successful response
       * @throws ApiError
       */
      timePlanFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for generating new tasks for a time plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanGenForTimePlan(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-gen-for-time-plan",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading details about a time plan.
       * @param requestBody The input data
       * @returns TimePlanLoadResult Successful response
       * @throws ApiError
       */
      timePlanLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading details about a time plan.
       * @param requestBody The input data
       * @returns TimePlanLoadForDateAndPeriodResult Successful response
       * @throws ApiError
       */
      timePlanLoadForTimeDateAndPeriod(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-load-for-time-date-and-period",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around journals.
       * @param requestBody The input data
       * @returns TimePlanLoadSettingsResult Successful response
       * @throws ApiError
       */
      timePlanLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * A use case for regenerating time plans.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanRegen(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-regen",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for removing a time_plan.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Command for updating the settings for time plans in general.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      timePlanUpdateSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/time-plan-update-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.TimePlansService = TimePlansService;
  }
});

// ../../gen/ts/webapi-client/dist/services/TodoService.js
var require_TodoService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/TodoService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TodoService = void 0;
    var TodoService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a todo task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      todoTaskArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/todo-task-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a todo task.
       * @param requestBody The input data
       * @returns TodoTaskCreateResult Successful response
       * @throws ApiError
       */
      todoTaskCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/todo-task-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding todo tasks.
       * @param requestBody The input data
       * @returns TodoTaskFindResult Successful response
       * @throws ApiError
       */
      todoTaskFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/todo-task-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular todo task.
       * @param requestBody The input data
       * @returns TodoTaskLoadResult Successful response
       * @throws ApiError
       */
      todoTaskLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/todo-task-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a todo task.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      todoTaskRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/todo-task-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a todo task.
       * @param requestBody The input data
       * @returns TodoTaskUpdateResult Successful response
       * @throws ApiError
       */
      todoTaskUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/todo-task-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.TodoService = TodoService;
  }
});

// ../../gen/ts/webapi-client/dist/services/UsersService.js
var require_UsersService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/UsersService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UsersService = void 0;
    var UsersService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for loading the web UI settings for the current user.
       * @param requestBody The input data
       * @returns WebUiSettingsLoadResult Successful response
       * @throws ApiError
       */
      webUiSettingsLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/web-ui-settings-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating the web UI settings for the current user.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      webUiSettingsUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/web-ui-settings-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Usecase for changing the feature flags for the user.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      userChangeFeatureFlags(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/user-change-feature-flags",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the current user.
       * @param requestBody The input data
       * @returns UserLoadResult Successful response
       * @throws ApiError
       */
      userLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/user-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a user's properties.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      userUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/user-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.UsersService = UsersService;
  }
});

// ../../gen/ts/webapi-client/dist/services/VacationsService.js
var require_VacationsService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/VacationsService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VacationsService = void 0;
    var VacationsService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for archiving a vacation.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      vacationArchive(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vacation-archive",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for creating a vacation.
       * @param requestBody The input data
       * @returns VacationCreateResult Successful response
       * @throws ApiError
       */
      vacationCreate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vacation-create",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for finding vacations.
       * @param requestBody The input data
       * @returns VacationFindResult Successful response
       * @throws ApiError
       */
      vacationFind(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vacation-find",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * Use case for loading a particular vacation.
       * @param requestBody The input data
       * @returns VacationLoadResult Successful response
       * @throws ApiError
       */
      vacationLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vacation-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for removing a vacation.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      vacationRemove(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vacation-remove",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating a vacation's properties.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      vacationUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/vacation-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.VacationsService = VacationsService;
  }
});

// ../../gen/ts/webapi-client/dist/services/WorkingMemService.js
var require_WorkingMemService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/WorkingMemService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkingMemService = void 0;
    var WorkingMemService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * The command for loading the current working mem.
       * @param requestBody The input data
       * @returns WorkingMemLoadCurrentResult Successful response
       * @throws ApiError
       */
      workingMemLoadCurrent(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/working-mem-load-current",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading the settings around workingmem.
       * @param requestBody The input data
       * @returns WorkingMemLoadSettingsResult Successful response
       * @throws ApiError
       */
      workingMemLoadSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/working-mem-load-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for updating the settings for working mem.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      workingMemUpdateSettings(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/working-mem-update-settings",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.WorkingMemService = WorkingMemService;
  }
});

// ../../gen/ts/webapi-client/dist/services/WorkspacesService.js
var require_WorkspacesService = __commonJS({
  "../../gen/ts/webapi-client/dist/services/WorkspacesService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkspacesService = void 0;
    var WorkspacesService = class {
      constructor(httpRequest) {
        this.httpRequest = httpRequest;
      }
      /**
       * Usecase for changing the feature flags for the workspace.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      workspaceChangeFeatureFlags(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/workspace-change-feature-flags",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * The command for loading workspaces.
       * @param requestBody The input data
       * @returns WorkspaceLoadResult Successful response
       * @throws ApiError
       */
      workspaceLoad(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/workspace-load",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
      /**
       * UseCase for updating a workspace.
       * @param requestBody The input data
       * @returns any Successful response / Empty body
       * @throws ApiError
       */
      workspaceUpdate(requestBody) {
        return this.httpRequest.request({
          method: "POST",
          url: "/workspace-update",
          body: requestBody,
          mediaType: "application/json",
          errors: {
            400: `Error response for EntityAlreadyExistsError`,
            401: `Error response for ExpiredAuthTokenError`,
            404: `Error response for EntityNotFoundError`,
            406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
            409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
            410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
            422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
            426: `Error response for InvalidAuthTokenError`
          }
        });
      }
    };
    exports.WorkspacesService = WorkspacesService;
  }
});

// ../../gen/ts/webapi-client/dist/ApiClient.js
var require_ApiClient = __commonJS({
  "../../gen/ts/webapi-client/dist/ApiClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiClient = void 0;
    var FetchHttpRequest_1 = require_FetchHttpRequest();
    var ApiKeyService_1 = require_ApiKeyService();
    var ApplicationService_1 = require_ApplicationService();
    var AuthService_1 = require_AuthService();
    var BigPlansService_1 = require_BigPlansService();
    var CalendarService_1 = require_CalendarService();
    var ChoresService_1 = require_ChoresService();
    var ContactsService_1 = require_ContactsService();
    var DocsService_1 = require_DocsService();
    var GcService_1 = require_GcService();
    var GenService_1 = require_GenService();
    var HabitsService_1 = require_HabitsService();
    var HomeService_1 = require_HomeService();
    var InboxTasksService_1 = require_InboxTasksService();
    var InfraService_1 = require_InfraService();
    var JournalsService_1 = require_JournalsService();
    var LifePlanService_1 = require_LifePlanService();
    var McpKeyService_1 = require_McpKeyService();
    var MetricsService_1 = require_MetricsService();
    var MotdService_1 = require_MotdService();
    var NotesService_1 = require_NotesService();
    var PrmService_1 = require_PrmService();
    var PushIntegrationsService_1 = require_PushIntegrationsService();
    var ReportService_1 = require_ReportService();
    var ScheduleService_1 = require_ScheduleService();
    var SearchService_1 = require_SearchService();
    var SmartListsService_1 = require_SmartListsService();
    var StatsService_1 = require_StatsService();
    var TagsService_1 = require_TagsService();
    var TestHelperService_1 = require_TestHelperService();
    var TimeEventsService_1 = require_TimeEventsService();
    var TimePlansService_1 = require_TimePlansService();
    var TodoService_1 = require_TodoService();
    var UsersService_1 = require_UsersService();
    var VacationsService_1 = require_VacationsService();
    var WorkingMemService_1 = require_WorkingMemService();
    var WorkspacesService_1 = require_WorkspacesService();
    var ApiClient = class {
      constructor(config, HttpRequest = FetchHttpRequest_1.FetchHttpRequest) {
        var _a, _b, _c, _d;
        this.request = new HttpRequest({
          BASE: (_a = config === null || config === void 0 ? void 0 : config.BASE) !== null && _a !== void 0 ? _a : "",
          VERSION: (_b = config === null || config === void 0 ? void 0 : config.VERSION) !== null && _b !== void 0 ? _b : "1.3.2",
          WITH_CREDENTIALS: (_c = config === null || config === void 0 ? void 0 : config.WITH_CREDENTIALS) !== null && _c !== void 0 ? _c : false,
          CREDENTIALS: (_d = config === null || config === void 0 ? void 0 : config.CREDENTIALS) !== null && _d !== void 0 ? _d : "include",
          TOKEN: config === null || config === void 0 ? void 0 : config.TOKEN,
          USERNAME: config === null || config === void 0 ? void 0 : config.USERNAME,
          PASSWORD: config === null || config === void 0 ? void 0 : config.PASSWORD,
          HEADERS: config === null || config === void 0 ? void 0 : config.HEADERS,
          ENCODE_PATH: config === null || config === void 0 ? void 0 : config.ENCODE_PATH
        });
        this.apiKey = new ApiKeyService_1.ApiKeyService(this.request);
        this.application = new ApplicationService_1.ApplicationService(this.request);
        this.auth = new AuthService_1.AuthService(this.request);
        this.bigPlans = new BigPlansService_1.BigPlansService(this.request);
        this.calendar = new CalendarService_1.CalendarService(this.request);
        this.chores = new ChoresService_1.ChoresService(this.request);
        this.contacts = new ContactsService_1.ContactsService(this.request);
        this.docs = new DocsService_1.DocsService(this.request);
        this.gc = new GcService_1.GcService(this.request);
        this.gen = new GenService_1.GenService(this.request);
        this.habits = new HabitsService_1.HabitsService(this.request);
        this.home = new HomeService_1.HomeService(this.request);
        this.inboxTasks = new InboxTasksService_1.InboxTasksService(this.request);
        this.infra = new InfraService_1.InfraService(this.request);
        this.journals = new JournalsService_1.JournalsService(this.request);
        this.lifePlan = new LifePlanService_1.LifePlanService(this.request);
        this.mcpKey = new McpKeyService_1.McpKeyService(this.request);
        this.metrics = new MetricsService_1.MetricsService(this.request);
        this.motd = new MotdService_1.MotdService(this.request);
        this.notes = new NotesService_1.NotesService(this.request);
        this.prm = new PrmService_1.PrmService(this.request);
        this.pushIntegrations = new PushIntegrationsService_1.PushIntegrationsService(this.request);
        this.report = new ReportService_1.ReportService(this.request);
        this.schedule = new ScheduleService_1.ScheduleService(this.request);
        this.search = new SearchService_1.SearchService(this.request);
        this.smartLists = new SmartListsService_1.SmartListsService(this.request);
        this.stats = new StatsService_1.StatsService(this.request);
        this.tags = new TagsService_1.TagsService(this.request);
        this.testHelper = new TestHelperService_1.TestHelperService(this.request);
        this.timeEvents = new TimeEventsService_1.TimeEventsService(this.request);
        this.timePlans = new TimePlansService_1.TimePlansService(this.request);
        this.todo = new TodoService_1.TodoService(this.request);
        this.users = new UsersService_1.UsersService(this.request);
        this.vacations = new VacationsService_1.VacationsService(this.request);
        this.workingMem = new WorkingMemService_1.WorkingMemService(this.request);
        this.workspaces = new WorkspacesService_1.WorkspacesService(this.request);
      }
    };
    exports.ApiClient = ApiClient;
  }
});

// ../../gen/ts/webapi-client/dist/core/OpenAPI.js
var require_OpenAPI = __commonJS({
  "../../gen/ts/webapi-client/dist/core/OpenAPI.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenAPI = void 0;
    exports.OpenAPI = {
      BASE: "",
      VERSION: "1.3.2",
      WITH_CREDENTIALS: false,
      CREDENTIALS: "include",
      TOKEN: void 0,
      USERNAME: void 0,
      PASSWORD: void 0,
      HEADERS: void 0,
      ENCODE_PATH: void 0
    };
  }
});

// ../../gen/ts/webapi-client/dist/models/AppComponent.js
var require_AppComponent = __commonJS({
  "../../gen/ts/webapi-client/dist/models/AppComponent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppComponent = void 0;
    var AppComponent;
    (function(AppComponent2) {
      AppComponent2["WEB"] = "web";
      AppComponent2["CLI"] = "cli";
      AppComponent2["APP"] = "app";
      AppComponent2["GC_CRON"] = "gc-cron";
      AppComponent2["GEN_CRON"] = "gen-cron";
      AppComponent2["STATS_CRON"] = "stats-cron";
      AppComponent2["SCHEDULE_EXTERNAL_SYNC_CRON"] = "schedule-external-sync-cron";
      AppComponent2["SEARCH_INDEX_BACKFILL"] = "search-index-backfill";
      AppComponent2["SEARCH_MUTATION_LOG_DRAIN"] = "search-mutation-log-drain";
      AppComponent2["SEARCH_MUTATION_LOG_PROCESSING_REQUEUE"] = "search-mutation-log-processing-requeue";
    })(AppComponent || (exports.AppComponent = AppComponent = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/AppCore.js
var require_AppCore = __commonJS({
  "../../gen/ts/webapi-client/dist/models/AppCore.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppCore = void 0;
    var AppCore;
    (function(AppCore2) {
      AppCore2["CLI"] = "cli";
      AppCore2["WEBUI"] = "webui";
      AppCore2["API"] = "api";
      AppCore2["MCP"] = "mcp";
    })(AppCore || (exports.AppCore = AppCore = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/AppDistribution.js
var require_AppDistribution = __commonJS({
  "../../gen/ts/webapi-client/dist/models/AppDistribution.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppDistribution = void 0;
    var AppDistribution;
    (function(AppDistribution2) {
      AppDistribution2["WEB"] = "web";
      AppDistribution2["MAC_WEB"] = "mac-web";
      AppDistribution2["MAC_STORE"] = "mac-store";
      AppDistribution2["APP_STORE"] = "app-store";
      AppDistribution2["GOOGLE_PLAY_STORE"] = "google-play-store";
      AppDistribution2["API"] = "api";
      AppDistribution2["MCP"] = "mcp";
    })(AppDistribution || (exports.AppDistribution = AppDistribution = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/AppDistributionState.js
var require_AppDistributionState = __commonJS({
  "../../gen/ts/webapi-client/dist/models/AppDistributionState.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppDistributionState = void 0;
    var AppDistributionState;
    (function(AppDistributionState2) {
      AppDistributionState2["READY"] = "ready";
      AppDistributionState2["IN_REVIEW"] = "in-review";
      AppDistributionState2["NOT_AVAILABLE"] = "not-available";
    })(AppDistributionState || (exports.AppDistributionState = AppDistributionState = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/AppPlatform.js
var require_AppPlatform = __commonJS({
  "../../gen/ts/webapi-client/dist/models/AppPlatform.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppPlatform = void 0;
    var AppPlatform;
    (function(AppPlatform2) {
      AppPlatform2["DESKTOP_MACOS"] = "desktop-macos";
      AppPlatform2["MOBILE_IOS"] = "mobile-ios";
      AppPlatform2["MOBILE_ANDROID"] = "mobile-android";
      AppPlatform2["TABLET_IOS"] = "tablet-ios";
      AppPlatform2["TABLET_ANDROID"] = "tablet-android";
      AppPlatform2["API"] = "api";
      AppPlatform2["MCP"] = "mcp";
    })(AppPlatform || (exports.AppPlatform = AppPlatform = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/AppShell.js
var require_AppShell = __commonJS({
  "../../gen/ts/webapi-client/dist/models/AppShell.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppShell = void 0;
    var AppShell;
    (function(AppShell2) {
      AppShell2["CLI"] = "cli";
      AppShell2["BROWSER"] = "browser";
      AppShell2["DESKTOP_ELECTRON"] = "desktop-electron";
      AppShell2["MOBILE_CAPACITOR"] = "mobile-capacitor";
      AppShell2["PWA"] = "pwa";
      AppShell2["API"] = "api";
      AppShell2["MCP"] = "mcp";
    })(AppShell || (exports.AppShell = AppShell = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/BigPlanStatus.js
var require_BigPlanStatus = __commonJS({
  "../../gen/ts/webapi-client/dist/models/BigPlanStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BigPlanStatus = void 0;
    var BigPlanStatus;
    (function(BigPlanStatus2) {
      BigPlanStatus2["NOT_STARTED"] = "not-started";
      BigPlanStatus2["IN_PROGRESS"] = "in-progress";
      BigPlanStatus2["BLOCKED"] = "blocked";
      BigPlanStatus2["NOT_DONE"] = "not-done";
      BigPlanStatus2["DONE"] = "done";
    })(BigPlanStatus || (exports.BigPlanStatus = BigPlanStatus = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/BigScreenHomeTabWidgetPlacement.js
var require_BigScreenHomeTabWidgetPlacement = __commonJS({
  "../../gen/ts/webapi-client/dist/models/BigScreenHomeTabWidgetPlacement.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BigScreenHomeTabWidgetPlacement = void 0;
    var BigScreenHomeTabWidgetPlacement;
    (function(BigScreenHomeTabWidgetPlacement2) {
      let kind;
      (function(kind2) {
        kind2["BIG_SCREEN"] = "big-screen";
      })(kind = BigScreenHomeTabWidgetPlacement2.kind || (BigScreenHomeTabWidgetPlacement2.kind = {}));
    })(BigScreenHomeTabWidgetPlacement || (exports.BigScreenHomeTabWidgetPlacement = BigScreenHomeTabWidgetPlacement = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/BulletedListBlock.js
var require_BulletedListBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/BulletedListBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BulletedListBlock = void 0;
    var BulletedListBlock;
    (function(BulletedListBlock2) {
      let kind;
      (function(kind2) {
        kind2["BULLETED_LIST"] = "bulleted-list";
      })(kind = BulletedListBlock2.kind || (BulletedListBlock2.kind = {}));
    })(BulletedListBlock || (exports.BulletedListBlock = BulletedListBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/ChecklistBlock.js
var require_ChecklistBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/ChecklistBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChecklistBlock = void 0;
    var ChecklistBlock;
    (function(ChecklistBlock2) {
      let kind;
      (function(kind2) {
        kind2["CHECKLIST"] = "checklist";
      })(kind = ChecklistBlock2.kind || (ChecklistBlock2.kind = {}));
    })(ChecklistBlock || (exports.ChecklistBlock = ChecklistBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/CodeBlock.js
var require_CodeBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/CodeBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeBlock = void 0;
    var CodeBlock;
    (function(CodeBlock2) {
      let kind;
      (function(kind2) {
        kind2["CODE"] = "code";
      })(kind = CodeBlock2.kind || (CodeBlock2.kind = {}));
    })(CodeBlock || (exports.CodeBlock = CodeBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/Difficulty.js
var require_Difficulty = __commonJS({
  "../../gen/ts/webapi-client/dist/models/Difficulty.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Difficulty = void 0;
    var Difficulty;
    (function(Difficulty2) {
      Difficulty2["HARD"] = "hard";
      Difficulty2["MEDIUM"] = "medium";
      Difficulty2["EASY"] = "easy";
    })(Difficulty || (exports.Difficulty = Difficulty = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/DividerBlock.js
var require_DividerBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/DividerBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DividerBlock = void 0;
    var DividerBlock;
    (function(DividerBlock2) {
      let kind;
      (function(kind2) {
        kind2["DIVIDER"] = "divider";
      })(kind = DividerBlock2.kind || (DividerBlock2.kind = {}));
    })(DividerBlock || (exports.DividerBlock = DividerBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/DocsHelpSubject.js
var require_DocsHelpSubject = __commonJS({
  "../../gen/ts/webapi-client/dist/models/DocsHelpSubject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DocsHelpSubject = void 0;
    var DocsHelpSubject;
    (function(DocsHelpSubject2) {
      DocsHelpSubject2["ROOT"] = "root";
      DocsHelpSubject2["HOME"] = "home";
      DocsHelpSubject2["GAMIFICATION"] = "gamification";
      DocsHelpSubject2["TODOS"] = "todos";
      DocsHelpSubject2["WORKING_MEM"] = "working-mem";
      DocsHelpSubject2["TIME_PLANS"] = "time-plans";
      DocsHelpSubject2["SCHEDULE"] = "schedule";
      DocsHelpSubject2["HABITS"] = "habits";
      DocsHelpSubject2["CHORES"] = "chores";
      DocsHelpSubject2["BIG_PLANS"] = "big-plans";
      DocsHelpSubject2["JOURNALS"] = "journals";
      DocsHelpSubject2["DOCS"] = "docs";
      DocsHelpSubject2["VACATIONS"] = "vacations";
      DocsHelpSubject2["LIFE_PLAN"] = "life-plan";
      DocsHelpSubject2["LIFE_PLAN_ASPECTS"] = "life-plan/aspects";
      DocsHelpSubject2["LIFE_PLAN_CHAPTERS"] = "life-plan/chapters";
      DocsHelpSubject2["LIFE_PLAN_GOALS"] = "life-plan/goals";
      DocsHelpSubject2["LIFE_PLAN_MILESTONES"] = "life-plan/milestones";
      DocsHelpSubject2["LIFE_PLAN_VISIONS"] = "life-plan/visions";
      DocsHelpSubject2["SMART_LISTS"] = "smart-lists";
      DocsHelpSubject2["METRICS"] = "metrics";
      DocsHelpSubject2["PRM"] = "prm";
      DocsHelpSubject2["PRM_PERSONS"] = "prm/persons";
      DocsHelpSubject2["PRM_OCCASIONS"] = "prm/occasions";
      DocsHelpSubject2["PRM_CIRCLES"] = "prm/circles";
      DocsHelpSubject2["SLACK_TASKS"] = "slack-tasks";
      DocsHelpSubject2["EMAIL_TASKS"] = "email-tasks";
      DocsHelpSubject2["SELF_HOSTING"] = "self-hosting";
      DocsHelpSubject2["API"] = "api";
      DocsHelpSubject2["MCP"] = "mcp";
    })(DocsHelpSubject || (exports.DocsHelpSubject = DocsHelpSubject = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/Eisen.js
var require_Eisen = __commonJS({
  "../../gen/ts/webapi-client/dist/models/Eisen.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Eisen = void 0;
    var Eisen;
    (function(Eisen2) {
      Eisen2["IMPORTANT_AND_URGENT"] = "important-and-urgent";
      Eisen2["IMPORTANT"] = "important";
      Eisen2["URGENT"] = "urgent";
      Eisen2["REGULAR"] = "regular";
    })(Eisen || (exports.Eisen = Eisen = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/EntityReferenceBlock.js
var require_EntityReferenceBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/EntityReferenceBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntityReferenceBlock = void 0;
    var EntityReferenceBlock;
    (function(EntityReferenceBlock2) {
      let kind;
      (function(kind2) {
        kind2["ENTITY_REFERENCE"] = "entity-reference";
      })(kind = EntityReferenceBlock2.kind || (EntityReferenceBlock2.kind = {}));
    })(EntityReferenceBlock || (exports.EntityReferenceBlock = EntityReferenceBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/Env.js
var require_Env = __commonJS({
  "../../gen/ts/webapi-client/dist/models/Env.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Env = void 0;
    var Env;
    (function(Env2) {
      Env2["PRODUCTION"] = "production";
      Env2["STAGING"] = "staging";
      Env2["LOCAL"] = "local";
    })(Env || (exports.Env = Env = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/FeatureControl.js
var require_FeatureControl = __commonJS({
  "../../gen/ts/webapi-client/dist/models/FeatureControl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FeatureControl = void 0;
    var FeatureControl;
    (function(FeatureControl2) {
      FeatureControl2["ALWAYS_ON"] = "always-on";
      FeatureControl2["ALWAYS_OFF_TECH"] = "always-off-tech";
      FeatureControl2["ALWAYS_OFF_HOSTING"] = "always-off-hosting";
      FeatureControl2["USER"] = "user";
    })(FeatureControl || (exports.FeatureControl = FeatureControl = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/HabitRepeatsStrategy.js
var require_HabitRepeatsStrategy = __commonJS({
  "../../gen/ts/webapi-client/dist/models/HabitRepeatsStrategy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HabitRepeatsStrategy = void 0;
    var HabitRepeatsStrategy;
    (function(HabitRepeatsStrategy2) {
      HabitRepeatsStrategy2["ALL_SAME"] = "all-same";
      HabitRepeatsStrategy2["SPREAD_OUT_NO_OVERLAP"] = "spread-out-no-overlap";
    })(HabitRepeatsStrategy || (exports.HabitRepeatsStrategy = HabitRepeatsStrategy = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/HeadingBlock.js
var require_HeadingBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/HeadingBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HeadingBlock = void 0;
    var HeadingBlock;
    (function(HeadingBlock2) {
      let kind;
      (function(kind2) {
        kind2["HEADING"] = "heading";
      })(kind = HeadingBlock2.kind || (HeadingBlock2.kind = {}));
    })(HeadingBlock || (exports.HeadingBlock = HeadingBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/HomeTabTarget.js
var require_HomeTabTarget = __commonJS({
  "../../gen/ts/webapi-client/dist/models/HomeTabTarget.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HomeTabTarget = void 0;
    var HomeTabTarget;
    (function(HomeTabTarget2) {
      HomeTabTarget2["BIG_SCREEN"] = "big-screen";
      HomeTabTarget2["SMALL_SCREEN"] = "small-screen";
    })(HomeTabTarget || (exports.HomeTabTarget = HomeTabTarget = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/Hosting.js
var require_Hosting = __commonJS({
  "../../gen/ts/webapi-client/dist/models/Hosting.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hosting = void 0;
    var Hosting;
    (function(Hosting2) {
      Hosting2["HOSTED_GLOBAL"] = "hosted-global";
      Hosting2["SELF_HOSTED"] = "self-hosted";
      Hosting2["LOCAL"] = "local";
    })(Hosting || (exports.Hosting = Hosting = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/InboxTaskStatus.js
var require_InboxTaskStatus = __commonJS({
  "../../gen/ts/webapi-client/dist/models/InboxTaskStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InboxTaskStatus = void 0;
    var InboxTaskStatus;
    (function(InboxTaskStatus2) {
      InboxTaskStatus2["NOT_STARTED"] = "not-started";
      InboxTaskStatus2["IN_PROGRESS"] = "in-progress";
      InboxTaskStatus2["BLOCKED"] = "blocked";
      InboxTaskStatus2["NOT_DONE"] = "not-done";
      InboxTaskStatus2["DONE"] = "done";
    })(InboxTaskStatus || (exports.InboxTaskStatus = InboxTaskStatus = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/JournalGenerationApproach.js
var require_JournalGenerationApproach = __commonJS({
  "../../gen/ts/webapi-client/dist/models/JournalGenerationApproach.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JournalGenerationApproach = void 0;
    var JournalGenerationApproach;
    (function(JournalGenerationApproach2) {
      JournalGenerationApproach2["BOTH_JOURNAL_AND_TASK"] = "both-journal-and-task";
      JournalGenerationApproach2["ONLY_JOURNAL"] = "only-journal";
      JournalGenerationApproach2["NONE"] = "none";
    })(JournalGenerationApproach || (exports.JournalGenerationApproach = JournalGenerationApproach = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/JournalSource.js
var require_JournalSource = __commonJS({
  "../../gen/ts/webapi-client/dist/models/JournalSource.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JournalSource = void 0;
    var JournalSource;
    (function(JournalSource2) {
      JournalSource2["USER"] = "user";
      JournalSource2["GENERATED"] = "generated";
    })(JournalSource || (exports.JournalSource = JournalSource = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/JupiterArchivalReason.js
var require_JupiterArchivalReason = __commonJS({
  "../../gen/ts/webapi-client/dist/models/JupiterArchivalReason.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JupiterArchivalReason = void 0;
    var JupiterArchivalReason;
    (function(JupiterArchivalReason2) {
      JupiterArchivalReason2["USER"] = "user";
      JupiterArchivalReason2["GC"] = "gc";
      JupiterArchivalReason2["SYNC"] = "sync";
    })(JupiterArchivalReason || (exports.JupiterArchivalReason = JupiterArchivalReason = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/LifePlanEvalApproach.js
var require_LifePlanEvalApproach = __commonJS({
  "../../gen/ts/webapi-client/dist/models/LifePlanEvalApproach.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LifePlanEvalApproach = void 0;
    var LifePlanEvalApproach;
    (function(LifePlanEvalApproach2) {
      LifePlanEvalApproach2["TASK"] = "task";
      LifePlanEvalApproach2["NONE"] = "none";
    })(LifePlanEvalApproach || (exports.LifePlanEvalApproach = LifePlanEvalApproach = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/LinkBlock.js
var require_LinkBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/LinkBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LinkBlock = void 0;
    var LinkBlock;
    (function(LinkBlock2) {
      let kind;
      (function(kind2) {
        kind2["LINK"] = "link";
      })(kind = LinkBlock2.kind || (LinkBlock2.kind = {}));
    })(LinkBlock || (exports.LinkBlock = LinkBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/MetricDirection.js
var require_MetricDirection = __commonJS({
  "../../gen/ts/webapi-client/dist/models/MetricDirection.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetricDirection = void 0;
    var MetricDirection;
    (function(MetricDirection2) {
      MetricDirection2["NONE"] = "none";
      MetricDirection2["UP_IS_GOOD"] = "up_is_good";
      MetricDirection2["DOWN_IS_GOOD"] = "down_is_good";
    })(MetricDirection || (exports.MetricDirection = MetricDirection = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/MetricUnit.js
var require_MetricUnit = __commonJS({
  "../../gen/ts/webapi-client/dist/models/MetricUnit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetricUnit = void 0;
    var MetricUnit;
    (function(MetricUnit2) {
      MetricUnit2["COUNT"] = "count";
      MetricUnit2["MONEY"] = "money";
      MetricUnit2["WEIGHT"] = "weight";
    })(MetricUnit || (exports.MetricUnit = MetricUnit = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/NamedEntityTag.js
var require_NamedEntityTag = __commonJS({
  "../../gen/ts/webapi-client/dist/models/NamedEntityTag.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NamedEntityTag = void 0;
    var NamedEntityTag;
    (function(NamedEntityTag2) {
      NamedEntityTag2["OTHER"] = "Other";
      NamedEntityTag2["SCORE_LOG_ENTRY"] = "ScoreLogEntry";
      NamedEntityTag2["HOME_TAB"] = "HomeTab";
      NamedEntityTag2["HOME_WIDGET"] = "HomeWidget";
      NamedEntityTag2["TODO_TASK"] = "TodoTask";
      NamedEntityTag2["WORKING_MEM"] = "WorkingMem";
      NamedEntityTag2["TIME_PLAN"] = "TimePlan";
      NamedEntityTag2["TIME_PLAN_ACTIVITY"] = "TimePlanActivity";
      NamedEntityTag2["SCHEDULE_STREAM"] = "ScheduleStream";
      NamedEntityTag2["SCHEDULE_EXPORT"] = "ScheduleExport";
      NamedEntityTag2["SCHEDULE_EVENT_IN_DAY"] = "ScheduleEventInDay";
      NamedEntityTag2["SCHEDULE_EVENT_FULL_DAYS"] = "ScheduleEventFullDays";
      NamedEntityTag2["SCHEDULE_EXTERNAL_SYNC_LOG"] = "ScheduleExternalSyncLog";
      NamedEntityTag2["HABIT"] = "Habit";
      NamedEntityTag2["CHORE"] = "Chore";
      NamedEntityTag2["BIG_PLAN"] = "BigPlan";
      NamedEntityTag2["BIG_PLAN_MILESTONE"] = "BigPlanMilestone";
      NamedEntityTag2["DOC"] = "Doc";
      NamedEntityTag2["DIR"] = "Dir";
      NamedEntityTag2["JOURNAL"] = "Journal";
      NamedEntityTag2["CHAPTER"] = "Chapter";
      NamedEntityTag2["GOAL"] = "Goal";
      NamedEntityTag2["MILESTONE"] = "Milestone";
      NamedEntityTag2["VISION"] = "Vision";
      NamedEntityTag2["VACATION"] = "Vacation";
      NamedEntityTag2["ASPECT"] = "Aspect";
      NamedEntityTag2["SMART_LIST"] = "SmartList";
      NamedEntityTag2["SMART_LIST_ITEM"] = "SmartListItem";
      NamedEntityTag2["METRIC"] = "Metric";
      NamedEntityTag2["METRIC_ENTRY"] = "MetricEntry";
      NamedEntityTag2["PERSON"] = "Person";
      NamedEntityTag2["OCCASION"] = "Occasion";
      NamedEntityTag2["CIRCLE"] = "Circle";
      NamedEntityTag2["SLACK_TASK"] = "SlackTask";
      NamedEntityTag2["EMAIL_TASK"] = "EmailTask";
    })(NamedEntityTag || (exports.NamedEntityTag = NamedEntityTag = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/NumberedListBlock.js
var require_NumberedListBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/NumberedListBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberedListBlock = void 0;
    var NumberedListBlock;
    (function(NumberedListBlock2) {
      let kind;
      (function(kind2) {
        kind2["NUMBERED_LIST"] = "numbered-list";
      })(kind = NumberedListBlock2.kind || (NumberedListBlock2.kind = {}));
    })(NumberedListBlock || (exports.NumberedListBlock = NumberedListBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/OccasionKind.js
var require_OccasionKind = __commonJS({
  "../../gen/ts/webapi-client/dist/models/OccasionKind.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OccasionKind = void 0;
    var OccasionKind;
    (function(OccasionKind2) {
      OccasionKind2["BIRTHDAY"] = "birthday";
      OccasionKind2["ANNIVERSARY"] = "anniversary";
      OccasionKind2["HOLIDAY"] = "holiday";
      OccasionKind2["OTHER"] = "other";
    })(OccasionKind || (exports.OccasionKind = OccasionKind = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/ParagraphBlock.js
var require_ParagraphBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/ParagraphBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParagraphBlock = void 0;
    var ParagraphBlock;
    (function(ParagraphBlock2) {
      let kind;
      (function(kind2) {
        kind2["PARAGRAPH"] = "paragraph";
      })(kind = ParagraphBlock2.kind || (ParagraphBlock2.kind = {}));
    })(ParagraphBlock || (exports.ParagraphBlock = ParagraphBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/PartialDateType.js
var require_PartialDateType = __commonJS({
  "../../gen/ts/webapi-client/dist/models/PartialDateType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PartialDateType = void 0;
    var PartialDateType;
    (function(PartialDateType2) {
      PartialDateType2["ABSOLUTE_YEAR_MONTH_DAY"] = "absolute-year-month-day";
      PartialDateType2["ABSOLUTE_YEAR_MONTH"] = "absolute-year-month";
      PartialDateType2["ABSOLUTE_YEAR"] = "absolute-year";
      PartialDateType2["RELATIVE_YEAR"] = "relative-year";
      PartialDateType2["RELATIVE_DECADE"] = "relative-decade";
      PartialDateType2["MILESTONE"] = "milestone";
      PartialDateType2["PRESENT"] = "present";
      PartialDateType2["START"] = "start";
      PartialDateType2["END"] = "end";
    })(PartialDateType || (exports.PartialDateType = PartialDateType = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/QuoteBlock.js
var require_QuoteBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/QuoteBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuoteBlock = void 0;
    var QuoteBlock;
    (function(QuoteBlock2) {
      let kind;
      (function(kind2) {
        kind2["QUOTE"] = "quote";
      })(kind = QuoteBlock2.kind || (QuoteBlock2.kind = {}));
    })(QuoteBlock || (exports.QuoteBlock = QuoteBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/RecurringTaskPeriod.js
var require_RecurringTaskPeriod = __commonJS({
  "../../gen/ts/webapi-client/dist/models/RecurringTaskPeriod.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RecurringTaskPeriod = void 0;
    var RecurringTaskPeriod;
    (function(RecurringTaskPeriod2) {
      RecurringTaskPeriod2["DAILY"] = "daily";
      RecurringTaskPeriod2["WEEKLY"] = "weekly";
      RecurringTaskPeriod2["MONTHLY"] = "monthly";
      RecurringTaskPeriod2["QUARTERLY"] = "quarterly";
      RecurringTaskPeriod2["YEARLY"] = "yearly";
    })(RecurringTaskPeriod || (exports.RecurringTaskPeriod = RecurringTaskPeriod = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/ReportBreakdown.js
var require_ReportBreakdown = __commonJS({
  "../../gen/ts/webapi-client/dist/models/ReportBreakdown.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportBreakdown = void 0;
    var ReportBreakdown;
    (function(ReportBreakdown2) {
      ReportBreakdown2["GLOBAL"] = "global";
      ReportBreakdown2["PERIODS"] = "periods";
      ReportBreakdown2["ASPECTS"] = "aspects";
      ReportBreakdown2["GOALS"] = "goals";
      ReportBreakdown2["HABITS"] = "habits";
      ReportBreakdown2["CHORES"] = "chores";
      ReportBreakdown2["BIG_PLANS"] = "big-plans";
    })(ReportBreakdown || (exports.ReportBreakdown = ReportBreakdown = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/ScheduleStreamColor.js
var require_ScheduleStreamColor = __commonJS({
  "../../gen/ts/webapi-client/dist/models/ScheduleStreamColor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScheduleStreamColor = void 0;
    var ScheduleStreamColor;
    (function(ScheduleStreamColor2) {
      ScheduleStreamColor2["BLUE"] = "blue";
      ScheduleStreamColor2["GREEN"] = "green";
      ScheduleStreamColor2["RED"] = "red";
      ScheduleStreamColor2["YELLOW"] = "yellow";
      ScheduleStreamColor2["PURPLE"] = "purple";
      ScheduleStreamColor2["ORANGE"] = "orange";
      ScheduleStreamColor2["GRAY"] = "gray";
      ScheduleStreamColor2["BROWN"] = "brown";
      ScheduleStreamColor2["CYAN"] = "cyan";
      ScheduleStreamColor2["MAGENTA"] = "magenta";
    })(ScheduleStreamColor || (exports.ScheduleStreamColor = ScheduleStreamColor = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/ScheduleStreamSource.js
var require_ScheduleStreamSource = __commonJS({
  "../../gen/ts/webapi-client/dist/models/ScheduleStreamSource.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScheduleStreamSource = void 0;
    var ScheduleStreamSource;
    (function(ScheduleStreamSource2) {
      ScheduleStreamSource2["USER"] = "user";
      ScheduleStreamSource2["EXTERNAL_ICAL"] = "external-ical";
    })(ScheduleStreamSource || (exports.ScheduleStreamSource = ScheduleStreamSource = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/ScoreSource.js
var require_ScoreSource = __commonJS({
  "../../gen/ts/webapi-client/dist/models/ScoreSource.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScoreSource = void 0;
    var ScoreSource;
    (function(ScoreSource2) {
      ScoreSource2["INBOX_TASK"] = "inbox-task";
      ScoreSource2["BIG_PLAN"] = "big-plan";
    })(ScoreSource || (exports.ScoreSource = ScoreSource = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/SearchMutationLogStatus.js
var require_SearchMutationLogStatus = __commonJS({
  "../../gen/ts/webapi-client/dist/models/SearchMutationLogStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchMutationLogStatus = void 0;
    var SearchMutationLogStatus;
    (function(SearchMutationLogStatus2) {
      SearchMutationLogStatus2["UNINDEXED"] = "unindexed";
      SearchMutationLogStatus2["PROCESSING"] = "processing";
      SearchMutationLogStatus2["INDEXED"] = "indexed";
      SearchMutationLogStatus2["ERROR"] = "error";
    })(SearchMutationLogStatus || (exports.SearchMutationLogStatus = SearchMutationLogStatus = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/SmallScreenHomeTabWidgetPlacement.js
var require_SmallScreenHomeTabWidgetPlacement = __commonJS({
  "../../gen/ts/webapi-client/dist/models/SmallScreenHomeTabWidgetPlacement.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmallScreenHomeTabWidgetPlacement = void 0;
    var SmallScreenHomeTabWidgetPlacement;
    (function(SmallScreenHomeTabWidgetPlacement2) {
      let kind;
      (function(kind2) {
        kind2["SMALL_SCREEN"] = "small-screen";
      })(kind = SmallScreenHomeTabWidgetPlacement2.kind || (SmallScreenHomeTabWidgetPlacement2.kind = {}));
    })(SmallScreenHomeTabWidgetPlacement || (exports.SmallScreenHomeTabWidgetPlacement = SmallScreenHomeTabWidgetPlacement = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/SyncTarget.js
var require_SyncTarget = __commonJS({
  "../../gen/ts/webapi-client/dist/models/SyncTarget.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SyncTarget = void 0;
    var SyncTarget;
    (function(SyncTarget2) {
      SyncTarget2["TODO_TASKS"] = "todo-tasks";
      SyncTarget2["WORKING_MEM"] = "working-mem";
      SyncTarget2["TIME_PLANS"] = "time-plans";
      SyncTarget2["SCHEDULE"] = "schedule";
      SyncTarget2["HABITS"] = "habits";
      SyncTarget2["CHORES"] = "chores";
      SyncTarget2["BIG_PLANS"] = "big-plans";
      SyncTarget2["JOURNALS"] = "journals";
      SyncTarget2["DOCS"] = "docs";
      SyncTarget2["VACATIONS"] = "vacations";
      SyncTarget2["ASPECTS"] = "aspects";
      SyncTarget2["CHAPTERS"] = "chapters";
      SyncTarget2["GOALS"] = "goals";
      SyncTarget2["MILESTONES"] = "milestones";
      SyncTarget2["VISIONS"] = "visions";
      SyncTarget2["SMART_LISTS"] = "smart-lists";
      SyncTarget2["METRICS"] = "metrics";
      SyncTarget2["PERSONS"] = "persons";
      SyncTarget2["OCCASIONS"] = "occasions";
      SyncTarget2["CIRCLES"] = "circles";
      SyncTarget2["SLACK_TASKS"] = "slack-tasks";
      SyncTarget2["EMAIL_TASKS"] = "email-tasks";
      SyncTarget2["GAMIFICATION"] = "gamification";
      SyncTarget2["LIFE_PLAN_EVAL"] = "life-plan-eval";
    })(SyncTarget || (exports.SyncTarget = SyncTarget = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/TableBlock.js
var require_TableBlock = __commonJS({
  "../../gen/ts/webapi-client/dist/models/TableBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TableBlock = void 0;
    var TableBlock;
    (function(TableBlock2) {
      let kind;
      (function(kind2) {
        kind2["TABLE"] = "table";
      })(kind = TableBlock2.kind || (TableBlock2.kind = {}));
    })(TableBlock || (exports.TableBlock = TableBlock = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/TimePlanActivityDoneness.js
var require_TimePlanActivityDoneness = __commonJS({
  "../../gen/ts/webapi-client/dist/models/TimePlanActivityDoneness.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePlanActivityDoneness = void 0;
    var TimePlanActivityDoneness;
    (function(TimePlanActivityDoneness2) {
      TimePlanActivityDoneness2["DONE"] = "done";
      TimePlanActivityDoneness2["NOT_DONE"] = "not-done";
      TimePlanActivityDoneness2["WORKING"] = "working";
    })(TimePlanActivityDoneness || (exports.TimePlanActivityDoneness = TimePlanActivityDoneness = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/TimePlanActivityFeasability.js
var require_TimePlanActivityFeasability = __commonJS({
  "../../gen/ts/webapi-client/dist/models/TimePlanActivityFeasability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePlanActivityFeasability = void 0;
    var TimePlanActivityFeasability;
    (function(TimePlanActivityFeasability2) {
      TimePlanActivityFeasability2["MUST_DO"] = "must-do";
      TimePlanActivityFeasability2["NICE_TO_HAVE"] = "nice-to-have";
      TimePlanActivityFeasability2["STRETCH"] = "stretch";
    })(TimePlanActivityFeasability || (exports.TimePlanActivityFeasability = TimePlanActivityFeasability = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/TimePlanActivityKind.js
var require_TimePlanActivityKind = __commonJS({
  "../../gen/ts/webapi-client/dist/models/TimePlanActivityKind.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePlanActivityKind = void 0;
    var TimePlanActivityKind;
    (function(TimePlanActivityKind2) {
      TimePlanActivityKind2["FINISH"] = "finish";
      TimePlanActivityKind2["MAKE_PROGRESS"] = "make-progress";
    })(TimePlanActivityKind || (exports.TimePlanActivityKind = TimePlanActivityKind = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/TimePlanGenerationApproach.js
var require_TimePlanGenerationApproach = __commonJS({
  "../../gen/ts/webapi-client/dist/models/TimePlanGenerationApproach.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePlanGenerationApproach = void 0;
    var TimePlanGenerationApproach;
    (function(TimePlanGenerationApproach2) {
      TimePlanGenerationApproach2["BOTH_PLAN_AND_TASK"] = "both-plan-and-task";
      TimePlanGenerationApproach2["ONLY_PLAN"] = "only-plan";
      TimePlanGenerationApproach2["NONE"] = "none";
    })(TimePlanGenerationApproach || (exports.TimePlanGenerationApproach = TimePlanGenerationApproach = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/TimePlanSource.js
var require_TimePlanSource = __commonJS({
  "../../gen/ts/webapi-client/dist/models/TimePlanSource.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePlanSource = void 0;
    var TimePlanSource;
    (function(TimePlanSource2) {
      TimePlanSource2["USER"] = "user";
      TimePlanSource2["GENERATED"] = "generated";
    })(TimePlanSource || (exports.TimePlanSource = TimePlanSource = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/UserCategory.js
var require_UserCategory = __commonJS({
  "../../gen/ts/webapi-client/dist/models/UserCategory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserCategory = void 0;
    var UserCategory;
    (function(UserCategory2) {
      UserCategory2["STANDARD"] = "standard";
      UserCategory2["APP_STORE_TEST"] = "app-store-test";
    })(UserCategory || (exports.UserCategory = UserCategory = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/UserFeature.js
var require_UserFeature = __commonJS({
  "../../gen/ts/webapi-client/dist/models/UserFeature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserFeature = void 0;
    var UserFeature;
    (function(UserFeature2) {
      UserFeature2["GAMIFICATION"] = "gamification";
    })(UserFeature || (exports.UserFeature = UserFeature = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/VisionStatus.js
var require_VisionStatus = __commonJS({
  "../../gen/ts/webapi-client/dist/models/VisionStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VisionStatus = void 0;
    var VisionStatus;
    (function(VisionStatus2) {
      VisionStatus2["ACTIVE"] = "active";
      VisionStatus2["DRAFT"] = "draft";
      VisionStatus2["OLD"] = "old";
    })(VisionStatus || (exports.VisionStatus = VisionStatus = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/WidgetDimension.js
var require_WidgetDimension = __commonJS({
  "../../gen/ts/webapi-client/dist/models/WidgetDimension.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WidgetDimension = void 0;
    var WidgetDimension;
    (function(WidgetDimension2) {
      WidgetDimension2["DIM_1X1"] = "Dim-1x1";
      WidgetDimension2["DIM_1X2"] = "Dim-1x2";
      WidgetDimension2["DIM_1X3"] = "Dim-1x3";
      WidgetDimension2["DIM_2X1"] = "Dim-2x1";
      WidgetDimension2["DIM_2X1_SMALL_SCREEN_FLEX"] = "Dim-2x1-small-screen-flex";
      WidgetDimension2["DIM_2X2"] = "Dim-2x2";
      WidgetDimension2["DIM_2X3"] = "Dim-2x3";
      WidgetDimension2["DIM_3X1"] = "Dim-3x1";
      WidgetDimension2["DIM_3X1_SMALL_SCREEN_FLEX"] = "Dim-3x1-small-screen-flex";
      WidgetDimension2["DIM_3X2"] = "Dim-3x2";
      WidgetDimension2["DIM_3X3"] = "Dim-3x3";
      WidgetDimension2["DIM_KX1"] = "Dim-kx1";
      WidgetDimension2["DIM_KX2"] = "Dim-kx2";
      WidgetDimension2["DIM_KX3"] = "Dim-kx3";
    })(WidgetDimension || (exports.WidgetDimension = WidgetDimension = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/WidgetType.js
var require_WidgetType = __commonJS({
  "../../gen/ts/webapi-client/dist/models/WidgetType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WidgetType = void 0;
    var WidgetType;
    (function(WidgetType2) {
      WidgetType2["MOTD"] = "motd";
      WidgetType2["KEY_HABITS_STREAKS"] = "key-habits-streaks";
      WidgetType2["HABIT_INBOX_TASKS"] = "habit-inbox-tasks";
      WidgetType2["RANDOM_HABIT"] = "random-habit";
      WidgetType2["CHORE_INBOX_TASKS"] = "chore-inbox-tasks";
      WidgetType2["TODO_INBOX_TASKS"] = "todo-inbox-tasks";
      WidgetType2["RANDOM_CHORE"] = "random-chore";
      WidgetType2["KEY_BIG_PLANS_PROGRESS"] = "key-big-plans-progress";
      WidgetType2["UPCOMING_BIRTHDAYS"] = "upcoming-birthdays";
      WidgetType2["CALENDAR_DAY"] = "calendar-day";
      WidgetType2["SCHEDULE_DAY"] = "schedule-day";
      WidgetType2["TIME_PLAN_VIEW"] = "time-plan-view";
      WidgetType2["GAMIFICATION_OVERVIEW"] = "gamification-overview";
      WidgetType2["GAMIFICATION_HISTORY_WEEKLY"] = "gamification-history-weekly";
      WidgetType2["GAMIFICATION_HISTORY_MONTHLY"] = "gamification-history-monthly";
      WidgetType2["LIFE_WEEKS"] = "life-weeks";
      WidgetType2["LIFE_VISION"] = "life-vision";
      WidgetType2["LIFE_CHAPTERS"] = "life-chapters";
    })(WidgetType || (exports.WidgetType = WidgetType = {}));
  }
});

// ../../gen/ts/webapi-client/dist/models/WorkspaceFeature.js
var require_WorkspaceFeature = __commonJS({
  "../../gen/ts/webapi-client/dist/models/WorkspaceFeature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkspaceFeature = void 0;
    var WorkspaceFeature;
    (function(WorkspaceFeature2) {
      WorkspaceFeature2["TODO_TASK"] = "todo-task";
      WorkspaceFeature2["WORKING_MEM"] = "working-mem";
      WorkspaceFeature2["TIME_PLANS"] = "time-plans";
      WorkspaceFeature2["SCHEDULE"] = "schedule";
      WorkspaceFeature2["HABITS"] = "habits";
      WorkspaceFeature2["CHORES"] = "chores";
      WorkspaceFeature2["BIG_PLANS"] = "big-plans";
      WorkspaceFeature2["JOURNALS"] = "journals";
      WorkspaceFeature2["DOCS"] = "docs";
      WorkspaceFeature2["VACATIONS"] = "vacations";
      WorkspaceFeature2["LIFE_PLAN"] = "life-plan";
      WorkspaceFeature2["SMART_LISTS"] = "smart-lists";
      WorkspaceFeature2["METRICS"] = "metrics";
      WorkspaceFeature2["PRM"] = "prm";
      WorkspaceFeature2["SLACK_TASKS"] = "slack-tasks";
      WorkspaceFeature2["EMAIL_TASKS"] = "email-tasks";
    })(WorkspaceFeature || (exports.WorkspaceFeature = WorkspaceFeature = {}));
  }
});

// ../../gen/ts/webapi-client/dist/index.js
var require_dist = __commonJS({
  "../../gen/ts/webapi-client/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SyncTarget = exports.SmallScreenHomeTabWidgetPlacement = exports.SearchMutationLogStatus = exports.ScoreSource = exports.ScheduleStreamSource = exports.ScheduleStreamColor = exports.ReportBreakdown = exports.RecurringTaskPeriod = exports.QuoteBlock = exports.PartialDateType = exports.ParagraphBlock = exports.OccasionKind = exports.NumberedListBlock = exports.NamedEntityTag = exports.MetricUnit = exports.MetricDirection = exports.LinkBlock = exports.LifePlanEvalApproach = exports.JupiterArchivalReason = exports.JournalSource = exports.JournalGenerationApproach = exports.InboxTaskStatus = exports.Hosting = exports.HomeTabTarget = exports.HeadingBlock = exports.HabitRepeatsStrategy = exports.FeatureControl = exports.Env = exports.EntityReferenceBlock = exports.Eisen = exports.DocsHelpSubject = exports.DividerBlock = exports.Difficulty = exports.CodeBlock = exports.ChecklistBlock = exports.BulletedListBlock = exports.BigScreenHomeTabWidgetPlacement = exports.BigPlanStatus = exports.AppShell = exports.AppPlatform = exports.AppDistributionState = exports.AppDistribution = exports.AppCore = exports.AppComponent = exports.OpenAPI = exports.CancelError = exports.CancelablePromise = exports.BaseHttpRequest = exports.ApiError = exports.ApiClient = void 0;
    exports.WorkspacesService = exports.WorkingMemService = exports.VacationsService = exports.UsersService = exports.TodoService = exports.TimePlansService = exports.TimeEventsService = exports.TestHelperService = exports.TagsService = exports.StatsService = exports.SmartListsService = exports.SearchService = exports.ScheduleService = exports.ReportService = exports.PushIntegrationsService = exports.PrmService = exports.NotesService = exports.MotdService = exports.MetricsService = exports.McpKeyService = exports.LifePlanService = exports.JournalsService = exports.InfraService = exports.InboxTasksService = exports.HomeService = exports.HabitsService = exports.GenService = exports.GcService = exports.DocsService = exports.ContactsService = exports.ChoresService = exports.CalendarService = exports.BigPlansService = exports.AuthService = exports.ApplicationService = exports.ApiKeyService = exports.WorkspaceFeature = exports.WidgetType = exports.WidgetDimension = exports.VisionStatus = exports.UserFeature = exports.UserCategory = exports.TimePlanSource = exports.TimePlanGenerationApproach = exports.TimePlanActivityKind = exports.TimePlanActivityFeasability = exports.TimePlanActivityDoneness = exports.TableBlock = void 0;
    var ApiClient_1 = require_ApiClient();
    Object.defineProperty(exports, "ApiClient", { enumerable: true, get: function() {
      return ApiClient_1.ApiClient;
    } });
    var ApiError_1 = require_ApiError();
    Object.defineProperty(exports, "ApiError", { enumerable: true, get: function() {
      return ApiError_1.ApiError;
    } });
    var BaseHttpRequest_1 = require_BaseHttpRequest();
    Object.defineProperty(exports, "BaseHttpRequest", { enumerable: true, get: function() {
      return BaseHttpRequest_1.BaseHttpRequest;
    } });
    var CancelablePromise_1 = require_CancelablePromise();
    Object.defineProperty(exports, "CancelablePromise", { enumerable: true, get: function() {
      return CancelablePromise_1.CancelablePromise;
    } });
    Object.defineProperty(exports, "CancelError", { enumerable: true, get: function() {
      return CancelablePromise_1.CancelError;
    } });
    var OpenAPI_1 = require_OpenAPI();
    Object.defineProperty(exports, "OpenAPI", { enumerable: true, get: function() {
      return OpenAPI_1.OpenAPI;
    } });
    var AppComponent_1 = require_AppComponent();
    Object.defineProperty(exports, "AppComponent", { enumerable: true, get: function() {
      return AppComponent_1.AppComponent;
    } });
    var AppCore_1 = require_AppCore();
    Object.defineProperty(exports, "AppCore", { enumerable: true, get: function() {
      return AppCore_1.AppCore;
    } });
    var AppDistribution_1 = require_AppDistribution();
    Object.defineProperty(exports, "AppDistribution", { enumerable: true, get: function() {
      return AppDistribution_1.AppDistribution;
    } });
    var AppDistributionState_1 = require_AppDistributionState();
    Object.defineProperty(exports, "AppDistributionState", { enumerable: true, get: function() {
      return AppDistributionState_1.AppDistributionState;
    } });
    var AppPlatform_1 = require_AppPlatform();
    Object.defineProperty(exports, "AppPlatform", { enumerable: true, get: function() {
      return AppPlatform_1.AppPlatform;
    } });
    var AppShell_1 = require_AppShell();
    Object.defineProperty(exports, "AppShell", { enumerable: true, get: function() {
      return AppShell_1.AppShell;
    } });
    var BigPlanStatus_1 = require_BigPlanStatus();
    Object.defineProperty(exports, "BigPlanStatus", { enumerable: true, get: function() {
      return BigPlanStatus_1.BigPlanStatus;
    } });
    var BigScreenHomeTabWidgetPlacement_1 = require_BigScreenHomeTabWidgetPlacement();
    Object.defineProperty(exports, "BigScreenHomeTabWidgetPlacement", { enumerable: true, get: function() {
      return BigScreenHomeTabWidgetPlacement_1.BigScreenHomeTabWidgetPlacement;
    } });
    var BulletedListBlock_1 = require_BulletedListBlock();
    Object.defineProperty(exports, "BulletedListBlock", { enumerable: true, get: function() {
      return BulletedListBlock_1.BulletedListBlock;
    } });
    var ChecklistBlock_1 = require_ChecklistBlock();
    Object.defineProperty(exports, "ChecklistBlock", { enumerable: true, get: function() {
      return ChecklistBlock_1.ChecklistBlock;
    } });
    var CodeBlock_1 = require_CodeBlock();
    Object.defineProperty(exports, "CodeBlock", { enumerable: true, get: function() {
      return CodeBlock_1.CodeBlock;
    } });
    var Difficulty_1 = require_Difficulty();
    Object.defineProperty(exports, "Difficulty", { enumerable: true, get: function() {
      return Difficulty_1.Difficulty;
    } });
    var DividerBlock_1 = require_DividerBlock();
    Object.defineProperty(exports, "DividerBlock", { enumerable: true, get: function() {
      return DividerBlock_1.DividerBlock;
    } });
    var DocsHelpSubject_1 = require_DocsHelpSubject();
    Object.defineProperty(exports, "DocsHelpSubject", { enumerable: true, get: function() {
      return DocsHelpSubject_1.DocsHelpSubject;
    } });
    var Eisen_1 = require_Eisen();
    Object.defineProperty(exports, "Eisen", { enumerable: true, get: function() {
      return Eisen_1.Eisen;
    } });
    var EntityReferenceBlock_1 = require_EntityReferenceBlock();
    Object.defineProperty(exports, "EntityReferenceBlock", { enumerable: true, get: function() {
      return EntityReferenceBlock_1.EntityReferenceBlock;
    } });
    var Env_1 = require_Env();
    Object.defineProperty(exports, "Env", { enumerable: true, get: function() {
      return Env_1.Env;
    } });
    var FeatureControl_1 = require_FeatureControl();
    Object.defineProperty(exports, "FeatureControl", { enumerable: true, get: function() {
      return FeatureControl_1.FeatureControl;
    } });
    var HabitRepeatsStrategy_1 = require_HabitRepeatsStrategy();
    Object.defineProperty(exports, "HabitRepeatsStrategy", { enumerable: true, get: function() {
      return HabitRepeatsStrategy_1.HabitRepeatsStrategy;
    } });
    var HeadingBlock_1 = require_HeadingBlock();
    Object.defineProperty(exports, "HeadingBlock", { enumerable: true, get: function() {
      return HeadingBlock_1.HeadingBlock;
    } });
    var HomeTabTarget_1 = require_HomeTabTarget();
    Object.defineProperty(exports, "HomeTabTarget", { enumerable: true, get: function() {
      return HomeTabTarget_1.HomeTabTarget;
    } });
    var Hosting_1 = require_Hosting();
    Object.defineProperty(exports, "Hosting", { enumerable: true, get: function() {
      return Hosting_1.Hosting;
    } });
    var InboxTaskStatus_1 = require_InboxTaskStatus();
    Object.defineProperty(exports, "InboxTaskStatus", { enumerable: true, get: function() {
      return InboxTaskStatus_1.InboxTaskStatus;
    } });
    var JournalGenerationApproach_1 = require_JournalGenerationApproach();
    Object.defineProperty(exports, "JournalGenerationApproach", { enumerable: true, get: function() {
      return JournalGenerationApproach_1.JournalGenerationApproach;
    } });
    var JournalSource_1 = require_JournalSource();
    Object.defineProperty(exports, "JournalSource", { enumerable: true, get: function() {
      return JournalSource_1.JournalSource;
    } });
    var JupiterArchivalReason_1 = require_JupiterArchivalReason();
    Object.defineProperty(exports, "JupiterArchivalReason", { enumerable: true, get: function() {
      return JupiterArchivalReason_1.JupiterArchivalReason;
    } });
    var LifePlanEvalApproach_1 = require_LifePlanEvalApproach();
    Object.defineProperty(exports, "LifePlanEvalApproach", { enumerable: true, get: function() {
      return LifePlanEvalApproach_1.LifePlanEvalApproach;
    } });
    var LinkBlock_1 = require_LinkBlock();
    Object.defineProperty(exports, "LinkBlock", { enumerable: true, get: function() {
      return LinkBlock_1.LinkBlock;
    } });
    var MetricDirection_1 = require_MetricDirection();
    Object.defineProperty(exports, "MetricDirection", { enumerable: true, get: function() {
      return MetricDirection_1.MetricDirection;
    } });
    var MetricUnit_1 = require_MetricUnit();
    Object.defineProperty(exports, "MetricUnit", { enumerable: true, get: function() {
      return MetricUnit_1.MetricUnit;
    } });
    var NamedEntityTag_1 = require_NamedEntityTag();
    Object.defineProperty(exports, "NamedEntityTag", { enumerable: true, get: function() {
      return NamedEntityTag_1.NamedEntityTag;
    } });
    var NumberedListBlock_1 = require_NumberedListBlock();
    Object.defineProperty(exports, "NumberedListBlock", { enumerable: true, get: function() {
      return NumberedListBlock_1.NumberedListBlock;
    } });
    var OccasionKind_1 = require_OccasionKind();
    Object.defineProperty(exports, "OccasionKind", { enumerable: true, get: function() {
      return OccasionKind_1.OccasionKind;
    } });
    var ParagraphBlock_1 = require_ParagraphBlock();
    Object.defineProperty(exports, "ParagraphBlock", { enumerable: true, get: function() {
      return ParagraphBlock_1.ParagraphBlock;
    } });
    var PartialDateType_1 = require_PartialDateType();
    Object.defineProperty(exports, "PartialDateType", { enumerable: true, get: function() {
      return PartialDateType_1.PartialDateType;
    } });
    var QuoteBlock_1 = require_QuoteBlock();
    Object.defineProperty(exports, "QuoteBlock", { enumerable: true, get: function() {
      return QuoteBlock_1.QuoteBlock;
    } });
    var RecurringTaskPeriod_1 = require_RecurringTaskPeriod();
    Object.defineProperty(exports, "RecurringTaskPeriod", { enumerable: true, get: function() {
      return RecurringTaskPeriod_1.RecurringTaskPeriod;
    } });
    var ReportBreakdown_1 = require_ReportBreakdown();
    Object.defineProperty(exports, "ReportBreakdown", { enumerable: true, get: function() {
      return ReportBreakdown_1.ReportBreakdown;
    } });
    var ScheduleStreamColor_1 = require_ScheduleStreamColor();
    Object.defineProperty(exports, "ScheduleStreamColor", { enumerable: true, get: function() {
      return ScheduleStreamColor_1.ScheduleStreamColor;
    } });
    var ScheduleStreamSource_1 = require_ScheduleStreamSource();
    Object.defineProperty(exports, "ScheduleStreamSource", { enumerable: true, get: function() {
      return ScheduleStreamSource_1.ScheduleStreamSource;
    } });
    var ScoreSource_1 = require_ScoreSource();
    Object.defineProperty(exports, "ScoreSource", { enumerable: true, get: function() {
      return ScoreSource_1.ScoreSource;
    } });
    var SearchMutationLogStatus_1 = require_SearchMutationLogStatus();
    Object.defineProperty(exports, "SearchMutationLogStatus", { enumerable: true, get: function() {
      return SearchMutationLogStatus_1.SearchMutationLogStatus;
    } });
    var SmallScreenHomeTabWidgetPlacement_1 = require_SmallScreenHomeTabWidgetPlacement();
    Object.defineProperty(exports, "SmallScreenHomeTabWidgetPlacement", { enumerable: true, get: function() {
      return SmallScreenHomeTabWidgetPlacement_1.SmallScreenHomeTabWidgetPlacement;
    } });
    var SyncTarget_1 = require_SyncTarget();
    Object.defineProperty(exports, "SyncTarget", { enumerable: true, get: function() {
      return SyncTarget_1.SyncTarget;
    } });
    var TableBlock_1 = require_TableBlock();
    Object.defineProperty(exports, "TableBlock", { enumerable: true, get: function() {
      return TableBlock_1.TableBlock;
    } });
    var TimePlanActivityDoneness_1 = require_TimePlanActivityDoneness();
    Object.defineProperty(exports, "TimePlanActivityDoneness", { enumerable: true, get: function() {
      return TimePlanActivityDoneness_1.TimePlanActivityDoneness;
    } });
    var TimePlanActivityFeasability_1 = require_TimePlanActivityFeasability();
    Object.defineProperty(exports, "TimePlanActivityFeasability", { enumerable: true, get: function() {
      return TimePlanActivityFeasability_1.TimePlanActivityFeasability;
    } });
    var TimePlanActivityKind_1 = require_TimePlanActivityKind();
    Object.defineProperty(exports, "TimePlanActivityKind", { enumerable: true, get: function() {
      return TimePlanActivityKind_1.TimePlanActivityKind;
    } });
    var TimePlanGenerationApproach_1 = require_TimePlanGenerationApproach();
    Object.defineProperty(exports, "TimePlanGenerationApproach", { enumerable: true, get: function() {
      return TimePlanGenerationApproach_1.TimePlanGenerationApproach;
    } });
    var TimePlanSource_1 = require_TimePlanSource();
    Object.defineProperty(exports, "TimePlanSource", { enumerable: true, get: function() {
      return TimePlanSource_1.TimePlanSource;
    } });
    var UserCategory_1 = require_UserCategory();
    Object.defineProperty(exports, "UserCategory", { enumerable: true, get: function() {
      return UserCategory_1.UserCategory;
    } });
    var UserFeature_1 = require_UserFeature();
    Object.defineProperty(exports, "UserFeature", { enumerable: true, get: function() {
      return UserFeature_1.UserFeature;
    } });
    var VisionStatus_1 = require_VisionStatus();
    Object.defineProperty(exports, "VisionStatus", { enumerable: true, get: function() {
      return VisionStatus_1.VisionStatus;
    } });
    var WidgetDimension_1 = require_WidgetDimension();
    Object.defineProperty(exports, "WidgetDimension", { enumerable: true, get: function() {
      return WidgetDimension_1.WidgetDimension;
    } });
    var WidgetType_1 = require_WidgetType();
    Object.defineProperty(exports, "WidgetType", { enumerable: true, get: function() {
      return WidgetType_1.WidgetType;
    } });
    var WorkspaceFeature_1 = require_WorkspaceFeature();
    Object.defineProperty(exports, "WorkspaceFeature", { enumerable: true, get: function() {
      return WorkspaceFeature_1.WorkspaceFeature;
    } });
    var ApiKeyService_1 = require_ApiKeyService();
    Object.defineProperty(exports, "ApiKeyService", { enumerable: true, get: function() {
      return ApiKeyService_1.ApiKeyService;
    } });
    var ApplicationService_1 = require_ApplicationService();
    Object.defineProperty(exports, "ApplicationService", { enumerable: true, get: function() {
      return ApplicationService_1.ApplicationService;
    } });
    var AuthService_1 = require_AuthService();
    Object.defineProperty(exports, "AuthService", { enumerable: true, get: function() {
      return AuthService_1.AuthService;
    } });
    var BigPlansService_1 = require_BigPlansService();
    Object.defineProperty(exports, "BigPlansService", { enumerable: true, get: function() {
      return BigPlansService_1.BigPlansService;
    } });
    var CalendarService_1 = require_CalendarService();
    Object.defineProperty(exports, "CalendarService", { enumerable: true, get: function() {
      return CalendarService_1.CalendarService;
    } });
    var ChoresService_1 = require_ChoresService();
    Object.defineProperty(exports, "ChoresService", { enumerable: true, get: function() {
      return ChoresService_1.ChoresService;
    } });
    var ContactsService_1 = require_ContactsService();
    Object.defineProperty(exports, "ContactsService", { enumerable: true, get: function() {
      return ContactsService_1.ContactsService;
    } });
    var DocsService_1 = require_DocsService();
    Object.defineProperty(exports, "DocsService", { enumerable: true, get: function() {
      return DocsService_1.DocsService;
    } });
    var GcService_1 = require_GcService();
    Object.defineProperty(exports, "GcService", { enumerable: true, get: function() {
      return GcService_1.GcService;
    } });
    var GenService_1 = require_GenService();
    Object.defineProperty(exports, "GenService", { enumerable: true, get: function() {
      return GenService_1.GenService;
    } });
    var HabitsService_1 = require_HabitsService();
    Object.defineProperty(exports, "HabitsService", { enumerable: true, get: function() {
      return HabitsService_1.HabitsService;
    } });
    var HomeService_1 = require_HomeService();
    Object.defineProperty(exports, "HomeService", { enumerable: true, get: function() {
      return HomeService_1.HomeService;
    } });
    var InboxTasksService_1 = require_InboxTasksService();
    Object.defineProperty(exports, "InboxTasksService", { enumerable: true, get: function() {
      return InboxTasksService_1.InboxTasksService;
    } });
    var InfraService_1 = require_InfraService();
    Object.defineProperty(exports, "InfraService", { enumerable: true, get: function() {
      return InfraService_1.InfraService;
    } });
    var JournalsService_1 = require_JournalsService();
    Object.defineProperty(exports, "JournalsService", { enumerable: true, get: function() {
      return JournalsService_1.JournalsService;
    } });
    var LifePlanService_1 = require_LifePlanService();
    Object.defineProperty(exports, "LifePlanService", { enumerable: true, get: function() {
      return LifePlanService_1.LifePlanService;
    } });
    var McpKeyService_1 = require_McpKeyService();
    Object.defineProperty(exports, "McpKeyService", { enumerable: true, get: function() {
      return McpKeyService_1.McpKeyService;
    } });
    var MetricsService_1 = require_MetricsService();
    Object.defineProperty(exports, "MetricsService", { enumerable: true, get: function() {
      return MetricsService_1.MetricsService;
    } });
    var MotdService_1 = require_MotdService();
    Object.defineProperty(exports, "MotdService", { enumerable: true, get: function() {
      return MotdService_1.MotdService;
    } });
    var NotesService_1 = require_NotesService();
    Object.defineProperty(exports, "NotesService", { enumerable: true, get: function() {
      return NotesService_1.NotesService;
    } });
    var PrmService_1 = require_PrmService();
    Object.defineProperty(exports, "PrmService", { enumerable: true, get: function() {
      return PrmService_1.PrmService;
    } });
    var PushIntegrationsService_1 = require_PushIntegrationsService();
    Object.defineProperty(exports, "PushIntegrationsService", { enumerable: true, get: function() {
      return PushIntegrationsService_1.PushIntegrationsService;
    } });
    var ReportService_1 = require_ReportService();
    Object.defineProperty(exports, "ReportService", { enumerable: true, get: function() {
      return ReportService_1.ReportService;
    } });
    var ScheduleService_1 = require_ScheduleService();
    Object.defineProperty(exports, "ScheduleService", { enumerable: true, get: function() {
      return ScheduleService_1.ScheduleService;
    } });
    var SearchService_1 = require_SearchService();
    Object.defineProperty(exports, "SearchService", { enumerable: true, get: function() {
      return SearchService_1.SearchService;
    } });
    var SmartListsService_1 = require_SmartListsService();
    Object.defineProperty(exports, "SmartListsService", { enumerable: true, get: function() {
      return SmartListsService_1.SmartListsService;
    } });
    var StatsService_1 = require_StatsService();
    Object.defineProperty(exports, "StatsService", { enumerable: true, get: function() {
      return StatsService_1.StatsService;
    } });
    var TagsService_1 = require_TagsService();
    Object.defineProperty(exports, "TagsService", { enumerable: true, get: function() {
      return TagsService_1.TagsService;
    } });
    var TestHelperService_1 = require_TestHelperService();
    Object.defineProperty(exports, "TestHelperService", { enumerable: true, get: function() {
      return TestHelperService_1.TestHelperService;
    } });
    var TimeEventsService_1 = require_TimeEventsService();
    Object.defineProperty(exports, "TimeEventsService", { enumerable: true, get: function() {
      return TimeEventsService_1.TimeEventsService;
    } });
    var TimePlansService_1 = require_TimePlansService();
    Object.defineProperty(exports, "TimePlansService", { enumerable: true, get: function() {
      return TimePlansService_1.TimePlansService;
    } });
    var TodoService_1 = require_TodoService();
    Object.defineProperty(exports, "TodoService", { enumerable: true, get: function() {
      return TodoService_1.TodoService;
    } });
    var UsersService_1 = require_UsersService();
    Object.defineProperty(exports, "UsersService", { enumerable: true, get: function() {
      return UsersService_1.UsersService;
    } });
    var VacationsService_1 = require_VacationsService();
    Object.defineProperty(exports, "VacationsService", { enumerable: true, get: function() {
      return VacationsService_1.VacationsService;
    } });
    var WorkingMemService_1 = require_WorkingMemService();
    Object.defineProperty(exports, "WorkingMemService", { enumerable: true, get: function() {
      return WorkingMemService_1.WorkingMemService;
    } });
    var WorkspacesService_1 = require_WorkspacesService();
    Object.defineProperty(exports, "WorkspacesService", { enumerable: true, get: function() {
      return WorkspacesService_1.WorkspacesService;
    } });
  }
});

export {
  require_dist
};
//# sourceMappingURL=/build/_shared/chunk-YGHAPAV2.js.map
