"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _geometry = require("../geometry.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable]';
function isEditableTarget(target) {
  return Boolean(target && typeof target.closest === 'function' && target.closest(EDITABLE_SELECTOR));
}
var _dragOrigin = /*#__PURE__*/new WeakMap();
var _options = /*#__PURE__*/new WeakMap();
var _threesixty = /*#__PURE__*/new WeakMap();
var _eventHandlers = /*#__PURE__*/new WeakMap();
var Events = /*#__PURE__*/function () {
  function Events(threesixty, options) {
    var _this = this;
    _classCallCheck(this, Events);
    _classPrivateFieldInitSpec(this, _dragOrigin, null);
    _classPrivateFieldInitSpec(this, _options, null);
    _classPrivateFieldInitSpec(this, _threesixty, null);
    _classPrivateFieldInitSpec(this, _eventHandlers, null);
    _classPrivateFieldSet(_options, this, options);
    _classPrivateFieldSet(_threesixty, this, threesixty);
    _classPrivateFieldSet(_eventHandlers, this, {
      container: {
        mousedown: function mousedown(e) {
          return _classPrivateFieldSet(_dragOrigin, _this, (0, _geometry.pointerX)(e));
        },
        touchstart: function touchstart(e) {
          return _classPrivateFieldSet(_dragOrigin, _this, (0, _geometry.pointerX)(e));
        },
        touchend: function touchend() {
          return _classPrivateFieldSet(_dragOrigin, _this, null);
        },
        keydown: function keydown(e) {
          return _this._onKeydown(e);
        }
      },
      prev: {
        mousedown: function mousedown(e) {
          e.preventDefault();
          threesixty.play(true);
        },
        mouseup: function mouseup(e) {
          e.preventDefault();
          threesixty.stop();
        },
        touchstart: function touchstart(e) {
          e.preventDefault();
          threesixty.prev();
        }
      },
      next: {
        mousedown: function mousedown(e) {
          e.preventDefault();
          threesixty.play();
        },
        mouseup: function mouseup(e) {
          e.preventDefault();
          threesixty.stop();
        },
        touchstart: function touchstart(e) {
          e.preventDefault();
          threesixty.next();
        }
      },
      global: {
        mouseup: function mouseup() {
          return _classPrivateFieldSet(_dragOrigin, _this, null);
        },
        mousemove: function mousemove(e) {
          return _this._onDrag(e, _classPrivateFieldGet(_options, _this).dragTolerance);
        },
        touchmove: function touchmove(e) {
          return _this._onDrag(e, _classPrivateFieldGet(_options, _this).swipeTolerance);
        }
      }
    });
    this._initEvents();
  }
  return _createClass(Events, [{
    key: "_onDrag",
    value: function _onDrag(e, tolerance) {
      var x = (0, _geometry.pointerX)(e);
      var step = (0, _geometry.dragStep)(_classPrivateFieldGet(_dragOrigin, this), x, tolerance);
      if (step === 0) {
        return;
      }
      _classPrivateFieldGet(_threesixty, this).stop();
      step < 0 ? _classPrivateFieldGet(_threesixty, this).prev() : _classPrivateFieldGet(_threesixty, this).next();
      _classPrivateFieldSet(_dragOrigin, this, x);
    }
  }, {
    key: "_onKeydown",
    value: function _onKeydown(e) {
      if (isEditableTarget(e.target)) {
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          _classPrivateFieldGet(_threesixty, this).prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          _classPrivateFieldGet(_threesixty, this).next();
          break;
        case 'Home':
          e.preventDefault();
          _classPrivateFieldGet(_threesixty, this)["goto"](0);
          break;
        case 'End':
          e.preventDefault();
          _classPrivateFieldGet(_threesixty, this)["goto"](-1);
          break;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _classPrivateFieldGet(_options, this).swipeTarget.removeEventListener('mousedown', _classPrivateFieldGet(_eventHandlers, this).container.mousedown);
      _classPrivateFieldGet(_options, this).swipeTarget.removeEventListener('touchstart', _classPrivateFieldGet(_eventHandlers, this).container.touchstart);
      _classPrivateFieldGet(_options, this).swipeTarget.removeEventListener('touchend', _classPrivateFieldGet(_eventHandlers, this).container.touchend);
      _classPrivateFieldGet(_threesixty, this).container.removeEventListener('keydown', _classPrivateFieldGet(_eventHandlers, this).container.keydown);
      window.removeEventListener('mouseup', _classPrivateFieldGet(_eventHandlers, this).global.mouseup);
      window.removeEventListener('mousemove', _classPrivateFieldGet(_eventHandlers, this).global.mousemove);
      window.removeEventListener('touchmove', _classPrivateFieldGet(_eventHandlers, this).global.touchmove);
      if (_classPrivateFieldGet(_options, this).prev) {
        _classPrivateFieldGet(_options, this).prev.removeEventListener('mousedown', _classPrivateFieldGet(_eventHandlers, this).prev.mousedown);
        _classPrivateFieldGet(_options, this).prev.removeEventListener('mouseup', _classPrivateFieldGet(_eventHandlers, this).prev.mouseup);
        _classPrivateFieldGet(_options, this).prev.removeEventListener('touchstart', _classPrivateFieldGet(_eventHandlers, this).prev.touchstart);
      }
      if (_classPrivateFieldGet(_options, this).next) {
        _classPrivateFieldGet(_options, this).next.removeEventListener('mousedown', _classPrivateFieldGet(_eventHandlers, this).next.mousedown);
        _classPrivateFieldGet(_options, this).next.removeEventListener('mouseup', _classPrivateFieldGet(_eventHandlers, this).next.mouseup);
        _classPrivateFieldGet(_options, this).next.removeEventListener('touchstart', _classPrivateFieldGet(_eventHandlers, this).next.touchstart);
      }
    }
  }, {
    key: "_initEvents",
    value: function _initEvents() {
      if (_classPrivateFieldGet(_options, this).draggable) {
        _classPrivateFieldGet(_options, this).swipeTarget.addEventListener('mousedown', _classPrivateFieldGet(_eventHandlers, this).container.mousedown);
        window.addEventListener('mouseup', _classPrivateFieldGet(_eventHandlers, this).global.mouseup);
        window.addEventListener('mousemove', _classPrivateFieldGet(_eventHandlers, this).global.mousemove);
      }
      if (_classPrivateFieldGet(_options, this).swipeable) {
        _classPrivateFieldGet(_options, this).swipeTarget.addEventListener('touchstart', _classPrivateFieldGet(_eventHandlers, this).container.touchstart);
        _classPrivateFieldGet(_options, this).swipeTarget.addEventListener('touchend', _classPrivateFieldGet(_eventHandlers, this).container.touchend);
        window.addEventListener('touchmove', _classPrivateFieldGet(_eventHandlers, this).global.touchmove);
      }
      if (_classPrivateFieldGet(_options, this).keys) {
        _classPrivateFieldGet(_threesixty, this).container.addEventListener('keydown', _classPrivateFieldGet(_eventHandlers, this).container.keydown);
      }
      if (_classPrivateFieldGet(_options, this).prev) {
        _classPrivateFieldGet(_options, this).prev.addEventListener('mousedown', _classPrivateFieldGet(_eventHandlers, this).prev.mousedown);
        _classPrivateFieldGet(_options, this).prev.addEventListener('mouseup', _classPrivateFieldGet(_eventHandlers, this).prev.mouseup);
        _classPrivateFieldGet(_options, this).prev.addEventListener('touchstart', _classPrivateFieldGet(_eventHandlers, this).prev.touchstart);
      }
      if (_classPrivateFieldGet(_options, this).next) {
        _classPrivateFieldGet(_options, this).next.addEventListener('mousedown', _classPrivateFieldGet(_eventHandlers, this).next.mousedown);
        _classPrivateFieldGet(_options, this).next.addEventListener('mouseup', _classPrivateFieldGet(_eventHandlers, this).next.mouseup);
        _classPrivateFieldGet(_options, this).next.addEventListener('touchstart', _classPrivateFieldGet(_eventHandlers, this).next.touchstart);
      }
    }
  }]);
}();
var _default = exports["default"] = Events;