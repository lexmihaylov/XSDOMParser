const DOMParse = require('./src/dom-parse.js');

let _mode = 'moderate';
class XSDOMParser {
    static get NodeFilter() { return require('./src/tree-walker').NodeFilter; }
    static get mode() { return _mode; }
    static set mode(val) { _mode = val; }
    
    parseFromString(domString, contentType = 'text/html') {
        return DOMParse.parse(domString, contentType, _mode);
    }
}

if(global.window) {
    if (!global.window.DOMParser) {
        global.window.DOMParser = XSDOMParser;
        global.window.NodeFilter = XSDOMParser.NodeFilter;
    } else {
        global.window.XSDOMParser = XSDOMParser;
    }
} else {
    module.exports = XSDOMParser;
}
