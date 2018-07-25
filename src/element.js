const ClassList = require('./class-list.js');
const QuerySelectable = require('./query-selectable.js');
const voidElements = require("./void-elements.js");

const Document = () => {
    // use when demanded
    // to handle circular dependencies
    return require('./dom-parse');
};

const DocumentNode = () => {
    return require('./document.js');
};

module.exports = class Element extends QuerySelectable {
    /**
     *
     * @param {String} name
     * @param {Array<Object<String,String>>} attributes
     */
    constructor(name, type = 1, attributes = {}) {
        super();

        this.nodeType = type || 1;

        this.nodeName =
            this.tagName = name;

        this.attributes = attributes;
        this.childNodes = [];
        this.parentNode = null;
        this.classList = new ClassList();

        this.__populateClassList();
        this.classList.onChange = this.__updateClassAttr.bind(this);
    }

    __populateClassList() {
        this.classList.splice(0);

        if(Boolean(this.attributes.class)) {
            let cssClasses = this.attributes.class.split(/\s/);

            cssClasses.forEach((cssClass) => {
                this.classList.add(cssClass);
            });
        }
    }

    __updateClassAttr(classList) {
        this.attributes.class = classList.join(' ');
    }

    get parentElement() {
        return this.parentNode;
    }
    
    get ownerDocument() {
        let node = this;
        
        do {
            if(node instanceof DocumentNode()) {
                return node;
            }
        } while((node = node.parentNode));
        
        return null;
    }

    get children() {
        return this.childNodes.filter((node) => {
            return node.nodeType === 1;
        });
    }

    get outerHTML() {
        let html = '';
        if (this.nodeType == 3) {
            html += this.textContent;
        } else if(this.nodeType == 8) {
            html += `<!--${this.textContent}-->`;
        } else if(this.nodeType == 4) {
            html += `<![CDATA[${this.textContent}]]>`;
        } else {
            html += `<${this.tagName} `;
            for(let key in this.attributes) {
                if(this.attributes.hasOwnProperty(key)) {
                    html += key;

                    if(this.attributes[key]) {
                        html += `="${this.attributes[key]}"`;
                    }

                    html += ' ';
                }
            }

            html = html.replace(/\s+$/, '');
            if(voidElements.indexOf(this.tagName) == -1) {
                html += `>${this.innerHTML}</${this.tagName}>`;
            } else {
                html += ' />';
            }
        }

        return html;
    }

    set outerHTML(val) {
        if(this.parentNode) {
            let doc = Document().parse(`<root>${val}</root>`);
            let nodes = doc.documentElement.childNodes;
            this.parentNode.childNodes.splice(
                this.parentNode.childNodes.indexOf(this), 1, ...nodes);
            
            nodes.forEach((node) => {
                nodes.parentNode = this.parentNode;
            });
        }
    }

    set textContent(val) {
        if(this.nodeType == 3 || this.nodeType == 8 || this.nodeType == 4) {
            this._textContent = val;
        } else {
            let tag = new Element('#text', 3);
            tag.textContent = val;
            this.childNodes = [tag];
        }
    }

    get textContent() {
        if(this.nodeType == 3 || this.nodeType == 8 || this.nodeType == 4) {
            return this._textContent || '';
        } else {
            let text = '';
            this.__getTextNodes(this).forEach((node) => {
                text += node.textContent;
            });

            return text;
        }

    }

    get innerHTML() {
        let innerHtml = '';
        this.childNodes.forEach((node) => {
            innerHtml += node.outerHTML;
        });

        return innerHtml;
    }

    set innerHTML(val) {
        var doc = Document().parse(`<root>${val}</root>`);
        this.childNodes = [];

        doc.documentElement.childNodes.forEach((node) => {
            this.appendChild(node);
        });
    }
    
    get previousElementSibling() {
        let parent = this.parentElement;
        if(parent) {
            return parent.children[parent.children.indexOf(this) - 1] || null;
        }
        
        return null;
    }
    
    get previousSibling() {
        let parent = this.parentElement;
        if(parent) {
            return parent.childNodes[parent.childNodes.indexOf(this) - 1] || null;
        }
        
        return null;
    }
    
    get nextElementSibling() {
        let parent = this.parentElement;
        if(parent) {
            return parent.children[parent.children.indexOf(this) + 1] || null;
        }
        
        return null;
    }
    
    get nextSibling() {
        let parent = this.parentElement;
        if(parent) {
            return parent.childNodes[parent.childNodes.indexOf(this) + 1] || null;
        }
        
        return null;
    }
    
    get firstChild() {
        return this.childNodes[0] || null;
    }
    
    get firstElementChild() {
        return this.children[0] || null;
    }
    
    get lastChild() {
        let nodes = this.childNodes;
        return nodes[nodes.length - 1];
    }
    
    get lastElementChild() {
        let nodes = this.children;
        return nodes[nodes.length - 1];
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    removeAttribute(name) {
        delete this.attributes[name];

        if(name == 'class') {
            this.__populateClassList();
        }
    }

    setAttribute(name, value) {
        this.attributes[name] = value;

        if(name == 'class') this.__populateClassList();
    }

    hasAttribute(name) {
        return name in this.attributes;
    }

    __getTextNodes(context) {
        let textNodes = [];
        context.childNodes.forEach((node) => {
            if(node.nodeType == 3) {
                textNodes.push(node);
            } else {
                textNodes = textNodes.concat(this.__getTextNodes(node));
            }
        });

        return textNodes;
    }

    __searchDom(context, compareCallback, one = false, shallow = false) {
        let nodesFound = [];
        let length = context.children.length;
        for(var i = 0; i < length; i++) {
            let node = context.children[i];

            if(compareCallback(node)) {
                nodesFound.push(node);

                if(one) break;
            }

            if(!shallow && node.children.length > 0) {
                nodesFound = nodesFound.concat(this.__searchDom(node, compareCallback, one));

                if(one && nodesFound.length > 0) break;
            }
        }

        return nodesFound;
    }

    getElementById(id) {
        let node = null;
        let nodesFound = this.__searchDom(this, (node) => {
            return node.attributes.id == id;
        }, true);

        if(nodesFound.length > 0) {
            node = nodesFound[0];
        }

        return node;
    }

    getElementsByClassName(className) {
        let nodes = this.__searchDom(this, (node) => {
            return node.hasAttribute('class') && node.classList.contains(className);
        });

        return nodes;
    }

    getElementsByTagName(tagName) {
        let nodes = this.__searchDom(this, (node) => {
            return node.tagName == tagName;
        });

        return nodes;
    }

    __detachNodeIfAttached(node) {
        // use only with modification
        // methods
        if(node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }

    /**
     *
     * @param {Element} childNode
     */
    appendChild(childNode) {
        this.__detachNodeIfAttached(childNode);
        this.childNodes.push(childNode);
        childNode.parentNode = this;

        return childNode;
    }

    insertBefore(newNode, referenceNode) {
        this.__detachNodeIfAttached(newNode);
        this.childNodes.splice(
            this.childNodes.indexOf(referenceNode),
            0, newNode);
        
        newNode.parentNode = this;

        return newNode;
    }

    insertAfter(newNode, referenceNode) {
        this.__detachNodeIfAttached(newNode);
        this.childNodes.splice(
            this.childNodes.indexOf(referenceNode) + 1,
            0, newNode);
        
        newNode.parentNode = this;

        return newNode;
    }

    removeChild(childNode) {
        if(this.childNodes.indexOf(childNode) !== -1) {
            this.childNodes.splice(
                this.childNodes.indexOf(childNode), 1);

            childNode.parentNode = null;
        } else {
            throw Error('Node is not a child of this node');
        }

        return childNode;
    }
};