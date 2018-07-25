const Element = require('./element.js');
const TreeWalker = require('./tree-walker.js').TreeWalker;

module.exports = class Document extends Element{
    constructor(contentType, docType) {
        super('#document', 9);
        this.contentType = contentType;
        this.doctype = docType;
        
        delete this.classList;
        delete this.attributes;
    }

    get innerHTML() {
        return undefined;
    }

    set innerHTML(val) {
        return undefined;
    }

    get outerHTML() {
        return undefined;
    }

    set outerHTML(val) {
        return undefined;
    }

    get documentElement() {
        return this.children[0] || null;
    }

    appendChild(childNode) {
        if(this.childNodes.length > 0) {
            throw new Error('Only one child node is allowed on document.');
        }

        super.appendChild(childNode);
    }

    createElement(tagName) {
        return new Element(tagName, 1);
    }

    createTextNode(content) {
        let tag =  new Element('#text', 3);
        tag.textContent = content;

        return tag;
    }
    
    createCDATASection(content) {
        let tag = new Element('cdata-section', 4);
        tag.textContent = content;
        
        return tag;
    }
    
    createComment(content) {
        let tag = new Element('#comment', 8);
        tag.textContent = content;
        
        return tag;
    }
    
    createTreeWalker(root, whatToShow, filter) {
        return new TreeWalker(root, whatToShow, filter);
    }
};