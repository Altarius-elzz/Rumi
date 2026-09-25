// ---------------------------------------------------------------------------
// Startup polyfills for Expo Go / Hermes.
//
// Loaded as a Metro polyfill (see metro.config.js) so this runs BEFORE React
// Native's environment setup. Some Expo Go / Hermes builds don't expose a few
// web-standard globals that React Native 0.81 (SDK 54) touches during startup,
// which causes "ReferenceError: Property 'X' doesn't exist" crashes.
//
// Each polyfill below is guarded by a "typeof … === 'undefined'" check, so on
// runtimes that already provide the real implementation we DON'T override it.
// This changes no app code — it only fills missing globals defensively.
// ---------------------------------------------------------------------------

/* eslint-disable no-undef */
(function setUpStartupPolyfills() {
  var g =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof global !== 'undefined'
      ? global
      : this;

  // --- DOMException -------------------------------------------------------
  if (typeof g.DOMException === 'undefined') {
    var DOMException = function DOMException(message, name) {
      var err = Error.call(this, message || '');
      this.message = message || '';
      this.name = name || 'Error';
      this.stack = err.stack;
    };
    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;

    var CODES = {
      INDEX_SIZE_ERR: 1,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: 3,
      WRONG_DOCUMENT_ERR: 4,
      INVALID_CHARACTER_ERR: 5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: 7,
      NOT_FOUND_ERR: 8,
      NOT_SUPPORTED_ERR: 9,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: 11,
      SYNTAX_ERR: 12,
      INVALID_MODIFICATION_ERR: 13,
      NAMESPACE_ERR: 14,
      INVALID_ACCESS_ERR: 15,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: 17,
      SECURITY_ERR: 18,
      NETWORK_ERR: 19,
      ABORT_ERR: 20,
      URL_MISMATCH_ERR: 21,
      QUOTA_EXCEEDED_ERR: 22,
      TIMEOUT_ERR: 23,
      INVALID_NODE_TYPE_ERR: 24,
      DATA_CLONE_ERR: 25,
    };
    Object.keys(CODES).forEach(function (key) {
      DOMException[key] = CODES[key];
      DOMException.prototype[key] = CODES[key];
    });

    g.DOMException = DOMException;
  }

  // --- queueMicrotask -----------------------------------------------------
  if (typeof g.queueMicrotask === 'undefined') {
    g.queueMicrotask = function (callback) {
      Promise.resolve()
        .then(callback)
        .catch(function (e) {
          setTimeout(function () {
            throw e;
          }, 0);
        });
    };
  }

  // --- structuredClone (shallow-safe fallback) ----------------------------
  if (typeof g.structuredClone === 'undefined') {
    g.structuredClone = function (value) {
      if (value === undefined) return undefined;
      try {
        return JSON.parse(JSON.stringify(value));
      } catch (e) {
        return value;
      }
    };
  }

  // --- globalThis (very old engines) --------------------------------------
  if (typeof g.globalThis === 'undefined') {
    g.globalThis = g;
  }
})();
