(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMParse = require('./src/dom-parse.js');

var _mode = 'moderate';

var XSDOMParser = function () {
    function XSDOMParser() {
        _classCallCheck(this, XSDOMParser);
    }

    _createClass(XSDOMParser, [{
        key: 'parseFromString',
        value: function parseFromString(domString) {
            var contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/html';

            return DOMParse.parse(domString, contentType, _mode);
        }
    }], [{
        key: 'NodeFilter',
        get: function get() {
            return require('./src/tree-walker').NodeFilter;
        }
    }, {
        key: 'mode',
        get: function get() {
            return _mode;
        },
        set: function set(val) {
            _mode = val;
        }
    }]);

    return XSDOMParser;
}();

if (global.window) {
    if (!global.window.DOMParser) {
        global.window.DOMParser = XSDOMParser;
        global.window.NodeFilter = XSDOMParser.NodeFilter;
    } else {
        global.window.XSDOMParser = XSDOMParser;
    }
} else {
    module.exports = XSDOMParser;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./src/dom-parse.js":6,"./src/tree-walker":10}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var attrTokeRegexp = /^([\w\-:]+)\s*?(?:(\*|~|\||\^|\$|)=\s*(?:'|"|)([\w\W]+?)(?:'|"|)(?:\s([iI])|)|)$/;

var escapeRegExp = function escapeRegExp(str) {
    if (str === undefined) {
        return;
    }

    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

module.exports = function () {
    var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        return _class;
    }();

    return function (_base) {
        _inherits(_class2, _base);

        function _class2() {
            _classCallCheck(this, _class2);

            return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
        }

        _createClass(_class2, [{
            key: 'parseAttributeExpression',
            value: function parseAttributeExpression(attrString) {
                attrString = attrString.replace(/^\s+/, '').replace(/\s+$/, '');

                var match = attrTokeRegexp.exec(attrString);

                var attrName = match[1];
                var attrMatchExpression = match[2];
                var attrValue = match[3];
                var modifier = match[4];

                return this.buildMatchToken(attrName, attrMatchExpression, attrValue, modifier);
            }
        }, {
            key: 'buildMatchToken',
            value: function buildMatchToken(name, matchExpression, value, modifier) {
                value = escapeRegExp(value);
                switch (matchExpression) {
                    case '*':
                        matchExpression = new RegExp('' + value, modifier);
                        break;
                    case '~':
                        matchExpression = new RegExp('(?:\\s|^)' + value + '(?:\\s|$)', modifier);
                        break;
                    case '|':
                        matchExpression = new RegExp('^' + value + '(?:\\-|$)', modifier);
                        break;
                    case '^':
                        matchExpression = new RegExp('^' + value, modifier);
                        break;
                    case '$':
                        matchExpression = new RegExp(value + '$', modifier);
                        break;
                    default:
                        if (value == undefined) value = '[\\w\\W]*?';
                        matchExpression = new RegExp('^' + value + '$', modifier);
                        break;
                }
                return {
                    name: name,
                    value: matchExpression
                };
            }
        }]);

        return _class2;
    }(base);
};

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomArray = require('./cutom-array-shim.js');

module.exports = function (_CustomArray) {
    _inherits(ClassList, _CustomArray);

    function ClassList() {
        var _ref;

        _classCallCheck(this, ClassList);

        for (var _len = arguments.length, argv = Array(_len), _key = 0; _key < _len; _key++) {
            argv[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ClassList.__proto__ || Object.getPrototypeOf(ClassList)).call.apply(_ref, [this].concat(argv)));

        _this.onChange = null;
        return _this;
    }

    _createClass(ClassList, [{
        key: '__triggerChange',
        value: function __triggerChange() {
            if (typeof this.onChange == 'function') {
                this.onChange(this);
            }
        }
    }, {
        key: 'contains',
        value: function contains(item) {
            return this.indexOf(item) !== -1;
        }
    }, {
        key: 'add',
        value: function add() {
            var _this2 = this;

            for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                items[_key2] = arguments[_key2];
            }

            items.forEach(function (item) {
                if (_this2.indexOf(item) == -1) {
                    _this2.push(item);
                }
            });

            if (items.length > 0) this.__triggerChange();
        }
    }, {
        key: 'remove',
        value: function remove() {
            var _this3 = this;

            for (var _len3 = arguments.length, items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                items[_key3] = arguments[_key3];
            }

            items.forEach(function (item) {
                if (_this3.indexOf(item) !== -1) {
                    _this3.splice(_this3.indexOf(item), 1);
                }
            });

            if (items.length > 0) this.__triggerChange();
        }
    }, {
        key: 'item',
        value: function item(index) {
            return this[index];
        }
    }, {
        key: 'toggle',
        value: function toggle(item) {
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!force) return;

            if (this.contains(item)) {
                this.remove(item);
                this.__triggerChange();
            } else {
                this.add(item);
                this.__triggerChange();
            }
        }
    }, {
        key: 'replace',
        value: function replace(oldItem, newItem) {
            if (this.indexOf(oldItem) !== -1) {
                this.splice(this.indexOf(oldItem), 1, newItem);
                this.__triggerChange();
            }
        }
    }]);

    return ClassList;
}(CustomArray);

},{"./cutom-array-shim.js":4}],4:[function(require,module,exports){
"use strict";

/**
 * Shim to enable native array extending with es6 classes.
 * Babel does not support extending native classes
 */
function CustomArray() {
    Array.call(this);
    Array.prototype.slice.call(arguments, 0).forEach(function (item) {
        this.push(item);
    }.bind(this));
}

CustomArray.prototype = Array.prototype;
CustomArray.prototype.constructor = CustomArray;

module.exports = CustomArray;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('./element.js');
var TreeWalker = require('./tree-walker.js').TreeWalker;

module.exports = function (_Element) {
    _inherits(Document, _Element);

    function Document(contentType, docType) {
        _classCallCheck(this, Document);

        var _this = _possibleConstructorReturn(this, (Document.__proto__ || Object.getPrototypeOf(Document)).call(this, '#document', 9));

        _this.contentType = contentType;
        _this.doctype = docType;

        delete _this.classList;
        delete _this.attributes;
        return _this;
    }

    _createClass(Document, [{
        key: 'appendChild',
        value: function appendChild(childNode) {
            if (this.childNodes.length > 0) {
                throw new Error('Only one child node is allowed on document.');
            }

            _get(Document.prototype.__proto__ || Object.getPrototypeOf(Document.prototype), 'appendChild', this).call(this, childNode);
        }
    }, {
        key: 'createElement',
        value: function createElement(tagName) {
            return new Element(tagName, 1);
        }
    }, {
        key: 'createTextNode',
        value: function createTextNode(content) {
            var tag = new Element('#text', 3);
            tag.textContent = content;

            return tag;
        }
    }, {
        key: 'createCDATASection',
        value: function createCDATASection(content) {
            var tag = new Element('cdata-section', 4);
            tag.textContent = content;

            return tag;
        }
    }, {
        key: 'createComment',
        value: function createComment(content) {
            var tag = new Element('#comment', 8);
            tag.textContent = content;

            return tag;
        }
    }, {
        key: 'createTreeWalker',
        value: function createTreeWalker(root, whatToShow, filter) {
            return new TreeWalker(root, whatToShow, filter);
        }
    }, {
        key: 'innerHTML',
        get: function get() {
            return undefined;
        },
        set: function set(val) {
            return undefined;
        }
    }, {
        key: 'outerHTML',
        get: function get() {
            return undefined;
        },
        set: function set(val) {
            return undefined;
        }
    }, {
        key: 'documentElement',
        get: function get() {
            return this.children[0] || null;
        }
    }]);

    return Document;
}(Element);

},{"./element.js":7,"./tree-walker.js":10}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = require('./element.js');
var Document = require('./document.js');
var voidElements = require("./void-elements.js");

var textOnlyElements = ['script', 'style'];

var openTagRegex = '<([\\w\\-:]+)([\\w\\W]*?)(\\/|)>';
var closeTagRegex = '<[\\s]*?\/[\\s]*?([\\w\\-:]+)[\\s]*?>';
var textRegex = '(^[^<]+)';
var commentRegexp = '<!--([\\w\\W]*?)-->';
var cdataRegexp = '<\\!\\[CDATA\\[([\\w\\W]*?)\\]\\]>';

var parseRegex = new RegExp('(?:' + [openTagRegex, closeTagRegex, textRegex, commentRegexp, cdataRegexp].join('|') + ')', 'i');

var attrRegex = /(?:([\w\-:]+)=(?:"|')([\w\W]*?)(?:"|')|([\w\-:]+))/g;

module.exports = function () {
    function DOMParse(domString) {
        var contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/html';
        var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'moderate';

        _classCallCheck(this, DOMParse);

        this.domString = domString;
        this.contentType = contentType;
        this.mode = mode;
        this.document = this.createDocumentNode();
        this.tagSequence = [];
        this.parseIterator = 0;

        while (this.parseIterator < this.domString.length) {
            this.parseIteration();
        }
    }

    _createClass(DOMParse, [{
        key: 'createDocumentNode',
        value: function createDocumentNode() {
            var docType = '';
            if (this.contentType == 'text/html') {
                docType = '<!DOCTYPE html>';
                this.domString = this.domString.replace(/<!DOCTYPE[\w\W]*?>/i, function (match) {
                    docType = match;
                    return '';
                });
            } else if (this.contentType == 'text/xml') {
                docType = '<?xml version="1.0"?>';
                this.domString = this.domString.replace(/<\?xml[\w\W]*?\?>/i, function (match) {
                    docType = match;
                    return '';
                });
            } else {
                throw new Error('Unsupported content type.');
            }

            this.domString = this.domString.replace(/^\s+/, '').replace(/\s+$/, '');

            var doc = new Document(this.contentType, docType);

            return doc;
        }
    }, {
        key: 'parseAttrString',
        value: function parseAttrString(attrString) {
            var attrMap = {};
            var match = void 0;
            while (match = attrRegex.exec(attrString)) {
                var attrName = match[1] || match[3];
                var attrVal = match[2];

                attrMap[attrName] = attrVal;
            }

            return attrMap;
        }

        /**
         * Converts tag names and attribute names to the proper format according
         * to the document content type. If the content type is text/xml the tag
         * names and attributes will be left untouched otherwise they will be converted
         * to lower case strings
         * 
         * @param {string} type
         * @param {string|Object} val
         * 
         * @returns {string|Object}
         */

    }, {
        key: 'contentTypeCompatible',
        value: function contentTypeCompatible(type, val) {
            if (this.contentType == 'text/html' && val !== undefined) {
                switch (type) {
                    case 'tagName':
                        return val.toLowerCase();
                    case 'attributes':
                        var attrList = {};
                        for (var key in val) {
                            attrList[key.toLowerCase()] = val[key];
                        }
                        return attrList;
                    default:
                        return val;
                }
            }

            return val;
        }
    }, {
        key: 'parseIteration',
        value: function parseIteration() {
            var domString = this.domString.slice(this.parseIterator);
            var match = parseRegex.exec(domString);
            if (match) {
                if (match.index !== 0) {
                    // display warning when skipping undefined dom expressions
                    var parseError = new Error('Cannot parse `' + domString.slice(0, match.index).replace(/^\s+/, '').replace(/\s+$/, '') + '`.');

                    switch (this.mode) {
                        case 'strict':
                            throw parseError;
                        case 'moderate':
                            console.warn(parseError);
                            break;
                    }
                }

                this.parseIterator += match.index + match[0].length;

                var tagName = this.contentTypeCompatible('tagName', match[1]);
                var attributes = this.contentTypeCompatible('attributes', this.parseAttrString(match[2]));
                var isSelfClosing = Boolean(match[3]);
                var closeTagName = this.contentTypeCompatible('tagName', match[4]);
                var text = match[5];
                var comment = match[6];
                var cdata = match[7];

                var parentTag = this.tagSequence[this.tagSequence.length - 1] || this.document;

                if (text) {
                    // text node
                    var tag = new Element('#text', 3);
                    tag.textContent = text;

                    parentTag.appendChild(tag);
                } else if (tagName) {
                    // open dom element
                    var _tag = new Element(tagName, 1, attributes);

                    if (textOnlyElements.indexOf(tagName.toLowerCase()) != -1) {
                        var textOnlyExp = new RegExp('([\\w\\W]*?)<\\/' + tagName + '>');
                        var _domString = this.domString.slice(this.parseIterator);
                        var _match = textOnlyExp.exec(_domString);
                        if (_match) {
                            _tag.textContent = _match[1];
                            this.parseIterator += _match.index + _match[0].length;
                        }
                    }

                    parentTag.appendChild(_tag);

                    if (!isSelfClosing && voidElements.indexOf(tagName.toLowerCase()) == -1 && textOnlyElements.indexOf(tagName.toLowerCase()) == -1) {

                        this.tagSequence.push(_tag);
                    }
                } else if (closeTagName) {
                    // close tag name
                    // trow exception if opened and close tags do not match
                    var openTag = this.tagSequence.pop();
                    if (this.mode !== 'strict') return;

                    if (!openTag) {
                        throw new Error('`' + closeTagName + '` has no open tag definition.');
                    }

                    if (closeTagName != openTag.tagName) {
                        throw new Error('`' + openTag.tagName + '` is not properly closed.');
                    }
                } else if (comment !== undefined) {
                    var _tag2 = new Element('#comment', 8);
                    _tag2.textContent = comment;

                    parentTag.appendChild(_tag2);
                } else if (cdata !== undefined) {
                    var _tag3 = new Element('cdata-section', 4);
                    _tag3.textContent = cdata;
                    parentTag.appendChild(_tag3);
                }
            } else {
                var previewStart = this.parseIterator - 10;
                var previewEnd = this.parseIterator + 10;
                throw new Error('Unable to parse dom string near `' + this.domString.slice(previewStart > 0 ? previewStart : 0, previewEnd <= this.domString.length ? previewEnd : this.domString.length - 1) + '`');
            }
        }
    }], [{
        key: 'parse',
        value: function parse(string) {
            var contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/html';
            var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'moderate';

            var instance = new this(string, contentType, mode);

            return instance.document;
        }
    }]);

    return DOMParse;
}();

},{"./document.js":5,"./element.js":7,"./void-elements.js":11}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClassList = require('./class-list.js');
var QuerySelectable = require('./query-selectable.js');
var voidElements = require("./void-elements.js");

var Document = function Document() {
    // use when demanded
    // to handle circular dependencies
    return require('./dom-parse');
};

var DocumentNode = function DocumentNode() {
    return require('./document.js');
};

module.exports = function (_QuerySelectable) {
    _inherits(Element, _QuerySelectable);

    /**
     *
     * @param {String} name
     * @param {Array<Object<String,String>>} attributes
     */
    function Element(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Element);

        var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

        _this.nodeType = type || 1;

        _this.nodeName = _this.tagName = name;

        _this.attributes = attributes;
        _this.childNodes = [];
        _this.parentNode = null;
        _this.classList = new ClassList();

        _this.__populateClassList();
        _this.classList.onChange = _this.__updateClassAttr.bind(_this);
        return _this;
    }

    _createClass(Element, [{
        key: '__populateClassList',
        value: function __populateClassList() {
            var _this2 = this;

            this.classList.splice(0);

            if (Boolean(this.attributes.class)) {
                var cssClasses = this.attributes.class.split(/\s/);

                cssClasses.forEach(function (cssClass) {
                    _this2.classList.add(cssClass);
                });
            }
        }
    }, {
        key: '__updateClassAttr',
        value: function __updateClassAttr(classList) {
            this.attributes.class = classList.join(' ');
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(name) {
            return this.attributes[name];
        }
    }, {
        key: 'removeAttribute',
        value: function removeAttribute(name) {
            delete this.attributes[name];

            if (name == 'class') {
                this.__populateClassList();
            }
        }
    }, {
        key: 'setAttribute',
        value: function setAttribute(name, value) {
            this.attributes[name] = value;

            if (name == 'class') this.__populateClassList();
        }
    }, {
        key: 'hasAttribute',
        value: function hasAttribute(name) {
            return name in this.attributes;
        }
    }, {
        key: '__getTextNodes',
        value: function __getTextNodes(context) {
            var _this3 = this;

            var textNodes = [];
            context.childNodes.forEach(function (node) {
                if (node.nodeType == 3) {
                    textNodes.push(node);
                } else {
                    textNodes = textNodes.concat(_this3.__getTextNodes(node));
                }
            });

            return textNodes;
        }
    }, {
        key: '__searchDom',
        value: function __searchDom(context, compareCallback) {
            var one = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var shallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var nodesFound = [];
            var length = context.children.length;
            for (var i = 0; i < length; i++) {
                var node = context.children[i];

                if (compareCallback(node)) {
                    nodesFound.push(node);

                    if (one) break;
                }

                if (!shallow && node.children.length > 0) {
                    nodesFound = nodesFound.concat(this.__searchDom(node, compareCallback, one));

                    if (one && nodesFound.length > 0) break;
                }
            }

            return nodesFound;
        }
    }, {
        key: 'getElementById',
        value: function getElementById(id) {
            var node = null;
            var nodesFound = this.__searchDom(this, function (node) {
                return node.attributes.id == id;
            }, true);

            if (nodesFound.length > 0) {
                node = nodesFound[0];
            }

            return node;
        }
    }, {
        key: 'getElementsByClassName',
        value: function getElementsByClassName(className) {
            var nodes = this.__searchDom(this, function (node) {
                return node.hasAttribute('class') && node.classList.contains(className);
            });

            return nodes;
        }
    }, {
        key: 'getElementsByTagName',
        value: function getElementsByTagName(tagName) {
            var nodes = this.__searchDom(this, function (node) {
                return node.tagName == tagName;
            });

            return nodes;
        }
    }, {
        key: '__detachNodeIfAttached',
        value: function __detachNodeIfAttached(node) {
            // use only with modification
            // methods
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }

        /**
         *
         * @param {Element} childNode
         */

    }, {
        key: 'appendChild',
        value: function appendChild(childNode) {
            this.__detachNodeIfAttached(childNode);
            this.childNodes.push(childNode);
            childNode.parentNode = this;

            return childNode;
        }
    }, {
        key: 'insertBefore',
        value: function insertBefore(newNode, referenceNode) {
            this.__detachNodeIfAttached(newNode);
            this.childNodes.splice(this.childNodes.indexOf(referenceNode), 0, newNode);

            newNode.parentNode = this;

            return newNode;
        }
    }, {
        key: 'insertAfter',
        value: function insertAfter(newNode, referenceNode) {
            this.__detachNodeIfAttached(newNode);
            this.childNodes.splice(this.childNodes.indexOf(referenceNode) + 1, 0, newNode);

            newNode.parentNode = this;

            return newNode;
        }
    }, {
        key: 'removeChild',
        value: function removeChild(childNode) {
            if (this.childNodes.indexOf(childNode) !== -1) {
                this.childNodes.splice(this.childNodes.indexOf(childNode), 1);

                childNode.parentNode = null;
            } else {
                throw Error('Node is not a child of this node');
            }

            return childNode;
        }
    }, {
        key: 'parentElement',
        get: function get() {
            return this.parentNode;
        }
    }, {
        key: 'ownerDocument',
        get: function get() {
            var node = this;

            do {
                if (node instanceof DocumentNode()) {
                    return node;
                }
            } while (node = node.parentNode);

            return null;
        }
    }, {
        key: 'children',
        get: function get() {
            return this.childNodes.filter(function (node) {
                return node.nodeType === 1;
            });
        }
    }, {
        key: 'outerHTML',
        get: function get() {
            var html = '';
            if (this.nodeType == 3) {
                html += this.textContent;
            } else if (this.nodeType == 8) {
                html += '<!--' + this.textContent + '-->';
            } else if (this.nodeType == 4) {
                html += '<![CDATA[' + this.textContent + ']]>';
            } else {
                html += '<' + this.tagName + ' ';
                for (var key in this.attributes) {
                    if (this.attributes.hasOwnProperty(key)) {
                        html += key;

                        if (this.attributes[key]) {
                            html += '="' + this.attributes[key] + '"';
                        }

                        html += ' ';
                    }
                }

                html = html.replace(/\s+$/, '');
                if (voidElements.indexOf(this.tagName) == -1) {
                    html += '>' + this.innerHTML + '</' + this.tagName + '>';
                } else {
                    html += ' />';
                }
            }

            return html;
        },
        set: function set(val) {
            var _this4 = this;

            if (this.parentNode) {
                var _parentNode$childNode;

                var doc = Document().parse('<root>' + val + '</root>');
                var nodes = doc.documentElement.childNodes;
                (_parentNode$childNode = this.parentNode.childNodes).splice.apply(_parentNode$childNode, [this.parentNode.childNodes.indexOf(this), 1].concat(_toConsumableArray(nodes)));

                nodes.forEach(function (node) {
                    nodes.parentNode = _this4.parentNode;
                });
            }
        }
    }, {
        key: 'textContent',
        set: function set(val) {
            if (this.nodeType == 3 || this.nodeType == 8 || this.nodeType == 4) {
                this._textContent = val;
            } else {
                var tag = new Element('#text', 3);
                tag.textContent = val;
                this.childNodes = [tag];
            }
        },
        get: function get() {
            if (this.nodeType == 3 || this.nodeType == 8 || this.nodeType == 4) {
                return this._textContent || '';
            } else {
                var text = '';
                this.__getTextNodes(this).forEach(function (node) {
                    text += node.textContent;
                });

                return text;
            }
        }
    }, {
        key: 'innerHTML',
        get: function get() {
            var innerHtml = '';
            this.childNodes.forEach(function (node) {
                innerHtml += node.outerHTML;
            });

            return innerHtml;
        },
        set: function set(val) {
            var _this5 = this;

            var doc = Document().parse('<root>' + val + '</root>');
            this.childNodes = [];

            doc.documentElement.childNodes.forEach(function (node) {
                _this5.appendChild(node);
            });
        }
    }, {
        key: 'previousElementSibling',
        get: function get() {
            var parent = this.parentElement;
            if (parent) {
                return parent.children[parent.children.indexOf(this) - 1] || null;
            }

            return null;
        }
    }, {
        key: 'previousSibling',
        get: function get() {
            var parent = this.parentElement;
            if (parent) {
                return parent.childNodes[parent.childNodes.indexOf(this) - 1] || null;
            }

            return null;
        }
    }, {
        key: 'nextElementSibling',
        get: function get() {
            var parent = this.parentElement;
            if (parent) {
                return parent.children[parent.children.indexOf(this) + 1] || null;
            }

            return null;
        }
    }, {
        key: 'nextSibling',
        get: function get() {
            var parent = this.parentElement;
            if (parent) {
                return parent.childNodes[parent.childNodes.indexOf(this) + 1] || null;
            }

            return null;
        }
    }, {
        key: 'firstChild',
        get: function get() {
            return this.childNodes[0] || null;
        }
    }, {
        key: 'firstElementChild',
        get: function get() {
            return this.children[0] || null;
        }
    }, {
        key: 'lastChild',
        get: function get() {
            var nodes = this.childNodes;
            return nodes[nodes.length - 1];
        }
    }, {
        key: 'lastElementChild',
        get: function get() {
            var nodes = this.children;
            return nodes[nodes.length - 1];
        }
    }]);

    return Element;
}(QuerySelectable);

},{"./class-list.js":3,"./document.js":5,"./dom-parse":6,"./query-selectable.js":9,"./void-elements.js":11}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pseudoSelectorRegex = /([\w-]+)(?:\(([\w\W]+)\)|)/;

var PSelectorImpl = {
    'first-child': function firstChild(node) {
        var childList = node.parentNode.children;
        return childList.indexOf(node) == 0;
    },

    'last-child': function lastChild(node) {
        var childList = node.parentNode.children;
        return childList.indexOf(node) == childList.length - 1;
    },

    'nth-child': function nthChild(node, index) {
        index = parseInt(index);
        var childList = node.parentNode.children;
        return childList.indexOf(node) == index - 1;
    },

    'not': function not(node, selector) {
        return !node.matches(selector);
    },

    'empty': function empty(node) {
        return node.childNodes.length == 0;
    }
};

module.exports = function () {
    var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        return _class;
    }();

    return function (_base) {
        _inherits(_class2, _base);

        function _class2() {
            _classCallCheck(this, _class2);

            return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
        }

        _createClass(_class2, [{
            key: 'parsePseudoSelectorExression',
            value: function parsePseudoSelectorExression(pseudoSelector) {
                var match = pseudoSelectorRegex.exec(pseudoSelector);
                if (!match) throw new SyntaxError('Unable to parse pseudoSelector \'' + pseudoSelector + '\'.');

                var name = match[1];
                var params = match[2];

                if (!(name in PSelectorImpl)) throw SyntaxError('Unsupported pseudo selector \'' + name + '\'');
                return function (node) {
                    return PSelectorImpl[name](node, params);
                };
            }
        }]);

        return _class2;
    }(base);
};

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClassList = require('./class-list.js');
var AttributeSelectorMixin = require('./attribute-selector-mixin.js');
var PseudoSelectorMixin = require('./pseudo-selector-mixin.js');

var QsaSearchTypes = {
    default: 0, // deep
    shallow: 1, // direct decendant
    directSibling: 2,
    generalSibling: 3
};

var validQsRegex = /^[\\#\.,\$\^\|\w\-:=\s>\*~\+\[\]\(\)'"]+$/;

module.exports = function (_AttributeSelectorMix) {
    _inherits(QuerySelectable, _AttributeSelectorMix);

    function QuerySelectable() {
        _classCallCheck(this, QuerySelectable);

        return _possibleConstructorReturn(this, (QuerySelectable.__proto__ || Object.getPrototypeOf(QuerySelectable)).apply(this, arguments));
    }

    _createClass(QuerySelectable, [{
        key: '__searchDom',
        value: function __searchDom() {
            throw new TypeError('Method `__searchDom` is not implemented.');
        }
    }, {
        key: '__parseQuerySelectorString',
        value: function __parseQuerySelectorString(selector) {
            if (!validQsRegex.test(selector)) {
                this.__throwInvalidQuerySelector();
            }

            var tokens = [];

            // normalize and sanitize the query selector string
            selector = selector.replace(/\s+/g, ' ').replace(/\s*(>|\+|~|,)\s*/g, '$1').replace(/^\s+/, '').replace(/\s+$/, '');

            // create regular expressions for all the different tokens
            // added support for escaped queries like `.numbers\\:enabled`
            var tagSelector = '(?:\\s|>|\\+|~|^)([\\w-]+(?:[\\w-]*(?:\\\\.)*[\\w-]*)*|\\*)';
            var classNameSelector = '\\.([\\w-]+(?:[\\w-]*(?:\\\\.)*[\\w-]*)*)';
            var idSelector = '#([\\w-]+(?:[\\w-]*(?:\\\\.)*[\\w-]*)*)';
            var attrbuteSelector = '\\[([\\w\\W]+?(?:=(?:"|\')[\\w\\W]*?(?:"|\')|))\\]';
            var ancestorType = '(\\s|>|\\+|~)';
            var pseudoSelector = ':([\\w-]+(?:\\([\\w\\W]+?\\)|))';

            // concatinate all the regexes to one toke regex
            var tokenRegex = new RegExp('(?:' + [ancestorType, tagSelector, idSelector, classNameSelector, attrbuteSelector, pseudoSelector].join('|') + ')');

            while (!!selector) {
                var match = tokenRegex.exec(selector);
                selector = selector.slice(match.index + match[0].length);

                for (var i = 1; i < match.length; i++) {

                    if (match[i] !== undefined) {
                        var keyword = match[i];
                        if (i !== 6) {
                            keyword = keyword.replace(/\\/g, '');
                        }
                        tokens.push({
                            type: i,
                            keyword: keyword
                        });
                    }
                }
            }

            return tokens;
        }
    }, {
        key: '__qsaSearchType',
        value: function __qsaSearchType(separator) {
            switch (separator) {
                case '>':
                    return QsaSearchTypes.shallow;
                case '+':
                    return QsaSearchTypes.directSibling;
                case '~':
                    return QsaSearchTypes.generalSibling;
                default:
                    return QsaSearchTypes.default;
            }
        }
    }, {
        key: '__buildQsaCriterias',
        value: function __buildQsaCriterias(tokens) {
            var _this2 = this;

            var searchCriterias = [];
            var searchCriteria = {};
            tokens.forEach(function (token) {
                switch (token.type) {
                    case 1:
                        searchCriterias.push(searchCriteria);
                        searchCriterias.push({
                            searchType: _this2.__qsaSearchType(token.keyword)
                        });

                        searchCriteria = {};
                        break;
                    case 2:
                        if (token.keyword != '*') {
                            searchCriteria.tagName = token.keyword;
                        }
                        break;
                    case 3:
                        searchCriteria.attributes = searchCriteria.attributes || {};
                        searchCriteria.attributes.id = token.keyword;
                        break;
                    case 4:
                        searchCriteria.classList = searchCriteria.classList || [];
                        searchCriteria.classList.push(token.keyword);
                        break;
                    case 5:
                        searchCriteria.attributes = searchCriteria.attributes || {};
                        var attrToken = _this2.parseAttributeExpression(token.keyword);

                        searchCriteria.attributes[attrToken.name] = attrToken.value;
                        break;
                    case 6:
                        searchCriteria.pseudoSelectors = searchCriteria.pseudoSelectors || [];

                        var pseudoSelector = _this2.parsePseudoSelectorExression(token.keyword);
                        searchCriteria.pseudoSelectors.push(pseudoSelector);
                }
            });

            searchCriterias.push(searchCriteria);

            return searchCriterias;
        }
    }, {
        key: '__qsaSearchByType',
        value: function __qsaSearchByType(contextList, criteria, one, searchType) {
            if (searchType == QsaSearchTypes.default || searchType == QsaSearchTypes.shallow) {
                return this.__qsaSearchTree(contextList, criteria, one, searchType);
            } else {
                return this.__qsaSearchSiblings(contextList, criteria, one, searchType);
            }
        }
    }, {
        key: '__qsaCompareNode',
        value: function __qsaCompareNode(criteria, node) {
            var _this3 = this;

            var matches = true;
            Object.keys(criteria).forEach(function (prop, index) {
                if (!(criteria[prop] instanceof RegExp) && criteria[prop] instanceof Object && prop != 'pseudoSelectors') {

                    matches = matches && _this3.__qsaCompareNode(criteria[prop], node[prop]);
                    return;
                }

                if (node instanceof ClassList) {
                    matches = matches && node.contains(criteria[prop]);
                } else if (criteria[prop] instanceof RegExp) {
                    matches = matches && node[prop] !== undefined && criteria[prop].test(node[prop]);
                } else if (prop == 'pseudoSelectors') {
                    criteria[prop].forEach(function (pseudoSelector) {
                        matches = matches && pseudoSelector(node);
                    });
                } else {
                    matches = matches && node[prop] == criteria[prop];
                }
            });

            return matches;
        }
    }, {
        key: '__qsaSearchSiblings',
        value: function __qsaSearchSiblings(contextList, criteria, one, searchType) {
            var foundNodes = [];
            for (var i = 0; i < contextList.length; i++) {
                var context = contextList[i];

                var parent = context.parentNode;
                var indexInParent = parent.children.indexOf(context);
                if (indexInParent !== -1) {
                    var followingSiblings = parent.children.splice(indexInParent + 1);

                    for (var j = 0; j < followingSiblings.length; j++) {
                        var nextSibling = followingSiblings[j];

                        if (this.__qsaCompareNode(criteria, nextSibling)) {
                            foundNodes.push(nextSibling);

                            if (one) break;
                        }

                        if (searchType == QsaSearchTypes.directSibling) {
                            break;
                        }
                    }

                    if (one && foundNodes.length > 0) break;
                }
            }

            return foundNodes;
        }
    }, {
        key: '__qsaSearchTree',
        value: function __qsaSearchTree(contextList, criteria, one, searchType) {
            var _this4 = this;

            var foundNodes = [];
            contextList.forEach(function (context) {
                foundNodes = foundNodes.concat(_this4.__searchDom(context, function (node) {
                    return _this4.__qsaCompareNode(criteria, node);
                }, one, searchType == QsaSearchTypes.shallow));
            });

            return foundNodes;
        }
    }, {
        key: '__qsaSearch',
        value: function __qsaSearch(contextList, criterias, one) {
            one = one || false;
            var foundNodes = [];

            for (var i = 0; i < criterias.length; i++) {
                var criteria = criterias[i];
                var searchType = QsaSearchTypes.default;

                if ('searchType' in criteria) {
                    searchType = criteria.searchType;
                    criteria = criterias[i = i + 1];
                }

                foundNodes = this.__qsaSearchByType(contextList, criteria, one && i == criterias.length - 1, searchType);

                // get an unique list of matches
                foundNodes = foundNodes.filter(function (item, index, list) {
                    return list.indexOf(item) === index;
                });

                contextList = foundNodes;

                if (contextList.length == 0) {
                    break;
                }
            }

            return foundNodes;
        }
    }, {
        key: '__throwInvalidQuerySelector',
        value: function __throwInvalidQuerySelector(ex) {
            if (ex instanceof SyntaxError) throw ex;
            throw new SyntaxError('invalid query selector');
        }
    }, {
        key: '__qsaSort',
        value: function __qsaSort(list) {
            var reducer = function reducer(list, item) {
                list.push(item);
                item.childNodes.reduce(reducer, list);

                return list;
            };

            var flatDom = [this].reduce(reducer, []);

            return list.sort(function (a, b) {
                var aindex = flatDom.indexOf(a);
                var bindex = flatDom.indexOf(b);

                if (aindex > bindex) {
                    return 1;
                } else if (aindex < bindex) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    }, {
        key: '__execQsa',
        value: function __execQsa(selector, one) {
            var found = [];
            var subSelectors = selector.split(',');

            for (var i = 0; i < subSelectors.length; i++) {
                var subSelector = subSelectors[i];

                var tokens = this.__parseQuerySelectorString(subSelector);
                var searchCriterias = this.__buildQsaCriterias(tokens);
                var foundInQuery = this.__qsaSearch([this], searchCriterias, one);

                foundInQuery.forEach(function (node) {
                    if (found.indexOf(node) == -1) {
                        found.push(node);
                    }
                });
            }

            return subSelectors.length > 1 ? this.__qsaSort(found) : found;
        }
    }, {
        key: 'matches',
        value: function matches(selector) {
            var list = this.ownerDocument.querySelectorAll(selector);
            var i = list.length;
            while (--i >= 0 && list[i] !== this) {}

            return i > -1;
        }
    }, {
        key: 'querySelector',
        value: function querySelector(selector) {
            try {
                return this.__execQsa(selector)[0] || null;
            } catch (ex) {
                this.__throwInvalidQuerySelector(ex);
            }
        }
    }, {
        key: 'querySelectorAll',
        value: function querySelectorAll(selector) {
            try {
                return this.__execQsa(selector);
            } catch (ex) {
                this.__throwInvalidQuerySelector(ex);
            }
        }
    }]);

    return QuerySelectable;
}(AttributeSelectorMixin(PseudoSelectorMixin()));

},{"./attribute-selector-mixin.js":2,"./class-list.js":3,"./pseudo-selector-mixin.js":8}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeFilter = function () {
    function NodeFilter() {
        _classCallCheck(this, NodeFilter);
    }

    _createClass(NodeFilter, null, [{
        key: "FILTER_ACCEPT",
        get: function get() {
            return 1;
        }
    }, {
        key: "FILTER_REJECT",
        get: function get() {
            return 2;
        }
    }, {
        key: "FILTER_SKIP",
        get: function get() {
            return 3;
        }
    }, {
        key: "SHOW_ALL",
        get: function get() {
            return 4294967295;
        }
    }, {
        key: "SHOW_ELEMENT",
        get: function get() {
            return 1;
        }
    }, {
        key: "SHOW_ATTRIBUTE",
        get: function get() {
            return 2;
        }
    }, {
        key: "SHOW_TEXT",
        get: function get() {
            return 4;
        }
    }, {
        key: "SHOW_CDATA_SECTION",
        get: function get() {
            return 8;
        }
    }, {
        key: "SHOW_ENTITY_REFERENCE",
        get: function get() {
            return 16;
        }
    }, {
        key: "SHOW_ENTITY",
        get: function get() {
            return 32;
        }
    }, {
        key: "SHOW_PROCESSING_INSTRUCTION",
        get: function get() {
            return 64;
        }
    }, {
        key: "SHOW_COMMENT",
        get: function get() {
            return 128;
        }
    }, {
        key: "SHOW_DOCUMENT",
        get: function get() {
            return 256;
        }
    }, {
        key: "SHOW_DOCUMENT_TYPE",
        get: function get() {
            return 512;
        }
    }, {
        key: "SHOW_DOCUMENT_FRAGMENT",
        get: function get() {
            return 1024;
        }
    }, {
        key: "SHOW_NOTATION",
        get: function get() {
            return 2048;
        }
    }]);

    return NodeFilter;
}();

var TreeWalker = function () {
    function TreeWalker(root, whatToShow, filter) {
        _classCallCheck(this, TreeWalker);

        this._ = {};
        this._filter = filter;
        this._root = root;
        this._whatToShow = whatToShow;
        this._flatTree = [];
        this._iterator = -1;

        this._reducer();
    }

    _createClass(TreeWalker, [{
        key: "_listFilter",
        value: function _listFilter(item) {
            if (!this._filter || this._filter.acceptNode(item) == NodeFilter.FILTER_ACCEPT) {
                return 0;
            }

            if (this._filter.acceptNode(item) == NodeFilter.FILTER_SKIP) {
                return 1;
            }

            if (this._filter.acceptNode(item) == NodeFilter.FILTER_REJECT) {
                return -1;
            }
        }
    }, {
        key: "_shouldShowItem",
        value: function _shouldShowItem(item) {
            if (this._listFilter(item) == 0) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: "_reducer",
        value: function _reducer() {
            var _this = this;

            var reducer = function reducer(list, item) {
                var filterType = _this._listFilter(item);
                if (filterType === 0) if (_this._whatToShow == NodeFilter.SHOW_ALL) {
                    list.push(item);
                } else if (_this._whatToShow == NodeFilter.SHOW_ELEMENT && item.nodeType == 1) {
                    list.push(item);
                } else if (_this._whatToShow == NodeFilter.SHOW_TEXT && item.nodeType == 3) {
                    list.push(item);
                } else if (_this._whatToShow == NodeFilter.SHOW_CDATA_SECTION && item.nodeType == 4) {
                    list.push(item);
                } else if (_this._whatToShow == NodeFilter.SHOW_COMMENT && item.nodeType == 8) {
                    list.push(item);
                }

                if (filterType !== -1) item.childNodes.reduce(reducer, list);

                return list;
            };

            this._flatTree = [this._root].reduce(reducer, []);
        }
    }, {
        key: "parentNode",
        value: function parentNode() {
            var parent = this.currentNode.parentNode;
            var index = this._flatTree.indexOf(parent);

            if (index !== -1) {
                this._iterator = index;

                return parent;
            }

            return null;
        }
    }, {
        key: "firstChild",
        value: function firstChild() {
            var node = this.currentNode;
            for (var i = 0; i < node.childNodes.length; i++) {
                var index = this._flatTree.indexOf(node.childNodes[i]);
                if (index !== -1) {
                    this._iterator = index;
                    return node.childNodes[i];
                }
            }

            return null;
        }
    }, {
        key: "lastChild",
        value: function lastChild() {
            var node = this.currentNode;
            for (var i = node.childNodes.length - 1; i >= 0; i--) {
                var index = this._flatTree.indexOf(node.childNodes[i]);
                if (index !== -1) {
                    this._iterator = index;
                    return node.childNodes[i];
                }
            }

            return null;
        }
    }, {
        key: "previousSibling",
        value: function previousSibling() {
            var node = this.currentNode;
            while (node = node.previousSibling) {
                var index = this._flatTree.indexOf(node);
                if (index !== -1) {
                    this._iterator = index;
                    return node;
                }
            }

            return null;
        }
    }, {
        key: "nextSibling",
        value: function nextSibling() {
            var node = this.currentNode;
            while (node = node.nextSibling) {
                var index = this._flatTree.indexOf(node);
                if (index !== -1) {
                    this._iterator = index;
                    return node;
                }
            }

            return null;
        }
    }, {
        key: "nextNode",
        value: function nextNode() {
            if (this._iterator == this._flatTree.length) {
                return null;
            }

            this._iterator++;
            return this.currentNode;
        }
    }, {
        key: "previousNode",
        value: function previousNode() {
            if (this._iterator == -1) {
                return null;
            }

            this._iterator--;
            return this.currentNode;
        }
    }, {
        key: "filter",
        get: function get() {
            return this._filter;
        }
    }, {
        key: "root",
        get: function get() {
            return this._root;
        }
    }, {
        key: "whatToShow",
        get: function get() {
            return this._whatToShow;
        }
    }, {
        key: "currentNode",
        get: function get() {
            return this._flatTree[this._iterator] || null;
        }
    }]);

    return TreeWalker;
}();

module.exports = {
    TreeWalker: TreeWalker,
    NodeFilter: NodeFilter
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];

},{}]},{},[1])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9hdHRyaWJ1dGUtc2VsZWN0b3ItbWl4aW4uanMiLCJzcmMvY2xhc3MtbGlzdC5qcyIsInNyYy9jdXRvbS1hcnJheS1zaGltLmpzIiwic3JjL2RvY3VtZW50LmpzIiwic3JjL2RvbS1wYXJzZS5qcyIsInNyYy9lbGVtZW50LmpzIiwic3JjL3BzZXVkby1zZWxlY3Rvci1taXhpbi5qcyIsInNyYy9xdWVyeS1zZWxlY3RhYmxlLmpzIiwic3JjL3RyZWUtd2Fsa2VyLmpzIiwic3JjL3ZvaWQtZWxlbWVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUEsSUFBTSxXQUFXLFFBQVEsb0JBQVIsQ0FBakI7O0FBRUEsSUFBSSxRQUFRLFVBQVo7O0lBQ00sVzs7Ozs7Ozt3Q0FLYyxTLEVBQXNDO0FBQUEsZ0JBQTNCLFdBQTJCLHVFQUFiLFdBQWE7O0FBQ2xELG1CQUFPLFNBQVMsS0FBVCxDQUFlLFNBQWYsRUFBMEIsV0FBMUIsRUFBdUMsS0FBdkMsQ0FBUDtBQUNIOzs7NEJBTnVCO0FBQUUsbUJBQU8sUUFBUSxtQkFBUixFQUE2QixVQUFwQztBQUFpRDs7OzRCQUN6RDtBQUFFLG1CQUFPLEtBQVA7QUFBZSxTOzBCQUNuQixHLEVBQUs7QUFBRSxvQkFBUSxHQUFSO0FBQWM7Ozs7OztBQU96QyxJQUFHLE9BQU8sTUFBVixFQUFrQjtBQUNkLFFBQUksQ0FBQyxPQUFPLE1BQVAsQ0FBYyxTQUFuQixFQUE4QjtBQUMxQixlQUFPLE1BQVAsQ0FBYyxTQUFkLEdBQTBCLFdBQTFCO0FBQ0EsZUFBTyxNQUFQLENBQWMsVUFBZCxHQUEyQixZQUFZLFVBQXZDO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsZUFBTyxNQUFQLENBQWMsV0FBZCxHQUE0QixXQUE1QjtBQUNIO0FBQ0osQ0FQRCxNQU9PO0FBQ0gsV0FBTyxPQUFQLEdBQWlCLFdBQWpCO0FBQ0g7Ozs7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RyxLQUFLLFNBQUwsSUFBa0IsS0FBSyxTQUFMLENBQWUsTUFBcEMsRUFBNEM7QUFDeEMsdUJBQU8sSUFBUDtBQUNIOztBQUVELGlCQUFLLFNBQUw7QUFDQSxtQkFBTyxLQUFLLFdBQVo7QUFDSDs7O3VDQUVjO0FBQ1gsZ0JBQUcsS0FBSyxTQUFMLElBQWtCLENBQUMsQ0FBdEIsRUFBeUI7QUFDckIsdUJBQU8sSUFBUDtBQUNIOztBQUVELGlCQUFLLFNBQUw7QUFDQSxtQkFBTyxLQUFLLFdBQVo7QUFDSDs7OzRCQXBKWTtBQUNULG1CQUFPLEtBQUssT0FBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLLEtBQVo7QUFDSDs7OzRCQUVnQjtBQUNiLG1CQUFPLEtBQUssV0FBWjtBQUNIOzs7NEJBRWlCO0FBQ2QsbUJBQU8sS0FBSyxTQUFMLENBQWUsS0FBSyxTQUFwQixLQUFrQyxJQUF6QztBQUNIOzs7Ozs7QUF5SUwsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsZ0JBQVksVUFEQztBQUViLGdCQUFZO0FBRkMsQ0FBakI7Ozs7O0FDdExBLE9BQU8sT0FBUCxHQUFpQixDQUNiLE1BRGEsRUFFYixNQUZhLEVBR2IsSUFIYSxFQUliLEtBSmEsRUFLYixTQUxhLEVBTWIsT0FOYSxFQU9iLElBUGEsRUFRYixLQVJhLEVBU2IsT0FUYSxFQVViLFFBVmEsRUFXYixNQVhhLEVBWWIsVUFaYSxFQWFiLE1BYmEsRUFjYixPQWRhLEVBZWIsUUFmYSxFQWdCYixPQWhCYSxFQWlCYixLQWpCYSxDQUFqQiIsImZpbGUiOiJ4c2RvbXBhcnNlci5kZWJ1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgRE9NUGFyc2UgPSByZXF1aXJlKCcuL3NyYy9kb20tcGFyc2UuanMnKTtcclxuXHJcbmxldCBfbW9kZSA9ICdtb2RlcmF0ZSc7XHJcbmNsYXNzIFhTRE9NUGFyc2VyIHtcclxuICAgIHN0YXRpYyBnZXQgTm9kZUZpbHRlcigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vc3JjL3RyZWUtd2Fsa2VyJykuTm9kZUZpbHRlcjsgfVxyXG4gICAgc3RhdGljIGdldCBtb2RlKCkgeyByZXR1cm4gX21vZGU7IH1cclxuICAgIHN0YXRpYyBzZXQgbW9kZSh2YWwpIHsgX21vZGUgPSB2YWw7IH1cclxuICAgIFxyXG4gICAgcGFyc2VGcm9tU3RyaW5nKGRvbVN0cmluZywgY29udGVudFR5cGUgPSAndGV4dC9odG1sJykge1xyXG4gICAgICAgIHJldHVybiBET01QYXJzZS5wYXJzZShkb21TdHJpbmcsIGNvbnRlbnRUeXBlLCBfbW9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmKGdsb2JhbC53aW5kb3cpIHtcclxuICAgIGlmICghZ2xvYmFsLndpbmRvdy5ET01QYXJzZXIpIHtcclxuICAgICAgICBnbG9iYWwud2luZG93LkRPTVBhcnNlciA9IFhTRE9NUGFyc2VyO1xyXG4gICAgICAgIGdsb2JhbC53aW5kb3cuTm9kZUZpbHRlciA9IFhTRE9NUGFyc2VyLk5vZGVGaWx0ZXI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdsb2JhbC53aW5kb3cuWFNET01QYXJzZXIgPSBYU0RPTVBhcnNlcjtcclxuICAgIH1cclxufSBlbHNlIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gWFNET01QYXJzZXI7XHJcbn1cclxuIiwiY29uc3QgYXR0clRva2VSZWdleHAgPSAvXihbXFx3XFwtOl0rKVxccyo/KD86KFxcKnx+fFxcfHxcXF58XFwkfCk9XFxzKig/Oid8XCJ8KShbXFx3XFxXXSs/KSg/Oid8XCJ8KSg/OlxccyhbaUldKXwpfCkkLztcblxuY29uc3QgZXNjYXBlUmVnRXhwID0gKHN0cikgPT4ge1xuICAgIGlmKHN0ciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKGJhc2UgPSBjbGFzcyB7fSkgPT4ge1xuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgICAgICBwYXJzZUF0dHJpYnV0ZUV4cHJlc3Npb24oYXR0clN0cmluZykge1xuICAgICAgICAgICAgYXR0clN0cmluZyA9IGF0dHJTdHJpbmcucmVwbGFjZSgvXlxccysvLCAnJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgIG1hdGNoID0gYXR0clRva2VSZWdleHAuZXhlYyhhdHRyU3RyaW5nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGF0dHJOYW1lID0gbWF0Y2hbMV07XG4gICAgICAgICAgICBsZXQgYXR0ck1hdGNoRXhwcmVzc2lvbiA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgbGV0IGF0dHJWYWx1ZSA9IG1hdGNoWzNdO1xuICAgICAgICAgICAgbGV0IG1vZGlmaWVyID0gbWF0Y2hbNF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkTWF0Y2hUb2tlbihhdHRyTmFtZSwgYXR0ck1hdGNoRXhwcmVzc2lvbiwgYXR0clZhbHVlLCBtb2RpZmllcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGJ1aWxkTWF0Y2hUb2tlbihuYW1lLCBtYXRjaEV4cHJlc3Npb24sIHZhbHVlLCBtb2RpZmllcikge1xuICAgICAgICAgICAgdmFsdWUgPSBlc2NhcGVSZWdFeHAodmFsdWUpO1xuICAgICAgICAgICAgc3dpdGNoKG1hdGNoRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICBtYXRjaEV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKGAke3ZhbHVlfWAsIG1vZGlmaWVyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnfic6XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoYCg/OlxcXFxzfF4pJHt2YWx1ZX0oPzpcXFxcc3wkKWAsIG1vZGlmaWVyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoYF4ke3ZhbHVlfSg/OlxcXFwtfCQpYCwgbW9kaWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChgXiR7dmFsdWV9YCwgbW9kaWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChgJHt2YWx1ZX0kYCwgbW9kaWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IHVuZGVmaW5lZCkgdmFsdWUgPSAnW1xcXFx3XFxcXFddKj8nO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaEV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKGBeJHt2YWx1ZX0kYCwgbW9kaWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbWF0Y2hFeHByZXNzaW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59ICIsImNvbnN0IEN1c3RvbUFycmF5ID0gcmVxdWlyZSgnLi9jdXRvbS1hcnJheS1zaGltLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENsYXNzTGlzdCBleHRlbmRzIEN1c3RvbUFycmF5IHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3YpIHtcclxuICAgICAgICBzdXBlciguLi5hcmd2KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX190cmlnZ2VyQ2hhbmdlKCkge1xyXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLm9uQ2hhbmdlID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29udGFpbnMoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2YoaXRlbSkgIT09IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCguLi5pdGVtcykge1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhPZihpdGVtKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoaXRlbXMubGVuZ3RoID4gMCkgdGhpcy5fX3RyaWdnZXJDaGFuZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoLi4uaXRlbXMpIHtcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5kZXhPZihpdGVtKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKHRoaXMuaW5kZXhPZihpdGVtKSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZihpdGVtcy5sZW5ndGggPiAwKSB0aGlzLl9fdHJpZ2dlckNoYW5nZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGl0ZW0oaW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlKGl0ZW0sIGZvcmNlID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmKCFmb3JjZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb250YWlucyhpdGVtKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5fX3RyaWdnZXJDaGFuZ2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5fX3RyaWdnZXJDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbGFjZShvbGRJdGVtLCBuZXdJdGVtKSB7XHJcbiAgICAgICAgaWYodGhpcy5pbmRleE9mKG9sZEl0ZW0pICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnNwbGljZSh0aGlzLmluZGV4T2Yob2xkSXRlbSksIDEsIG5ld0l0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLl9fdHJpZ2dlckNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiBTaGltIHRvIGVuYWJsZSBuYXRpdmUgYXJyYXkgZXh0ZW5kaW5nIHdpdGggZXM2IGNsYXNzZXMuXHJcbiAqIEJhYmVsIGRvZXMgbm90IHN1cHBvcnQgZXh0ZW5kaW5nIG5hdGl2ZSBjbGFzc2VzXHJcbiAqL1xyXG5mdW5jdGlvbiBDdXN0b21BcnJheSgpIHtcclxuICAgIEFycmF5LmNhbGwodGhpcyk7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgIHRoaXMucHVzaChpdGVtKTtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcbn1cclxuXHJcbkN1c3RvbUFycmF5LnByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcclxuQ3VzdG9tQXJyYXkucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tQXJyYXk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1c3RvbUFycmF5OyIsImNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQuanMnKTtcclxuY29uc3QgVHJlZVdhbGtlciA9IHJlcXVpcmUoJy4vdHJlZS13YWxrZXIuanMnKS5UcmVlV2Fsa2VyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEb2N1bWVudCBleHRlbmRzIEVsZW1lbnR7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZW50VHlwZSwgZG9jVHlwZSkge1xyXG4gICAgICAgIHN1cGVyKCcjZG9jdW1lbnQnLCA5KTtcclxuICAgICAgICB0aGlzLmNvbnRlbnRUeXBlID0gY29udGVudFR5cGU7XHJcbiAgICAgICAgdGhpcy5kb2N0eXBlID0gZG9jVHlwZTtcclxuICAgICAgICBcclxuICAgICAgICBkZWxldGUgdGhpcy5jbGFzc0xpc3Q7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5uZXJIVE1MKCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGlubmVySFRNTCh2YWwpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvdXRlckhUTUwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb3V0ZXJIVE1MKHZhbCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRvY3VtZW50RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblswXSB8fCBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZENoaWxkKGNoaWxkTm9kZSkge1xyXG4gICAgICAgIGlmKHRoaXMuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgY2hpbGQgbm9kZSBpcyBhbGxvd2VkIG9uIGRvY3VtZW50LicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KHRhZ05hbWUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnQodGFnTmFtZSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGV4dE5vZGUoY29udGVudCkge1xyXG4gICAgICAgIGxldCB0YWcgPSAgbmV3IEVsZW1lbnQoJyN0ZXh0JywgMyk7XHJcbiAgICAgICAgdGFnLnRleHRDb250ZW50ID0gY29udGVudDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhZztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlQ0RBVEFTZWN0aW9uKGNvbnRlbnQpIHtcclxuICAgICAgICBsZXQgdGFnID0gbmV3IEVsZW1lbnQoJ2NkYXRhLXNlY3Rpb24nLCA0KTtcclxuICAgICAgICB0YWcudGV4dENvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0YWc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUNvbW1lbnQoY29udGVudCkge1xyXG4gICAgICAgIGxldCB0YWcgPSBuZXcgRWxlbWVudCgnI2NvbW1lbnQnLCA4KTtcclxuICAgICAgICB0YWcudGV4dENvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0YWc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgd2hhdFRvU2hvdywgZmlsdGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmVlV2Fsa2VyKHJvb3QsIHdoYXRUb1Nob3csIGZpbHRlcik7XHJcbiAgICB9XHJcbn07IiwiY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudC5qcycpO1xyXG5jb25zdCBEb2N1bWVudCAgPSByZXF1aXJlKCcuL2RvY3VtZW50LmpzJyk7XHJcbmNvbnN0IHZvaWRFbGVtZW50cyA9IHJlcXVpcmUoXCIuL3ZvaWQtZWxlbWVudHMuanNcIik7XHJcblxyXG5jb25zdCB0ZXh0T25seUVsZW1lbnRzID0gW1xyXG4gICAgJ3NjcmlwdCcsXHJcbiAgICAnc3R5bGUnXHJcbl07XHJcblxyXG5jb25zdCBvcGVuVGFnUmVnZXggPSAnPChbXFxcXHdcXFxcLTpdKykoW1xcXFx3XFxcXFddKj8pKFxcXFwvfCk+JztcclxuY29uc3QgY2xvc2VUYWdSZWdleCA9ICc8W1xcXFxzXSo/XFwvW1xcXFxzXSo/KFtcXFxcd1xcXFwtOl0rKVtcXFxcc10qPz4nO1xyXG5jb25zdCB0ZXh0UmVnZXggPSAnKF5bXjxdKyknO1xyXG5jb25zdCBjb21tZW50UmVnZXhwID0gJzwhLS0oW1xcXFx3XFxcXFddKj8pLS0+JztcclxuY29uc3QgY2RhdGFSZWdleHAgPSAnPFxcXFwhXFxcXFtDREFUQVxcXFxbKFtcXFxcd1xcXFxXXSo/KVxcXFxdXFxcXF0+JztcclxuXHJcbmNvbnN0IHBhcnNlUmVnZXggPSBuZXcgUmVnRXhwKCcoPzonICsgW1xyXG4gICAgb3BlblRhZ1JlZ2V4LFxyXG4gICAgY2xvc2VUYWdSZWdleCxcclxuICAgIHRleHRSZWdleCxcclxuICAgIGNvbW1lbnRSZWdleHAsXHJcbiAgICBjZGF0YVJlZ2V4cFxyXG5dLmpvaW4oJ3wnKSArJyknLCAnaScpO1xyXG5cclxuY29uc3QgYXR0clJlZ2V4ID0gLyg/OihbXFx3XFwtOl0rKT0oPzpcInwnKShbXFx3XFxXXSo/KSg/OlwifCcpfChbXFx3XFwtOl0rKSkvZztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRE9NUGFyc2Uge1xyXG4gICAgY29uc3RydWN0b3IoZG9tU3RyaW5nLCBjb250ZW50VHlwZSA9ICd0ZXh0L2h0bWwnLCBtb2RlID0gJ21vZGVyYXRlJykge1xyXG4gICAgICAgIHRoaXMuZG9tU3RyaW5nID0gZG9tU3RyaW5nO1xyXG4gICAgICAgIHRoaXMuY29udGVudFR5cGUgPSBjb250ZW50VHlwZTtcclxuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQgPSB0aGlzLmNyZWF0ZURvY3VtZW50Tm9kZSgpO1xyXG4gICAgICAgIHRoaXMudGFnU2VxdWVuY2UgPSBbXTtcclxuICAgICAgICB0aGlzLnBhcnNlSXRlcmF0b3IgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSh0aGlzLnBhcnNlSXRlcmF0b3IgPCB0aGlzLmRvbVN0cmluZy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUl0ZXJhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2Uoc3RyaW5nLCBjb250ZW50VHlwZSA9ICd0ZXh0L2h0bWwnLCBtb2RlID0gJ21vZGVyYXRlJykge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZSA9IG5ldyB0aGlzKHN0cmluZywgY29udGVudFR5cGUsIG1vZGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2UuZG9jdW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRG9jdW1lbnROb2RlKCkge1xyXG4gICAgICAgIGxldCBkb2NUeXBlID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGVudFR5cGUgPT0gJ3RleHQvaHRtbCcpIHtcclxuICAgICAgICAgICAgZG9jVHlwZSA9ICc8IURPQ1RZUEUgaHRtbD4nO1xyXG4gICAgICAgICAgIHRoaXMuZG9tU3RyaW5nID0gdGhpcy5kb21TdHJpbmcucmVwbGFjZSgvPCFET0NUWVBFW1xcd1xcV10qPz4vaSwgKG1hdGNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2NUeXBlID0gbWF0Y2g7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250ZW50VHlwZSA9PSAndGV4dC94bWwnKSB7XHJcbiAgICAgICAgICAgIGRvY1R5cGUgPSAnPD94bWwgdmVyc2lvbj1cIjEuMFwiPz4nO1xyXG4gICAgICAgICAgICB0aGlzLmRvbVN0cmluZyA9IHRoaXMuZG9tU3RyaW5nLnJlcGxhY2UoLzxcXD94bWxbXFx3XFxXXSo/XFw/Pi9pLCAobWF0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvY1R5cGUgPSBtYXRjaDtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBjb250ZW50IHR5cGUuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRvbVN0cmluZyA9IHRoaXMuZG9tU3RyaW5nLnJlcGxhY2UoL15cXHMrLywgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrJC8sICcnKTtcclxuXHJcbiAgICAgICAgbGV0IGRvYyA9IG5ldyBEb2N1bWVudChcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50VHlwZSwgZG9jVHlwZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkb2M7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBdHRyU3RyaW5nKGF0dHJTdHJpbmcpIHtcclxuICAgICAgICBsZXQgYXR0ck1hcCA9IHt9O1xyXG4gICAgICAgIGxldCBtYXRjaDtcclxuICAgICAgICB3aGlsZSgobWF0Y2ggPSBhdHRyUmVnZXguZXhlYyhhdHRyU3RyaW5nKSkpIHtcclxuICAgICAgICAgICAgbGV0IGF0dHJOYW1lID0gKG1hdGNoWzFdIHx8IG1hdGNoWzNdKTtcclxuICAgICAgICAgICAgbGV0IGF0dHJWYWwgPSBtYXRjaFsyXTtcclxuXHJcbiAgICAgICAgICAgIGF0dHJNYXBbYXR0ck5hbWVdID0gYXR0clZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhdHRyTWFwO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRhZyBuYW1lcyBhbmQgYXR0cmlidXRlIG5hbWVzIHRvIHRoZSBwcm9wZXIgZm9ybWF0IGFjY29yZGluZ1xyXG4gICAgICogdG8gdGhlIGRvY3VtZW50IGNvbnRlbnQgdHlwZS4gSWYgdGhlIGNvbnRlbnQgdHlwZSBpcyB0ZXh0L3htbCB0aGUgdGFnXHJcbiAgICAgKiBuYW1lcyBhbmQgYXR0cmlidXRlcyB3aWxsIGJlIGxlZnQgdW50b3VjaGVkIG90aGVyd2lzZSB0aGV5IHdpbGwgYmUgY29udmVydGVkXHJcbiAgICAgKiB0byBsb3dlciBjYXNlIHN0cmluZ3NcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gdmFsXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBjb250ZW50VHlwZUNvbXBhdGlibGUodHlwZSwgdmFsKSB7XHJcbiAgICAgICAgaWYodGhpcy5jb250ZW50VHlwZSA9PSAndGV4dC9odG1sJyAmJiB2YWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzd2l0Y2godHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndGFnTmFtZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXR0cmlidXRlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJMaXN0ID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBrZXkgaW4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W2tleS50b0xvd2VyQ2FzZSgpXSA9IHZhbFtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0ckxpc3Q7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUl0ZXJhdGlvbigpIHtcclxuICAgICAgICBsZXQgZG9tU3RyaW5nID0gdGhpcy5kb21TdHJpbmcuc2xpY2UodGhpcy5wYXJzZUl0ZXJhdG9yKTtcclxuICAgICAgICBsZXQgbWF0Y2ggPSBwYXJzZVJlZ2V4LmV4ZWMoZG9tU3RyaW5nKTtcclxuICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgaWYobWF0Y2guaW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIGRpc3BsYXkgd2FybmluZyB3aGVuIHNraXBwaW5nIHVuZGVmaW5lZCBkb20gZXhwcmVzc2lvbnNcclxuICAgICAgICAgICAgICAgIGxldCBwYXJzZUVycm9yID0gbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGBDYW5ub3QgcGFyc2UgXFxgJHtkb21TdHJpbmcuc2xpY2UoMCwgbWF0Y2guaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKyQvLCAnJyl9XFxgLmApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLm1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzdHJpY3QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBwYXJzZUVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21vZGVyYXRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKHBhcnNlRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJzZUl0ZXJhdG9yICs9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRhZ05hbWUgPSB0aGlzLmNvbnRlbnRUeXBlQ29tcGF0aWJsZSgndGFnTmFtZScsIG1hdGNoWzFdKTtcclxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSB0aGlzLmNvbnRlbnRUeXBlQ29tcGF0aWJsZSgnYXR0cmlidXRlcycsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlQXR0clN0cmluZyhtYXRjaFsyXSkpO1xyXG4gICAgICAgICAgICBsZXQgaXNTZWxmQ2xvc2luZyA9IEJvb2xlYW4obWF0Y2hbM10pO1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VUYWdOYW1lID0gdGhpcy5jb250ZW50VHlwZUNvbXBhdGlibGUoJ3RhZ05hbWUnLCBtYXRjaFs0XSk7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gbWF0Y2hbNV07XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50ID0gbWF0Y2hbNl07XHJcbiAgICAgICAgICAgIGxldCBjZGF0YSA9IG1hdGNoWzddO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcmVudFRhZyA9IHRoaXMudGFnU2VxdWVuY2VbdGhpcy50YWdTZXF1ZW5jZS5sZW5ndGggLSAxXSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0ZXh0IG5vZGVcclxuICAgICAgICAgICAgICAgIGxldCB0YWcgPSBuZXcgRWxlbWVudCgnI3RleHQnLCAzKTtcclxuICAgICAgICAgICAgICAgIHRhZy50ZXh0Q29udGVudCA9IHRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyZW50VGFnLmFwcGVuZENoaWxkKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhZ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YWdOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvcGVuIGRvbSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFnID0gbmV3IEVsZW1lbnQodGFnTmFtZSwgMSwgYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRleHRPbmx5RWxlbWVudHMuaW5kZXhPZih0YWdOYW1lLnRvTG93ZXJDYXNlKCkpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRPbmx5RXhwID0gbmV3IFJlZ0V4cChgKFtcXFxcd1xcXFxXXSo/KTxcXFxcLyR7dGFnTmFtZX0+YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRvbVN0cmluZyA9IHRoaXMuZG9tU3RyaW5nLnNsaWNlKHRoaXMucGFyc2VJdGVyYXRvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gdGV4dE9ubHlFeHAuZXhlYyhkb21TdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZy50ZXh0Q29udGVudCA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlSXRlcmF0b3IgKz0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBhcmVudFRhZy5hcHBlbmRDaGlsZChcclxuICAgICAgICAgICAgICAgICAgICB0YWdcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWlzU2VsZkNsb3NpbmcgJiZcclxuICAgICAgICAgICAgICAgICAgICB2b2lkRWxlbWVudHMuaW5kZXhPZih0YWdOYW1lLnRvTG93ZXJDYXNlKCkpID09IC0xICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE9ubHlFbGVtZW50cy5pbmRleE9mKHRhZ05hbWUudG9Mb3dlckNhc2UoKSkgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdTZXF1ZW5jZS5wdXNoKHRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsb3NlVGFnTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgdGFnIG5hbWVcclxuICAgICAgICAgICAgICAgIC8vIHRyb3cgZXhjZXB0aW9uIGlmIG9wZW5lZCBhbmQgY2xvc2UgdGFncyBkbyBub3QgbWF0Y2hcclxuICAgICAgICAgICAgICAgIHZhciBvcGVuVGFnID0gdGhpcy50YWdTZXF1ZW5jZS5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMubW9kZSAhPT0gJ3N0cmljdCcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoIW9wZW5UYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYCR7Y2xvc2VUYWdOYW1lfVxcYCBoYXMgbm8gb3BlbiB0YWcgZGVmaW5pdGlvbi5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihjbG9zZVRhZ05hbWUgIT0gb3BlblRhZy50YWdOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcXGAke29wZW5UYWcudGFnTmFtZX1cXGAgaXMgbm90IHByb3Blcmx5IGNsb3NlZC5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWcgPSBuZXcgRWxlbWVudCgnI2NvbW1lbnQnLCA4KTtcclxuICAgICAgICAgICAgICAgIHRhZy50ZXh0Q29udGVudCA9IGNvbW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyZW50VGFnLmFwcGVuZENoaWxkKHRhZyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2RhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZyA9IG5ldyBFbGVtZW50KCdjZGF0YS1zZWN0aW9uJywgNCk7XHJcbiAgICAgICAgICAgICAgICB0YWcudGV4dENvbnRlbnQgPSBjZGF0YTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFRhZy5hcHBlbmRDaGlsZCh0YWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHByZXZpZXdTdGFydCA9IHRoaXMucGFyc2VJdGVyYXRvciAtIDEwO1xyXG4gICAgICAgICAgICBsZXQgcHJldmlld0VuZCA9IHRoaXMucGFyc2VJdGVyYXRvciArIDEwO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBkb20gc3RyaW5nIG5lYXIgXFxgJHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9tU3RyaW5nLnNsaWNlKHByZXZpZXdTdGFydCA+IDA/IHByZXZpZXdTdGFydDogMCwgcHJldmlld0VuZCA8PSB0aGlzLmRvbVN0cmluZy5sZW5ndGg/IHByZXZpZXdFbmQ6IHRoaXMuZG9tU3RyaW5nLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgIH1cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiY29uc3QgQ2xhc3NMaXN0ID0gcmVxdWlyZSgnLi9jbGFzcy1saXN0LmpzJyk7XHJcbmNvbnN0IFF1ZXJ5U2VsZWN0YWJsZSA9IHJlcXVpcmUoJy4vcXVlcnktc2VsZWN0YWJsZS5qcycpO1xyXG5jb25zdCB2b2lkRWxlbWVudHMgPSByZXF1aXJlKFwiLi92b2lkLWVsZW1lbnRzLmpzXCIpO1xyXG5cclxuY29uc3QgRG9jdW1lbnQgPSAoKSA9PiB7XHJcbiAgICAvLyB1c2Ugd2hlbiBkZW1hbmRlZFxyXG4gICAgLy8gdG8gaGFuZGxlIGNpcmN1bGFyIGRlcGVuZGVuY2llc1xyXG4gICAgcmV0dXJuIHJlcXVpcmUoJy4vZG9tLXBhcnNlJyk7XHJcbn07XHJcblxyXG5jb25zdCBEb2N1bWVudE5vZGUgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9kb2N1bWVudC5qcycpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbGVtZW50IGV4dGVuZHMgUXVlcnlTZWxlY3RhYmxlIHtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdDxTdHJpbmcsU3RyaW5nPj59IGF0dHJpYnV0ZXNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgdHlwZSA9IDEsIGF0dHJpYnV0ZXMgPSB7fSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZVR5cGUgPSB0eXBlIHx8IDE7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZU5hbWUgPVxyXG4gICAgICAgICAgICB0aGlzLnRhZ05hbWUgPSBuYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuY2hpbGROb2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMucGFyZW50Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QgPSBuZXcgQ2xhc3NMaXN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX19wb3B1bGF0ZUNsYXNzTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0Lm9uQ2hhbmdlID0gdGhpcy5fX3VwZGF0ZUNsYXNzQXR0ci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcG9wdWxhdGVDbGFzc0xpc3QoKSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3Quc3BsaWNlKDApO1xyXG5cclxuICAgICAgICBpZihCb29sZWFuKHRoaXMuYXR0cmlidXRlcy5jbGFzcykpIHtcclxuICAgICAgICAgICAgbGV0IGNzc0NsYXNzZXMgPSB0aGlzLmF0dHJpYnV0ZXMuY2xhc3Muc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgICAgICAgY3NzQ2xhc3Nlcy5mb3JFYWNoKChjc3NDbGFzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKGNzc0NsYXNzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9fdXBkYXRlQ2xhc3NBdHRyKGNsYXNzTGlzdCkge1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzTGlzdC5qb2luKCcgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmVudEVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Tm9kZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG93bmVyRG9jdW1lbnQoKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIERvY3VtZW50Tm9kZSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gd2hpbGUoKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2hpbGRyZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGROb2Rlcy5maWx0ZXIoKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG91dGVySFRNTCgpIHtcclxuICAgICAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGVUeXBlID09IDMpIHtcclxuICAgICAgICAgICAgaHRtbCArPSB0aGlzLnRleHRDb250ZW50O1xyXG4gICAgICAgIH0gZWxzZSBpZih0aGlzLm5vZGVUeXBlID09IDgpIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPCEtLSR7dGhpcy50ZXh0Q29udGVudH0tLT5gO1xyXG4gICAgICAgIH0gZWxzZSBpZih0aGlzLm5vZGVUeXBlID09IDQpIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPCFbQ0RBVEFbJHt0aGlzLnRleHRDb250ZW50fV1dPmA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPCR7dGhpcy50YWdOYW1lfSBgO1xyXG4gICAgICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBrZXk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYXR0cmlidXRlc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gYD1cIiR7dGhpcy5hdHRyaWJ1dGVzW2tleV19XCJgO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL1xccyskLywgJycpO1xyXG4gICAgICAgICAgICBpZih2b2lkRWxlbWVudHMuaW5kZXhPZih0aGlzLnRhZ05hbWUpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IGA+JHt0aGlzLmlubmVySFRNTH08LyR7dGhpcy50YWdOYW1lfT5gO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSAnIC8+JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG91dGVySFRNTCh2YWwpIHtcclxuICAgICAgICBpZih0aGlzLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IGRvYyA9IERvY3VtZW50KCkucGFyc2UoYDxyb290PiR7dmFsfTwvcm9vdD5gKTtcclxuICAgICAgICAgICAgbGV0IG5vZGVzID0gZG9jLmRvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlcy5zcGxpY2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlcy5pbmRleE9mKHRoaXMpLCAxLCAuLi5ub2Rlcyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBub2Rlcy5wYXJlbnROb2RlID0gdGhpcy5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRleHRDb250ZW50KHZhbCkge1xyXG4gICAgICAgIGlmKHRoaXMubm9kZVR5cGUgPT0gMyB8fCB0aGlzLm5vZGVUeXBlID09IDggfHwgdGhpcy5ub2RlVHlwZSA9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRDb250ZW50ID0gdmFsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB0YWcgPSBuZXcgRWxlbWVudCgnI3RleHQnLCAzKTtcclxuICAgICAgICAgICAgdGFnLnRleHRDb250ZW50ID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTm9kZXMgPSBbdGFnXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRleHRDb250ZW50KCkge1xyXG4gICAgICAgIGlmKHRoaXMubm9kZVR5cGUgPT0gMyB8fCB0aGlzLm5vZGVUeXBlID09IDggfHwgdGhpcy5ub2RlVHlwZSA9PSA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0Q29udGVudCB8fCAnJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdGV4dCA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLl9fZ2V0VGV4dE5vZGVzKHRoaXMpLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gbm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbm5lckhUTUwoKSB7XHJcbiAgICAgICAgbGV0IGlubmVySHRtbCA9ICcnO1xyXG4gICAgICAgIHRoaXMuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIGlubmVySHRtbCArPSBub2RlLm91dGVySFRNTDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlubmVySHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW5uZXJIVE1MKHZhbCkge1xyXG4gICAgICAgIHZhciBkb2MgPSBEb2N1bWVudCgpLnBhcnNlKGA8cm9vdD4ke3ZhbH08L3Jvb3Q+YCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZE5vZGVzID0gW107XHJcblxyXG4gICAgICAgIGRvYy5kb2N1bWVudEVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBwcmV2aW91c0VsZW1lbnRTaWJsaW5nKCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaWYocGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuY2hpbGRyZW5bcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcykgLSAxXSB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHByZXZpb3VzU2libGluZygpIHtcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGlmKHBhcmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LmNoaWxkTm9kZXNbcGFyZW50LmNoaWxkTm9kZXMuaW5kZXhPZih0aGlzKSAtIDFdIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgbmV4dEVsZW1lbnRTaWJsaW5nKCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaWYocGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuY2hpbGRyZW5bcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcykgKyAxXSB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG5leHRTaWJsaW5nKCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaWYocGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuY2hpbGROb2Rlc1twYXJlbnQuY2hpbGROb2Rlcy5pbmRleE9mKHRoaXMpICsgMV0gfHwgbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBmaXJzdENoaWxkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkTm9kZXNbMF0gfHwgbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGZpcnN0RWxlbWVudENoaWxkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdIHx8IG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBsYXN0Q2hpbGQoKSB7XHJcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xyXG4gICAgICAgIHJldHVybiBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxhc3RFbGVtZW50Q2hpbGQoKSB7XHJcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5jaGlsZHJlbjtcclxuICAgICAgICByZXR1cm4gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXR0cmlidXRlKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW25hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUF0dHJpYnV0ZShuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgaWYobmFtZSA9PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19wb3B1bGF0ZUNsYXNzTGlzdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpIHtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYobmFtZSA9PSAnY2xhc3MnKSB0aGlzLl9fcG9wdWxhdGVDbGFzc0xpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNBdHRyaWJ1dGUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lIGluIHRoaXMuYXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICBfX2dldFRleHROb2Rlcyhjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0IHRleHROb2RlcyA9IFtdO1xyXG4gICAgICAgIGNvbnRleHQuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKG5vZGUubm9kZVR5cGUgPT0gMykge1xyXG4gICAgICAgICAgICAgICAgdGV4dE5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZXMgPSB0ZXh0Tm9kZXMuY29uY2F0KHRoaXMuX19nZXRUZXh0Tm9kZXMobm9kZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXh0Tm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgX19zZWFyY2hEb20oY29udGV4dCwgY29tcGFyZUNhbGxiYWNrLCBvbmUgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IG5vZGVzRm91bmQgPSBbXTtcclxuICAgICAgICBsZXQgbGVuZ3RoID0gY29udGV4dC5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gY29udGV4dC5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgIGlmKGNvbXBhcmVDYWxsYmFjayhub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNGb3VuZC5wdXNoKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKG9uZSkgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFzaGFsbG93ICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNGb3VuZCA9IG5vZGVzRm91bmQuY29uY2F0KHRoaXMuX19zZWFyY2hEb20obm9kZSwgY29tcGFyZUNhbGxiYWNrLCBvbmUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihvbmUgJiYgbm9kZXNGb3VuZC5sZW5ndGggPiAwKSBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzRm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudEJ5SWQoaWQpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IG51bGw7XHJcbiAgICAgICAgbGV0IG5vZGVzRm91bmQgPSB0aGlzLl9fc2VhcmNoRG9tKHRoaXMsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLmF0dHJpYnV0ZXMuaWQgPT0gaWQ7XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmKG5vZGVzRm91bmQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZXNGb3VuZFswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5fX3NlYXJjaERvbSh0aGlzLCAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5oYXNBdHRyaWJ1dGUoJ2NsYXNzJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpIHtcclxuICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLl9fc2VhcmNoRG9tKHRoaXMsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLnRhZ05hbWUgPT0gdGFnTmFtZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIF9fZGV0YWNoTm9kZUlmQXR0YWNoZWQobm9kZSkge1xyXG4gICAgICAgIC8vIHVzZSBvbmx5IHdpdGggbW9kaWZpY2F0aW9uXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIGlmKG5vZGUucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gY2hpbGROb2RlXHJcbiAgICAgKi9cclxuICAgIGFwcGVuZENoaWxkKGNoaWxkTm9kZSkge1xyXG4gICAgICAgIHRoaXMuX19kZXRhY2hOb2RlSWZBdHRhY2hlZChjaGlsZE5vZGUpO1xyXG4gICAgICAgIHRoaXMuY2hpbGROb2Rlcy5wdXNoKGNoaWxkTm9kZSk7XHJcbiAgICAgICAgY2hpbGROb2RlLnBhcmVudE5vZGUgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hpbGROb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGluc2VydEJlZm9yZShuZXdOb2RlLCByZWZlcmVuY2VOb2RlKSB7XHJcbiAgICAgICAgdGhpcy5fX2RldGFjaE5vZGVJZkF0dGFjaGVkKG5ld05vZGUpO1xyXG4gICAgICAgIHRoaXMuY2hpbGROb2Rlcy5zcGxpY2UoXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGROb2Rlcy5pbmRleE9mKHJlZmVyZW5jZU5vZGUpLFxyXG4gICAgICAgICAgICAwLCBuZXdOb2RlKTtcclxuICAgICAgICBcclxuICAgICAgICBuZXdOb2RlLnBhcmVudE5vZGUgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBpbnNlcnRBZnRlcihuZXdOb2RlLCByZWZlcmVuY2VOb2RlKSB7XHJcbiAgICAgICAgdGhpcy5fX2RldGFjaE5vZGVJZkF0dGFjaGVkKG5ld05vZGUpO1xyXG4gICAgICAgIHRoaXMuY2hpbGROb2Rlcy5zcGxpY2UoXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGROb2Rlcy5pbmRleE9mKHJlZmVyZW5jZU5vZGUpICsgMSxcclxuICAgICAgICAgICAgMCwgbmV3Tm9kZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbmV3Tm9kZS5wYXJlbnROb2RlID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGROb2RlKSB7XHJcbiAgICAgICAgaWYodGhpcy5jaGlsZE5vZGVzLmluZGV4T2YoY2hpbGROb2RlKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE5vZGVzLnNwbGljZShcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGROb2Rlcy5pbmRleE9mKGNoaWxkTm9kZSksIDEpO1xyXG5cclxuICAgICAgICAgICAgY2hpbGROb2RlLnBhcmVudE5vZGUgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdOb2RlIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgbm9kZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNoaWxkTm9kZTtcclxuICAgIH1cclxufTsiLCJjb25zdCBwc2V1ZG9TZWxlY3RvclJlZ2V4ID0gLyhbXFx3LV0rKSg/OlxcKChbXFx3XFxXXSspXFwpfCkvO1xuXG5jb25zdCBQU2VsZWN0b3JJbXBsID0ge1xuICAgICdmaXJzdC1jaGlsZCc6IChub2RlKSA9PiB7XG4gICAgICAgIGxldCBjaGlsZExpc3QgPSBub2RlLnBhcmVudE5vZGUuY2hpbGRyZW47XG4gICAgICAgIHJldHVybiAoY2hpbGRMaXN0LmluZGV4T2Yobm9kZSkgPT0gMCk7XG4gICAgfSxcbiAgICBcbiAgICAnbGFzdC1jaGlsZCc6IChub2RlKSA9PiB7XG4gICAgICAgIGxldCBjaGlsZExpc3QgPSBub2RlLnBhcmVudE5vZGUuY2hpbGRyZW47XG4gICAgICAgIHJldHVybiAoY2hpbGRMaXN0LmluZGV4T2Yobm9kZSkgPT0gY2hpbGRMaXN0Lmxlbmd0aCAtIDEpO1xuICAgIH0sXG4gICAgXG4gICAgJ250aC1jaGlsZCc6IChub2RlLCBpbmRleCkgPT4ge1xuICAgICAgICBpbmRleCA9IHBhcnNlSW50KGluZGV4KTtcbiAgICAgICAgbGV0IGNoaWxkTGlzdCA9IG5vZGUucGFyZW50Tm9kZS5jaGlsZHJlbjtcbiAgICAgICAgcmV0dXJuIChjaGlsZExpc3QuaW5kZXhPZihub2RlKSA9PSBpbmRleCAtIDEpO1xuICAgIH0sXG4gICAgXG4gICAgJ25vdCc6IChub2RlLCBzZWxlY3RvcikgPT4ge1xuICAgICAgICByZXR1cm4gIW5vZGUubWF0Y2hlcyhzZWxlY3Rvcik7XG4gICAgfSxcbiAgICBcbiAgICAnZW1wdHknOiAobm9kZSkgPT4ge1xuICAgICAgICByZXR1cm4gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PSAwO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoYmFzZSA9IGNsYXNzIHt9KSA9PiB7XG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSB7XG4gICAgICAgIHBhcnNlUHNldWRvU2VsZWN0b3JFeHJlc3Npb24ocHNldWRvU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHBzZXVkb1NlbGVjdG9yUmVnZXguZXhlYyhwc2V1ZG9TZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuYWJsZSB0byBwYXJzZSBwc2V1ZG9TZWxlY3RvciAnJHtwc2V1ZG9TZWxlY3Rvcn0nLmApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgbmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIShuYW1lIGluIFBTZWxlY3RvckltcGwpKSB0aHJvdyBTeW50YXhFcnJvcihgVW5zdXBwb3J0ZWQgcHNldWRvIHNlbGVjdG9yICcke25hbWV9J2ApXG4gICAgICAgICAgICByZXR1cm4gKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUFNlbGVjdG9ySW1wbFtuYW1lXShub2RlLCBwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImNvbnN0IENsYXNzTGlzdCA9IHJlcXVpcmUoJy4vY2xhc3MtbGlzdC5qcycpO1xyXG5jb25zdCBBdHRyaWJ1dGVTZWxlY3Rvck1peGluID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGUtc2VsZWN0b3ItbWl4aW4uanMnKTtcclxuY29uc3QgUHNldWRvU2VsZWN0b3JNaXhpbiA9IHJlcXVpcmUoJy4vcHNldWRvLXNlbGVjdG9yLW1peGluLmpzJyk7XHJcblxyXG5jb25zdCBRc2FTZWFyY2hUeXBlcyA9IHtcclxuICAgIGRlZmF1bHQ6IDAsIC8vIGRlZXBcclxuICAgIHNoYWxsb3c6IDEsIC8vIGRpcmVjdCBkZWNlbmRhbnRcclxuICAgIGRpcmVjdFNpYmxpbmc6IDIsXHJcbiAgICBnZW5lcmFsU2libGluZzogM1xyXG59O1xyXG5cclxuY29uc3QgdmFsaWRRc1JlZ2V4ID0gL15bXFxcXCNcXC4sXFwkXFxeXFx8XFx3XFwtOj1cXHM+XFwqflxcK1xcW1xcXVxcKFxcKSdcIl0rJC87XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFF1ZXJ5U2VsZWN0YWJsZSBleHRlbmRzIEF0dHJpYnV0ZVNlbGVjdG9yTWl4aW4oXHJcbiAgICBQc2V1ZG9TZWxlY3Rvck1peGluKCkpIHtcclxuICAgICAgICBcclxuICAgIF9fc2VhcmNoRG9tKCkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01ldGhvZCBgX19zZWFyY2hEb21gIGlzIG5vdCBpbXBsZW1lbnRlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBfX3BhcnNlUXVlcnlTZWxlY3RvclN0cmluZyhzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmKCF2YWxpZFFzUmVnZXgudGVzdChzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgdGhpcy5fX3Rocm93SW52YWxpZFF1ZXJ5U2VsZWN0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0b2tlbnMgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gbm9ybWFsaXplIGFuZCBzYW5pdGl6ZSB0aGUgcXVlcnkgc2VsZWN0b3Igc3RyaW5nXHJcbiAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC9cXHMrL2csICcgJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccyooPnxcXCt8fnwsKVxccyovZywgJyQxJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoL15cXHMrLywgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrJC8sICcnKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIGFsbCB0aGUgZGlmZmVyZW50IHRva2Vuc1xyXG4gICAgICAgIC8vIGFkZGVkIHN1cHBvcnQgZm9yIGVzY2FwZWQgcXVlcmllcyBsaWtlIGAubnVtYmVyc1xcXFw6ZW5hYmxlZGBcclxuICAgICAgICBsZXQgdGFnU2VsZWN0b3IgPSAnKD86XFxcXHN8PnxcXFxcK3x+fF4pKFtcXFxcdy1dKyg/OltcXFxcdy1dKig/OlxcXFxcXFxcLikqW1xcXFx3LV0qKSp8XFxcXCopJztcclxuICAgICAgICBsZXQgY2xhc3NOYW1lU2VsZWN0b3IgPSAnXFxcXC4oW1xcXFx3LV0rKD86W1xcXFx3LV0qKD86XFxcXFxcXFwuKSpbXFxcXHctXSopKiknO1xyXG4gICAgICAgIGxldCBpZFNlbGVjdG9yID0gJyMoW1xcXFx3LV0rKD86W1xcXFx3LV0qKD86XFxcXFxcXFwuKSpbXFxcXHctXSopKiknO1xyXG4gICAgICAgIGxldCBhdHRyYnV0ZVNlbGVjdG9yID0gJ1xcXFxbKFtcXFxcd1xcXFxXXSs/KD86PSg/OlwifFxcJylbXFxcXHdcXFxcV10qPyg/OlwifFxcJyl8KSlcXFxcXSc7XHJcbiAgICAgICAgbGV0IGFuY2VzdG9yVHlwZSA9ICcoXFxcXHN8PnxcXFxcK3x+KSc7XHJcbiAgICAgICAgbGV0IHBzZXVkb1NlbGVjdG9yID0gJzooW1xcXFx3LV0rKD86XFxcXChbXFxcXHdcXFxcV10rP1xcXFwpfCkpJztcclxuXHJcbiAgICAgICAgLy8gY29uY2F0aW5hdGUgYWxsIHRoZSByZWdleGVzIHRvIG9uZSB0b2tlIHJlZ2V4XHJcbiAgICAgICAgbGV0IHRva2VuUmVnZXggPSBuZXcgUmVnRXhwKGAoPzoke1tcclxuICAgICAgICAgICAgYW5jZXN0b3JUeXBlLFxyXG4gICAgICAgICAgICB0YWdTZWxlY3RvcixcclxuICAgICAgICAgICAgaWRTZWxlY3RvcixcclxuICAgICAgICAgICAgY2xhc3NOYW1lU2VsZWN0b3IsXHJcbiAgICAgICAgICAgIGF0dHJidXRlU2VsZWN0b3IsXHJcbiAgICAgICAgICAgIHBzZXVkb1NlbGVjdG9yXHJcbiAgICAgICAgXS5qb2luKCd8Jyl9KWApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHdoaWxlKCEhc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgbGV0IG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5zbGljZShtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgbWF0Y2gubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihtYXRjaFtpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleXdvcmQgPSBtYXRjaFtpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpICE9PSA2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXdvcmQgPSBrZXl3b3JkLnJlcGxhY2UoL1xcXFwvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXdvcmQ6IGtleXdvcmRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRva2VucztcclxuICAgIH1cclxuXHJcbiAgICBfX3FzYVNlYXJjaFR5cGUoc2VwYXJhdG9yKSB7XHJcbiAgICAgICAgc3dpdGNoKHNlcGFyYXRvcikge1xyXG4gICAgICAgICAgICBjYXNlICc+JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBRc2FTZWFyY2hUeXBlcy5zaGFsbG93O1xyXG4gICAgICAgICAgICBjYXNlICcrJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBRc2FTZWFyY2hUeXBlcy5kaXJlY3RTaWJsaW5nO1xyXG4gICAgICAgICAgICBjYXNlICd+JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBRc2FTZWFyY2hUeXBlcy5nZW5lcmFsU2libGluZztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBRc2FTZWFyY2hUeXBlcy5kZWZhdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfX2J1aWxkUXNhQ3JpdGVyaWFzKHRva2Vucykge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYXMgPSBbXTtcclxuICAgICAgICBsZXQgc2VhcmNoQ3JpdGVyaWEgPSB7fTtcclxuICAgICAgICB0b2tlbnMuZm9yRWFjaCgodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ3JpdGVyaWFzLnB1c2goc2VhcmNoQ3JpdGVyaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaENyaXRlcmlhcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoVHlwZTogdGhpcy5fX3FzYVNlYXJjaFR5cGUodG9rZW4ua2V5d29yZClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDcml0ZXJpYSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5rZXl3b3JkICE9ICcqJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hDcml0ZXJpYS50YWdOYW1lID0gdG9rZW4ua2V5d29yZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ3JpdGVyaWEuYXR0cmlidXRlcyA9IHNlYXJjaENyaXRlcmlhLmF0dHJpYnV0ZXMgfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ3JpdGVyaWEuYXR0cmlidXRlcy5pZCA9IHRva2VuLmtleXdvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ3JpdGVyaWEuY2xhc3NMaXN0ID0gc2VhcmNoQ3JpdGVyaWEuY2xhc3NMaXN0IHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaENyaXRlcmlhLmNsYXNzTGlzdC5wdXNoKHRva2VuLmtleXdvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaENyaXRlcmlhLmF0dHJpYnV0ZXMgPSBzZWFyY2hDcml0ZXJpYS5hdHRyaWJ1dGVzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyVG9rZW4gPSB0aGlzLnBhcnNlQXR0cmlidXRlRXhwcmVzc2lvbih0b2tlbi5rZXl3b3JkKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDcml0ZXJpYS5hdHRyaWJ1dGVzW2F0dHJUb2tlbi5uYW1lXSA9IGF0dHJUb2tlbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDcml0ZXJpYS5wc2V1ZG9TZWxlY3RvcnMgPSBzZWFyY2hDcml0ZXJpYS5wc2V1ZG9TZWxlY3RvcnMgfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBzZXVkb1NlbGVjdG9yID0gdGhpcy5wYXJzZVBzZXVkb1NlbGVjdG9yRXhyZXNzaW9uKHRva2VuLmtleXdvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaENyaXRlcmlhLnBzZXVkb1NlbGVjdG9ycy5wdXNoKHBzZXVkb1NlbGVjdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhcy5wdXNoKHNlYXJjaENyaXRlcmlhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlYXJjaENyaXRlcmlhcztcclxuICAgIH1cclxuXHJcbiAgICBfX3FzYVNlYXJjaEJ5VHlwZShjb250ZXh0TGlzdCwgY3JpdGVyaWEsIG9uZSwgc2VhcmNoVHlwZSkge1xyXG4gICAgICAgIGlmKHNlYXJjaFR5cGUgPT0gUXNhU2VhcmNoVHlwZXMuZGVmYXVsdCB8fCBzZWFyY2hUeXBlID09IFFzYVNlYXJjaFR5cGVzLnNoYWxsb3cpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19xc2FTZWFyY2hUcmVlKGNvbnRleHRMaXN0LCBjcml0ZXJpYSwgb25lLCBzZWFyY2hUeXBlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX3FzYVNlYXJjaFNpYmxpbmdzKGNvbnRleHRMaXN0LCBjcml0ZXJpYSwgb25lLCBzZWFyY2hUeXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX19xc2FDb21wYXJlTm9kZShjcml0ZXJpYSwgbm9kZSkge1xyXG4gICAgICAgIGxldCBtYXRjaGVzID0gdHJ1ZTtcclxuICAgICAgICBPYmplY3Qua2V5cyhjcml0ZXJpYSkuZm9yRWFjaCgocHJvcCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCEoY3JpdGVyaWFbcHJvcF0gaW5zdGFuY2VvZiBSZWdFeHApICYmXHJcbiAgICAgICAgICAgICAgICBjcml0ZXJpYVtwcm9wXSBpbnN0YW5jZW9mIE9iamVjdCAmJlxyXG4gICAgICAgICAgICAgICAgcHJvcCAhPSAncHNldWRvU2VsZWN0b3JzJykge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IG1hdGNoZXMgJiYgdGhpcy5fX3FzYUNvbXBhcmVOb2RlKGNyaXRlcmlhW3Byb3BdLCBub2RlW3Byb3BdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBDbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzICYmIG5vZGUuY29udGFpbnMoY3JpdGVyaWFbcHJvcF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNyaXRlcmlhW3Byb3BdIGluc3RhbmNlb2YgUmVnRXhwKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiBub2RlW3Byb3BdICE9PSB1bmRlZmluZWQgJiYgY3JpdGVyaWFbcHJvcF0udGVzdChub2RlW3Byb3BdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wID09ICdwc2V1ZG9TZWxlY3RvcnMnKSB7XHJcbiAgICAgICAgICAgICAgICBjcml0ZXJpYVtwcm9wXS5mb3JFYWNoKChwc2V1ZG9TZWxlY3RvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzICYmIHBzZXVkb1NlbGVjdG9yKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiBub2RlW3Byb3BdID09IGNyaXRlcmlhW3Byb3BdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcXNhU2VhcmNoU2libGluZ3MoY29udGV4dExpc3QsIGNyaXRlcmlhLCBvbmUsIHNlYXJjaFR5cGUpIHtcclxuICAgICAgICBsZXQgZm91bmROb2RlcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjb250ZXh0TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IGNvbnRleHRMaXN0W2ldO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcmVudCA9IGNvbnRleHQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgbGV0IGluZGV4SW5QYXJlbnQgPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihjb250ZXh0KTtcclxuICAgICAgICAgICAgaWYoaW5kZXhJblBhcmVudCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb2xsb3dpbmdTaWJsaW5ncyA9IHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXhJblBhcmVudCArIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBmb2xsb3dpbmdTaWJsaW5ncy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0U2libGluZyA9IGZvbGxvd2luZ1NpYmxpbmdzW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9fcXNhQ29tcGFyZU5vZGUoY3JpdGVyaWEsIG5leHRTaWJsaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZE5vZGVzLnB1c2gobmV4dFNpYmxpbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYob25lKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlYXJjaFR5cGUgPT0gUXNhU2VhcmNoVHlwZXMuZGlyZWN0U2libGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYob25lICYmIGZvdW5kTm9kZXMubGVuZ3RoID4gMCkgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmb3VuZE5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcXNhU2VhcmNoVHJlZShjb250ZXh0TGlzdCwgY3JpdGVyaWEsIG9uZSwgc2VhcmNoVHlwZSkge1xyXG4gICAgICAgIGxldCBmb3VuZE5vZGVzID0gW107XHJcbiAgICAgICAgY29udGV4dExpc3QuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBmb3VuZE5vZGVzID0gZm91bmROb2Rlcy5jb25jYXQodGhpcy5fX3NlYXJjaERvbShjb250ZXh0LCAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19xc2FDb21wYXJlTm9kZShjcml0ZXJpYSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH0sIG9uZSwgc2VhcmNoVHlwZSA9PSBRc2FTZWFyY2hUeXBlcy5zaGFsbG93KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmb3VuZE5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIF9fcXNhU2VhcmNoKGNvbnRleHRMaXN0LCBjcml0ZXJpYXMsIG9uZSkge1xyXG4gICAgICAgIG9uZSA9IG9uZSB8fCBmYWxzZTtcclxuICAgICAgICBsZXQgZm91bmROb2RlcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY3JpdGVyaWFzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjcml0ZXJpYSA9IGNyaXRlcmlhc1tpXTtcclxuICAgICAgICAgICAgbGV0IHNlYXJjaFR5cGUgPSBRc2FTZWFyY2hUeXBlcy5kZWZhdWx0O1xyXG5cclxuICAgICAgICAgICAgaWYoJ3NlYXJjaFR5cGUnIGluIGNyaXRlcmlhKSB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hUeXBlID0gY3JpdGVyaWEuc2VhcmNoVHlwZTtcclxuICAgICAgICAgICAgICAgIGNyaXRlcmlhID0gY3JpdGVyaWFzW2kgPSBpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBmb3VuZE5vZGVzID0gdGhpcy5fX3FzYVNlYXJjaEJ5VHlwZShcclxuICAgICAgICAgICAgICAgIGNvbnRleHRMaXN0LFxyXG4gICAgICAgICAgICAgICAgY3JpdGVyaWEsXHJcbiAgICAgICAgICAgICAgICBvbmUgJiYgaSA9PSBjcml0ZXJpYXMubGVuZ3RoIC0gMSxcclxuICAgICAgICAgICAgICAgIHNlYXJjaFR5cGVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCBhbiB1bmlxdWUgbGlzdCBvZiBtYXRjaGVzXHJcbiAgICAgICAgICAgIGZvdW5kTm9kZXMgPSBmb3VuZE5vZGVzLmZpbHRlcigoaXRlbSwgaW5kZXgsIGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0LmluZGV4T2YoaXRlbSkgPT09IGluZGV4O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHRMaXN0ID0gZm91bmROb2RlcztcclxuXHJcbiAgICAgICAgICAgIGlmKGNvbnRleHRMaXN0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZvdW5kTm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgX190aHJvd0ludmFsaWRRdWVyeVNlbGVjdG9yKGV4KSB7XHJcbiAgICAgICAgaWYoZXggaW5zdGFuY2VvZiBTeW50YXhFcnJvcikgdGhyb3cgZXg7XHJcbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdpbnZhbGlkIHF1ZXJ5IHNlbGVjdG9yJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF9fcXNhU29ydChsaXN0KSB7XHJcbiAgICAgICAgbGV0IHJlZHVjZXIgPSAobGlzdCwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIGl0ZW0uY2hpbGROb2Rlcy5yZWR1Y2UocmVkdWNlciwgbGlzdCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmbGF0RG9tID0gW3RoaXNdLnJlZHVjZShyZWR1Y2VyLCBbXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGxpc3Quc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYWluZGV4ID0gZmxhdERvbS5pbmRleE9mKGEpO1xyXG4gICAgICAgICAgICBsZXQgYmluZGV4ID0gZmxhdERvbS5pbmRleE9mKGIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGFpbmRleCA+IGJpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihhaW5kZXggPCBiaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF9fZXhlY1FzYShzZWxlY3Rvciwgb25lKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gW107XHJcbiAgICAgICAgbGV0IHN1YlNlbGVjdG9ycyA9IHNlbGVjdG9yLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHN1YlNlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgc3ViU2VsZWN0b3IgPSBzdWJTZWxlY3RvcnNbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdG9rZW5zID0gdGhpcy5fX3BhcnNlUXVlcnlTZWxlY3RvclN0cmluZyhzdWJTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYXMgPSB0aGlzLl9fYnVpbGRRc2FDcml0ZXJpYXModG9rZW5zKTtcclxuICAgICAgICAgICAgbGV0IGZvdW5kSW5RdWVyeSA9IHRoaXMuX19xc2FTZWFyY2goW3RoaXNdLCBzZWFyY2hDcml0ZXJpYXMsIG9uZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3VuZEluUXVlcnkuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZm91bmQuaW5kZXhPZihub2RlKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3ViU2VsZWN0b3JzLmxlbmd0aCA+IDE/IHRoaXMuX19xc2FTb3J0KGZvdW5kKTogZm91bmQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1hdGNoZXMoc2VsZWN0b3IpIHtcclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMub3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICBsZXQgaSA9IGxpc3QubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlKC0taSA+PSAwICYmIGxpc3RbaV0gIT09IHRoaXMpIHt9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGkgPiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBxdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19leGVjUXNhKHNlbGVjdG9yKVswXSB8fCBudWxsO1xyXG4gICAgICAgIH0gY2F0Y2goZXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fX3Rocm93SW52YWxpZFF1ZXJ5U2VsZWN0b3IoZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBxdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19leGVjUXNhKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGNhdGNoKGV4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX190aHJvd0ludmFsaWRRdWVyeVNlbGVjdG9yKGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbiIsImNsYXNzIE5vZGVGaWx0ZXIge1xuICAgIHN0YXRpYyBnZXQgRklMVEVSX0FDQ0VQVCgpIHsgcmV0dXJuIDE7IH1cbiAgICBzdGF0aWMgZ2V0IEZJTFRFUl9SRUpFQ1QoKSB7IHJldHVybiAyOyB9XG4gICAgc3RhdGljIGdldCBGSUxURVJfU0tJUCgpIHsgcmV0dXJuIDM7IH1cbiAgICBzdGF0aWMgZ2V0IFNIT1dfQUxMKCkgeyByZXR1cm4gNDI5NDk2NzI5NTsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19FTEVNRU5UKCkgeyByZXR1cm4gMTsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19BVFRSSUJVVEUoKSB7IHJldHVybiAyOyB9XG4gICAgc3RhdGljIGdldCBTSE9XX1RFWFQoKSB7IHJldHVybiA0OyB9XG4gICAgc3RhdGljIGdldCBTSE9XX0NEQVRBX1NFQ1RJT04oKSB7IHJldHVybiA4OyB9XG4gICAgc3RhdGljIGdldCBTSE9XX0VOVElUWV9SRUZFUkVOQ0UoKSB7IHJldHVybiAxNjsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19FTlRJVFkoKSB7IHJldHVybiAzMjsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19QUk9DRVNTSU5HX0lOU1RSVUNUSU9OKCkgeyByZXR1cm4gNjQ7IH1cbiAgICBzdGF0aWMgZ2V0IFNIT1dfQ09NTUVOVCgpIHsgcmV0dXJuIDEyODsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19ET0NVTUVOVCgpIHsgcmV0dXJuIDI1NjsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19ET0NVTUVOVF9UWVBFKCkgeyByZXR1cm4gNTEyOyB9XG4gICAgc3RhdGljIGdldCBTSE9XX0RPQ1VNRU5UX0ZSQUdNRU5UKCkgeyByZXR1cm4gMTAyNDsgfVxuICAgIHN0YXRpYyBnZXQgU0hPV19OT1RBVElPTigpIHsgcmV0dXJuIDIwNDg7IH1cbn1cblxuY2xhc3MgVHJlZVdhbGtlciB7XG4gICAgY29uc3RydWN0b3Iocm9vdCwgd2hhdFRvU2hvdywgZmlsdGVyKSB7XG4gICAgICAgIHRoaXMuXyA9IHt9O1xuICAgICAgICB0aGlzLl9maWx0ZXIgPSBmaWx0ZXI7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgICB0aGlzLl93aGF0VG9TaG93ID0gd2hhdFRvU2hvdztcbiAgICAgICAgdGhpcy5fZmxhdFRyZWUgPSBbXTtcbiAgICAgICAgdGhpcy5faXRlcmF0b3IgPSAtMTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3JlZHVjZXIoKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IGZpbHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlcjtcbiAgICB9XG4gICAgXG4gICAgZ2V0IHJvb3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuICAgIH1cbiAgICBcbiAgICBnZXQgd2hhdFRvU2hvdygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3doYXRUb1Nob3c7XG4gICAgfVxuICAgIFxuICAgIGdldCBjdXJyZW50Tm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsYXRUcmVlW3RoaXMuX2l0ZXJhdG9yXSB8fCBudWxsO1xuICAgIH1cbiAgICBcbiAgICBfbGlzdEZpbHRlcihpdGVtKSB7XG4gICAgICAgIGlmKCF0aGlzLl9maWx0ZXIgfHwgdGhpcy5fZmlsdGVyLmFjY2VwdE5vZGUoaXRlbSkgPT0gTm9kZUZpbHRlci5GSUxURVJfQUNDRVBUKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5fZmlsdGVyLmFjY2VwdE5vZGUoaXRlbSkgPT0gTm9kZUZpbHRlci5GSUxURVJfU0tJUCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuX2ZpbHRlci5hY2NlcHROb2RlKGl0ZW0pID09IE5vZGVGaWx0ZXIuRklMVEVSX1JFSkVDVCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9zaG91bGRTaG93SXRlbShpdGVtKSB7XG4gICAgICAgIGlmKHRoaXMuX2xpc3RGaWx0ZXIoaXRlbSkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgX3JlZHVjZXIoKSB7XG4gICAgICAgIGxldCByZWR1Y2VyID0gKGxpc3QsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJUeXBlID0gdGhpcy5fbGlzdEZpbHRlcihpdGVtKTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJUeXBlID09PSAwKVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93aGF0VG9TaG93ID09IE5vZGVGaWx0ZXIuU0hPV19BTEwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2hhdFRvU2hvdyA9PSBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVCAmJlxuICAgICAgICAgICAgICAgICAgICBpdGVtLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2hhdFRvU2hvdyA9PSBOb2RlRmlsdGVyLlNIT1dfVEVYVCAmJlxuICAgICAgICAgICAgICAgICAgICBpdGVtLm5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2hhdFRvU2hvdyA9PSBOb2RlRmlsdGVyLlNIT1dfQ0RBVEFfU0VDVElPTiAmJiBcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ub2RlVHlwZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3doYXRUb1Nob3cgPT0gTm9kZUZpbHRlci5TSE9XX0NPTU1FTlQgJiYgXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubm9kZVR5cGUgPT0gOCkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZmlsdGVyVHlwZSAhPT0gLTEpXG4gICAgICAgICAgICAgICAgaXRlbS5jaGlsZE5vZGVzLnJlZHVjZShyZWR1Y2VyLCBsaXN0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9mbGF0VHJlZSA9IFt0aGlzLl9yb290XS5yZWR1Y2UocmVkdWNlciwgW10pO1xuICAgIH1cbiAgICBcbiAgICBwYXJlbnROb2RlKCkge1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jdXJyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9mbGF0VHJlZS5pbmRleE9mKHBhcmVudCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVyYXRvciA9IGluZGV4O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmaXJzdENoaWxkKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuY3VycmVudE5vZGU7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2ZsYXRUcmVlLmluZGV4T2Yobm9kZS5jaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVyYXRvciA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxhc3RDaGlsZCgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmN1cnJlbnROb2RlO1xuICAgICAgICBmb3IobGV0IGkgPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2ZsYXRUcmVlLmluZGV4T2Yobm9kZS5jaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVyYXRvciA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByZXZpb3VzU2libGluZygpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmN1cnJlbnROb2RlO1xuICAgICAgICB3aGlsZSgobm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nKSkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZmxhdFRyZWUuaW5kZXhPZihub2RlKTtcbiAgICAgICAgICAgIGlmKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZXJhdG9yID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIG5leHRTaWJsaW5nKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuY3VycmVudE5vZGU7XG4gICAgICAgIHdoaWxlKChub2RlID0gbm9kZS5uZXh0U2libGluZykpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2ZsYXRUcmVlLmluZGV4T2Yobm9kZSk7XG4gICAgICAgICAgICBpZihpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVyYXRvciA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgXG4gICAgbmV4dE5vZGUoKSB7XG4gICAgICAgIGlmKHRoaXMuX2l0ZXJhdG9yID09IHRoaXMuX2ZsYXRUcmVlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2l0ZXJhdG9yKys7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnROb2RlO1xuICAgIH1cbiAgICBcbiAgICBwcmV2aW91c05vZGUoKSB7XG4gICAgICAgIGlmKHRoaXMuX2l0ZXJhdG9yID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5faXRlcmF0b3ItLTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE5vZGU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBUcmVlV2Fsa2VyOiBUcmVlV2Fsa2VyLFxuICAgIE5vZGVGaWx0ZXI6IE5vZGVGaWx0ZXJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgJ2FyZWEnLFxuICAgICdiYXNlJyxcbiAgICAnYnInLFxuICAgICdjb2wnLFxuICAgICdjb21tYW5kJyxcbiAgICAnZW1iZWQnLFxuICAgICdocicsXG4gICAgJ2ltZycsXG4gICAgJ2lucHV0JyxcbiAgICAna2V5Z2VuJyxcbiAgICAnbGluaycsXG4gICAgJ21lbnVpdGVtJyxcbiAgICAnbWV0YScsXG4gICAgJ3BhcmFtJyxcbiAgICAnc291cmNlJyxcbiAgICAndHJhY2snLFxuICAgICd3YnInXG5dOyJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKcGJtUmxlQzVxY3lJc0luTnlZeTloZEhSeWFXSjFkR1V0YzJWc1pXTjBiM0l0YldsNGFXNHVhbk1pTENKemNtTXZZMnhoYzNNdGJHbHpkQzVxY3lJc0luTnlZeTlqZFhSdmJTMWhjbkpoZVMxemFHbHRMbXB6SWl3aWMzSmpMMlJ2WTNWdFpXNTBMbXB6SWl3aWMzSmpMMlJ2YlMxd1lYSnpaUzVxY3lJc0luTnlZeTlsYkdWdFpXNTBMbXB6SWl3aWMzSmpMM0J6WlhWa2J5MXpaV3hsWTNSdmNpMXRhWGhwYmk1cWN5SXNJbk55WXk5eGRXVnllUzF6Wld4bFkzUmhZbXhsTG1weklpd2ljM0pqTDNSeVpXVXRkMkZzYTJWeUxtcHpJaXdpYzNKakwzWnZhV1F0Wld4bGJXVnVkSE11YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenM3T3pzN08wRkRRVUVzU1VGQlRTeFhRVUZYTEZGQlFWRXNiMEpCUVZJc1EwRkJha0k3TzBGQlJVRXNTVUZCU1N4UlFVRlJMRlZCUVZvN08wbEJRMDBzVnpzN096czdPenQzUTBGTFl5eFRMRVZCUVhORE8wRkJRVUVzWjBKQlFUTkNMRmRCUVRKQ0xIVkZRVUZpTEZkQlFXRTdPMEZCUTJ4RUxHMUNRVUZQTEZOQlFWTXNTMEZCVkN4RFFVRmxMRk5CUVdZc1JVRkJNRUlzVjBGQk1VSXNSVUZCZFVNc1MwRkJka01zUTBGQlVEdEJRVU5JT3pzN05FSkJUblZDTzBGQlFVVXNiVUpCUVU4c1VVRkJVU3h0UWtGQlVpeEZRVUUyUWl4VlFVRndRenRCUVVGcFJEczdPelJDUVVONlJEdEJRVUZGTEcxQ1FVRlBMRXRCUVZBN1FVRkJaU3hUT3pCQ1FVTnVRaXhITEVWQlFVczdRVUZCUlN4dlFrRkJVU3hIUVVGU08wRkJRV003T3pzN096dEJRVTk2UXl4SlFVRkhMRTlCUVU4c1RVRkJWaXhGUVVGclFqdEJRVU5rTEZGQlFVa3NRMEZCUXl4UFFVRlBMRTFCUVZBc1EwRkJZeXhUUVVGdVFpeEZRVUU0UWp0QlFVTXhRaXhsUVVGUExFMUJRVkFzUTBGQll5eFRRVUZrTEVkQlFUQkNMRmRCUVRGQ08wRkJRMEVzWlVGQlR5eE5RVUZRTEVOQlFXTXNWVUZCWkN4SFFVRXlRaXhaUVVGWkxGVkJRWFpETzBGQlEwZ3NTMEZJUkN4TlFVZFBPMEZCUTBnc1pVRkJUeXhOUVVGUUxFTkJRV01zVjBGQlpDeEhRVUUwUWl4WFFVRTFRanRCUVVOSU8wRkJRMG9zUTBGUVJDeE5RVTlQTzBGQlEwZ3NWMEZCVHl4UFFVRlFMRWRCUVdsQ0xGZEJRV3BDTzBGQlEwZzdPenM3T3pzN096czdPenM3T3p0QlEzUkNSQ3hKUVVGTkxHbENRVUZwUWl4clJrRkJka0k3TzBGQlJVRXNTVUZCVFN4bFFVRmxMRk5CUVdZc1dVRkJaU3hEUVVGRExFZEJRVVFzUlVGQlV6dEJRVU14UWl4UlFVRkhMRkZCUVZFc1UwRkJXQ3hGUVVGelFqdEJRVU5zUWp0QlFVTklPenRCUVVWRUxGZEJRVThzU1VGQlNTeFBRVUZLTEVOQlFWa3NjVU5CUVZvc1JVRkJiVVFzVFVGQmJrUXNRMEZCVUR0QlFVTklMRU5CVGtRN08wRkJVVUVzVDBGQlR5eFBRVUZRTEVkQlFXbENMRmxCUVhGQ08wRkJRVUVzVVVGQmNFSXNTVUZCYjBJN1FVRkJRVHRCUVVGQk8wRkJRVUU3TzBGQlFVRTdRVUZCUVRzN1FVRkRiRU03UVVGQlFUczdRVUZCUVR0QlFVRkJPenRCUVVGQk8wRkJRVUU3TzBGQlFVRTdRVUZCUVR0QlFVRkJMSEZFUVVNMlFpeFZRVVEzUWl4RlFVTjVRenRCUVVOcVF5dzJRa0ZCWVN4WFFVRlhMRTlCUVZnc1EwRkJiVUlzVFVGQmJrSXNSVUZCTWtJc1JVRkJNMElzUlVGRFVpeFBRVVJSTEVOQlEwRXNUVUZFUVN4RlFVTlJMRVZCUkZJc1EwRkJZanM3UVVGSFFTeHZRa0ZCU3l4UlFVRlJMR1ZCUVdVc1NVRkJaaXhEUVVGdlFpeFZRVUZ3UWl4RFFVRmlPenRCUVVWQkxHOUNRVUZKTEZkQlFWY3NUVUZCVFN4RFFVRk9MRU5CUVdZN1FVRkRRU3h2UWtGQlNTeHpRa0ZCYzBJc1RVRkJUU3hEUVVGT0xFTkJRVEZDTzBGQlEwRXNiMEpCUVVrc1dVRkJXU3hOUVVGTkxFTkJRVTRzUTBGQmFFSTdRVUZEUVN4dlFrRkJTU3hYUVVGWExFMUJRVTBzUTBGQlRpeERRVUZtT3p0QlFVVkJMSFZDUVVGUExFdEJRVXNzWlVGQlRDeERRVUZ4UWl4UlFVRnlRaXhGUVVFclFpeHRRa0ZCTDBJc1JVRkJiMFFzVTBGQmNFUXNSVUZCSzBRc1VVRkJMMFFzUTBGQlVEdEJRVU5JTzBGQllrdzdRVUZCUVR0QlFVRkJMRFJEUVdWdlFpeEpRV1p3UWl4RlFXVXdRaXhsUVdZeFFpeEZRV1V5UXl4TFFXWXpReXhGUVdWclJDeFJRV1pzUkN4RlFXVTBSRHRCUVVOd1JDeDNRa0ZCVVN4aFFVRmhMRXRCUVdJc1EwRkJVanRCUVVOQkxIZENRVUZQTEdWQlFWQTdRVUZEU1N4NVFrRkJTeXhIUVVGTU8wRkJRMGtzTUVOQlFXdENMRWxCUVVrc1RVRkJTaXhOUVVGakxFdEJRV1FzUlVGQmRVSXNVVUZCZGtJc1EwRkJiRUk3UVVGRFFUdEJRVU5LTEhsQ1FVRkxMRWRCUVV3N1FVRkRTU3d3UTBGQmEwSXNTVUZCU1N4TlFVRktMR1ZCUVhWQ0xFdEJRWFpDTEdkQ1FVRjVReXhSUVVGNlF5eERRVUZzUWp0QlFVTkJPMEZCUTBvc2VVSkJRVXNzUjBGQlREdEJRVU5KTERCRFFVRnJRaXhKUVVGSkxFMUJRVW9zVDBGQlpTeExRVUZtTEdkQ1FVRnBReXhSUVVGcVF5eERRVUZzUWp0QlFVTkJPMEZCUTBvc2VVSkJRVXNzUjBGQlREdEJRVU5KTERCRFFVRnJRaXhKUVVGSkxFMUJRVW9zVDBGQlpTeExRVUZtTEVWQlFYZENMRkZCUVhoQ0xFTkJRV3hDTzBGQlEwRTdRVUZEU2l4NVFrRkJTeXhIUVVGTU8wRkJRMGtzTUVOQlFXdENMRWxCUVVrc1RVRkJTaXhEUVVGakxFdEJRV1FzVVVGQmQwSXNVVUZCZUVJc1EwRkJiRUk3UVVGRFFUdEJRVU5LTzBGQlEwa3NORUpCUVVrc1UwRkJVeXhUUVVGaUxFVkJRWGRDTEZGQlFWRXNXVUZCVWp0QlFVTjRRaXd3UTBGQmEwSXNTVUZCU1N4TlFVRktMRTlCUVdVc1MwRkJaaXhSUVVGNVFpeFJRVUY2UWl4RFFVRnNRanRCUVVOQk8wRkJia0pTTzBGQmNVSkJMSFZDUVVGUE8wRkJRMGdzTUVKQlFVMHNTVUZFU0R0QlFVVklMREpDUVVGUE8wRkJSa29zYVVKQlFWQTdRVUZKU0R0QlFURkRURHM3UVVGQlFUdEJRVUZCTEUxQlFYRkNMRWxCUVhKQ08wRkJORU5JTEVOQk4wTkVPenM3T3pzN096czdPenM3TzBGRFZrRXNTVUZCVFN4alFVRmpMRkZCUVZFc2RVSkJRVklzUTBGQmNFSTdPMEZCUlVFc1QwRkJUeXhQUVVGUU8wRkJRVUU3TzBGQlEwa3NlVUpCUVhGQ08wRkJRVUU3TzBGQlFVRTdPMEZCUVVFc01FTkJRVTRzU1VGQlRUdEJRVUZPTEdkQ1FVRk5PMEZCUVVFN08wRkJRVUVzY1VwQlExSXNTVUZFVVRzN1FVRkhha0lzWTBGQlN5eFJRVUZNTEVkQlFXZENMRWxCUVdoQ08wRkJTR2xDTzBGQlNYQkNPenRCUVV4TU8wRkJRVUU3UVVGQlFTd3dRMEZQYzBJN1FVRkRaQ3huUWtGQlJ5eFBRVUZQTEV0QlFVc3NVVUZCV2l4SlFVRjNRaXhWUVVFelFpeEZRVUYxUXp0QlFVTnVReXh4UWtGQlN5eFJRVUZNTEVOQlFXTXNTVUZCWkR0QlFVTklPMEZCUTBvN1FVRllURHRCUVVGQk8wRkJRVUVzYVVOQllXRXNTVUZpWWl4RlFXRnRRanRCUVVOWUxHMUNRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVdJc1RVRkJkVUlzUTBGQlF5eERRVUV2UWp0QlFVTklPMEZCWmt3N1FVRkJRVHRCUVVGQkxEaENRV2xDYTBJN1FVRkJRVHM3UVVGQlFTd3JRMEZCVUN4TFFVRlBPMEZCUVZBc2NVSkJRVTg3UVVGQlFUczdRVUZEVml4clFrRkJUU3hQUVVGT0xFTkJRV01zVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZEY0VJc2IwSkJRVWtzVDBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCWWl4TFFVRnpRaXhEUVVGRExFTkJRVE5DTEVWQlFUaENPMEZCUXpGQ0xESkNRVUZMTEVsQlFVd3NRMEZCVlN4SlFVRldPMEZCUTBnN1FVRkRTaXhoUVVwRU96dEJRVTFCTEdkQ1FVRkhMRTFCUVUwc1RVRkJUaXhIUVVGbExFTkJRV3hDTEVWQlFYRkNMRXRCUVVzc1pVRkJURHRCUVVONFFqdEJRWHBDVER0QlFVRkJPMEZCUVVFc2FVTkJNa0p4UWp0QlFVRkJPenRCUVVGQkxDdERRVUZRTEV0QlFVODdRVUZCVUN4eFFrRkJUenRCUVVGQk96dEJRVU5pTEd0Q1FVRk5MRTlCUVU0c1EwRkJZeXhWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU53UWl4dlFrRkJSeXhQUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEUxQlFYVkNMRU5CUVVNc1EwRkJNMElzUlVGQk9FSTdRVUZETVVJc01rSkJRVXNzVFVGQlRDeERRVUZaTEU5QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVdJc1EwRkJXaXhGUVVGblF5eERRVUZvUXp0QlFVTklPMEZCUTBvc1lVRktSRHM3UVVGTlFTeG5Ra0ZCUnl4TlFVRk5MRTFCUVU0c1IwRkJaU3hEUVVGc1FpeEZRVUZ4UWl4TFFVRkxMR1ZCUVV3N1FVRkRlRUk3UVVGdVEwdzdRVUZCUVR0QlFVRkJMRFpDUVhGRFV5eExRWEpEVkN4RlFYRkRaMEk3UVVGRFVpeHRRa0ZCVHl4TFFVRkxMRXRCUVV3c1EwRkJVRHRCUVVOSU8wRkJka05NTzBGQlFVRTdRVUZCUVN3clFrRjVRMWNzU1VGNlExZ3NSVUY1UXl0Q08wRkJRVUVzWjBKQlFXUXNTMEZCWXl4MVJVRkJUaXhKUVVGTk96dEJRVU4yUWl4blFrRkJSeXhEUVVGRExFdEJRVW9zUlVGQlZ6czdRVUZGV0N4blFrRkJTU3hMUVVGTExGRkJRVXdzUTBGQll5eEpRVUZrTEVOQlFVb3NSVUZCZVVJN1FVRkRja0lzY1VKQlFVc3NUVUZCVEN4RFFVRlpMRWxCUVZvN1FVRkRRU3h4UWtGQlN5eGxRVUZNTzBGQlEwZ3NZVUZJUkN4TlFVZFBPMEZCUTBnc2NVSkJRVXNzUjBGQlRDeERRVUZUTEVsQlFWUTdRVUZEUVN4eFFrRkJTeXhsUVVGTU8wRkJRMGc3UVVGRFNqdEJRVzVFVER0QlFVRkJPMEZCUVVFc1owTkJjVVJaTEU5QmNrUmFMRVZCY1VSeFFpeFBRWEpFY2tJc1JVRnhSRGhDTzBGQlEzUkNMR2RDUVVGSExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNUVUZCTUVJc1EwRkJReXhEUVVFNVFpeEZRVUZwUXp0QlFVTTNRaXh4UWtGQlN5eE5RVUZNTEVOQlFWa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGYUxFVkJRVzFETEVOQlFXNURMRVZCUVhORExFOUJRWFJETzBGQlEwRXNjVUpCUVVzc1pVRkJURHRCUVVOSU8wRkJRMG83UVVFeFJFdzdPMEZCUVVFN1FVRkJRU3hGUVVGNVF5eFhRVUY2UXpzN096czdRVU5HUVRzN096dEJRVWxCTEZOQlFWTXNWMEZCVkN4SFFVRjFRanRCUVVOdVFpeFZRVUZOTEVsQlFVNHNRMEZCVnl4SlFVRllPMEZCUTBFc1ZVRkJUU3hUUVVGT0xFTkJRV2RDTEV0QlFXaENMRU5CUVhOQ0xFbEJRWFJDTEVOQlFUSkNMRk5CUVROQ0xFVkJRWE5ETEVOQlFYUkRMRVZCUVhsRExFOUJRWHBETEVOQlFXbEVMRlZCUVZNc1NVRkJWQ3hGUVVGbE8wRkJRelZFTEdGQlFVc3NTVUZCVEN4RFFVRlZMRWxCUVZZN1FVRkRTQ3hMUVVablJDeERRVVV2UXl4SlFVWXJReXhEUVVVeFF5eEpRVVl3UXl4RFFVRnFSRHRCUVVkSU96dEJRVVZFTEZsQlFWa3NVMEZCV2l4SFFVRjNRaXhOUVVGTkxGTkJRVGxDTzBGQlEwRXNXVUZCV1N4VFFVRmFMRU5CUVhOQ0xGZEJRWFJDTEVkQlFXOURMRmRCUVhCRE96dEJRVVZCTEU5QlFVOHNUMEZCVUN4SFFVRnBRaXhYUVVGcVFqczdPenM3T3pzN096czdPenM3TzBGRFpFRXNTVUZCVFN4VlFVRlZMRkZCUVZFc1kwRkJVaXhEUVVGb1FqdEJRVU5CTEVsQlFVMHNZVUZCWVN4UlFVRlJMR3RDUVVGU0xFVkJRVFJDTEZWQlFTOURPenRCUVVWQkxFOUJRVThzVDBGQlVEdEJRVUZCT3p0QlFVTkpMSE5DUVVGWkxGZEJRVm9zUlVGQmVVSXNUMEZCZWtJc1JVRkJhME03UVVGQlFUczdRVUZCUVN4M1NFRkRlRUlzVjBGRWQwSXNSVUZEV0N4RFFVUlhPenRCUVVVNVFpeGpRVUZMTEZkQlFVd3NSMEZCYlVJc1YwRkJia0k3UVVGRFFTeGpRVUZMTEU5QlFVd3NSMEZCWlN4UFFVRm1PenRCUVVWQkxHVkJRVThzVFVGQlN5eFRRVUZhTzBGQlEwRXNaVUZCVHl4TlFVRkxMRlZCUVZvN1FVRk9PRUk3UVVGUGFrTTdPMEZCVWt3N1FVRkJRVHRCUVVGQkxHOURRVGhDWjBJc1UwRTVRbWhDTEVWQk9FSXlRanRCUVVOdVFpeG5Ra0ZCUnl4TFFVRkxMRlZCUVV3c1EwRkJaMElzVFVGQmFFSXNSMEZCZVVJc1EwRkJOVUlzUlVGQkswSTdRVUZETTBJc2MwSkJRVTBzU1VGQlNTeExRVUZLTEVOQlFWVXNOa05CUVZZc1EwRkJUanRCUVVOSU96dEJRVVZFTERSSVFVRnJRaXhUUVVGc1FqdEJRVU5JTzBGQmNFTk1PMEZCUVVFN1FVRkJRU3h6UTBGelEydENMRTlCZEVOc1FpeEZRWE5ETWtJN1FVRkRia0lzYlVKQlFVOHNTVUZCU1N4UFFVRktMRU5CUVZrc1QwRkJXaXhGUVVGeFFpeERRVUZ5UWl4RFFVRlFPMEZCUTBnN1FVRjRRMHc3UVVGQlFUdEJRVUZCTEhWRFFUQkRiVUlzVDBFeFEyNUNMRVZCTUVNMFFqdEJRVU53UWl4blFrRkJTU3hOUVVGUExFbEJRVWtzVDBGQlNpeERRVUZaTEU5QlFWb3NSVUZCY1VJc1EwRkJja0lzUTBGQldEdEJRVU5CTEdkQ1FVRkpMRmRCUVVvc1IwRkJhMElzVDBGQmJFSTdPMEZCUlVFc2JVSkJRVThzUjBGQlVEdEJRVU5JTzBGQkwwTk1PMEZCUVVFN1FVRkJRU3d5UTBGcFJIVkNMRTlCYWtSMlFpeEZRV2xFWjBNN1FVRkRlRUlzWjBKQlFVa3NUVUZCVFN4SlFVRkpMRTlCUVVvc1EwRkJXU3hsUVVGYUxFVkJRVFpDTEVOQlFUZENMRU5CUVZZN1FVRkRRU3huUWtGQlNTeFhRVUZLTEVkQlFXdENMRTlCUVd4Q096dEJRVVZCTEcxQ1FVRlBMRWRCUVZBN1FVRkRTRHRCUVhSRVREdEJRVUZCTzBGQlFVRXNjME5CZDBSclFpeFBRWGhFYkVJc1JVRjNSREpDTzBGQlEyNUNMR2RDUVVGSkxFMUJRVTBzU1VGQlNTeFBRVUZLTEVOQlFWa3NWVUZCV2l4RlFVRjNRaXhEUVVGNFFpeERRVUZXTzBGQlEwRXNaMEpCUVVrc1YwRkJTaXhIUVVGclFpeFBRVUZzUWpzN1FVRkZRU3h0UWtGQlR5eEhRVUZRTzBGQlEwZzdRVUUzUkV3N1FVRkJRVHRCUVVGQkxIbERRU3RFY1VJc1NVRXZSSEpDTEVWQkswUXlRaXhWUVM5RU0wSXNSVUVyUkhWRExFMUJMMFIyUXl4RlFTdEVLME03UVVGRGRrTXNiVUpCUVU4c1NVRkJTU3hWUVVGS0xFTkJRV1VzU1VGQlppeEZRVUZ4UWl4VlFVRnlRaXhGUVVGcFF5eE5RVUZxUXl4RFFVRlFPMEZCUTBnN1FVRnFSVXc3UVVGQlFUdEJRVUZCTERSQ1FWVnZRanRCUVVOYUxHMUNRVUZQTEZOQlFWQTdRVUZEU0N4VFFWcE1PMEZCUVVFc01FSkJZMnRDTEVkQlpHeENMRVZCWTNWQ08wRkJRMllzYlVKQlFVOHNVMEZCVUR0QlFVTklPMEZCYUVKTU8wRkJRVUU3UVVGQlFTdzBRa0ZyUW05Q08wRkJRMW9zYlVKQlFVOHNVMEZCVUR0QlFVTklMRk5CY0VKTU8wRkJRVUVzTUVKQmMwSnJRaXhIUVhSQ2JFSXNSVUZ6UW5WQ08wRkJRMllzYlVKQlFVOHNVMEZCVUR0QlFVTklPMEZCZUVKTU8wRkJRVUU3UVVGQlFTdzBRa0V3UWpCQ08wRkJRMnhDTEcxQ1FVRlBMRXRCUVVzc1VVRkJUQ3hEUVVGakxFTkJRV1FzUzBGQmIwSXNTVUZCTTBJN1FVRkRTRHRCUVRWQ1REczdRVUZCUVR0QlFVRkJMRVZCUVhkRExFOUJRWGhET3pzN096czdPenM3UVVOSVFTeEpRVUZOTEZWQlFWVXNVVUZCVVN4alFVRlNMRU5CUVdoQ08wRkJRMEVzU1VGQlRTeFhRVUZaTEZGQlFWRXNaVUZCVWl4RFFVRnNRanRCUVVOQkxFbEJRVTBzWlVGQlpTeFJRVUZSTEc5Q1FVRlNMRU5CUVhKQ096dEJRVVZCTEVsQlFVMHNiVUpCUVcxQ0xFTkJRM0pDTEZGQlJIRkNMRVZCUlhKQ0xFOUJSbkZDTEVOQlFYcENPenRCUVV0QkxFbEJRVTBzWlVGQlpTeHJRMEZCY2tJN1FVRkRRU3hKUVVGTkxHZENRVUZuUWl4MVEwRkJkRUk3UVVGRFFTeEpRVUZOTEZsQlFWa3NWVUZCYkVJN1FVRkRRU3hKUVVGTkxHZENRVUZuUWl4eFFrRkJkRUk3UVVGRFFTeEpRVUZOTEdOQlFXTXNiME5CUVhCQ096dEJRVVZCTEVsQlFVMHNZVUZCWVN4SlFVRkpMRTFCUVVvc1EwRkJWeXhSUVVGUkxFTkJRMnhETEZsQlJHdERMRVZCUld4RExHRkJSbXRETEVWQlIyeERMRk5CU0d0RExFVkJTV3hETEdGQlNtdERMRVZCUzJ4RExGZEJUR3RETEVWQlRYQkRMRWxCVG05RExFTkJUUzlDTEVkQlRpdENMRU5CUVZJc1IwRk5ha0lzUjBGT1RTeEZRVTFFTEVkQlRrTXNRMEZCYmtJN08wRkJVVUVzU1VGQlRTeFpRVUZaTEhGRVFVRnNRanM3UVVGRlFTeFBRVUZQTEU5QlFWQTdRVUZEU1N4elFrRkJXU3hUUVVGYUxFVkJRWEZGTzBGQlFVRXNXVUZCT1VNc1YwRkJPRU1zZFVWQlFXaERMRmRCUVdkRE8wRkJRVUVzV1VGQmJrSXNTVUZCYlVJc2RVVkJRVm9zVlVGQldUczdRVUZCUVRzN1FVRkRha1VzWVVGQlN5eFRRVUZNTEVkQlFXbENMRk5CUVdwQ08wRkJRMEVzWVVGQlN5eFhRVUZNTEVkQlFXMUNMRmRCUVc1Q08wRkJRMEVzWVVGQlN5eEpRVUZNTEVkQlFWa3NTVUZCV2p0QlFVTkJMR0ZCUVVzc1VVRkJUQ3hIUVVGblFpeExRVUZMTEd0Q1FVRk1MRVZCUVdoQ08wRkJRMEVzWVVGQlN5eFhRVUZNTEVkQlFXMUNMRVZCUVc1Q08wRkJRMEVzWVVGQlN5eGhRVUZNTEVkQlFYRkNMRU5CUVhKQ096dEJRVVZCTEdWQlFVMHNTMEZCU3l4aFFVRk1MRWRCUVhGQ0xFdEJRVXNzVTBGQlRDeERRVUZsTEUxQlFURkRMRVZCUVd0RU8wRkJRemxETEdsQ1FVRkxMR05CUVV3N1FVRkRTRHRCUVVOS096dEJRVnBNTzBGQlFVRTdRVUZCUVN3MlEwRnZRbmxDTzBGQlEycENMR2RDUVVGSkxGVkJRVlVzUlVGQlpEdEJRVU5CTEdkQ1FVRkpMRXRCUVVzc1YwRkJUQ3hKUVVGdlFpeFhRVUY0UWl4RlFVRnhRenRCUVVOcVF5d3dRa0ZCVlN4cFFrRkJWanRCUVVORUxIRkNRVUZMTEZOQlFVd3NSMEZCYVVJc1MwRkJTeXhUUVVGTUxFTkJRV1VzVDBGQlppeERRVUYxUWl4eFFrRkJka0lzUlVGQk9FTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkRja1VzT0VKQlFWVXNTMEZCVmp0QlFVTkJMREpDUVVGUExFVkJRVkE3UVVGRFNDeHBRa0ZJWlN4RFFVRnFRanRCUVVsR0xHRkJUa1FzVFVGTlR5eEpRVUZKTEV0QlFVc3NWMEZCVEN4SlFVRnZRaXhWUVVGNFFpeEZRVUZ2UXp0QlFVTjJReXd3UWtGQlZTeDFRa0ZCVmp0QlFVTkJMSEZDUVVGTExGTkJRVXdzUjBGQmFVSXNTMEZCU3l4VFFVRk1MRU5CUVdVc1QwRkJaaXhEUVVGMVFpeHZRa0ZCZGtJc1JVRkJOa01zVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZEY2tVc09FSkJRVlVzUzBGQlZqdEJRVU5CTERKQ1FVRlBMRVZCUVZBN1FVRkRTQ3hwUWtGSVowSXNRMEZCYWtJN1FVRkpTQ3hoUVU1TkxFMUJUVUU3UVVGRFNDeHpRa0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJWU3d5UWtGQlZpeERRVUZPTzBGQlEwZzdPMEZCUlVRc2FVSkJRVXNzVTBGQlRDeEhRVUZwUWl4TFFVRkxMRk5CUVV3c1EwRkJaU3hQUVVGbUxFTkJRWFZDTEUxQlFYWkNMRVZCUVN0Q0xFVkJRUzlDTEVWQlExb3NUMEZFV1N4RFFVTktMRTFCUkVrc1JVRkRTU3hGUVVSS0xFTkJRV3BDT3p0QlFVZEJMR2RDUVVGSkxFMUJRVTBzU1VGQlNTeFJRVUZLTEVOQlEwNHNTMEZCU3l4WFFVUkRMRVZCUTFrc1QwRkVXaXhEUVVGV096dEJRVWRCTEcxQ1FVRlBMRWRCUVZBN1FVRkRTRHRCUVRkRFREdEJRVUZCTzBGQlFVRXNkME5CSzBOdlFpeFZRUzlEY0VJc1JVRXJRMmRETzBGQlEzaENMR2RDUVVGSkxGVkJRVlVzUlVGQlpEdEJRVU5CTEdkQ1FVRkpMR05CUVVvN1FVRkRRU3h0UWtGQlR5eFJRVUZSTEZWQlFWVXNTVUZCVml4RFFVRmxMRlZCUVdZc1EwRkJaaXhGUVVFMFF6dEJRVU40UXl4dlFrRkJTU3hYUVVGWkxFMUJRVTBzUTBGQlRpeExRVUZaTEUxQlFVMHNRMEZCVGl4RFFVRTFRanRCUVVOQkxHOUNRVUZKTEZWQlFWVXNUVUZCVFN4RFFVRk9MRU5CUVdRN08wRkJSVUVzZDBKQlFWRXNVVUZCVWl4SlFVRnZRaXhQUVVGd1FqdEJRVU5JT3p0QlFVVkVMRzFDUVVGUExFOUJRVkE3UVVGRFNEczdRVUZGUkRzN096czdPenM3T3pzN08wRkJOVVJLTzBGQlFVRTdRVUZCUVN3NFEwRjFSVEJDTEVsQmRrVXhRaXhGUVhWRlowTXNSMEYyUldoRExFVkJkVVZ4UXp0QlFVTTNRaXhuUWtGQlJ5eExRVUZMTEZkQlFVd3NTVUZCYjBJc1YwRkJjRUlzU1VGQmJVTXNVVUZCVVN4VFFVRTVReXhGUVVGNVJEdEJRVU55UkN4M1FrRkJUeXhKUVVGUU8wRkJRMGtzZVVKQlFVc3NVMEZCVER0QlFVTkpMQ3RDUVVGUExFbEJRVWtzVjBGQlNpeEZRVUZRTzBGQlEwb3NlVUpCUVVzc1dVRkJURHRCUVVOSkxEUkNRVUZKTEZkQlFWY3NSVUZCWmp0QlFVTkJMRFpDUVVGSkxFbEJRVWtzUjBGQlVpeEpRVUZsTEVkQlFXWXNSVUZCYjBJN1FVRkRhRUlzY1VOQlFWTXNTVUZCU1N4WFFVRktMRVZCUVZRc1NVRkJPRUlzU1VGQlNTeEhRVUZLTEVOQlFUbENPMEZCUTBnN1FVRkRSQ3dyUWtGQlR5eFJRVUZRTzBGQlEwbzdRVUZEU1N3clFrRkJUeXhIUVVGUU8wRkJWbEk3UVVGWlNEczdRVUZGUkN4dFFrRkJUeXhIUVVGUU8wRkJRMGc3UVVGNFJrdzdRVUZCUVR0QlFVRkJMSGxEUVRCR2NVSTdRVUZEWWl4blFrRkJTU3haUVVGWkxFdEJRVXNzVTBGQlRDeERRVUZsTEV0QlFXWXNRMEZCY1VJc1MwRkJTeXhoUVVFeFFpeERRVUZvUWp0QlFVTkJMR2RDUVVGSkxGRkJRVkVzVjBGQlZ5eEpRVUZZTEVOQlFXZENMRk5CUVdoQ0xFTkJRVm83UVVGRFFTeG5Ra0ZCU1N4TFFVRktMRVZCUVZjN1FVRkRVQ3h2UWtGQlJ5eE5RVUZOTEV0QlFVNHNTMEZCWjBJc1EwRkJia0lzUlVGQmMwSTdRVUZEYkVJN1FVRkRRU3gzUWtGQlNTeGhRVUZoTEVsQlFVa3NTMEZCU2l4dlFrRkRTeXhWUVVGVkxFdEJRVllzUTBGQlowSXNRMEZCYUVJc1JVRkJiVUlzVFVGQlRTeExRVUY2UWl4RlFVTmlMRTlCUkdFc1EwRkRUQ3hOUVVSTExFVkJRMGNzUlVGRVNDeEZRVVZpTEU5QlJtRXNRMEZGVEN4TlFVWkxMRVZCUlVjc1JVRkdTQ3hEUVVSTUxGRkJRV3BDT3p0QlFVdEJMRFJDUVVGUExFdEJRVXNzU1VGQldqdEJRVU5KTERaQ1FVRkxMRkZCUVV3N1FVRkRTU3hyUTBGQlRTeFZRVUZPTzBGQlEwb3NOa0pCUVVzc1ZVRkJURHRCUVVOSkxHOURRVUZSTEVsQlFWSXNRMEZCWVN4VlFVRmlPMEZCUTBFN1FVRk1VanRCUVU5SU96dEJRVVZFTEhGQ1FVRkxMR0ZCUVV3c1NVRkJjMElzVFVGQlRTeExRVUZPTEVkQlFXTXNUVUZCVFN4RFFVRk9MRVZCUVZNc1RVRkJOME03TzBGQlJVRXNiMEpCUVVrc1ZVRkJWU3hMUVVGTExIRkNRVUZNTEVOQlFUSkNMRk5CUVROQ0xFVkJRWE5ETEUxQlFVMHNRMEZCVGl4RFFVRjBReXhEUVVGa08wRkJRMEVzYjBKQlFVa3NZVUZCWVN4TFFVRkxMSEZDUVVGTUxFTkJRVEpDTEZsQlFUTkNMRVZCUTJJc1MwRkJTeXhsUVVGTUxFTkJRWEZDTEUxQlFVMHNRMEZCVGl4RFFVRnlRaXhEUVVSaExFTkJRV3BDTzBGQlJVRXNiMEpCUVVrc1owSkJRV2RDTEZGQlFWRXNUVUZCVFN4RFFVRk9MRU5CUVZJc1EwRkJjRUk3UVVGRFFTeHZRa0ZCU1N4bFFVRmxMRXRCUVVzc2NVSkJRVXdzUTBGQk1rSXNVMEZCTTBJc1JVRkJjME1zVFVGQlRTeERRVUZPTEVOQlFYUkRMRU5CUVc1Q08wRkJRMEVzYjBKQlFVa3NUMEZCVHl4TlFVRk5MRU5CUVU0c1EwRkJXRHRCUVVOQkxHOUNRVUZKTEZWQlFWVXNUVUZCVFN4RFFVRk9MRU5CUVdRN1FVRkRRU3h2UWtGQlNTeFJRVUZSTEUxQlFVMHNRMEZCVGl4RFFVRmFPenRCUVVWQkxHOUNRVUZKTEZsQlFWa3NTMEZCU3l4WFFVRk1MRU5CUVdsQ0xFdEJRVXNzVjBGQlRDeERRVUZwUWl4TlFVRnFRaXhIUVVFd1FpeERRVUV6UXl4TFFVTmFMRXRCUVVzc1VVRkVWRHM3UVVGSFFTeHZRa0ZCU1N4SlFVRktMRVZCUVZVN1FVRkRUanRCUVVOQkxIZENRVUZKTEUxQlFVMHNTVUZCU1N4UFFVRktMRU5CUVZrc1QwRkJXaXhGUVVGeFFpeERRVUZ5UWl4RFFVRldPMEZCUTBFc2QwSkJRVWtzVjBGQlNpeEhRVUZyUWl4SlFVRnNRanM3UVVGRlFTdzRRa0ZCVlN4WFFVRldMRU5CUTBrc1IwRkVTanRCUVVkSUxHbENRVkpFTEUxQlVVOHNTVUZCU1N4UFFVRktMRVZCUVdFN1FVRkRhRUk3UVVGRFFTeDNRa0ZCU1N4UFFVRk5MRWxCUVVrc1QwRkJTaXhEUVVGWkxFOUJRVm9zUlVGQmNVSXNRMEZCY2tJc1JVRkJkMElzVlVGQmVFSXNRMEZCVmpzN1FVRkZRU3gzUWtGQlJ5eHBRa0ZCYVVJc1QwRkJha0lzUTBGQmVVSXNVVUZCVVN4WFFVRlNMRVZCUVhwQ0xFdEJRVzFFTEVOQlFVTXNRMEZCZGtRc1JVRkJNRVE3UVVGRGRFUXNORUpCUVVrc1kwRkJZeXhKUVVGSkxFMUJRVW9zYzBKQlFUaENMRTlCUVRsQ0xFOUJRV3hDTzBGQlEwRXNORUpCUVVrc1lVRkJXU3hMUVVGTExGTkJRVXdzUTBGQlpTeExRVUZtTEVOQlFYRkNMRXRCUVVzc1lVRkJNVUlzUTBGQmFFSTdRVUZEUVN3MFFrRkJTU3hUUVVGUkxGbEJRVmtzU1VGQldpeERRVUZwUWl4VlFVRnFRaXhEUVVGYU8wRkJRMEVzTkVKQlFVY3NUVUZCU0N4RlFVRlZPMEZCUTA0c2FVTkJRVWtzVjBGQlNpeEhRVUZyUWl4UFFVRk5MRU5CUVU0c1EwRkJiRUk3UVVGRFFTeHBRMEZCU3l4aFFVRk1MRWxCUVhOQ0xFOUJRVTBzUzBGQlRpeEhRVUZqTEU5QlFVMHNRMEZCVGl4RlFVRlRMRTFCUVRkRE8wRkJRMGc3UVVGRFNqczdRVUZGUkN3NFFrRkJWU3hYUVVGV0xFTkJRMGtzU1VGRVNqczdRVUZKUVN4M1FrRkJSeXhEUVVGRExHRkJRVVFzU1VGRFF5eGhRVUZoTEU5QlFXSXNRMEZCY1VJc1VVRkJVU3hYUVVGU0xFVkJRWEpDTEV0QlFTdERMRU5CUVVNc1EwRkVha1FzU1VGRlF5eHBRa0ZCYVVJc1QwRkJha0lzUTBGQmVVSXNVVUZCVVN4WFFVRlNMRVZCUVhwQ0xFdEJRVzFFTEVOQlFVTXNRMEZHZUVRc1JVRkZNa1E3TzBGQlJYWkVMRFpDUVVGTExGZEJRVXdzUTBGQmFVSXNTVUZCYWtJc1EwRkJjMElzU1VGQmRFSTdRVUZEU0R0QlFVVktMR2xDUVhwQ1RTeE5RWGxDUVN4SlFVRkpMRmxCUVVvc1JVRkJhMEk3UVVGRGNrSTdRVUZEUVR0QlFVTkJMSGRDUVVGSkxGVkJRVlVzUzBGQlN5eFhRVUZNTEVOQlFXbENMRWRCUVdwQ0xFVkJRV1E3UVVGRFFTeDNRa0ZCUnl4TFFVRkxMRWxCUVV3c1MwRkJZeXhSUVVGcVFpeEZRVUV5UWpzN1FVRkZNMElzZDBKQlFVY3NRMEZCUXl4UFFVRktMRVZCUVdFN1FVRkRWQ3c0UWtGQlRTeEpRVUZKTEV0QlFVb3NUMEZCWlN4WlFVRm1MRzFEUVVGT08wRkJRMGc3TzBGQlJVUXNkMEpCUVVjc1owSkJRV2RDTEZGQlFWRXNUMEZCTTBJc1JVRkJiME03UVVGRGFFTXNPRUpCUVUwc1NVRkJTU3hMUVVGS0xFOUJRV1VzVVVGQlVTeFBRVUYyUWl3clFrRkJUanRCUVVOSU8wRkJRMG9zYVVKQllrMHNUVUZoUVN4SlFVRkpMRmxCUVZrc1UwRkJhRUlzUlVGQk1rSTdRVUZET1VJc2QwSkJRVWtzVVVGQlRTeEpRVUZKTEU5QlFVb3NRMEZCV1N4VlFVRmFMRVZCUVhkQ0xFTkJRWGhDTEVOQlFWWTdRVUZEUVN3d1FrRkJTU3hYUVVGS0xFZEJRV3RDTEU5QlFXeENPenRCUVVWQkxEaENRVUZWTEZkQlFWWXNRMEZCYzBJc1MwRkJkRUk3UVVGRFNDeHBRa0ZNVFN4TlFVdEJMRWxCUVVrc1ZVRkJWU3hUUVVGa0xFVkJRWGxDTzBGQlF6VkNMSGRDUVVGSkxGRkJRVTBzU1VGQlNTeFBRVUZLTEVOQlFWa3NaVUZCV2l4RlFVRTJRaXhEUVVFM1FpeERRVUZXTzBGQlEwRXNNRUpCUVVrc1YwRkJTaXhIUVVGclFpeExRVUZzUWp0QlFVTkJMRGhDUVVGVkxGZEJRVllzUTBGQmMwSXNTMEZCZEVJN1FVRkRTRHRCUVVOS0xHRkJka1pFTEUxQmRVWlBPMEZCUTBnc2IwSkJRVWtzWlVGQlpTeExRVUZMTEdGQlFVd3NSMEZCY1VJc1JVRkJlRU03UVVGRFFTeHZRa0ZCU1N4aFFVRmhMRXRCUVVzc1lVRkJUQ3hIUVVGeFFpeEZRVUYwUXp0QlFVTkJMSE5DUVVGTkxFbEJRVWtzUzBGQlNpeDFRMEZEUml4TFFVRkxMRk5CUVV3c1EwRkJaU3hMUVVGbUxFTkJRWEZDTEdWQlFXVXNRMEZCWml4SFFVRnJRaXhaUVVGc1FpeEhRVUZuUXl4RFFVRnlSQ3hGUVVGM1JDeGpRVUZqTEV0QlFVc3NVMEZCVEN4RFFVRmxMRTFCUVRkQ0xFZEJRWEZETEZWQlFYSkRMRWRCUVdsRUxFdEJRVXNzVTBGQlRDeERRVUZsTEUxQlFXWXNSMEZCZDBJc1EwRkJha2tzUTBGRVJTeFBRVUZPTzBGQlIwZzdRVUZEU2p0QlFUTk1URHRCUVVGQk8wRkJRVUVzT0VKQlkybENMRTFCWkdwQ0xFVkJZM1ZGTzBGQlFVRXNaMEpCUVRsRExGZEJRVGhETEhWRlFVRm9ReXhYUVVGblF6dEJRVUZCTEdkQ1FVRnVRaXhKUVVGdFFpeDFSVUZCV2l4VlFVRlpPenRCUVVNdlJDeG5Ra0ZCU1N4WFFVRlhMRWxCUVVrc1NVRkJTaXhEUVVGVExFMUJRVlFzUlVGQmFVSXNWMEZCYWtJc1JVRkJPRUlzU1VGQk9VSXNRMEZCWmpzN1FVRkZRU3h0UWtGQlR5eFRRVUZUTEZGQlFXaENPMEZCUTBnN1FVRnNRa3c3TzBGQlFVRTdRVUZCUVRzN096czdPenM3T3pzN096czdPMEZEZWtKQkxFbEJRVTBzV1VGQldTeFJRVUZSTEdsQ1FVRlNMRU5CUVd4Q08wRkJRMEVzU1VGQlRTeHJRa0ZCYTBJc1VVRkJVU3gxUWtGQlVpeERRVUY0UWp0QlFVTkJMRWxCUVUwc1pVRkJaU3hSUVVGUkxHOUNRVUZTTEVOQlFYSkNPenRCUVVWQkxFbEJRVTBzVjBGQlZ5eFRRVUZZTEZGQlFWY3NSMEZCVFR0QlFVTnVRanRCUVVOQk8wRkJRMEVzVjBGQlR5eFJRVUZSTEdGQlFWSXNRMEZCVUR0QlFVTklMRU5CU2tRN08wRkJUVUVzU1VGQlRTeGxRVUZsTEZOQlFXWXNXVUZCWlN4SFFVRk5PMEZCUTNaQ0xGZEJRVThzVVVGQlVTeGxRVUZTTEVOQlFWQTdRVUZEU0N4RFFVWkVPenRCUVVsQkxFOUJRVThzVDBGQlVEdEJRVUZCT3p0QlFVTkpPenM3T3p0QlFVdEJMSEZDUVVGWkxFbEJRVm9zUlVGQk5rTTdRVUZCUVN4WlFVRXpRaXhKUVVFeVFpeDFSVUZCY0VJc1EwRkJiMEk3UVVGQlFTeFpRVUZxUWl4VlFVRnBRaXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVGQk96dEJRVWQ2UXl4alFVRkxMRkZCUVV3c1IwRkJaMElzVVVGQlVTeERRVUY0UWpzN1FVRkZRU3hqUVVGTExGRkJRVXdzUjBGRFNTeE5RVUZMTEU5QlFVd3NSMEZCWlN4SlFVUnVRanM3UVVGSFFTeGpRVUZMTEZWQlFVd3NSMEZCYTBJc1ZVRkJiRUk3UVVGRFFTeGpRVUZMTEZWQlFVd3NSMEZCYTBJc1JVRkJiRUk3UVVGRFFTeGpRVUZMTEZWQlFVd3NSMEZCYTBJc1NVRkJiRUk3UVVGRFFTeGpRVUZMTEZOQlFVd3NSMEZCYVVJc1NVRkJTU3hUUVVGS0xFVkJRV3BDT3p0QlFVVkJMR05CUVVzc2JVSkJRVXc3UVVGRFFTeGpRVUZMTEZOQlFVd3NRMEZCWlN4UlFVRm1MRWRCUVRCQ0xFMUJRVXNzYVVKQlFVd3NRMEZCZFVJc1NVRkJka0lzVDBGQk1VSTdRVUZrZVVNN1FVRmxOVU03TzBGQmNrSk1PMEZCUVVFN1FVRkJRU3c0UTBGMVFqQkNPMEZCUVVFN08wRkJRMnhDTEdsQ1FVRkxMRk5CUVV3c1EwRkJaU3hOUVVGbUxFTkJRWE5DTEVOQlFYUkNPenRCUVVWQkxHZENRVUZITEZGQlFWRXNTMEZCU3l4VlFVRk1MRU5CUVdkQ0xFdEJRWGhDTEVOQlFVZ3NSVUZCYlVNN1FVRkRMMElzYjBKQlFVa3NZVUZCWVN4TFFVRkxMRlZCUVV3c1EwRkJaMElzUzBGQmFFSXNRMEZCYzBJc1MwRkJkRUlzUTBGQk5FSXNTVUZCTlVJc1EwRkJha0k3TzBGQlJVRXNNa0pCUVZjc1QwRkJXQ3hEUVVGdFFpeFZRVUZETEZGQlFVUXNSVUZCWXp0QlFVTTNRaXd5UWtGQlN5eFRRVUZNTEVOQlFXVXNSMEZCWml4RFFVRnRRaXhSUVVGdVFqdEJRVU5JTEdsQ1FVWkVPMEZCUjBnN1FVRkRTanRCUVdwRFREdEJRVUZCTzBGQlFVRXNNRU5CYlVOelFpeFRRVzVEZEVJc1JVRnRRMmxETzBGQlEzcENMR2xDUVVGTExGVkJRVXdzUTBGQlowSXNTMEZCYUVJc1IwRkJkMElzVlVGQlZTeEpRVUZXTEVOQlFXVXNSMEZCWml4RFFVRjRRanRCUVVOSU8wRkJja05NTzBGQlFVRTdRVUZCUVN4eFEwRXlUV2xDTEVsQk0wMXFRaXhGUVRKTmRVSTdRVUZEWml4dFFrRkJUeXhMUVVGTExGVkJRVXdzUTBGQlowSXNTVUZCYUVJc1EwRkJVRHRCUVVOSU8wRkJOMDFNTzBGQlFVRTdRVUZCUVN4M1EwRXJUVzlDTEVsQkwwMXdRaXhGUVN0Tk1FSTdRVUZEYkVJc2JVSkJRVThzUzBGQlN5eFZRVUZNTEVOQlFXZENMRWxCUVdoQ0xFTkJRVkE3TzBGQlJVRXNaMEpCUVVjc1VVRkJVU3hQUVVGWUxFVkJRVzlDTzBGQlEyaENMSEZDUVVGTExHMUNRVUZNTzBGQlEwZzdRVUZEU2p0QlFYSk9URHRCUVVGQk8wRkJRVUVzY1VOQmRVNXBRaXhKUVhaT2FrSXNSVUYxVG5WQ0xFdEJkazUyUWl4RlFYVk9PRUk3UVVGRGRFSXNhVUpCUVVzc1ZVRkJUQ3hEUVVGblFpeEpRVUZvUWl4SlFVRjNRaXhMUVVGNFFqczdRVUZGUVN4blFrRkJSeXhSUVVGUkxFOUJRVmdzUlVGQmIwSXNTMEZCU3l4dFFrRkJURHRCUVVOMlFqdEJRVE5PVER0QlFVRkJPMEZCUVVFc2NVTkJOazVwUWl4SlFUZE9ha0lzUlVFMlRuVkNPMEZCUTJZc2JVSkJRVThzVVVGQlVTeExRVUZMTEZWQlFYQkNPMEZCUTBnN1FVRXZUa3c3UVVGQlFUdEJRVUZCTEhWRFFXbFBiVUlzVDBGcVQyNUNMRVZCYVU4MFFqdEJRVUZCT3p0QlFVTndRaXhuUWtGQlNTeFpRVUZaTEVWQlFXaENPMEZCUTBFc2IwSkJRVkVzVlVGQlVpeERRVUZ0UWl4UFFVRnVRaXhEUVVFeVFpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTnFReXh2UWtGQlJ5eExRVUZMTEZGQlFVd3NTVUZCYVVJc1EwRkJjRUlzUlVGQmRVSTdRVUZEYmtJc09FSkJRVlVzU1VGQlZpeERRVUZsTEVsQlFXWTdRVUZEU0N4cFFrRkdSQ3hOUVVWUE8wRkJRMGdzWjBOQlFWa3NWVUZCVlN4TlFVRldMRU5CUVdsQ0xFOUJRVXNzWTBGQlRDeERRVUZ2UWl4SlFVRndRaXhEUVVGcVFpeERRVUZhTzBGQlEwZzdRVUZEU2l4aFFVNUVPenRCUVZGQkxHMUNRVUZQTEZOQlFWQTdRVUZEU0R0QlFUVlBURHRCUVVGQk8wRkJRVUVzYjBOQk9FOW5RaXhQUVRsUGFFSXNSVUU0VDNsQ0xHVkJPVTk2UWl4RlFUaFBkMFU3UVVGQlFTeG5Ra0ZCT1VJc1IwRkJPRUlzZFVWQlFYaENMRXRCUVhkQ08wRkJRVUVzWjBKQlFXcENMRTlCUVdsQ0xIVkZRVUZRTEV0QlFVODdPMEZCUTJoRkxHZENRVUZKTEdGQlFXRXNSVUZCYWtJN1FVRkRRU3huUWtGQlNTeFRRVUZUTEZGQlFWRXNVVUZCVWl4RFFVRnBRaXhOUVVFNVFqdEJRVU5CTEdsQ1FVRkpMRWxCUVVrc1NVRkJTU3hEUVVGYUxFVkJRV1VzU1VGQlNTeE5RVUZ1UWl4RlFVRXlRaXhIUVVFelFpeEZRVUZuUXp0QlFVTTFRaXh2UWtGQlNTeFBRVUZQTEZGQlFWRXNVVUZCVWl4RFFVRnBRaXhEUVVGcVFpeERRVUZZT3p0QlFVVkJMRzlDUVVGSExHZENRVUZuUWl4SlFVRm9RaXhEUVVGSUxFVkJRVEJDTzBGQlEzUkNMQ3RDUVVGWExFbEJRVmdzUTBGQlowSXNTVUZCYUVJN08wRkJSVUVzZDBKQlFVY3NSMEZCU0N4RlFVRlJPMEZCUTFnN08wRkJSVVFzYjBKQlFVY3NRMEZCUXl4UFFVRkVMRWxCUVZrc1MwRkJTeXhSUVVGTUxFTkJRV01zVFVGQlpDeEhRVUYxUWl4RFFVRjBReXhGUVVGNVF6dEJRVU55UXl4cFEwRkJZU3hYUVVGWExFMUJRVmdzUTBGQmEwSXNTMEZCU3l4WFFVRk1MRU5CUVdsQ0xFbEJRV3BDTEVWQlFYVkNMR1ZCUVhaQ0xFVkJRWGRETEVkQlFYaERMRU5CUVd4Q0xFTkJRV0k3TzBGQlJVRXNkMEpCUVVjc1QwRkJUeXhYUVVGWExFMUJRVmdzUjBGQmIwSXNRMEZCT1VJc1JVRkJhVU03UVVGRGNFTTdRVUZEU2pzN1FVRkZSQ3h0UWtGQlR5eFZRVUZRTzBGQlEwZzdRVUZzVVV3N1FVRkJRVHRCUVVGQkxIVkRRVzlSYlVJc1JVRndVVzVDTEVWQmIxRjFRanRCUVVObUxHZENRVUZKTEU5QlFVOHNTVUZCV0R0QlFVTkJMR2RDUVVGSkxHRkJRV0VzUzBGQlN5eFhRVUZNTEVOQlFXbENMRWxCUVdwQ0xFVkJRWFZDTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUXpsRExIVkNRVUZQTEV0QlFVc3NWVUZCVEN4RFFVRm5RaXhGUVVGb1FpeEpRVUZ6UWl4RlFVRTNRanRCUVVOSUxHRkJSbWRDTEVWQlJXUXNTVUZHWXl4RFFVRnFRanM3UVVGSlFTeG5Ra0ZCUnl4WFFVRlhMRTFCUVZnc1IwRkJiMElzUTBGQmRrSXNSVUZCTUVJN1FVRkRkRUlzZFVKQlFVOHNWMEZCVnl4RFFVRllMRU5CUVZBN1FVRkRTRHM3UVVGRlJDeHRRa0ZCVHl4SlFVRlFPMEZCUTBnN1FVRXZVVXc3UVVGQlFUdEJRVUZCTEN0RFFXbFNNa0lzVTBGcVVqTkNMRVZCYVZKelF6dEJRVU01UWl4blFrRkJTU3hSUVVGUkxFdEJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhGUVVGMVFpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTjZReXgxUWtGQlR5eExRVUZMTEZsQlFVd3NRMEZCYTBJc1QwRkJiRUlzUzBGQk9FSXNTMEZCU3l4VFFVRk1MRU5CUVdVc1VVRkJaaXhEUVVGM1FpeFRRVUY0UWl4RFFVRnlRenRCUVVOSUxHRkJSbGNzUTBGQldqczdRVUZKUVN4dFFrRkJUeXhMUVVGUU8wRkJRMGc3UVVGMlVrdzdRVUZCUVR0QlFVRkJMRFpEUVhsU2VVSXNUMEY2VW5wQ0xFVkJlVkpyUXp0QlFVTXhRaXhuUWtGQlNTeFJRVUZSTEV0QlFVc3NWMEZCVEN4RFFVRnBRaXhKUVVGcVFpeEZRVUYxUWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVONlF5eDFRa0ZCVHl4TFFVRkxMRTlCUVV3c1NVRkJaMElzVDBGQmRrSTdRVUZEU0N4aFFVWlhMRU5CUVZvN08wRkJTVUVzYlVKQlFVOHNTMEZCVUR0QlFVTklPMEZCTDFKTU8wRkJRVUU3UVVGQlFTd3JRMEZwVXpKQ0xFbEJhbE16UWl4RlFXbFRhVU03UVVGRGVrSTdRVUZEUVR0QlFVTkJMR2RDUVVGSExFdEJRVXNzVlVGQlVpeEZRVUZ2UWp0QlFVTm9RaXh4UWtGQlN5eFZRVUZNTEVOQlFXZENMRmRCUVdoQ0xFTkJRVFJDTEVsQlFUVkNPMEZCUTBnN1FVRkRTanM3UVVGRlJEczdPenM3UVVGNlUwbzdRVUZCUVR0QlFVRkJMRzlEUVRaVFowSXNVMEUzVTJoQ0xFVkJObE15UWp0QlFVTnVRaXhwUWtGQlN5eHpRa0ZCVEN4RFFVRTBRaXhUUVVFMVFqdEJRVU5CTEdsQ1FVRkxMRlZCUVV3c1EwRkJaMElzU1VGQmFFSXNRMEZCY1VJc1UwRkJja0k3UVVGRFFTeHpRa0ZCVlN4VlFVRldMRWRCUVhWQ0xFbEJRWFpDT3p0QlFVVkJMRzFDUVVGUExGTkJRVkE3UVVGRFNEdEJRVzVVVER0QlFVRkJPMEZCUVVFc2NVTkJjVlJwUWl4UFFYSlVha0lzUlVGeFZEQkNMR0ZCY2xReFFpeEZRWEZVZVVNN1FVRkRha01zYVVKQlFVc3NjMEpCUVV3c1EwRkJORUlzVDBGQk5VSTdRVUZEUVN4cFFrRkJTeXhWUVVGTUxFTkJRV2RDTEUxQlFXaENMRU5CUTBrc1MwRkJTeXhWUVVGTUxFTkJRV2RDTEU5QlFXaENMRU5CUVhkQ0xHRkJRWGhDTEVOQlJFb3NSVUZGU1N4RFFVWktMRVZCUlU4c1QwRkdVRHM3UVVGSlFTeHZRa0ZCVVN4VlFVRlNMRWRCUVhGQ0xFbEJRWEpDT3p0QlFVVkJMRzFDUVVGUExFOUJRVkE3UVVGRFNEdEJRVGxVVER0QlFVRkJPMEZCUVVFc2IwTkJaMVZuUWl4UFFXaFZhRUlzUlVGblZYbENMR0ZCYUZWNlFpeEZRV2RWZDBNN1FVRkRhRU1zYVVKQlFVc3NjMEpCUVV3c1EwRkJORUlzVDBGQk5VSTdRVUZEUVN4cFFrRkJTeXhWUVVGTUxFTkJRV2RDTEUxQlFXaENMRU5CUTBrc1MwRkJTeXhWUVVGTUxFTkJRV2RDTEU5QlFXaENMRU5CUVhkQ0xHRkJRWGhDTEVsQlFYbERMRU5CUkRkRExFVkJSVWtzUTBGR1NpeEZRVVZQTEU5QlJsQTdPMEZCU1VFc2IwSkJRVkVzVlVGQlVpeEhRVUZ4UWl4SlFVRnlRanM3UVVGRlFTeHRRa0ZCVHl4UFFVRlFPMEZCUTBnN1FVRjZWVXc3UVVGQlFUdEJRVUZCTEc5RFFUSlZaMElzVTBFelZXaENMRVZCTWxVeVFqdEJRVU51UWl4blFrRkJSeXhMUVVGTExGVkJRVXdzUTBGQlowSXNUMEZCYUVJc1EwRkJkMElzVTBGQmVFSXNUVUZCZFVNc1EwRkJReXhEUVVFelF5eEZRVUU0UXp0QlFVTXhReXh4UWtGQlN5eFZRVUZNTEVOQlFXZENMRTFCUVdoQ0xFTkJRMGtzUzBGQlN5eFZRVUZNTEVOQlFXZENMRTlCUVdoQ0xFTkJRWGRDTEZOQlFYaENMRU5CUkVvc1JVRkRkME1zUTBGRWVFTTdPMEZCUjBFc01FSkJRVlVzVlVGQlZpeEhRVUYxUWl4SlFVRjJRanRCUVVOSUxHRkJURVFzVFVGTFR6dEJRVU5JTEhOQ1FVRk5MRTFCUVUwc2EwTkJRVTRzUTBGQlRqdEJRVU5JT3p0QlFVVkVMRzFDUVVGUExGTkJRVkE3UVVGRFNEdEJRWFJXVER0QlFVRkJPMEZCUVVFc05FSkJkVU4zUWp0QlFVTm9RaXh0UWtGQlR5eExRVUZMTEZWQlFWbzdRVUZEU0R0QlFYcERURHRCUVVGQk8wRkJRVUVzTkVKQk1rTjNRanRCUVVOb1FpeG5Ra0ZCU1N4UFFVRlBMRWxCUVZnN08wRkJSVUVzWlVGQlJ6dEJRVU5ETEc5Q1FVRkhMR2RDUVVGblFpeGpRVUZ1UWl4RlFVRnRRenRCUVVNdlFpd3lRa0ZCVHl4SlFVRlFPMEZCUTBnN1FVRkRTaXhoUVVwRUxGRkJTVk1zVDBGQlR5eExRVUZMTEZWQlNuSkNPenRCUVUxQkxHMUNRVUZQTEVsQlFWQTdRVUZEU0R0QlFYSkVURHRCUVVGQk8wRkJRVUVzTkVKQmRVUnRRanRCUVVOWUxHMUNRVUZQTEV0QlFVc3NWVUZCVEN4RFFVRm5RaXhOUVVGb1FpeERRVUYxUWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVOd1F5eDFRa0ZCVHl4TFFVRkxMRkZCUVV3c1MwRkJhMElzUTBGQmVrSTdRVUZEU0N4aFFVWk5MRU5CUVZBN1FVRkhTRHRCUVRORVREdEJRVUZCTzBGQlFVRXNORUpCTmtSdlFqdEJRVU5hTEdkQ1FVRkpMRTlCUVU4c1JVRkJXRHRCUVVOQkxHZENRVUZKTEV0QlFVc3NVVUZCVEN4SlFVRnBRaXhEUVVGeVFpeEZRVUYzUWp0QlFVTndRaXgzUWtGQlVTeExRVUZMTEZkQlFXSTdRVUZEU0N4aFFVWkVMRTFCUlU4c1NVRkJSeXhMUVVGTExGRkJRVXdzU1VGQmFVSXNRMEZCY0VJc1JVRkJkVUk3UVVGRE1VSXNhVU5CUVdVc1MwRkJTeXhYUVVGd1FqdEJRVU5JTEdGQlJrMHNUVUZGUVN4SlFVRkhMRXRCUVVzc1VVRkJUQ3hKUVVGcFFpeERRVUZ3UWl4RlFVRjFRanRCUVVNeFFpeHpRMEZCYjBJc1MwRkJTeXhYUVVGNlFqdEJRVU5JTEdGQlJrMHNUVUZGUVR0QlFVTklMRGhDUVVGWkxFdEJRVXNzVDBGQmFrSTdRVUZEUVN4eFFrRkJTU3hKUVVGSkxFZEJRVklzU1VGQlpTeExRVUZMTEZWQlFYQkNMRVZCUVdkRE8wRkJRelZDTEhkQ1FVRkhMRXRCUVVzc1ZVRkJUQ3hEUVVGblFpeGpRVUZvUWl4RFFVRXJRaXhIUVVFdlFpeERRVUZJTEVWQlFYZERPMEZCUTNCRExHZERRVUZSTEVkQlFWSTdPMEZCUlVFc05FSkJRVWNzUzBGQlN5eFZRVUZNTEVOQlFXZENMRWRCUVdoQ0xFTkJRVWdzUlVGQmVVSTdRVUZEY2tJc01rTkJRV0VzUzBGQlN5eFZRVUZNTEVOQlFXZENMRWRCUVdoQ0xFTkJRV0k3UVVGRFNEczdRVUZGUkN4blEwRkJVU3hIUVVGU08wRkJRMGc3UVVGRFNqczdRVUZGUkN4MVFrRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUZpTEVWQlFYRkNMRVZCUVhKQ0xFTkJRVkE3UVVGRFFTeHZRa0ZCUnl4aFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQlN5eFBRVUV4UWl4TFFVRnpReXhEUVVGRExFTkJRVEZETEVWQlFUWkRPMEZCUTNwRExHdERRVUZaTEV0QlFVc3NVMEZCYWtJc1ZVRkJLMElzUzBGQlN5eFBRVUZ3UXp0QlFVTklMR2xDUVVaRUxFMUJSVTg3UVVGRFNDdzBRa0ZCVVN4TFFVRlNPMEZCUTBnN1FVRkRTanM3UVVGRlJDeHRRa0ZCVHl4SlFVRlFPMEZCUTBnc1UwRTFSa3c3UVVGQlFTd3dRa0U0Um10Q0xFZEJPVVpzUWl4RlFUaEdkVUk3UVVGQlFUczdRVUZEWml4blFrRkJSeXhMUVVGTExGVkJRVklzUlVGQmIwSTdRVUZCUVRzN1FVRkRhRUlzYjBKQlFVa3NUVUZCVFN4WFFVRlhMRXRCUVZnc1dVRkJNRUlzUjBGQk1VSXNZVUZCVmp0QlFVTkJMRzlDUVVGSkxGRkJRVkVzU1VGQlNTeGxRVUZLTEVOQlFXOUNMRlZCUVdoRE8wRkJRMEVzT0VOQlFVc3NWVUZCVEN4RFFVRm5RaXhWUVVGb1FpeEZRVUV5UWl4TlFVRXpRaXdyUWtGRFNTeExRVUZMTEZWQlFVd3NRMEZCWjBJc1ZVRkJhRUlzUTBGQk1rSXNUMEZCTTBJc1EwRkJiVU1zU1VGQmJrTXNRMEZFU2l4RlFVTTRReXhEUVVRNVF5dzBRa0ZEYjBRc1MwRkVjRVE3TzBGQlIwRXNjMEpCUVUwc1QwRkJUaXhEUVVGakxGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlEzQkNMREJDUVVGTkxGVkJRVTRzUjBGQmJVSXNUMEZCU3l4VlFVRjRRanRCUVVOSUxHbENRVVpFTzBGQlIwZzdRVUZEU2p0QlFYcEhURHRCUVVGQk8wRkJRVUVzTUVKQk1rZHZRaXhIUVROSGNFSXNSVUV5UjNsQ08wRkJRMnBDTEdkQ1FVRkhMRXRCUVVzc1VVRkJUQ3hKUVVGcFFpeERRVUZxUWl4SlFVRnpRaXhMUVVGTExGRkJRVXdzU1VGQmFVSXNRMEZCZGtNc1NVRkJORU1zUzBGQlN5eFJRVUZNTEVsQlFXbENMRU5CUVdoRkxFVkJRVzFGTzBGQlF5OUVMSEZDUVVGTExGbEJRVXdzUjBGQmIwSXNSMEZCY0VJN1FVRkRTQ3hoUVVaRUxFMUJSVTg3UVVGRFNDeHZRa0ZCU1N4TlFVRk5MRWxCUVVrc1QwRkJTaXhEUVVGWkxFOUJRVm9zUlVGQmNVSXNRMEZCY2tJc1EwRkJWanRCUVVOQkxHOUNRVUZKTEZkQlFVb3NSMEZCYTBJc1IwRkJiRUk3UVVGRFFTeHhRa0ZCU3l4VlFVRk1MRWRCUVd0Q0xFTkJRVU1zUjBGQlJDeERRVUZzUWp0QlFVTklPMEZCUTBvc1UwRnVTRXc3UVVGQlFTdzBRa0Z4U0hOQ08wRkJRMlFzWjBKQlFVY3NTMEZCU3l4UlFVRk1MRWxCUVdsQ0xFTkJRV3BDTEVsQlFYTkNMRXRCUVVzc1VVRkJUQ3hKUVVGcFFpeERRVUYyUXl4SlFVRTBReXhMUVVGTExGRkJRVXdzU1VGQmFVSXNRMEZCYUVVc1JVRkJiVVU3UVVGREwwUXNkVUpCUVU4c1MwRkJTeXhaUVVGTUxFbEJRWEZDTEVWQlFUVkNPMEZCUTBnc1lVRkdSQ3hOUVVWUE8wRkJRMGdzYjBKQlFVa3NUMEZCVHl4RlFVRllPMEZCUTBFc2NVSkJRVXNzWTBGQlRDeERRVUZ2UWl4SlFVRndRaXhGUVVFd1FpeFBRVUV4UWl4RFFVRnJReXhWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU40UXl3MFFrRkJVU3hMUVVGTExGZEJRV0k3UVVGRFNDeHBRa0ZHUkRzN1FVRkpRU3gxUWtGQlR5eEpRVUZRTzBGQlEwZzdRVUZGU2p0QlFXcEpURHRCUVVGQk8wRkJRVUVzTkVKQmJVbHZRanRCUVVOYUxHZENRVUZKTEZsQlFWa3NSVUZCYUVJN1FVRkRRU3hwUWtGQlN5eFZRVUZNTEVOQlFXZENMRTlCUVdoQ0xFTkJRWGRDTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUXpsQ0xEWkNRVUZoTEV0QlFVc3NVMEZCYkVJN1FVRkRTQ3hoUVVaRU96dEJRVWxCTEcxQ1FVRlBMRk5CUVZBN1FVRkRTQ3hUUVRGSlREdEJRVUZCTERCQ1FUUkphMElzUjBFMVNXeENMRVZCTkVsMVFqdEJRVUZCT3p0QlFVTm1MR2RDUVVGSkxFMUJRVTBzVjBGQlZ5eExRVUZZTEZsQlFUQkNMRWRCUVRGQ0xHRkJRVlk3UVVGRFFTeHBRa0ZCU3l4VlFVRk1MRWRCUVd0Q0xFVkJRV3hDT3p0QlFVVkJMR2RDUVVGSkxHVkJRVW9zUTBGQmIwSXNWVUZCY0VJc1EwRkJLMElzVDBGQkwwSXNRMEZCZFVNc1ZVRkJReXhKUVVGRUxFVkJRVlU3UVVGRE4wTXNkVUpCUVVzc1YwRkJUQ3hEUVVGcFFpeEpRVUZxUWp0QlFVTklMR0ZCUmtRN1FVRkhTRHRCUVc1S1REdEJRVUZCTzBGQlFVRXNORUpCY1VwcFF6dEJRVU42UWl4blFrRkJTU3hUUVVGVExFdEJRVXNzWVVGQmJFSTdRVUZEUVN4blFrRkJSeXhOUVVGSUxFVkJRVmM3UVVGRFVDeDFRa0ZCVHl4UFFVRlBMRkZCUVZBc1EwRkJaMElzVDBGQlR5eFJRVUZRTEVOQlFXZENMRTlCUVdoQ0xFTkJRWGRDTEVsQlFYaENMRWxCUVdkRExFTkJRV2hFTEV0QlFYTkVMRWxCUVRkRU8wRkJRMGc3TzBGQlJVUXNiVUpCUVU4c1NVRkJVRHRCUVVOSU8wRkJOVXBNTzBGQlFVRTdRVUZCUVN3MFFrRTRTakJDTzBGQlEyeENMR2RDUVVGSkxGTkJRVk1zUzBGQlN5eGhRVUZzUWp0QlFVTkJMR2RDUVVGSExFMUJRVWdzUlVGQlZ6dEJRVU5RTEhWQ1FVRlBMRTlCUVU4c1ZVRkJVQ3hEUVVGclFpeFBRVUZQTEZWQlFWQXNRMEZCYTBJc1QwRkJiRUlzUTBGQk1FSXNTVUZCTVVJc1NVRkJhME1zUTBGQmNFUXNTMEZCTUVRc1NVRkJha1U3UVVGRFNEczdRVUZGUkN4dFFrRkJUeXhKUVVGUU8wRkJRMGc3UVVGeVMwdzdRVUZCUVR0QlFVRkJMRFJDUVhWTE5rSTdRVUZEY2tJc1owSkJRVWtzVTBGQlV5eExRVUZMTEdGQlFXeENPMEZCUTBFc1owSkJRVWNzVFVGQlNDeEZRVUZYTzBGQlExQXNkVUpCUVU4c1QwRkJUeXhSUVVGUUxFTkJRV2RDTEU5QlFVOHNVVUZCVUN4RFFVRm5RaXhQUVVGb1FpeERRVUYzUWl4SlFVRjRRaXhKUVVGblF5eERRVUZvUkN4TFFVRnpSQ3hKUVVFM1JEdEJRVU5JT3p0QlFVVkVMRzFDUVVGUExFbEJRVkE3UVVGRFNEdEJRVGxMVER0QlFVRkJPMEZCUVVFc05FSkJaMHh6UWp0QlFVTmtMR2RDUVVGSkxGTkJRVk1zUzBGQlN5eGhRVUZzUWp0QlFVTkJMR2RDUVVGSExFMUJRVWdzUlVGQlZ6dEJRVU5RTEhWQ1FVRlBMRTlCUVU4c1ZVRkJVQ3hEUVVGclFpeFBRVUZQTEZWQlFWQXNRMEZCYTBJc1QwRkJiRUlzUTBGQk1FSXNTVUZCTVVJc1NVRkJhME1zUTBGQmNFUXNTMEZCTUVRc1NVRkJha1U3UVVGRFNEczdRVUZGUkN4dFFrRkJUeXhKUVVGUU8wRkJRMGc3UVVGMlRFdzdRVUZCUVR0QlFVRkJMRFJDUVhsTWNVSTdRVUZEWWl4dFFrRkJUeXhMUVVGTExGVkJRVXdzUTBGQlowSXNRMEZCYUVJc1MwRkJjMElzU1VGQk4wSTdRVUZEU0R0QlFUTk1URHRCUVVGQk8wRkJRVUVzTkVKQk5rdzBRanRCUVVOd1FpeHRRa0ZCVHl4TFFVRkxMRkZCUVV3c1EwRkJZeXhEUVVGa0xFdEJRVzlDTEVsQlFUTkNPMEZCUTBnN1FVRXZURXc3UVVGQlFUdEJRVUZCTERSQ1FXbE5iMEk3UVVGRFdpeG5Ra0ZCU1N4UlFVRlJMRXRCUVVzc1ZVRkJha0k3UVVGRFFTeHRRa0ZCVHl4TlFVRk5MRTFCUVUwc1RVRkJUaXhIUVVGbExFTkJRWEpDTEVOQlFWQTdRVUZEU0R0QlFYQk5URHRCUVVGQk8wRkJRVUVzTkVKQmMwMHlRanRCUVVOdVFpeG5Ra0ZCU1N4UlFVRlJMRXRCUVVzc1VVRkJha0k3UVVGRFFTeHRRa0ZCVHl4TlFVRk5MRTFCUVUwc1RVRkJUaXhIUVVGbExFTkJRWEpDTEVOQlFWQTdRVUZEU0R0QlFYcE5URHM3UVVGQlFUdEJRVUZCTEVWQlFYVkRMR1ZCUVhaRE96czdPenM3T3pzN096czdPMEZEWkVFc1NVRkJUU3h6UWtGQmMwSXNORUpCUVRWQ096dEJRVVZCTEVsQlFVMHNaMEpCUVdkQ08wRkJRMnhDTEcxQ1FVRmxMRzlDUVVGRExFbEJRVVFzUlVGQlZUdEJRVU55UWl4WlFVRkpMRmxCUVZrc1MwRkJTeXhWUVVGTUxFTkJRV2RDTEZGQlFXaERPMEZCUTBFc1pVRkJVU3hWUVVGVkxFOUJRVllzUTBGQmEwSXNTVUZCYkVJc1MwRkJNa0lzUTBGQmJrTTdRVUZEU0N4TFFVcHBRanM3UVVGTmJFSXNhMEpCUVdNc2JVSkJRVU1zU1VGQlJDeEZRVUZWTzBGQlEzQkNMRmxCUVVrc1dVRkJXU3hMUVVGTExGVkJRVXdzUTBGQlowSXNVVUZCYUVNN1FVRkRRU3hsUVVGUkxGVkJRVlVzVDBGQlZpeERRVUZyUWl4SlFVRnNRaXhMUVVFeVFpeFZRVUZWTEUxQlFWWXNSMEZCYlVJc1EwRkJkRVE3UVVGRFNDeExRVlJwUWpzN1FVRlhiRUlzYVVKQlFXRXNhMEpCUVVNc1NVRkJSQ3hGUVVGUExFdEJRVkFzUlVGQmFVSTdRVUZETVVJc1owSkJRVkVzVTBGQlV5eExRVUZVTEVOQlFWSTdRVUZEUVN4WlFVRkpMRmxCUVZrc1MwRkJTeXhWUVVGTUxFTkJRV2RDTEZGQlFXaERPMEZCUTBFc1pVRkJVU3hWUVVGVkxFOUJRVllzUTBGQmEwSXNTVUZCYkVJc1MwRkJNa0lzVVVGQlVTeERRVUV6UXp0QlFVTklMRXRCWm1sQ096dEJRV2xDYkVJc1YwRkJUeXhoUVVGRExFbEJRVVFzUlVGQlR5eFJRVUZRTEVWQlFXOUNPMEZCUTNaQ0xHVkJRVThzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4UlFVRmlMRU5CUVZJN1FVRkRTQ3hMUVc1Q2FVSTdPMEZCY1VKc1FpeGhRVUZUTEdWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUTJZc1pVRkJUeXhMUVVGTExGVkJRVXdzUTBGQlowSXNUVUZCYUVJc1NVRkJNRUlzUTBGQmFrTTdRVUZEU0R0QlFYWkNhVUlzUTBGQmRFSTdPMEZCTUVKQkxFOUJRVThzVDBGQlVDeEhRVUZwUWl4WlFVRnhRanRCUVVGQkxGRkJRWEJDTEVsQlFXOUNPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVUZCTzBGQlFVRTdPMEZCUTJ4RE8wRkJRVUU3TzBGQlFVRTdRVUZCUVRzN1FVRkJRVHRCUVVGQk96dEJRVUZCTzBGQlFVRTdRVUZCUVN4NVJFRkRhVU1zWTBGRWFrTXNSVUZEYVVRN1FVRkRla01zYjBKQlFVa3NVVUZCVVN4dlFrRkJiMElzU1VGQmNFSXNRMEZCZVVJc1kwRkJla0lzUTBGQldqdEJRVU5CTEc5Q1FVRkpMRU5CUVVNc1MwRkJUQ3hGUVVGWkxFMUJRVTBzU1VGQlNTeFhRVUZLTEhWRFFVRnRSQ3hqUVVGdVJDeFRRVUZPT3p0QlFVVmFMRzlDUVVGSkxFOUJRVThzVFVGQlRTeERRVUZPTEVOQlFWZzdRVUZEUVN4dlFrRkJTU3hUUVVGVExFMUJRVTBzUTBGQlRpeERRVUZpT3p0QlFVVkJMRzlDUVVGSkxFVkJRVVVzVVVGQlVTeGhRVUZXTEVOQlFVb3NSVUZCT0VJc1RVRkJUU3dyUTBGQk5FTXNTVUZCTlVNc1VVRkJUanRCUVVNNVFpeDFRa0ZCVHl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVOaUxESkNRVUZQTEdOQlFXTXNTVUZCWkN4RlFVRnZRaXhKUVVGd1FpeEZRVUV3UWl4TlFVRXhRaXhEUVVGUU8wRkJRMGdzYVVKQlJrUTdRVUZIU0R0QlFWcE1PenRCUVVGQk8wRkJRVUVzVFVGQmNVSXNTVUZCY2tJN1FVRmpTQ3hEUVdaRU96czdPenM3T3pzN096czdPMEZETlVKQkxFbEJRVTBzV1VGQldTeFJRVUZSTEdsQ1FVRlNMRU5CUVd4Q08wRkJRMEVzU1VGQlRTeDVRa0ZCZVVJc1VVRkJVU3dyUWtGQlVpeERRVUV2UWp0QlFVTkJMRWxCUVUwc2MwSkJRWE5DTEZGQlFWRXNORUpCUVZJc1EwRkJOVUk3TzBGQlJVRXNTVUZCVFN4cFFrRkJhVUk3UVVGRGJrSXNZVUZCVXl4RFFVUlZMRVZCUTFBN1FVRkRXaXhoUVVGVExFTkJSbFVzUlVGRlVEdEJRVU5hTEcxQ1FVRmxMRU5CU0VrN1FVRkpia0lzYjBKQlFXZENPMEZCU2tjc1EwRkJka0k3TzBGQlQwRXNTVUZCVFN4bFFVRmxMREpEUVVGeVFqczdRVUZGUVN4UFFVRlBMRTlCUVZBN1FVRkJRVHM3UVVGQlFUdEJRVUZCT3p0QlFVRkJPMEZCUVVFN08wRkJRVUU3UVVGQlFUdEJRVUZCTEhORFFVZHJRanRCUVVOV0xHdENRVUZOTEVsQlFVa3NVMEZCU2l4RFFVRmpMREJEUVVGa0xFTkJRVTQ3UVVGRFNEdEJRVXhNTzBGQlFVRTdRVUZCUVN4dFJFRlBLMElzVVVGUUwwSXNSVUZQZVVNN1FVRkRha01zWjBKQlFVY3NRMEZCUXl4aFFVRmhMRWxCUVdJc1EwRkJhMElzVVVGQmJFSXNRMEZCU2l4RlFVRnBRenRCUVVNM1FpeHhRa0ZCU3l3eVFrRkJURHRCUVVOSU96dEJRVVZFTEdkQ1FVRkpMRk5CUVZNc1JVRkJZanM3UVVGRlFUdEJRVU5CTEhWQ1FVRlhMRk5CUVZNc1QwRkJWQ3hEUVVGcFFpeE5RVUZxUWl4RlFVRjVRaXhIUVVGNlFpeEZRVU5PTEU5QlJFMHNRMEZEUlN4dFFrRkVSaXhGUVVOMVFpeEpRVVIyUWl4RlFVVk9MRTlCUmswc1EwRkZSU3hOUVVaR0xFVkJSVlVzUlVGR1ZpeEZRVWRPTEU5QlNFMHNRMEZIUlN4TlFVaEdMRVZCUjFVc1JVRklWaXhEUVVGWU96dEJRVXRCTzBGQlEwRTdRVUZEUVN4blFrRkJTU3hqUVVGakxEWkVRVUZzUWp0QlFVTkJMR2RDUVVGSkxHOUNRVUZ2UWl3eVEwRkJlRUk3UVVGRFFTeG5Ra0ZCU1N4aFFVRmhMSGxEUVVGcVFqdEJRVU5CTEdkQ1FVRkpMRzFDUVVGdFFpeHZSRUZCZGtJN1FVRkRRU3huUWtGQlNTeGxRVUZsTEdWQlFXNUNPMEZCUTBFc1owSkJRVWtzYVVKQlFXbENMR2xEUVVGeVFqczdRVUZGUVR0QlFVTkJMR2RDUVVGSkxHRkJRV0VzU1VGQlNTeE5RVUZLTEZOQlFXbENMRU5CUXpsQ0xGbEJSRGhDTEVWQlJUbENMRmRCUmpoQ0xFVkJSemxDTEZWQlNEaENMRVZCU1RsQ0xHbENRVW80UWl4RlFVczVRaXhuUWtGTU9FSXNSVUZOT1VJc1kwRk9PRUlzUlVGUGFFTXNTVUZRWjBNc1EwRlBNMElzUjBGUU1rSXNRMEZCYWtJc1QwRkJha0k3TzBGQlUwRXNiVUpCUVUwc1EwRkJReXhEUVVGRExGRkJRVklzUlVGQmEwSTdRVUZEWkN4dlFrRkJTU3hSUVVGUkxGZEJRVmNzU1VGQldDeERRVUZuUWl4UlFVRm9RaXhEUVVGYU8wRkJRMEVzTWtKQlFWY3NVMEZCVXl4TFFVRlVMRU5CUVdVc1RVRkJUU3hMUVVGT0xFZEJRV01zVFVGQlRTeERRVUZPTEVWQlFWTXNUVUZCZEVNc1EwRkJXRHM3UVVGRlFTeHhRa0ZCU1N4SlFVRkpMRWxCUVVrc1EwRkJXaXhGUVVGbExFbEJRVWtzVFVGQlRTeE5RVUY2UWl4RlFVRnBReXhIUVVGcVF5eEZRVUZ6UXpzN1FVRkZiRU1zZDBKQlFVY3NUVUZCVFN4RFFVRk9MRTFCUVdFc1UwRkJhRUlzUlVGQk1rSTdRVUZEZGtJc05FSkJRVWtzVlVGQlZTeE5RVUZOTEVOQlFVNHNRMEZCWkR0QlFVTkJMRFJDUVVGSExFMUJRVTBzUTBGQlZDeEZRVUZaTzBGQlExSXNjME5CUVZVc1VVRkJVU3hQUVVGU0xFTkJRV2RDTEV0QlFXaENMRVZCUVhWQ0xFVkJRWFpDTEVOQlFWWTdRVUZEU0R0QlFVTkVMQ3RDUVVGUExFbEJRVkFzUTBGQldUdEJRVU5TTEd0RFFVRk5MRU5CUkVVN1FVRkZVaXh4UTBGQlV6dEJRVVpFTEhsQ1FVRmFPMEZCUzBnN1FVRkRTanRCUVVOS096dEJRVVZFTEcxQ1FVRlBMRTFCUVZBN1FVRkRTRHRCUVRWRVREdEJRVUZCTzBGQlFVRXNkME5CT0VSdlFpeFRRVGxFY0VJc1JVRTRSQ3RDTzBGQlEzWkNMRzlDUVVGUExGTkJRVkE3UVVGRFNTeHhRa0ZCU3l4SFFVRk1PMEZCUTBrc01rSkJRVThzWlVGQlpTeFBRVUYwUWp0QlFVTktMSEZDUVVGTExFZEJRVXc3UVVGRFNTd3lRa0ZCVHl4bFFVRmxMR0ZCUVhSQ08wRkJRMG9zY1VKQlFVc3NSMEZCVER0QlFVTkpMREpDUVVGUExHVkJRV1VzWTBGQmRFSTdRVUZEU2p0QlFVTkpMREpDUVVGUExHVkJRV1VzVDBGQmRFSTdRVUZTVWp0QlFWVklPMEZCZWtWTU8wRkJRVUU3UVVGQlFTdzBRMEV5UlhkQ0xFMUJNMFY0UWl4RlFUSkZaME03UVVGQlFUczdRVUZEZUVJc1owSkJRVWtzYTBKQlFXdENMRVZCUVhSQ08wRkJRMEVzWjBKQlFVa3NhVUpCUVdsQ0xFVkJRWEpDTzBGQlEwRXNiVUpCUVU4c1QwRkJVQ3hEUVVGbExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlEzUkNMSGRDUVVGUkxFMUJRVTBzU1VGQlpEdEJRVU5KTEhsQ1FVRkxMRU5CUVV3N1FVRkRTU3gzUTBGQlowSXNTVUZCYUVJc1EwRkJjVUlzWTBGQmNrSTdRVUZEUVN4M1EwRkJaMElzU1VGQmFFSXNRMEZCY1VJN1FVRkRha0lzZDBOQlFWa3NUMEZCU3l4bFFVRk1MRU5CUVhGQ0xFMUJRVTBzVDBGQk0wSTdRVUZFU3l4NVFrRkJja0k3TzBGQlNVRXNlVU5CUVdsQ0xFVkJRV3BDTzBGQlEwRTdRVUZEU2l4NVFrRkJTeXhEUVVGTU8wRkJRMGtzTkVKQlFVa3NUVUZCVFN4UFFVRk9MRWxCUVdsQ0xFZEJRWEpDTEVWQlFUQkNPMEZCUTNSQ0xESkRRVUZsTEU5QlFXWXNSMEZCZVVJc1RVRkJUU3hQUVVFdlFqdEJRVU5JTzBGQlEwUTdRVUZEU2l4NVFrRkJTeXhEUVVGTU8wRkJRMGtzZFVOQlFXVXNWVUZCWml4SFFVRTBRaXhsUVVGbExGVkJRV1lzU1VGQk5rSXNSVUZCZWtRN1FVRkRRU3gxUTBGQlpTeFZRVUZtTEVOQlFUQkNMRVZCUVRGQ0xFZEJRU3RDTEUxQlFVMHNUMEZCY2tNN1FVRkRRVHRCUVVOS0xIbENRVUZMTEVOQlFVdzdRVUZEU1N4MVEwRkJaU3hUUVVGbUxFZEJRVEpDTEdWQlFXVXNVMEZCWml4SlFVRTBRaXhGUVVGMlJEdEJRVU5CTEhWRFFVRmxMRk5CUVdZc1EwRkJlVUlzU1VGQmVrSXNRMEZCT0VJc1RVRkJUU3hQUVVGd1F6dEJRVU5CTzBGQlEwb3NlVUpCUVVzc1EwRkJURHRCUVVOSkxIVkRRVUZsTEZWQlFXWXNSMEZCTkVJc1pVRkJaU3hWUVVGbUxFbEJRVFpDTEVWQlFYcEVPMEZCUTBFc05FSkJRVWtzV1VGQldTeFBRVUZMTEhkQ1FVRk1MRU5CUVRoQ0xFMUJRVTBzVDBGQmNFTXNRMEZCYUVJN08wRkJSVUVzZFVOQlFXVXNWVUZCWml4RFFVRXdRaXhWUVVGVkxFbEJRWEJETEVsQlFUUkRMRlZCUVZVc1MwRkJkRVE3UVVGRFFUdEJRVU5LTEhsQ1FVRkxMRU5CUVV3N1FVRkRTU3gxUTBGQlpTeGxRVUZtTEVkQlFXbERMR1ZCUVdVc1pVRkJaaXhKUVVGclF5eEZRVUZ1UlRzN1FVRkZRU3cwUWtGQlNTeHBRa0ZCYVVJc1QwRkJTeXcwUWtGQlRDeERRVUZyUXl4TlFVRk5MRTlCUVhoRExFTkJRWEpDTzBGQlEwRXNkVU5CUVdVc1pVRkJaaXhEUVVFclFpeEpRVUV2UWl4RFFVRnZReXhqUVVGd1F6dEJRV2hEVWp0QlFXdERTQ3hoUVc1RFJEczdRVUZ4UTBFc05FSkJRV2RDTEVsQlFXaENMRU5CUVhGQ0xHTkJRWEpDT3p0QlFVVkJMRzFDUVVGUExHVkJRVkE3UVVGRFNEdEJRWFJJVER0QlFVRkJPMEZCUVVFc01FTkJkMGh6UWl4WFFYaElkRUlzUlVGM1NHMURMRkZCZUVodVF5eEZRWGRJTmtNc1IwRjRTRGRETEVWQmQwaHJSQ3hWUVhoSWJFUXNSVUYzU0RoRU8wRkJRM1JFTEdkQ1FVRkhMR05CUVdNc1pVRkJaU3hQUVVFM1FpeEpRVUYzUXl4alFVRmpMR1ZCUVdVc1QwRkJlRVVzUlVGQmFVWTdRVUZETjBVc2RVSkJRVThzUzBGQlN5eGxRVUZNTEVOQlFYRkNMRmRCUVhKQ0xFVkJRV3RETEZGQlFXeERMRVZCUVRSRExFZEJRVFZETEVWQlFXbEVMRlZCUVdwRUxFTkJRVkE3UVVGRFNDeGhRVVpFTEUxQlJVODdRVUZEU0N4MVFrRkJUeXhMUVVGTExHMUNRVUZNTEVOQlFYbENMRmRCUVhwQ0xFVkJRWE5ETEZGQlFYUkRMRVZCUVdkRUxFZEJRV2hFTEVWQlFYRkVMRlZCUVhKRUxFTkJRVkE3UVVGRFNEdEJRVU5LTzBGQk9VaE1PMEZCUVVFN1FVRkJRU3g1UTBGblNYRkNMRkZCYUVseVFpeEZRV2RKSzBJc1NVRm9TUzlDTEVWQlowbHhRenRCUVVGQk96dEJRVU0zUWl4blFrRkJTU3hWUVVGVkxFbEJRV1E3UVVGRFFTeHRRa0ZCVHl4SlFVRlFMRU5CUVZrc1VVRkJXaXhGUVVGelFpeFBRVUYwUWl4RFFVRTRRaXhWUVVGRExFbEJRVVFzUlVGQlR5eExRVUZRTEVWQlFXbENPMEZCUXpORExHOUNRVUZKTEVWQlFVVXNVMEZCVXl4SlFVRlVMR0ZCUVRCQ0xFMUJRVFZDTEV0QlEwRXNVMEZCVXl4SlFVRlVMR0ZCUVRCQ0xFMUJSREZDTEVsQlJVRXNVVUZCVVN4cFFrRkdXaXhGUVVVclFqczdRVUZGTTBJc09FSkJRVlVzVjBGQlZ5eFBRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGTkJRVk1zU1VGQlZDeERRVUYwUWl4RlFVRnpReXhMUVVGTExFbEJRVXdzUTBGQmRFTXNRMEZCY2tJN1FVRkRRVHRCUVVOSU96dEJRVVZFTEc5Q1FVRkpMR2RDUVVGblFpeFRRVUZ3UWl4RlFVRXJRanRCUVVNelFpdzRRa0ZCVlN4WFFVRlhMRXRCUVVzc1VVRkJUQ3hEUVVGakxGTkJRVk1zU1VGQlZDeERRVUZrTEVOQlFYSkNPMEZCUTBnc2FVSkJSa1FzVFVGRlR5eEpRVUZKTEZOQlFWTXNTVUZCVkN4aFFVRXdRaXhOUVVFNVFpeEZRVUZ6UXp0QlFVTjZReXc0UWtGQlZTeFhRVUZYTEV0QlFVc3NTVUZCVEN4TlFVRmxMRk5CUVRGQ0xFbEJRWFZETEZOQlFWTXNTVUZCVkN4RlFVRmxMRWxCUVdZc1EwRkJiMElzUzBGQlN5eEpRVUZNTEVOQlFYQkNMRU5CUVdwRU8wRkJRMGdzYVVKQlJrMHNUVUZGUVN4SlFVRkpMRkZCUVZFc2FVSkJRVm9zUlVGQkswSTdRVUZEYkVNc05rSkJRVk1zU1VGQlZDeEZRVUZsTEU5QlFXWXNRMEZCZFVJc1ZVRkJReXhqUVVGRUxFVkJRVzlDTzBGQlEzWkRMR3REUVVGVkxGZEJRVmNzWlVGQlpTeEpRVUZtTEVOQlFYSkNPMEZCUTBnc2NVSkJSa1E3UVVGSFNDeHBRa0ZLVFN4TlFVbEJPMEZCUTBnc09FSkJRVlVzVjBGQlZ5eExRVUZMTEVsQlFVd3NTMEZCWXl4VFFVRlRMRWxCUVZRc1EwRkJia003UVVGRFNEdEJRVU5LTEdGQmNFSkVPenRCUVhOQ1FTeHRRa0ZCVHl4UFFVRlFPMEZCUTBnN1FVRjZTa3c3UVVGQlFUdEJRVUZCTERSRFFUSktkMElzVjBFelNuaENMRVZCTWtweFF5eFJRVE5LY2tNc1JVRXlTaXRETEVkQk0wb3ZReXhGUVRKS2IwUXNWVUV6U25CRUxFVkJNa3BuUlR0QlFVTjRSQ3huUWtGQlNTeGhRVUZoTEVWQlFXcENPMEZCUTBFc2FVSkJRVWtzU1VGQlNTeEpRVUZKTEVOQlFWb3NSVUZCWlN4SlFVRkpMRmxCUVZrc1RVRkJMMElzUlVGQmRVTXNSMEZCZGtNc1JVRkJORU03UVVGRGVFTXNiMEpCUVVrc1ZVRkJWU3haUVVGWkxFTkJRVm9zUTBGQlpEczdRVUZGUVN4dlFrRkJTU3hUUVVGVExGRkJRVkVzVlVGQmNrSTdRVUZEUVN4dlFrRkJTU3huUWtGQlowSXNUMEZCVHl4UlFVRlFMRU5CUVdkQ0xFOUJRV2hDTEVOQlFYZENMRTlCUVhoQ0xFTkJRWEJDTzBGQlEwRXNiMEpCUVVjc2EwSkJRV3RDTEVOQlFVTXNRMEZCZEVJc1JVRkJlVUk3UVVGRGNrSXNkMEpCUVVrc2IwSkJRVzlDTEU5QlFVOHNVVUZCVUN4RFFVRm5RaXhOUVVGb1FpeERRVUYxUWl4blFrRkJaMElzUTBGQmRrTXNRMEZCZUVJN08wRkJSVUVzZVVKQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVZvc1JVRkJaU3hKUVVGSkxHdENRVUZyUWl4TlFVRnlReXhGUVVFMlF5eEhRVUUzUXl4RlFVRnJSRHRCUVVNNVF5dzBRa0ZCU1N4alFVRmpMR3RDUVVGclFpeERRVUZzUWl4RFFVRnNRanM3UVVGRlFTdzBRa0ZCUnl4TFFVRkxMR2RDUVVGTUxFTkJRWE5DTEZGQlFYUkNMRVZCUVdkRExGZEJRV2hETEVOQlFVZ3NSVUZCYVVRN1FVRkROME1zZFVOQlFWY3NTVUZCV0N4RFFVRm5RaXhYUVVGb1FqczdRVUZGUVN4blEwRkJSeXhIUVVGSUxFVkJRVkU3UVVGRFdEczdRVUZGUkN3MFFrRkJSeXhqUVVGakxHVkJRV1VzWVVGQmFFTXNSVUZCSzBNN1FVRkRNME03UVVGRFNEdEJRVU5LT3p0QlFVVkVMSGRDUVVGSExFOUJRVThzVjBGQlZ5eE5RVUZZTEVkQlFXOUNMRU5CUVRsQ0xFVkJRV2xETzBGQlEzQkRPMEZCUTBvN08wRkJSVVFzYlVKQlFVOHNWVUZCVUR0QlFVTklPMEZCZUV4TU8wRkJRVUU3UVVGQlFTeDNRMEV3VEc5Q0xGZEJNVXh3UWl4RlFUQk1hVU1zVVVFeFRHcERMRVZCTUV3eVF5eEhRVEZNTTBNc1JVRXdUR2RFTEZWQk1VeG9SQ3hGUVRCTU5FUTdRVUZCUVRzN1FVRkRjRVFzWjBKQlFVa3NZVUZCWVN4RlFVRnFRanRCUVVOQkxIZENRVUZaTEU5QlFWb3NRMEZCYjBJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE4wSXNOa0pCUVdFc1YwRkJWeXhOUVVGWUxFTkJRV3RDTEU5QlFVc3NWMEZCVEN4RFFVRnBRaXhQUVVGcVFpeEZRVUV3UWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVNdlJDd3lRa0ZCVHl4UFFVRkxMR2RDUVVGTUxFTkJRWE5DTEZGQlFYUkNMRVZCUVdkRExFbEJRV2hETEVOQlFWQTdRVUZEU0N4cFFrRkdPRUlzUlVGRk5VSXNSMEZHTkVJc1JVRkZka0lzWTBGQll5eGxRVUZsTEU5QlJrNHNRMEZCYkVJc1EwRkJZanRCUVVkSUxHRkJTa1E3TzBGQlRVRXNiVUpCUVU4c1ZVRkJVRHRCUVVOSU8wRkJiazFNTzBGQlFVRTdRVUZCUVN4dlEwRnhUV2RDTEZkQmNrMW9RaXhGUVhGTk5rSXNVMEZ5VFRkQ0xFVkJjVTEzUXl4SFFYSk5lRU1zUlVGeFRUWkRPMEZCUTNKRExHdENRVUZOTEU5QlFVOHNTMEZCWWp0QlFVTkJMR2RDUVVGSkxHRkJRV0VzUlVGQmFrSTdPMEZCUlVFc2FVSkJRVWtzU1VGQlNTeEpRVUZKTEVOQlFWb3NSVUZCWlN4SlFVRkpMRlZCUVZVc1RVRkJOMElzUlVGQmNVTXNSMEZCY2tNc1JVRkJNRU03UVVGRGRFTXNiMEpCUVVrc1YwRkJWeXhWUVVGVkxFTkJRVllzUTBGQlpqdEJRVU5CTEc5Q1FVRkpMR0ZCUVdFc1pVRkJaU3hQUVVGb1F6czdRVUZGUVN4dlFrRkJSeXhuUWtGQlowSXNVVUZCYmtJc1JVRkJOa0k3UVVGRGVrSXNhVU5CUVdFc1UwRkJVeXhWUVVGMFFqdEJRVU5CTEN0Q1FVRlhMRlZCUVZVc1NVRkJTU3hKUVVGSkxFTkJRV3hDTEVOQlFWZzdRVUZEU0RzN1FVRkhSQ3cyUWtGQllTeExRVUZMTEdsQ1FVRk1MRU5CUTFRc1YwRkVVeXhGUVVWVUxGRkJSbE1zUlVGSFZDeFBRVUZQTEV0QlFVc3NWVUZCVlN4TlFVRldMRWRCUVcxQ0xFTkJTSFJDTEVWQlNWUXNWVUZLVXl4RFFVRmlPenRCUVU5Qk8wRkJRMEVzTmtKQlFXRXNWMEZCVnl4TlFVRllMRU5CUVd0Q0xGVkJRVU1zU1VGQlJDeEZRVUZQTEV0QlFWQXNSVUZCWXl4SlFVRmtMRVZCUVhWQ08wRkJRMnhFTERKQ1FVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzVFVGQmRVSXNTMEZCT1VJN1FVRkRTQ3hwUWtGR1dTeERRVUZpT3p0QlFVbEJMRGhDUVVGakxGVkJRV1E3TzBGQlJVRXNiMEpCUVVjc1dVRkJXU3hOUVVGYUxFbEJRWE5DTEVOQlFYcENMRVZCUVRSQ08wRkJRM2hDTzBGQlEwZzdRVUZEU2pzN1FVRkZSQ3h0UWtGQlR5eFZRVUZRTzBGQlEwZzdRVUYyVDB3N1FVRkJRVHRCUVVGQkxHOUVRWGxQWjBNc1JVRjZUMmhETEVWQmVVOXZRenRCUVVNMVFpeG5Ra0ZCUnl4alFVRmpMRmRCUVdwQ0xFVkJRVGhDTEUxQlFVMHNSVUZCVGp0QlFVTTVRaXhyUWtGQlRTeEpRVUZKTEZkQlFVb3NRMEZCWjBJc2QwSkJRV2hDTEVOQlFVNDdRVUZEU0R0QlFUVlBURHRCUVVGQk8wRkJRVUVzYTBOQk9FOWpMRWxCT1U5a0xFVkJPRTl2UWp0QlFVTmFMR2RDUVVGSkxGVkJRVlVzVTBGQlZpeFBRVUZWTEVOQlFVTXNTVUZCUkN4RlFVRlBMRWxCUVZBc1JVRkJaMEk3UVVGRE1VSXNjVUpCUVVzc1NVRkJUQ3hEUVVGVkxFbEJRVlk3UVVGRFFTeHhRa0ZCU3l4VlFVRk1MRU5CUVdkQ0xFMUJRV2hDTEVOQlFYVkNMRTlCUVhaQ0xFVkJRV2RETEVsQlFXaERPenRCUVVWQkxIVkNRVUZQTEVsQlFWQTdRVUZEU0N4aFFVeEVPenRCUVU5QkxHZENRVUZKTEZWQlFWVXNRMEZCUXl4SlFVRkVMRVZCUVU4c1RVRkJVQ3hEUVVGakxFOUJRV1FzUlVGQmRVSXNSVUZCZGtJc1EwRkJaRHM3UVVGRlFTeHRRa0ZCVHl4TFFVRkxMRWxCUVV3c1EwRkJWU3hWUVVGRExFTkJRVVFzUlVGQlNTeERRVUZLTEVWQlFWVTdRVUZEZGtJc2IwSkJRVWtzVTBGQlV5eFJRVUZSTEU5QlFWSXNRMEZCWjBJc1EwRkJhRUlzUTBGQllqdEJRVU5CTEc5Q1FVRkpMRk5CUVZNc1VVRkJVU3hQUVVGU0xFTkJRV2RDTEVOQlFXaENMRU5CUVdJN08wRkJSVUVzYjBKQlFVa3NVMEZCVXl4TlFVRmlMRVZCUVhGQ08wRkJRMnBDTERKQ1FVRlBMRU5CUVZBN1FVRkRTQ3hwUWtGR1JDeE5RVVZQTEVsQlFVY3NVMEZCVXl4TlFVRmFMRVZCUVc5Q08wRkJRM1pDTERKQ1FVRlBMRU5CUVVNc1EwRkJVanRCUVVOSUxHbENRVVpOTEUxQlJVRTdRVUZEU0N3eVFrRkJUeXhEUVVGUU8wRkJRMGc3UVVGRFNpeGhRVmhOTEVOQlFWQTdRVUZaU0R0QlFYQlJURHRCUVVGQk8wRkJRVUVzYTBOQmMxRmpMRkZCZEZGa0xFVkJjMUYzUWl4SFFYUlJlRUlzUlVGelVUWkNPMEZCUTNKQ0xHZENRVUZKTEZGQlFWRXNSVUZCV2p0QlFVTkJMR2RDUVVGSkxHVkJRV1VzVTBGQlV5eExRVUZVTEVOQlFXVXNSMEZCWml4RFFVRnVRanM3UVVGRlFTeHBRa0ZCU1N4SlFVRkpMRWxCUVVrc1EwRkJXaXhGUVVGbExFbEJRVWtzWVVGQllTeE5RVUZvUXl4RlFVRjNReXhIUVVGNFF5eEZRVUUyUXp0QlFVTjZReXh2UWtGQlNTeGpRVUZqTEdGQlFXRXNRMEZCWWl4RFFVRnNRanM3UVVGRlFTeHZRa0ZCU1N4VFFVRlRMRXRCUVVzc01FSkJRVXdzUTBGQlowTXNWMEZCYUVNc1EwRkJZanRCUVVOQkxHOUNRVUZKTEd0Q1FVRnJRaXhMUVVGTExHMUNRVUZNTEVOQlFYbENMRTFCUVhwQ0xFTkJRWFJDTzBGQlEwRXNiMEpCUVVrc1pVRkJaU3hMUVVGTExGZEJRVXdzUTBGQmFVSXNRMEZCUXl4SlFVRkVMRU5CUVdwQ0xFVkJRWGxDTEdWQlFYcENMRVZCUVRCRExFZEJRVEZETEVOQlFXNUNPenRCUVVWQkxEWkNRVUZoTEU5QlFXSXNRMEZCY1VJc1ZVRkJReXhKUVVGRUxFVkJRVlU3UVVGRE0wSXNkMEpCUVVjc1RVRkJUU3hQUVVGT0xFTkJRV01zU1VGQlpDeExRVUYxUWl4RFFVRkRMRU5CUVROQ0xFVkJRVGhDTzBGQlF6RkNMRGhDUVVGTkxFbEJRVTRzUTBGQlZ5eEpRVUZZTzBGQlEwZzdRVUZEU2l4cFFrRktSRHRCUVV0SU96dEJRVVZFTEcxQ1FVRlBMR0ZCUVdFc1RVRkJZaXhIUVVGelFpeERRVUYwUWl4SFFVRjVRaXhMUVVGTExGTkJRVXdzUTBGQlpTeExRVUZtTEVOQlFYcENMRWRCUVdkRUxFdEJRWFpFTzBGQlEwZzdRVUY2VWt3N1FVRkJRVHRCUVVGQkxHZERRVEpTV1N4UlFUTlNXaXhGUVRKU2MwSTdRVUZEWkN4blFrRkJTU3hQUVVGUExFdEJRVXNzWVVGQlRDeERRVUZ0UWl4blFrRkJia0lzUTBGQmIwTXNVVUZCY0VNc1EwRkJXRHRCUVVOQkxHZENRVUZKTEVsQlFVa3NTMEZCU3l4TlFVRmlPMEZCUTBFc2JVSkJRVTBzUlVGQlJTeERRVUZHTEVsQlFVOHNRMEZCVUN4SlFVRlpMRXRCUVVzc1EwRkJUQ3hOUVVGWkxFbEJRVGxDTEVWQlFXOURMRU5CUVVVN08wRkJSWFJETEcxQ1FVRlBMRWxCUVVrc1EwRkJReXhEUVVGYU8wRkJRMGc3UVVGcVUwdzdRVUZCUVR0QlFVRkJMSE5EUVcxVGEwSXNVVUZ1VTJ4Q0xFVkJiVk0wUWp0QlFVTndRaXhuUWtGQlNUdEJRVU5CTEhWQ1FVRlBMRXRCUVVzc1UwRkJUQ3hEUVVGbExGRkJRV1lzUlVGQmVVSXNRMEZCZWtJc1MwRkJLMElzU1VGQmRFTTdRVUZEU0N4aFFVWkVMRU5CUlVVc1QwRkJUU3hGUVVGT0xFVkJRVlU3UVVGRFVpeHhRa0ZCU3l3eVFrRkJUQ3hEUVVGcFF5eEZRVUZxUXp0QlFVTklPMEZCUTBvN1FVRjZVMHc3UVVGQlFUdEJRVUZCTEhsRFFUSlRjVUlzVVVFelUzSkNMRVZCTWxNclFqdEJRVU4yUWl4blFrRkJTVHRCUVVOQkxIVkNRVUZQTEV0QlFVc3NVMEZCVEN4RFFVRmxMRkZCUVdZc1EwRkJVRHRCUVVOSUxHRkJSa1FzUTBGRlJTeFBRVUZOTEVWQlFVNHNSVUZCVlR0QlFVTlNMSEZDUVVGTExESkNRVUZNTEVOQlFXbERMRVZCUVdwRE8wRkJRMGc3UVVGRFNqdEJRV3BVVERzN1FVRkJRVHRCUVVGQkxFVkJRU3RETEhWQ1FVTXpReXh4UWtGRU1rTXNRMEZCTDBNN096czdPenM3T3p0SlEySk5MRlU3T3pzN096czdORUpCUTNsQ08wRkJRVVVzYlVKQlFVOHNRMEZCVUR0QlFVRlhPenM3TkVKQlEySTdRVUZCUlN4dFFrRkJUeXhEUVVGUU8wRkJRVmM3T3pzMFFrRkRaanRCUVVGRkxHMUNRVUZQTEVOQlFWQTdRVUZCVnpzN096UkNRVU5vUWp0QlFVRkZMRzFDUVVGUExGVkJRVkE3UVVGQmIwSTdPenMwUWtGRGJFSTdRVUZCUlN4dFFrRkJUeXhEUVVGUU8wRkJRVmM3T3pzMFFrRkRXRHRCUVVGRkxHMUNRVUZQTEVOQlFWQTdRVUZCVnpzN096UkNRVU5zUWp0QlFVRkZMRzFDUVVGUExFTkJRVkE3UVVGQlZ6czdPelJDUVVOS08wRkJRVVVzYlVKQlFVOHNRMEZCVUR0QlFVRlhPenM3TkVKQlExWTdRVUZCUlN4dFFrRkJUeXhGUVVGUU8wRkJRVms3T3pzMFFrRkRlRUk3UVVGQlJTeHRRa0ZCVHl4RlFVRlFPMEZCUVZrN096czBRa0ZEUlR0QlFVRkZMRzFDUVVGUExFVkJRVkE3UVVGQldUczdPelJDUVVNM1FqdEJRVUZGTEcxQ1FVRlBMRWRCUVZBN1FVRkJZVHM3T3pSQ1FVTmtPMEZCUVVVc2JVSkJRVThzUjBGQlVEdEJRVUZoT3pzN05FSkJRMVk3UVVGQlJTeHRRa0ZCVHl4SFFVRlFPMEZCUVdFN096czBRa0ZEV0R0QlFVRkZMRzFDUVVGUExFbEJRVkE3UVVGQll6czdPelJDUVVONlFqdEJRVUZGTEcxQ1FVRlBMRWxCUVZBN1FVRkJZenM3T3pzN08wbEJSM3BETEZVN1FVRkRSaXgzUWtGQldTeEpRVUZhTEVWQlFXdENMRlZCUVd4Q0xFVkJRVGhDTEUxQlFUbENMRVZCUVhORE8wRkJRVUU3TzBGQlEyeERMR0ZCUVVzc1EwRkJUQ3hIUVVGVExFVkJRVlE3UVVGRFFTeGhRVUZMTEU5QlFVd3NSMEZCWlN4TlFVRm1PMEZCUTBFc1lVRkJTeXhMUVVGTUxFZEJRV0VzU1VGQllqdEJRVU5CTEdGQlFVc3NWMEZCVEN4SFFVRnRRaXhWUVVGdVFqdEJRVU5CTEdGQlFVc3NVMEZCVEN4SFFVRnBRaXhGUVVGcVFqdEJRVU5CTEdGQlFVc3NVMEZCVEN4SFFVRnBRaXhEUVVGRExFTkJRV3hDT3p0QlFVVkJMR0ZCUVVzc1VVRkJURHRCUVVOSU96czdPMjlEUVd0Q1Z5eEpMRVZCUVUwN1FVRkRaQ3huUWtGQlJ5eERRVUZETEV0QlFVc3NUMEZCVGl4SlFVRnBRaXhMUVVGTExFOUJRVXdzUTBGQllTeFZRVUZpTEVOQlFYZENMRWxCUVhoQ0xFdEJRV2xETEZkQlFWY3NZVUZCYUVVc1JVRkJLMFU3UVVGRE0wVXNkVUpCUVU4c1EwRkJVRHRCUVVOSU96dEJRVVZFTEdkQ1FVRkhMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRV0lzUTBGQmQwSXNTVUZCZUVJc1MwRkJhVU1zVjBGQlZ5eFhRVUV2UXl4RlFVRTBSRHRCUVVONFJDeDFRa0ZCVHl4RFFVRlFPMEZCUTBnN08wRkJSVVFzWjBKQlFVY3NTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJZaXhEUVVGM1FpeEpRVUY0UWl4TFFVRnBReXhYUVVGWExHRkJRUzlETEVWQlFUaEVPMEZCUXpGRUxIVkNRVUZQTEVOQlFVTXNRMEZCVWp0QlFVTklPMEZCUTBvN096dDNRMEZGWlN4SkxFVkJRVTA3UVVGRGJFSXNaMEpCUVVjc1MwRkJTeXhYUVVGTUxFTkJRV2xDTEVsQlFXcENMRXRCUVRCQ0xFTkJRVGRDTEVWQlFXZERPMEZCUXpWQ0xIVkNRVUZQTEVsQlFWQTdRVUZEU0N4aFFVWkVMRTFCUlU4N1FVRkRTQ3gxUWtGQlR5eExRVUZRTzBGQlEwZzdRVUZEU2pzN08yMURRVVZWTzBGQlFVRTdPMEZCUTFBc1owSkJRVWtzVlVGQlZTeFRRVUZXTEU5QlFWVXNRMEZCUXl4SlFVRkVMRVZCUVU4c1NVRkJVQ3hGUVVGblFqdEJRVU14UWl4dlFrRkJTU3hoUVVGaExFMUJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhEUVVGcVFqdEJRVU5CTEc5Q1FVRkpMR1ZCUVdVc1EwRkJia0lzUlVGRFNTeEpRVUZKTEUxQlFVc3NWMEZCVEN4SlFVRnZRaXhYUVVGWExGRkJRVzVETEVWQlFUWkRPMEZCUTNwRExIbENRVUZMTEVsQlFVd3NRMEZCVlN4SlFVRldPMEZCUTBnc2FVSkJSa1FzVFVGRlR5eEpRVUZKTEUxQlFVc3NWMEZCVEN4SlFVRnZRaXhYUVVGWExGbEJRUzlDTEVsQlExQXNTMEZCU3l4UlFVRk1MRWxCUVdsQ0xFTkJSR1FzUlVGRGFVSTdRVUZEY0VJc2VVSkJRVXNzU1VGQlRDeERRVUZWTEVsQlFWWTdRVUZEU0N4cFFrRklUU3hOUVVkQkxFbEJRVWtzVFVGQlN5eFhRVUZNTEVsQlFXOUNMRmRCUVZjc1UwRkJMMElzU1VGRFVDeExRVUZMTEZGQlFVd3NTVUZCYVVJc1EwRkVaQ3hGUVVOcFFqdEJRVU53UWl4NVFrRkJTeXhKUVVGTUxFTkJRVlVzU1VGQlZqdEJRVU5JTEdsQ1FVaE5MRTFCUjBFc1NVRkJTU3hOUVVGTExGZEJRVXdzU1VGQmIwSXNWMEZCVnl4clFrRkJMMElzU1VGRFVDeExRVUZMTEZGQlFVd3NTVUZCYVVJc1EwRkVaQ3hGUVVOcFFqdEJRVU53UWl4NVFrRkJTeXhKUVVGTUxFTkJRVlVzU1VGQlZqdEJRVU5JTEdsQ1FVaE5MRTFCUjBFc1NVRkJTU3hOUVVGTExGZEJRVXdzU1VGQmIwSXNWMEZCVnl4WlFVRXZRaXhKUVVOUUxFdEJRVXNzVVVGQlRDeEpRVUZwUWl4RFFVUmtMRVZCUTJsQ08wRkJRM0JDTEhsQ1FVRkxMRWxCUVV3c1EwRkJWU3hKUVVGV08wRkJRMGc3TzBGQlJVd3NiMEpCUVVrc1pVRkJaU3hEUVVGRExFTkJRWEJDTEVWQlEwa3NTMEZCU3l4VlFVRk1MRU5CUVdkQ0xFMUJRV2hDTEVOQlFYVkNMRTlCUVhaQ0xFVkJRV2RETEVsQlFXaERPenRCUVVWS0xIVkNRVUZQTEVsQlFWQTdRVUZEU0N4aFFYWkNSRHM3UVVGNVFrRXNhVUpCUVVzc1UwRkJUQ3hIUVVGcFFpeERRVUZETEV0QlFVc3NTMEZCVGl4RlFVRmhMRTFCUVdJc1EwRkJiMElzVDBGQmNFSXNSVUZCTmtJc1JVRkJOMElzUTBGQmFrSTdRVUZEU0RzN08zRkRRVVZaTzBGQlExUXNaMEpCUVVrc1UwRkJVeXhMUVVGTExGZEJRVXdzUTBGQmFVSXNWVUZCT1VJN1FVRkRRU3huUWtGQlNTeFJRVUZSTEV0QlFVc3NVMEZCVEN4RFFVRmxMRTlCUVdZc1EwRkJkVUlzVFVGQmRrSXNRMEZCV2pzN1FVRkZRU3huUWtGQlNTeFZRVUZWTEVOQlFVTXNRMEZCWml4RlFVRnJRanRCUVVOa0xIRkNRVUZMTEZOQlFVd3NSMEZCYVVJc1MwRkJha0k3TzBGQlJVRXNkVUpCUVU4c1RVRkJVRHRCUVVOSU96dEJRVVZFTEcxQ1FVRlBMRWxCUVZBN1FVRkRTRHM3TzNGRFFVVlpPMEZCUTFRc1owSkJRVWtzVDBGQlR5eExRVUZMTEZkQlFXaENPMEZCUTBFc2FVSkJRVWtzU1VGQlNTeEpRVUZKTEVOQlFWb3NSVUZCWlN4SlFVRkpMRXRCUVVzc1ZVRkJUQ3hEUVVGblFpeE5RVUZ1UXl4RlFVRXlReXhIUVVFelF5eEZRVUZuUkR0QlFVTTFReXh2UWtGQlNTeFJRVUZSTEV0QlFVc3NVMEZCVEN4RFFVRmxMRTlCUVdZc1EwRkJkVUlzUzBGQlN5eFZRVUZNTEVOQlFXZENMRU5CUVdoQ0xFTkJRWFpDTEVOQlFWbzdRVUZEUVN4dlFrRkJTU3hWUVVGVkxFTkJRVU1zUTBGQlppeEZRVUZyUWp0QlFVTmtMSGxDUVVGTExGTkJRVXdzUjBGQmFVSXNTMEZCYWtJN1FVRkRRU3d5UWtGQlR5eExRVUZMTEZWQlFVd3NRMEZCWjBJc1EwRkJhRUlzUTBGQlVEdEJRVU5JTzBGQlEwbzdPMEZCUlVRc2JVSkJRVThzU1VGQlVEdEJRVU5JT3pzN2IwTkJSVmM3UVVGRFVpeG5Ra0ZCU1N4UFFVRlBMRXRCUVVzc1YwRkJhRUk3UVVGRFFTeHBRa0ZCU1N4SlFVRkpMRWxCUVVrc1MwRkJTeXhWUVVGTUxFTkJRV2RDTEUxQlFXaENMRWRCUVhsQ0xFTkJRWEpETEVWQlFYZERMRXRCUVVzc1EwRkJOME1zUlVGQlowUXNSMEZCYUVRc1JVRkJjVVE3UVVGRGFrUXNiMEpCUVVrc1VVRkJVU3hMUVVGTExGTkJRVXdzUTBGQlpTeFBRVUZtTEVOQlFYVkNMRXRCUVVzc1ZVRkJUQ3hEUVVGblFpeERRVUZvUWl4RFFVRjJRaXhEUVVGYU8wRkJRMEVzYjBKQlFVa3NWVUZCVlN4RFFVRkRMRU5CUVdZc1JVRkJhMEk3UVVGRFpDeDVRa0ZCU3l4VFFVRk1MRWRCUVdsQ0xFdEJRV3BDTzBGQlEwRXNNa0pCUVU4c1MwRkJTeXhWUVVGTUxFTkJRV2RDTEVOQlFXaENMRU5CUVZBN1FVRkRTRHRCUVVOS096dEJRVVZFTEcxQ1FVRlBMRWxCUVZBN1FVRkRTRHM3T3pCRFFVVnBRanRCUVVOa0xHZENRVUZKTEU5QlFVOHNTMEZCU3l4WFFVRm9RanRCUVVOQkxHMUNRVUZQTEU5QlFVOHNTMEZCU3l4bFFVRnVRaXhGUVVGeFF6dEJRVU5xUXl4dlFrRkJTU3hSUVVGUkxFdEJRVXNzVTBGQlRDeERRVUZsTEU5QlFXWXNRMEZCZFVJc1NVRkJka0lzUTBGQldqdEJRVU5CTEc5Q1FVRkhMRlZCUVZVc1EwRkJReXhEUVVGa0xFVkJRV2xDTzBGQlEySXNlVUpCUVVzc1UwRkJUQ3hIUVVGcFFpeExRVUZxUWp0QlFVTkJMREpDUVVGUExFbEJRVkE3UVVGRFNEdEJRVU5LT3p0QlFVVkVMRzFDUVVGUExFbEJRVkE3UVVGRFNEczdPM05EUVVWaE8wRkJRMVlzWjBKQlFVa3NUMEZCVHl4TFFVRkxMRmRCUVdoQ08wRkJRMEVzYlVKQlFVOHNUMEZCVHl4TFFVRkxMRmRCUVc1Q0xFVkJRV2xETzBGQlF6ZENMRzlDUVVGSkxGRkJRVkVzUzBGQlN5eFRRVUZNTEVOQlFXVXNUMEZCWml4RFFVRjFRaXhKUVVGMlFpeERRVUZhTzBGQlEwRXNiMEpCUVVjc1ZVRkJWU3hEUVVGRExFTkJRV1FzUlVGQmFVSTdRVUZEWWl4NVFrRkJTeXhUUVVGTUxFZEJRV2xDTEV0QlFXcENPMEZCUTBFc01rSkJRVThzU1VGQlVEdEJRVU5JTzBGQlEwbzdPMEZCUlVRc2JVSkJRVThzU1VGQlVEdEJRVU5JT3pzN2JVTkJSVlU3UVVGRFVDeG5Ra0ZCUnl4TFFVRkxMRk5CUVV3c1NVRkJhMElzUzBGQlN5eFRRVUZNTEVOQlFXVXNUVUZCY0VNc1JVRkJORU03UVVGRGVFTXNkVUpCUVU4c1NVRkJVRHRCUVVOSU96dEJRVVZFTEdsQ1FVRkxMRk5CUVV3N1FVRkRRU3h0UWtGQlR5eExRVUZMTEZkQlFWbzdRVUZEU0RzN08zVkRRVVZqTzBGQlExZ3NaMEpCUVVjc1MwRkJTeXhUUVVGTUxFbEJRV3RDTEVOQlFVTXNRMEZCZEVJc1JVRkJlVUk3UVVGRGNrSXNkVUpCUVU4c1NVRkJVRHRCUVVOSU96dEJRVVZFTEdsQ1FVRkxMRk5CUVV3N1FVRkRRU3h0UWtGQlR5eExRVUZMTEZkQlFWbzdRVUZEU0RzN096UkNRWEJLV1R0QlFVTlVMRzFDUVVGUExFdEJRVXNzVDBGQldqdEJRVU5JT3pzN05FSkJSVlU3UVVGRFVDeHRRa0ZCVHl4TFFVRkxMRXRCUVZvN1FVRkRTRHM3T3pSQ1FVVm5RanRCUVVOaUxHMUNRVUZQTEV0QlFVc3NWMEZCV2p0QlFVTklPenM3TkVKQlJXbENPMEZCUTJRc2JVSkJRVThzUzBGQlN5eFRRVUZNTEVOQlFXVXNTMEZCU3l4VFFVRndRaXhMUVVGclF5eEpRVUY2UXp0QlFVTklPenM3T3pzN1FVRjVTVXdzVDBGQlR5eFBRVUZRTEVkQlFXbENPMEZCUTJJc1owSkJRVmtzVlVGRVF6dEJRVVZpTEdkQ1FVRlpPMEZCUmtNc1EwRkJha0k3T3pzN08wRkRkRXhCTEU5QlFVOHNUMEZCVUN4SFFVRnBRaXhEUVVOaUxFMUJSR0VzUlVGRllpeE5RVVpoTEVWQlIySXNTVUZJWVN4RlFVbGlMRXRCU21Fc1JVRkxZaXhUUVV4aExFVkJUV0lzVDBGT1lTeEZRVTlpTEVsQlVHRXNSVUZSWWl4TFFWSmhMRVZCVTJJc1QwRlVZU3hGUVZWaUxGRkJWbUVzUlVGWFlpeE5RVmhoTEVWQldXSXNWVUZhWVN4RlFXRmlMRTFCWW1Fc1JVRmpZaXhQUVdSaExFVkJaV0lzVVVGbVlTeEZRV2RDWWl4UFFXaENZU3hGUVdsQ1lpeExRV3BDWVN4RFFVRnFRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUlHVW9kQ3h1TEhJcGUyWjFibU4wYVc5dUlITW9ieXgxS1h0cFppZ2hibHR2WFNsN2FXWW9JWFJiYjEwcGUzWmhjaUJoUFhSNWNHVnZaaUJ5WlhGMWFYSmxQVDFjSW1aMWJtTjBhVzl1WENJbUpuSmxjWFZwY21VN2FXWW9JWFVtSm1FcGNtVjBkWEp1SUdFb2J5d2hNQ2s3YVdZb2FTbHlaWFIxY200Z2FTaHZMQ0V3S1R0MllYSWdaajF1WlhjZ1JYSnliM0lvWENKRFlXNXViM1FnWm1sdVpDQnRiMlIxYkdVZ0oxd2lLMjhyWENJblhDSXBPM1JvY205M0lHWXVZMjlrWlQxY0lrMVBSRlZNUlY5T1QxUmZSazlWVGtSY0lpeG1mWFpoY2lCc1BXNWJiMTA5ZTJWNGNHOXlkSE02ZTMxOU8zUmJiMTFiTUYwdVkyRnNiQ2hzTG1WNGNHOXlkSE1zWm5WdVkzUnBiMjRvWlNsN2RtRnlJRzQ5ZEZ0dlhWc3hYVnRsWFR0eVpYUjFjbTRnY3lodVAyNDZaU2w5TEd3c2JDNWxlSEJ2Y25SekxHVXNkQ3h1TEhJcGZYSmxkSFZ5YmlCdVcyOWRMbVY0Y0c5eWRITjlkbUZ5SUdrOWRIbHdaVzltSUhKbGNYVnBjbVU5UFZ3aVpuVnVZM1JwYjI1Y0lpWW1jbVZ4ZFdseVpUdG1iM0lvZG1GeUlHODlNRHR2UEhJdWJHVnVaM1JvTzI4ckt5bHpLSEpiYjEwcE8zSmxkSFZ5YmlCemZTa2lMQ0pqYjI1emRDQkVUMDFRWVhKelpTQTlJSEpsY1hWcGNtVW9KeTR2YzNKakwyUnZiUzF3WVhKelpTNXFjeWNwTzF4eVhHNWNjbHh1YkdWMElGOXRiMlJsSUQwZ0oyMXZaR1Z5WVhSbEp6dGNjbHh1WTJ4aGMzTWdXRk5FVDAxUVlYSnpaWElnZTF4eVhHNGdJQ0FnYzNSaGRHbGpJR2RsZENCT2IyUmxSbWxzZEdWeUtDa2dleUJ5WlhSMWNtNGdjbVZ4ZFdseVpTZ25MaTl6Y21NdmRISmxaUzEzWVd4clpYSW5LUzVPYjJSbFJtbHNkR1Z5T3lCOVhISmNiaUFnSUNCemRHRjBhV01nWjJWMElHMXZaR1VvS1NCN0lISmxkSFZ5YmlCZmJXOWtaVHNnZlZ4eVhHNGdJQ0FnYzNSaGRHbGpJSE5sZENCdGIyUmxLSFpoYkNrZ2V5QmZiVzlrWlNBOUlIWmhiRHNnZlZ4eVhHNGdJQ0FnWEhKY2JpQWdJQ0J3WVhKelpVWnliMjFUZEhKcGJtY29aRzl0VTNSeWFXNW5MQ0JqYjI1MFpXNTBWSGx3WlNBOUlDZDBaWGgwTDJoMGJXd25LU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUVSUFRWQmhjbk5sTG5CaGNuTmxLR1J2YlZOMGNtbHVaeXdnWTI5dWRHVnVkRlI1Y0dVc0lGOXRiMlJsS1R0Y2NseHVJQ0FnSUgxY2NseHVmVnh5WEc1Y2NseHVhV1lvWjJ4dlltRnNMbmRwYm1SdmR5a2dlMXh5WEc0Z0lDQWdhV1lnS0NGbmJHOWlZV3d1ZDJsdVpHOTNMa1JQVFZCaGNuTmxjaWtnZTF4eVhHNGdJQ0FnSUNBZ0lHZHNiMkpoYkM1M2FXNWtiM2N1UkU5TlVHRnljMlZ5SUQwZ1dGTkVUMDFRWVhKelpYSTdYSEpjYmlBZ0lDQWdJQ0FnWjJ4dlltRnNMbmRwYm1SdmR5NU9iMlJsUm1sc2RHVnlJRDBnV0ZORVQwMVFZWEp6WlhJdVRtOWtaVVpwYkhSbGNqdGNjbHh1SUNBZ0lIMGdaV3h6WlNCN1hISmNiaUFnSUNBZ0lDQWdaMnh2WW1Gc0xuZHBibVJ2ZHk1WVUwUlBUVkJoY25ObGNpQTlJRmhUUkU5TlVHRnljMlZ5TzF4eVhHNGdJQ0FnZlZ4eVhHNTlJR1ZzYzJVZ2UxeHlYRzRnSUNBZ2JXOWtkV3hsTG1WNGNHOXlkSE1nUFNCWVUwUlBUVkJoY25ObGNqdGNjbHh1ZlZ4eVhHNGlMQ0pqYjI1emRDQmhkSFJ5Vkc5clpWSmxaMlY0Y0NBOUlDOWVLRnRjWEhkY1hDMDZYU3NwWEZ4ektqOG9Qem9vWEZ3cWZINThYRng4ZkZ4Y1hueGNYQ1I4S1QxY1hITXFLRDg2SjN4Y0lud3BLRnRjWEhkY1hGZGRLejhwS0Q4NkozeGNJbndwS0Q4NlhGeHpLRnRwU1YwcGZDbDhLU1F2TzF4dVhHNWpiMjV6ZENCbGMyTmhjR1ZTWldkRmVIQWdQU0FvYzNSeUtTQTlQaUI3WEc0Z0lDQWdhV1lvYzNSeUlEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ0lDQmNiaUFnSUNCeVpYUjFjbTRnYzNSeUxuSmxjR3hoWTJVb0wxdGNYQzFjWEZ0Y1hGMWNYQzljWEh0Y1hIMWNYQ2hjWENsY1hDcGNYQ3RjWEQ5Y1hDNWNYRnhjWEZ4ZVhGd2tYRng4WFM5bkxDQmNJbHhjWEZ3a0psd2lLVHRjYm4xY2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQW9ZbUZ6WlNBOUlHTnNZWE56SUh0OUtTQTlQaUI3WEc0Z0lDQWdjbVYwZFhKdUlHTnNZWE56SUdWNGRHVnVaSE1nWW1GelpTQjdYRzRnSUNBZ0lDQWdJSEJoY25ObFFYUjBjbWxpZFhSbFJYaHdjbVZ6YzJsdmJpaGhkSFJ5VTNSeWFXNW5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhkSFJ5VTNSeWFXNW5JRDBnWVhSMGNsTjBjbWx1Wnk1eVpYQnNZV05sS0M5ZVhGeHpLeThzSUNjbktWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDNXlaWEJzWVdObEtDOWNYSE1ySkM4c0lDY25LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0FnYldGMFkyZ2dQU0JoZEhSeVZHOXJaVkpsWjJWNGNDNWxlR1ZqS0dGMGRISlRkSEpwYm1jcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnWVhSMGNrNWhiV1VnUFNCdFlYUmphRnN4WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCaGRIUnlUV0YwWTJoRmVIQnlaWE56YVc5dUlEMGdiV0YwWTJoYk1sMDdYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdZWFIwY2xaaGJIVmxJRDBnYldGMFkyaGJNMTA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnYlc5a2FXWnBaWElnUFNCdFlYUmphRnMwWFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVZblZwYkdSTllYUmphRlJ2YTJWdUtHRjBkSEpPWVcxbExDQmhkSFJ5VFdGMFkyaEZlSEJ5WlhOemFXOXVMQ0JoZEhSeVZtRnNkV1VzSUcxdlpHbG1hV1Z5S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdZblZwYkdSTllYUmphRlJ2YTJWdUtHNWhiV1VzSUcxaGRHTm9SWGh3Y21WemMybHZiaXdnZG1Gc2RXVXNJRzF2WkdsbWFXVnlLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZV3gxWlNBOUlHVnpZMkZ3WlZKbFowVjRjQ2gyWVd4MVpTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCemQybDBZMmdvYldGMFkyaEZlSEJ5WlhOemFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTJGelpTQW5LaWM2WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMWhkR05vUlhod2NtVnpjMmx2YmlBOUlHNWxkeUJTWldkRmVIQW9ZQ1I3ZG1Gc2RXVjlZQ3dnYlc5a2FXWnBaWElwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCallYTmxJQ2QrSnpwY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiV0YwWTJoRmVIQnlaWE56YVc5dUlEMGdibVYzSUZKbFowVjRjQ2hnS0Q4NlhGeGNYSE44WGlra2UzWmhiSFZsZlNnL09seGNYRnh6ZkNRcFlDd2diVzlrYVdacFpYSXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JqWVhObElDZDhKenBjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JXRjBZMmhGZUhCeVpYTnphVzl1SUQwZ2JtVjNJRkpsWjBWNGNDaGdYaVI3ZG1Gc2RXVjlLRDg2WEZ4Y1hDMThKQ2xnTENCdGIyUnBabWxsY2lrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTmhjMlVnSjE0bk9seHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J0WVhSamFFVjRjSEpsYzNOcGIyNGdQU0J1WlhjZ1VtVm5SWGh3S0dCZUpIdDJZV3gxWlgxZ0xDQnRiMlJwWm1sbGNpazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR05oYzJVZ0p5UW5PbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdFlYUmphRVY0Y0hKbGMzTnBiMjRnUFNCdVpYY2dVbVZuUlhod0tHQWtlM1poYkhWbGZTUmdMQ0J0YjJScFptbGxjaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSbFptRjFiSFE2SUZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZG1Gc2RXVWdQVDBnZFc1a1pXWnBibVZrS1NCMllXeDFaU0E5SUNkYlhGeGNYSGRjWEZ4Y1YxMHFQeWM3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMWhkR05vUlhod2NtVnpjMmx2YmlBOUlHNWxkeUJTWldkRmVIQW9ZRjRrZTNaaGJIVmxmU1JnTENCdGIyUnBabWxsY2lrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnVZVzFsT2lCdVlXMWxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbE9pQnRZWFJqYUVWNGNISmxjM05wYjI1Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYm4wZ0lpd2lZMjl1YzNRZ1EzVnpkRzl0UVhKeVlYa2dQU0J5WlhGMWFYSmxLQ2N1TDJOMWRHOXRMV0Z5Y21GNUxYTm9hVzB1YW5NbktUdGNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1kyeGhjM01nUTJ4aGMzTk1hWE4wSUdWNGRHVnVaSE1nUTNWemRHOXRRWEp5WVhrZ2UxeHlYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9MaTR1WVhKbmRpa2dlMXh5WEc0Z0lDQWdJQ0FnSUhOMWNHVnlLQzR1TG1GeVozWXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG05dVEyaGhibWRsSUQwZ2JuVnNiRHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCZlgzUnlhV2RuWlhKRGFHRnVaMlVvS1NCN1hISmNiaUFnSUNBZ0lDQWdhV1lvZEhsd1pXOW1JSFJvYVhNdWIyNURhR0Z1WjJVZ1BUMGdKMloxYm1OMGFXOXVKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXVRMmhoYm1kbEtIUm9hWE1wTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JqYjI1MFlXbHVjeWhwZEdWdEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWFXNWtaWGhQWmlocGRHVnRLU0FoUFQwZ0xURTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnWVdSa0tDNHVMbWwwWlcxektTQjdYSEpjYmlBZ0lDQWdJQ0FnYVhSbGJYTXVabTl5UldGamFDZ29hWFJsYlNrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXBibVJsZUU5bUtHbDBaVzBwSUQwOUlDMHhLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkIxYzJnb2FYUmxiU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1SUNBZ0lDQWdJQ0JjY2x4dUlDQWdJQ0FnSUNCcFppaHBkR1Z0Y3k1c1pXNW5kR2dnUGlBd0tTQjBhR2x6TGw5ZmRISnBaMmRsY2tOb1lXNW5aU2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lISmxiVzkyWlNndUxpNXBkR1Z0Y3lrZ2UxeHlYRzRnSUNBZ0lDQWdJR2wwWlcxekxtWnZja1ZoWTJnb0tHbDBaVzBwSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWW9kR2hwY3k1cGJtUmxlRTltS0dsMFpXMHBJQ0U5UFNBdE1Ta2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXpjR3hwWTJVb2RHaHBjeTVwYm1SbGVFOW1LR2wwWlcwcExDQXhLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ0lDQWdJRnh5WEc0Z0lDQWdJQ0FnSUdsbUtHbDBaVzF6TG14bGJtZDBhQ0ErSURBcElIUm9hWE11WDE5MGNtbG5aMlZ5UTJoaGJtZGxLQ2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2FYUmxiU2hwYm1SbGVDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdselcybHVaR1Y0WFR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjBiMmRuYkdVb2FYUmxiU3dnWm05eVkyVWdQU0IwY25WbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZb0lXWnZjbU5sS1NCeVpYUjFjbTQ3WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbU52Ym5SaGFXNXpLR2wwWlcwcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Y21WdGIzWmxLR2wwWlcwcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDlmZEhKcFoyZGxja05vWVc1blpTZ3BPMXh5WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVlXUmtLR2wwWlcwcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDlmZEhKcFoyZGxja05vWVc1blpTZ3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWEJzWVdObEtHOXNaRWwwWlcwc0lHNWxkMGwwWlcwcElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmloMGFHbHpMbWx1WkdWNFQyWW9iMnhrU1hSbGJTa2dJVDA5SUMweEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YzNCc2FXTmxLSFJvYVhNdWFXNWtaWGhQWmlodmJHUkpkR1Z0S1N3Z01Td2dibVYzU1hSbGJTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDE5MGNtbG5aMlZ5UTJoaGJtZGxLQ2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzU5SWl3aUx5b3FYSEpjYmlBcUlGTm9hVzBnZEc4Z1pXNWhZbXhsSUc1aGRHbDJaU0JoY25KaGVTQmxlSFJsYm1ScGJtY2dkMmwwYUNCbGN6WWdZMnhoYzNObGN5NWNjbHh1SUNvZ1FtRmlaV3dnWkc5bGN5QnViM1FnYzNWd2NHOXlkQ0JsZUhSbGJtUnBibWNnYm1GMGFYWmxJR05zWVhOelpYTmNjbHh1SUNvdlhISmNibVoxYm1OMGFXOXVJRU4xYzNSdmJVRnljbUY1S0NrZ2UxeHlYRzRnSUNBZ1FYSnlZWGt1WTJGc2JDaDBhR2x6S1R0Y2NseHVJQ0FnSUVGeWNtRjVMbkJ5YjNSdmRIbHdaUzV6YkdsalpTNWpZV3hzS0dGeVozVnRaVzUwY3l3Z01Da3VabTl5UldGamFDaG1kVzVqZEdsdmJpaHBkR1Z0S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1d2RYTm9LR2wwWlcwcE8xeHlYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHRjY2x4dWZWeHlYRzVjY2x4dVEzVnpkRzl0UVhKeVlYa3VjSEp2ZEc5MGVYQmxJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxPMXh5WEc1RGRYTjBiMjFCY25KaGVTNXdjbTkwYjNSNWNHVXVZMjl1YzNSeWRXTjBiM0lnUFNCRGRYTjBiMjFCY25KaGVUdGNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1EzVnpkRzl0UVhKeVlYazdJaXdpWTI5dWMzUWdSV3hsYldWdWRDQTlJSEpsY1hWcGNtVW9KeTR2Wld4bGJXVnVkQzVxY3ljcE8xeHlYRzVqYjI1emRDQlVjbVZsVjJGc2EyVnlJRDBnY21WeGRXbHlaU2duTGk5MGNtVmxMWGRoYkd0bGNpNXFjeWNwTGxSeVpXVlhZV3hyWlhJN1hISmNibHh5WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdOc1lYTnpJRVJ2WTNWdFpXNTBJR1Y0ZEdWdVpITWdSV3hsYldWdWRIdGNjbHh1SUNBZ0lHTnZibk4wY25WamRHOXlLR052Ym5SbGJuUlVlWEJsTENCa2IyTlVlWEJsS1NCN1hISmNiaUFnSUNBZ0lDQWdjM1Z3WlhJb0p5TmtiMk4xYldWdWRDY3NJRGtwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WTI5dWRHVnVkRlI1Y0dVZ1BTQmpiMjUwWlc1MFZIbHdaVHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbVJ2WTNSNWNHVWdQU0JrYjJOVWVYQmxPMXh5WEc0Z0lDQWdJQ0FnSUZ4eVhHNGdJQ0FnSUNBZ0lHUmxiR1YwWlNCMGFHbHpMbU5zWVhOelRHbHpkRHRjY2x4dUlDQWdJQ0FnSUNCa1pXeGxkR1VnZEdocGN5NWhkSFJ5YVdKMWRHVnpPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdkbGRDQnBibTVsY2toVVRVd29LU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhWdVpHVm1hVzVsWkR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnpaWFFnYVc1dVpYSklWRTFNS0haaGJDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIxYm1SbFptbHVaV1E3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1oyVjBJRzkxZEdWeVNGUk5UQ2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RXNWtaV1pwYm1Wa08xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSE5sZENCdmRYUmxja2hVVFV3b2RtRnNLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhWdVpHVm1hVzVsWkR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQm5aWFFnWkc5amRXMWxiblJGYkdWdFpXNTBLQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbU5vYVd4a2NtVnVXekJkSUh4OElHNTFiR3c3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1lYQndaVzVrUTJocGJHUW9ZMmhwYkdST2IyUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWW9kR2hwY3k1amFHbHNaRTV2WkdWekxteGxibWQwYUNBK0lEQXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFBibXg1SUc5dVpTQmphR2xzWkNCdWIyUmxJR2x6SUdGc2JHOTNaV1FnYjI0Z1pHOWpkVzFsYm5RdUp5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J6ZFhCbGNpNWhjSEJsYm1SRGFHbHNaQ2hqYUdsc1pFNXZaR1VwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHTnlaV0YwWlVWc1pXMWxiblFvZEdGblRtRnRaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCdVpYY2dSV3hsYldWdWRDaDBZV2RPWVcxbExDQXhLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCamNtVmhkR1ZVWlhoMFRtOWtaU2hqYjI1MFpXNTBLU0I3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJSFJoWnlBOUlDQnVaWGNnUld4bGJXVnVkQ2duSTNSbGVIUW5MQ0F6S1R0Y2NseHVJQ0FnSUNBZ0lDQjBZV2N1ZEdWNGRFTnZiblJsYm5RZ1BTQmpiMjUwWlc1ME8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdGbk8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ1hISmNiaUFnSUNCamNtVmhkR1ZEUkVGVVFWTmxZM1JwYjI0b1kyOXVkR1Z1ZENrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCMFlXY2dQU0J1WlhjZ1JXeGxiV1Z1ZENnblkyUmhkR0V0YzJWamRHbHZiaWNzSURRcE8xeHlYRzRnSUNBZ0lDQWdJSFJoWnk1MFpYaDBRMjl1ZEdWdWRDQTlJR052Ym5SbGJuUTdYSEpjYmlBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSaFp6dGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lGeHlYRzRnSUNBZ1kzSmxZWFJsUTI5dGJXVnVkQ2hqYjI1MFpXNTBLU0I3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJSFJoWnlBOUlHNWxkeUJGYkdWdFpXNTBLQ2NqWTI5dGJXVnVkQ2NzSURncE8xeHlYRzRnSUNBZ0lDQWdJSFJoWnk1MFpYaDBRMjl1ZEdWdWRDQTlJR052Ym5SbGJuUTdYSEpjYmlBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSaFp6dGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lGeHlYRzRnSUNBZ1kzSmxZWFJsVkhKbFpWZGhiR3RsY2loeWIyOTBMQ0IzYUdGMFZHOVRhRzkzTENCbWFXeDBaWElwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2JtVjNJRlJ5WldWWFlXeHJaWElvY205dmRDd2dkMmhoZEZSdlUyaHZkeXdnWm1sc2RHVnlLVHRjY2x4dUlDQWdJSDFjY2x4dWZUc2lMQ0pqYjI1emRDQkZiR1Z0Wlc1MElEMGdjbVZ4ZFdseVpTZ25MaTlsYkdWdFpXNTBMbXB6SnlrN1hISmNibU52Ym5OMElFUnZZM1Z0Wlc1MElDQTlJSEpsY1hWcGNtVW9KeTR2Wkc5amRXMWxiblF1YW5NbktUdGNjbHh1WTI5dWMzUWdkbTlwWkVWc1pXMWxiblJ6SUQwZ2NtVnhkV2x5WlNoY0lpNHZkbTlwWkMxbGJHVnRaVzUwY3k1cWMxd2lLVHRjY2x4dVhISmNibU52Ym5OMElIUmxlSFJQYm14NVJXeGxiV1Z1ZEhNZ1BTQmJYSEpjYmlBZ0lDQW5jMk55YVhCMEp5eGNjbHh1SUNBZ0lDZHpkSGxzWlNkY2NseHVYVHRjY2x4dVhISmNibU52Ym5OMElHOXdaVzVVWVdkU1pXZGxlQ0E5SUNjOEtGdGNYRnhjZDF4Y1hGd3RPbDByS1NoYlhGeGNYSGRjWEZ4Y1YxMHFQeWtvWEZ4Y1hDOThLVDRuTzF4eVhHNWpiMjV6ZENCamJHOXpaVlJoWjFKbFoyVjRJRDBnSnp4YlhGeGNYSE5kS2o5Y1hDOWJYRnhjWEhOZEtqOG9XMXhjWEZ4M1hGeGNYQzA2WFNzcFcxeGNYRnh6WFNvL1BpYzdYSEpjYm1OdmJuTjBJSFJsZUhSU1pXZGxlQ0E5SUNjb1hsdGVQRjByS1NjN1hISmNibU52Ym5OMElHTnZiVzFsYm5SU1pXZGxlSEFnUFNBblBDRXRMU2hiWEZ4Y1hIZGNYRnhjVjEwcVB5a3RMVDRuTzF4eVhHNWpiMjV6ZENCalpHRjBZVkpsWjJWNGNDQTlJQ2M4WEZ4Y1hDRmNYRnhjVzBORVFWUkJYRnhjWEZzb1cxeGNYRngzWEZ4Y1hGZGRLajhwWEZ4Y1hGMWNYRnhjWFQ0bk8xeHlYRzVjY2x4dVkyOXVjM1FnY0dGeWMyVlNaV2RsZUNBOUlHNWxkeUJTWldkRmVIQW9KeWcvT2ljZ0t5QmJYSEpjYmlBZ0lDQnZjR1Z1VkdGblVtVm5aWGdzWEhKY2JpQWdJQ0JqYkc5elpWUmhaMUpsWjJWNExGeHlYRzRnSUNBZ2RHVjRkRkpsWjJWNExGeHlYRzRnSUNBZ1kyOXRiV1Z1ZEZKbFoyVjRjQ3hjY2x4dUlDQWdJR05rWVhSaFVtVm5aWGh3WEhKY2JsMHVhbTlwYmlnbmZDY3BJQ3NuS1Njc0lDZHBKeWs3WEhKY2JseHlYRzVqYjI1emRDQmhkSFJ5VW1WblpYZ2dQU0F2S0Q4NktGdGNYSGRjWEMwNlhTc3BQU2cvT2x3aWZDY3BLRnRjWEhkY1hGZGRLajhwS0Q4NlhDSjhKeWw4S0Z0Y1hIZGNYQzA2WFNzcEtTOW5PMXh5WEc1Y2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQmpiR0Z6Y3lCRVQwMVFZWEp6WlNCN1hISmNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaGtiMjFUZEhKcGJtY3NJR052Ym5SbGJuUlVlWEJsSUQwZ0ozUmxlSFF2YUhSdGJDY3NJRzF2WkdVZ1BTQW5iVzlrWlhKaGRHVW5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVrYjIxVGRISnBibWNnUFNCa2IyMVRkSEpwYm1jN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1amIyNTBaVzUwVkhsd1pTQTlJR052Ym5SbGJuUlVlWEJsTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11Ylc5a1pTQTlJRzF2WkdVN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1a2IyTjFiV1Z1ZENBOUlIUm9hWE11WTNKbFlYUmxSRzlqZFcxbGJuUk9iMlJsS0NrN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1MFlXZFRaWEYxWlc1alpTQTlJRnRkTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11Y0dGeWMyVkpkR1Z5WVhSdmNpQTlJREE3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSGRvYVd4bEtIUm9hWE11Y0dGeWMyVkpkR1Z5WVhSdmNpQThJSFJvYVhNdVpHOXRVM1J5YVc1bkxteGxibWQwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkJoY25ObFNYUmxjbUYwYVc5dUtDazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lITjBZWFJwWXlCd1lYSnpaU2h6ZEhKcGJtY3NJR052Ym5SbGJuUlVlWEJsSUQwZ0ozUmxlSFF2YUhSdGJDY3NJRzF2WkdVZ1BTQW5iVzlrWlhKaGRHVW5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJR2x1YzNSaGJtTmxJRDBnYm1WM0lIUm9hWE1vYzNSeWFXNW5MQ0JqYjI1MFpXNTBWSGx3WlN3Z2JXOWtaU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnBibk4wWVc1alpTNWtiMk4xYldWdWREdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JqY21WaGRHVkViMk4xYldWdWRFNXZaR1VvS1NCN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUdSdlkxUjVjR1VnUFNBbkp6dGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVqYjI1MFpXNTBWSGx3WlNBOVBTQW5kR1Y0ZEM5b2RHMXNKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrYjJOVWVYQmxJRDBnSnp3aFJFOURWRmxRUlNCb2RHMXNQaWM3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1a2IyMVRkSEpwYm1jZ1BTQjBhR2x6TG1SdmJWTjBjbWx1Wnk1eVpYQnNZV05sS0M4OElVUlBRMVJaVUVWYlhGeDNYRnhYWFNvL1BpOXBMQ0FvYldGMFkyZ3BJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHUnZZMVI1Y0dVZ1BTQnRZWFJqYUR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBbkp6dGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJR2xtSUNoMGFHbHpMbU52Ym5SbGJuUlVlWEJsSUQwOUlDZDBaWGgwTDNodGJDY3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaRzlqVkhsd1pTQTlJQ2M4UDNodGJDQjJaWEp6YVc5dVBWd2lNUzR3WENJL1BpYzdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Wkc5dFUzUnlhVzVuSUQwZ2RHaHBjeTVrYjIxVGRISnBibWN1Y21Wd2JHRmpaU2d2UEZ4Y1AzaHRiRnRjWEhkY1hGZGRLajljWEQ4K0wya3NJQ2h0WVhSamFDa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHOWpWSGx3WlNBOUlHMWhkR05vTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUNjbk8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNjbHh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0oxVnVjM1Z3Y0c5eWRHVmtJR052Ym5SbGJuUWdkSGx3WlM0bktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVpHOXRVM1J5YVc1bklEMGdkR2hwY3k1a2IyMVRkSEpwYm1jdWNtVndiR0ZqWlNndlhseGNjeXN2TENBbkp5bGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0wxeGNjeXNrTHl3Z0p5Y3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnWkc5aklEMGdibVYzSUVSdlkzVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtTnZiblJsYm5SVWVYQmxMQ0JrYjJOVWVYQmxLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHUnZZenRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCd1lYSnpaVUYwZEhKVGRISnBibWNvWVhSMGNsTjBjbWx1WnlrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCaGRIUnlUV0Z3SUQwZ2UzMDdYSEpjYmlBZ0lDQWdJQ0FnYkdWMElHMWhkR05vTzF4eVhHNGdJQ0FnSUNBZ0lIZG9hV3hsS0NodFlYUmphQ0E5SUdGMGRISlNaV2RsZUM1bGVHVmpLR0YwZEhKVGRISnBibWNwS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdZWFIwY2s1aGJXVWdQU0FvYldGMFkyaGJNVjBnZkh3Z2JXRjBZMmhiTTEwcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdZWFIwY2xaaGJDQTlJRzFoZEdOb1d6SmRPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWVhSMGNrMWhjRnRoZEhSeVRtRnRaVjBnUFNCaGRIUnlWbUZzTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdGMGRISk5ZWEE3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0JjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZ1EyOXVkbVZ5ZEhNZ2RHRm5JRzVoYldWeklHRnVaQ0JoZEhSeWFXSjFkR1VnYm1GdFpYTWdkRzhnZEdobElIQnliM0JsY2lCbWIzSnRZWFFnWVdOamIzSmthVzVuWEhKY2JpQWdJQ0FnS2lCMGJ5QjBhR1VnWkc5amRXMWxiblFnWTI5dWRHVnVkQ0IwZVhCbExpQkpaaUIwYUdVZ1kyOXVkR1Z1ZENCMGVYQmxJR2x6SUhSbGVIUXZlRzFzSUhSb1pTQjBZV2RjY2x4dUlDQWdJQ0FxSUc1aGJXVnpJR0Z1WkNCaGRIUnlhV0oxZEdWeklIZHBiR3dnWW1VZ2JHVm1kQ0IxYm5SdmRXTm9aV1FnYjNSb1pYSjNhWE5sSUhSb1pYa2dkMmxzYkNCaVpTQmpiMjUyWlhKMFpXUmNjbHh1SUNBZ0lDQXFJSFJ2SUd4dmQyVnlJR05oYzJVZ2MzUnlhVzVuYzF4eVhHNGdJQ0FnSUNvZ1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjMwZ2RIbHdaVnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDhUMkpxWldOMGZTQjJZV3hjY2x4dUlDQWdJQ0FxSUZ4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5Ym5NZ2UzTjBjbWx1WjN4UFltcGxZM1I5WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUdOdmJuUmxiblJVZVhCbFEyOXRjR0YwYVdKc1pTaDBlWEJsTENCMllXd3BJSHRjY2x4dUlDQWdJQ0FnSUNCcFppaDBhR2x6TG1OdmJuUmxiblJVZVhCbElEMDlJQ2QwWlhoMEwyaDBiV3duSUNZbUlIWmhiQ0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lITjNhWFJqYUNoMGVYQmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCallYTmxJQ2QwWVdkT1lXMWxKenBjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RtRnNMblJ2VEc5M1pYSkRZWE5sS0NrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpZWE5sSUNkaGRIUnlhV0oxZEdWekp6cGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdZWFIwY2t4cGMzUWdQU0I3ZlR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtYjNJb2JHVjBJR3RsZVNCcGJpQjJZV3dwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1lYUjBja3hwYzNSYmEyVjVMblJ2VEc5M1pYSkRZWE5sS0NsZElEMGdkbUZzVzJ0bGVWMDdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJoZEhSeVRHbHpkRHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSbFptRjFiSFE2WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIWmhiRHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQmNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkbUZzTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lIQmhjbk5sU1hSbGNtRjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCa2IyMVRkSEpwYm1jZ1BTQjBhR2x6TG1SdmJWTjBjbWx1Wnk1emJHbGpaU2gwYUdsekxuQmhjbk5sU1hSbGNtRjBiM0lwTzF4eVhHNGdJQ0FnSUNBZ0lHeGxkQ0J0WVhSamFDQTlJSEJoY25ObFVtVm5aWGd1WlhobFl5aGtiMjFUZEhKcGJtY3BPMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaHRZWFJqYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppaHRZWFJqYUM1cGJtUmxlQ0FoUFQwZ01Da2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1pHbHpjR3hoZVNCM1lYSnVhVzVuSUhkb1pXNGdjMnRwY0hCcGJtY2dkVzVrWldacGJtVmtJR1J2YlNCbGVIQnlaWE56YVc5dWMxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiR1YwSUhCaGNuTmxSWEp5YjNJZ1BTQnVaWGNnUlhKeWIzSW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1lFTmhibTV2ZENCd1lYSnpaU0JjWEdBa2UyUnZiVk4wY21sdVp5NXpiR2xqWlNnd0xDQnRZWFJqYUM1cGJtUmxlQ2xjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvTDE1Y1hITXJMeXdnSnljcFhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDNXlaWEJzWVdObEtDOWNYSE1ySkM4c0lDY25LWDFjWEdBdVlDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MzZHBkR05vS0hSb2FYTXViVzlrWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOaGMyVWdKM04wY21samRDYzZYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvY205M0lIQmhjbk5sUlhKeWIzSTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1kyRnpaU0FuYlc5a1pYSmhkR1VuT2x4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG5kaGNtNG9jR0Z5YzJWRmNuSnZjaWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkJoY25ObFNYUmxjbUYwYjNJZ0t6MGdiV0YwWTJndWFXNWtaWGdnS3lCdFlYUmphRnN3WFM1c1pXNW5kR2c3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdkR0ZuVG1GdFpTQTlJSFJvYVhNdVkyOXVkR1Z1ZEZSNWNHVkRiMjF3WVhScFlteGxLQ2QwWVdkT1lXMWxKeXdnYldGMFkyaGJNVjBwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ1lYUjBjbWxpZFhSbGN5QTlJSFJvYVhNdVkyOXVkR1Z1ZEZSNWNHVkRiMjF3WVhScFlteGxLQ2RoZEhSeWFXSjFkR1Z6Snl4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Y0dGeWMyVkJkSFJ5VTNSeWFXNW5LRzFoZEdOb1d6SmRLU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCcGMxTmxiR1pEYkc5emFXNW5JRDBnUW05dmJHVmhiaWh0WVhSamFGc3pYU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCamJHOXpaVlJoWjA1aGJXVWdQU0IwYUdsekxtTnZiblJsYm5SVWVYQmxRMjl0Y0dGMGFXSnNaU2duZEdGblRtRnRaU2NzSUcxaGRHTm9XelJkS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElIUmxlSFFnUFNCdFlYUmphRnMxWFR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElHTnZiVzFsYm5RZ1BTQnRZWFJqYUZzMlhUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJR05rWVhSaElEMGdiV0YwWTJoYk4xMDdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ2NHRnlaVzUwVkdGbklEMGdkR2hwY3k1MFlXZFRaWEYxWlc1alpWdDBhR2x6TG5SaFoxTmxjWFZsYm1ObExteGxibWQwYUNBdElERmRJSHg4WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbVJ2WTNWdFpXNTBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIUmxlSFFwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJSFJsZUhRZ2JtOWtaVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElIUmhaeUE5SUc1bGR5QkZiR1Z0Wlc1MEtDY2pkR1Y0ZENjc0lETXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdGbkxuUmxlSFJEYjI1MFpXNTBJRDBnZEdWNGREdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd1lYSmxiblJVWVdjdVlYQndaVzVrUTJocGJHUW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHRm5YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hSaFowNWhiV1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRzl3Wlc0Z1pHOXRJR1ZzWlcxbGJuUmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR3hsZENCMFlXY2dQU0J1WlhjZ1JXeGxiV1Z1ZENoMFlXZE9ZVzFsTENBeExDQmhkSFJ5YVdKMWRHVnpLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWW9kR1Y0ZEU5dWJIbEZiR1Z0Wlc1MGN5NXBibVJsZUU5bUtIUmhaMDVoYldVdWRHOU1iM2RsY2tOaGMyVW9LU2tnSVQwZ0xURXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNaWFFnZEdWNGRFOXViSGxGZUhBZ1BTQnVaWGNnVW1WblJYaHdLR0FvVzF4Y1hGeDNYRnhjWEZkZEtqOHBQRnhjWEZ3dkpIdDBZV2RPWVcxbGZUNWdLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNaWFFnWkc5dFUzUnlhVzVuSUQwZ2RHaHBjeTVrYjIxVGRISnBibWN1YzJ4cFkyVW9kR2hwY3k1d1lYSnpaVWwwWlhKaGRHOXlLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNaWFFnYldGMFkyZ2dQU0IwWlhoMFQyNXNlVVY0Y0M1bGVHVmpLR1J2YlZOMGNtbHVaeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lvYldGMFkyZ3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdGbkxuUmxlSFJEYjI1MFpXNTBJRDBnYldGMFkyaGJNVjA3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjR0Z5YzJWSmRHVnlZWFJ2Y2lBclBTQnRZWFJqYUM1cGJtUmxlQ0FySUcxaGRHTm9XekJkTG14bGJtZDBhRHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjR0Z5Wlc1MFZHRm5MbUZ3Y0dWdVpFTm9hV3hrS0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJoWjF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppZ2hhWE5UWld4bVEyeHZjMmx1WnlBbUpseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhadmFXUkZiR1Z0Wlc1MGN5NXBibVJsZUU5bUtIUmhaMDVoYldVdWRHOU1iM2RsY2tOaGMyVW9LU2tnUFQwZ0xURWdKaVpjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBaWGgwVDI1c2VVVnNaVzFsYm5SekxtbHVaR1Y0VDJZb2RHRm5UbUZ0WlM1MGIweHZkMlZ5UTJGelpTZ3BLU0E5UFNBdE1Ta2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5SaFoxTmxjWFZsYm1ObExuQjFjMmdvZEdGbktUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb1kyeHZjMlZVWVdkT1lXMWxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdkx5QmpiRzl6WlNCMFlXY2dibUZ0WlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdkSEp2ZHlCbGVHTmxjSFJwYjI0Z2FXWWdiM0JsYm1Wa0lHRnVaQ0JqYkc5elpTQjBZV2R6SUdSdklHNXZkQ0J0WVhSamFGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUc5d1pXNVVZV2NnUFNCMGFHbHpMblJoWjFObGNYVmxibU5sTG5CdmNDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZb2RHaHBjeTV0YjJSbElDRTlQU0FuYzNSeWFXTjBKeWtnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppZ2hiM0JsYmxSaFp5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ1hGeGdKSHRqYkc5elpWUmhaMDVoYldWOVhGeGdJR2hoY3lCdWJ5QnZjR1Z1SUhSaFp5QmtaV1pwYm1sMGFXOXVMbUFwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUtHTnNiM05sVkdGblRtRnRaU0FoUFNCdmNHVnVWR0ZuTG5SaFowNWhiV1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZRnhjWUNSN2IzQmxibFJoWnk1MFlXZE9ZVzFsZlZ4Y1lDQnBjeUJ1YjNRZ2NISnZjR1Z5YkhrZ1kyeHZjMlZrTG1BcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR052YlcxbGJuUWdJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiR1YwSUhSaFp5QTlJRzVsZHlCRmJHVnRaVzUwS0NjalkyOXRiV1Z1ZENjc0lEZ3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdGbkxuUmxlSFJEYjI1MFpXNTBJRDBnWTI5dGJXVnVkRHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndZWEpsYm5SVVlXY3VZWEJ3Wlc1a1EyaHBiR1FvZEdGbktUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaGpaR0YwWVNBaFBUMGdkVzVrWldacGJtVmtLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdkR0ZuSUQwZ2JtVjNJRVZzWlcxbGJuUW9KMk5rWVhSaExYTmxZM1JwYjI0bkxDQTBLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSaFp5NTBaWGgwUTI5dWRHVnVkQ0E5SUdOa1lYUmhPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY0dGeVpXNTBWR0ZuTG1Gd2NHVnVaRU5vYVd4a0tIUmhaeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ2NISmxkbWxsZDFOMFlYSjBJRDBnZEdocGN5NXdZWEp6WlVsMFpYSmhkRzl5SUMwZ01UQTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0J3Y21WMmFXVjNSVzVrSUQwZ2RHaHBjeTV3WVhKelpVbDBaWEpoZEc5eUlDc2dNVEE3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdWVzVoWW14bElIUnZJSEJoY25ObElHUnZiU0J6ZEhKcGJtY2dibVZoY2lCY1hHQWtlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWtiMjFUZEhKcGJtY3VjMnhwWTJVb2NISmxkbWxsZDFOMFlYSjBJRDRnTUQ4Z2NISmxkbWxsZDFOMFlYSjBPaUF3TENCd2NtVjJhV1YzUlc1a0lEdzlJSFJvYVhNdVpHOXRVM1J5YVc1bkxteGxibWQwYUQ4Z2NISmxkbWxsZDBWdVpEb2dkR2hwY3k1a2IyMVRkSEpwYm1jdWJHVnVaM1JvSUMwZ01TbGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeGNZR0FwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lIMWNjbHh1ZlRzaUxDSmpiMjV6ZENCRGJHRnpjMHhwYzNRZ1BTQnlaWEYxYVhKbEtDY3VMMk5zWVhOekxXeHBjM1F1YW5NbktUdGNjbHh1WTI5dWMzUWdVWFZsY25sVFpXeGxZM1JoWW14bElEMGdjbVZ4ZFdseVpTZ25MaTl4ZFdWeWVTMXpaV3hsWTNSaFlteGxMbXB6SnlrN1hISmNibU52Ym5OMElIWnZhV1JGYkdWdFpXNTBjeUE5SUhKbGNYVnBjbVVvWENJdUwzWnZhV1F0Wld4bGJXVnVkSE11YW5OY0lpazdYSEpjYmx4eVhHNWpiMjV6ZENCRWIyTjFiV1Z1ZENBOUlDZ3BJRDArSUh0Y2NseHVJQ0FnSUM4dklIVnpaU0IzYUdWdUlHUmxiV0Z1WkdWa1hISmNiaUFnSUNBdkx5QjBieUJvWVc1a2JHVWdZMmx5WTNWc1lYSWdaR1Z3Wlc1a1pXNWphV1Z6WEhKY2JpQWdJQ0J5WlhSMWNtNGdjbVZ4ZFdseVpTZ25MaTlrYjIwdGNHRnljMlVuS1R0Y2NseHVmVHRjY2x4dVhISmNibU52Ym5OMElFUnZZM1Z0Wlc1MFRtOWtaU0E5SUNncElEMCtJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQnlaWEYxYVhKbEtDY3VMMlJ2WTNWdFpXNTBMbXB6SnlrN1hISmNibjA3WEhKY2JseHlYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR05zWVhOeklFVnNaVzFsYm5RZ1pYaDBaVzVrY3lCUmRXVnllVk5sYkdWamRHRmliR1VnZTF4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tseHlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlHNWhiV1ZjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYazhUMkpxWldOMFBGTjBjbWx1Wnl4VGRISnBibWMrUG4wZ1lYUjBjbWxpZFhSbGMxeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh1WVcxbExDQjBlWEJsSUQwZ01Td2dZWFIwY21saWRYUmxjeUE5SUh0OUtTQjdYSEpjYmlBZ0lDQWdJQ0FnYzNWd1pYSW9LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1dWIyUmxWSGx3WlNBOUlIUjVjR1VnZkh3Z01UdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV1YjJSbFRtRnRaU0E5WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRHRm5UbUZ0WlNBOUlHNWhiV1U3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVlYUjBjbWxpZFhSbGN5QTlJR0YwZEhKcFluVjBaWE03WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVqYUdsc1pFNXZaR1Z6SUQwZ1cxMDdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXdZWEpsYm5ST2IyUmxJRDBnYm5Wc2JEdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxtTnNZWE56VEdsemRDQTlJRzVsZHlCRGJHRnpjMHhwYzNRb0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWDNCdmNIVnNZWFJsUTJ4aGMzTk1hWE4wS0NrN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1amJHRnpjMHhwYzNRdWIyNURhR0Z1WjJVZ1BTQjBhR2x6TGw5ZmRYQmtZWFJsUTJ4aGMzTkJkSFJ5TG1KcGJtUW9kR2hwY3lrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdYMTl3YjNCMWJHRjBaVU5zWVhOelRHbHpkQ2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG1Oc1lYTnpUR2x6ZEM1emNHeHBZMlVvTUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUtFSnZiMnhsWVc0b2RHaHBjeTVoZEhSeWFXSjFkR1Z6TG1Oc1lYTnpLU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ1kzTnpRMnhoYzNObGN5QTlJSFJvYVhNdVlYUjBjbWxpZFhSbGN5NWpiR0Z6Y3k1emNHeHBkQ2d2WEZ4ekx5azdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYzNORGJHRnpjMlZ6TG1admNrVmhZMmdvS0dOemMwTnNZWE56S1NBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtTnNZWE56VEdsemRDNWhaR1FvWTNOelEyeGhjM01wTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnWDE5MWNHUmhkR1ZEYkdGemMwRjBkSElvWTJ4aGMzTk1hWE4wS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1aGRIUnlhV0oxZEdWekxtTnNZWE56SUQwZ1kyeGhjM05NYVhOMExtcHZhVzRvSnlBbktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JuWlhRZ2NHRnlaVzUwUld4bGJXVnVkQ2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV3WVhKbGJuUk9iMlJsTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnWEhKY2JpQWdJQ0JuWlhRZ2IzZHVaWEpFYjJOMWJXVnVkQ2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnYm05a1pTQTlJSFJvYVhNN1hISmNiaUFnSUNBZ0lDQWdYSEpjYmlBZ0lDQWdJQ0FnWkc4Z2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppaHViMlJsSUdsdWMzUmhibU5sYjJZZ1JHOWpkVzFsYm5ST2IyUmxLQ2twSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCdWIyUmxPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnZlNCM2FHbHNaU2dvYm05a1pTQTlJRzV2WkdVdWNHRnlaVzUwVG05a1pTa3BPMXh5WEc0Z0lDQWdJQ0FnSUZ4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdkbGRDQmphR2xzWkhKbGJpZ3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWphR2xzWkU1dlpHVnpMbVpwYkhSbGNpZ29ibTlrWlNrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2JtOWtaUzV1YjJSbFZIbHdaU0E5UFQwZ01UdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQm5aWFFnYjNWMFpYSklWRTFNS0NrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCb2RHMXNJRDBnSnljN1hISmNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVibTlrWlZSNWNHVWdQVDBnTXlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCb2RHMXNJQ3M5SUhSb2FYTXVkR1Y0ZEVOdmJuUmxiblE3WEhKY2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUtIUm9hWE11Ym05a1pWUjVjR1VnUFQwZ09Da2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQm9kRzFzSUNzOUlHQThJUzB0Skh0MGFHbHpMblJsZUhSRGIyNTBaVzUwZlMwdFBtQTdYSEpjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJR2xtS0hSb2FYTXVibTlrWlZSNWNHVWdQVDBnTkNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCb2RHMXNJQ3M5SUdBOElWdERSRUZVUVZza2UzUm9hWE11ZEdWNGRFTnZiblJsYm5SOVhWMCtZRHRjY2x4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JvZEcxc0lDczlJR0E4Skh0MGFHbHpMblJoWjA1aGJXVjlJR0E3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1p2Y2loc1pYUWdhMlY1SUdsdUlIUm9hWE11WVhSMGNtbGlkWFJsY3lrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lvZEdocGN5NWhkSFJ5YVdKMWRHVnpMbWhoYzA5M2JsQnliM0JsY25SNUtHdGxlU2twSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvZEcxc0lDczlJR3RsZVR0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWW9kR2hwY3k1aGRIUnlhV0oxZEdWelcydGxlVjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FIUnRiQ0FyUFNCZ1BWd2lKSHQwYUdsekxtRjBkSEpwWW5WMFpYTmJhMlY1WFgxY0ltQTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQm9kRzFzSUNzOUlDY2dKenRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FIUnRiQ0E5SUdoMGJXd3VjbVZ3YkdGalpTZ3ZYRnh6S3lRdkxDQW5KeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtS0hadmFXUkZiR1Z0Wlc1MGN5NXBibVJsZUU5bUtIUm9hWE11ZEdGblRtRnRaU2tnUFQwZ0xURXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdoMGJXd2dLejBnWUQ0a2UzUm9hWE11YVc1dVpYSklWRTFNZlR3dkpIdDBhR2x6TG5SaFowNWhiV1Y5UG1BN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCb2RHMXNJQ3M5SUNjZ0x6NG5PMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhSFJ0YkR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnpaWFFnYjNWMFpYSklWRTFNS0haaGJDa2dlMXh5WEc0Z0lDQWdJQ0FnSUdsbUtIUm9hWE11Y0dGeVpXNTBUbTlrWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdaRzlqSUQwZ1JHOWpkVzFsYm5Rb0tTNXdZWEp6WlNoZ1BISnZiM1ErSkh0MllXeDlQQzl5YjI5MFBtQXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnYm05a1pYTWdQU0JrYjJNdVpHOWpkVzFsYm5SRmJHVnRaVzUwTG1Ob2FXeGtUbTlrWlhNN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjR0Z5Wlc1MFRtOWtaUzVqYUdsc1pFNXZaR1Z6TG5Od2JHbGpaU2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjR0Z5Wlc1MFRtOWtaUzVqYUdsc1pFNXZaR1Z6TG1sdVpHVjRUMllvZEdocGN5a3NJREVzSUM0dUxtNXZaR1Z6S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRzV2WkdWekxtWnZja1ZoWTJnb0tHNXZaR1VwSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzV2WkdWekxuQmhjbVZ1ZEU1dlpHVWdQU0IwYUdsekxuQmhjbVZ1ZEU1dlpHVTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnpaWFFnZEdWNGRFTnZiblJsYm5Rb2RtRnNLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWW9kR2hwY3k1dWIyUmxWSGx3WlNBOVBTQXpJSHg4SUhSb2FYTXVibTlrWlZSNWNHVWdQVDBnT0NCOGZDQjBhR2x6TG01dlpHVlVlWEJsSUQwOUlEUXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmRHVjRkRU52Ym5SbGJuUWdQU0IyWVd3N1hISmNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJSFJoWnlBOUlHNWxkeUJGYkdWdFpXNTBLQ2NqZEdWNGRDY3NJRE1wTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwWVdjdWRHVjRkRU52Ym5SbGJuUWdQU0IyWVd3N1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVZMmhwYkdST2IyUmxjeUE5SUZ0MFlXZGRPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQm5aWFFnZEdWNGRFTnZiblJsYm5Rb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZb2RHaHBjeTV1YjJSbFZIbHdaU0E5UFNBeklIeDhJSFJvYVhNdWJtOWtaVlI1Y0dVZ1BUMGdPQ0I4ZkNCMGFHbHpMbTV2WkdWVWVYQmxJRDA5SURRcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM1JsZUhSRGIyNTBaVzUwSUh4OElDY25PMXh5WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCMFpYaDBJRDBnSnljN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMTluWlhSVVpYaDBUbTlrWlhNb2RHaHBjeWt1Wm05eVJXRmphQ2dvYm05a1pTa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHVjRkQ0FyUFNCdWIyUmxMblJsZUhSRGIyNTBaVzUwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCMFpYaDBPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnWjJWMElHbHVibVZ5U0ZSTlRDZ3BJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdhVzV1WlhKSWRHMXNJRDBnSnljN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1amFHbHNaRTV2WkdWekxtWnZja1ZoWTJnb0tHNXZaR1VwSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXNXVaWEpJZEcxc0lDczlJRzV2WkdVdWIzVjBaWEpJVkUxTU8xeHlYRzRnSUNBZ0lDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhVzV1WlhKSWRHMXNPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhObGRDQnBibTVsY2toVVRVd29kbUZzS1NCN1hISmNiaUFnSUNBZ0lDQWdkbUZ5SUdSdll5QTlJRVJ2WTNWdFpXNTBLQ2t1Y0dGeWMyVW9ZRHh5YjI5MFBpUjdkbUZzZlR3dmNtOXZkRDVnS1R0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG1Ob2FXeGtUbTlrWlhNZ1BTQmJYVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdaRzlqTG1SdlkzVnRaVzUwUld4bGJXVnVkQzVqYUdsc1pFNXZaR1Z6TG1admNrVmhZMmdvS0c1dlpHVXBJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWhjSEJsYm1SRGFHbHNaQ2h1YjJSbEtUdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUZ4eVhHNGdJQ0FnWjJWMElIQnlaWFpwYjNWelJXeGxiV1Z1ZEZOcFlteHBibWNvS1NCN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUhCaGNtVnVkQ0E5SUhSb2FYTXVjR0Z5Wlc1MFJXeGxiV1Z1ZER0Y2NseHVJQ0FnSUNBZ0lDQnBaaWh3WVhKbGJuUXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIQmhjbVZ1ZEM1amFHbHNaSEpsYmx0d1lYSmxiblF1WTJocGJHUnlaVzR1YVc1a1pYaFBaaWgwYUdsektTQXRJREZkSUh4OElHNTFiR3c3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJRnh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ1ZFd4c08xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ1hISmNiaUFnSUNCblpYUWdjSEpsZG1sdmRYTlRhV0pzYVc1bktDa2dlMXh5WEc0Z0lDQWdJQ0FnSUd4bGRDQndZWEpsYm5RZ1BTQjBhR2x6TG5CaGNtVnVkRVZzWlcxbGJuUTdYSEpjYmlBZ0lDQWdJQ0FnYVdZb2NHRnlaVzUwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJ3WVhKbGJuUXVZMmhwYkdST2IyUmxjMXR3WVhKbGJuUXVZMmhwYkdST2IyUmxjeTVwYm1SbGVFOW1LSFJvYVhNcElDMGdNVjBnZkh3Z2JuVnNiRHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRzUxYkd3N1hISmNiaUFnSUNCOVhISmNiaUFnSUNCY2NseHVJQ0FnSUdkbGRDQnVaWGgwUld4bGJXVnVkRk5wWW14cGJtY29LU0I3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJSEJoY21WdWRDQTlJSFJvYVhNdWNHRnlaVzUwUld4bGJXVnVkRHRjY2x4dUlDQWdJQ0FnSUNCcFppaHdZWEpsYm5RcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhCaGNtVnVkQzVqYUdsc1pISmxibHR3WVhKbGJuUXVZMmhwYkdSeVpXNHVhVzVrWlhoUFppaDBhR2x6S1NBcklERmRJSHg4SUc1MWJHdzdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lGeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnVkV3hzTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnWEhKY2JpQWdJQ0JuWlhRZ2JtVjRkRk5wWW14cGJtY29LU0I3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJSEJoY21WdWRDQTlJSFJvYVhNdWNHRnlaVzUwUld4bGJXVnVkRHRjY2x4dUlDQWdJQ0FnSUNCcFppaHdZWEpsYm5RcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhCaGNtVnVkQzVqYUdsc1pFNXZaR1Z6VzNCaGNtVnVkQzVqYUdsc1pFNXZaR1Z6TG1sdVpHVjRUMllvZEdocGN5a2dLeUF4WFNCOGZDQnVkV3hzTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0JjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYm5Wc2JEdGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lGeHlYRzRnSUNBZ1oyVjBJR1pwY25OMFEyaHBiR1FvS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11WTJocGJHUk9iMlJsYzFzd1hTQjhmQ0J1ZFd4c08xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ1hISmNiaUFnSUNCblpYUWdabWx5YzNSRmJHVnRaVzUwUTJocGJHUW9LU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVZMmhwYkdSeVpXNWJNRjBnZkh3Z2JuVnNiRHRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJRnh5WEc0Z0lDQWdaMlYwSUd4aGMzUkRhR2xzWkNncElIdGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ2JtOWtaWE1nUFNCMGFHbHpMbU5vYVd4a1RtOWtaWE03WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1dlpHVnpXMjV2WkdWekxteGxibWQwYUNBdElERmRPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lDQWdYSEpjYmlBZ0lDQm5aWFFnYkdGemRFVnNaVzFsYm5SRGFHbHNaQ2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnYm05a1pYTWdQU0IwYUdsekxtTm9hV3hrY21WdU8xeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnViMlJsYzF0dWIyUmxjeTVzWlc1bmRHZ2dMU0F4WFR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQm5aWFJCZEhSeWFXSjFkR1VvYm1GdFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtRjBkSEpwWW5WMFpYTmJibUZ0WlYwN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdjbVZ0YjNabFFYUjBjbWxpZFhSbEtHNWhiV1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmtaV3hsZEdVZ2RHaHBjeTVoZEhSeWFXSjFkR1Z6VzI1aGJXVmRPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaWh1WVcxbElEMDlJQ2RqYkdGemN5Y3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZlgzQnZjSFZzWVhSbFEyeGhjM05NYVhOMEtDazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lITmxkRUYwZEhKcFluVjBaU2h1WVcxbExDQjJZV3gxWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVlYUjBjbWxpZFhSbGMxdHVZVzFsWFNBOUlIWmhiSFZsTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlodVlXMWxJRDA5SUNkamJHRnpjeWNwSUhSb2FYTXVYMTl3YjNCMWJHRjBaVU5zWVhOelRHbHpkQ2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHaGhjMEYwZEhKcFluVjBaU2h1WVcxbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRzVoYldVZ2FXNGdkR2hwY3k1aGRIUnlhV0oxZEdWek8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJRjlmWjJWMFZHVjRkRTV2WkdWektHTnZiblJsZUhRcElIdGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ2RHVjRkRTV2WkdWeklEMGdXMTA3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVkR1Y0ZEM1amFHbHNaRTV2WkdWekxtWnZja1ZoWTJnb0tHNXZaR1VwSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWW9ibTlrWlM1dWIyUmxWSGx3WlNBOVBTQXpLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMFpYaDBUbTlrWlhNdWNIVnphQ2h1YjJSbEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUmxlSFJPYjJSbGN5QTlJSFJsZUhST2IyUmxjeTVqYjI1allYUW9kR2hwY3k1ZlgyZGxkRlJsZUhST2IyUmxjeWh1YjJSbEtTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJsZUhST2IyUmxjenRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCZlgzTmxZWEpqYUVSdmJTaGpiMjUwWlhoMExDQmpiMjF3WVhKbFEyRnNiR0poWTJzc0lHOXVaU0E5SUdaaGJITmxMQ0J6YUdGc2JHOTNJRDBnWm1Gc2MyVXBJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdibTlrWlhOR2IzVnVaQ0E5SUZ0ZE8xeHlYRzRnSUNBZ0lDQWdJR3hsZENCc1pXNW5kR2dnUFNCamIyNTBaWGgwTG1Ob2FXeGtjbVZ1TG14bGJtZDBhRHRjY2x4dUlDQWdJQ0FnSUNCbWIzSW9kbUZ5SUdrZ1BTQXdPeUJwSUR3Z2JHVnVaM1JvT3lCcEt5c3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUc1dlpHVWdQU0JqYjI1MFpYaDBMbU5vYVd4a2NtVnVXMmxkTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWW9ZMjl0Y0dGeVpVTmhiR3hpWVdOcktHNXZaR1VwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnViMlJsYzBadmRXNWtMbkIxYzJnb2JtOWtaU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lvYjI1bEtTQmljbVZoYXp0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWW9JWE5vWVd4c2IzY2dKaVlnYm05a1pTNWphR2xzWkhKbGJpNXNaVzVuZEdnZ1BpQXdLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdWIyUmxjMFp2ZFc1a0lEMGdibTlrWlhOR2IzVnVaQzVqYjI1allYUW9kR2hwY3k1ZlgzTmxZWEpqYUVSdmJTaHViMlJsTENCamIyMXdZWEpsUTJGc2JHSmhZMnNzSUc5dVpTa3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1LRzl1WlNBbUppQnViMlJsYzBadmRXNWtMbXhsYm1kMGFDQStJREFwSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdibTlrWlhOR2IzVnVaRHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCblpYUkZiR1Z0Wlc1MFFubEpaQ2hwWkNrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCdWIyUmxJRDBnYm5Wc2JEdGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ2JtOWtaWE5HYjNWdVpDQTlJSFJvYVhNdVgxOXpaV0Z5WTJoRWIyMG9kR2hwY3l3Z0tHNXZaR1VwSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1dlpHVXVZWFIwY21saWRYUmxjeTVwWkNBOVBTQnBaRHRjY2x4dUlDQWdJQ0FnSUNCOUxDQjBjblZsS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZb2JtOWtaWE5HYjNWdVpDNXNaVzVuZEdnZ1BpQXdLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRzV2WkdVZ1BTQnViMlJsYzBadmRXNWtXekJkTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1dlpHVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnWjJWMFJXeGxiV1Z1ZEhOQ2VVTnNZWE56VG1GdFpTaGpiR0Z6YzA1aGJXVXBJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdibTlrWlhNZ1BTQjBhR2x6TGw5ZmMyVmhjbU5vUkc5dEtIUm9hWE1zSUNodWIyUmxLU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJ1YjJSbExtaGhjMEYwZEhKcFluVjBaU2duWTJ4aGMzTW5LU0FtSmlCdWIyUmxMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWhqYkdGemMwNWhiV1VwTzF4eVhHNGdJQ0FnSUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2JtOWtaWE03WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1oyVjBSV3hsYldWdWRITkNlVlJoWjA1aGJXVW9kR0ZuVG1GdFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUd4bGRDQnViMlJsY3lBOUlIUm9hWE11WDE5elpXRnlZMmhFYjIwb2RHaHBjeXdnS0c1dlpHVXBJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJRzV2WkdVdWRHRm5UbUZ0WlNBOVBTQjBZV2RPWVcxbE8xeHlYRzRnSUNBZ0lDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdibTlrWlhNN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdYMTlrWlhSaFkyaE9iMlJsU1daQmRIUmhZMmhsWkNodWIyUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0x5OGdkWE5sSUc5dWJIa2dkMmwwYUNCdGIyUnBabWxqWVhScGIyNWNjbHh1SUNBZ0lDQWdJQ0F2THlCdFpYUm9iMlJ6WEhKY2JpQWdJQ0FnSUNBZ2FXWW9ibTlrWlM1d1lYSmxiblJPYjJSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHNXZaR1V1Y0dGeVpXNTBUbTlrWlM1eVpXMXZkbVZEYUdsc1pDaHViMlJsS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tseHlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQmphR2xzWkU1dlpHVmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdZWEJ3Wlc1a1EyaHBiR1FvWTJocGJHUk9iMlJsS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlgyUmxkR0ZqYUU1dlpHVkpaa0YwZEdGamFHVmtLR05vYVd4a1RtOWtaU2s3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVqYUdsc1pFNXZaR1Z6TG5CMWMyZ29ZMmhwYkdST2IyUmxLVHRjY2x4dUlDQWdJQ0FnSUNCamFHbHNaRTV2WkdVdWNHRnlaVzUwVG05a1pTQTlJSFJvYVhNN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJqYUdsc1pFNXZaR1U3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2FXNXpaWEowUW1WbWIzSmxLRzVsZDA1dlpHVXNJSEpsWm1WeVpXNWpaVTV2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOWZaR1YwWVdOb1RtOWtaVWxtUVhSMFlXTm9aV1FvYm1WM1RtOWtaU2s3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVqYUdsc1pFNXZaR1Z6TG5Od2JHbGpaU2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1amFHbHNaRTV2WkdWekxtbHVaR1Y0VDJZb2NtVm1aWEpsYm1ObFRtOWtaU2tzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJREFzSUc1bGQwNXZaR1VwTzF4eVhHNGdJQ0FnSUNBZ0lGeHlYRzRnSUNBZ0lDQWdJRzVsZDA1dlpHVXVjR0Z5Wlc1MFRtOWtaU0E5SUhSb2FYTTdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCdVpYZE9iMlJsTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbHVjMlZ5ZEVGbWRHVnlLRzVsZDA1dlpHVXNJSEpsWm1WeVpXNWpaVTV2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOWZaR1YwWVdOb1RtOWtaVWxtUVhSMFlXTm9aV1FvYm1WM1RtOWtaU2s3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVqYUdsc1pFNXZaR1Z6TG5Od2JHbGpaU2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1amFHbHNaRTV2WkdWekxtbHVaR1Y0VDJZb2NtVm1aWEpsYm1ObFRtOWtaU2tnS3lBeExGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBd0xDQnVaWGRPYjJSbEtUdGNjbHh1SUNBZ0lDQWdJQ0JjY2x4dUlDQWdJQ0FnSUNCdVpYZE9iMlJsTG5CaGNtVnVkRTV2WkdVZ1BTQjBhR2x6TzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdibVYzVG05a1pUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlcxdmRtVkRhR2xzWkNoamFHbHNaRTV2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmloMGFHbHpMbU5vYVd4a1RtOWtaWE11YVc1a1pYaFBaaWhqYUdsc1pFNXZaR1VwSUNFOVBTQXRNU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtTm9hV3hrVG05a1pYTXVjM0JzYVdObEtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1amFHbHNaRTV2WkdWekxtbHVaR1Y0VDJZb1kyaHBiR1JPYjJSbEtTd2dNU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCamFHbHNaRTV2WkdVdWNHRnlaVzUwVG05a1pTQTlJRzUxYkd3N1hISmNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnUlhKeWIzSW9KMDV2WkdVZ2FYTWdibTkwSUdFZ1kyaHBiR1FnYjJZZ2RHaHBjeUJ1YjJSbEp5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdZMmhwYkdST2IyUmxPMXh5WEc0Z0lDQWdmVnh5WEc1OU95SXNJbU52Ym5OMElIQnpaWFZrYjFObGJHVmpkRzl5VW1WblpYZ2dQU0F2S0Z0Y1hIY3RYU3NwS0Q4NlhGd29LRnRjWEhkY1hGZGRLeWxjWENsOEtTODdYRzVjYm1OdmJuTjBJRkJUWld4bFkzUnZja2x0Y0d3Z1BTQjdYRzRnSUNBZ0oyWnBjbk4wTFdOb2FXeGtKem9nS0c1dlpHVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJR05vYVd4a1RHbHpkQ0E5SUc1dlpHVXVjR0Z5Wlc1MFRtOWtaUzVqYUdsc1pISmxianRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ2hqYUdsc1pFeHBjM1F1YVc1a1pYaFBaaWh1YjJSbEtTQTlQU0F3S1R0Y2JpQWdJQ0I5TEZ4dUlDQWdJRnh1SUNBZ0lDZHNZWE4wTFdOb2FXeGtKem9nS0c1dlpHVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJR05vYVd4a1RHbHpkQ0E5SUc1dlpHVXVjR0Z5Wlc1MFRtOWtaUzVqYUdsc1pISmxianRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ2hqYUdsc1pFeHBjM1F1YVc1a1pYaFBaaWh1YjJSbEtTQTlQU0JqYUdsc1pFeHBjM1F1YkdWdVozUm9JQzBnTVNrN1hHNGdJQ0FnZlN4Y2JpQWdJQ0JjYmlBZ0lDQW5iblJvTFdOb2FXeGtKem9nS0c1dlpHVXNJR2x1WkdWNEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdsdVpHVjRJRDBnY0dGeWMyVkpiblFvYVc1a1pYZ3BPMXh1SUNBZ0lDQWdJQ0JzWlhRZ1kyaHBiR1JNYVhOMElEMGdibTlrWlM1d1lYSmxiblJPYjJSbExtTm9hV3hrY21WdU8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z0tHTm9hV3hrVEdsemRDNXBibVJsZUU5bUtHNXZaR1VwSUQwOUlHbHVaR1Y0SUMwZ01TazdYRzRnSUNBZ2ZTeGNiaUFnSUNCY2JpQWdJQ0FuYm05MEp6b2dLRzV2WkdVc0lITmxiR1ZqZEc5eUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUFoYm05a1pTNXRZWFJqYUdWektITmxiR1ZqZEc5eUtUdGNiaUFnSUNCOUxGeHVJQ0FnSUZ4dUlDQWdJQ2RsYlhCMGVTYzZJQ2h1YjJSbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ1YjJSbExtTm9hV3hrVG05a1pYTXViR1Z1WjNSb0lEMDlJREE3WEc0Z0lDQWdmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlDaGlZWE5sSUQwZ1kyeGhjM01nZTMwcElEMCtJSHRjYmlBZ0lDQnlaWFIxY200Z1kyeGhjM01nWlhoMFpXNWtjeUJpWVhObElIdGNiaUFnSUNBZ0lDQWdjR0Z5YzJWUWMyVjFaRzlUWld4bFkzUnZja1Y0Y21WemMybHZiaWh3YzJWMVpHOVRaV3hsWTNSdmNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJRzFoZEdOb0lEMGdjSE5sZFdSdlUyVnNaV04wYjNKU1pXZGxlQzVsZUdWaktIQnpaWFZrYjFObGJHVmpkRzl5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNnaGJXRjBZMmdwSUhSb2NtOTNJRzVsZHlCVGVXNTBZWGhGY25KdmNpaGdWVzVoWW14bElIUnZJSEJoY25ObElIQnpaWFZrYjFObGJHVmpkRzl5SUNja2UzQnpaWFZrYjFObGJHVmpkRzl5ZlNjdVlDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCdVlXMWxJRDBnYldGMFkyaGJNVjA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnY0dGeVlXMXpJRDBnYldGMFkyaGJNbDA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDZ2hLRzVoYldVZ2FXNGdVRk5sYkdWamRHOXlTVzF3YkNrcElIUm9jbTkzSUZONWJuUmhlRVZ5Y205eUtHQlZibk4xY0hCdmNuUmxaQ0J3YzJWMVpHOGdjMlZzWldOMGIzSWdKeVI3Ym1GdFpYMG5ZQ2xjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBb2JtOWtaU2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCUVUyVnNaV04wYjNKSmJYQnNXMjVoYldWZEtHNXZaR1VzSUhCaGNtRnRjeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQjlYRzU5SWl3aVkyOXVjM1FnUTJ4aGMzTk1hWE4wSUQwZ2NtVnhkV2x5WlNnbkxpOWpiR0Z6Y3kxc2FYTjBMbXB6SnlrN1hISmNibU52Ym5OMElFRjBkSEpwWW5WMFpWTmxiR1ZqZEc5eVRXbDRhVzRnUFNCeVpYRjFhWEpsS0NjdUwyRjBkSEpwWW5WMFpTMXpaV3hsWTNSdmNpMXRhWGhwYmk1cWN5Y3BPMXh5WEc1amIyNXpkQ0JRYzJWMVpHOVRaV3hsWTNSdmNrMXBlR2x1SUQwZ2NtVnhkV2x5WlNnbkxpOXdjMlYxWkc4dGMyVnNaV04wYjNJdGJXbDRhVzR1YW5NbktUdGNjbHh1WEhKY2JtTnZibk4wSUZGellWTmxZWEpqYUZSNWNHVnpJRDBnZTF4eVhHNGdJQ0FnWkdWbVlYVnNkRG9nTUN3Z0x5OGdaR1ZsY0Z4eVhHNGdJQ0FnYzJoaGJHeHZkem9nTVN3Z0x5OGdaR2x5WldOMElHUmxZMlZ1WkdGdWRGeHlYRzRnSUNBZ1pHbHlaV04wVTJsaWJHbHVaem9nTWl4Y2NseHVJQ0FnSUdkbGJtVnlZV3hUYVdKc2FXNW5PaUF6WEhKY2JuMDdYSEpjYmx4eVhHNWpiMjV6ZENCMllXeHBaRkZ6VW1WblpYZ2dQU0F2WGx0Y1hGeGNJMXhjTGl4Y1hDUmNYRjVjWEh4Y1hIZGNYQzA2UFZ4Y2N6NWNYQ3ArWEZ3clhGeGJYRnhkWEZ3b1hGd3BKMXdpWFNza0x6dGNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1kyeGhjM01nVVhWbGNubFRaV3hsWTNSaFlteGxJR1Y0ZEdWdVpITWdRWFIwY21saWRYUmxVMlZzWldOMGIzSk5hWGhwYmloY2NseHVJQ0FnSUZCelpYVmtiMU5sYkdWamRHOXlUV2w0YVc0b0tTa2dlMXh5WEc0Z0lDQWdJQ0FnSUZ4eVhHNGdJQ0FnWDE5elpXRnlZMmhFYjIwb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUZSNWNHVkZjbkp2Y2lnblRXVjBhRzlrSUdCZlgzTmxZWEpqYUVSdmJXQWdhWE1nYm05MElHbHRjR3hsYldWdWRHVmtMaWNwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lGOWZjR0Z5YzJWUmRXVnllVk5sYkdWamRHOXlVM1J5YVc1bktITmxiR1ZqZEc5eUtTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZb0lYWmhiR2xrVVhOU1pXZGxlQzUwWlhOMEtITmxiR1ZqZEc5eUtTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmRHaHliM2RKYm5aaGJHbGtVWFZsY25sVFpXeGxZM1J2Y2lncE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdiR1YwSUhSdmEyVnVjeUE5SUZ0ZE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5QnViM0p0WVd4cGVtVWdZVzVrSUhOaGJtbDBhWHBsSUhSb1pTQnhkV1Z5ZVNCelpXeGxZM1J2Y2lCemRISnBibWRjY2x4dUlDQWdJQ0FnSUNCelpXeGxZM1J2Y2lBOUlITmxiR1ZqZEc5eUxuSmxjR3hoWTJVb0wxeGNjeXN2Wnl3Z0p5QW5LVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ3ZYRnh6S2lnK2ZGeGNLM3grZkN3cFhGeHpLaTluTENBbkpERW5LVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ3ZYbHhjY3lzdkxDQW5KeWxjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdMbkpsY0d4aFkyVW9MMXhjY3lza0x5d2dKeWNwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlCamNtVmhkR1VnY21WbmRXeGhjaUJsZUhCeVpYTnphVzl1Y3lCbWIzSWdZV3hzSUhSb1pTQmthV1ptWlhKbGJuUWdkRzlyWlc1elhISmNiaUFnSUNBZ0lDQWdMeThnWVdSa1pXUWdjM1Z3Y0c5eWRDQm1iM0lnWlhOallYQmxaQ0J4ZFdWeWFXVnpJR3hwYTJVZ1lDNXVkVzFpWlhKelhGeGNYRHBsYm1GaWJHVmtZRnh5WEc0Z0lDQWdJQ0FnSUd4bGRDQjBZV2RUWld4bFkzUnZjaUE5SUNjb1B6cGNYRnhjYzN3K2ZGeGNYRndyZkg1OFhpa29XMXhjWEZ4M0xWMHJLRDg2VzF4Y1hGeDNMVjBxS0Q4NlhGeGNYRnhjWEZ3dUtTcGJYRnhjWEhjdFhTb3BLbnhjWEZ4Y0tpa25PMXh5WEc0Z0lDQWdJQ0FnSUd4bGRDQmpiR0Z6YzA1aGJXVlRaV3hsWTNSdmNpQTlJQ2RjWEZ4Y0xpaGJYRnhjWEhjdFhTc29QenBiWEZ4Y1hIY3RYU29vUHpwY1hGeGNYRnhjWEM0cEtsdGNYRnhjZHkxZEtpa3FLU2M3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJR2xrVTJWc1pXTjBiM0lnUFNBbkl5aGJYRnhjWEhjdFhTc29QenBiWEZ4Y1hIY3RYU29vUHpwY1hGeGNYRnhjWEM0cEtsdGNYRnhjZHkxZEtpa3FLU2M3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJR0YwZEhKaWRYUmxVMlZzWldOMGIzSWdQU0FuWEZ4Y1hGc29XMXhjWEZ4M1hGeGNYRmRkS3o4b1B6bzlLRDg2WENKOFhGd25LVnRjWEZ4Y2QxeGNYRnhYWFNvL0tEODZYQ0o4WEZ3bktYd3BLVnhjWEZ4ZEp6dGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ1lXNWpaWE4wYjNKVWVYQmxJRDBnSnloY1hGeGNjM3crZkZ4Y1hGd3JmSDRwSnp0Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnY0hObGRXUnZVMlZzWldOMGIzSWdQU0FuT2loYlhGeGNYSGN0WFNzb1B6cGNYRnhjS0Z0Y1hGeGNkMXhjWEZ4WFhTcy9YRnhjWENsOEtTa25PMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeUJqYjI1allYUnBibUYwWlNCaGJHd2dkR2hsSUhKbFoyVjRaWE1nZEc4Z2IyNWxJSFJ2YTJVZ2NtVm5aWGhjY2x4dUlDQWdJQ0FnSUNCc1pYUWdkRzlyWlc1U1pXZGxlQ0E5SUc1bGR5QlNaV2RGZUhBb1lDZy9PaVI3VzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JoYm1ObGMzUnZjbFI1Y0dVc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSaFoxTmxiR1ZqZEc5eUxGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFpGTmxiR1ZqZEc5eUxGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCamJHRnpjMDVoYldWVFpXeGxZM1J2Y2l4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWVhSMGNtSjFkR1ZUWld4bFkzUnZjaXhjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjSE5sZFdSdlUyVnNaV04wYjNKY2NseHVJQ0FnSUNBZ0lDQmRMbXB2YVc0b0ozd25LWDBwWUNrN1hISmNiaUFnSUNBZ0lDQWdYSEpjYmlBZ0lDQWdJQ0FnZDJocGJHVW9JU0Z6Wld4bFkzUnZjaWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ2JXRjBZMmdnUFNCMGIydGxibEpsWjJWNExtVjRaV01vYzJWc1pXTjBiM0lwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J6Wld4bFkzUnZjaUE5SUhObGJHVmpkRzl5TG5Oc2FXTmxLRzFoZEdOb0xtbHVaR1Y0SUNzZ2JXRjBZMmhiTUYwdWJHVnVaM1JvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnZjaWhzWlhRZ2FTQTlJREU3SUdrZ1BDQnRZWFJqYUM1c1pXNW5kR2c3SUdrckt5a2dlMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1LRzFoZEdOb1cybGRJQ0U5UFNCMWJtUmxabWx1WldRcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdhMlY1ZDI5eVpDQTlJRzFoZEdOb1cybGRPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1LR2tnSVQwOUlEWXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYTJWNWQyOXlaQ0E5SUd0bGVYZHZjbVF1Y21Wd2JHRmpaU2d2WEZ4Y1hDOW5MQ0FuSnlrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJ2YTJWdWN5NXdkWE5vS0h0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RIbHdaVG9nYVN4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2EyVjVkMjl5WkRvZ2EyVjVkMjl5WkZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQmNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkRzlyWlc1ek8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJRjlmY1hOaFUyVmhjbU5vVkhsd1pTaHpaWEJoY21GMGIzSXBJSHRjY2x4dUlDQWdJQ0FnSUNCemQybDBZMmdvYzJWd1lYSmhkRzl5S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGMyVWdKejRuT2x4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUZGellWTmxZWEpqYUZSNWNHVnpMbk5vWVd4c2IzYzdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjMlVnSnlzbk9seHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlGRnpZVk5sWVhKamFGUjVjR1Z6TG1ScGNtVmpkRk5wWW14cGJtYzdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjMlVnSjM0bk9seHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlGRnpZVk5sWVhKamFGUjVjR1Z6TG1kbGJtVnlZV3hUYVdKc2FXNW5PMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtaV1poZFd4ME9seHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlGRnpZVk5sWVhKamFGUjVjR1Z6TG1SbFptRjFiSFE3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJRjlmWW5WcGJHUlJjMkZEY21sMFpYSnBZWE1vZEc5clpXNXpLU0I3WEhKY2JpQWdJQ0FnSUNBZ2JHVjBJSE5sWVhKamFFTnlhWFJsY21saGN5QTlJRnRkTzF4eVhHNGdJQ0FnSUNBZ0lHeGxkQ0J6WldGeVkyaERjbWwwWlhKcFlTQTlJSHQ5TzF4eVhHNGdJQ0FnSUNBZ0lIUnZhMlZ1Y3k1bWIzSkZZV05vS0NoMGIydGxiaWtnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCemQybDBZMmdnS0hSdmEyVnVMblI1Y0dVcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR05oYzJVZ01UcGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelpXRnlZMmhEY21sMFpYSnBZWE11Y0hWemFDaHpaV0Z5WTJoRGNtbDBaWEpwWVNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJWaGNtTm9RM0pwZEdWeWFXRnpMbkIxYzJnb2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpaV0Z5WTJoVWVYQmxPaUIwYUdsekxsOWZjWE5oVTJWaGNtTm9WSGx3WlNoMGIydGxiaTVyWlhsM2IzSmtLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhObFlYSmphRU55YVhSbGNtbGhJRDBnZTMwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JqWVhObElESTZYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJ2YTJWdUxtdGxlWGR2Y21RZ0lUMGdKeW9uS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmxZWEpqYUVOeWFYUmxjbWxoTG5SaFowNWhiV1VnUFNCMGIydGxiaTVyWlhsM2IzSmtPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOaGMyVWdNenBjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpaV0Z5WTJoRGNtbDBaWEpwWVM1aGRIUnlhV0oxZEdWeklEMGdjMlZoY21Ob1EzSnBkR1Z5YVdFdVlYUjBjbWxpZFhSbGN5QjhmQ0I3ZlR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WldGeVkyaERjbWwwWlhKcFlTNWhkSFJ5YVdKMWRHVnpMbWxrSUQwZ2RHOXJaVzR1YTJWNWQyOXlaRHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTmhjMlVnTkRwY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WldGeVkyaERjbWwwWlhKcFlTNWpiR0Z6YzB4cGMzUWdQU0J6WldGeVkyaERjbWwwWlhKcFlTNWpiR0Z6YzB4cGMzUWdmSHdnVzEwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJWaGNtTm9RM0pwZEdWeWFXRXVZMnhoYzNOTWFYTjBMbkIxYzJnb2RHOXJaVzR1YTJWNWQyOXlaQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpZWE5sSURVNlhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJWaGNtTm9RM0pwZEdWeWFXRXVZWFIwY21saWRYUmxjeUE5SUhObFlYSmphRU55YVhSbGNtbGhMbUYwZEhKcFluVjBaWE1nZkh3Z2UzMDdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJR0YwZEhKVWIydGxiaUE5SUhSb2FYTXVjR0Z5YzJWQmRIUnlhV0oxZEdWRmVIQnlaWE56YVc5dUtIUnZhMlZ1TG10bGVYZHZjbVFwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmxZWEpqYUVOeWFYUmxjbWxoTG1GMGRISnBZblYwWlhOYllYUjBjbFJ2YTJWdUxtNWhiV1ZkSUQwZ1lYUjBjbFJ2YTJWdUxuWmhiSFZsTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZMkZ6WlNBMk9seHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhObFlYSmphRU55YVhSbGNtbGhMbkJ6WlhWa2IxTmxiR1ZqZEc5eWN5QTlJSE5sWVhKamFFTnlhWFJsY21saExuQnpaWFZrYjFObGJHVmpkRzl5Y3lCOGZDQmJYVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdjSE5sZFdSdlUyVnNaV04wYjNJZ1BTQjBhR2x6TG5CaGNuTmxVSE5sZFdSdlUyVnNaV04wYjNKRmVISmxjM05wYjI0b2RHOXJaVzR1YTJWNWQyOXlaQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMlZoY21Ob1EzSnBkR1Z5YVdFdWNITmxkV1J2VTJWc1pXTjBiM0p6TG5CMWMyZ29jSE5sZFdSdlUyVnNaV04wYjNJcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdmU2s3WEhKY2JpQWdJQ0FnSUNBZ1hISmNiaUFnSUNBZ0lDQWdjMlZoY21Ob1EzSnBkR1Z5YVdGekxuQjFjMmdvYzJWaGNtTm9RM0pwZEdWeWFXRXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2MyVmhjbU5vUTNKcGRHVnlhV0Z6TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lGOWZjWE5oVTJWaGNtTm9RbmxVZVhCbEtHTnZiblJsZUhSTWFYTjBMQ0JqY21sMFpYSnBZU3dnYjI1bExDQnpaV0Z5WTJoVWVYQmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWW9jMlZoY21Ob1ZIbHdaU0E5UFNCUmMyRlRaV0Z5WTJoVWVYQmxjeTVrWldaaGRXeDBJSHg4SUhObFlYSmphRlI1Y0dVZ1BUMGdVWE5oVTJWaGNtTm9WSGx3WlhNdWMyaGhiR3h2ZHlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYM0Z6WVZObFlYSmphRlJ5WldVb1kyOXVkR1Y0ZEV4cGMzUXNJR055YVhSbGNtbGhMQ0J2Ym1Vc0lITmxZWEpqYUZSNWNHVXBPMXh5WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZmNYTmhVMlZoY21Ob1UybGliR2x1WjNNb1kyOXVkR1Y0ZEV4cGMzUXNJR055YVhSbGNtbGhMQ0J2Ym1Vc0lITmxZWEpqYUZSNWNHVXBPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQmZYM0Z6WVVOdmJYQmhjbVZPYjJSbEtHTnlhWFJsY21saExDQnViMlJsS1NCN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUcxaGRHTm9aWE1nUFNCMGNuVmxPMXh5WEc0Z0lDQWdJQ0FnSUU5aWFtVmpkQzVyWlhsektHTnlhWFJsY21saEtTNW1iM0pGWVdOb0tDaHdjbTl3TENCcGJtUmxlQ2tnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9JU2hqY21sMFpYSnBZVnR3Y205d1hTQnBibk4wWVc1alpXOW1JRkpsWjBWNGNDa2dKaVpjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOeWFYUmxjbWxoVzNCeWIzQmRJR2x1YzNSaGJtTmxiMllnVDJKcVpXTjBJQ1ltWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2NtOXdJQ0U5SUNkd2MyVjFaRzlUWld4bFkzUnZjbk1uS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdFlYUmphR1Z6SUQwZ2JXRjBZMmhsY3lBbUppQjBhR2x6TGw5ZmNYTmhRMjl0Y0dGeVpVNXZaR1VvWTNKcGRHVnlhV0ZiY0hKdmNGMHNJRzV2WkdWYmNISnZjRjBwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9ibTlrWlNCcGJuTjBZVzVqWlc5bUlFTnNZWE56VEdsemRDa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYldGMFkyaGxjeUE5SUcxaGRHTm9aWE1nSmlZZ2JtOWtaUzVqYjI1MFlXbHVjeWhqY21sMFpYSnBZVnR3Y205d1hTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCcFppQW9ZM0pwZEdWeWFXRmJjSEp2Y0YwZ2FXNXpkR0Z1WTJWdlppQlNaV2RGZUhBcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzFoZEdOb1pYTWdQU0J0WVhSamFHVnpJQ1ltSUc1dlpHVmJjSEp2Y0YwZ0lUMDlJSFZ1WkdWbWFXNWxaQ0FtSmlCamNtbDBaWEpwWVZ0d2NtOXdYUzUwWlhOMEtHNXZaR1ZiY0hKdmNGMHBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLSEJ5YjNBZ1BUMGdKM0J6WlhWa2IxTmxiR1ZqZEc5eWN5Y3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOeWFYUmxjbWxoVzNCeWIzQmRMbVp2Y2tWaFkyZ29LSEJ6WlhWa2IxTmxiR1ZqZEc5eUtTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiV0YwWTJobGN5QTlJRzFoZEdOb1pYTWdKaVlnY0hObGRXUnZVMlZzWldOMGIzSW9ibTlrWlNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzFoZEdOb1pYTWdQU0J0WVhSamFHVnpJQ1ltSUc1dlpHVmJjSEp2Y0YwZ1BUMGdZM0pwZEdWeWFXRmJjSEp2Y0YwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHMWhkR05vWlhNN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdYMTl4YzJGVFpXRnlZMmhUYVdKc2FXNW5jeWhqYjI1MFpYaDBUR2x6ZEN3Z1kzSnBkR1Z5YVdFc0lHOXVaU3dnYzJWaGNtTm9WSGx3WlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCbWIzVnVaRTV2WkdWeklEMGdXMTA3WEhKY2JpQWdJQ0FnSUNBZ1ptOXlLR3hsZENCcElEMGdNRHNnYVNBOElHTnZiblJsZUhSTWFYTjBMbXhsYm1kMGFEc2dhU3NyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQmpiMjUwWlhoMElEMGdZMjl1ZEdWNGRFeHBjM1JiYVYwN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnY0dGeVpXNTBJRDBnWTI5dWRHVjRkQzV3WVhKbGJuUk9iMlJsTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ2FXNWtaWGhKYmxCaGNtVnVkQ0E5SUhCaGNtVnVkQzVqYUdsc1pISmxiaTVwYm1SbGVFOW1LR052Ym5SbGVIUXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaWhwYm1SbGVFbHVVR0Z5Wlc1MElDRTlQU0F0TVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiR1YwSUdadmJHeHZkMmx1WjFOcFlteHBibWR6SUQwZ2NHRnlaVzUwTG1Ob2FXeGtjbVZ1TG5Od2JHbGpaU2hwYm1SbGVFbHVVR0Z5Wlc1MElDc2dNU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdabTl5S0d4bGRDQnFJRDBnTURzZ2FpQThJR1p2Ykd4dmQybHVaMU5wWW14cGJtZHpMbXhsYm1kMGFEc2dhaXNyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElHNWxlSFJUYVdKc2FXNW5JRDBnWm05c2JHOTNhVzVuVTJsaWJHbHVaM05iYWwwN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1LSFJvYVhNdVgxOXhjMkZEYjIxd1lYSmxUbTlrWlNoamNtbDBaWEpwWVN3Z2JtVjRkRk5wWW14cGJtY3BLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdadmRXNWtUbTlrWlhNdWNIVnphQ2h1WlhoMFUybGliR2x1WnlrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlodmJtVXBJR0p5WldGck8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWW9jMlZoY21Ob1ZIbHdaU0E5UFNCUmMyRlRaV0Z5WTJoVWVYQmxjeTVrYVhKbFkzUlRhV0pzYVc1bktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppaHZibVVnSmlZZ1ptOTFibVJPYjJSbGN5NXNaVzVuZEdnZ1BpQXdLU0JpY21WaGF6dGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWnZkVzVrVG05a1pYTTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnWDE5eGMyRlRaV0Z5WTJoVWNtVmxLR052Ym5SbGVIUk1hWE4wTENCamNtbDBaWEpwWVN3Z2IyNWxMQ0J6WldGeVkyaFVlWEJsS1NCN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUdadmRXNWtUbTlrWlhNZ1BTQmJYVHRjY2x4dUlDQWdJQ0FnSUNCamIyNTBaWGgwVEdsemRDNW1iM0pGWVdOb0tDaGpiMjUwWlhoMEtTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1p2ZFc1a1RtOWtaWE1nUFNCbWIzVnVaRTV2WkdWekxtTnZibU5oZENoMGFHbHpMbDlmYzJWaGNtTm9SRzl0S0dOdmJuUmxlSFFzSUNodWIyUmxLU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWDNGellVTnZiWEJoY21WT2IyUmxLR055YVhSbGNtbGhMQ0J1YjJSbEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTd2diMjVsTENCelpXRnlZMmhVZVhCbElEMDlJRkZ6WVZObFlYSmphRlI1Y0dWekxuTm9ZV3hzYjNjcEtUdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1p2ZFc1a1RtOWtaWE03WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1gxOXhjMkZUWldGeVkyZ29ZMjl1ZEdWNGRFeHBjM1FzSUdOeWFYUmxjbWxoY3l3Z2IyNWxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2IyNWxJRDBnYjI1bElIeDhJR1poYkhObE8xeHlYRzRnSUNBZ0lDQWdJR3hsZENCbWIzVnVaRTV2WkdWeklEMGdXMTA3WEhKY2JseHlYRzRnSUNBZ0lDQWdJR1p2Y2loc1pYUWdhU0E5SURBN0lHa2dQQ0JqY21sMFpYSnBZWE11YkdWdVozUm9PeUJwS3lzcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJR055YVhSbGNtbGhJRDBnWTNKcGRHVnlhV0Z6VzJsZE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdjMlZoY21Ob1ZIbHdaU0E5SUZGellWTmxZWEpqYUZSNWNHVnpMbVJsWm1GMWJIUTdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlnbmMyVmhjbU5vVkhsd1pTY2dhVzRnWTNKcGRHVnlhV0VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmxZWEpqYUZSNWNHVWdQU0JqY21sMFpYSnBZUzV6WldGeVkyaFVlWEJsTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1kzSnBkR1Z5YVdFZ1BTQmpjbWwwWlhKcFlYTmJhU0E5SUdrZ0t5QXhYVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc1Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnZkVzVrVG05a1pYTWdQU0IwYUdsekxsOWZjWE5oVTJWaGNtTm9RbmxVZVhCbEtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZMjl1ZEdWNGRFeHBjM1FzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCamNtbDBaWEpwWVN4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHOXVaU0FtSmlCcElEMDlJR055YVhSbGNtbGhjeTVzWlc1bmRHZ2dMU0F4TEZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyVmhjbU5vVkhsd1pWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnWjJWMElHRnVJSFZ1YVhGMVpTQnNhWE4wSUc5bUlHMWhkR05vWlhOY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWm05MWJtUk9iMlJsY3lBOUlHWnZkVzVrVG05a1pYTXVabWxzZEdWeUtDaHBkR1Z0TENCcGJtUmxlQ3dnYkdsemRDa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUd4cGMzUXVhVzVrWlhoUFppaHBkR1Z0S1NBOVBUMGdhVzVrWlhnN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1ZEdWNGRFeHBjM1FnUFNCbWIzVnVaRTV2WkdWek8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lvWTI5dWRHVjRkRXhwYzNRdWJHVnVaM1JvSUQwOUlEQXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabTkxYm1ST2IyUmxjenRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCZlgzUm9jbTkzU1c1MllXeHBaRkYxWlhKNVUyVnNaV04wYjNJb1pYZ3BJSHRjY2x4dUlDQWdJQ0FnSUNCcFppaGxlQ0JwYm5OMFlXNWpaVzltSUZONWJuUmhlRVZ5Y205eUtTQjBhSEp2ZHlCbGVEdGNjbHh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnVTNsdWRHRjRSWEp5YjNJb0oybHVkbUZzYVdRZ2NYVmxjbmtnYzJWc1pXTjBiM0luS1R0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUZ4eVhHNGdJQ0FnWDE5eGMyRlRiM0owS0d4cGMzUXBJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdjbVZrZFdObGNpQTlJQ2hzYVhOMExDQnBkR1Z0S1NBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeHBjM1F1Y0hWemFDaHBkR1Z0S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJTNWphR2xzWkU1dlpHVnpMbkpsWkhWalpTaHlaV1IxWTJWeUxDQnNhWE4wS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQnNhWE4wTzF4eVhHNGdJQ0FnSUNBZ0lIMDdYSEpjYmlBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUNBZ2JHVjBJR1pzWVhSRWIyMGdQU0JiZEdocGMxMHVjbVZrZFdObEtISmxaSFZqWlhJc0lGdGRLVHRjY2x4dUlDQWdJQ0FnSUNCY2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2JHbHpkQzV6YjNKMEtDaGhMQ0JpS1NBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JoYVc1a1pYZ2dQU0JtYkdGMFJHOXRMbWx1WkdWNFQyWW9ZU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCaWFXNWtaWGdnUFNCbWJHRjBSRzl0TG1sdVpHVjRUMllvWWlrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1lXbHVaR1Y0SUQ0Z1ltbHVaR1Y0S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z01UdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUtHRnBibVJsZUNBOElHSnBibVJsZUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDMHhPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlEQTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUZ4eVhHNGdJQ0FnWDE5bGVHVmpVWE5oS0hObGJHVmpkRzl5TENCdmJtVXBJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdabTkxYm1RZ1BTQmJYVHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdjM1ZpVTJWc1pXTjBiM0p6SUQwZ2MyVnNaV04wYjNJdWMzQnNhWFFvSnl3bktUdGNjbHh1SUNBZ0lDQWdJQ0JjY2x4dUlDQWdJQ0FnSUNCbWIzSW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z2MzVmlVMlZzWldOMGIzSnpMbXhsYm1kMGFEc2dhU3NyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQnpkV0pUWld4bFkzUnZjaUE5SUhOMVlsTmxiR1ZqZEc5eWMxdHBYVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0IwYjJ0bGJuTWdQU0IwYUdsekxsOWZjR0Z5YzJWUmRXVnllVk5sYkdWamRHOXlVM1J5YVc1bktITjFZbE5sYkdWamRHOXlLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUhObFlYSmphRU55YVhSbGNtbGhjeUE5SUhSb2FYTXVYMTlpZFdsc1pGRnpZVU55YVhSbGNtbGhjeWgwYjJ0bGJuTXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnWm05MWJtUkpibEYxWlhKNUlEMGdkR2hwY3k1ZlgzRnpZVk5sWVhKamFDaGJkR2hwYzEwc0lITmxZWEpqYUVOeWFYUmxjbWxoY3l3Z2IyNWxLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnZkVzVrU1c1UmRXVnllUzVtYjNKRllXTm9LQ2h1YjJSbEtTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppaG1iM1Z1WkM1cGJtUmxlRTltS0c1dlpHVXBJRDA5SUMweEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ptOTFibVF1Y0hWemFDaHViMlJsS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lGeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnpkV0pUWld4bFkzUnZjbk11YkdWdVozUm9JRDRnTVQ4Z2RHaHBjeTVmWDNGellWTnZjblFvWm05MWJtUXBPaUJtYjNWdVpEdGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lGeHlYRzRnSUNBZ2JXRjBZMmhsY3loelpXeGxZM1J2Y2lrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCc2FYTjBJRDBnZEdocGN5NXZkMjVsY2tSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvYzJWc1pXTjBiM0lwTzF4eVhHNGdJQ0FnSUNBZ0lHeGxkQ0JwSUQwZ2JHbHpkQzVzWlc1bmRHZzdYSEpjYmlBZ0lDQWdJQ0FnZDJocGJHVW9MUzFwSUQ0OUlEQWdKaVlnYkdsemRGdHBYU0FoUFQwZ2RHaHBjeWtnZTMxY2NseHVJQ0FnSUNBZ0lDQmNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhU0ErSUMweE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEYxWlhKNVUyVnNaV04wYjNJb2MyVnNaV04wYjNJcElIdGNjbHh1SUNBZ0lDQWdJQ0IwY25rZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYMlY0WldOUmMyRW9jMlZzWldOMGIzSXBXekJkSUh4OElHNTFiR3c3WEhKY2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNobGVDa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5ZmRHaHliM2RKYm5aaGJHbGtVWFZsY25sVFpXeGxZM1J2Y2lobGVDazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lIRjFaWEo1VTJWc1pXTjBiM0pCYkd3b2MyVnNaV04wYjNJcElIdGNjbHh1SUNBZ0lDQWdJQ0IwY25rZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZYMlY0WldOUmMyRW9jMlZzWldOMGIzSXBPMXh5WEc0Z0lDQWdJQ0FnSUgwZ1kyRjBZMmdvWlhncElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmWDNSb2NtOTNTVzUyWVd4cFpGRjFaWEo1VTJWc1pXTjBiM0lvWlhncE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dWZUdGNjbHh1SWl3aVkyeGhjM01nVG05a1pVWnBiSFJsY2lCN1hHNGdJQ0FnYzNSaGRHbGpJR2RsZENCR1NVeFVSVkpmUVVORFJWQlVLQ2tnZXlCeVpYUjFjbTRnTVRzZ2ZWeHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ1JrbE1WRVZTWDFKRlNrVkRWQ2dwSUhzZ2NtVjBkWEp1SURJN0lIMWNiaUFnSUNCemRHRjBhV01nWjJWMElFWkpURlJGVWw5VFMwbFFLQ2tnZXlCeVpYUjFjbTRnTXpzZ2ZWeHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ1UwaFBWMTlCVEV3b0tTQjdJSEpsZEhWeWJpQTBNamswT1RZM01qazFPeUI5WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0JUU0U5WFgwVk1SVTFGVGxRb0tTQjdJSEpsZEhWeWJpQXhPeUI5WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0JUU0U5WFgwRlVWRkpKUWxWVVJTZ3BJSHNnY21WMGRYSnVJREk3SUgxY2JpQWdJQ0J6ZEdGMGFXTWdaMlYwSUZOSVQxZGZWRVZZVkNncElIc2djbVYwZFhKdUlEUTdJSDFjYmlBZ0lDQnpkR0YwYVdNZ1oyVjBJRk5JVDFkZlEwUkJWRUZmVTBWRFZFbFBUaWdwSUhzZ2NtVjBkWEp1SURnN0lIMWNiaUFnSUNCemRHRjBhV01nWjJWMElGTklUMWRmUlU1VVNWUlpYMUpGUmtWU1JVNURSU2dwSUhzZ2NtVjBkWEp1SURFMk95QjlYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQlRTRTlYWDBWT1ZFbFVXU2dwSUhzZ2NtVjBkWEp1SURNeU95QjlYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQlRTRTlYWDFCU1QwTkZVMU5KVGtkZlNVNVRWRkpWUTFSSlQwNG9LU0I3SUhKbGRIVnliaUEyTkRzZ2ZWeHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ1UwaFBWMTlEVDAxTlJVNVVLQ2tnZXlCeVpYUjFjbTRnTVRJNE95QjlYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQlRTRTlYWDBSUFExVk5SVTVVS0NrZ2V5QnlaWFIxY200Z01qVTJPeUI5WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0JUU0U5WFgwUlBRMVZOUlU1VVgxUlpVRVVvS1NCN0lISmxkSFZ5YmlBMU1USTdJSDFjYmlBZ0lDQnpkR0YwYVdNZ1oyVjBJRk5JVDFkZlJFOURWVTFGVGxSZlJsSkJSMDFGVGxRb0tTQjdJSEpsZEhWeWJpQXhNREkwT3lCOVhHNGdJQ0FnYzNSaGRHbGpJR2RsZENCVFNFOVhYMDVQVkVGVVNVOU9LQ2tnZXlCeVpYUjFjbTRnTWpBME9Ec2dmVnh1ZlZ4dVhHNWpiR0Z6Y3lCVWNtVmxWMkZzYTJWeUlIdGNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHliMjkwTENCM2FHRjBWRzlUYUc5M0xDQm1hV3gwWlhJcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZklEMGdlMzA3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMlpwYkhSbGNpQTlJR1pwYkhSbGNqdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtOXZkQ0E5SUhKdmIzUTdYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzZG9ZWFJVYjFOb2IzY2dQU0IzYUdGMFZHOVRhRzkzTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDltYkdGMFZISmxaU0E5SUZ0ZE8xeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5cGRHVnlZWFJ2Y2lBOUlDMHhPMXh1SUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbVZrZFdObGNpZ3BPMXh1SUNBZ0lIMWNiaUFnSUNCY2JpQWdJQ0JuWlhRZ1ptbHNkR1Z5S0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWm1sc2RHVnlPMXh1SUNBZ0lIMWNiaUFnSUNCY2JpQWdJQ0JuWlhRZ2NtOXZkQ2dwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM0p2YjNRN1hHNGdJQ0FnZlZ4dUlDQWdJRnh1SUNBZ0lHZGxkQ0IzYUdGMFZHOVRhRzkzS0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmZDJoaGRGUnZVMmh2ZHp0Y2JpQWdJQ0I5WEc0Z0lDQWdYRzRnSUNBZ1oyVjBJR04xY25KbGJuUk9iMlJsS0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWm14aGRGUnlaV1ZiZEdocGN5NWZhWFJsY21GMGIzSmRJSHg4SUc1MWJHdzdYRzRnSUNBZ2ZWeHVJQ0FnSUZ4dUlDQWdJRjlzYVhOMFJtbHNkR1Z5S0dsMFpXMHBJSHRjYmlBZ0lDQWdJQ0FnYVdZb0lYUm9hWE11WDJacGJIUmxjaUI4ZkNCMGFHbHpMbDltYVd4MFpYSXVZV05qWlhCMFRtOWtaU2hwZEdWdEtTQTlQU0JPYjJSbFJtbHNkR1Z5TGtaSlRGUkZVbDlCUTBORlVGUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBd08xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJRnh1SUNBZ0lDQWdJQ0JwWmloMGFHbHpMbDltYVd4MFpYSXVZV05qWlhCMFRtOWtaU2hwZEdWdEtTQTlQU0JPYjJSbFJtbHNkR1Z5TGtaSlRGUkZVbDlUUzBsUUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnTVR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdhV1lvZEdocGN5NWZabWxzZEdWeUxtRmpZMlZ3ZEU1dlpHVW9hWFJsYlNrZ1BUMGdUbTlrWlVacGJIUmxjaTVHU1V4VVJWSmZVa1ZLUlVOVUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnTFRFN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJQ0FnWEc0Z0lDQWdYM05vYjNWc1pGTm9iM2RKZEdWdEtHbDBaVzBwSUh0Y2JpQWdJQ0FnSUNBZ2FXWW9kR2hwY3k1ZmJHbHpkRVpwYkhSbGNpaHBkR1Z0S1NBOVBTQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RISjFaVHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQmNiaUFnSUNCZmNtVmtkV05sY2lncElIdGNiaUFnSUNBZ0lDQWdiR1YwSUhKbFpIVmpaWElnUFNBb2JHbHpkQ3dnYVhSbGJTa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUdacGJIUmxjbFI1Y0dVZ1BTQjBhR2x6TGw5c2FYTjBSbWxzZEdWeUtHbDBaVzBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dacGJIUmxjbFI1Y0dVZ1BUMDlJREFwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDNkb1lYUlViMU5vYjNjZ1BUMGdUbTlrWlVacGJIUmxjaTVUU0U5WFgwRk1UQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNhWE4wTG5CMWMyZ29hWFJsYlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaDBhR2x6TGw5M2FHRjBWRzlUYUc5M0lEMDlJRTV2WkdWR2FXeDBaWEl1VTBoUFYxOUZURVZOUlU1VUlDWW1YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsMFpXMHVibTlrWlZSNWNHVWdQVDBnTVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzYVhOMExuQjFjMmdvYVhSbGJTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2gwYUdsekxsOTNhR0YwVkc5VGFHOTNJRDA5SUU1dlpHVkdhV3gwWlhJdVUwaFBWMTlVUlZoVUlDWW1YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsMFpXMHVibTlrWlZSNWNHVWdQVDBnTXlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzYVhOMExuQjFjMmdvYVhSbGJTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2gwYUdsekxsOTNhR0YwVkc5VGFHOTNJRDA5SUU1dlpHVkdhV3gwWlhJdVUwaFBWMTlEUkVGVVFWOVRSVU5VU1U5T0lDWW1JRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRMbTV2WkdWVWVYQmxJRDA5SURRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYkdsemRDNXdkWE5vS0dsMFpXMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQnBaaUFvZEdocGN5NWZkMmhoZEZSdlUyaHZkeUE5UFNCT2IyUmxSbWxzZEdWeUxsTklUMWRmUTA5TlRVVk9WQ0FtSmlCY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhWFJsYlM1dWIyUmxWSGx3WlNBOVBTQTRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHeHBjM1F1Y0hWemFDaHBkR1Z0S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2htYVd4MFpYSlVlWEJsSUNFOVBTQXRNU2xjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdExtTm9hV3hrVG05a1pYTXVjbVZrZFdObEtISmxaSFZqWlhJc0lHeHBjM1FwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYkdsemREdGNiaUFnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMlpzWVhSVWNtVmxJRDBnVzNSb2FYTXVYM0p2YjNSZExuSmxaSFZqWlNoeVpXUjFZMlZ5TENCYlhTazdYRzRnSUNBZ2ZWeHVJQ0FnSUZ4dUlDQWdJSEJoY21WdWRFNXZaR1VvS1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0J3WVhKbGJuUWdQU0IwYUdsekxtTjFjbkpsYm5ST2IyUmxMbkJoY21WdWRFNXZaR1U3WEc0Z0lDQWdJQ0FnSUd4bGRDQnBibVJsZUNBOUlIUm9hWE11WDJac1lYUlVjbVZsTG1sdVpHVjRUMllvY0dGeVpXNTBLVHRjYmlBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUdsbUlDaHBibVJsZUNBaFBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgybDBaWEpoZEc5eUlEMGdhVzVrWlhnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCd1lYSmxiblE3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHWnBjbk4wUTJocGJHUW9LU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQnViMlJsSUQwZ2RHaHBjeTVqZFhKeVpXNTBUbTlrWlR0Y2JpQWdJQ0FnSUNBZ1ptOXlLR3hsZENCcElEMGdNRHNnYVNBOElHNXZaR1V1WTJocGJHUk9iMlJsY3k1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJR2x1WkdWNElEMGdkR2hwY3k1ZlpteGhkRlJ5WldVdWFXNWtaWGhQWmlodWIyUmxMbU5vYVd4a1RtOWtaWE5iYVYwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHbHVaR1Y0SUNFOVBTQXRNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMmwwWlhKaGRHOXlJRDBnYVc1a1pYZzdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHNXZaR1V1WTJocGJHUk9iMlJsYzF0cFhUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiR0Z6ZEVOb2FXeGtLQ2tnZTF4dUlDQWdJQ0FnSUNCc1pYUWdibTlrWlNBOUlIUm9hWE11WTNWeWNtVnVkRTV2WkdVN1hHNGdJQ0FnSUNBZ0lHWnZjaWhzWlhRZ2FTQTlJRzV2WkdVdVkyaHBiR1JPYjJSbGN5NXNaVzVuZEdnZ0xTQXhPeUJwSUQ0OUlEQTdJR2t0TFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElHbHVaR1Y0SUQwZ2RHaHBjeTVmWm14aGRGUnlaV1V1YVc1a1pYaFBaaWh1YjJSbExtTm9hV3hrVG05a1pYTmJhVjBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dsdVpHVjRJQ0U5UFNBdE1Ta2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgybDBaWEpoZEc5eUlEMGdhVzVrWlhnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1dlpHVXVZMmhwYkdST2IyUmxjMXRwWFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1MWJHdzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NISmxkbWx2ZFhOVGFXSnNhVzVuS0NrZ2UxeHVJQ0FnSUNBZ0lDQnNaWFFnYm05a1pTQTlJSFJvYVhNdVkzVnljbVZ1ZEU1dlpHVTdYRzRnSUNBZ0lDQWdJSGRvYVd4bEtDaHViMlJsSUQwZ2JtOWtaUzV3Y21WMmFXOTFjMU5wWW14cGJtY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnYVc1a1pYZ2dQU0IwYUdsekxsOW1iR0YwVkhKbFpTNXBibVJsZUU5bUtHNXZaR1VwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lvYVc1a1pYZ2dJVDA5SUMweEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmFYUmxjbUYwYjNJZ1BTQnBibVJsZUR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYm05a1pUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdibVY0ZEZOcFlteHBibWNvS1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0J1YjJSbElEMGdkR2hwY3k1amRYSnlaVzUwVG05a1pUdGNiaUFnSUNBZ0lDQWdkMmhwYkdVb0tHNXZaR1VnUFNCdWIyUmxMbTVsZUhSVGFXSnNhVzVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElHbHVaR1Y0SUQwZ2RHaHBjeTVmWm14aGRGUnlaV1V1YVc1a1pYaFBaaWh1YjJSbEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUtHbHVaR1Y0SUNFOVBTQXRNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMmwwWlhKaGRHOXlJRDBnYVc1a1pYZzdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHNXZaR1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ1ZFd4c08xeHVJQ0FnSUgxY2JpQWdJQ0JjYmlBZ0lDQnVaWGgwVG05a1pTZ3BJSHRjYmlBZ0lDQWdJQ0FnYVdZb2RHaHBjeTVmYVhSbGNtRjBiM0lnUFQwZ2RHaHBjeTVmWm14aGRGUnlaV1V1YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2JuVnNiRHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYVhSbGNtRjBiM0lyS3p0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVZM1Z5Y21WdWRFNXZaR1U3WEc0Z0lDQWdmVnh1SUNBZ0lGeHVJQ0FnSUhCeVpYWnBiM1Z6VG05a1pTZ3BJSHRjYmlBZ0lDQWdJQ0FnYVdZb2RHaHBjeTVmYVhSbGNtRjBiM0lnUFQwZ0xURXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNCMGFHbHpMbDlwZEdWeVlYUnZjaTB0TzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWpkWEp5Wlc1MFRtOWtaVHRjYmlBZ0lDQjlYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UxeHVJQ0FnSUZSeVpXVlhZV3hyWlhJNklGUnlaV1ZYWVd4clpYSXNYRzRnSUNBZ1RtOWtaVVpwYkhSbGNqb2dUbTlrWlVacGJIUmxjbHh1ZlRzaUxDSnRiMlIxYkdVdVpYaHdiM0owY3lBOUlGdGNiaUFnSUNBbllYSmxZU2NzWEc0Z0lDQWdKMkpoYzJVbkxGeHVJQ0FnSUNkaWNpY3NYRzRnSUNBZ0oyTnZiQ2NzWEc0Z0lDQWdKMk52YlcxaGJtUW5MRnh1SUNBZ0lDZGxiV0psWkNjc1hHNGdJQ0FnSjJoeUp5eGNiaUFnSUNBbmFXMW5KeXhjYmlBZ0lDQW5hVzV3ZFhRbkxGeHVJQ0FnSUNkclpYbG5aVzRuTEZ4dUlDQWdJQ2RzYVc1ckp5eGNiaUFnSUNBbmJXVnVkV2wwWlcwbkxGeHVJQ0FnSUNkdFpYUmhKeXhjYmlBZ0lDQW5jR0Z5WVcwbkxGeHVJQ0FnSUNkemIzVnlZMlVuTEZ4dUlDQWdJQ2QwY21GamF5Y3NYRzRnSUNBZ0ozZGljaWRjYmwwN0lsMTkifQ==
