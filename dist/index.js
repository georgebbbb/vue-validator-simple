(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.array2Obj = array2Obj;
exports.isPromise = isPromise;
exports.mapValues = mapValues;
exports.assign = assign;
function array2Obj(array) {
    var result = {};
    array.forEach(function (item) {
        return result[item] = null;
    });
    return result;
}
function isPromise(p) {
    return p && typeof p.then === 'function';
}

var isArray = exports.isArray = Array.isArray;

function mapValues(object, cb) {
    var keys = Object.keys(object);
    var result = {};
    keys.forEach(function (key) {
        return result[key] = cb(object[key], key);
    });
    return result;
}

function isObj(x) {
    var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    return x !== null && (type === 'object' || type === 'function');
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    return Object(val);
}

function assignKey(to, from, key) {
    var val = from[key];

    if (val === undefined || val === null) {
        return;
    }

    if (hasOwnProperty.call(to, key)) {
        if (to[key] === undefined || to[key] === null) {
            throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
        }
    }

    if (!hasOwnProperty.call(to, key) || !isObj(val)) {
        to[key] = val;
    } else {
        to[key] = assign(Object(to[key]), from[key]);
    }
}

function assign(to, from) {
    if (to === from) {
        return to;
    }
    from = Object(from);
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            assignKey(to, from, key);
        }
    }
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(from);

        for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
                assignKey(to, from, symbols[i]);
            }
        }
    }
    return to;
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validator = validator;

var _util = __webpack_require__(0);

function validator(configs) {

  //split methods and configs
  var pureCon = {};
  var pureMeth = {};
  Object.keys(configs).forEach(function (key) {
    var value = configs[key];
    if (key === 'onSave') {
      pureMeth[key] = value;
    } else {
      value = (0, _util.isArray)(value) ? (0, _util.array2Obj)(value) : value;
      pureCon[key] = value;
    }
  });

  //default all values isn`t dirty and init allPass
  var validator = (0, _util.mapValues)(pureCon, function (value) {
    return { dirty: false };
  });
  validator.allPass = true;
  validator.invalidFileds = [];
  //merge rules
  var rules = (0, _util.assign)(Vue.rules, configs.rules);
  if (!rules || Object.keys(rules).length === 0) {
    throw Error('no validate rule, please check');
  }

  var validatorWatch = (0, _util.mapValues)(pureCon, function (validate, key) {
    return function () {
      var self = this;
      this.validator[key] = (0, _util.mapValues)(validate, function (singleValidatePara, singleValidateFunc) {
        var result = rules[singleValidateFunc](self[key], singleValidatePara);
        if (!result) {
          self.validator.allPass = false;
          self.validator.invalidFileds.push(key);
        }
        return {
          valid: result
        };
      });
      this.validator[key].dirty = true;
    };
  });
  return function (options) {
    var data = options.data();
    var watch = options.watch;
    options.data = function () {
      return (0, _util.assign)(data, { validator: validator });
    };
    options.watch = (0, _util.assign)(validatorWatch, watch);
    if (pureMeth['onSave']) {
      options.methods = (0, _util.mapValues)(options.methods, function (fn, key) {
        if (key === pureMeth['onSave']) {
          return function (argu) {
            var self = this;
            (0, _util.mapValues)(validatorWatch, function (fn) {
              return fn.call(self);
            });
            return fn.apply(this, argu);
          };
        } else return fn;
      });
    }
    return options;
  };
}

/***/ }
/******/ ])
});
;