// Runtime polyfills that must load BEFORE any app/React Native module.
//
// Some Expo Go / Hermes builds don't expose `DOMException` on the global
// scope, but React Native 0.81's web API setup references it, causing
// "ReferenceError: Property 'DOMException' doesn't exist" at startup.
// We define a minimal, spec-shaped DOMException if one isn't present.

if (typeof globalThis.DOMException === 'undefined') {
  class DOMException extends Error {
    constructor(message = '', name = 'Error') {
      super(message);
      this.name = name;
      this.message = message;
    }
  }
  // Common legacy error code constants (kept for compatibility).
  const CODES = {
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
  Object.entries(CODES).forEach(([key, val]) => {
    DOMException[key] = val;
  });
  globalThis.DOMException = DOMException;
}
