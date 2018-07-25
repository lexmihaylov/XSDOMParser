const pseudoSelectorRegex = /([\w-]+)(?:\(([\w\W]+)\)|)/;

const PSelectorImpl = {
    'first-child': (node) => {
        let childList = node.parentNode.children;
        return (childList.indexOf(node) == 0);
    },
    
    'last-child': (node) => {
        let childList = node.parentNode.children;
        return (childList.indexOf(node) == childList.length - 1);
    },
    
    'nth-child': (node, index) => {
        index = parseInt(index);
        let childList = node.parentNode.children;
        return (childList.indexOf(node) == index - 1);
    },
    
    'not': (node, selector) => {
        return !node.matches(selector);
    },
    
    'empty': (node) => {
        return node.childNodes.length == 0;
    }
}

module.exports = (base = class {}) => {
    return class extends base {
        parsePseudoSelectorExression(pseudoSelector) {
            let match = pseudoSelectorRegex.exec(pseudoSelector);
            if (!match) throw new SyntaxError(`Unable to parse pseudoSelector '${pseudoSelector}'.`);
            
            let name = match[1];
            let params = match[2];
            
            if (!(name in PSelectorImpl)) throw SyntaxError(`Unsupported pseudo selector '${name}'`)
            return (node) => {
                return PSelectorImpl[name](node, params);
            }
        }
    }
}