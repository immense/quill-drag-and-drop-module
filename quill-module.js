(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["quill"], factory);
	else if(typeof exports === 'object')
		exports["DragAndDropModule"] = factory(require("quill"));
	else
		root["DragAndDropModule"] = factory(root["Quill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quill = __webpack_require__(1);

	var _quill2 = _interopRequireDefault(_quill);

	var _utils = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var image_content_type_pattern = '^image\/';
	var DEFAULT_OPTIONS = {
	  container: null,
	  onDrop: null,
	  draggable_content_type_patterns: [image_content_type_pattern]
	};

	var private_data = new WeakMap();

	var DragAndDropModule = function () {
	  function DragAndDropModule(quill, options) {
	    var _this = this;

	    _classCallCheck(this, DragAndDropModule);

	    var _private = new Map();

	    private_data.set(this, _private);

	    _private.set('quill', quill).set('options', Object.assign({}, DEFAULT_OPTIONS, options)).set('container', options.container || quill.container.querySelector('.ql-editor')).set('draggables', this.options.draggables.map(_utils.convertDraggable)).set('listeners', new Set());

	    // Drop listener
	    this.addListener(this.container, 'drop', function (event) {
	      var onDrop = _this.options.onDrop;
	      var node = event.target['ql-data'] ? event.target : _this.container;
	      var files = event.dataTransfer.files;
	      var file_infos = (0, _utils.filesMatching)(files, _this.draggables);

	      if (file_infos.length === 0) return;

	      event.stopPropagation();
	      event.preventDefault();

	      // call onDrop for each dropped file
	      Promise.all(file_infos.map(function (file_info) {
	        return Promise.resolve((onDrop || _utils.nullReturner)(file_info.file, { tag: file_info.tag, attr: file_info.attr })).then(function (ret) {
	          return { on_drop_ret_val: ret, file_info: file_info };
	        });
	      })

	      // map return vals of onDrop/nullReturner to file datas
	      ).then(function (datas) {
	        return Promise.all(datas.map(function (_ref) {
	          var on_drop_ret_val = _ref.on_drop_ret_val,
	              file_info = _ref.file_info;

	          if (on_drop_ret_val === false) {
	            // if onDrop() returned false (or a false-bearing promise), it
	            // means that we shouldn't do anything with this file
	            return;
	          }
	          var tag = file_info.tag,
	              attr = file_info.attr;
	          // if ret is null, either onDrop() returned null (or a null-
	          // bearing promise), or onDrop isn't defined, so just use the
	          // file's base64 as the value for tag[draggable.attr]
	          //
	          // if ret is non-false and non-null, it means onDrop returned
	          // something (or promised something) that isn't null or false.
	          // Assume it's what we should use for tag[draggable.attr]

	          var data = void 0;
	          if (on_drop_ret_val === null) data = (0, _utils.getFileDataUrl)(file_info.file);else data = on_drop_ret_val;

	          return Promise.resolve(data).then(function (ret) {
	            return { data: ret, tag: tag, attr: attr };
	          });
	        }));
	      }).then(function (datas) {
	        return datas.forEach(function (file_info) {
	          // loop through each file_info and attach them to the editor

	          // file_info is undefined if onDrop returned false
	          if (file_info) {
	            var data = file_info.data,
	                tag = file_info.tag,
	                attr = file_info.attr;
	            // create an element from the given `tag` (e.g. 'img')

	            var new_element = document.createElement(tag);

	            // set `attr` to `data` (e.g. img.src = "data:image/png;base64..")
	            new_element.setAttribute(attr, data);

	            // attach the tag to the quill container
	            // TODO: maybe a better way to determine *exactly* where to append
	            // the node? Currently, we're guessing based on event.target, but
	            // that only gets us the node itself, not the position within the
	            // node (i.e., if the node is a text node, maybe it's possible to
	            // split the text node on the point where the user to dropped)
	            node.appendChild(new_element);
	          }
	        });
	      });
	    });
	  }

	  _createClass(DragAndDropModule, [{
	    key: 'destroy',
	    value: function destroy() {
	      // remove listeners
	      var listeners = private_data.get(this).get('listeners');
	      listeners.forEach(function (_ref2) {
	        var node = _ref2.node,
	            event_name = _ref2.event_name,
	            listener = _ref2.listener;

	        node.removeEventListener(event_name, listener);
	      });
	    }
	  }, {
	    key: 'addListener',
	    value: function addListener(node, event_name, listener_fn) {
	      var listener = listener_fn.bind(this);
	      node.addEventListener(event_name, listener, false);
	      private_data.get(this).get('listeners').add({ node: node, event_name: event_name, listener: listener });
	    }
	  }, {
	    key: 'quill',
	    get: function get() {
	      return private_data.get(this).get('quill');
	    }
	  }, {
	    key: 'draggables',
	    get: function get() {
	      return private_data.get(this).get('draggables');
	    }
	  }, {
	    key: 'container',
	    get: function get() {
	      return private_data.get(this).get('container');
	    }
	  }, {
	    key: 'options',
	    get: function get() {
	      return private_data.get(this).get('options');
	    }
	  }], [{
	    key: 'image_content_type_pattern',
	    get: function get() {
	      return image_content_type_pattern;
	    }
	  }, {
	    key: 'utils',
	    get: function get() {
	      return {
	        getFileDataUrl: _utils.getFileDataUrl
	      };
	    }
	  }]);

	  return DragAndDropModule;
	}();

	exports.default = DragAndDropModule;


	_quill2.default.register('modules/dragAndDrop', DragAndDropModule);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.convertDraggable = convertDraggable;
	exports.filesMatching = filesMatching;
	exports.getFileDataUrl = getFileDataUrl;
	exports.nullReturner = nullReturner;
	function convertDraggable(draggable) {
	  if (draggable.content_type_pattern && draggable.tag && draggable.attr) {
	    var ret = Object.assign({}, draggable);
	    ret.content_type_regex = new RegExp(draggable.content_type_pattern);
	    delete ret.content_type_pattern;
	    return ret;
	  } else {
	    var e = new Error("draggables should have content_type_pattern, tag and attr keys");
	    e.invalid_draggable = draggable;
	    throw e;
	  }
	};

	function filesMatching(file_list, draggables) {
	  var ret = [];

	  var _loop = function _loop(i) {
	    var file = file_list.item(i);
	    var draggable = draggables.find(function (d) {
	      return d.content_type_regex.test(file.type);
	    });
	    draggable && ret.push({ file: file, tag: draggable.tag, attr: draggable.attr });
	  };

	  for (var i = 0; i < file_list.length; i++) {
	    _loop(i);
	  }
	  return ret;
	};

	function getFileDataUrl(file) {
	  var reader = new FileReader();
	  return new Promise(function (resolve) {
	    reader.addEventListener("load", function () {
	      resolve(reader.result);
	    }, false);
	    reader.readAsDataURL(file);
	  });
	};

	function nullReturner() {
	  return null;
	};

/***/ })
/******/ ])
});
;