"use strict";
const validator = {
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "desc": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "timestamp": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "diydesc": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
};
const enumConverter = {};
exports.enumConverter = enumConverter;
exports.validator = validator;
